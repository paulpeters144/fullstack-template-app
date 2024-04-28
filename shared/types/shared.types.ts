import { z } from 'zod';

// -=-=-=-=-=-=-VALIDATION-=-=-=-=-=-=-
const passwordErrorMessage = 'Password must be between 8 and 32 characters';
export const LoginSchema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(8, { message: passwordErrorMessage })
    .max(32, { message: passwordErrorMessage }),
});
export type LoginRequest = z.infer<typeof LoginSchema>;

export const PersonSchema = z.object({
  name: z.string(),
  age: z.number(),
});
export type Person = z.infer<typeof PersonSchema>;

export const RegisterSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(32),
  role: z.string().min(3).max(32),
});
export type Register = z.infer<typeof RegisterSchema>;

export type Role = 'admin' | 'editor' | 'user' | 'guest';

// -=-=-=-=-=-=-VALIDATION-=-=-=-=-=-=-

export type Stage = 'development' | 'test' | 'production';
