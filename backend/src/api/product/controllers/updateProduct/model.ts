import { Product_DTO_Schema } from '@/db/repos/product/product.model';
import { commonValidations } from '@/utils/commonValidation';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

extendZodWithOpenApi(z);

// Request Schema
export const UpdateProduct_ReqBody_Schema = Product_DTO_Schema.omit({
  id: true,
  userId: true,
  createdAt: true,
  updatedAt: true,
}).partial();

export type UpdateProduct_Req = z.infer<typeof UpdateProduct_Req_Schema>;
export const UpdateProduct_Req_Schema = z.object({
  body: UpdateProduct_ReqBody_Schema,
  params: z.object({ id: commonValidations.id }),
});

// Response Schema
export type UpdateProduct_ResBodyObj = z.infer<
  typeof UpdateProduct_ResBodyObj_Schema
>;
export const UpdateProduct_ResBodyObj_Schema = Product_DTO_Schema;
