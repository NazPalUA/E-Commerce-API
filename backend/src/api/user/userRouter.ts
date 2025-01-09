import { User_DTO_Schema } from '@/common/db/repos/users/user.model';
import { authenticate, authorize } from '@/common/middleware/authenticate';
import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { Router } from 'express';
import { getAllUsers } from './controllers/getAllUsers/controller';
import { getUsersRouterConfig } from './controllers/getAllUsers/docs-config';
import { getUser } from './controllers/getUser/controller';
import { getUserRouterConfig } from './controllers/getUser/docs-config';

export const userRegistry = new OpenAPIRegistry();
export const userRouter = Router();

userRegistry.register('User', User_DTO_Schema);

userRouter.get('/', authenticate, authorize('admin'), getAllUsers);
userRegistry.registerPath(getUsersRouterConfig);

userRouter.get('/:id', authenticate, authorize('admin'), getUser);
userRegistry.registerPath(getUserRouterConfig);
