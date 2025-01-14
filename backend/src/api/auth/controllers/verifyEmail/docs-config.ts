import { createApiResponse } from '@/api-docs/openAPIResponseBuilders';
import { RouteConfig } from '@asteasolutions/zod-to-openapi';
import { VerifyEmail_Req_Schema, VerifyEmail_ResBodyObj_Schema } from './model';

export const verifyEmailRouterConfig: RouteConfig = {
  method: 'post',
  path: '/api/v1/auth/verify-email',
  tags: ['Auth'],
  request: {
    body: {
      content: {
        'application/json': {
          schema: VerifyEmail_Req_Schema.shape.body,
        },
      },
    },
  },
  responses: createApiResponse(VerifyEmail_ResBodyObj_Schema, 'Success'),
};
