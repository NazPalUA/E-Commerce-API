import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import express, { type Router } from 'express';
import { z } from 'zod';

import { createApiResponse } from '@/api-docs/openAPIResponseBuilders';
import { GetUser_Req_Schema, User_DTO_Schema } from '@/api/user/userModel';
import { userController } from './userController';

export const userRegistry = new OpenAPIRegistry();
export const userRouter: Router = express.Router();

userRegistry.register('User', User_DTO_Schema);

userRegistry.registerPath({
  method: 'get',
  path: '/users',
  tags: ['User'],
  responses: createApiResponse(z.array(User_DTO_Schema), 'Success'),
});

userRouter.get('/', userController.getUsers);

userRegistry.registerPath({
  method: 'get',
  path: '/users/{id}',
  tags: ['User'],
  request: { params: GetUser_Req_Schema.shape.params },
  responses: createApiResponse(User_DTO_Schema, 'Success'),
});

userRouter.get('/:id', userController.getUser);
