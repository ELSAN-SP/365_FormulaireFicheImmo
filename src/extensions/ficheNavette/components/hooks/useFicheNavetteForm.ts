/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-explicit-any */
// hooks/useFicheNavetteForm.ts
import * as React from 'react';
import type { IFormList, Lot } from '../../Interfaces/IFormList';

//--- Utilitaires locaux
function safeClone<T>(obj: T): T {
  if (typeof (globalThis as any).structuredClone === 'function') {
    return (globalThis as any).structuredClone(obj);
  }
  return JSON.parse(JSON.stringify(obj ?? {}));
}

function setByPath<T extends object>(obj: T, path: string, value: any): T {
  const clone: any = safeClone(obj ?? {});
  const parts = path.split('.');
  let cur = clone;
  for (let i = 0; i < parts.length - 1; i++) {
    const p = parts[i];
    if (cur[p] === null) cur[p] = {};
    cur = cur[p];
  }
  cur[parts[parts.length - 1]] = value;
  return clone;
}

function makeUuid(): string {
  const crypto = (globalThis as any).crypto;
  if (crypto?.randomUUID) return crypto.randomUUID();
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0;
    return (c === 'x' ? r : ((r & 0x3) | 0x8)).toString(16);
  });
}

//--- Types
export type AllErrors = Partial<Record<string, string>>;

//--- Hook principal
export function useFicheNavetteForm(initial?: Partial<IFormList>) {
  //--- États principaux
  const [form, setForm] = React.useState<Partial<IFormList>>({
    typeDeDemande: "",
    nomDuProjet: "",
    etablissement: "",
    codeEtab: "",
    niveauDePriorite: "",
    lots: [],
    ...(initial ?? {})
  });
  const [errors, setErrors] = React.useState<AllErrors>({});
  const [dirty, setDirty] = React.useState(false);

  //--- Mutateurs formulaire
  const setField = React.useCallback((path: string, value: any) => {
    setForm(prev => setByPath(prev, path, value));
    setErrors(prev => ({ ...prev, [path]: '' }));
    setDirty(true);
  }, []);

  const hydrate = React.useCallback((data: Partial<IFormList>) => {
    setForm(safeClone(data));
    setErrors({});
    setDirty(false);
  }, []);

  const reset = React.useCallback(() => {
    setForm({
      typeDeDemande: "",
      nomDuProjet: "",
      etablissement: "",
      codeEtab: "",
      niveauDePriorite: "",
      lots: []
    });
    setErrors({});
    setDirty(false);
  }, []);

  const addLot = React.useCallback(() => {
    setForm(prev => ({
      ...prev,
      lots: [...(prev.lots ?? []), { id: makeUuid(), titre: "", montantHT: 0 } as Lot]
    }));
    setDirty(true);
  }, []);

  const removeLot = React.useCallback((id: string) => {
    setForm(prev => ({
      ...prev,
      lots: (prev.lots ?? []).filter(l => l.id !== id)
    }));
    setDirty(true);
  }, []);

  //--- Retour du hook
  return {
    form,
    setField,
    hydrate,   // nécessaire pour le mode édition
    reset,
    addLot,
    removeLot,
    errors,
    setErrors,
    dirty,
    setDirty
  };
}
