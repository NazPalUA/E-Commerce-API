import { createApiResponse } from '@/api-docs/openAPIResponseBuilders';
import { RouteConfig } from '@asteasolutions/zod-to-openapi';
import {
  UpdateUserPassword_Req_Schema,
  UpdateUserPassword_ResBodyObj_Schema,
} from './model';

export const updateUserPasswordRouterConfig: RouteConfig = {
  method: 'patch',
  path: '/api/v1/users/update-password',
  tags: ['User'],
  request: {
    body: {
      content: {
        'application/json': {
          schema: UpdateUserPassword_Req_Schema.shape.body,
        },
      },
    },
  },
  responses: createApiResponse(UpdateUserPassword_ResBodyObj_Schema, 'Success'),
};
