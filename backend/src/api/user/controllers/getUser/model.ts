import { User_DTO_Schema } from '@/common/db/repos/users/user.model';
import { commonValidations } from '@/common/utils/commonValidation';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

// 'GET /users/:id'

extendZodWithOpenApi(z);

// Request Schema
export type GetUser_Req = z.infer<typeof GetUser_Req_Schema>;
export const GetUser_Req_Schema = z.object({
  params: z.object({ id: commonValidations.id }),
});

// Response Schema
export type GetUser_ResBodyObj = z.infer<typeof GetUser_ResBodyObj_Schema>;
export const GetUser_ResBodyObj_Schema = User_DTO_Schema;
