import { createApiResponse } from '@/api-docs/openAPIResponseBuilders';
import { RouteConfig } from '@asteasolutions/zod-to-openapi';
import { GetMe_ResBodyObj_Schema } from './model';

export const getMeRouterConfig: RouteConfig = {
  method: 'get',
  path: '/api/v1/users/me',
  tags: ['User'],

  responses: createApiResponse(GetMe_ResBodyObj_Schema, 'Success'),
};
