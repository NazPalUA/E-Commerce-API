import { commonValidations } from '@/utils/commonValidation';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

extendZodWithOpenApi(z);

// Request Schema
export type DeleteProduct_Req = z.infer<typeof DeleteProduct_Req_Schema>;

export const DeleteProduct_Req_Schema = z.object({
  params: z.object({ id: commonValidations.id }),
});

// Response Schema
export type DeleteProduct_ResBodyObj = z.infer<
  typeof DeleteProduct_ResBodyObj_Schema
>;
export const DeleteProduct_ResBodyObj_Schema = z.object({
  deleted: z.boolean(),
});
