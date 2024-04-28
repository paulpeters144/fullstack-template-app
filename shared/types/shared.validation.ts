import { ZodError, z } from 'zod';

type Option = {
  success: boolean;
  error?: string;
};

export const validate = <T>(schema: z.Schema<T>) => {
  const on = (data: unknown): Validation<T> => {
    try {
      schema.parse(data);
      return { model: {} as T, result: { success: true } };
    } catch (error) {
      if (error instanceof ZodError) {
        return zodErrorMessages<T>(error);
      }
      return { model: {} as T, result: { success: false, error: 'unknown' } };
    }
  };
  return { on };
};

export type ModelErrors<T> = {
  [K in keyof T]?: T[K];
};

type Validation<T> = {
  model: ModelErrors<T | undefined>;
  result: Option;
};

export const zodErrorMessages = <T>(error: z.ZodError): Validation<T> => {
  const errors: ModelErrors<T> = {};

  try {
    for (const err of error.issues) {
      if (err.path) {
        let obj = errors as any;
        for (let i = 0; i < err.path.length - 1; i++) {
          const pathKey = err.path[i];
          const nextPathKeyIsAnInt = typeof err.path[i + 1] === 'number';
          const parentIsAnArray = Array.isArray(obj[pathKey]);

          if (nextPathKeyIsAnInt) {
            obj[pathKey] = obj[pathKey] || [];
          } else if (parentIsAnArray) {
            obj[pathKey] = obj[pathKey] || {};
          } else {
            obj[pathKey] = obj[pathKey] || {};
          }

          obj = obj[pathKey];
        }

        const lastKey = err.path[err.path.length - 1];
        obj[lastKey] = err.message as string | null;
      }
    }
  } catch (err) {
    console.error(err);
    return { model: {}, result: { success: false, error: 'unknown error' } };
  }

  if (Object.keys(errors).length === 0) {
    return { model: {}, result: { success: true } };
  }

  return { model: errors, result: { success: false } };
};
