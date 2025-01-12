import { createApiResponse } from '@/api-docs/openAPIResponseBuilders';
import { RouteConfig } from '@asteasolutions/zod-to-openapi';
import {
  GetProductReviews_Req_Schema,
  GetProductReviews_ResBodyObj_Schema,
} from './model';

export const getProductReviewsRouterConfig: RouteConfig = {
  method: 'get',
  path: '/api/v1/products/{id}/reviews',
  tags: ['Products'],
  request: {
    params: GetProductReviews_Req_Schema.shape.params,
  },
  responses: createApiResponse(GetProductReviews_ResBodyObj_Schema, 'Success'),
};
