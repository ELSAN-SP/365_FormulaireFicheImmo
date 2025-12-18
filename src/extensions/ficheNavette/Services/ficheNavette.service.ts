
// Services/ficheNavette.service.ts
import { spfi, SPFI } from '@pnp/sp';
import { SPFx } from '@pnp/sp/presets/all';
import { Web } from '@pnp/sp/webs';
import * as dayjs from 'dayjs';

import type { IFormList, Lot } from '../Interfaces/IFormList';
import type {  IEstablishmentCode } from '../Interfaces/IEtablishmentCode';

export type FicheNavetteFieldsMap = {
  Title: string;
  Etablissement: string;
  Code_Etab: string;
  TypeDemande: string;
  ReferenceFiche: string;
  NomProjet: string;
  NiveauPriorite: string; // 1|2|3 as string
  ProjetPresenteN1: string;
  AnneeRealisation: string;
  ProjetPluriannuel: string;
  Description: string;

  MiseConformite: string;
  PrescriptionSecurite: string;
  PrescriptionControle: string;
  Vetuste: string;

  BusinessPlanPresente: string;
  CasDerogatoireBusinessPlan: string;
  DemandeARS: string;
  NonImputeCapex: string;

  BesoinBET: string; NomBET: string;
  BesoinBCT: string; NomBCT: string;
  BesoinCSSI: string; NomCSSI: string;
  BesoinArchitecte: string; NomArchitecte: string;
  BesoinCSPS: string; NomCSPS: string;

  EconomieEnergie: string; EstimationKWH: string;
  EligiblesCEE: string; MontantCEE: string;
  AutresSubventions: string; MontantAutresSubv: string;

  MateriauxGroupe: string;
  CasDerogatoireMateriaux: string;
  FournisseursReferences: string;

  CoutTravaux: string;
  HonorairesBET: string;
  HonorairesBCT: string;
  HonorairesCSSI: string;
  HonorairesArch: string;
  HonorairesCSPS: string;
  HonoraireAssurances: string;
  AutresFrais: string;
  BudgetTotal: string;

  BudgetConsomme2025: string;
  BudgetPrevisionnel2025: string;
  CapexConsomme2026: string;

  TravauxAllotis: string;
  NbLot: string;
  CasDerogatoireAllot: string;

  Consult3Ent: string;
  CasDerogatoireConsult3Ent: string;
  DevisNegocies: string;
  CasDerogatoireDevisNegocies: string;

  NomEntreprise1: string; MontantDevis1: string;
  NomEntreprise2: string; MontantDevis2: string;
  NomEntreprise3: string; MontantDevis3: string;

  NomEntrepriseProposee: string;
  MontantAvantNegociation: string;
  MontantApresNegociation: string;

  StatutFiche: string;

};

export interface FicheNavetteServiceOptions {
  listTitle: string;                       // liste principale des fichesNavette
  establishmentsListTitle?: string;        // liste référentiel établissements
  estFields?: { title: string; code: string }; // noms internes des colonnes du référentiel
  fieldsMap?: Partial<FicheNavetteFieldsMap>;  // override des noms internes si différents
  establishmentsWebUrl?: string; //Url liste Etab
}

export class FicheNavetteService {
  private sp: SPFI;

  constructor(private context: any, private opts: FicheNavetteServiceOptions) {
    this.sp = spfi().using(SPFx(context));
  }

