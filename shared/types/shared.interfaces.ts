import { Role } from './shared.types';

export interface IClaims {
  role: Role;
  email: string;
}

export interface IAccessToken {
  accessToken: string;
}

export interface IUserBase {
  email: string;
  userId: string;
  createdAt: Date;
  lastLogin?: Date;
  role: Role;
}

export interface IUserAllProperties extends IUserBase {
  passwordHash: string;
  saltHash: string;
}

export interface ISimpleResponse {
  message: string;
}

export interface IFriendlyError {
  error: string;
}

export interface ILoginRequest {
  email: string;
  password: string;
}
