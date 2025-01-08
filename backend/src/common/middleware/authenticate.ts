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

export const authenticateAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (req.userRole !== 'admin') {
    res.status(403).json({ message: 'Unauthorized' });
    return;
  }
};
