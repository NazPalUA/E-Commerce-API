import { createApiResponse } from '@/api-docs/openAPIResponseBuilders';
import { RouteConfig } from '@asteasolutions/zod-to-openapi';
import { GetAllProducts_ResBodyObj_Schema } from './model';

export const getAllProductsRouterConfig: RouteConfig = {
  method: 'get',
  path: '/api/v1/products',
  tags: ['Products'],
  responses: createApiResponse(GetAllProducts_ResBodyObj_Schema, 'Success'),
};
