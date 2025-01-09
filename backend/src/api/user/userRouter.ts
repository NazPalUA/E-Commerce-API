import { User_DTO_Schema } from '@/common/db/repos/users/user.model';
import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { Router } from 'express';
import { getUser } from './controllers/getUser/controller';
import { getUserRouterConfig } from './controllers/getUser/docs-config';
import { getUsers } from './controllers/getUsers/controller';
import { getUsersRouterConfig } from './controllers/getUsers/docs-config';

export const userRegistry = new OpenAPIRegistry();
export const userRouter = Router();

userRegistry.register('User', User_DTO_Schema);

userRouter.get('/', getUsers);
userRegistry.registerPath(getUsersRouterConfig);

userRouter.get('/:id', getUser);
userRegistry.registerPath(getUserRouterConfig);
