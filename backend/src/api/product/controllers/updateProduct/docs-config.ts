import { createApiResponse } from '@/api-docs/openAPIResponseBuilders';
import { RouteConfig } from '@asteasolutions/zod-to-openapi';
import {
  UpdateProduct_Req_Schema,
  UpdateProduct_ResBodyObj_Schema,
} from './model';

export const updateProductRouterConfig: RouteConfig = {
  method: 'patch',
  path: '/api/v1/products/{id}',
  tags: ['Products'],
  summary: '(Require admin access)',
  request: {
    params: UpdateProduct_Req_Schema.shape.params,
    body: {
      content: {
        'application/json': { schema: UpdateProduct_Req_Schema.shape.body },
      },
    },
  },
  responses: createApiResponse(UpdateProduct_ResBodyObj_Schema, 'Success'),
};
