import { createApiResponse } from '@/api-docs/openAPIResponseBuilders';
import { RouteConfig } from '@asteasolutions/zod-to-openapi';
import { Login_Req_Schema, Login_ResBodyObj_Schema } from './model';

export const loginRouterConfig: RouteConfig = {
  method: 'post',
  path: '/api/v1/auth/login',
  tags: ['Auth'],
  request: {
    body: {
      content: {
        'application/json': { schema: Login_Req_Schema.shape.body },
      },
    },
  },
  responses: createApiResponse(Login_ResBodyObj_Schema, 'Success'),
};
