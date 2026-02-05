/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
// Sections/SectionEconomieEnergie.tsx
import * as React from 'react';
import { Card, CardHeader, CardContent, Stack, TextField, FormControl, InputLabel, Select, MenuItem, FormHelperText, Typography, InputAdornment } from '@mui/material';
import type { IFormList } from '../../Interfaces/IFormList';
import type { SelectChangeEvent } from '@mui/material/Select';

type Props = {
  form: Partial<IFormList>;
  setField: (path: string, value: any) => void;
  errors: Record<string, string>;
  disabled?: boolean;
};

export default function SectionEconomieEnergie({ form, setField, errors, disabled }: Props) {
  if (!form.typeDeDemande) return null;

  const handleSelectOuiNon = (field: keyof IFormList, relatedField?: keyof IFormList) => (e: SelectChangeEvent<string>) => {
    const val = e.target.value as 'Oui' | 'Non' | undefined;
    setField(field, val);
    if (relatedField && val !== 'Oui') setField(relatedField, '');
  };

  return (
    <Card>
      <CardHeader title="Economies d’énergie" />
      <CardContent>
        <Stack spacing={2}>

          {/* Travaux générant des économies d'énergie */}
          <FormControl fullWidth error={!!errors.travauxGenerentEconomiesEnergie} disabled={disabled}>
            <InputLabel id="EconomieEnergie-label">Les travaux génèrent-ils des économies d’énergie ?</InputLabel>
            <Select
              labelId="EconomieEnergie-label"
              value={form.travauxGenerentEconomiesEnergie || ''}
              label="Les travaux génèrent-ils des économies d’énergie ?"
              onChange={handleSelectOuiNon('travauxGenerentEconomiesEnergie', 'estimationEconomieKWH')}
            >
              <MenuItem value="Oui">Oui</MenuItem>
              <MenuItem value="Non">Non</MenuItem>
            </Select>
            {!!errors.travauxGenerentEconomiesEnergie && <FormHelperText>{errors.travauxGenerentEconomiesEnergie}</FormHelperText>}
          </FormControl>

          {form.travauxGenerentEconomiesEnergie === 'Oui' && (
            <TextField
              label="Estimation économie en KWH/h"
              type="number"
              fullWidth
              value={form.estimationEconomieKWH ?? ''}
              onChange={(e) => setField('estimationEconomieKWH', e.target.value)}
              disabled={disabled}
              error={!!errors.estimationEconomieKWH}
              helperText={errors.estimationEconomieKWH}
            />
          )}

          {/* Eligibles aux CEE */}
          <FormControl fullWidth error={!!errors.eligiblesCEE} disabled={disabled}>
            <InputLabel id="EligibleCEE-label">Eligibles aux CEE ?</InputLabel>
            <Select
              labelId="EligibleCEE-label"
              value={form.eligiblesCEE || ''}
              label="Eligibles aux CEE ?"
              onChange={handleSelectOuiNon('eligiblesCEE', 'montantEstimeCEE')}
            >
              <MenuItem value="Oui">Oui</MenuItem>
              <MenuItem value="Non">Non</MenuItem>
            </Select>
            {!!errors.eligiblesCEE && <FormHelperText>{errors.eligiblesCEE}</FormHelperText>}
          </FormControl>

          {form.eligiblesCEE === 'Oui' && (
            <TextField
              label="Montant si connu"
              type="number"
              fullWidth
              value={form.montantEstimeCEE ?? ''}
              onChange={(e) => setField('montantEstimeCEE', e.target.value)}
              disabled={disabled}
              InputProps={{
                startAdornment: <InputAdornment position="start">€TTC</InputAdornment>,
              }}
              error={!!errors.montantEstimeCEE}
              helperText={errors.montantEstimeCEE}
            />
          )}

          {/* Autres subventions */}
          <FormControl fullWidth error={!!errors.autresSubventions} disabled={disabled}>
            <InputLabel id="AutreSubvention-label">Autres subventions ?</InputLabel>
            <Select
              labelId="AutreSubvention-label"
              value={form.autresSubventions || ''}
              label="Autres subventions ?"
              onChange={handleSelectOuiNon('autresSubventions', 'montantEstimeSubventions')}
            >
              <MenuItem value="Oui">Oui</MenuItem>
              <MenuItem value="Non">Non</MenuItem>
            </Select>
            {!!errors.autresSubventions && <FormHelperText>{errors.autresSubventions}</FormHelperText>}
          </FormControl>

          {form.autresSubventions === 'Oui' && (
            <TextField
              label="Montant si connu"
              type="number"
              fullWidth
              value={form.montantEstimeSubventions ?? ''}
              onChange={(e) => setField('montantEstimeSubventions', e.target.value)}
              disabled={disabled}
              InputProps={{
                startAdornment: <InputAdornment position="start">€TTC</InputAdornment>,
              }}
              error={!!errors.montantEstimeSubventions}
              helperText={errors.montantEstimeSubventions}
            />
          )}

        </Stack>
      </CardContent>
    </Card>
  );
}
