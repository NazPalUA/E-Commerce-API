import { Product_DTO_Schema } from '@/db/repos/products/product.model';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

extendZodWithOpenApi(z);

// Request Schema
export type CreateProduct_ReqBody = z.infer<
  typeof CreateProduct_ReqBody_Schema
>;
export const CreateProduct_ReqBody_Schema = Product_DTO_Schema.omit({
  id: true,
  userId: true,
  createdAt: true,
  updatedAt: true,
});

export const CreateProduct_Req_Schema = z.object({
  body: CreateProduct_ReqBody_Schema,
});

// Response Schema
export type CreateProduct_ResBodyObj = z.infer<
  typeof CreateProduct_ResBodyObj_Schema
>;
export const CreateProduct_ResBodyObj_Schema = Product_DTO_Schema;
