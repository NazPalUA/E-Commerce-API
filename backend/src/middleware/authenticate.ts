import { tokenRepo } from '@/db/repos/refreshToken/refreshToken.repo';
import { UserRole } from '@/db/repos/users/constants';
import { userRepo } from '@/db/repos/users/user.repo';
import { DecodedAccessJWT_Schema } from '@/models/AccessToken';
import { attachAuthCookiesToResponse } from '@/utils/auth/authCookies';
import { NextFunction, Request, Response } from 'express';
import { ForbiddenError } from '../errors/forbidden-error';
import { UnauthorizedError } from '../errors/unauthorized-error';
import {
  createAccessJWT,
  generateRandomToken,
  getTokenPayloadFromUser,
  verifyAccessJWT,
} from '../utils/auth/jwt';

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { token: accessToken, refreshToken } = req.signedCookies;

  if (!accessToken && !refreshToken) {
    throw new UnauthorizedError('Authentication token missing');
  }

  if (accessToken) {
    const decodedJWT = verifyAccessJWT(accessToken);
    const { id, role } = DecodedAccessJWT_Schema.parse(decodedJWT);

    req.userId = id;
    req.userRole = role;
  } else {
    if (!refreshToken) {
      throw new UnauthorizedError('Refresh token missing');
    }

    // Use refreshToken directly from cookies
    const token = await tokenRepo.findTokenByRefreshToken(
      refreshToken as string
    );
    if (!token?.isValid) throw new UnauthorizedError('Invalid refresh token');

    const user = await userRepo.findUserById(token.userId.toString());
    if (!user) throw new UnauthorizedError('User no longer exists');

    const userPayload = getTokenPayloadFromUser(user);
    const newRefreshToken = generateRandomToken();

    await tokenRepo.invalidateUserTokens(user.id);
    await tokenRepo.insertToken({
      user: user.id,
      refreshToken: newRefreshToken,
      ip: req.ip || '',
      userAgent: req.headers['user-agent'] || '',
      isValid: true,
    });

    const accessJWT = createAccessJWT(userPayload);
    attachAuthCookiesToResponse(res, accessJWT, newRefreshToken);

    req.userId = user.id;
    req.userRole = user.role;
  }

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
