import { createApiResponse } from '@/api-docs/openAPIResponseBuilders';
import { RouteConfig } from '@asteasolutions/zod-to-openapi';
import {
  DeleteProduct_Req_Schema,
  DeleteProduct_ResBodyObj_Schema,
} from './model';

export const deleteProductRouterConfig: RouteConfig = {
  method: 'delete',
  path: '/api/v1/products/{id}',
  tags: ['Products'],
  summary: '(Require admin access)',
  request: {
    params: DeleteProduct_Req_Schema.shape.params,
  },
  responses: createApiResponse(DeleteProduct_ResBodyObj_Schema, 'Success'),
};
