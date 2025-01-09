import { createApiResponse } from '@/api-docs/openAPIResponseBuilders';
import { RouteConfig } from '@asteasolutions/zod-to-openapi';
import { GetUsers_ResBodyObj_Schema } from './model';

export const getUsersRouterConfig: RouteConfig = {
  method: 'get',
  path: '/api/v1/users',
  tags: ['User'],
  // request: { query: GetUsers_Req_Schema.shape.query },
  responses: createApiResponse(GetUsers_ResBodyObj_Schema, 'Success'),
};
