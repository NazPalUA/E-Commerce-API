import { commonValidations } from '@/utils/commonValidation';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { ObjectId } from 'mongodb';
import { z } from 'zod';

extendZodWithOpenApi(z);

export type Token_DbEntity = z.infer<typeof Token_DbEntity_Schema>;
export type NewToken = z.input<typeof Token_DbEntity_Schema>;

// Schema for token database entity (includes _id)
export const Token_DbEntity_Schema = z
  .object({
    _id: commonValidations.objectId,
    refreshToken: z.string(),
    ip: z.string(),
    userAgent: z.string(),
    isValid: z.boolean().default(true),
    user: z.string().transform(id => new ObjectId(id)),
    // expiresAt: z.date(),
    createdAt: z.date().default(new Date()),
    updatedAt: z.date().default(new Date()),
  })
  .strict();

export type Token_DTO = z.infer<typeof Token_DTO_Schema>;
export const Token_DTO_Schema = Token_DbEntity_Schema.omit({
  _id: true,
  user: true,
}).extend({
  id: commonValidations.id,
  userId: commonValidations.id,
});

export const getTokenDTO = (token: Token_DbEntity): Token_DTO => {
  const { _id, user, ...rest } = token;
  return {
    ...rest,
    id: _id.toString(),
    userId: user.toString(),
  };
};
