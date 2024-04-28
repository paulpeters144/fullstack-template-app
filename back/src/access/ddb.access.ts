import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
} from '@aws-sdk/lib-dynamodb';
import { Err, OK, TPromise, Val, TVoid } from '@shared/types/result';

import { IAppConfig } from '@src/config/env.config';
import { createDynamoDBItem } from './util/create-ddb-item';

export interface PutItem<T extends Record<string, any>> {
  item: T;
  pk: string;
  sk: string;
}

export interface IDDBAccess {
  getItem<T>(pk: string, sk?: string): TPromise<T>;
  putItem<T extends Record<string, any>>(item: PutItem<T>): TPromise<TVoid>;
}

export const createDDBAccess = (config: IAppConfig): IDDBAccess => {
  const table = config.DDB_TABLE;
  const ddbClient = new DynamoDBClient({});
  const ddb = DynamoDBDocumentClient.from(ddbClient);

  const getItem = async <T>(pk: string, sk?: string): TPromise<T> => {
    try {
      if (!sk) sk = pk;
      const params = { PK: pk, SK: sk };
      const command = new GetCommand({ TableName: table, Key: params });
      const response = await ddb.send(command);
      const result = response.Item as T;
      return Val(result);
    } catch (error) {
      if (error instanceof Error) {
        return Err(error);
      }
      return Err('unknown error');
    }
  };

  const putItem = async <T extends Record<string, any>>(
    item: PutItem<T>,
  ): TPromise<TVoid> => {
    try {
      const putItem = createDynamoDBItem(item.item, item.pk, item.sk);
      if (!putItem.ok) {
        return putItem;
      }
      const params = { TableName: table, Item: putItem };
      const command = new PutCommand(params);
      await ddb.send(command);
    } catch (error) {
      if (error instanceof Error) {
        return Err(error);
      }
      return Err('unknown error');
    }
    return OK();
  };

  return { getItem, putItem };
};
