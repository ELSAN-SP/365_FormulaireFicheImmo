/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
// Sections/SectionDescription.tsx
import * as React from 'react';
import {
  Card, CardHeader, CardContent, Stack,
  TextField, FormControl, InputLabel, Select, MenuItem, FormHelperText
} from '@mui/material';
import type { IFormList } from '../../Interfaces/IFormList';

type Props = {
  form: Partial<IFormList>;
  setField: (path: string, value: any) => void;
  errors: Record<string, string>;
  disabled?: boolean;
};

export default function SectionDescription({ form, setField, errors, disabled }: Props) {
  const { typeDeDemande } = form;

  if (!typeDeDemande) return null;

  return (
    <Card>
      <CardHeader title="Description du projet" />
      <CardContent>
        <Stack spacing={2}>

          {/* Description commune */}
          <TextField
            label="Description"
            fullWidth
            multiline
            minRows={3}
            value={form.description ?? ''}
            onChange={(e) => setField('description', e.target.value)}
            disabled={disabled}
            error={!!errors.description}
            helperText={errors.description}
          />

          {/* Installations Techniques */}
          {typeDeDemande === "Installations Techniques" && (
            <>
              <FormControl fullWidth error={!!errors.miseEnConformite} disabled={disabled}>
                <InputLabel id="miseEnConformite-label">S’agit-il d’une mise en conformité ?</InputLabel>
                <Select
                  labelId="miseEnConformite-label"
                  id="miseEnConformite"
                  value={form.miseEnConformite || ""}
                  label="S’agit-il d’une mise en conformité ?"
                  onChange={(e) => setField('miseEnConformite', e.target.value)}
                >
                  <MenuItem value="Oui">Oui</MenuItem>
                  <MenuItem value="Non">Non</MenuItem>
                </Select>
                {!!errors.miseEnConformite && <FormHelperText>{errors.miseEnConformite}</FormHelperText>}
              </FormControl>

              <FormControl fullWidth error={!!errors.suitePrescriptionCommissionSecurite} disabled={disabled}>
                <InputLabel id="prescriptionCommission-label">Suite à une prescription de la commission de sécurité ?</InputLabel>
                <Select
                  labelId="prescriptionCommission-label"
                  id="prescriptionCommission"
                  value={form.suitePrescriptionCommissionSecurite || ""}
                  label="Suite à une prescription de la commission de sécurité ?"
                  onChange={(e) => setField('suitePrescriptionCommissionSecurite', e.target.value)}
                >
                  <MenuItem value="Oui">Oui</MenuItem>
                  <MenuItem value="Non">Non</MenuItem>
                </Select>
                {!!errors.suitePrescriptionCommissionSecurite && <FormHelperText>{errors.suitePrescriptionCommissionSecurite}</FormHelperText>}
              </FormControl>

              <FormControl fullWidth error={!!errors.suitePrescriptionBureauControle} disabled={disabled}>
                <InputLabel id="prescriptionBureau-label">Ou à une prescription du bureau de contrôle ?</InputLabel>
                <Select
                  labelId="prescriptionBureau-label"
                  id="prescriptionBureau"
                  value={form.suitePrescriptionBureauControle || ""}
                  label="Ou à une prescription du bureau de contrôle ?"
                  onChange={(e) => setField('suitePrescriptionBureauControle', e.target.value)}
                >
                  <MenuItem value="Oui">Oui</MenuItem>
                  <MenuItem value="Non">Non</MenuItem>
                </Select>
                {!!errors.suitePrescriptionBureauControle && <FormHelperText>{errors.suitePrescriptionBureauControle}</FormHelperText>}
              </FormControl>

              <FormControl fullWidth error={!!errors.suiteVetuste} disabled={disabled}>
                <InputLabel id="vetuste-label">Ou à une vétusté ?</InputLabel>
                <Select
                  labelId="vetuste-label"
                  id="vetuste"
                  value={form.suiteVetuste || ""}
                  label="Ou à une vétusté ?"
                  onChange={(e) => setField('suiteVetuste', e.target.value)}
                >
                  <MenuItem value="Oui">Oui</MenuItem>
                  <MenuItem value="Non">Non</MenuItem>
                </Select>
                {!!errors.suiteVetuste && <FormHelperText>{errors.suiteVetuste}</FormHelperText>}
              </FormControl>
            </>
          )}

          {/* Projets Immobiliers */}
          {typeDeDemande === "Projets Immobiliers" && (
            <>
              <FormControl fullWidth error={!!errors.businessPlanPresente} disabled={disabled}>
                <InputLabel id="businessPlan-label">Un Business Plan a-t-il été présenté ?</InputLabel>
                <Select
                  labelId="businessPlan-label"
                  id="businessPlan"
                  value={form.businessPlanPresente || ""}
                  label="Un Business Plan a-t-il été présenté ?"
                  onChange={(e) => {
                    const val = e.target.value as "Oui" | "Non" | undefined;
                    setField('businessPlanPresente', val);
                    if (val === "Oui") setField('casDerogatoireBusinessPlanRaison', '');
                  }}
                >
                  <MenuItem value="Oui">Oui</MenuItem>
                  <MenuItem value="Non">Non</MenuItem>
                </Select>
                {!!errors.businessPlanPresente && <FormHelperText>{errors.businessPlanPresente}</FormHelperText>}
              </FormControl>

              {form.businessPlanPresente === "Non" && (
                <TextField
                  label="Cas dérogatoire"
                  multiline
                  minRows={3}
                  fullWidth
                  placeholder="Raison du cas dérogatoire"
                  value={form.casDerogatoireBusinessPlanRaison ?? ''}
                  onChange={(e) => setField('casDerogatoireBusinessPlanRaison', e.target.value)}
                  disabled={disabled}
                  error={!!errors.casDerogatoireBusinessPlanRaison}
                  helperText={errors.casDerogatoireBusinessPlanRaison}
                />
              )}

              <FormControl fullWidth error={!!errors.demandeARS} disabled={disabled}>
                <InputLabel id="demandeARS-label">S’agit-il d’une demande de l’ARS ?</InputLabel>
                <Select
                  labelId="demandeARS-label"
                  id="demandeARS"
                  value={form.demandeARS || ""}
                  label="S’agit-il d’une demande de l’ARS ?"
                  onChange={(e) => setField('demandeARS', e.target.value)}
                >
                  <MenuItem value="Oui">Oui</MenuItem>
                  <MenuItem value="Non">Non</MenuItem>
                </Select>
                {!!errors.demandeARS && <FormHelperText>{errors.demandeARS}</FormHelperText>}
              </FormControl>
            </>
          )}

          {/* Champ commun */}
          <TextField
            label="Pourquoi ces travaux ne sont-ils pas imputés sur le CAPEX courant ?"
            multiline
            minRows={4}
            fullWidth
            value={form.raisonNonImputationCAPEX ?? ''}
            onChange={(e) => setField('raisonNonImputationCAPEX', e.target.value)}
            disabled={disabled}
            error={!!errors.raisonNonImputationCAPEX}
            helperText={errors.raisonNonImputationCAPEX}
          />

        </Stack>
      </CardContent>
    </Card>
  );
}
