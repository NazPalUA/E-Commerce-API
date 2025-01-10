import { User_DTO_Schema } from '@/db/repos/users/user.model';
import { authenticate, authorize } from '@/middleware/authenticate';
import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { Router } from 'express';
import { getAllUsers } from './controllers/getAllUsers/controller';
import { getUsersRouterConfig } from './controllers/getAllUsers/docs-config';
import { getMe } from './controllers/getMe/controller';
import { getMeRouterConfig } from './controllers/getMe/docs-config';
import { getSingleUser } from './controllers/getSingleUser/controller';
import { getUserRouterConfig } from './controllers/getSingleUser/docs-config';
import { updateUserInfo } from './controllers/updateUserInfo/controller';
import { updateUserRouterConfig } from './controllers/updateUserInfo/docs-config';
import { updateUserPassword } from './controllers/updateUserPassword/controller';
import { updateUserPasswordRouterConfig } from './controllers/updateUserPassword/docs-config';

export const userRegistry = new OpenAPIRegistry();
export const userRouter = Router();

userRegistry.register('User', User_DTO_Schema);

userRouter.get('/', authenticate, authorize('admin'), getAllUsers);
userRegistry.registerPath(getUsersRouterConfig);

userRouter.get('/me', authenticate, getMe);
userRegistry.registerPath(getMeRouterConfig);

userRouter.get('/:id', authenticate, authorize('admin'), getSingleUser);
userRegistry.registerPath(getUserRouterConfig);

userRouter.patch('/update-password', authenticate, updateUserPassword);
userRegistry.registerPath(updateUserPasswordRouterConfig);

userRouter.patch('/update-info', authenticate, updateUserInfo);
userRegistry.registerPath(updateUserRouterConfig);
