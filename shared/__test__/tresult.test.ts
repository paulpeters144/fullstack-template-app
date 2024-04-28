import { assert, describe, expect, it } from 'vitest';
import { Err, TPromise, Val } from '../types/result';

describe('TResult', () => {
  it('should resolve to TValue when promise resolves', async () => {
    const result = await PromiseSuccess(42);
    expect(result.value).toEqual(42);
    expect(result.ok).toBe(true);
  });

  it('should reject to TError when promise rejects', async () => {
    const result = await PromiseFail<number>(42);
    expect(result.value).toBeTruthy();
    expect(result.ok).toBe(false);
  });

  it('should create a result with a value', () => {
    const result = Val<number>(42);
    expect(result).toEqual({ value: 42, ok: true });
  });

  it('should create a result with an undefined error', () => {
    const result = Val<number>(42);
    expect(result).toEqual({ value: 42, ok: true });
  });

  it('should create a result with a value of undefined', () => {
    const result = Err<number>(23);
    expect(result.ok).toBe(false);
  });

  it('should create a result with an error value', () => {
    const result = Err<number>('Error message');
    if (!result.ok) {
      expect(result.value.message).toEqual('Error message');
      return;
    }
    assert.Throw(() => 'failed');
  });
});

async function PromiseSuccess<T>(value: any): TPromise<T> {
  await setTimeout(() => {}, 50);
  return Val(value);
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function PromiseFail<T>(value: any): TPromise<T> {
  try {
    await setTimeout(() => {}, 50);
    throw new Error();
  } catch (error) {
    return Err(error);
  }
}
