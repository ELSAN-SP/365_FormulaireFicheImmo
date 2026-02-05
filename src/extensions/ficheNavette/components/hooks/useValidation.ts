/* eslint-disable @typescript-eslint/explicit-function-return-type */
// hooks/useValidation.ts
import * as React from 'react';
import type { IFormList } from '../../Interfaces/IFormList';

export type ValidationErrors = Partial<Record<string, string>>;

// Validation simple
export function validate(form: Partial<IFormList>): ValidationErrors {
  const errors: ValidationErrors = {};

  if (!form.etablissement?.trim()) {
    errors.etablissement = 'Établissement requis';
  }

  return errors;
}

export function useValidation(form: Partial<IFormList>) {
  const [errors, setErrors] = React.useState<ValidationErrors>({});

  const runValidation = React.useCallback(() => {
    const e = validate(form);
    setErrors(e);
    return Object.keys(e).length === 0;
  }, [form]);

  return { errors, setErrors, runValidation };
}
