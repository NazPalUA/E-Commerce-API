import { createApiResponse } from '@/api-docs/openAPIResponseBuilders';
import { GetUser_Req_Schema, User_DTO_Schema } from '@/api/user/userModel';
import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { Router } from 'express';
import { z } from 'zod';
import { getUser, getUsers } from './userController';

export const userRegistry = new OpenAPIRegistry();
export const userRouter = Router();

userRegistry.register('User', User_DTO_Schema);

userRegistry.registerPath({
  method: 'get',
  path: '/api/v1/users',
  tags: ['User'],
  responses: createApiResponse(z.array(User_DTO_Schema), 'Success'),
});

userRouter.get('/', getUsers);

userRegistry.registerPath({
  method: 'get',
  path: '/api/v1/users/{id}',
  tags: ['User'],
  request: { params: GetUser_Req_Schema.shape.params },
  responses: createApiResponse(User_DTO_Schema, 'Success'),
});

userRouter.get('/:id', getUser);
