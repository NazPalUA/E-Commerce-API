import { createApiResponse } from '@/api-docs/openAPIResponseBuilders';
import { RouteConfig } from '@asteasolutions/zod-to-openapi';
import {
  UpdateUserInfo_Req_Schema,
  UpdateUserInfo_ResBodyObj_Schema,
} from './model';

export const updateUserRouterConfig: RouteConfig = {
  method: 'patch',
  path: '/api/v1/users/update-info',
  tags: ['User'],
  request: {
    body: {
      content: {
        'application/json': {
          schema: UpdateUserInfo_Req_Schema.shape.body,
        },
      },
    },
  },
  responses: createApiResponse(UpdateUserInfo_ResBodyObj_Schema, 'Success'),
};
