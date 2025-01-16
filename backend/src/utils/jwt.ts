import { UnauthorizedError } from '@/errors/unauthorized-error';
import crypto from 'crypto';
import { Response } from 'express';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { User_DbEntity_Schema, User_DTO } from '../db/repos/users/user.model';
import { BadRequestError } from '../errors/bad-request-error';
import { commonValidations } from './commonValidation';
import { env } from './envConfig';

export type TokenPayload = z.infer<typeof TokenPayload_Schema>;
export const TokenPayload_Schema = z
  .object({
    id: commonValidations.id,
    name: User_DbEntity_Schema.shape.name,
    email: User_DbEntity_Schema.shape.email,
    role: User_DbEntity_Schema.shape.role,
  })
  .strict();

export const DecodedToken_Schema = TokenPayload_Schema.extend({
  iat: z.number(),
  exp: z.number(),
});

const createJWT = (payload: TokenPayload) => {
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_LIFETIME,
  });
};

export const verifyToken = (token: string) => {
  try {
    const payload = jwt.verify(token, env.JWT_SECRET);
    return DecodedToken_Schema.parse(payload);
  } catch (error) {
    throw new UnauthorizedError('Invalid or expired authentication token');
  }
};

export const decodeToken = (token: string) => {
  try {
    const decoded = jwt.decode(token);
    return DecodedToken_Schema.parse(decoded);
  } catch (error) {
    throw new BadRequestError('Invalid token');
  }
};

export const refreshToken = (token: string) => {
  try {
    const decoded = verifyToken(token);

    const cleanPayload: TokenPayload = {
      id: decoded.id,
      name: decoded.name,
      email: decoded.email,
      role: decoded.role,
    };

    return createJWT(cleanPayload);
  } catch (error) {
    throw new BadRequestError('Invalid or expired token');
  }
};

const setTokenCookie = (res: Response, expiresIn: number, token?: string) => {
  res.cookie('token', token ?? '', {
    httpOnly: true,
    expires: new Date(Date.now() + expiresIn),
    secure: env.NODE_ENV === 'production',
    signed: true,
  });
};

const setRefreshTokenCookie = (
  res: Response,
  expiresIn: number,
  token?: string
) => {
  res.cookie('refreshToken', token ?? '', {
    httpOnly: true,
    expires: new Date(Date.now() + expiresIn),
    secure: env.NODE_ENV === 'production',
    signed: true,
  });
};

export const attachCookiesToResponse = (
  res: Response,
  userPayload: TokenPayload,
  refreshToken: string
) => {
  const accessTokenJWT = createJWT(userPayload);
  const oneDay = 1000 * 60 * 60 * 24;
  setTokenCookie(res, oneDay, accessTokenJWT);

  const oneWeek = 7 * 24 * 60 * 60 * 1000;
  setRefreshTokenCookie(res, oneWeek, refreshToken);
};

export const clearCookies = (res: Response) => {
  setTokenCookie(res, 0);
  setRefreshTokenCookie(res, 0);
};

export const getTokenPayloadFromUser = (user: User_DTO) => {
  const { id, name, email, role } = user;
  return { id, name, email, role };
};

export const generateVerificationToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

export const generateRefreshToken = () => {
  return crypto.randomBytes(32).toString('hex');
};
