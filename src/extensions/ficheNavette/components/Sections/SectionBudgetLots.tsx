// Sections/SectionBudgetLots.tsx
import * as React from 'react';
import {
  Card,
  CardHeader,
  CardContent,
  Stack,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  InputAdornment,
  Box,
  Button,
  Typography,
} from '@mui/material';
import type { IFormList, Lot } from '../../Interfaces/IFormList';
import type { SelectChangeEvent } from '@mui/material/Select';

type Props = {
  form: Partial<IFormList>;
  setField: (path: string, value: any) => void;
  errors: Record<string, string>;
  disabled?: boolean;
};

export default function SectionBudgetLots({ form, setField, errors, disabled }: Props) {
  if (!form.typeDeDemande) return null;

  //--- Gestion Oui/Non avec effacement des champs liés
  const handleSelectOuiNon = (field: keyof IFormList, relatedField?: keyof IFormList) => (e: SelectChangeEvent<string>) => {
    const val = e.target.value as 'Oui' | 'Non' | undefined;
    setField(field, val);
    if (relatedField && val !== 'Oui') setField(relatedField, '');
  };

  //--- Initialisation des lots depuis le formulaire
  const [lots, setLots] = React.useState<Lot[]>([]);

  React.useEffect(() => {
    setLots(
      (form.lots ?? []).map(lot => ({
        id: lot.id,
        nomLot: lot.nomLot ?? '',
        nomEntrepriseProposee: lot.nomEntrepriseProposee ?? '',
        montantAvantNegociation: lot.montantAvantNegociation ?? undefined,
        montantApresNegociation: lot.montantApresNegociation ?? undefined,
      }))
    );
  }, [form.lots]);

  //--- Synchronisation automatique des lots et du champ "travauxAllotis"
  React.useEffect(() => {
    // Si des lots existent et que travauxAllotis n'est pas Oui -> on le met à Oui
    if ((lots.length > 0 || (form.lots?.length ?? 0) > 0) && form.travauxAllotis !== 'Oui') {
      setField('travauxAllotis', 'Oui');
    }

    // Si travauxAllotis est Oui mais pas de lot -> on ajoute un lot vide
    if (form.travauxAllotis === 'Oui' && (lots.length === 0 && (form.lots?.length ?? 0) === 0)) {
      const newLot: Lot = {
        id: crypto?.randomUUID?.() ?? String(Date.now()),
        nomLot: '',
        nomEntrepriseProposee: '',
        montantAvantNegociation: undefined,
        montantApresNegociation: undefined,
      };
      const updated = [newLot];
      setLots(updated);
      setField('lots', updated);
    }
  }, [lots, form.travauxAllotis, form.lots, setField]);


  //--- Mise à jour d'un lot à l'index donné
  const handleLotChange = (index: number, field: keyof Lot, value: any) => {
    const updated = [...lots];
    updated[index] = { ...updated[index], [field]: value };
    setLots(updated);

    //--- Normalisation des lots pour supprimer les trous
    const normalizedLots = updated.filter(l =>
      l.nomLot || l.nomEntrepriseProposee || l.montantAvantNegociation != null || l.montantApresNegociation != null
    );
    setField('lots', normalizedLots);
  };

  //--- Ajouter un nouveau lot
  const addLot = () => {
    if (lots.length >= 20) return; // max 20 lots
    const newLot: Lot = {
      id: crypto?.randomUUID?.() ?? String(Date.now()),
      nomLot: '',
      nomEntrepriseProposee: '',
      montantAvantNegociation: undefined,
      montantApresNegociation: undefined,
    };
    const updated = [...lots, newLot];
    setLots(updated);
    setField('lots', updated);
  };

    //--- Supprimer un lot
    const removeLot = (index: number) => {
      const updated = [...lots];
      updated.splice(index, 1);
      setLots(updated);
      setField(
        'lots',
        updated.filter(l =>
          l.nomLot || l.nomEntrepriseProposee || l.montantAvantNegociation != null || l.montantApresNegociation != null
        )
      );
    };

  return (
    <Card>
      <CardHeader title="Lots et devis" />
      <CardContent>
        <Stack spacing={2}>

          {/* Travaux allotis pour Projets Immobiliers */}
          {form.typeDeDemande === 'Projets Immobiliers' && (
            <>
              <FormControl fullWidth error={!!errors.travauxAllotis} disabled={disabled}>
                <InputLabel id="TravauxAllotis-label">Les travaux sont-ils allotis ?</InputLabel>
                <Select
                  labelId="TravauxAllotis-label"
                  value={form.travauxAllotis || ''}
                  label="Les travaux sont-ils allotis ?"
                  onChange={handleSelectOuiNon('travauxAllotis', 'nombreDeLots')}
                >
                  <MenuItem value="Oui">Oui</MenuItem>
                  <MenuItem value="Non">Non</MenuItem>
                </Select>
                {!!errors.travauxAllotis && <FormHelperText>{errors.travauxAllotis}</FormHelperText>}
              </FormControl>

              {form.travauxAllotis === 'Oui' && (
                <TextField
                  label="Nombre de lots"
                  type="number"
                  fullWidth
                  value={form.nombreDeLots ?? ''}
                  onChange={(e) => setField('nombreDeLots', Number(e.target.value))}
                  disabled={disabled}
                />
              )}

              {form.travauxAllotis === 'Non' && (
                <TextField
                  label="Cas dérogatoire"
                  multiline
                  minRows={3}
                  placeholder="Raison du cas dérogatoire"
                  fullWidth
                  value={form.casDerogatoireAllotissement ?? ''}
                  onChange={(e) => setField('casDerogatoireAllotissement', e.target.value)}
                  disabled={disabled}
                />
              )}
            </>
          )}

         {/* Consultation 3 entreprises */}
          {lots.length > 0 && (
            <FormControl fullWidth error={!!errors.consultation3Entreprises} disabled={disabled}>
              <InputLabel id="ConsultationLots-label">
                Pour chacun des lots, les travaux ont fait l’objet d’une consultation d’au moins 3 entreprises ?
              </InputLabel>
              <Select
                labelId="ConsultationLots-label"
                value={form.consultation3Entreprises || ''}
                label="Consultation 3 entreprises"
                onChange={handleSelectOuiNon('consultation3Entreprises', 'casDerogatoireConsultation3Entreprises')}
              >
                <MenuItem value="Oui">Oui</MenuItem>
                <MenuItem value="Non">Non</MenuItem>
              </Select>
              {!!errors.consultation3Entreprises && <FormHelperText>{errors.consultation3Entreprises}</FormHelperText>}
            </FormControl>
          )}

          {/* Cas dérogatoire si Non */}
          {form.consultation3Entreprises === 'Non' && (
            <TextField
              label="Cas dérogatoire"
              multiline
              minRows={3}
              placeholder="Raison du cas dérogatoire"
              fullWidth
              value={form.casDerogatoireConsultation3Entreprises ?? ''}
              onChange={(e) => setField('casDerogatoireConsultation3Entreprises', e.target.value)}
              disabled={disabled}
            />
          )}

          {/* Lots dynamiques pour Projets Immobiliers */}
          {form.typeDeDemande === 'Projets Immobiliers' &&
            lots.map((lot, index) => (
              <Box key={lot.id} sx={{ border: '1px solid #ddd', p: 2, borderRadius: 1 }}>
                <Typography variant="subtitle1">Lot n°{index + 1}</Typography>

                <TextField
                  label="Nom du lot"
                  fullWidth
                  value={lot.nomLot}
                  onChange={(e) => handleLotChange(index, 'nomLot', e.target.value)}
                  disabled={disabled}
                />
                <TextField
                  label="Nom d'entreprise proposée"
                  fullWidth
                  value={lot.nomEntrepriseProposee}
                  onChange={(e) => handleLotChange(index, 'nomEntrepriseProposee', e.target.value)}
                  disabled={disabled}
                />
                <TextField
                  label="Montant avant négociation"
                  type="number"
                  fullWidth
                  value={lot.montantAvantNegociation ?? ''}
                  onChange={(e) => handleLotChange(index, 'montantAvantNegociation', Number(e.target.value))}
                  disabled={disabled}
                  InputProps={{ startAdornment: <InputAdornment position="start">€TTC</InputAdornment> }}
                />
                <TextField
                  label="Montant après négociation"
                  type="number"
                  fullWidth
                  value={lot.montantApresNegociation ?? ''}
                  onChange={(e) => handleLotChange(index, 'montantApresNegociation', Number(e.target.value))}
                  disabled={disabled}
                  InputProps={{ startAdornment: <InputAdornment position="start">€TTC</InputAdornment> }}
                />

               {/* Bouton suppression */}
                {!disabled && (
                  <Box display="flex" justifyContent="flex-end" mt={1}>
                    <Button
                      color="error"
                      size="small"
                      variant="outlined"
                      onClick={() => removeLot(index)}
                    >
                      Supprimer ce lot
                    </Button>
                  </Box>
                )}


              </Box>
            ))}

          {form.typeDeDemande === 'Projets Immobiliers' && form.travauxAllotis === 'Oui' && (
            <Box display="flex" justifyContent="flex-end" mt={1}>
              <Button variant="outlined" size="small" onClick={addLot} disabled={lots.length >= 20}>
                Ajouter un lot
              </Button>
            </Box>
          )}

        </Stack>
      </CardContent>
    </Card>
  );
}
