import { ObjectId } from 'mongodb';
import { z } from 'zod';

export const commonValidations = {
  id: z
    .string()
    .refine(data => ObjectId.isValid(data), 'ID must be a valid ObjectId'),

  objectId: z.instanceof(ObjectId).default(new ObjectId()),

  password: z.string().min(8).max(255),
};
