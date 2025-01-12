import { createApiResponse } from '@/api-docs/openAPIResponseBuilders';
import { RouteConfig } from '@asteasolutions/zod-to-openapi';
import {
  UpdateReview_Req_Schema,
  UpdateReview_ResBodyObj_Schema,
} from './model';

export const updateReviewRouterConfig: RouteConfig = {
  method: 'patch',
  path: '/api/v1/reviews/{id}',
  tags: ['Reviews'],
  request: {
    params: UpdateReview_Req_Schema.shape.params,
    body: {
      content: {
        'application/json': { schema: UpdateReview_Req_Schema.shape.body },
      },
    },
  },
  responses: createApiResponse(UpdateReview_ResBodyObj_Schema, 'Success'),
};