  // ---------- Référentiel établissements ----------
  async getEstablishments(): Promise<IEstablishmentCode[]> {
    if (!this.opts.establishmentsListTitle) return [];
  
    const titleField = this.opts.estFields?.title ?? 'Title';
    const codeField  = this.opts.estFields?.code  ?? 'Code';
  
    // URL du site contenant la liste "Etablissements – Permissions"
    const permissionsSiteUrl = "https://elsancare.sharepoint.com/sites/Referentiels/Immo"; 
  
    const spWeb = spfi(Web(permissionsSiteUrl)).using(SPFx(this.context));
  
    try {
      // récupérer les codes autorisés depuis la liste "Etablissements – Permissions"
      const permittedItems = await spWeb.web.lists
        .getByTitle('Etablissements – Permissions')
        .items.select('Title')(); // ici Title = code autorisé
  
      const permittedCodes = (permittedItems ?? []).map((i: any) => i.Title);
  
      // récupérer tous les établissements depuis le site principal
      const spWebMain = this.opts.establishmentsWebUrl 
        ? spfi(Web(this.opts.establishmentsWebUrl)).using(SPFx(this.context)) 
        : this.sp;
  
      const allItems = await spWebMain.web.lists
        .getByTitle(this.opts.establishmentsListTitle!)
        .items.select('Id', titleField, codeField)
        .top(5000)
        .orderBy(titleField)();
  
      // filtrer uniquement ceux dont le code est dans la liste permissions
      return (allItems ?? [])
        .filter((it: any) => permittedCodes.includes(it[codeField]))
        .map((it: any, idx: number) => ({
          key: it.Id ?? idx,
          title: it[titleField],
          code: it[codeField],
        })) as IEstablishmentCode[];
  
    } catch (e: any) {
      throw new Error(`getAuthorizedEstablishments: ${e?.message ?? 'Erreur chargement établissements autorisés'}`);
    }
  }

