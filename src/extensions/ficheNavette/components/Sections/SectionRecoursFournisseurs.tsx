/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
// Sections/SectionRecoursFournisseursReferences.tsx
import * as React from 'react';
import {
  Card, CardHeader, CardContent, Stack,
  FormControl, InputLabel, Select, MenuItem,
  TextField, FormHelperText
} from '@mui/material';
import type { IFormList } from '../../Interfaces/IFormList';
import type { SelectChangeEvent } from '@mui/material/Select';

type Props = {
  form: Partial<IFormList>;
  setField: (path: string, value: any) => void;
  errors: Record<string, string>;
  disabled?: boolean;
};

export default function SectionRecoursFournisseurs({
  form, setField, errors, disabled
}: Props) {

  if (!form.typeDeDemande) return null;

  //-- Gestion standard Oui/Non + reset champ associé
  const handleSelectOuiNon = (field: keyof IFormList, relatedField?: keyof IFormList) =>
    (e: SelectChangeEvent<string>) => {
      const val = e.target.value as 'Oui' | 'Non' | undefined;
      setField(field, val);

      if (relatedField && val !== 'Non') {
        // si on passe de "Non" → "Oui", alors vider le champ dérogatoire
        setField(relatedField, '');
      }
    };

  return (
    <Card>
      <CardHeader title="Recours aux fournisseurs référencés" />
      <CardContent>
        <Stack spacing={2}>

          {/* Matériaux référencés */}
          <FormControl fullWidth error={!!errors.materiauxGroupe} disabled={disabled}>
            <InputLabel id="materiauxReference-label">
              Les matériaux/matériels mis en œuvre sont ceux référencés par le Groupe
            </InputLabel>

            <Select
              labelId="materiauxReference-label"
              value={form.materiauxGroupe || ''}
              label="Les matériaux/matériels mis en œuvre sont ceux référencés par le Groupe"
              onChange={handleSelectOuiNon('materiauxGroupe', 'casDerogatoireMateriaux')}
            >
              <MenuItem value="Oui">Oui</MenuItem>
              <MenuItem value="Non">Non</MenuItem>
            </Select>

            {!!errors.materiauxGroupe && (
              <FormHelperText>{errors.materiauxGroupe}</FormHelperText>
            )}
          </FormControl>

          {/* Cas dérogatoire → visible seulement si "Non" */}
          {form.materiauxGroupe === 'Non' && (
            <TextField
              label="Cas dérogatoire"
              multiline
              minRows={3}
              fullWidth
              placeholder="Raison du cas dérogatoire"
              value={form.casDerogatoireMateriaux ?? ''}
              onChange={(e) => setField('casDerogatoireMateriaux', e.target.value)}
              disabled={disabled}
              error={!!errors.casDerogatoireMateriaux}
              helperText={errors.casDerogatoireMateriaux}
            />
          )}

          {/* Nom fournisseurs référencés → toujours visible */}
          <TextField
            label="Nom des fournisseurs référencés auxquels il est fait appel sur ce projet"
            multiline
            minRows={3}
            fullWidth
            value={form.nomFournisseursReference ?? ''}
            placeholder="Nom des fournisseurs référencés"
            onChange={(e) => setField('nomFournisseursReference', e.target.value)}
            disabled={disabled}
            error={!!errors.nomFournisseursReference}
            helperText={errors.nomFournisseursReference}
          />
        </Stack>
      </CardContent>
    </Card>
  );
}
