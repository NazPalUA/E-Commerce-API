import { createApiResponse } from '@/api-docs/openAPIResponseBuilders';
import { RouteConfig } from '@asteasolutions/zod-to-openapi';
import {
  ResetPassword_Req_Schema,
  ResetPassword_ResBodyObj_Schema,
} from './model';

export const resetPasswordRouterConfig: RouteConfig = {
  method: 'post',
  path: '/api/v1/auth/reset-password',
  tags: ['Auth'],
  request: {
    body: {
      content: {
        'application/json': {
          schema: ResetPassword_Req_Schema.shape.body,
        },
      },
    },
  },
  responses: createApiResponse(ResetPassword_ResBodyObj_Schema, 'Success'),
};
