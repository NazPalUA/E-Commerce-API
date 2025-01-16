import { User_DTO_Schema } from '@/db/repos/users/user.model';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

// 'POST /auth/forgot-password'

extendZodWithOpenApi(z);

// Request Schema
export type ForgotPassword_ReqBody = z.infer<
  typeof ForgotPassword_ReqBody_Schema
>;
export const ForgotPassword_ReqBody_Schema = z.object({
  email: User_DTO_Schema.shape.email,
});

export const ForgotPassword_Req_Schema = z.object({
  body: ForgotPassword_ReqBody_Schema,
});

// Response Schema
export type ForgotPassword_ResBodyObj = z.infer<
  typeof ForgotPassword_ResBodyObj_Schema
>;
export const ForgotPassword_ResBodyObj_Schema = z.null();
