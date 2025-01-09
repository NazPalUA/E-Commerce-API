import { createApiResponse } from '@/api-docs/openAPIResponseBuilders';
import { RouteConfig } from '@asteasolutions/zod-to-openapi';
import { Register_Req_Schema, Register_ResBodyObj_Schema } from './model';

export const registerRouterConfig: RouteConfig = {
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
};
