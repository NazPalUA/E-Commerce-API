import { commonValidations } from '@/utils/commonValidation';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { ObjectId } from 'mongodb';
import { z } from 'zod';
import { ProductCategories } from './constants/ProductCategories';
import { ProductCompanies } from './constants/ProductCompanies';
extendZodWithOpenApi(z);

export type Product_DbEntity = z.infer<typeof Product_DbEntity_Schema>;
export type NewProduct = z.input<typeof Product_DbEntity_Schema>;

export const Product_DbEntity_Schema = z
  .object({
    _id: commonValidations.objectId,
    name: z.string().min(3).max(100),
    price: z.number().positive(),
    description: z.string().min(10).max(1000),
    image: z.string().url(),
    category: z.nativeEnum(ProductCategories),
    company: z.nativeEnum(ProductCompanies),
    colors: z.array(z.string()),
    featured: z.boolean().default(false),
    freeShipping: z.boolean().default(false),
    inventory: z.number().int().nonnegative(),
    averageRating: z.number().min(0).max(5).default(0),
    user: z.string().transform(id => new ObjectId(id)),
    createdAt: z.date().default(new Date()),
    updatedAt: z.date().default(new Date()),
  })
  .strict();

// Product DTO Schema
export type Product_DTO = z.infer<typeof Product_DTO_Schema>;
export const Product_DTO_Schema = Product_DbEntity_Schema.omit({
  _id: true,
  user: true,
}).extend({
  id: commonValidations.id,
  userId: commonValidations.id,
});

export const getProductDTO = (product: Product_DbEntity): Product_DTO => {
  const { _id, user, ...rest } = product;
  return {
    ...rest,
    id: _id.toString(),
    userId: user.toString(),
  };
};
