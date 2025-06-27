import * as React from 'react';
import { DisplayMode, FormDisplayMode } from '@microsoft/sp-core-library';
// import { FormCustomizerContext } from '@microsoft/sp-listview-extensibility';
import { IItem } from "@pnp/sp/items";
import { spfi } from "@pnp/sp";
import { SPFx, Web } from "@pnp/sp/presets/all";
import { Container, Stack, Typography, TextField, IconButton, Autocomplete, Button, Box, CircularProgress, InputAdornment, FormHelperText,Checkbox,FormControlLabel } from '@mui/material';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import DeleteIcon from '@mui/icons-material/Delete'
import * as dayjs from 'dayjs';
import 'dayjs/locale/fr';
import { toNumber } from 'lodash';
import { FilePicker, IFilePickerResult } from '@pnp/spfx-controls-react/lib/FilePicker';
import { IAttachmentInfo } from '@pnp/sp/attachments';
import { FormCustomizerContext } from '@microsoft/sp-listview-extensibility';
import { IEstablishmentCode } from '../Interfaces/IEtablishmentCode'
import { IFormList } from '../Interfaces/IFormList'
import { IErrors } from '../Interfaces/IErrors';

export interface IFicheNavetteProps {
  context: any;
  displayMode: FormDisplayMode;
  onSave: () => void;
  onClose: () => void;
}

