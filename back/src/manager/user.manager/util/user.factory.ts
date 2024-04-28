import { SI, ST } from '@shared/types';

import { PasswordModel } from './password.util';

export interface IUserFactory {
  createUser(register: ST.Register): SI.IUserAllProperties;
}

export const createUserFactory = (): IUserFactory => {
  const generateUserId = (length: number): string => {
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZ' +
      'abcdefghijklmnopqrstuvwxyz' +
      '01234567890123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      result += characters.charAt(randomIndex);
    }
    return result;
  };

  const createUser = (register: ST.Register): SI.IUserAllProperties => {
    const userId = generateUserId(25);
    const createdAt = new Date();

    const passwordModel = PasswordModel().createHashes(register.password);
    const passwordHash = passwordModel.passwordHash;
    const saltHash = passwordModel.saltHash;

    return {
      email: register.email,
      userId: userId,
      role: register.role as ST.Role,
      createdAt: createdAt,
      passwordHash: passwordHash,
      saltHash: saltHash,
    };
  };

  return {
    createUser,
  };
};
