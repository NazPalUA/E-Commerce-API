import { createApiResponse } from '@/api-docs/openAPIResponseBuilders';
import { RouteConfig } from '@asteasolutions/zod-to-openapi';
import { GetUser_Req_Schema, GetUser_ResBodyObj_Schema } from './model';

export const getUserRouterConfig: RouteConfig = {
  method: 'get',
  path: '/api/v1/users/{id}',
  tags: ['User'],
  request: { params: GetUser_Req_Schema.shape.params },
  responses: createApiResponse(GetUser_ResBodyObj_Schema, 'Success'),
};
