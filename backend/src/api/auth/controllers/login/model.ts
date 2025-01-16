import { AccessJWTPayload_Schema } from '@/models/AccessToken';
import { commonValidations } from '@/utils/commonValidation';

import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

// 'POST /auth/login'

extendZodWithOpenApi(z);

// Request Schema
export type Login_ReqBody = z.infer<typeof Login_ReqBody_Schema>;
export const Login_ReqBody_Schema = z.object({
  email: z.string().email(),
  password: commonValidations.password,
});

export const Login_Req_Schema = z.object({
  body: Login_ReqBody_Schema,
});

// Response Schema
export type Login_ResBodyObj = z.infer<typeof Login_ResBodyObj_Schema>;
export const Login_ResBodyObj_Schema = AccessJWTPayload_Schema;
