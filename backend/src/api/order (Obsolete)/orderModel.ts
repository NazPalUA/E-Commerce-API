import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

import { commonValidations } from '@/utils/commonValidation';

extendZodWithOpenApi(z);

export type Order = z.infer<typeof OrderSchema>;

export const OrderItemSchema = z.object({
  name: z.string(),
  price: z.number(),
  image: z.string(),
  amount: z.number(),
  product: z.string(),
});

export const OrderSchema = z.object({
  id: z.number(),

  tax: z.number(),
  shippingFee: z.number(),
  items: z.array(OrderItemSchema),

  createdAt: z.date(),
});

// Input Validation for 'GET orders/:id' endpoint
export const GetOrderSchema = z.object({
  params: z.object({ id: commonValidations.id }),
});
