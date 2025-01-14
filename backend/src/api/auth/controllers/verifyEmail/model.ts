import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

// 'POST /auth/verify-email'

extendZodWithOpenApi(z);

// Request Schema
export type VerifyEmail_ReqBody = z.infer<typeof VerifyEmail_ReqBody_Schema>;
export const VerifyEmail_ReqBody_Schema = z.object({
  verificationToken: z.string(),
  email: z.string().email(),
});

export const VerifyEmail_Req_Schema = z.object({
  body: VerifyEmail_ReqBody_Schema,
});

// Response Schema
export type VerifyEmail_ResBodyObj = z.infer<
  typeof VerifyEmail_ResBodyObj_Schema
>;
export const VerifyEmail_ResBodyObj_Schema = z.null();
