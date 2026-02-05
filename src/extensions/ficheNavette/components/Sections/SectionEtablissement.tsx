/* eslint-disable @typescript-eslint/no-explicit-any */

// Sections/SectionEtablissement.tsx
import * as React from 'react';
import {  FormHelperText, TextField, LinearProgress
} from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';

import type { IEstablishmentCode } from '../../Interfaces/IEtablishmentCode';

type Props = {
  etablissement: string;                      // libellé affiché/stocké (ex: "Clinique Saint-Jean")
  codeEtab: string;                           // code (ex: "SJ01")
  establishments: IEstablishmentCode[];       // référentiel chargé
  setField: (path: string, value: any) => void;
  errorText?: string;                         // erreur de validation pour le champ établissement
  disabled?: boolean;
  loading?: boolean;                          // état de chargement du référentiel
  error?: string;                             // message d’erreur lors du chargement référentiel
};

export default function SectionEtablissement({
  etablissement,
  codeEtab,
  establishments,
  setField,
  errorText,
  disabled,
  loading = false,
  error = ''
}: Props): JSX.Element {

  // valeur courante (objet) reconstruite à partir du code
  const valueObj = React.useMemo(
    () => (establishments ?? []).find(e => e.code === (codeEtab ?? '')) ?? null,
    [establishments, codeEtab]
  );

  // rendu
  return (
     <div>
        {/* Loader + erreur référentiel (chargement) */}
        {loading && <LinearProgress sx={{ mb: 2 }} />}
        {!!error && <FormHelperText error sx={{ mb: 2 }}>{error}</FormHelperText>}

        <Autocomplete
          disablePortal
          loading={loading}
          options={establishments ?? []}
          value={valueObj}
          getOptionLabel={(opt) => `${opt.title} (${opt.code})`}
       
          filterOptions={(options, state) => {
            const q = (state.inputValue ?? '').trim().toLowerCase();
            if (!q) return options;
            return options.filter(o =>
              o.title.toLowerCase().includes(q) ||
              o.code.toLowerCase().includes(q)
            );
          }}
          onChange={(_, selected: IEstablishmentCode | null) => {
            // mapping  : codeEtab = code ; etablissement = libellé
            setField('codeEtab', selected?.code ?? '');
            setField('etablissement', selected?.title ?? '');
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Établissement"
              required
              error={!!errorText}
              helperText={errorText}
              disabled={disabled || loading}
            />
          )}
          noOptionsText={loading ? 'Chargement...' : 'Aucun établissement'}
          isOptionEqualToValue={(opt, val) => opt.code === val.code}
        />
    </div>
  );
}
