import { randomBytes, createHash } from 'crypto';

export interface IPasswordProps {
  passwordHash?: string;
  saltHash?: string;
}

interface IPasswordModel {
  createHashes(password: string): { passwordHash: string; saltHash: string };
  isValid(password: string): boolean;
}

export const PasswordModel = (props?: IPasswordProps): IPasswordModel => {
  const _passwordHash = props?.passwordHash;
  const _saltHash = props?.saltHash;

  const createHashes = (password: string) => {
    const saltHash = randomBytes(16).toString('hex');
    const passwordHash = createHash('sha256')
      .update(password + saltHash)
      .digest('hex');

    return { passwordHash, saltHash };
  };

  const isValid = (password: string): boolean => {
    if (!_passwordHash) return false;
    if (!_saltHash) return false;

    const hash = createHash('sha256')
      .update(password + _saltHash)
      .digest('hex');

    return _passwordHash === hash;
  };

  return { createHashes, isValid };
};
