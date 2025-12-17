// Sections/SectionMessageValidation.tsx
import * as React from 'react';
import { Snackbar, Alert } from '@mui/material';

interface Props {
  open: boolean;
  message: string;
  onClose: () => void;
}

export default function SectionMessageValidation({ open, message, onClose }: Props) {
  return (
    <Snackbar
      open={open}
      autoHideDuration={4000}
      onClose={onClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
    >
      <Alert severity="error" onClose={onClose} sx={{ width: '100%' }}>
        {message}
      </Alert>
    </Snackbar>
  );
}
