export type TPromise<T> = Promise<TResult<T>>;
export type TVoid = number;
export type TResult<T> =
  | {
      value: T;
      ok: true;
    }
  | {
      value: Error;
      ok: false;
    };

export function Err<T>(err: unknown): TResult<T> {
  if (err instanceof Error) {
    return { value: err, ok: false };
  }
  if (typeof err === 'string') {
    return { value: new Error(err), ok: false };
  }
  return { value: new Error('unknown type or TErr'), ok: false };
}

export function Val<T>(value: T): TResult<T> {
  return { value, ok: true };
}

export function OK(): TResult<number> {
  return { value: 0, ok: true };
}

export interface IError {
  name: string;
  message: string;
}

export function Record({ name, message }: IError): Error {
  return new Error(`${name}\n${message}`);
}
