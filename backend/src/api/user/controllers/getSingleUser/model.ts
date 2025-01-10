import { User_DTO_Schema } from '@/db/repos/users/user.model';
import { commonValidations } from '@/utils/commonValidation';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

// 'GET /users/:id'

extendZodWithOpenApi(z);

// Request Schema
export type GetSingleUser_Req = z.infer<typeof GetSingleUser_Req_Schema>;
export const GetSingleUser_Req_Schema = z.object({
  params: z.object({ id: commonValidations.id }),
});

// Response Schema
export type GetSingleUser_ResBodyObj = z.infer<
  typeof GetSingleUser_ResBodyObj_Schema
>;
export const GetSingleUser_ResBodyObj_Schema = User_DTO_Schema;
