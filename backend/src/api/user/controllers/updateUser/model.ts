import { User_DTO_Schema } from '@/common/db/repos/users/user.model';
import { commonValidations } from '@/common/utils/commonValidation';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

// 'PATCH /users/:id'

extendZodWithOpenApi(z);

// Request Schema
export type UpdateUser_Req = z.infer<typeof UpdateUser_Req_Schema>;
export const UpdateUser_Req_Schema = z.object({
  params: z.object({ id: commonValidations.id }),
  body: User_DTO_Schema.omit({
    id: true,
    createdAt: true,
    updatedAt: true,
    role: true,
    email: true,
    password: true,
  }).partial(),
});

// Response Schema
export type UpdateUser_ResBodyObj = z.infer<
  typeof UpdateUser_ResBodyObj_Schema
>;
export const UpdateUser_ResBodyObj_Schema = User_DTO_Schema;
