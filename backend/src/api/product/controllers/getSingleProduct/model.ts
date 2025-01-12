import { Product_DTO_Schema } from '@/db/repos/products/product.model';
import { commonValidations } from '@/utils/commonValidation';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

extendZodWithOpenApi(z);

// Request Schema
export type GetSingleProduct_Req = z.infer<typeof GetSingleProduct_Req_Schema>;

export const GetSingleProduct_Req_Schema = z.object({
  params: z.object({ id: commonValidations.id }),
});

// Response Schema
export type GetSingleProduct_ResBodyObj = z.infer<
  typeof GetSingleProduct_ResBodyObj_Schema
>;
export const GetSingleProduct_ResBodyObj_Schema = Product_DTO_Schema;
