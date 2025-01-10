import { authenticate } from '@/middleware/authenticate';
import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { Router } from 'express';
import { login } from './controllers/login/controller';
import { loginRouterConfig } from './controllers/login/docs-config';
import { logout } from './controllers/logout/controller';
import { logoutRouterConfig } from './controllers/logout/docs-config';
import { getMe } from './controllers/me/controller';
import { meRouterConfig } from './controllers/me/docs-config';
import { register } from './controllers/register/controller';
import { registerRouterConfig } from './controllers/register/docs-config';

export const authRegistry = new OpenAPIRegistry();
export const authRouter = Router();

authRouter.post('/register', register);
authRegistry.registerPath(registerRouterConfig);

authRouter.post('/login', login);
authRegistry.registerPath(loginRouterConfig);

authRouter.post('/logout', authenticate, logout);
authRegistry.registerPath(logoutRouterConfig);

authRouter.get('/me', authenticate, getMe);
authRegistry.registerPath(meRouterConfig);
