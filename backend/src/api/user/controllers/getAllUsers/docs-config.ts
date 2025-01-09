import { createApiResponse } from '@/api-docs/openAPIResponseBuilders';
import { RouteConfig } from '@asteasolutions/zod-to-openapi';
import { GetAllUsers_ResBodyObj_Schema } from './model';

export const getUsersRouterConfig: RouteConfig = {
  method: 'get',
  path: '/api/v1/users',
  tags: ['User'],
  // request: { query: GetAllUsers_Req_Schema.shape.query },
  responses: createApiResponse(GetAllUsers_ResBodyObj_Schema, 'Success'),
};
