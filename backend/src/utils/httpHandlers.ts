import { ServiceResponse } from '@/models/serviceResponse';
import type { Request, Response } from 'express';
import { infer as ZodInfer, ZodObject } from 'zod';

export const handleServiceResponse = (
  serviceResponse: ServiceResponse<any>,
  response: Response
) => {
  return response.status(serviceResponse.statusCode).send(serviceResponse);
};

export function validateReq<TSchema extends ZodObject<any>>(
  req: Request,
  schema: TSchema
): ZodInfer<TSchema> {
  const { shape } = schema;
  const data: Partial<Record<keyof typeof shape, unknown>> = {};

  if ('body' in shape) data.body = req.body;
  if ('query' in shape) data.query = req.query;
  if ('params' in shape) data.params = req.params;

  return schema.parse(data);
}
