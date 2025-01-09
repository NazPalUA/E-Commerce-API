import { NextFunction, Request, Response } from 'express';
import { ForbiddenError } from '../errors/forbidden-error';
import { UnauthorizedError } from '../errors/unauthorized-error';
import { decodeToken } from '../utils/jwt';

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const token = req.signedCookies['token'];

  if (!token) {
    throw new UnauthorizedError('Authentication token missing');
  }

  try {
    const decoded = decodeToken(token);
    req.userId = decoded.id;
    req.userRole = decoded.role;
    next();
  } catch (error) {
    throw new UnauthorizedError('Invalid authentication token');
  }
};

type UserRole = 'admin' | 'user';

export const authorize =
  (role: UserRole) =>
  (req: Request, res: Response, next: NextFunction): void => {
    if (req.userRole !== role) {
      throw new ForbiddenError('Unauthorized');
    }
    next();
  };
