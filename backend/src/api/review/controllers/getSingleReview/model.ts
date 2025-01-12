import { Review_DTO_Schema } from '@/db/repos/reviews/review.model';
import { commonValidations } from '@/utils/commonValidation';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

extendZodWithOpenApi(z);

// Request Schema
export type GetSingleReview_Req = z.infer<typeof GetSingleReview_Req_Schema>;

export const GetSingleReview_Req_Schema = z.object({
  params: z.object({ id: commonValidations.id }),
});

// Response Schema
export type GetSingleReview_ResBodyObj = z.infer<
  typeof GetSingleReview_ResBodyObj_Schema
>;
export const GetSingleReview_ResBodyObj_Schema = Review_DTO_Schema;
