import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

import { commonValidations } from '@/utils/commonValidation';

extendZodWithOpenApi(z);

export type Product = z.infer<typeof ProductSchema>;

export const ProductSchema = z.object({
  id: z.number(),

  name: z.string(),
  price: z.number(),
  image: z.string(),
  colors: z.array(z.string()),
  company: z.string(),
  description: z.string(),
  category: z.string(),

  createdAt: z.date(),
  updatedAt: z.date(),
});

// Input Validation for 'GET products/:id' endpoint
export const GetProductSchema = z.object({
  params: z.object({ id: commonValidations.id }),
});
