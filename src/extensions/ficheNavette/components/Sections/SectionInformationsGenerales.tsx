
import * as React from 'react';
import {
  Card, CardHeader, CardContent,
  TextField, FormControl, InputLabel, Select, MenuItem, FormHelperText, Stack
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material/Select';
import * as dayjs from 'dayjs';
import type { IFormList } from '../../Interfaces/IFormList';

type Props = {
  form: Partial<IFormList>;
  setField: (path: string, value: any) => void;
  errors: Record<string, string>;
  disabled?: boolean;
};

export default function SectionInformationsGenerales({ form, setField, errors, disabled }: Props): JSX.Element {
  // Select de priorité → string côté MUI, conversion vers 1|2|3|''
  const priorityValue: string =
    form.niveauDePriorite === '' || form.niveauDePriorite === undefined
      ? ''
      : String(form.niveauDePriorite);

  const handlePriorityChange = (e: SelectChangeEvent<string>) => {
    const raw = e.target.value;
    const parsed = raw === '' ? '' : (parseInt(raw, 10) as 1 | 2 | 3);
    setField('niveauDePriorite', parsed);
  };

  const dateValue = form.date ? dayjs(form.date).format('YYYY-MM-DD') : '';

  return (
        <Stack spacing={2}>
          <TextField
            label="Nom du projet"
            fullWidth
            value={form.nomDuProjet ?? ''}
            onChange={(e) => setField('nomDuProjet', e.target.value)}
            error={!!errors.nomDuProjet}
            helperText={errors.nomDuProjet}
            disabled={disabled}
          />

        {/* Priorité */}
          <FormControl fullWidth error={!!errors.niveauDePriorite} disabled={disabled}>
            <InputLabel>Niveau de priorité</InputLabel>
            <Select<string> value={priorityValue} onChange={handlePriorityChange} label="Niveau de priorité">
              <MenuItem value="">—</MenuItem>
              <MenuItem value="1">1</MenuItem>
              <MenuItem value="2">2</MenuItem>
              <MenuItem value="3">3</MenuItem>
            </Select>
            {!!errors.niveauDePriorite && <FormHelperText>{errors.niveauDePriorite}</FormHelperText>}
          </FormControl>

          <FormControl fullWidth disabled={disabled}>
            <InputLabel>Projet déjà présenté en N-1 ?</InputLabel>
            <Select
              value={form.projetDejaPresenteEnN1 ?? ''}
              onChange={(e) => setField('projetDejaPresenteEnN1', e.target.value)}
              label="Projet déjà présenté en N-1 ?"
            >
              <MenuItem value="">—</MenuItem>
              <MenuItem value="Oui">Oui</MenuItem>
              <MenuItem value="Non">Non</MenuItem>
            </Select>
          </FormControl>
         
          <TextField
            label="Année du projet"
            type="number"
            fullWidth
            value={form.anneeDeRealisationDuProjet ?? ''}
            onChange={(e) => setField('anneeDeRealisationDuProjet', Number(e.target.value))}
            disabled={disabled}
          />

          <FormControl fullWidth disabled={disabled}>
            <InputLabel>Projet pluriannuel ?</InputLabel>
            <Select
              value={form.projetPluriannuel ?? ''}
              onChange={(e) => setField('projetPluriannuel', e.target.value)}
              label="Projet pluriannuel ?"
            >
              <MenuItem value="">—</MenuItem>
              <MenuItem value="Oui">Oui</MenuItem>
              <MenuItem value="Non">Non</MenuItem>
            </Select>
          </FormControl>
        </Stack>
  );
}
