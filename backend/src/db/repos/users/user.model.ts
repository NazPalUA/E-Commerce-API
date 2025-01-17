import { commonValidations } from '@/utils/commonValidation';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import bcrypt from 'bcrypt';
import { z } from 'zod';
import { UserRoles } from './constants';

extendZodWithOpenApi(z);

// Base user schema that is used for both DB entity and DTO
const BaseUserSchema = z.object({
  name: z.string().min(3).max(50),
  email: z.string().email(),
  role: z.nativeEnum(UserRoles),
  isVerified: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Database entity schema
export type User_DbEntity = z.infer<typeof User_DbEntity_Schema>;
export type User_DbEntity_Input = z.input<typeof User_DbEntity_Schema>;

export const User_DbEntity_Schema = BaseUserSchema.extend({
  _id: commonValidations.objectId,

  role: z.nativeEnum(UserRoles).default(UserRoles.USER),
  isVerified: BaseUserSchema.shape.isVerified.default(false),
  createdAt: BaseUserSchema.shape.createdAt.default(new Date()),
  updatedAt: BaseUserSchema.shape.updatedAt.default(new Date()),

  password: commonValidations.password.transform(password =>
    bcrypt.hashSync(password, 10)
  ),
  verificationToken: z.string().optional(),
  verifiedDate: z.date().optional(),
  passwordResetToken: z.string().optional(),
  passwordResetTokenExpiration: z.date().optional(),
});

// DTO schema
export type User_DTO = z.infer<typeof User_DTO_Schema>;
export const User_DTO_Schema = z.object({
  id: commonValidations.id,
  ...BaseUserSchema.shape,
});
