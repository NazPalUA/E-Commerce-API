import { User_DbEntity_Schema } from '@/db/repos/users/user.model';
import { commonValidations } from '@/utils/commonValidation';
import { z } from 'zod';

export type AccessJWTPayload = z.infer<typeof AccessJWTPayload_Schema>;
export const AccessJWTPayload_Schema = z
  .object({
    id: commonValidations.id,
    name: User_DbEntity_Schema.shape.name,
    email: User_DbEntity_Schema.shape.email,
    role: User_DbEntity_Schema.shape.role,
  })
  .strict();

export type DecodedAccessJWT = z.infer<typeof DecodedAccessJWT_Schema>;
export const DecodedAccessJWT_Schema = AccessJWTPayload_Schema.extend({
  iat: z.number(),
  exp: z.number(),
});
