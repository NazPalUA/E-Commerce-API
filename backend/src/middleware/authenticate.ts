import { refreshTokenRepo } from '@/db/repos/refreshToken/refreshToken.repo';
import { UserRole } from '@/db/repos/users/constants';
import { userRepo } from '@/db/repos/users/user.repo';
import { DecodedAccessJWT_Schema } from '@/models/AccessToken';
import {
  attachAuthCookiesToResponse,
  getTokenPayloadFromUser,
} from '@/utils/auth';
import { NextFunction, Request, Response } from 'express';
import { ForbiddenError } from '../errors/forbidden-error';
import { UnauthorizedError } from '../errors/unauthorized-error';
import { createAccessJWT, verifyAccessJWT } from '../utils/auth';

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { accessJWT, refreshTokenSecret } = req.signedCookies;

  // Authenticate with access token
  if (accessJWT) {
    const decodedJWT = verifyAccessJWT(accessJWT);
    const { id, role } = DecodedAccessJWT_Schema.parse(decodedJWT);

    req.userId = id;
    req.userRole = role;

    next();
    return;
  }

  // Authenticate with refresh token
  if (!refreshTokenSecret)
    throw new UnauthorizedError('Authentication refresh token missing');

  await refreshTokenRepo.checkTokenSecret(refreshTokenSecret);

  const userId = await refreshTokenRepo.getUserIdByTokenSecret(
    refreshTokenSecret
  );
  const user = await userRepo.findUserById(userId);
  if (!user) throw new UnauthorizedError('User no longer exists');

  const accessJWTPayload = getTokenPayloadFromUser(user);
  const newAccessJWT = createAccessJWT(accessJWTPayload);

  attachAuthCookiesToResponse(res, newAccessJWT, refreshTokenSecret);

  req.userId = user.id;
  req.userRole = user.role;

  next();
};

export const authorize = (...roles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.userRole) {
      throw new UnauthorizedError('User role not found');
    }

    if (!roles.includes(req.userRole as UserRole)) {
      throw new ForbiddenError('Unauthorized');
    }
    next();
  };
};
