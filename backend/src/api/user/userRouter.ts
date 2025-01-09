import { User_DTO_Schema } from '@/common/db/repos/users/user.model';
import { authenticate, authorize } from '@/common/middleware/authenticate';
import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { Router } from 'express';
import { getAllUsers } from './controllers/getAllUsers/controller';
import { getUsersRouterConfig } from './controllers/getAllUsers/docs-config';
import { getSingleUser } from './controllers/getSingleUser/controller';
import { getUserRouterConfig } from './controllers/getSingleUser/docs-config';
import { updateUser } from './controllers/updateUser/controller';
import { updateUserRouterConfig } from './controllers/updateUser/docs-config';

export const userRegistry = new OpenAPIRegistry();
export const userRouter = Router();

userRegistry.register('User', User_DTO_Schema);

userRouter.get('/', authenticate, authorize('admin'), getAllUsers);
userRegistry.registerPath(getUsersRouterConfig);

userRouter.get('/:id', authenticate, getSingleUser);
userRegistry.registerPath(getUserRouterConfig);

userRouter.patch('/:id', authenticate, updateUser);
userRegistry.registerPath(updateUserRouterConfig);
