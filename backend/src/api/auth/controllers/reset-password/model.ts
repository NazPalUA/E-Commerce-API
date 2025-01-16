import { User_DTO_Schema } from '@/db/repos/users/user.model';
import { commonValidations } from '@/utils/commonValidation';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

// 'POST /auth/reset-password'

extendZodWithOpenApi(z);

// Request Schema
export type ResetPassword_ReqBody = z.infer<
  typeof ResetPassword_ReqBody_Schema
>;
export const ResetPassword_ReqBody_Schema = z.object({
  email: User_DTO_Schema.shape.email,
  resetToken: User_DTO_Schema.shape.passwordResetToken,
  newPassword: commonValidations.password,
});

export const ResetPassword_Req_Schema = z.object({
  body: ResetPassword_ReqBody_Schema,
});

// Response Schema
export type ResetPassword_ResBodyObj = z.infer<
  typeof ResetPassword_ResBodyObj_Schema
>;
export const ResetPassword_ResBodyObj_Schema = z.null();
