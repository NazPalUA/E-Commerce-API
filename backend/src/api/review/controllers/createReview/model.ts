import { Review_DTO_Schema } from '@/db/repos/reviews/review.model';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

extendZodWithOpenApi(z);

// Request Schema
export type CreateReview_ReqBody = z.infer<typeof CreateReview_ReqBody_Schema>;
export const CreateReview_ReqBody_Schema = Review_DTO_Schema.omit({
  id: true,
  userId: true,
  createdAt: true,
  updatedAt: true,
});

export const CreateReview_Req_Schema = z.object({
  body: CreateReview_ReqBody_Schema,
});

// Response Schema
export type CreateReview_ResBodyObj = z.infer<
  typeof CreateReview_ResBodyObj_Schema
>;
export const CreateReview_ResBodyObj_Schema = Review_DTO_Schema;
