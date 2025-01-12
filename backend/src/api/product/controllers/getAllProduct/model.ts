import { Product_DTO_Schema } from '@/db/repos/products/product.model';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

extendZodWithOpenApi(z);

// Response Schema
export type GetAllProducts_ResBodyObj = z.infer<
  typeof GetAllProducts_ResBodyObj_Schema
>;
export const GetAllProducts_ResBodyObj_Schema = z.array(Product_DTO_Schema);
