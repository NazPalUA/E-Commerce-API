import { authenticate } from '@/common/middleware/authenticate';
import { Router } from 'express';
import { authController } from './authController';

const router = Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout', authenticate, authController.logout);
router.get('/me', authenticate, authController.getCurrentUser);

export default router;
