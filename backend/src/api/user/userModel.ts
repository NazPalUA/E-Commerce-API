import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

import { commonValidations } from '@/common/utils/commonValidation';
import { ObjectId } from 'mongodb';

extendZodWithOpenApi(z);

export type UserEntity = z.infer<typeof UserEntitySchema>;
export type UserDTO = z.infer<typeof UserDTOSchema>;

export const UserEntitySchema = z.object({
  _id: z.instanceof(ObjectId),
  name: z.string(),
  email: z.string().email(),
  age: z.number(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const UserDTOSchema = UserEntitySchema.omit({ _id: true }).extend({
  id: commonValidations.id,
});

// Input Validation for 'GET users/:id' endpoint
export type GetUserReq = z.infer<typeof GetUserReqSchema>;
export const GetUserReqSchema = z.object({
  params: z.object({ id: commonValidations.id }),
});

// Input Validation for 'POST /users' endpoint
export type CreateUserReqBody = z.infer<typeof CreateUserReqBodySchema>;

export const CreateUserReqBodySchema = UserDTOSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const CreateUserReqSchema = z.object({
  body: CreateUserReqBodySchema,
});
