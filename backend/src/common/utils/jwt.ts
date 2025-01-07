import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { User_DbEntity_Schema } from '../db/repos/users/user.model';
import { BadRequestError } from '../errors/bad-request-error';
import { commonValidations } from './commonValidation';
import { env } from './envConfig';

export type TokenPayload = z.infer<typeof TokenPayload_Schema>;
export const TokenPayload_Schema = User_DbEntity_Schema.pick({
  name: true,
  email: true,
  role: true,
})
  .extend({
    id: commonValidations.id,
  })
  .strict();

export const createToken = (payload: TokenPayload) => {
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRATION_TIME,
  });
};

export const isTokenValid = (token: string) => {
  return jwt.verify(token, env.JWT_SECRET);
};

export const decodeToken = (token: string): TokenPayload => {
  const decoded = jwt.decode(token);
  if (!decoded) {
    throw new BadRequestError('Invalid token');
  }
  return TokenPayload_Schema.parse(decoded);
};

export const refreshToken = (token: string) => {
  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as TokenPayload;
    return createToken(decoded);
  } catch (error) {
    throw new BadRequestError('Invalid or expired token');
  }
};
