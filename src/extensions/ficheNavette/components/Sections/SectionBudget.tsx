// Sections/SectionBudget.tsx
import * as React from 'react';
import { Card, CardHeader, CardContent, Stack, TextField, FormControl, InputLabel, Select, MenuItem, FormHelperText, InputAdornment } from '@mui/material';
import type { IFormList } from '../../Interfaces/IFormList';
import type { SelectChangeEvent } from '@mui/material/Select';
import { useBudget } from '../hooks/useBudget';

type Props = {
  form: Partial<IFormList>;
  setField: (path: string, value: any) => void;
  errors: Record<string, string>;
  disabled?: boolean;
};

export default function SectionBudget({ form, setField, errors, disabled }: Props) {
  if (!form.typeDeDemande) return null;

  const { budgetTotalCalc } = useBudget(form, setField); 

  const handleSelectOuiNon = (field: keyof IFormList, relatedField?: keyof IFormList) => (e: SelectChangeEvent<string>) => {
    const val = e.target.value as 'Oui' | 'Non' | undefined;
    setField(field, val);
    if (relatedField && val !== 'Oui') setField(relatedField, '');
  };

  return (
    <Card>
      <CardHeader title="Budget d’investissement" />
      <CardContent>
        <Stack spacing={2}>

          {/* Coût travaux / équipements techniques */}
          <TextField
            label="Coût travaux / équipements techniques"
            type="number"
            fullWidth
            value={form.coutTravaux ?? ''}
            onChange={(e) => setField('coutTravaux', Number(e.target.value))}
            disabled={disabled}
            InputProps={{ startAdornment: <InputAdornment position="start">€TTC</InputAdornment> }}
            error={!!errors.coutTravaux}
            helperText={errors.coutTravaux}
          />

          {/* Honoraires BET */}
          <TextField
            label="Honoraires mission BET"
            type="number"
            fullWidth
            value={form.honorairesMissionBET ?? ''}
            onChange={(e) => setField('honorairesMissionBET', Number(e.target.value))}
            disabled={disabled}
            InputProps={{ startAdornment: <InputAdornment position="start">€TTC</InputAdornment> }}
            error={!!errors.honorairesMissionBET}
            helperText={errors.honorairesMissionBET}
          />

          {/* Honoraires BCT */}
          <TextField
            label="Honoraires mission BCT"
            type="number"
            fullWidth
            value={form.honorairesMissionBCT ?? ''}
            onChange={(e) => setField('honorairesMissionBCT', Number(e.target.value))}
            disabled={disabled}
            InputProps={{ startAdornment: <InputAdornment position="start">€TTC</InputAdornment> }}
            error={!!errors.honorairesMissionBCT}
            helperText={errors.honorairesMissionBCT}
          />

          {/* Honoraires CSSI */}
          <TextField
            label="Honoraires mission CSSI"
            type="number"
            fullWidth
            value={form.honorairesMissionCSSI ?? ''}
            onChange={(e) => setField('honorairesMissionCSSI', Number(e.target.value))}
            disabled={disabled}
            InputProps={{ startAdornment: <InputAdornment position="start">€TTC</InputAdornment> }}
            error={!!errors.honorairesMissionCSSI}
            helperText={errors.honorairesMissionCSSI}
          />

          {/* Projets Immobiliers : architecte, CSPS, TRC/DO */}
          {form.typeDeDemande === 'Projets Immobiliers' && (
            <>
              <TextField
                label="Honoraires mission architecte"
                type="number"
                fullWidth
                value={form.honorairesMissionArchitecte ?? ''}
                onChange={(e) => setField('honorairesMissionArchitecte', Number(e.target.value))}
                disabled={disabled}
                InputProps={{ startAdornment: <InputAdornment position="start">€TTC</InputAdornment> }}
                error={!!errors.honorairesMissionArchitecte}
                helperText={errors.honorairesMissionArchitecte}
              />

              <TextField
                label="Honoraires mission CSPS"
                type="number"
                fullWidth
                value={form.honorairesMissionCSPS ?? ''}
                onChange={(e) => setField('honorairesMissionCSPS', Number(e.target.value))}
                disabled={disabled}
                InputProps={{ startAdornment: <InputAdornment position="start">€TTC</InputAdornment> }}
                error={!!errors.honorairesMissionCSPS}
                helperText={errors.honorairesMissionCSPS}
              />

              <TextField
                label="Honoraires assurances TRC/DO"
                type="number"
                fullWidth
                value={form.honorairesAssurancesTRC_DO ?? ''}
                onChange={(e) => setField('honorairesAssurancesTRC_DO', Number(e.target.value))}
                disabled={disabled}
                InputProps={{ startAdornment: <InputAdornment position="start">€TTC</InputAdornment> }}
                error={!!errors.honorairesAssurancesTRC_DO}
                helperText={errors.honorairesAssurancesTRC_DO}
              />
            </>
          )}

          {/* Autres coûts */}
          <TextField
            label="Autre"
            type="number"
            fullWidth
            value={form.autres ?? ''}
            onChange={(e) => setField('autres', Number(e.target.value))}
            disabled={disabled}
            InputProps={{ startAdornment: <InputAdornment position="start">€TTC</InputAdornment> }}
            error={!!errors.autres}
            helperText={errors.autres}
          />

          {/* Budget total */}
          <TextField
            label="Budget total"
            type="number"
            fullWidth
            value={form.budgetTotal ?? 0}
            InputProps={{ startAdornment: <InputAdornment position="start">€TTC</InputAdornment> }}
            disabled
          />

        </Stack>
      </CardContent>
    </Card>
  );
}
