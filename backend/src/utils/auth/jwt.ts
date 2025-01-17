import { UnauthorizedError } from '@/errors/unauthorized-error';
import {
  AccessJWTPayload,
  DecodedAccessJWT,
  DecodedAccessJWT_Schema,
} from '@/models/AccessToken';
import jwt from 'jsonwebtoken';
import { BadRequestError } from '../../errors/bad-request-error';
import { env } from '../envConfig';

export const createAccessJWT = (payload: AccessJWTPayload) => {
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
