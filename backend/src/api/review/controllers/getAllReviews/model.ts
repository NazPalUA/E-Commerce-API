import { Review_DTO_Schema } from '@/db/repos/reviews/review.model';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

extendZodWithOpenApi(z);

// Response Schema
export type GetAllReviews_ResBodyObj = z.infer<
  typeof GetAllReviews_ResBodyObj_Schema
>;
export const GetAllReviews_ResBodyObj_Schema = z.array(Review_DTO_Schema);