  // ---------- Lecture item ----------
  async getItem(id: number): Promise<Partial<IFormList>> {
    console.log('service');

    const m = this.opts.fieldsMap ?? {};
    const getName = (k: keyof FicheNavetteFieldsMap) => (m[k] ?? k);

    const it: any = await this.sp.web.lists.getByTitle(this.opts.listTitle)
    .items.getById(id)();

    const val = (name: string) => (it as any)[name];

    const niveauStr = String(val(getName('NiveauPriorite')) ?? '');
    const niveauNum: 1|2|3|'' = niveauStr === '1' || niveauStr === '2' || niveauStr === '3'
      ? (parseInt(niveauStr, 10) as 1|2|3)
      : '';

       // Récupération des lots dynamiques
       const lots: Lot[] = [];
       for (let i = 1; i <= 20; i++) {
         const nomLot = val(`NomDuLot${i}`);
         const nomEntrepriseProposee = val(`NomEntrepriseProposeeLot${i}`);
         const montantAvantNegociation = val(`MontantAvantNegociationLot${i}`);
         const montantApresNegociation = val(`MontantApresNegociationLot${i}`);
       
         if (nomLot || nomEntrepriseProposee || montantAvantNegociation != null || montantApresNegociation != null) {
           lots.push({
             id: i.toString(), // conversion en string
             nomLot,
             nomEntrepriseProposee,
             montantAvantNegociation,
             montantApresNegociation
           });
         }
       }

    return {
      Title: val(getName('Title')),
      etablissement: val(getName('Etablissement')),
      codeEtab: val(getName('Code_Etab')),
      typeDeDemande: val(getName('TypeDemande')),
      referenceFiche: val(getName('ReferenceFiche')),
      nomDuProjet: val(getName('NomProjet')),
      niveauDePriorite: niveauNum,
      projetDejaPresenteEnN1: val(getName('ProjetPresenteN1')),
      anneeDeRealisationDuProjet: Number(val(getName('AnneeRealisation'))) || undefined,
      projetPluriannuel: val(getName('ProjetPluriannuel')),
      description: val(getName('Description')),

      miseEnConformite: val(getName('MiseConformite')),
      suitePrescriptionCommissionSecurite: val(getName('PrescriptionSecurite')),
      suitePrescriptionBureauControle: val(getName('PrescriptionControle')),
      suiteVetuste: val(getName('Vetuste')),

      businessPlanPresente: val(getName('BusinessPlanPresente')),
      casDerogatoireBusinessPlanRaison: val(getName('CasDerogatoireBusinessPlan')),
      demandeARS: val(getName('DemandeARS')),
      raisonNonImputationCAPEX: val(getName('NonImputeCapex')),

      besoinBET: val(getName('BesoinBET')),
      nomBET: val(getName('NomBET')),
      besoinBCT: val(getName('BesoinBCT')),
      nomBCT: val(getName('NomBCT')),
      besoinCSSI: val(getName('BesoinCSSI')),
      nomCSSI: val(getName('NomCSSI')),
      besoinArchitecte: val(getName('BesoinArchitecte')),
      nomArchitecte: val(getName('NomArchitecte')),
      besoinCSPS: val(getName('BesoinCSPS')),
      nomCSPS: val(getName('NomCSPS')),

      travauxGenerentEconomiesEnergie: val(getName('EconomieEnergie')),
      estimationEconomieKWH: val(getName('EstimationKWH')),
      eligiblesCEE: val(getName('EligiblesCEE')),
      montantEstimeCEE: Number(val(getName('MontantCEE'))) || undefined,
      autresSubventions: val(getName('AutresSubventions')),
      montantEstimeSubventions: Number(val(getName('MontantAutresSubv'))) || undefined,

      materiauxGroupe: val(getName('MateriauxGroupe')),
      casDerogatoireMateriaux: val(getName('CasDerogatoireMateriaux')),
      nomFournisseursReference: val(getName('FournisseursReferences')),

      coutTravaux: Number(val(getName('CoutTravaux'))) || undefined,
      honorairesMissionBET: Number(val(getName('HonorairesBET'))) || undefined,
      honorairesMissionBCT: Number(val(getName('HonorairesBCT'))) || undefined,
      honorairesMissionCSSI: Number(val(getName('HonorairesCSSI'))) || undefined,
      honorairesMissionArchitecte: Number(val(getName('HonorairesArch'))) || undefined,
      honorairesMissionCSPS: Number(val(getName('HonorairesCSPS'))) || undefined,
      honorairesAssurancesTRC_DO: Number(val(getName('HonoraireAssurances'))) || undefined,
      autres: Number(val(getName('AutresFrais'))) || undefined,
      budgetTotal: Number(val(getName('BudgetTotal'))) || undefined,

      budgetConsomme2025: Number(val(getName('BudgetConsomme2025'))) || undefined,
      budgetPrevisionnel2025: Number(val(getName('BudgetPrevisionnel2025'))) || undefined,
      capexConsomme2026: Number(val(getName('CapexConsomme2026'))) || undefined,

      travauxAllotis: val(getName('TravauxAllotis')),
      nombreDeLots: Number(val(getName('NbLot'))) || undefined,
      casDerogatoireAllotissement: val(getName('CasDerogatoireAllot')),

      consultation3Entreprises: val(getName('Consult3Ent')),
      casDerogatoireConsultation3Entreprises: val(getName('CasDerogatoireConsult3Ent')),
      devisNegocies: val(getName('DevisNegocies')),
      casDerogatoireDevisNonNegocies: val(getName('CasDerogatoireDevisNegocies')),

      nomEntreprise1: val(getName('NomEntreprise1')),
      montantDevis1: Number(val(getName('MontantDevis1'))) || undefined,
      nomEntreprise2: val(getName('NomEntreprise2')),
      montantDevis2: Number(val(getName('MontantDevis2'))) || undefined,
      nomEntreprise3: val(getName('NomEntreprise3')),
      montantDevis3: Number(val(getName('MontantDevis3'))) || undefined,

      nomEntrepriseProposee1: val(getName('NomEntrepriseProposee')),
      montantDevisAvantNegociation1: Number(val(getName('MontantAvantNegociation'))) || undefined,
      montantApresNegociation1: Number(val(getName('MontantApresNegociation'))) || undefined,

      StatutFiche: val(getName('StatutFiche')),
      lots
    };
  }

// ---------- Sauvegarde ----------
async save(form: Partial<IFormList>, itemId?: number): Promise<number> {
  const list = this.sp.web.lists.getByTitle(this.opts.listTitle);
  const m = this.opts.fieldsMap ?? {};

  const put = (k: keyof FicheNavetteFieldsMap, v: any) => ({ [m[k] ?? k]: v });

  //--- Normalisation des lots : supprime les lots vides et limite à 20
  const normalizeLots = (lots?: Lot[]): Lot[] => {
    if (!lots) return [];
    return lots
      .filter(l =>
        l.nomLot || l.nomEntrepriseProposee || l.montantAvantNegociation != null || l.montantApresNegociation != null
      )
      .slice(0, 20);
  };
  const normalizedLots = normalizeLots(form.lots);

  //--- Vider toutes les colonnes lots existantes pour éviter les "trous" lors de l'export Excel
  const clearLotFields = (): Record<string, any> => {
    const payload: Record<string, any> = {};
    for (let i = 1; i <= 20; i++) {
      payload[`NomDuLot${i}`] = '';
      payload[`NomEntrepriseProposeeLot${i}`] = '';
      payload[`MontantAvantNegociationLot${i}`] = null;
      payload[`MontantApresNegociationLot${i}`] = null;
    }
    return payload;
  };

  //--- Mapper les lots normalisés vers les colonnes SharePoint
  const mapLotsToFields = (lots: Lot[]): Record<string, any> => {
    const payload: Record<string, any> = {};
    lots.forEach((lot, index) => {
      const i = index + 1;
      payload[`NomDuLot${i}`] = lot.nomLot ?? '';
      payload[`NomEntrepriseProposeeLot${i}`] = lot.nomEntrepriseProposee ?? '';
      payload[`MontantAvantNegociationLot${i}`] = lot.montantAvantNegociation ?? null;
      payload[`MontantApresNegociationLot${i}`] = lot.montantApresNegociation ?? null;
    });
    payload['NbLot'] = lots.length || null;
    return payload;
  };

  //--- Construction du payload principal
  const payload = {
    ...put('Title', form.etablissement ?? ''),
    ...put('Etablissement', form.etablissement ?? ''),
    ...put('Code_Etab', form.codeEtab ?? ''),
    ...put('TypeDemande', form.typeDeDemande ?? ''),
    ...put('ReferenceFiche', form.referenceFiche ?? ''),
    ...put('NomProjet', form.nomDuProjet ?? ''),
    ...put('NiveauPriorite', form.niveauDePriorite ? String(form.niveauDePriorite) : ''),
    ...put('ProjetPresenteN1', form.projetDejaPresenteEnN1 ?? ''),
    ...put('AnneeRealisation', form.anneeDeRealisationDuProjet ?? null),
    ...put('ProjetPluriannuel', form.projetPluriannuel ?? ''),
    ...put('Description', form.description ?? ''),

    ...put('MiseConformite', form.miseEnConformite ?? ''),
    ...put('PrescriptionSecurite', form.suitePrescriptionCommissionSecurite ?? ''),
    ...put('PrescriptionControle', form.suitePrescriptionBureauControle ?? ''),
    ...put('Vetuste', form.suiteVetuste ?? ''),

    ...put('BusinessPlanPresente', form.businessPlanPresente ?? ''),
    ...put('CasDerogatoireBusinessPlan', form.casDerogatoireBusinessPlanRaison ?? ''),
    ...put('DemandeARS', form.demandeARS ?? ''),
    ...put('NonImputeCapex', form.raisonNonImputationCAPEX ?? ''),

    ...put('BesoinBET', form.besoinBET ?? ''), ...put('NomBET', form.nomBET ?? ''),
    ...put('BesoinBCT', form.besoinBCT ?? ''), ...put('NomBCT', form.nomBCT ?? ''),
    ...put('BesoinCSSI', form.besoinCSSI ?? ''), ...put('NomCSSI', form.nomCSSI ?? ''),
    ...put('BesoinArchitecte', form.besoinArchitecte ?? ''), ...put('NomArchitecte', form.nomArchitecte ?? ''),
    ...put('BesoinCSPS', form.besoinCSPS ?? ''), ...put('NomCSPS', form.nomCSPS ?? ''),

    ...put('EconomieEnergie', form.travauxGenerentEconomiesEnergie ?? ''),
    ...put('EstimationKWH', form.estimationEconomieKWH ?? ''),
    ...put('EligiblesCEE', form.eligiblesCEE ?? ''),
    ...put('MontantCEE', form.montantEstimeCEE ?? null),
    ...put('AutresSubventions', form.autresSubventions ?? ''),
    ...put('MontantAutresSubv', form.montantEstimeSubventions ?? null),

    ...put('MateriauxGroupe', form.materiauxGroupe ?? ''),
    ...put('CasDerogatoireMateriaux', form.casDerogatoireMateriaux ?? ''),
    ...put('FournisseursReferences', form.nomFournisseursReference ?? ''),

    ...put('CoutTravaux', form.coutTravaux ?? null),
    ...put('HonorairesBET', form.honorairesMissionBET ?? null),
    ...put('HonorairesBCT', form.honorairesMissionBCT ?? null),
    ...put('HonorairesCSSI', form.honorairesMissionCSSI ?? null),
    ...put('HonorairesArch', form.honorairesMissionArchitecte ?? null),
    ...put('HonorairesCSPS', form.honorairesMissionCSPS ?? null),
    ...put('HonoraireAssurances', form.honorairesAssurancesTRC_DO ?? null),
    ...put('AutresFrais', form.autres ?? null),
    ...put('BudgetTotal', form.budgetTotal ?? null),

    ...put('BudgetConsomme2025', form.budgetConsomme2025 ?? null),
    ...put('BudgetPrevisionnel2025', form.budgetPrevisionnel2025 ?? null),
    ...put('CapexConsomme2026', form.capexConsomme2026 ?? null),

    ...put('TravauxAllotis', form.travauxAllotis ?? ''),
    ...put('CasDerogatoireAllot', form.casDerogatoireAllotissement ?? ''),
    ...put('Consult3Ent', form.consultation3Entreprises ?? ''),
    ...put('CasDerogatoireConsult3Ent', form.casDerogatoireConsultation3Entreprises ?? ''),
    ...put('DevisNegocies', form.devisNegocies ?? ''),
    ...put('CasDerogatoireDevisNegocies', form.casDerogatoireDevisNonNegocies ?? ''),

    ...put('StatutFiche', form.StatutFiche ?? (form.IsCheck ? 'Soumise' : 'En cours')),

    //--- Ajout des lots normalisés dans le payload
    ...clearLotFields(),
    ...mapLotsToFields(normalizedLots)

  };

  //--- Création ou mise à jour
  if (!itemId) {
    //--- Création
    const list = this.sp.web.lists.getByTitle(this.opts.listTitle);
    const folderName = form.codeEtab ?? '';

    // Préparer le payload pour addValidateUpdateItemUsingPath
    const fieldsArray = Object.entries(payload).map(([key, value]) => ({
      FieldName: key,
      FieldValue: value != null ? String(value) : ''
    }));

    // Chemin complet vers le dossier
    const listPath = `/sites/Referentiels/Immo/Lists/Test/${folderName}`;

    // Créer l’item dans le dossier
    const addRes = await list.addValidateUpdateItemUsingPath(fieldsArray, listPath);
    const newId = Number(addRes.find(f => f.FieldName?.toLowerCase() === 'id' || f.FieldName === 'Id')?.FieldValue);

    //--- Mise à jour ReferenceFiche après création
    await list.items.getById(newId).update({
      [m.ReferenceFiche ?? 'ReferenceFiche']: `${form.codeEtab ?? ''}${form.anneeDeRealisationDuProjet ?? ''}${newId}`
    });
    return newId;
  } else {
    //--- Mise à jour
    await list.items.getById(itemId).update(payload);
    await list.items.getById(itemId).update({
      [m.ReferenceFiche ?? 'ReferenceFiche']: `${form.codeEtab ?? ''}${form.anneeDeRealisationDuProjet ?? ''}${itemId}`
    });
    return itemId;
  }
}

  // ---------- Pièces jointes ----------
  async getAttachments(itemId: number) {
    return await this.sp.web.lists.getByTitle(this.opts.listTitle)
      .items.getById(itemId)
      .attachmentFiles();
  }

  async addAttachments(itemId: number, files: { name: string; arrayBuffer: ArrayBuffer }[]) {
    const af = this.sp.web.lists.getByTitle(this.opts.listTitle)
      .items.getById(itemId).attachmentFiles;
    for (const f of files) {
      await af.add(f.name, f.arrayBuffer);
    }
  }

  async deleteAttachment(itemId: number, name: string) {
    await this.sp.web.lists.getByTitle(this.opts.listTitle)
      .items.getById(itemId)
      .attachmentFiles.getByName(name)
      .delete();
  }
}