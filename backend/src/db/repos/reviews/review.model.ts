import { commonValidations } from '@/utils/commonValidation';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { ObjectId } from 'mongodb';
import { z } from 'zod';

extendZodWithOpenApi(z);

export type Review_DbEntity = z.infer<typeof Review_DbEntity_Schema>;
export type NewReview = z.input<typeof Review_DbEntity_Schema>;

// Schema for review database entity (includes _id)
export const Review_DbEntity_Schema = z
  .object({
    _id: commonValidations.objectId,
    rating: z.number().min(1).max(5).default(0),
    title: z.string().min(3).max(100),
    comment: z.string().min(10).max(1000),
    user: z.string().transform(id => new ObjectId(id)),
    product: z.string().transform(id => new ObjectId(id)),
    createdAt: z.date().default(new Date()),
    updatedAt: z.date().default(new Date()),
  })
  .strict();

export type Review_DTO = z.infer<typeof Review_DTO_Schema>;
export const Review_DTO_Schema = Review_DbEntity_Schema.omit({
  _id: true,
  user: true,
  product: true,
}).extend({
  id: commonValidations.id,
  userId: commonValidations.id,
  productId: commonValidations.id,
});

export const getReviewDTO = (review: Review_DbEntity): Review_DTO => {
  const { _id, user, product, ...rest } = review;
  return {
    ...rest,
    id: _id.toString(),
    userId: user.toString(),
    productId: product.toString(),
  };
};
