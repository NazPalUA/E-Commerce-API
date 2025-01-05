import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import express, { type Router } from 'express';
import { z } from 'zod';

import { createApiResponse } from '@/api-docs/openAPIResponseBuilders';
import {
  CreateUser_Req_Schema,
  GetUser_Req_Schema,
  User_DTO_Schema,
} from '@/api/user/userModel';
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

userRegistry.registerPath({
  method: 'post',
  path: '/users',
  tags: ['User'],
  request: {
    body: {
      content: {
        'application/json': {
          schema: CreateUser_Req_Schema.shape.body,
        },
      },
    },
  },
  responses: createApiResponse(User_DTO_Schema, 'Success'),
});

userRouter.post('/', userController.createUser);
