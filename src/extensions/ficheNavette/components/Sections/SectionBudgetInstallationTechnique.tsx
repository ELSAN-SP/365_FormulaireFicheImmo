// Sections/SectionBudgetInstallationTechnique.tsx
import * as React from 'react';
import {
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  FormHelperText,
  InputAdornment,
  Box,
  Typography,
} from '@mui/material';
import type { IFormList } from '../../Interfaces/IFormList';
import type { SelectChangeEvent } from '@mui/material/Select';

type Props = {
  form: Partial<IFormList>;
  setField: (path: keyof IFormList, value: any) => void;
  errors: Record<string, string>;
  disabled?: boolean;
};

export default function SectionBudgetInstallationTechnique({
  form,
  setField,
  errors,
  disabled,
}: Props) {

  const handleSelectOuiNon = (field: keyof IFormList, relatedField?: keyof IFormList) => (e: SelectChangeEvent<string>) => {
    const val = e.target.value as 'Oui' | 'Non' | undefined;
    setField(field, val);
    if (relatedField && val !== 'Oui') setField(relatedField, '');
  };

  return (
    <Stack spacing={2}>

      {/* Consultation 3 entreprises */}
      <FormControl fullWidth error={!!errors.consultation3Entreprises} disabled={disabled}>
        <InputLabel>Les travaux ont fait l’objet d’une consultation d’au moins 3 entreprises ?</InputLabel>
        <Select
          value={form.consultation3Entreprises || ''}
          onChange={handleSelectOuiNon('consultation3Entreprises', 'casDerogatoireConsultation3Entreprises')}
        >
          <MenuItem value="Oui">Oui</MenuItem>
          <MenuItem value="Non">Non</MenuItem>
        </Select>
        {!!errors.consultation3Entreprises && <FormHelperText>{errors.consultation3Entreprises}</FormHelperText>}
      </FormControl>

      {/* Cas dérogatoire consultation */}
      {form.consultation3Entreprises === 'Non' && (
        <TextField
          label="Cas dérogatoire"
          multiline
          minRows={3}
          fullWidth
          value={form.casDerogatoireConsultation3Entreprises ?? ''}
          onChange={(e) => setField('casDerogatoireConsultation3Entreprises', e.target.value)}
          disabled={disabled}
        />
      )}

      {/* Entreprises fixes */}
      {[1, 2, 3].map((n) => {
        const nomKey = `nomEntreprise${n}` as keyof IFormList;
        const montantKey = `montantDevis${n}` as keyof IFormList;

        return (
          <Box key={n} sx={{ border: '1px solid #ddd', p: 2, borderRadius: 1 }}>
            <Typography variant="subtitle1">Entreprise n°{n}</Typography>
            <TextField
              label={`Nom entreprise n°${n}`}
              fullWidth
              value={form[nomKey] ?? ''}
              onChange={(e) => setField(nomKey, e.target.value)}
              disabled={disabled}
            />
            <TextField
              label={`Montant du devis n°${n}`}
              type="number"
              fullWidth
              value={form[montantKey] ?? ''}
              onChange={(e) => setField(montantKey, Number(e.target.value))}
              disabled={disabled}
              InputProps={{ startAdornment: <InputAdornment position="start">€TTC</InputAdornment> }}
            />
          </Box>
        );
      })}

      {/* Négociation des devis */}
      <FormControl fullWidth error={!!errors.devisNegocies} disabled={disabled}>
        <InputLabel>Les devis ont-ils été négociés ?</InputLabel>
        <Select
          value={form.devisNegocies || ''}
          onChange={handleSelectOuiNon('devisNegocies', 'casDerogatoireDevisNonNegocies')}
        >
          <MenuItem value="Oui">Oui</MenuItem>
          <MenuItem value="Non">Non</MenuItem>
        </Select>
        {!!errors.devisNegocies && <FormHelperText>{errors.devisNegocies}</FormHelperText>}
      </FormControl>

      {/* Cas dérogatoire négociation */}
      {form.devisNegocies === 'Non' && (
        <TextField
          label="Cas dérogatoire"
          multiline
          minRows={3}
          fullWidth
          value={form.casDerogatoireDevisNonNegocies ?? ''}
          onChange={(e) => setField('casDerogatoireDevisNonNegocies', e.target.value)}
          disabled={disabled}
        />
      )}

      {/* Entreprise proposée après négociation */}
      <Box sx={{ border: '1px solid #ddd', p: 2, borderRadius: 1 }}>
        <Typography variant="subtitle1">Entreprise proposée après négociation</Typography>
        <TextField
          label="Nom entreprise proposée"
          fullWidth
          value={form.nomEntrepriseProposee1 ?? ''}
          onChange={(e) => setField('nomEntrepriseProposee1', e.target.value)}
          disabled={disabled}
        />
        <TextField
          label="Montant avant négociation"
          type="number"
          fullWidth
          value={form.montantDevisAvantNegociation1 ?? ''}
          onChange={(e) => setField('montantDevisAvantNegociation1', Number(e.target.value))}
          disabled={disabled}
          InputProps={{ startAdornment: <InputAdornment position="start">€TTC</InputAdornment> }}
        />
        <TextField
          label="Montant après négociation"
          type="number"
          fullWidth
          value={form.montantApresNegociation1 ?? ''}
          onChange={(e) => setField('montantApresNegociation1', Number(e.target.value))}
          disabled={disabled}
          InputProps={{ startAdornment: <InputAdornment position="start">€TTC</InputAdornment> }}
        />
      </Box>

    </Stack>
  );
}
