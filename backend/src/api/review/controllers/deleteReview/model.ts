import { commonValidations } from '@/utils/commonValidation';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

extendZodWithOpenApi(z);

// Request Schema
export type DeleteReview_Req = z.infer<typeof DeleteReview_Req_Schema>;

export const DeleteReview_Req_Schema = z.object({
  params: z.object({ id: commonValidations.id }),
});

// Response Schema
export type DeleteReview_ResBodyObj = z.infer<
  typeof DeleteReview_ResBodyObj_Schema
>;
export const DeleteReview_ResBodyObj_Schema = z.object({
  deleted: z.boolean(),
});
