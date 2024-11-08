import { useCallback, useReducer, useState } from 'react';

type FormState<T> = {
  values: T;
  touched: Partial<Record<keyof T, boolean>>;
  errors: Partial<Record<keyof T, string>>;
};

type ValidationRules<T> = Partial<{
  [K in keyof T]: (value: T[K]) => string | undefined;
}>;

interface UseFormOptions<T> {
  initialValues: T;
  validationRules?: ValidationRules<T>;
}

export default function useForm<T extends Record<string, any>>({
  initialValues,
  validationRules = {},
}: UseFormOptions<T>) {
  const [initialState] = useState(initialValues);

  const initialErrors: Partial<Record<keyof T, string>> = {};
  Object.keys(validationRules).forEach((key) => {
    const field = key as keyof T;
    const value = initialValues[field];
    const error = validationRules[field]?.(value);
    if (error) initialErrors[field] = error;
  });

  const [formState, dispatch] = useReducer(
    (state: FormState<T>, action: Partial<FormState<T>>) => ({
      ...state,
      ...action,
    }),
    {
      values: initialValues,
      touched: {},
      errors: initialErrors,
    },
  );

  const setValue = useCallback(
    <K extends keyof T>(field: K, value: T[K]) => {
      const error = validationRules[field]?.(value);

      dispatch({
        values: {
          ...formState.values,
          [field]: value,
        },
        errors: {
          ...formState.errors,
          [field]: error,
        },
      });
    },
    [formState.values, formState.errors, validationRules],
  );

  const setTouched = useCallback(
    (field: keyof T, isTouched: boolean = true) => {
      dispatch({
        touched: {
          ...formState.touched,
          [field]: isTouched,
        },
      });
    },
    [formState.touched],
  );

  const setValues = useCallback(
    (values: Partial<T>) => {
      const newErrors: Partial<Record<keyof T, string>> = {};

      Object.keys(values).forEach((key) => {
        const field = key as keyof T;
        const value = values[field];
        if (validationRules[field]) {
          const error = validationRules[field]!(value as T[keyof T]);
          if (error) newErrors[field] = error;
        }
      });

      dispatch({
        values: {
          ...formState.values,
          ...values,
        },
        errors: {
          ...formState.errors,
          ...newErrors,
        },
      });
    },
    [formState.errors, formState.values, validationRules],
  );

  const getChangedValues = useCallback(() => {
    const changedValues: Partial<T> = {};

    (Object.keys(formState.values) as Array<keyof T>).forEach((key) => {
      if (formState.values[key] !== initialState[key]) {
        changedValues[key] = formState.values[key];
      }
    });

    return changedValues;
  }, [formState.values, initialState]);

  const getFieldError = useCallback(
    (field: keyof T): string | undefined => {
      return formState.errors[field];
    },
    [formState.errors],
  );

  const isFieldTouched = useCallback(
    (field: keyof T): boolean => {
      return !!formState.touched[field];
    },
    [formState.touched],
  );

  const hasChanges = useCallback((): boolean => {
    return Object.keys(getChangedValues()).length > 0;
  }, [getChangedValues]);

  const hasErrors = useCallback((): boolean => {
    return Object.values(formState.errors).some((error) => error !== undefined);
  }, [formState.errors]);

  return {
    values: formState.values,
    touched: formState.touched,
    errors: formState.errors,
    setValue,
    setValues,
    setTouched,
    getFieldError,
    isFieldTouched,
    getChangedValues,
    hasChanges,
    hasErrors,
  };
}
