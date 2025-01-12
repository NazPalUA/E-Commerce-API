import { createApiResponse } from '@/api-docs/openAPIResponseBuilders';
import { RouteConfig } from '@asteasolutions/zod-to-openapi';
import {
  DeleteReview_Req_Schema,
  DeleteReview_ResBodyObj_Schema,
} from './model';

export const deleteReviewRouterConfig: RouteConfig = {
  method: 'delete',
  path: '/api/v1/reviews/{id}',
  tags: ['Reviews'],
  request: {
    params: DeleteReview_Req_Schema.shape.params,
  },
  responses: createApiResponse(DeleteReview_ResBodyObj_Schema, 'Success'),
};
