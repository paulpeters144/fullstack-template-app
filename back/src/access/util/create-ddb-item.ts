import { Err, TResult, Val } from '@shared/types/result';

export const createDynamoDBItem = <T extends Record<string, any>>(
  item: T,
  pk: string,
  sk: string,
): TResult<Record<string, any>> => {
  const dynamoDBItem: Record<string, any> = {
    PK: pk,
    SK: sk,
  };

  const isPrimitiveType = (value: any): boolean => {
    return (
      typeof value === 'string' ||
      typeof value === 'number' ||
      typeof value === 'boolean'
    );
  };

  const addValueToItem = (value: any, depth: number = 0): TResult<any> => {
    if (depth >= 10) {
      return Err('Recursion depth exceeded 10 levels');
    }
    let result = undefined;
    if (isPrimitiveType(value)) {
      result = value;
    } else if (value instanceof Date) {
      result = Val(value.toISOString());
    } else if (Array.isArray(value)) {
      result = value.map((v) => addValueToItem(v, depth + 1));
    } else if (typeof value === 'object') {
      result = addObjectToItem(value, depth + 1);
    } else {
      return Err(`unknown type:\n${JSON.stringify(value)}`);
    }

    return Val(result);
  };

  const addObjectToItem = (
    obj: Record<string, any>,
    depth: number,
  ): Record<string, any> => {
    const processedObject: Record<string, any> = {};

    for (const [key, value] of Object.entries(obj)) {
      processedObject[key] = addValueToItem(value, depth);
    }

    return processedObject;
  };

  for (const [key, value] of Object.entries(item)) {
    dynamoDBItem[key] = addValueToItem(value);
  }

  return { ok: true, value: dynamoDBItem };
};
