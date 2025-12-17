
// Sections/SectionTypeDeDemande.tsx
import * as React from 'react';
import { Card, CardHeader, CardContent, FormControl, InputLabel, Select, MenuItem, FormHelperText } from '@mui/material';
import type { IFormList } from '../../Interfaces/IFormList';

type Props = {
  value: IFormList['typeDeDemande']; // "Installations Techniques" | "Projets Immobiliers" | ""
  onChange: (val: IFormList['typeDeDemande']) => void;
  errorText?: string;
  disabled?: boolean;
};

export default function SectionTypeDeDemande({ value, onChange, errorText, disabled }: Props): JSX.Element {
  return (
    <FormControl fullWidth required error={!!errorText} disabled={disabled}>
    <InputLabel>Type de demande</InputLabel>
    <Select
      value={value ?? ""}
      label="Type de demande"         
      onChange={(e) => onChange(e.target.value as Props['value'])}
    >
      <MenuItem value="Installations Techniques">Installations Techniques</MenuItem>
      <MenuItem value="Projets Immobiliers">Projets Immobiliers</MenuItem>
    </Select>
    {!!errorText && <FormHelperText>{errorText}</FormHelperText>}
  </FormControl>
  );
}
