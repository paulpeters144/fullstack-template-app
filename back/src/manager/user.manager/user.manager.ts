import { ST, SI } from '@shared/types';
import { IDDBAccess } from '@src/access/ddb.access';

import { PasswordModel } from './util/password.util';
import { IUserFactory } from './util/user.factory';
import { Err, OK, TPromise, Val, TVoid } from '@shared/types/result';

export interface IUserManager {
  registerAdmin(admin: ST.Register): TPromise<number>;
  login(login: ST.LoginRequest): TPromise<SI.IClaims>;
}

export interface IUserManagerProps {
  userFactory: IUserFactory;
  ddbAccess: IDDBAccess;
}

export const createUserManager = ({
  userFactory,
  ddbAccess,
}: IUserManagerProps): IUserManager => {
  const registerAdmin = async (register: ST.Register): TPromise<TVoid> => {
    try {
      const key = `user#${register.email}`;
      const userFromDb = await ddbAccess.getItem<SI.IUserAllProperties>(key);

      if (!userFromDb.ok) {
        return Err('user already in database');
      }

      const user = userFactory.createUser(register);
      const params = { item: user, pk: key, sk: key };
      const putResult = await ddbAccess.putItem<SI.IUserAllProperties>(params);
      if (!putResult.ok) {
        return Err(putResult.value.message);
      }

      return OK();
    } catch (error) {
      if (error instanceof Error) {
        return { value: error, ok: false };
      }
      return Err('unknown error');
    }
  };

  const login = async (login: ST.LoginRequest): TPromise<SI.IClaims> => {
    const key = `user#${login.email}`;
    const userResult = await ddbAccess.getItem<SI.IUserAllProperties>(key);
    if (!userResult.ok) {
      return Err('user not found');
    }
    const user = userResult.value!;
    const passwordModel = PasswordModel({
      passwordHash: user.passwordHash,
      saltHash: user.saltHash,
    });
    if (!passwordModel.isValid(login.password)) {
      return Err('invalid password');
    }
    user.lastLogin = new Date().toUTC();
    const params = { item: user, pk: key, sk: key };
    await ddbAccess.putItem<SI.IUserAllProperties>(params);
    return Val({ email: user.email, role: user.role });
  };

  return { registerAdmin, login };
};
