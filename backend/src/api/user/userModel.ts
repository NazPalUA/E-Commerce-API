import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

import { commonValidations } from '@/common/utils/commonValidation';

extendZodWithOpenApi(z);

export type User_DbEntity = z.infer<typeof User_DbEntity_Schema>;
export type User_DTO = z.infer<typeof User_DTO_Schema>;

export const User_DbEntity_Schema = z.object({
  _id: commonValidations.objectId,
  name: z.string(),
  email: z.string().email(),
  age: z.number(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const User_DTO_Schema = User_DbEntity_Schema.omit({ _id: true }).extend({
  id: commonValidations.id,
});

// Input Validation for 'GET users/:id' endpoint
export type GetUser_Req = z.infer<typeof GetUser_Req_Schema>;
export const GetUser_Req_Schema = z.object({
  params: z.object({ id: commonValidations.id }),
});

// Input Validation for 'POST /users' endpoint
export type CreateUser_ReqBody = z.infer<typeof CreateUser_ReqBody_Schema>;

export const CreateUser_ReqBody_Schema = User_DTO_Schema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const CreateUser_Req_Schema = z.object({
  body: CreateUser_ReqBody_Schema,
});
