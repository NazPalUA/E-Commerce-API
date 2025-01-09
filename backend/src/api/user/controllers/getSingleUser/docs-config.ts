import { createApiResponse } from '@/api-docs/openAPIResponseBuilders';
import { RouteConfig } from '@asteasolutions/zod-to-openapi';
import {
  GetSingleUser_Req_Schema,
  GetSingleUser_ResBodyObj_Schema,
} from './model';

export const getUserRouterConfig: RouteConfig = {
  method: 'get',
  path: '/api/v1/users/{id}',
  tags: ['User'],
  request: { params: GetSingleUser_Req_Schema.shape.params },
  responses: createApiResponse(GetSingleUser_ResBodyObj_Schema, 'Success'),
};
