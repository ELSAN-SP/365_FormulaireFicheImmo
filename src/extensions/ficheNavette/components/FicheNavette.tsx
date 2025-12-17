// FicheNavette.tsx
import * as React from 'react';
import { Container, Stack, Typography, Box, Divider } from '@mui/material';
import { FormDisplayMode } from '@microsoft/sp-core-library';

import SectionTypeDeDemande from './Sections/SectionTypeDeDemande';
import SectionEtablissement from './Sections/SectionEtablissement';
import SectionInformationsGenerales from './Sections/SectionInformationsGenerales';
import SectionActions from './Sections/SectionActions';
import SectionDescription from './Sections/SectionDescription';
import SectionIntervenants from './Sections/SectionIntervenants';
import SectionEconomieEnergie from './Sections/SectionEconomieEnergie';
import SectionRecoursFournisseurs from './Sections/SectionRecoursFournisseurs';
import SectionBudget from './Sections/SectionBudget';
import SectionBudgetLots from './Sections/SectionBudgetLots';
import SectionPieceJointe from './Sections/SectionPieceJointe';
import SectionMessageValidation from './Sections/SectionMessageValidation';

import type { IEstablishmentCode } from '../Interfaces/IEtablishmentCode';

import { useFicheNavetteForm } from './hooks/useFicheNavetteForm';
import { useValidation } from './hooks/useValidation';
import { FicheNavetteService } from '../Services/ficheNavette.service';

export interface IFicheNavetteProps {
  context?: any;
  displayMode?: FormDisplayMode;
  onSave?: () => void;
  onClose?: () => void;
  establishments?: IEstablishmentCode[];
  itemId?: number; // ID élément pour édition
}

