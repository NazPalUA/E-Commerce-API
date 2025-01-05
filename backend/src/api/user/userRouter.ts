import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import express, { type Router } from 'express';
import { z } from 'zod';

import { createApiResponse } from '@/api-docs/openAPIResponseBuilders';
import {
  CreateUserReqSchema,
  GetUserReqSchema,
  UserDTOSchema,
} from '@/api/user/userModel';
import { userController } from './userController';

export const userRegistry = new OpenAPIRegistry();
export const userRouter: Router = express.Router();

userRegistry.register('User', UserDTOSchema);

userRegistry.registerPath({
  method: 'get',
  path: '/users',
  tags: ['User'],
  responses: createApiResponse(z.array(UserDTOSchema), 'Success'),
});

userRouter.get('/', userController.getUsers);

userRegistry.registerPath({
  method: 'get',
  path: '/users/{id}',
  tags: ['User'],
  request: { params: GetUserReqSchema.shape.params },
  responses: createApiResponse(UserDTOSchema, 'Success'),
});

userRouter.get('/:id', userController.getUser);

userRegistry.registerPath({
  method: 'post',
  path: '/users',
  tags: ['User'],
  request: {
    body: {
      content: {
        'application/json': {
          schema: CreateUserReqSchema.shape.body,
        },
      },
    },
  },
  responses: createApiResponse(UserDTOSchema, 'Success'),
});

userRouter.post('/', userController.createUser);
