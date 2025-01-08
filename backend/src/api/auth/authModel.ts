import { TokenPayload_Schema } from '@/common/utils/jwt';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

extendZodWithOpenApi(z);

// 'POST /auth/login' endpoint
export type Login_ReqBody = z.infer<typeof Login_ReqBody_Schema>;
export const Login_ReqBody_Schema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(50),
});

export const Login_Req_Schema = z.object({
  body: Login_ReqBody_Schema,
});

// 'POST /auth/register' endpoint
export type Register_ReqBody = z.infer<typeof Register_ReqBody_Schema>;
export const Register_ReqBody_Schema = z.object({
  name: z.string().min(3).max(50),
  email: z.string().email(),
  password: z.string().min(8).max(50),
});

export const Register_Req_Schema = z.object({
  body: Register_ReqBody_Schema,
});

export type Register_ResObj = z.infer<typeof Register_ResObj_Schema>;
export const Register_ResObj_Schema = TokenPayload_Schema;

// 'POST /auth/logout' endpoint
export const Logout_Req_Schema = z.object({});

export type Login_ResObj = z.infer<typeof Login_ResObj_Schema>;
export const Login_ResObj_Schema = TokenPayload_Schema;

// 'GET /auth/me' endpoint
export const Me_Req_Schema = z.object({});
