import { createApiResponse } from '@/api-docs/openAPIResponseBuilders';
import { RouteConfig } from '@asteasolutions/zod-to-openapi';
import {
  GetSingleProduct_Req_Schema,
  GetSingleProduct_ResBodyObj_Schema,
} from './model';

export const getSingleProductRouterConfig: RouteConfig = {
  method: 'get',
  path: '/api/v1/products/{id}',
  tags: ['Products'],
  request: {
    params: GetSingleProduct_Req_Schema.shape.params,
  },
  responses: createApiResponse(GetSingleProduct_ResBodyObj_Schema, 'Success'),
};
