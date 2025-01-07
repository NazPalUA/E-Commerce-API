import { authenticate } from '@/common/middleware/authenticate';
import { Router } from 'express';
import { getCurrentUser, login, logout, register } from './authController';

export const authRouter = Router();

authRouter.post('/register', register);
authRouter.post('/login', login);
authRouter.post('/logout', authenticate, logout);
authRouter.get('/me', authenticate, getCurrentUser);
