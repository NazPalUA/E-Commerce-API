import { createApiResponse } from '@/api-docs/openAPIResponseBuilders';
import { RouteConfig } from '@asteasolutions/zod-to-openapi';
import {
  CreateReview_Req_Schema,
  CreateReview_ResBodyObj_Schema,
} from './model';

export const createReviewRouterConfig: RouteConfig = {
  method: 'post',
  path: '/api/v1/reviews',
  tags: ['Reviews'],
  request: {
    body: {
      content: {
        'application/json': { schema: CreateReview_Req_Schema.shape.body },
      },
    },
  },
  responses: createApiResponse(CreateReview_ResBodyObj_Schema, 'Success'),
};
