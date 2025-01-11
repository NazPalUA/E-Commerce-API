import { createApiResponse } from '@/api-docs/openAPIResponseBuilders';
import { RouteConfig } from '@asteasolutions/zod-to-openapi';
import {
  CreateProduct_Req_Schema,
  CreateProduct_ResBodyObj_Schema,
} from './model';

export const createProductRouterConfig: RouteConfig = {
  method: 'post',
  path: '/api/v1/products',
  tags: ['Products'],
  summary: '(Require admin access)',
  request: {
    body: {
      content: {
        'application/json': { schema: CreateProduct_Req_Schema.shape.body },
      },
    },
  },
  responses: createApiResponse(CreateProduct_ResBodyObj_Schema, 'Success'),
};
