import { UserRole } from '@/models/userRoles';
import { NextFunction, Request, Response } from 'express';
import { ForbiddenError } from '../errors/forbidden-error';
import { UnauthorizedError } from '../errors/unauthorized-error';
import { verifyToken } from '../utils/jwt';

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const token = req.signedCookies['token'];

  if (!token) {
    throw new UnauthorizedError('Authentication token missing');
  }

  const payload = verifyToken(token);
  req.userId = payload.id;
  req.userRole = payload.role;
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
