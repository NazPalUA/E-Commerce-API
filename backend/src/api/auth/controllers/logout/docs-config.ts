import { createApiResponse } from '@/api-docs/openAPIResponseBuilders';
import { RouteConfig } from '@asteasolutions/zod-to-openapi';
import { Logout_ResBodyObj_Schema } from './model';

export const logoutRouterConfig: RouteConfig = {
  method: 'post',
  path: '/api/v1/auth/logout',
  tags: ['Auth'],
  responses: createApiResponse(Logout_ResBodyObj_Schema, 'Success'),
};
