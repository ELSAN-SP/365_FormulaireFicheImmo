// Sections/SectionIntervenants.tsx
import * as React from 'react';
import { Card, CardHeader, CardContent, Stack, TextField, FormControl, InputLabel, Select, MenuItem, FormHelperText } from '@mui/material';
import type { IFormList } from '../../Interfaces/IFormList';
import type { SelectChangeEvent } from '@mui/material/Select';

type Props = {
  form: Partial<IFormList>;
  setField: (path: string, value: any) => void;
  errors: Record<string, string>;
  disabled?: boolean;
};

export default function SectionIntervenants({ form, setField, errors, disabled }: Props) {
  const { typeDeDemande } = form;

  if (!typeDeDemande) return null;

  // Helper pour les Select Oui/Non et vider le champ lié si Non
  const handleSelectOuiNon = (field: keyof IFormList, relatedField?: keyof IFormList) => (e: SelectChangeEvent<string>) => {
    const val = e.target.value as 'Oui' | 'Non' | undefined;
    setField(field, val);
    if (relatedField && val !== 'Oui') setField(relatedField, '');
  };

  return (
    <Card>
      <CardHeader title="Intervenants" />
      <CardContent>
        <Stack spacing={2}>

          {/* BET */}
          <FormControl fullWidth error={!!errors.besoinBET} disabled={disabled}>
            <InputLabel id="besoinBET-label">Avez-vous besoin d’un BET ?</InputLabel>
            <Select
              labelId="besoinBET-label"
              value={form.besoinBET || ''}
              label="Avez-vous besoin d’un BET ?"
              onChange={handleSelectOuiNon('besoinBET', 'nomBET')}
            >
              <MenuItem value="Oui">Oui</MenuItem>
              <MenuItem value="Non">Non</MenuItem>
            </Select>
            {!!errors.besoinBET && <FormHelperText>{errors.besoinBET}</FormHelperText>}
          </FormControl>

          {form.besoinBET === 'Oui' && (
            <TextField
              label="Nom BET"
              fullWidth
              value={form.nomBET ?? ''}
              onChange={(e) => setField('nomBET', e.target.value)}
              disabled={disabled}
              error={!!errors.nomBET}
              helperText={errors.nomBET}
            />
          )}

          {/* BCT */}
          <FormControl fullWidth error={!!errors.besoinBCT} disabled={disabled}>
            <InputLabel id="besoinBCT-label">Avez-vous besoin d’un BCT ?</InputLabel>
            <Select
              labelId="besoinBCT-label"
              value={form.besoinBCT || ''}
              label="Avez-vous besoin d’un BCT ?"
              onChange={handleSelectOuiNon('besoinBCT', 'nomBCT')}
            >
              <MenuItem value="Oui">Oui</MenuItem>
              <MenuItem value="Non">Non</MenuItem>
            </Select>
            {!!errors.besoinBCT && <FormHelperText>{errors.besoinBCT}</FormHelperText>}
          </FormControl>

          {form.besoinBCT === 'Oui' && (
            <TextField
              label="Nom BCT"
              fullWidth
              value={form.nomBCT ?? ''}
              onChange={(e) => setField('nomBCT', e.target.value)}
              disabled={disabled}
              error={!!errors.nomBCT}
              helperText={errors.nomBCT}
            />
          )}

          {/* CSSI */}
          <FormControl fullWidth error={!!errors.besoinCSSI} disabled={disabled}>
            <InputLabel id="besoinCSSI-label">Avez-vous besoin d’un CSSI ?</InputLabel>
            <Select
              labelId="besoinCSSI-label"
              value={form.besoinCSSI || ''}
              label="Avez-vous besoin d’un CSSI ?"
              onChange={handleSelectOuiNon('besoinCSSI', 'nomCSSI')}
            >
              <MenuItem value="Oui">Oui</MenuItem>
              <MenuItem value="Non">Non</MenuItem>
            </Select>
            {!!errors.besoinCSSI && <FormHelperText>{errors.besoinCSSI}</FormHelperText>}
          </FormControl>

          {form.besoinCSSI === 'Oui' && (
            <TextField
              label="Nom CSSI"
              fullWidth
              value={form.nomCSSI ?? ''}
              onChange={(e) => setField('nomCSSI', e.target.value)}
              disabled={disabled}
              error={!!errors.nomCSSI}
              helperText={errors.nomCSSI}
            />
          )}

          {/* Champs spécifiques aux Projets Immobiliers */}
          {typeDeDemande === 'Projets Immobiliers' && (
            <>
              {/* Architecte */}
              <FormControl fullWidth error={!!errors.besoinArchitecte} disabled={disabled}>
                <InputLabel id="besoinArchitecte-label">Avez-vous besoin d’un architecte ?</InputLabel>
                <Select
                  labelId="besoinArchitecte-label"
                  value={form.besoinArchitecte || ''}
                  label="Avez-vous besoin d’un architecte ?"
                  onChange={handleSelectOuiNon('besoinArchitecte', 'nomArchitecte')}
                >
                  <MenuItem value="Oui">Oui</MenuItem>
                  <MenuItem value="Non">Non</MenuItem>
                </Select>
                {!!errors.besoinArchitecte && <FormHelperText>{errors.besoinArchitecte}</FormHelperText>}
              </FormControl>

              {form.besoinArchitecte === 'Oui' && (
                <TextField
                  label="Nom Architecte"
                  fullWidth
                  value={form.nomArchitecte ?? ''}
                  onChange={(e) => setField('nomArchitecte', e.target.value)}
                  disabled={disabled}
                  error={!!errors.nomArchitecte}
                  helperText={errors.nomArchitecte}
                />
              )}

              {/* CSPS */}
              <FormControl fullWidth error={!!errors.besoinCSPS} disabled={disabled}>
                <InputLabel id="besoinCSPS-label">Avez-vous besoin d’un CSPS ?</InputLabel>
                <Select
                  labelId="besoinCSPS-label"
                  value={form.besoinCSPS || ''}
                  label="Avez-vous besoin d’un CSPS ?"
                  onChange={handleSelectOuiNon('besoinCSPS', 'nomCSPS')}
                >
                  <MenuItem value="Oui">Oui</MenuItem>
                  <MenuItem value="Non">Non</MenuItem>
                </Select>
                {!!errors.besoinCSPS && <FormHelperText>{errors.besoinCSPS}</FormHelperText>}
              </FormControl>

              {form.besoinCSPS === 'Oui' && (
                <TextField
                  label="Nom CSPS"
                  fullWidth
                  value={form.nomCSPS ?? ''}
                  onChange={(e) => setField('nomCSPS', e.target.value)}
                  disabled={disabled}
                  error={!!errors.nomCSPS}
                  helperText={errors.nomCSPS}
                />
              )}
            </>
          )}

        </Stack>
      </CardContent>
    </Card>
  );
}
