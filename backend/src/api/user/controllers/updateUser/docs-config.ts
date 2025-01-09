import { createApiResponse } from '@/api-docs/openAPIResponseBuilders';
import { RouteConfig } from '@asteasolutions/zod-to-openapi';
import { UpdateUser_Req_Schema, UpdateUser_ResBodyObj_Schema } from './model';

export const updateUserRouterConfig: RouteConfig = {
  method: 'patch',
  path: '/api/v1/users/{id}',
  tags: ['User'],
  request: {
    params: UpdateUser_Req_Schema.shape.params,
    body: {
      content: {
        'application/json': {
          schema: UpdateUser_Req_Schema.shape.body,
        },
      },
    },
  },
  responses: createApiResponse(UpdateUser_ResBodyObj_Schema, 'Success'),
};
