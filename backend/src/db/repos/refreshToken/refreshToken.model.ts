import { commonValidations } from '@/utils/commonValidation';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { ObjectId } from 'mongodb';
import { z } from 'zod';
import { RefreshTokenRevokedReasons } from './constants';

extendZodWithOpenApi(z);

// Base refresh token schema for both DB entity and DTO
const BaseRefreshTokenSchema = z.object({
  refreshTokenSecret: z.string(),
  ip: z.string(),
  userAgent: z.string(),

  isValid: z.boolean(),
  revokedAt: z.date().optional(),
  revokedReason: z.nativeEnum(RefreshTokenRevokedReasons).optional(),
  lastUsedAt: z.date().optional(),
  replacedByToken: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Fix type name and use BaseRefreshTokenSchema
export type RefreshToken_DbEntity = z.infer<
  typeof RefreshToken_DbEntity_Schema
>;
export type RefreshToken_DbEntity_Input = z.input<
  typeof RefreshToken_DbEntity_Schema
>;

export const RefreshToken_DbEntity_Schema = BaseRefreshTokenSchema.extend({
  _id: commonValidations.objectId,
  user: z.string().transform(id => new ObjectId(id)),

  // Set defaults
  isValid: BaseRefreshTokenSchema.shape.isValid.default(true),
  createdAt: BaseRefreshTokenSchema.shape.createdAt.default(new Date()),
  updatedAt: BaseRefreshTokenSchema.shape.updatedAt.default(new Date()),
}).strict();

export type RefreshToken_DTO = z.infer<typeof RefreshToken_DTO_Schema>;
export type RefreshToken_DTO_Input = z.input<typeof RefreshToken_DTO_Schema>;

export const RefreshToken_DTO_Schema = z.object({
  id: commonValidations.id,
  userId: commonValidations.id,
  ...BaseRefreshTokenSchema.shape,
});
