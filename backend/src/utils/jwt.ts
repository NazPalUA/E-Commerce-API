import { UnauthorizedError } from '@/errors/unauthorized-error';
import {
  AccessJWTPayload,
  DecodedAccessJWT,
  DecodedAccessJWT_Schema,
} from '@/models/AccessToken';
import crypto from 'crypto';
import { Response } from 'express';
import jwt from 'jsonwebtoken';
import { User_DTO } from '../db/repos/users/user.model';
import { BadRequestError } from '../errors/bad-request-error';
import { env } from './envConfig';

const createAccessJWT = (payload: AccessJWTPayload) => {
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_LIFETIME,
  });
};

export const verifyAccessJWT = (token: string) => {
  try {
    const payload = jwt.verify(token, env.JWT_SECRET);
    return payload;
  } catch (error) {
    throw new UnauthorizedError('Invalid or expired authentication token');
  }
};

export const decodeAccessJWT = (token: string): DecodedAccessJWT => {
  try {
    const decoded = jwt.decode(token);
    return DecodedAccessJWT_Schema.parse(decoded);
  } catch (error) {
    throw new BadRequestError('Invalid token');
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
  userPayload: AccessJWTPayload,
  refreshToken: string
) => {
  const accessTokenJWT = createAccessJWT(userPayload);
  const oneDay = 1000 * 60 * 60 * 24;
  setTokenCookie(res, oneDay, accessTokenJWT);

  const oneWeek = 7 * 24 * 60 * 60 * 1000;
  setRefreshTokenCookie(res, oneWeek, refreshToken);
};

export const clearCookies = (res: Response) => {
  setTokenCookie(res, 0);
  setRefreshTokenCookie(res, 0);
};

export const getTokenPayloadFromUser = (user: User_DTO): AccessJWTPayload => {
  const { id, name, email, role } = user;
  return { id, name, email, role };
};

export const generateVerificationToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

export const generateRefreshToken = () => {
  return crypto.randomBytes(32).toString('hex');
};