export const FicheNavette: React.FunctionComponent<IFicheNavetteProps> = (props: React.PropsWithChildren<IFicheNavetteProps>) => {

  dayjs.locale('fr')
  // context
  const spi = spfi().using(SPFx(props.context))
  // modiiier le l'id de la liste à metrre à jour 
  const MainList = "%7B36580c13-a1a8-4412-b6cf-09f02e53cae4%7D"
  const SecondList = "%7B27e4014b-a77f-4c81-8a47-9709fd1cdf50%7D"
  // pour les piéces jointes
  const [files, setFiles] = React.useState<IFilePickerResult[] | null>(null)
  const [displayFiles, setDisplayFiles] = React.useState<IAttachmentInfo[]>([]);
  const [EtablishmentList, setEtablishmentList] = React.useState<IEstablishmentCode[]>([]);
  const [Loading, setLoading] = React.useState<boolean>(false)
  // State pour les erreurs
  const [Errors,SetErrors] = React.useState<IErrors>({
    etablissement:'',
    typeDeDemande: '',
    nomDuProjet: '',
    niveauDePriorite: '',
    projetDejaPresenteEnN1: '',
    anneeDeRealisationDuProjet: '',
    projetPluriannuel: ''
  })
  // State pour le formulaire
  const [Form, setForm] = React.useState<IFormList>({
    date: dayjs(),
    etablissement: "",
    typeDeDemande: "",
    referenceFiche: "",
    nomDuProjet: "",
    niveauDePriorite: "",
    projetDejaPresenteEnN1: undefined,
    anneeDeRealisationDuProjet: undefined,
    projetPluriannuel: undefined,
    description: "",
    miseEnConformite: undefined,
    suitePrescriptionCommissionSecurite: undefined,
    suitePrescriptionBureauControle: undefined,
    suiteVetuste: undefined,
    businessPlanPresente: undefined,
    casDerogatoireBusinessPlanRaison: "",
    demandeARS: undefined,
    raisonNonImputationCAPEX: "",
    besoinBET: undefined,
    nomBET: "",
    besoinBCT: undefined,
    nomBCT: "",
    besoinCSSI: undefined,
    nomCSSI: "",
    besoinArchitecte: undefined,
    nomArchitecte: "",
    besoinCSPS: undefined,
    nomCSPS: "",
    travauxGenerentEconomiesEnergie: undefined,
    estimationEconomieKWH: "",
    eligiblesCEE: undefined,
    montantEstimeCEE: undefined,
    autresSubventions: undefined,
    montantEstimeSubventions: undefined,
    materiauxGroupe: undefined,
    casDerogatoireMateriaux: "",
    nomFournisseursReference: "",
    coutTravaux: undefined,
    honorairesMissionBET: undefined,
    honorairesMissionBCT: undefined,
    honorairesMissionCSSI: undefined,
    honorairesMissionArchitecte: undefined,
    honorairesMissionCSPS: undefined,
    honorairesAssurancesTRC_DO: undefined,
    autres: undefined,
    budgetTotal: undefined,
    budgetConsomme2025: undefined,
    budgetPrevisionnel2025: undefined,
    capexConsomme2026: undefined,
    travauxAllotis: undefined,
    nombreDeLots: undefined,
    casDerogatoireAllotissement: "",
    consultation3Entreprises: undefined,
    casDerogatoireConsultation3Entreprises: "",
    devisNegocies: undefined,
    casDerogatoireDevisNonNegocies: "",
    nomEntreprise1: "",
    montantDevis1: undefined,
    nomEntreprise2: "",
    montantDevis2: undefined,
    nomEntreprise3: "",
    montantDevis3: undefined,
    nomEntrepriseProposee1: "",
    montantDevisAvantNegociation1: undefined,
    montantApresNegociation1: undefined,
    nomEntrepriseProposeeLot1: "",
    montantDevisAvantNegociationLot1: undefined,
    montantApresNegociationLot1: undefined,
    nomEntrepriseProposeeLot2: "",
    montantDevisAvantNegociationLot2: undefined,
    montantApresNegociationLot2: undefined,
    nomEntrepriseProposeeLot3: "",
    montantDevisAvantNegociationLot3: undefined,
    montantApresNegociationLot3: undefined,
    nomLot1: "",
    nomLot2: "",
    nomLot3: "",
    codeEtab: "",
    modifie: undefined,
    cree: undefined,
    creePar: "",
    modifiePar: "",
    StatutFiche : undefined,
    IsCheck : false
  });

  // champs obligatoire
  const MandatoryProjetImmo : (keyof IErrors)[] = [
    'etablissement',
    'typeDeDemande',
    'nomDuProjet',
    'niveauDePriorite',
    'projetDejaPresenteEnN1',
    'anneeDeRealisationDuProjet',
    'projetPluriannuel'
  ]
  const MandatoryInstallationTech : (keyof IErrors)[] = [
    'etablissement',
    'typeDeDemande',
    'nomDuProjet',
    'niveauDePriorite',
    'projetDejaPresenteEnN1',
    'anneeDeRealisationDuProjet',
    'projetPluriannuel'
  ]

  // Fonction qui permet de récupérer le nom et le code de l'établissement
  const _retrieveList = async (): Promise<void> => {
    const web = Web('https://elsancare.sharepoint.com/sites/Referentiels/');
    const sp = spfi(web).using(SPFx(props.context));

    try {
      const itemsRaw = await sp.web.lists
        .getByTitle("Etablissements")
        .items.select("Title", "Code", "Id")
        .top(5000)
        .orderBy("Title")();

      const items: IEstablishmentCode[] = itemsRaw.map((item) => ({
        key: item.Id,
        title: item.Title,
        code: item.Code,
      }));

      setEtablishmentList(items);
    } catch (e) {
      console.error("Erreur lors de la récupération des établissements :", e);
    }
  };

  // Récupérer les piéces jointes 
  const getAttachmentFiles = async (): Promise<void> => {
    try {
      const attachment: IAttachmentInfo[] = await spi.web.lists.getById(MainList).items.getById(props.context.itemId).attachmentFiles();
      if (attachment) {
        setDisplayFiles(attachment)
      }
    } catch (e) {
      console.log(e)
    }

  }

  // Supprimer une piéce jointes
  const recycleAttachment = async (name: string): Promise<void> => {
    try {
      if (props.context.itemId) {
        const item = spi.web.lists.getById(MainList).items.getById(props.context.itemId);
        await item.attachmentFiles.getByName(name).delete();
      }
    } catch (e) {
      console.log(e);
    }
  }

  // Supprimer les pj (nouvelle éléments)
  const DeletePj = (name: string) : void => {
    const newFiles: IFilePickerResult[] = (files || []).filter(file => file.fileName !== name);
    setFiles(newFiles);
  };

  // fonction pour vérifier le type 
  function isNotEmpty(value: any): boolean {
    if (value === null || value === undefined) return false;
  
    if (typeof value === 'string') {
      return value.trim().length > 0;
    }
  
    if (Array.isArray(value)) {
      return value.length > 0;
    }
  
    if (typeof value === 'object') {
      return Object.keys(value).length > 0;
    }
  
    return true;
  }

  // Fonction pour valider les champs obligatoire
  const Validate = (): boolean => {
    const newErrors: Partial<IErrors> = {};
  
    switch (Form.typeDeDemande) {
      case 'Installations Techniques':
        MandatoryInstallationTech.forEach(field => {
          if (!isNotEmpty(Form[field])) {
            newErrors[field] = 'Veuillez remplir le champ';
          }
        });
        break;
  
      case 'Projets Immobiliers':
        MandatoryProjetImmo.forEach(field => {
          if (!isNotEmpty(Form[field])) {
            newErrors[field] = 'Veuillez remplir le champ';
          }
        });
        break;
  
      default:
        newErrors.typeDeDemande = 'Veuillez sélectionner le type de votre demande';
        break;
    }
  
    SetErrors(newErrors as IErrors); 
  
    return Object.keys(newErrors).length === 0;
  };

  // Fonction d'envoi du formulaire 
  const handleSubmit = async (
    context: FormCustomizerContext,
    data: IFormList,
    files: IFilePickerResult[] | null,
    listId: string,
    displayMode?: number,
    itemId?: number,
    setLoading?: (loading: boolean) => void
  ): Promise<any> => {
    try {
      if (setLoading) setLoading(true);
      // Nouvelle entrée dans la liste
      if (displayMode === 8) {
        const object = {
          Title: data.etablissement?.trim().split('-')[1] ?? "",
          TypeDemande: data.typeDeDemande ?? "",
          ReferenceFiche: data.referenceFiche ?? "",
          NomProjet: data.nomDuProjet ?? "",
          NiveauPriorite: data.niveauDePriorite !== undefined && data.niveauDePriorite !== "" ? String(data.niveauDePriorite) : "",
          ProjetPresenteN1: data.projetDejaPresenteEnN1 ?? "",
          AnneeRealisation: data.anneeDeRealisationDuProjet ?? null,
          ProjetPluriannuel: data.projetPluriannuel ?? "",
          Description: data.description ?? "",
          MiseConformite: data.miseEnConformite ?? "",
          PrescriptionSecurite: data.suitePrescriptionCommissionSecurite ?? "",
          PrescriptionControle: data.suitePrescriptionBureauControle ?? "",
          Vetuste: data.suiteVetuste ?? "",
          BusinessPlanPresente: data.businessPlanPresente ?? "",
          CasDerogatoireBusinessPlan: data.casDerogatoireBusinessPlanRaison ?? "",
          DemandeARS: data.demandeARS ?? "",
          NonImputeCapex: data.raisonNonImputationCAPEX ?? "",
          BesoinBET: data.besoinBET ?? "",
          NomBET: data.nomBET ?? "",
          BesoinBCT: data.besoinBCT ?? "",
          NomBCT: data.nomBCT ?? "",
          BesoinCSSI: data.besoinCSSI ?? "",
          NomCSSI: data.nomCSSI ?? "",
          BesoinArchitecte: data.besoinArchitecte ?? "",
          NomArchitecte: data.nomArchitecte ?? "",
          BesoinCSPS: data.besoinCSPS ?? "",
          NomCSPS: data.nomCSPS ?? "",
          EconomieEnergie: data.travauxGenerentEconomiesEnergie ?? "",
          EstimationKWH: data.estimationEconomieKWH ?? "",
          EligiblesCEE: data.eligiblesCEE ?? "",
          MontantCEE: data.montantEstimeCEE ?? null,
          AutresSubventions: data.autresSubventions ?? "",
          MontantAutresSubv: data.montantEstimeSubventions ?? null,
          MateriauxGroupe: data.materiauxGroupe ?? "",
          CasDerogatoireMateriaux: data.casDerogatoireMateriaux ?? "",
          FournisseursReferences: data.nomFournisseursReference ?? "",
          CoutTravaux: data.coutTravaux ?? null,
          HonorairesBET: data.honorairesMissionBET ?? null,
          HonorairesBCT: data.honorairesMissionBCT ?? null,
          HonorairesCSSI: data.honorairesMissionCSSI ?? null,
          HonorairesArch: data.honorairesMissionArchitecte ?? null,
          HonorairesCSPS: data.honorairesMissionCSPS ?? null,
          HonoraireAssurances: data.honorairesAssurancesTRC_DO ?? null,
          AutresFrais: data.autres ?? null,
          BudgetTotal: data.budgetTotal ?? null,
          BudgetConsomme2025: data.budgetConsomme2025 ?? null,
          BudgetPrevisionnel2025: data.budgetPrevisionnel2025 ?? null,
          CapexConsomme2026: data.capexConsomme2026 ?? null,
          TravauxAllotis: data.travauxAllotis ?? "",
          NbLot: data.nombreDeLots ?? null,
          CasDerogatoireAllot: data.casDerogatoireAllotissement ?? "",
          Consult3Ent: data.consultation3Entreprises ?? "",
          CasDerogatoireConsult3Ent: data.casDerogatoireConsultation3Entreprises ?? "",
          DevisNegocies: data.devisNegocies ?? "",
          CasDerogatoireDevisNegocies: data.casDerogatoireDevisNonNegocies ?? "",
          NomEntreprise1: data.nomEntreprise1 ?? "",
          MontantDevis1: data.montantDevis1 ?? null,
          NomEntreprise2: data.nomEntreprise2 ?? "",
          MontantDevis2: data.montantDevis2 ?? null,
          NomEntreprise3: data.nomEntreprise3 ?? "",
          MontantDevis3: data.montantDevis3 ?? null,
          NomEntrepriseProposee: data.nomEntrepriseProposee1 ?? "",
          MontantAvantNegociation: data.montantDevisAvantNegociation1 ?? null,
          MontantApresNegociation: data.montantApresNegociation1 ?? null,
          NomEntreprise1Lot1: data.nomEntreprise1 ?? "",
          MontantDevis1Lot1: data.montantDevis1 ?? null,
          NomEntreprise2Lot1: data.nomEntreprise2 ?? "",
          MontantDevis2Lot1: data.montantDevis2 ?? null,
          NomEntreprise3Lot1: data.nomEntreprise3 ?? "",
          MontantDevis3Lot1: data.montantDevis3 ?? null,
          NomEntrepriseProposeeLot1: data.nomEntrepriseProposeeLot1 ?? "",
          MontantAvantNegociationLot1: data.montantDevisAvantNegociationLot1 ?? null,
          MontantApresNegociationLot1: data.montantApresNegociationLot1 ?? null,
          NomEntrepriseProposeeLot2: data.nomEntrepriseProposeeLot2 ?? "",
          MontantAvantNegociationLot2: data.montantDevisAvantNegociationLot2 ?? null,
          MontantApresNegociationLot2: data.montantApresNegociationLot2 ?? null,
          NomEntrepriseProposeeLot3: data.nomEntrepriseProposeeLot3 ?? "",
          MontantAvantNegociationLot3: data.montantDevisAvantNegociationLot3 ?? null,
          MontantApresNegociationLot3: data.montantApresNegociationLot3 ?? null,
          NomDuLot1: data.nomLot1 ?? "",
          NomDuLot2: data.nomLot2 ?? "",
          NomDuLot3: data.nomLot3 ?? "",
          Code_Etab: data.codeEtab ?? "",
          StatutFiche : (data.IsCheck) ? "Soumise" : "En cours"
        }

        // console.log(JSON.stringify(object, null, 2),object.Code_Etab)
        const ItemToAdd = await spi.web.lists.getById(MainList).items.add(object)

        // On récupére l'id de l'élement
        const itemAddedId = ItemToAdd.data?.Id || ItemToAdd.Id;
        // console.log(itemAddedId)
        const item: IItem = spi.web.lists.getById(MainList).items.getById(itemAddedId);

        // On récupère l'id de l'etab
        const etab = EtablishmentList.find(etab => etab.title === object.Title)
        const etabId = etab?.key

        // On update dans le champ référence fiche
        const ItemUpdate = await item.update({
          ReferenceFiche: `${object.Code_Etab}/${object.AnneeRealisation}/${itemAddedId}`
        })

        if (files && files.length > 0) {
          for (const file of Array.from(files)) {
            const fileContent = await file.downloadFileContent();
            const arrayBuffer = await fileContent?.arrayBuffer();
            await item.attachmentFiles.add(file.fileName, arrayBuffer as ArrayBuffer);
          }
        }

        // modiiier le l'id de la deuxiéme liste à metrre à jour ici 
        const AddToFollowingTable = await spi.web.lists.getById(SecondList).items.add({
          testId: itemAddedId,
          CDS_EtablissementsId: etabId,
          StatutFiche : object.StatutFiche
        })

        return ItemToAdd

      } else if (itemId) {
        const object = {
          Title: data.etablissement?.trim().split('-')[1] ?? "",
          TypeDemande: data.typeDeDemande ?? "",
          ReferenceFiche: data.referenceFiche ?? "",
          NomProjet: data.nomDuProjet ?? "",
          NiveauPriorite: data.niveauDePriorite !== undefined && data.niveauDePriorite !== "" ? String(data.niveauDePriorite) : "",
          ProjetPresenteN1: data.projetDejaPresenteEnN1 ?? "",
          AnneeRealisation: data.anneeDeRealisationDuProjet ?? null,
          ProjetPluriannuel: data.projetPluriannuel ?? "",
          Description: data.description ?? "",
          MiseConformite: data.miseEnConformite ?? "",
          PrescriptionSecurite: data.suitePrescriptionCommissionSecurite ?? "",
          PrescriptionControle: data.suitePrescriptionBureauControle ?? "",
          Vetuste: data.suiteVetuste ?? "",
          BusinessPlanPresente: data.businessPlanPresente ?? "",
          CasDerogatoireBusinessPlan: data.casDerogatoireBusinessPlanRaison ?? "",
          DemandeARS: data.demandeARS ?? "",
          NonImputeCapex: data.raisonNonImputationCAPEX ?? "",
          BesoinBET: data.besoinBET ?? "",
          NomBET: data.nomBET ?? "",
          BesoinBCT: data.besoinBCT ?? "",
          NomBCT: data.nomBCT ?? "",
          BesoinCSSI: data.besoinCSSI ?? "",
          NomCSSI: data.nomCSSI ?? "",
          BesoinArchitecte: data.besoinArchitecte ?? "",
          NomArchitecte: data.nomArchitecte ?? "",
          BesoinCSPS: data.besoinCSPS ?? "",
          NomCSPS: data.nomCSPS ?? "",
          EconomieEnergie: data.travauxGenerentEconomiesEnergie ?? "",
          EstimationKWH: data.estimationEconomieKWH ?? "",
          EligiblesCEE: data.eligiblesCEE ?? "",
          MontantCEE: data.montantEstimeCEE ?? null,
          AutresSubventions: data.autresSubventions ?? "",
          MontantAutresSubv: data.montantEstimeSubventions ?? null,
          MateriauxGroupe: data.materiauxGroupe ?? "",
          CasDerogatoireMateriaux: data.casDerogatoireMateriaux ?? "",
          FournisseursReferences: data.nomFournisseursReference ?? "",
          CoutTravaux: data.coutTravaux ?? null,
          HonorairesBET: data.honorairesMissionBET ?? null,
          HonorairesBCT: data.honorairesMissionBCT ?? null,
          HonorairesCSSI: data.honorairesMissionCSSI ?? null,
          HonorairesArch: data.honorairesMissionArchitecte ?? null,
          HonorairesCSPS: data.honorairesMissionCSPS ?? null,
          HonoraireAssurances: data.honorairesAssurancesTRC_DO ?? null,
          AutresFrais: data.autres ?? null,
          BudgetTotal: data.budgetTotal ?? null,
          BudgetConsomme2025: data.budgetConsomme2025 ?? null,
          BudgetPrevisionnel2025: data.budgetPrevisionnel2025 ?? null,
          CapexConsomme2026: data.capexConsomme2026 ?? null,
          TravauxAllotis: data.travauxAllotis ?? "",
          NbLot: data.nombreDeLots ?? null,
          CasDerogatoireAllot: data.casDerogatoireAllotissement ?? "",
          Consult3Ent: data.consultation3Entreprises ?? "",
          CasDerogatoireConsult3Ent: data.casDerogatoireConsultation3Entreprises ?? "",
          DevisNegocies: data.devisNegocies ?? "",
          CasDerogatoireDevisNegocies: data.casDerogatoireDevisNonNegocies ?? "",
          NomEntreprise1: data.nomEntreprise1 ?? "",
          MontantDevis1: data.montantDevis1 ?? null,
          NomEntreprise2: data.nomEntreprise2 ?? "",
          MontantDevis2: data.montantDevis2 ?? null,
          NomEntreprise3: data.nomEntreprise3 ?? "",
          MontantDevis3: data.montantDevis3 ?? null,
          NomEntrepriseProposee: data.nomEntrepriseProposee1 ?? "",
          MontantAvantNegociation: data.montantDevisAvantNegociation1 ?? null,
          MontantApresNegociation: data.montantApresNegociation1 ?? null,
          NomEntreprise1Lot1: data.nomEntreprise1 ?? "",
          MontantDevis1Lot1: data.montantDevis1 ?? null,
          NomEntreprise2Lot1: data.nomEntreprise2 ?? "",
          MontantDevis2Lot1: data.montantDevis2 ?? null,
          NomEntreprise3Lot1: data.nomEntreprise3 ?? "",
          MontantDevis3Lot1: data.montantDevis3 ?? null,
          NomEntrepriseProposeeLot1: data.nomEntrepriseProposeeLot1 ?? "",
          MontantAvantNegociationLot1: data.montantDevisAvantNegociationLot1 ?? null,
          MontantApresNegociationLot1: data.montantApresNegociationLot1 ?? null,
          NomEntrepriseProposeeLot2: data.nomEntrepriseProposeeLot2 ?? "",
          MontantAvantNegociationLot2: data.montantDevisAvantNegociationLot2 ?? null,
          MontantApresNegociationLot2: data.montantApresNegociationLot2 ?? null,
          NomEntrepriseProposeeLot3: data.nomEntrepriseProposeeLot3 ?? "",
          MontantAvantNegociationLot3: data.montantDevisAvantNegociationLot3 ?? null,
          MontantApresNegociationLot3: data.montantApresNegociationLot3 ?? null,
          NomDuLot1: data.nomLot1 ?? "",
          NomDuLot2: data.nomLot2 ?? "",
          NomDuLot3: data.nomLot3 ?? "",
          Code_Etab: data.codeEtab ?? "",
          StatutFiche : (data.IsCheck) ? "Soumise" : "En cours"
        }

        const item: IItem = spi.web.lists.getById(MainList).items.getById(itemId);

        const ItemUpdated = await item.update(object)

        // On update dans le champ référence fiche
        await item.update({
          ReferenceFiche: `${object.Code_Etab}/${object.AnneeRealisation}/${itemId}`
        })

        if (files && files.length > 0) {
          for (const file of Array.from(files)) {
            const fileContent = await file.downloadFileContent();
            const arrayBuffer = await fileContent?.arrayBuffer();
            await item.attachmentFiles.add(file.fileName, arrayBuffer as ArrayBuffer);
          }
        }

        // modiiier le statue de l'item dans la deuxiéme liste
        const AddToFollowingTable = await spi.web.lists.getById(SecondList).items.add({
          StatutFiche : object.StatutFiche
        })

        return ItemUpdated
      }

    } catch (e) {
      console.log(e)
    } finally {
      if (setLoading) setLoading(false);
    }
  }

  // fonction de submit
  const submit = async (): Promise<any> => {
    if(Validate()){
      try {
        const saveForm = await handleSubmit(props.context, Form, files, MainList, props.displayMode, props.context.itemId)
        if (saveForm) {
          props.onClose()
        }
      } catch (e) {
        console.log(e)
      }
    }
  }

  // Au chargement du composant
  React.useEffect(() => {
    setLoading(true)
    // On récupére les établissement
    _retrieveList().catch((err) => {
      console.error("Erreur dans useEffect :", err);
    });

    // Champ BudgetTotal
    let total = 0;
    const safe = (n: number | undefined): number => n ?? 0;

    if (Form.typeDeDemande === 'Projets Immobiliers') {
      total =
        safe(Form.coutTravaux) +
        safe(Form.honorairesMissionArchitecte) +
        safe(Form.honorairesMissionBET) +
        safe(Form.honorairesMissionBCT) +
        safe(Form.honorairesMissionCSPS) +
        safe(Form.honorairesMissionCSSI) +
        safe(Form.honorairesAssurancesTRC_DO) +
        safe(Form.autres);
    } else if (Form.typeDeDemande === 'Installations Techniques') {
      total =
        safe(Form.coutTravaux) +
        safe(Form.honorairesMissionBET) +
        safe(Form.honorairesMissionBCT) +
        safe(Form.honorairesMissionCSSI) +
        safe(Form.autres);
    }

    setForm((prev) => ({
      ...prev,
      budgetTotal: total,
    }));

    // Récupérer une fiche si on est en modif
    if (props.displayMode === 4 || props.displayMode === 6) {
      const handleLoad = async (): Promise<void> => {
        try {

          const item: any = await spi.web.lists.getById(MainList).items.getById(props.context.itemId)();
          if (item) {
            setForm(
              {
                date: item.Modified ? dayjs(item.Modified) : dayjs(),
                etablissement: item.Title || "",
                typeDeDemande: item.TypeDemande || "",
                referenceFiche: item.ReferenceFiche || "",
                nomDuProjet: item.NomProjet || "",
                niveauDePriorite: item.NiveauPriorite || "",
                projetDejaPresenteEnN1: item.ProjetPresenteN1 ?? undefined,
                anneeDeRealisationDuProjet: item.AnneeRealisation ?? undefined,
                projetPluriannuel: item.ProjetPluriannuel ?? undefined,
                description: item.Description || "",
                miseEnConformite: item.MiseConformite ?? undefined,
                suitePrescriptionCommissionSecurite: item.PrescriptionSecurite ?? undefined,
                suitePrescriptionBureauControle: item.PrescriptionControle ?? undefined,
                suiteVetuste: item.Vetuste ?? undefined,
                businessPlanPresente: item.BusinessPlanPresente ?? undefined,
                casDerogatoireBusinessPlanRaison: item.CasDerogatoireBusinessPlan || "",
                demandeARS: item.DemandeARS ?? undefined,
                raisonNonImputationCAPEX: item.NonImputeCapex || "",
                besoinBET: item.BesoinBET ?? undefined,
                nomBET: item.NomBET || "",
                besoinBCT: item.BesoinBCT ?? undefined,
                nomBCT: item.NomBCT || "",
                besoinCSSI: item.BesoinCSSI ?? undefined,
                nomCSSI: item.NomCSSI || "",
                besoinArchitecte: item.BesoinArchitecte ?? undefined,
                nomArchitecte: item.NomArchitecte || "",
                besoinCSPS: item.BesoinCSPS ?? undefined,
                nomCSPS: item.NomCSPS || "",
                travauxGenerentEconomiesEnergie: item.EconomieEnergie ?? undefined,
                estimationEconomieKWH: item.EstimationKWH || "",
                eligiblesCEE: item.EligiblesCEE ?? undefined,
                montantEstimeCEE: item.MontantCEE ?? undefined,
                autresSubventions: item.AutresSubventions ?? undefined,
                montantEstimeSubventions: item.MontantAutresSubv ?? undefined,
                materiauxGroupe: item.MateriauxGroupe ?? undefined,
                casDerogatoireMateriaux: item.CasDerogatoireMateriaux || "",
                nomFournisseursReference: item.FournisseursReferences || "",
                coutTravaux: item.CoutTravaux ?? undefined,
                honorairesMissionBET: item.HonorairesBET ?? undefined,
                honorairesMissionBCT: item.HonorairesBCT ?? undefined,
                honorairesMissionCSSI: item.HonorairesCSSI ?? undefined,
                honorairesMissionArchitecte: item.HonorairesArch ?? undefined,
                honorairesMissionCSPS: item.HonorairesCSPS ?? undefined,
                honorairesAssurancesTRC_DO: item.HonoraireAssurances ?? undefined,
                autres: item.AutresFrais ?? undefined,
                budgetTotal: item.BudgetTotal ?? undefined,
                budgetConsomme2025: item.BudgetConsomme2025 ?? undefined,
                budgetPrevisionnel2025: item.BudgetPrevisionnel2025 ?? undefined,
                capexConsomme2026: item.CapexConsomme2026 ?? undefined,
                travauxAllotis: item.TravauxAllotis ?? undefined,
                nombreDeLots: item.NbLot ?? undefined,
                casDerogatoireAllotissement: item.CasDerogatoireAllot || "",
                consultation3Entreprises: item.Consult3Ent ?? undefined,
                casDerogatoireConsultation3Entreprises: item.CasDerogatoireConsult3Ent || "",
                devisNegocies: item.DevisNegocies ?? undefined,
                casDerogatoireDevisNonNegocies: item.CasDerogatoireDevisNegocies || "",
                nomEntreprise1: item.NomEntreprise1 || "",
                montantDevis1: item.MontantDevis1 ?? undefined,
                nomEntreprise2: item.NomEntreprise2 || "",
                montantDevis2: item.MontantDevis2 ?? undefined,
                nomEntreprise3: item.NomEntreprise3 || "",
                montantDevis3: item.MontantDevis3 ?? undefined,
                nomEntrepriseProposee1: item.NomEntrepriseProposee || "",
                montantDevisAvantNegociation1: item.MontantAvantNegociation ?? undefined,
                montantApresNegociation1: item.MontantApresNegociation ?? undefined,
                nomEntrepriseProposeeLot1: item.NomEntrepriseProposeeLot1 || "",
                montantDevisAvantNegociationLot1: item.MontantAvantNegociationLot1 ?? undefined,
                montantApresNegociationLot1: item.MontantApresNegociationLot1 ?? undefined,
                nomEntrepriseProposeeLot2: item.NomEntrepriseProposeeLot2 || "",
                montantDevisAvantNegociationLot2: item.MontantAvantNegociationLot2 ?? undefined,
                montantApresNegociationLot2: item.MontantApresNegociationLot2 ?? undefined,
                nomEntrepriseProposeeLot3: item.NomEntrepriseProposeeLot3 || "",
                montantDevisAvantNegociationLot3: item.MontantAvantNegociationLot3 ?? undefined,
                montantApresNegociationLot3: item.MontantApresNegociationLot3 ?? undefined,
                nomLot1: item.NomDuLot1 || "",
                nomLot2: item.NomDuLot2 || "",
                nomLot3: item.NomDuLot3 || "",
                codeEtab: item.Code_Etab || "",
                modifie: item.Modified ? item.Modified : undefined,
                cree: item.Created ? item.Created : undefined,
                creePar: item.Author?.Title || "",
                modifiePar: item.Editor?.Title || "",
                StatutFiche: item?.StatutFiche ?? undefined
              }
            )
            await getAttachmentFiles()
          }

        } catch (e) {
          console.log(e)
        }
      }
      void handleLoad()
    }
    setLoading(false)
  }, [
    Form.typeDeDemande,
    Form.coutTravaux,
    Form.honorairesMissionArchitecte,
    Form.honorairesMissionBET,
    Form.honorairesMissionBCT,
    Form.honorairesMissionCSPS,
    Form.honorairesMissionCSSI,
    Form.honorairesAssurancesTRC_DO,
    Form.autres,
  ])


  if (Loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: "100px" }}>
        <CircularProgress />
      </Box>
    )
  } else {
    return (
      <Container maxWidth="sm" style={{ padding: "30px" }}>
        <Stack spacing={5}>
          <Typography variant='h3'>
            Fiche Navette
          </Typography>
          <FormControl fullWidth required error={!!Errors.typeDeDemande}>
            <InputLabel id="typeDemande-label">Type de demande</InputLabel>
            <Select
              labelId="typeDemande-label"
              id="typeDemande"
              value={Form.typeDeDemande || ""}
              label="Typededemande"
              onChange={(event) => {
                setForm({
                  ...Form,
                  typeDeDemande: event.target.value as "Installations Techniques" | "Projets Immobiliers"
                });
                SetErrors({
                  ...Errors,
                  typeDeDemande : ''
                })
              }}
            >
              <MenuItem value={"Installations Techniques"}>Installations Techniques</MenuItem>
              <MenuItem value={"Projets Immobiliers"}>Projets Immobiliers</MenuItem>
            </Select>
            {!!Errors.typeDeDemande && <FormHelperText>{Errors.typeDeDemande}</FormHelperText>}
          </FormControl>
          <TextField id="Nomduprojet" label="Nom du projet"  required variant="outlined" value={Form.nomDuProjet} onChange={(event) => {
            setForm({
              ...Form,
              nomDuProjet: event.target.value,
            })
            SetErrors({
              ...Errors,
              nomDuProjet : ''
            })
            }}
            error={!!Errors.nomDuProjet}
            helperText={Errors.nomDuProjet}
          />

          {/* // Etablisement */}
          <Autocomplete
            loading={(EtablishmentList ?? []).length < 1}
            disablePortal
            value={Form.etablissement}
            onChange={(_, newValue: string | null) => {
              const Code = EtablishmentList.find((item: IEstablishmentCode) => item.title === newValue)
              setForm({
                ...Form,
                etablissement: newValue ?? "",
                codeEtab: Code?.code ?? ""
              });
              SetErrors({
                ...Errors,
                etablissement : ''
              })
            }}
            options={(EtablishmentList ?? []).map((item) => `${item.code} - ${item.title}`)}
            renderInput={(params) => <TextField 
              error={!!Errors.etablissement}
              helperText={Errors.etablissement}
              required 
              {...params} 
              label="Établissement" 
            />}
          />

          <FormControl fullWidth required error={!!Errors.niveauDePriorite}>
            <InputLabel id="niveauPrio-label">Niveau de priorité</InputLabel>
            <Select
              labelId="niveauPrio-label"
              id="niveauPrio"
              value={Form.niveauDePriorite || ""}
              label="Niveau de priorité"
              onChange={(event) => {
                setForm({
                  ...Form,
                  niveauDePriorite: event.target.value as 1 | 2 | 3 | "",
                });
                SetErrors({
                  ...Errors,
                  niveauDePriorite : ''
                })
              }}
            >
              <MenuItem value={1}>1</MenuItem>
              <MenuItem value={2}>2</MenuItem>
              <MenuItem value={3}>3</MenuItem>
            </Select>
            {!!Errors.typeDeDemande && <FormHelperText>{Errors.niveauDePriorite}</FormHelperText>}
          </FormControl>
          <FormControl fullWidth required error={!!Errors.projetDejaPresenteEnN1}>
            <InputLabel id="projetN1-label">Projet déja présentée en N-1</InputLabel>
            <Select
              labelId="projetN1-label"
              id="ProjetN1"
              value={Form.projetDejaPresenteEnN1 || ""}
              label="Projet déja présentée en N-1"
              onChange={(event) => {
                setForm({
                  ...Form,
                  projetDejaPresenteEnN1: event.target.value as "Oui" | "Non" | undefined,
                });
                SetErrors({
                  ...Errors,
                  projetDejaPresenteEnN1 : ''
                })
              }}
            >
              <MenuItem value={"Oui"}>Oui</MenuItem>
              <MenuItem value={"Non"}>Non</MenuItem>
            </Select>
            {!!Errors.typeDeDemande && <FormHelperText>{Errors.projetDejaPresenteEnN1}</FormHelperText>}
          </FormControl>
          <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale='fr'>
            <DatePicker value={Form.date} label="Date du projet" onChange={(newValue: dayjs.Dayjs | null) => {
              setForm({
                ...Form,
                date: newValue ? newValue : undefined
              });
            }}
            />
          </LocalizationProvider>
          <TextField id="AnneeProjet" type='number' label="Année du projet"  required error={!!Errors.anneeDeRealisationDuProjet} helperText={Errors.anneeDeRealisationDuProjet} variant="outlined" value={Form.anneeDeRealisationDuProjet} onChange={(event) => {
            setForm({
              ...Form,
              anneeDeRealisationDuProjet: toNumber(event.target.value),
            })
            SetErrors({
              ...Errors,
              anneeDeRealisationDuProjet : ''
            })
          }}
          />
          <FormControl fullWidth required error={!!Errors.projetPluriannuel}>
            <InputLabel id="ProjetPluriannuel-label">Projet pluriannuel</InputLabel>
            <Select
              labelId="ProjetPluriannuel-label"
              id="ProjetPluriannuel"
              value={Form.projetPluriannuel || ""}
              label="Projet pluriannuel"
              onChange={(event) => {
                setForm({
                  ...Form,
                  projetPluriannuel: event.target.value as "Oui" | "Non" | undefined,
                });
                SetErrors({
                  ...Errors,
                  projetPluriannuel : ''
                })
              }}
            >
              <MenuItem value={"Oui"}>Oui</MenuItem>
              <MenuItem value={"Non"}>Non</MenuItem>
            </Select>
            {!!Errors.projetPluriannuel && <FormHelperText>{Errors.projetPluriannuel}</FormHelperText>}
          </FormControl>
          {/* Description du projet */}
          <Typography variant='h6'>
            Description du projet
          </Typography>
          <TextField
            label='Description du projet'
            multiline
            minRows={4}
            placeholder="Décrire le projet ou la problématique rencontrée ainsi que la localisation dans l’établissement"
            style={{ width: '100%' }}
            value={Form.description}
            onChange={(event) => {
              setForm({
                ...Form,
                description: event.target.value
              })
            }}
          />

          {/* // Installations techniques */}
          {
            (Form.typeDeDemande === "Installations Techniques") && (
              <>
                <FormControl fullWidth>
                  <InputLabel id="MiseEnConformite-label">S’agit-il d’une mise en conformité ?</InputLabel>
                  <Select
                    labelId="MiseEnConformite-label"
                    id="MiseEnConformite"
                    value={Form.miseEnConformite || ""}
                    label="S’agit-il d’une mise en conformité ?"
                    onChange={(event) => {
                      setForm({
                        ...Form,
                        miseEnConformite: event.target.value as "Oui" | "Non" | undefined,
                      });
                    }}
                  >
                    <MenuItem value={"Oui"}>Oui</MenuItem>
                    <MenuItem value={"Non"}>Non</MenuItem>
                  </Select>
                </FormControl>
                <FormControl fullWidth>
                  <InputLabel id="PrescriptionCommissionSecurite-label">Suite à une prescription de la commission de sécurité ?</InputLabel>
                  <Select
                    labelId="PrescriptionCommissionSecurite-label"
                    id="PrescriptionCommissionSecurite"
                    value={Form.suitePrescriptionCommissionSecurite || ""}
                    label="Suite à une prescription de la commission de sécurité ?"
                    onChange={(event) => {
                      setForm({
                        ...Form,
                        suitePrescriptionCommissionSecurite: event.target.value as "Oui" | "Non" | undefined,
                      });
                    }}
                  >
                    <MenuItem value={"Oui"}>Oui</MenuItem>
                    <MenuItem value={"Non"}>Non</MenuItem>
                  </Select>
                </FormControl>
                <FormControl fullWidth>
                  <InputLabel id="PrescriptionBureauControle-label">Ou à une prescription du bureau de contrôle ?</InputLabel>
                  <Select
                    labelId="PrescriptionBureauControle-label"
                    id="PrescriptionBureauControle"
                    value={Form.suitePrescriptionBureauControle || ""}
                    label="Ou à une prescription du bureau de contrôle ?"
                    onChange={(event) => {
                      setForm({
                        ...Form,
                        suitePrescriptionBureauControle: event.target.value as "Oui" | "Non" | undefined,
                      });
                    }}
                  >
                    <MenuItem value={"Oui"}>Oui</MenuItem>
                    <MenuItem value={"Non"}>Non</MenuItem>
                  </Select>
                </FormControl>
                <FormControl fullWidth>
                  <InputLabel id="Vetuste-label">Ou à une vétusté ?</InputLabel>
                  <Select
                    labelId="Vetuste-label"
                    id="Vetuste"
                    value={Form.suiteVetuste || ""}
                    label="Ou à une vétusté ?"
                    onChange={(event) => {
                      setForm({
                        ...Form,
                        suiteVetuste: event.target.value as "Oui" | "Non" | undefined,
                      });
                    }}
                  >
                    <MenuItem value={"Oui"}>Oui</MenuItem>
                    <MenuItem value={"Non"}>Non</MenuItem>
                  </Select>
                </FormControl>
              </>
            )
          }

          {/* // Projet Immobiliers */}
          {
            (Form.typeDeDemande === "Projets Immobiliers") && (
              <>
                <FormControl fullWidth>
                  <InputLabel id="BussinessPlan-label">Un Business Plan a-t-il été présenté ?</InputLabel>
                  <Select
                    labelId="BussinessPlan-label"
                    id="BussinessPlan"
                    value={Form.businessPlanPresente || ""}
                    label="Un Business Plan a-t-il été présenté ?"
                    onChange={(event) => {
                      setForm({
                        ...Form,
                        businessPlanPresente: event.target.value as "Oui" | "Non" | undefined,
                      });
                    }}
                  >
                    <MenuItem value={"Oui"}>Oui</MenuItem>
                    <MenuItem value={"Non"}>Non</MenuItem>
                  </Select>
                </FormControl>

                <TextField
                  label='Cas dérogatoire'
                  multiline
                  minRows={3}
                  placeholder="Raison du cas dérogatoire"
                  style={{ width: '100%' }}
                  value={Form.casDerogatoireBusinessPlanRaison}
                  onChange={(event) => {
                    setForm({
                      ...Form,
                      casDerogatoireBusinessPlanRaison: event.target.value
                    })
                  }}
                  disabled={(Form.businessPlanPresente === "Non") ? false : true}
                />

                <FormControl fullWidth>
                  <InputLabel id="DemandeARS-label">S’agit-il d’une demande de l’ARS ?</InputLabel>
                  <Select
                    labelId="DemandeARS-label"
                    id="DemandeARS"
                    value={Form.demandeARS || ""}
                    label="S’agit-il d’une demande de l’ARS ?"
                    onChange={(event) => {
                      setForm({
                        ...Form,
                        demandeARS: event.target.value as "Oui" | "Non" | undefined,
                      });
                    }}
                  >
                    <MenuItem value={"Oui"}>Oui</MenuItem>
                    <MenuItem value={"Non"}>Non</MenuItem>
                  </Select>
                </FormControl>
              </>
            )
          }

          <TextField
            label=''
            multiline
            minRows={4}
            placeholder="Pourquoi ces travaux ne sont-ils pas imputés sur le CAPEX courant ?"
            style={{ width: '100%' }}
            value={Form.raisonNonImputationCAPEX}
            onChange={(event) => {
              setForm({
                ...Form,
                raisonNonImputationCAPEX: event.target.value
              })
            }}
          />

          <Typography variant='h6'>
            Intervenants
          </Typography>

          <FormControl fullWidth>
            <InputLabel id="BesoinBET-label">Avez-vous besoin d’un BET ?</InputLabel>
            <Select
              labelId="BesoinBET-label"
              id="BesoinBET"
              value={Form.besoinBET || ""}
              label="Avez-vous besoin d’un BET ?"
              onChange={(event) => {
                setForm({
                  ...Form,
                  besoinBET: event.target.value as "Oui" | "Non" | undefined,
                });
              }}
            >
              <MenuItem value={"Oui"}>Oui</MenuItem>
              <MenuItem value={"Non"}>Non</MenuItem>
            </Select>
          </FormControl>

          <TextField
            label='Nom BET'
            placeholder="Préciser le nom si identifié"
            style={{ width: '100%' }}
            value={Form.nomBET}
            onChange={(event) => {
              setForm({
                ...Form,
                nomBET: event.target.value
              })
            }}
            disabled={(Form.besoinBET === "Oui") ? false : true}
          />

          <FormControl fullWidth>
            <InputLabel id="BesoinBCT-label">Avez-vous besoin d’un BCT ?</InputLabel>
            <Select
              labelId="BesoinBCT-label"
              id="BesoinBCT"
              value={Form.besoinBCT || ""}
              label="Avez-vous besoin d’un BCT ?"
              onChange={(event) => {
                setForm({
                  ...Form,
                  besoinBCT: event.target.value as "Oui" | "Non" | undefined,
                });
              }}
            >
              <MenuItem value={"Oui"}>Oui</MenuItem>
              <MenuItem value={"Non"}>Non</MenuItem>
            </Select>
          </FormControl>

          <TextField
            label='Nom BCT'
            placeholder="Préciser le nom si identifié"
            style={{ width: '100%' }}
            value={Form.nomBCT}
            onChange={(event) => {
              setForm({
                ...Form,
                nomBCT: event.target.value
              })
            }}
            disabled={(Form.besoinBCT === "Oui") ? false : true}
          />

          <FormControl fullWidth>
            <InputLabel id="BesoinCSSI-label">Avez-vous besoin d’un CSSI ?</InputLabel>
            <Select
              labelId="BesoinCSSI-label"
              id="BesoinCSSI"
              value={Form.besoinCSSI || ""}
              label="Avez-vous besoin d’un CSSI ?"
              onChange={(event) => {
                setForm({
                  ...Form,
                  besoinCSSI: event.target.value as "Oui" | "Non" | undefined,
                });
              }}
            >
              <MenuItem value={"Oui"}>Oui</MenuItem>
              <MenuItem value={"Non"}>Non</MenuItem>
            </Select>
          </FormControl>

          <TextField
            label='Nom CSSI'
            placeholder="Préciser le nom si identifié"
            style={{ width: '100%' }}
            value={Form.nomCSSI}
            onChange={(event) => {
              setForm({
                ...Form,
                nomCSSI: event.target.value
              })
            }}
            disabled={(Form.besoinCSSI === "Oui") ? false : true}
          />

          {  // Intervenant Projets Immobiliers
            (Form.typeDeDemande === "Projets Immobiliers") && (
              <>
                <FormControl fullWidth>
                  <InputLabel id="BesoinArchitecte-label">Avez-vous besoin d’un architecte ?</InputLabel>
                  <Select
                    labelId="BesoinArchitecte-label"
                    id="BesoinArchitecte"
                    value={Form.besoinArchitecte || ""}
                    label="Avez-vous besoin d’un architecte ?"
                    onChange={(event) => {
                      setForm({
                        ...Form,
                        besoinArchitecte: event.target.value as "Oui" | "Non" | undefined,
                      });
                    }}
                  >
                    <MenuItem value={"Oui"}>Oui</MenuItem>
                    <MenuItem value={"Non"}>Non</MenuItem>
                  </Select>
                </FormControl>

                <TextField
                  label='Nom Architecte'
                  placeholder="Préciser le nom si identifié"
                  style={{ width: '100%' }}
                  value={Form.nomArchitecte}
                  onChange={(event) => {
                    setForm({
                      ...Form,
                      nomArchitecte: event.target.value
                    })
                  }}
                  disabled={(Form.besoinArchitecte === "Oui") ? false : true}
                />

                <FormControl fullWidth>
                  <InputLabel id="BesoinCSPS-label">Avez-vous besoin d’un CSPS ?</InputLabel>
                  <Select
                    labelId="BesoinCSPS-label"
                    id="BesoinCSPS"
                    value={Form.besoinCSPS || ""}
                    label="Avez-vous besoin d’un CSPS ?"
                    onChange={(event) => {
                      setForm({
                        ...Form,
                        besoinCSPS: event.target.value as "Oui" | "Non" | undefined,
                      });
                    }}
                  >
                    <MenuItem value={"Oui"}>Oui</MenuItem>
                    <MenuItem value={"Non"}>Non</MenuItem>
                  </Select>
                </FormControl>

                <TextField
                  label='Nom CSPS'
                  placeholder="Préciser le nom si identifié"
                  style={{ width: '100%' }}
                  value={Form.nomCSPS}
                  onChange={(event) => {
                    setForm({
                      ...Form,
                      nomCSPS: event.target.value
                    })
                  }}
                  disabled={(Form.besoinCSPS === "Oui") ? false : true}
                />
              </>
            )
          }


          {/* Economie d'énergie  */}
          <Typography variant='h6'>Economies d’énergie</Typography>

          <FormControl fullWidth>
            <InputLabel id="EconomieEnergie-label" size='small'>Les travaux génèrent ils des économies d’énergie ?</InputLabel>
            <Select
              size='small'
              labelId="EconomieEnergie-label"
              id="EconomieEnergie"
              value={Form.travauxGenerentEconomiesEnergie || ""}
              label="Les travaux génèrent ils des économies d’énergie ?"
              onChange={(event) => {
                setForm({
                  ...Form,
                  travauxGenerentEconomiesEnergie: event.target.value as "Oui" | "Non" | undefined,
                });
              }}
            >
              <MenuItem value={"Oui"}>Oui</MenuItem>
              <MenuItem value={"Non"}>Non</MenuItem>
            </Select>
          </FormControl>

          <TextField
            label='estimation économie en KWH/h'
            type='number'
            style={{ width: '100%' }}
            value={Form.estimationEconomieKWH}
            onChange={(event) => {
              setForm({
                ...Form,
                estimationEconomieKWH: event.target.value
              })
            }}
            disabled={(Form.travauxGenerentEconomiesEnergie === "Oui") ? false : true}
          />

          <FormControl fullWidth>
            <InputLabel id="EligibleCEE-label">Eligibles aux CEE ?</InputLabel>
            <Select
              labelId="EligibleCEE-label"
              id="EligibleCEE"
              value={Form.eligiblesCEE || ""}
              label="Eligibles aux CEE ?"
              onChange={(event) => {
                setForm({
                  ...Form,
                  eligiblesCEE: event.target.value as "Oui" | "Non" | undefined,
                });
              }}
            >
              <MenuItem value={"Oui"}>Oui</MenuItem>
              <MenuItem value={"Non"}>Non</MenuItem>
            </Select>
          </FormControl>

          <TextField
            label='Montant si connu'
            style={{ width: '100%' }}
            value={Form.montantEstimeCEE}
            onChange={(event) => {
              setForm({
                ...Form,
                montantEstimeCEE: toNumber(event.target.value)
              })
            }}
            disabled={(Form.eligiblesCEE === "Oui") ? false : true}
            slotProps={{
              inputLabel: { shrink: true },
              input: {
                startAdornment: <InputAdornment position="start">€TTC</InputAdornment>,
              }
            }}
          />

          <FormControl fullWidth>
            <InputLabel id="AutreSubvention-label">Autres subventions ?</InputLabel>
            <Select
              labelId="AutreSubvention-label"
              id="AutreSubvention"
              value={Form.autresSubventions || ""}
              label="Autres subventions ?"
              onChange={(event) => {
                setForm({
                  ...Form,
                  autresSubventions: event.target.value as "Oui" | "Non" | undefined,
                });
              }}
            >
              <MenuItem value={"Oui"}>Oui</MenuItem>
              <MenuItem value={"Non"}>Non</MenuItem>
            </Select>
          </FormControl>

          <TextField
            label='Montant si connu'
            style={{ width: '100%' }}
            value={Form.montantEstimeSubventions}
            onChange={(event) => {
              setForm({
                ...Form,
                montantEstimeSubventions: toNumber(event.target.value)
              })
            }}
            disabled={(Form.autresSubventions === "Oui") ? false : true}
            slotProps={{
              inputLabel: { shrink: true },
              input: {
                startAdornment: <InputAdornment position="start">€TTC</InputAdornment>,
              }
            }}
          />

          {/* Recours aux fournisseurs référencés */}
          <Typography variant='h6'>Recours aux fournisseurs référencés</Typography>

          <FormControl fullWidth>
            <InputLabel id="materiauxReference-label">Les matériaux/matériels mis en œuvre sont ceux référencés par le Groupe</InputLabel>
            <Select
              labelId="materiauxReference-label"
              id="materiauxReference"
              value={Form.materiauxGroupe || ""}
              label="Les matériaux/matériels mis en œuvre sont ceux référencés par le Groupe"
              onChange={(event) => {
                setForm({
                  ...Form,
                  materiauxGroupe: event.target.value as "Oui" | "Non" | undefined,
                });
              }}
            >
              <MenuItem value={"Oui"}>Oui</MenuItem>
              <MenuItem value={"Non"}>Non</MenuItem>
            </Select>
          </FormControl>

          <TextField
            label='Cas dérogatoire'
            multiline
            minRows={3}
            placeholder="Raison du cas dérogatoire"
            style={{ width: '100%' }}
            value={Form.casDerogatoireMateriaux}
            onChange={(event) => {
              setForm({
                ...Form,
                casDerogatoireMateriaux: event.target.value
              })
            }}
            disabled={(Form.materiauxGroupe === "Non") ? false : true}
          />

          <TextField
            label='Nom des fournisseurs référencés auxquels il est fait appel sur ce projet'
            multiline
            minRows={3}
            placeholder="Nom des fournisseurs référencés"
            style={{ width: '100%' }}
            value={Form.nomFournisseursReference}
            onChange={(event) => {
              setForm({
                ...Form,
                nomFournisseursReference: event.target.value
              })
            }}
          />

          {/* Budget d’investissement */}
          <Typography variant='h6'>Budget d’investissement</Typography>

          <TextField id="CoutTravaux&EquipementTech" type='number' label="Coût travaux / équipements techniques" variant="outlined" value={Form.coutTravaux} onChange={(event) => {
            setForm({
              ...Form,
              coutTravaux: toNumber(event.target.value),
            })
          }}
            slotProps={{
              inputLabel: { shrink: true },
              input: {
                startAdornment: <InputAdornment position="start">€TTC</InputAdornment>,
              }
            }}
          />

          <TextField id="HonorairesBET" type='number' label="Honoraires mission BET " variant="outlined" value={Form.honorairesMissionBET} onChange={(event) => {
            setForm({
              ...Form,
              honorairesMissionBET: toNumber(event.target.value),
            })
          }}
            slotProps={{
              inputLabel: { shrink: true },
              input: {
                startAdornment: <InputAdornment position="start">€TTC</InputAdornment>,
              }
            }}
          />

          <TextField id="HonorairesBCT" type='number' label="Honoraires mission BCT " variant="outlined" value={Form.honorairesMissionBCT} onChange={(event) => {
            setForm({
              ...Form,
              honorairesMissionBCT: toNumber(event.target.value),
            })
          }}
            slotProps={{
              inputLabel: { shrink: true },
              input: {
                startAdornment: <InputAdornment position="start">€TTC</InputAdornment>,
              }
            }}
          />

          <TextField id="HonorairesCSSI" type='number' label="Honoraires mission CSSI" variant="outlined" value={Form.honorairesMissionCSSI} onChange={(event) => {
            setForm({
              ...Form,
              honorairesMissionCSSI: toNumber(event.target.value),
            })
          }}
            slotProps={{
              inputLabel: { shrink: true },
              input: {
                startAdornment: <InputAdornment position="start">€TTC</InputAdornment>,
              }
            }}
          />

          {
            // Budget Projets Immobiliers
            (Form.typeDeDemande === 'Projets Immobiliers') && (
              <>
                <TextField id="HonorairesArchitecte" type='number' label="Honoraires mission architecte" variant="outlined" value={Form.honorairesMissionArchitecte} onChange={(event) => {
                  setForm({
                    ...Form,
                    honorairesMissionArchitecte: toNumber(event.target.value),
                  })
                }}
                  slotProps={{
                    inputLabel: { shrink: true },
                    input: {
                      startAdornment: <InputAdornment position="start">€TTC</InputAdornment>,
                    }
                  }}
                />

                <TextField id="HonorairesCSPS" type='number' label="Honoraires mission CSPS" variant="outlined" value={Form.honorairesMissionCSPS} onChange={(event) => {
                  setForm({
                    ...Form,
                    honorairesMissionCSPS: toNumber(event.target.value),
                  })
                }}
                  slotProps={{
                    inputLabel: { shrink: true },
                    input: {
                      startAdornment: <InputAdornment position="start">€TTC</InputAdornment>,
                    }
                  }}
                />

                <TextField id="HonorairesTRDO" type='number' label="Honoraires assurances TRC/DO " variant="outlined" value={Form.honorairesAssurancesTRC_DO} onChange={(event) => {
                  setForm({
                    ...Form,
                    honorairesAssurancesTRC_DO: toNumber(event.target.value),
                  })
                }}
                  slotProps={{
                    inputLabel: { shrink: true },
                    input: {
                      startAdornment: <InputAdornment position="start">€TTC</InputAdornment>,
                    }
                  }}
                />

              </>
            )

          }

          <TextField id="Autre" type='number' label="Autre" variant="outlined" value={Form.autres} onChange={(event) => {
            setForm({
              ...Form,
              autres: toNumber(event.target.value),
            })
          }}
            slotProps={{
              inputLabel: { shrink: true },
              input: {
                startAdornment: <InputAdornment position="start">€TTC</InputAdornment>,
              }
            }}
          />

          <TextField
            label="Budget total"
            type="number"
            value={Form.budgetTotal ?? 0}
            aria-readonly
            fullWidth
            slotProps={{
              inputLabel: { shrink: true },
              input: {
                startAdornment: <InputAdornment position="start">€TTC</InputAdornment>,
              }
            }}
          />

          {
            // Budget Projets Immobiliers
            (Form.typeDeDemande === 'Projets Immobiliers') && (
              <>
                <TextField id="BudgetConsomme2025" type='number' label="Budget consommée de 2025" variant="outlined" value={Form.budgetConsomme2025} onChange={(event) => {
                  setForm({
                    ...Form,
                    budgetConsomme2025: toNumber(event.target.value),
                  })
                }}
                  disabled={(Form.projetPluriannuel === 'Oui') ? false : true}
                  slotProps={{
                    inputLabel: { shrink: true },
                    input: {
                      startAdornment: <InputAdornment position="start">€TTC</InputAdornment>,
                    }
                  }}
                />

                <TextField id="BudgetPrevisionnel2025" type='number' label="Budget prévisionnel de 2025" variant="outlined" value={Form.budgetPrevisionnel2025} onChange={(event) => {
                  setForm({
                    ...Form,
                    budgetPrevisionnel2025: toNumber(event.target.value),
                  })
                }}
                  slotProps={{
                    inputLabel: { shrink: true },
                    input: {
                      startAdornment: <InputAdornment position="start">€TTC</InputAdornment>,
                    }
                  }}
                />

                <TextField id="CapexConsomme2026" type='number' label="Capex dèja consommée en 2026" variant="outlined" value={Form.capexConsomme2026} onChange={(event) => {
                  setForm({
                    ...Form,
                    capexConsomme2026: toNumber(event.target.value),
                  })
                }}
                  slotProps={{
                    inputLabel: { shrink: true },
                    input: {
                      startAdornment: <InputAdornment position="start">€TTC</InputAdornment>,
                    }
                  }}
                />

                <FormControl fullWidth>
                  <InputLabel id="TravauxAllotis-label">Les travaux sont-ils allotis ?</InputLabel>
                  <Select
                    labelId="TravauxAllotis-label"
                    id="TravauxAllotis"
                    value={Form.travauxAllotis || ""}
                    label="Les travaux sont-ils allotis ?"
                    onChange={(event) => {
                      setForm({
                        ...Form,
                        travauxAllotis: event.target.value as "Oui" | "Non" | undefined,
                      });
                    }}
                  >
                    <MenuItem value={"Oui"}>Oui</MenuItem>
                    <MenuItem value={"Non"}>Non</MenuItem>
                  </Select>
                </FormControl>

                <TextField id="NombreDeLots" type='number' label="Nombre de lot" variant="outlined" value={Form.nombreDeLots} onChange={(event) => {
                  setForm({
                    ...Form,
                    nombreDeLots: toNumber(event.target.value),
                  })
                }}
                  disabled={(Form.travauxAllotis === 'Oui') ? false : true}
                />

                <TextField
                  label='Cas dérogatoire'
                  multiline
                  minRows={3}
                  placeholder="Raison du cas dérogatoire"
                  style={{ width: '100%' }}
                  value={Form.casDerogatoireAllotissement}
                  onChange={(event) => {
                    setForm({
                      ...Form,
                      casDerogatoireAllotissement: event.target.value
                    })
                  }}
                  disabled={(Form.travauxAllotis === "Non") ? false : true}
                />

              </>
            )

          }

          <FormControl fullWidth>
            <InputLabel id="ConsultationLots-label">Pour chacun des lots, les travaux ont fait l’objet d’une consultation d’au moins 3 entreprises ?</InputLabel>
            <Select
              labelId="ConsultationLots-label"
              id="ConsultationLots"
              value={Form.consultation3Entreprises || ""}
              label="Pour chacun des lots, les travaux ont fait l’objet d’une consultation d’au moins 3 entreprises ?"
              onChange={(event) => {
                setForm({
                  ...Form,
                  consultation3Entreprises: event.target.value as "Oui" | "Non" | undefined,
                });
              }}
            >
              <MenuItem value={"Oui"}>Oui</MenuItem>
              <MenuItem value={"Non"}>Non</MenuItem>
            </Select>
          </FormControl>

          <TextField
            label='Cas dérogatoire'
            multiline
            minRows={3}
            placeholder="Raison du cas dérogatoire"
            style={{ width: '100%' }}
            value={Form.casDerogatoireConsultation3Entreprises}
            onChange={(event) => {
              setForm({
                ...Form,
                casDerogatoireConsultation3Entreprises: event.target.value
              })
            }}
            disabled={(Form.consultation3Entreprises === "Non") ? false : true}
          />

          {
            /* lot 1  */
            (Form.typeDeDemande === 'Projets Immobiliers') && (
              <>

                <TextField
                  label='Nom du lot'
                  style={{ width: '100%' }}
                  value={Form.nomLot1}
                  onChange={(event) => {
                    setForm({
                      ...Form,
                      nomLot1: event.target.value
                    })
                  }}
                />

                <TextField
                  label="Nom d'entrepise n°1"
                  style={{ width: '100%' }}
                  value={Form.nomEntreprise1}
                  onChange={(event) => {
                    setForm({
                      ...Form,
                      nomEntreprise1: event.target.value
                    })
                  }}
                />

                <TextField
                  label='Montant devis'
                  type='number'
                  style={{ width: '100%' }}
                  value={Form.montantDevis1}
                  onChange={(event) => {
                    setForm({
                      ...Form,
                      montantDevis1: toNumber(event.target.value)
                    })
                  }}
                  slotProps={{
                    inputLabel: { shrink: true },
                    input: {
                      startAdornment: <InputAdornment position="start">€TTC</InputAdornment>,
                    }
                  }}
                />

                <TextField
                  label="Nom d'entrepise n°2"
                  style={{ width: '100%' }}
                  value={Form.nomEntreprise2}
                  onChange={(event) => {
                    setForm({
                      ...Form,
                      nomEntreprise2: event.target.value
                    })
                  }}
                />

                <TextField
                  label='Montant devis'
                  type='number'
                  style={{ width: '100%' }}
                  value={Form.montantDevis2}
                  onChange={(event) => {
                    setForm({
                      ...Form,
                      montantDevis2: toNumber(event.target.value)
                    })
                  }}
                  slotProps={{
                    inputLabel: { shrink: true },
                    input: {
                      startAdornment: <InputAdornment position="start">€TTC</InputAdornment>,
                    }
                  }}
                />

                <TextField
                  label="Nom d'entrepise n°3"
                  style={{ width: '100%' }}
                  value={Form.nomEntreprise3}
                  onChange={(event) => {
                    setForm({
                      ...Form,
                      nomEntreprise3: event.target.value
                    })
                  }}
                />

                <TextField
                  label='Montant devis'
                  type='number'
                  style={{ width: '100%' }}
                  value={Form.montantDevis3}
                  onChange={(event) => {
                    setForm({
                      ...Form,
                      montantDevis3: toNumber(event.target.value)
                    })
                  }}
                  slotProps={{
                    inputLabel: { shrink: true },
                    input: {
                      startAdornment: <InputAdornment position="start">€TTC</InputAdornment>,
                    }
                  }}
                />
                <Box width="100%" display="flex" justifyContent="flex-end">
                  <Button variant="outlined" size="small">
                    Ajouter un lot
                  </Button>
                </Box>
              </>
            )
          }

          { // Installations technique sans lot
            (Form.typeDeDemande === 'Installations Techniques') && (
              <>
                <TextField
                  label="Nom d'entrepise n°1"
                  style={{ width: '100%' }}
                  value={Form.nomEntreprise1}
                  onChange={(event) => {
                    setForm({
                      ...Form,
                      nomEntreprise1: event.target.value
                    })
                  }}
                />

                <TextField
                  label='Montant devis'
                  type='number'
                  style={{ width: '100%' }}
                  value={Form.montantDevis1}
                  onChange={(event) => {
                    setForm({
                      ...Form,
                      montantDevis1: toNumber(event.target.value)
                    })
                  }}
                  slotProps={{
                    inputLabel: { shrink: true },
                    input: {
                      startAdornment: <InputAdornment position="start">€TTC</InputAdornment>,
                    }
                  }}
                />

                <TextField
                  label="Nom d'entrepise n°2"
                  style={{ width: '100%' }}
                  value={Form.nomEntreprise2}
                  onChange={(event) => {
                    setForm({
                      ...Form,
                      nomEntreprise2: event.target.value
                    })
                  }}
                />

                <TextField
                  label='Montant devis'
                  type='number'
                  style={{ width: '100%' }}
                  value={Form.montantDevis2}
                  onChange={(event) => {
                    setForm({
                      ...Form,
                      montantDevis2: toNumber(event.target.value)
                    })
                  }}
                  slotProps={{
                    inputLabel: { shrink: true },
                    input: {
                      startAdornment: <InputAdornment position="start">€TTC</InputAdornment>,
                    }
                  }}
                />

                <TextField
                  label="Nom d'entrepise n°3"
                  style={{ width: '100%' }}
                  value={Form.nomEntreprise3}
                  onChange={(event) => {
                    setForm({
                      ...Form,
                      nomEntreprise3: event.target.value
                    })
                  }}
                />

                <TextField
                  label='Montant devis'
                  type='number'
                  style={{ width: '100%' }}
                  value={Form.montantDevis3}
                  onChange={(event) => {
                    setForm({
                      ...Form,
                      montantDevis3: toNumber(event.target.value)
                    })
                  }}
                  slotProps={{
                    inputLabel: { shrink: true },
                    input: {
                      startAdornment: <InputAdornment position="start">€TTC</InputAdornment>,
                    }
                  }}
                />
              </>
            )
          }

          <FormControl fullWidth>
            <InputLabel id="DevisNegocie-label">Les devis ont-ils été négociés ?</InputLabel>
            <Select
              labelId="DevisNegocie-label"
              id="DevisNegocie"
              value={Form.devisNegocies || ""}
              label="Les devis ont-ils été négociés ?"
              onChange={(event) => {
                setForm({
                  ...Form,
                  devisNegocies: event.target.value as "Oui" | "Non" | undefined,
                });
              }}
            >
              <MenuItem value={"Oui"}>Oui</MenuItem>
              <MenuItem value={"Non"}>Non</MenuItem>
            </Select>
          </FormControl>

          <TextField
            label='Cas dérogatoire'
            multiline
            minRows={3}
            placeholder="Raison du cas dérogatoire"
            style={{ width: '100%' }}
            value={Form.casDerogatoireDevisNonNegocies}
            onChange={(event) => {
              setForm({
                ...Form,
                casDerogatoireDevisNonNegocies: event.target.value
              })
            }}
            disabled={(Form.devisNegocies === "Non") ? false : true}
          />

          {
            // Installations techniques
            (Form.typeDeDemande === 'Installations Techniques') && (
              <>
                <TextField
                  label="Nom d'entrepise proposée"
                  style={{ width: '100%' }}
                  value={Form.nomEntrepriseProposee1}
                  onChange={(event) => {
                    setForm({
                      ...Form,
                      nomEntrepriseProposee1: event.target.value
                    })
                  }}
                />

                <TextField
                  label='Montant avant négociation'
                  type='number'
                  style={{ width: '100%' }}
                  value={Form.montantDevisAvantNegociation1}
                  onChange={(event) => {
                    setForm({
                      ...Form,
                      montantDevisAvantNegociation1: toNumber(event.target.value)
                    })
                  }}
                  slotProps={{
                    inputLabel: { shrink: true },
                    input: {
                      startAdornment: <InputAdornment position="start">€TTC</InputAdornment>,
                    }
                  }}
                />

                <TextField
                  label='Montant après négociation'
                  type='number'
                  style={{ width: '100%' }}
                  value={Form.montantApresNegociation1}
                  onChange={(event) => {
                    setForm({
                      ...Form,
                      montantApresNegociation1: toNumber(event.target.value)
                    })
                  }}
                  slotProps={{
                    inputLabel: { shrink: true },
                    input: {
                      startAdornment: <InputAdornment position="start">€TTC</InputAdornment>,
                    }
                  }}
                />

              </>
            )
          }

          {
            // Projets Immobiliers lot
            (Form.typeDeDemande === 'Projets Immobiliers') && (
              <>

                <Typography variant='h6'>Lot n°1</Typography>

                <TextField
                  label="Nom d'entrepise proposée"
                  style={{ width: '100%' }}
                  value={Form.nomEntrepriseProposee1}
                  onChange={(event) => {
                    setForm({
                      ...Form,
                      nomEntrepriseProposee1: event.target.value
                    })
                  }}
                />

                <TextField
                  label='Montant avant négociation'
                  type='number'
                  style={{ width: '100%' }}
                  value={Form.montantDevisAvantNegociation1}
                  onChange={(event) => {
                    setForm({
                      ...Form,
                      montantDevisAvantNegociation1: toNumber(event.target.value)
                    })
                  }}
                  slotProps={{
                    inputLabel: { shrink: true },
                    input: {
                      startAdornment: <InputAdornment position="start">€TTC</InputAdornment>,
                    }
                  }}
                />

                <TextField
                  label='Montant après négociation'
                  type='number'
                  style={{ width: '100%' }}
                  value={Form.montantApresNegociation1}
                  onChange={(event) => {
                    setForm({
                      ...Form,
                      montantApresNegociation1: toNumber(event.target.value)
                    })
                  }}
                  slotProps={{
                    inputLabel: { shrink: true },
                    input: {
                      startAdornment: <InputAdornment position="start">€TTC</InputAdornment>,
                    }
                  }}
                />

                <Box width="100%" display="flex" justifyContent="flex-end">
                  <Button variant="outlined" size="small">
                    Ajouter un lot
                  </Button>
                </Box>

              </>
            )
          }

          <FilePicker
            buttonLabel="Joindre des fichiers"
            buttonIcon="upload"
            onSave={(filePickerResult: IFilePickerResult[]) => { setFiles(filePickerResult) }}
            onChange={(filePickerResult: IFilePickerResult[]) => { setFiles(filePickerResult) }}
            context={props.context}
            allowExternalLinks={false}
            hideOneDriveTab={true}
            hideRecentTab={true}
            hideStockImages={true}
          />

          <ul>
            {
              files && files?.length > 0 ? (
                files.map((el) =>
                  <li key={el.fileName}>{el.fileName}
                    <IconButton onClick={() => DeletePj(el.fileName)} aria-label="delete">
                      <DeleteIcon />
                    </IconButton>
                  </li>
                )) : (null)
            }
            {displayFiles && displayFiles.length > 0 ? (
              displayFiles.map((el) => <li key={el.FileName}><a href={el.ServerRelativeUrl}>{el.FileName}</a>
                <IconButton onClick={() => recycleAttachment(el.FileName)} aria-label="delete">
                  <DeleteIcon />
                </IconButton>
              </li>)
            ) : (
              null
            )}
          </ul>

          {props.displayMode !== FormDisplayMode.Display &&
            (Form?.StatutFiche === 'Refusée' || Form?.StatutFiche === 'En cours' || Form?.StatutFiche === undefined) && (
              <FormControlLabel control={
                <Checkbox  checked={!!Form.IsCheck} onChange={(event) => {
                    setForm({
                      ...Form,
                      IsCheck: event.target.checked
                    })
                  }} 
                />
              } label="Soumettre votre demande" />
            )
          }

          <Stack direction={{ xs: 'column', sm: 'row' }}
            spacing={{ xs: 1, sm: 2, md: 4 }} alignItems='center' justifyContent="center">
            {props.displayMode !== FormDisplayMode.Display &&
              (Form?.StatutFiche === 'Refusée' || Form?.StatutFiche === 'En cours' || Form?.StatutFiche === undefined) && (
                <Button variant="outlined" loading={Loading} onClick={() => submit()}>
                  Valider
                </Button>
              )
            }
            <Button variant="outlined" onClick={() => props.onClose()}>Annuler</Button>
          </Stack>

        </Stack>
      </Container>
    )
  }
}


