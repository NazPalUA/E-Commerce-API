import { Review_DTO_Schema } from '@/db/repos/reviews/review.model';
import { commonValidations } from '@/utils/commonValidation';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

extendZodWithOpenApi(z);

// Request Schema
export const UpdateReview_ReqBody_Schema = Review_DTO_Schema.omit({
  id: true,
  productId: true,
  userId: true,
  createdAt: true,
  updatedAt: true,
}).partial();

export type UpdateReview_Req = z.infer<typeof UpdateReview_Req_Schema>;
export const UpdateReview_Req_Schema = z.object({
  body: UpdateReview_ReqBody_Schema,
  params: z.object({ id: commonValidations.id }),
});

// Response Schema
export type UpdateReview_ResBodyObj = z.infer<
  typeof UpdateReview_ResBodyObj_Schema
>;
export const UpdateReview_ResBodyObj_Schema = Review_DTO_Schema;
