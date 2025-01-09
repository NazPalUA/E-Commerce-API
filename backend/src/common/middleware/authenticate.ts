import { NextFunction, Request, Response } from 'express';
import { decodeToken } from '../utils/jwt';

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const token = req.signedCookies['token'];

  if (!token) {
    res.status(401).json({ message: 'Authentication token missing' });
    return;
  }

  try {
    const decoded = decodeToken(token);
    req.userId = decoded.id;
    req.userRole = decoded.role;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid authentication token' });
    return;
  }
};

type UserRole = 'admin' | 'user';

export const authorize =
  (role: UserRole) =>
  (req: Request, res: Response, next: NextFunction): void => {
    if (req.userRole !== role) {
      res.status(403).json({ message: 'Unauthorized' });
      return;
    }
    next();
  };
