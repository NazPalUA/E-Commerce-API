import { commonValidations } from '@/common/utils/commonValidation';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

// 'PATCH /users/update-password'

extendZodWithOpenApi(z);

// Request Schema
export type UpdateUserPassword_Req = z.infer<
  typeof UpdateUserPassword_Req_Schema
>;
export const UpdateUserPassword_Req_Schema = z.object({
  body: z.object({
    currentPassword: commonValidations.password,
    newPassword: commonValidations.password,
  }),
});

// Response Schema
export type UpdateUserPassword_ResBodyObj = z.infer<
  typeof UpdateUserPassword_ResBodyObj_Schema
>;
export const UpdateUserPassword_ResBodyObj_Schema = z.null();
