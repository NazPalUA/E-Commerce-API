import { createApiResponse } from '@/api-docs/openAPIResponseBuilders';
import { RouteConfig } from '@asteasolutions/zod-to-openapi';
import {
  ForgotPassword_Req_Schema,
  ForgotPassword_ResBodyObj_Schema,
} from './model';

export const forgotPasswordRouterConfig: RouteConfig = {
  method: 'post',
  path: '/api/v1/auth/forgot-password',
  tags: ['Auth'],
  request: {
    body: {
      content: {
        'application/json': {
          schema: ForgotPassword_Req_Schema.shape.body,
        },
      },
    },
  },
  responses: createApiResponse(ForgotPassword_ResBodyObj_Schema, 'Success'),
};
