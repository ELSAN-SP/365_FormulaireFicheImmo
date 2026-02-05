/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
// Sections/SectionBudgetMain.tsx
import * as React from 'react';
import { Card, CardHeader, CardContent } from '@mui/material';
import type { IFormList } from '../../Interfaces/IFormList';

import SectionBudgetProjetImmo from './SectionBudgetProjetImmo';
import SectionBudgetInstallationTechnique from './SectionBudgetInstallationTechnique';

type Props = {
  form: Partial<IFormList>;
  setField: (path: string, value: any) => void;
  errors: Record<string, string>;
  disabled?: boolean;
};

export default function SectionBudgetMain(props: Props) {
  const { form } = props;

  if (!form.typeDeDemande) return null;

  return (
    <Card>
      <CardHeader title="Lots et devis" />
      <CardContent>
        {form.typeDeDemande === 'Projets Immobiliers' ? (
          <SectionBudgetProjetImmo {...props} />
        ) : (
          <SectionBudgetInstallationTechnique {...props} />
        )}
      </CardContent>
    </Card>
  );
}