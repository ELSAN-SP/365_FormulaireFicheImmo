
// Sections/SectionActions.tsx
import * as React from 'react';
import { Stack, Button } from '@mui/material';

type Props = { onSave: () => void; onCancel: () => void; disabled?: boolean };

export default function SectionActions({ onSave, onCancel, disabled }: Props): JSX.Element {
  return (
    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center" justifyContent={{ xs: 'center', sm: 'flex-end' }}>
      <Button variant="contained" color="primary" onClick={onSave} disabled={disabled}>Valider</Button>
      <Button variant="outlined" onClick={onCancel}>Annuler</Button>
    </Stack>
  );
}
