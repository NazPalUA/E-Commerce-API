import { createApiResponse } from '@/api-docs/openAPIResponseBuilders';
import { authenticate } from '@/common/middleware/authenticate';
import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { Router } from 'express';
import { z } from 'zod';
import { User_DTO_Schema } from '../user/userModel';
import { getCurrentUser, login, logout, register } from './authController';
import { Login_Req_Schema, Register_Req_Schema } from './authModel';

export const authRegistry = new OpenAPIRegistry();
export const authRouter = Router();

authRegistry.registerPath({
  method: 'post',
  path: '/register',
  tags: ['Auth'],
  request: {
    body: {
      content: {
        'application/json': {
          schema: Register_Req_Schema.shape.body,
        },
      },
    },
  },
  responses: createApiResponse(User_DTO_Schema, 'Success'),
});

authRouter.post('/register', register);

authRegistry.registerPath({
  method: 'post',
  path: '/login',
  tags: ['Auth'],
  request: {
    body: {
      content: {
        'application/json': { schema: Login_Req_Schema.shape.body },
      },
    },
  },
  responses: createApiResponse(User_DTO_Schema, 'Success'),
});

authRouter.post('/login', login);

authRegistry.registerPath({
  method: 'post',
  path: '/logout',
  tags: ['Auth'],
  responses: createApiResponse(z.null(), 'Success'),
});

authRouter.post('/logout', authenticate, logout);

authRegistry.registerPath({
  method: 'get',
  path: '/me',
  tags: ['Auth'],
  responses: createApiResponse(User_DTO_Schema, 'Success'),
});

authRouter.get('/me', authenticate, getCurrentUser);
