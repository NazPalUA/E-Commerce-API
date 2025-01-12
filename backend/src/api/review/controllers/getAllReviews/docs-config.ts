import { createApiResponse } from '@/api-docs/openAPIResponseBuilders';
import { RouteConfig } from '@asteasolutions/zod-to-openapi';
import { GetAllReviews_ResBodyObj_Schema } from './model';

export const getAllReviewsRouterConfig: RouteConfig = {
  method: 'get',
  path: '/api/v1/reviews',
  tags: ['Reviews'],
  responses: createApiResponse(GetAllReviews_ResBodyObj_Schema, 'Success'),
};
