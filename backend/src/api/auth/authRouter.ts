import { authenticate } from '@/common/middleware/authenticate';
import { Router } from 'express';
import { getCurrentUser, login, logout, register } from './authController';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', authenticate, logout);
router.get('/me', authenticate, getCurrentUser);

export default router;