export default function FicheNavette({
  context,
  displayMode,
  onSave,
  onClose,
  establishments: establishmentsProp,
  itemId
}: IFicheNavetteProps): JSX.Element {

  const disabled = displayMode === FormDisplayMode.Display;

  //--- Formulaire
  const { form, setField, hydrate, reset, errors: formErrors, setErrors } = useFicheNavetteForm();

  //--- Validation
  const { errors: validationErrors, runValidation } = useValidation(form);
  const errors = { ...formErrors, ...validationErrors } as Record<string, string>;

  //-- Message Validation
  const [showValidationError, setShowValidationError] = React.useState(false);

  //Piece Jointe
  const [pendingAttachments, setPendingAttachments] = React.useState<File[]>([]);
  
  //--- Service
  const service = React.useMemo(() => {
    if (!context) return null;
    return new FicheNavetteService(context, {
      listTitle: 'Fiche Navette POC',
      establishmentsListTitle: 'Etablissements',
      estFields: { title: 'Title', code: 'Code' },
      establishmentsWebUrl: "https://elsancare.sharepoint.com/sites/Referentiels/",
      fieldsMap: {}
    });
  }, [context]);

  //--- Chargement établissements
  const [establishments, setEstablishments] = React.useState<IEstablishmentCode[]>(establishmentsProp ?? []);
  const [loadingEst, setLoadingEst] = React.useState(false);
  const [errEst, setErrEst] = React.useState('');

  React.useEffect(() => {
    if (establishmentsProp?.length) return;
    if (!service) {
      setErrEst('Service SPFx non initialisé (context manquant)');
      return;
    }

    let mounted = true;
    void (async () => {
      setLoadingEst(true);
      try {
        const data = await service.getEstablishments();
        if (mounted) setEstablishments(data);
      } catch (e: unknown) {
        if (mounted) setErrEst(e instanceof Error ? e.message : 'Erreur référentiel établissements');
      } finally {
        if (mounted) setLoadingEst(false);
      }
    })();

    return () => { mounted = false; };
  }, [service, establishmentsProp]);

  //--- Mode édition : hydrate si itemId
  React.useEffect(() => {
    if (!service || !itemId) return;

    let mounted = true;
    void (async () => {
      try {
        console.log('Edition mode, itemId =', itemId);
        const data = await service.getItem(itemId);
        if (mounted && data) hydrate(data);
      } catch (e) {
        console.error('Erreur chargement formulaire:', e);
      }
    })();

    return () => { mounted = false; };
  }, [service, itemId, hydrate]);

  //--- Sauvegarde
  const onSaveClick = React.useCallback(async () => {
    if (!runValidation()) {
      setShowValidationError(true); 
      return;
    }
  
    try {
      if (service) {
        const savedId = await service.save(form, itemId); // create/update
  
        // --- upload des fichiers en attente
        if (pendingAttachments.length > 0) {
          const filesToUpload = await Promise.all(
            pendingAttachments.map(async (f) => {
              const buffer = await f.arrayBuffer();
              return { name: f.name, arrayBuffer: buffer };
            })
          );
          await service.addAttachments(savedId, filesToUpload);
          setPendingAttachments([]); // reset après upload
        }
        console.log('Saved item id:', savedId);
      } else {
        console.log('PAYLOAD (test):', form);
      }
      onSave?.();
      onClose?.();
    } catch (e) {
      console.error('Erreur sauvegarde:', e);
    }
  }, [form, runValidation, service, itemId, onSave, onClose, pendingAttachments, setPendingAttachments]);
  

  //--- Rendu
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Stack spacing={3}>
        <Typography variant="h4">Fiche Navette</Typography>

        <SectionTypeDeDemande
          value={form.typeDeDemande ?? ""}
          onChange={(val) => setField('typeDeDemande', val)}
          errorText={errors.typeDeDemande}
          disabled={disabled}
        />

        <SectionEtablissement
          etablissement={form.etablissement ?? ''}
          codeEtab={form.codeEtab ?? ''}
          establishments={establishments}
          loading={loadingEst}
          error={errEst}
          setField={setField}
          errorText={errors.etablissement}
          disabled={disabled}
        />

        <SectionInformationsGenerales
          form={form}
          setField={setField}
          errors={errors}
          disabled={disabled}
        />

        <SectionDescription
          form={form}
          setField={setField}
          errors={errors}  
          disabled={disabled}
        />

        <SectionIntervenants
          form={form}
          setField={setField}
          errors={errors}
          disabled={disabled}
        />

        <SectionEconomieEnergie
          form={form}
          setField={setField}
          errors={errors}
          disabled={disabled}
        />

        <SectionRecoursFournisseurs
          form={form}
          setField={setField}
          errors={errors}
          disabled={disabled}
        />

        <SectionBudget
          form={form}
          setField={setField}
          errors={errors}
          disabled={disabled}
        />

        <SectionBudgetLots
          form={form}
          setField={setField} 
          errors={errors}
          disabled={disabled}
        />

        {service && (
          <SectionPieceJointe
            service={service}
            itemId={itemId}
            disabled={disabled}
            pendingFiles={pendingAttachments}
            setPendingFiles={setPendingAttachments}
          />
        )}

        <SectionActions
          onSave={onSaveClick}
          onCancel={() => onClose?.()}
          disabled={disabled}
        />

        {/* Message de validation global */}
        <SectionMessageValidation
          open={showValidationError}
          message="Certains champs obligatoires sont manquants"
          onClose={() => setShowValidationError(false)}
        />

        {/* Debug JSON */}
        <Box>
          <Divider sx={{ my: 2 }} />
          <Typography variant="subtitle2">Form JSON (live)</Typography>
          <Box component="pre" sx={{ p: 2, bgcolor: '#f7f7f7', borderRadius: 1, overflowX: 'auto', fontSize: 12 }}>
            {JSON.stringify(form, null, 2)}
          </Box>
          {!!Object.keys(errors).length && (
            <>
              <Divider sx={{ my: 2 }} />
              <Typography variant="subtitle2" color="error">Errors</Typography>
              <Box component="pre" sx={{ p: 2, bgcolor: '#fff5f5', borderRadius: 1, overflowX: 'auto', fontSize: 12, color: '#b00020' }}>
                {JSON.stringify(errors, null, 2)}
              </Box>
            </>
          )}
        </Box>
      </Stack>
    </Container>
  );
}
