import { commonValidations } from '@/utils/commonValidation';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { ObjectId } from 'mongodb';
import { z } from 'zod';

extendZodWithOpenApi(z);

export type RefreshRefreshToken_DbEntity = z.infer<
  typeof RefreshToken_DbEntity_Schema
>;
export type RefreshToken_Input = z.input<typeof RefreshToken_DbEntity_Schema>;

// Schema for token database entity (includes _id)
export const RefreshToken_DbEntity_Schema = z
  .object({
    _id: commonValidations.objectId,
    refreshToken: z.string(),
    ip: z.string(),
    userAgent: z.string(),

    // Status fields
    isValid: z.boolean().default(true),
    revokedAt: z.date().nullable().optional(),
    revokedReason: z
      .enum([
        'USER_LOGOUT',
        'SECURITY_BREACH',
        'TOKEN_REUSE',
        'SUSPICIOUS_ACTIVITY',
      ])
      .nullable()
      .optional(),

    // Usage tracking
    lastUsedAt: z.date().optional(),
    replacedByToken: z.string().nullable().optional(), // For token rotation

    // Relations and timestamps
    user: z.string().transform(id => new ObjectId(id)),
    createdAt: z.date().default(new Date()),
    updatedAt: z.date().default(new Date()),
  })
  .strict();

export type RefreshToken_DTO = z.infer<typeof RefreshToken_DTO_Schema>;
export const RefreshToken_DTO_Schema = RefreshToken_DbEntity_Schema.omit({
  _id: true,
  user: true,
}).extend({
  id: commonValidations.id,
  userId: commonValidations.id,
});

export const getTokenDTO = (
  token: RefreshRefreshToken_DbEntity
): RefreshToken_DTO => {
  const { _id, user, ...rest } = token;
  return {
    ...rest,
    id: _id.toString(),
    userId: user.toString(),
  };
};
