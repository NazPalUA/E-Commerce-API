import { Review_DTO_Schema } from '@/db/repos/reviews/review.model';
import { commonValidations } from '@/utils/commonValidation';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

extendZodWithOpenApi(z);

// Request Schema
export type GetProductReviews_Req = z.infer<
  typeof GetProductReviews_Req_Schema
>;

export const GetProductReviews_Req_Schema = z.object({
  params: z.object({ id: commonValidations.id }),
});

// Response Schema
export type GetProductReviews_ResBodyObj = z.infer<
  typeof GetProductReviews_ResBodyObj_Schema
>;
export const GetProductReviews_ResBodyObj_Schema = z.array(Review_DTO_Schema);
