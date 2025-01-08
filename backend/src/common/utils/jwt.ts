import { Response } from 'express';
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

export const Token_Schema = TokenPayload_Schema.extend({
  iat: z.number(),
  exp: z.number(),
});

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

  return Token_Schema.parse(decoded);
};

export const refreshToken = (token: string) => {
  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as TokenPayload;
    return createToken(decoded);
  } catch (error) {
    throw new BadRequestError('Invalid or expired token');
  }
};

export const attachCookiesToResponse = (
  res: Response,
  payload: TokenPayload
) => {
  const token = createToken(payload);
  const oneDay = 24 * 60 * 60 * 1000;

  res.cookie('token', token, {
    httpOnly: true,
    expires: new Date(Date.now() + oneDay),
    secure: env.NODE_ENV === 'production',
    signed: true,
  });
};

export const clearCookies = (res: Response) => {
  res.clearCookie('token');
};
