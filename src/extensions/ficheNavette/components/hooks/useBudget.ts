/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-function-return-type */

// hooks/useBudget.ts
import * as React from 'react';
import type { IFormList, Lot } from '../../Interfaces/IFormList';


export function sumNumbers(...vals: Array<number | undefined>): number {
    return vals.reduce<number>((acc, v) => acc + (typeof v === 'number' ? v : 0), 0);
  }

export function useBudget(form: Partial<IFormList>, setField: (path: string, value: any) => void) {
  const totalLotsHT = React.useMemo(
    () => (form.lots ?? []).reduce((s, l) => s + (Number(l.montantAvantNegociation ?? 0) || 0), 0),
    [form.lots]
  );

  const budgetTotalCalc = React.useMemo(
    () =>
      sumNumbers(
        form.coutTravaux,
        form.honorairesMissionBET,
        form.honorairesMissionBCT,
        form.honorairesMissionCSSI,
        form.honorairesMissionArchitecte,
        form.honorairesMissionCSPS,
        form.honorairesAssurancesTRC_DO,
        form.autres
      ),
    [
      form.coutTravaux,
      form.honorairesMissionBET,
      form.honorairesMissionBCT,
      form.honorairesMissionCSSI,
      form.honorairesMissionArchitecte,
      form.honorairesMissionCSPS,
      form.honorairesAssurancesTRC_DO,
      form.autres
    ]
  );

  React.useEffect(() => {
    const nbLots = (form.lots ?? []).length;
    if (form.nombreDeLots !== nbLots) setField('nombreDeLots', nbLots);

    if ((form.budgetTotal ?? 0) !== budgetTotalCalc) setField('budgetTotal', budgetTotalCalc);
  }, [form.lots, form.nombreDeLots, form.budgetTotal, budgetTotalCalc, setField]);

  return {
    totalLotsHT,
    budgetTotalCalc
  };
}
