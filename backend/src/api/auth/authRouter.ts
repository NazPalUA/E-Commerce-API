import { createApiResponse } from '@/api-docs/openAPIResponseBuilders';
import { authenticate } from '@/common/middleware/authenticate';
import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { Router } from 'express';
import { z } from 'zod';
import { login } from './controllers/login/controller';
import {
  Login_Req_Schema,
  Login_ResBodyObj_Schema,
} from './controllers/login/model';
import { logout } from './controllers/logout/controller';
import { getMe } from './controllers/me/controller';
import { Me_ResBodyObj_Schema } from './controllers/me/model';
import { register } from './controllers/register/controller';
import {
  Register_Req_Schema,
  Register_ResBodyObj_Schema,
} from './controllers/register/model';

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
  responses: createApiResponse(Register_ResBodyObj_Schema, 'Success'),
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
  responses: createApiResponse(Login_ResBodyObj_Schema, 'Success'),
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
  responses: createApiResponse(Me_ResBodyObj_Schema, 'Success'),
});

authRouter.get('/me', authenticate, getMe);
