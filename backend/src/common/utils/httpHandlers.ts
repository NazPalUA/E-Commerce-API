import type { NextFunction, Request, Response } from 'express';
import type { ZodSchema } from 'zod';

import { ServiceResponse } from '@/common/models/serviceResponse';

export const handleServiceResponse = (
  serviceResponse: ServiceResponse<any>,
  response: Response
) => {
  return response.status(serviceResponse.statusCode).send(serviceResponse);
};

export const validateRequest =
  (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
    schema.parse({ body: req.body, query: req.query, params: req.params });
    next();
  };
