import { User_DTO_Schema } from '@/common/db/repos/users/user.model';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

// 'GET /users'

extendZodWithOpenApi(z);

// Request Schema
// export type GetUsers_Req = z.infer<typeof GetUsers_Req_Schema>;
// export const GetUsers_Req_Schema = z.object({
//   query: z.object({
//     page: z.string().optional(),
//     limit: z.string().optional(),
//   }),
// });

// Response Schema
const SingleUser_Schema = User_DTO_Schema;

export type GetUsers_ResBodyObj = z.infer<typeof GetUsers_ResBodyObj_Schema>;
export const GetUsers_ResBodyObj_Schema = z.array(SingleUser_Schema);
