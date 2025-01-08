import { TokenPayload_Schema } from '@/common/utils/jwt';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

// 'POST /auth/register'

extendZodWithOpenApi(z);

// Request Schema
export type Register_ReqBody = z.infer<typeof Register_ReqBody_Schema>;
export const Register_ReqBody_Schema = z.object({
  name: z.string().min(3).max(50),
  email: z.string().email(),
  password: z.string().min(8).max(50),
});

export const Register_Req_Schema = z.object({
  body: Register_ReqBody_Schema,
});

// Response Schema
export type Register_ResBodyObj = z.infer<typeof Register_ResBodyObj_Schema>;
export const Register_ResBodyObj_Schema = TokenPayload_Schema;
