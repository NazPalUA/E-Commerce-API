import { createApiResponse } from '@/api-docs/openAPIResponseBuilders';
import { RouteConfig } from '@asteasolutions/zod-to-openapi';
import {
  GetSingleReview_Req_Schema,
  GetSingleReview_ResBodyObj_Schema,
} from './model';

export const getSingleReviewRouterConfig: RouteConfig = {
  method: 'get',
  path: '/api/v1/reviews/{id}',
  tags: ['Reviews'],
  request: {
    params: GetSingleReview_Req_Schema.shape.params,
  },
  responses: createApiResponse(GetSingleReview_ResBodyObj_Schema, 'Success'),
};
