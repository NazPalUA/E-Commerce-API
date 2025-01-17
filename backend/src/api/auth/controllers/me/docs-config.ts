import { createApiResponse } from '@/api-docs/openAPIResponseBuilders';
import { RouteConfig } from '@asteasolutions/zod-to-openapi';
import { Me_ResBodyObj_Schema } from './model';

export const meRouterConfig: RouteConfig = {
  method: 'get',
  path: '/api/v1/auth/me',
  tags: ['Auth'],
  responses: createApiResponse(Me_ResBodyObj_Schema, 'Success'),
};
