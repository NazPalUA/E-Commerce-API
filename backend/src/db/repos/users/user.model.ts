import { commonValidations } from '@/utils/commonValidation';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import bcrypt from 'bcrypt';
import { z } from 'zod';
extendZodWithOpenApi(z);

export type User_DbEntity = z.infer<typeof User_DbEntity_Schema>;
export type NewUser = z.input<typeof User_DbEntity_Schema>;

export const User_DbEntity_Schema = z
  .object({
    _id: commonValidations.objectId,
    name: z.string().min(3).max(50),
    email: z.string().email(),
    password: commonValidations.password.transform(password =>
      bcrypt.hashSync(password, 10)
    ),
    role: z.enum(['admin', 'user']).default('user'),
    createdAt: z.date().default(new Date()),
    updatedAt: z.date().default(new Date()),
  })
  .strict();

// User DTO Schema
export type User_DTO = z.infer<typeof User_DTO_Schema>;
export const User_DTO_Schema = User_DbEntity_Schema.omit({
  _id: true,
  password: true,
}).extend({
  id: commonValidations.id,
});

export const getUserDTO = (user: User_DbEntity): User_DTO => {
  const { _id, password, ...rest } = user;
  return {
    ...rest,
    id: _id.toString(),
  };
};
