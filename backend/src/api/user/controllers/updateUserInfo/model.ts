import { User_DTO_Schema } from '@/db/repos/users/user.model';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

// 'PATCH /users/update-info'

extendZodWithOpenApi(z);

// Request Schema
export type UpdateUserInfo_Req = z.infer<typeof UpdateUserInfo_Req_Schema>;
export const UpdateUserInfo_Req_Schema = z.object({
  body: User_DTO_Schema.pick({
    name: true,
    email: true,
  }).partial(),
});

// Response Schema
export type UpdateUserInfo_ResBodyObj = z.infer<
  typeof UpdateUserInfo_ResBodyObj_Schema
>;
export const UpdateUserInfo_ResBodyObj_Schema = User_DTO_Schema;
