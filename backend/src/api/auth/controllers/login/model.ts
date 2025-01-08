import { TokenPayload_Schema } from '@/common/utils/jwt';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

// 'POST /auth/login'

extendZodWithOpenApi(z);

// Request Schema
export type Login_ReqBody = z.infer<typeof Login_ReqBody_Schema>;
export const Login_ReqBody_Schema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(50),
});

export const Login_Req_Schema = z.object({
  body: Login_ReqBody_Schema,
});

// Response Schema
export type Login_ResBodyObj = z.infer<typeof Login_ResBodyObj_Schema>;
export const Login_ResBodyObj_Schema = TokenPayload_Schema;
