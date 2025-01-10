import { User_DTO_Schema } from '@/db/repos/users/user.model';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

// 'GET /users'

extendZodWithOpenApi(z);

// Request Schema
// export type GetAllUsers_Req = z.infer<typeof GetAllUsers_Req_Schema>;
// export const GetAllUsers_Req_Schema = z.object({
//   query: z.object({
//     page: z.string().optional(),
//     limit: z.string().optional(),
//   }),
// });

// Response Schema
const UserItem_Schema = User_DTO_Schema;

export type GetAllUsers_ResBodyObj = z.infer<
  typeof GetAllUsers_ResBodyObj_Schema
>;
export const GetAllUsers_ResBodyObj_Schema = z.array(UserItem_Schema);
