import { logger } from '@/server';
import type { ErrorRequestHandler } from 'express';
import { StatusCodes } from 'http-status-codes';
import { ZodError } from 'zod';
import { BaseError } from '../errors/base-error';
import { ServiceResponse } from '../models/serviceResponse';
import { handleServiceResponse } from '../utils/httpHandlers';

const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof BaseError) {
    const serviceResponse = ServiceResponse.failure(
      err.message,
      null,
      err.statusCode
    );
    return handleServiceResponse(serviceResponse, res);
  }

  if (err instanceof ZodError) {
    const errorMessage = `Invalid input: ${err.errors
      .map(e => e.message)
      .join(', ')}`;
    const serviceResponse = ServiceResponse.failure(
      errorMessage,
      null,
      StatusCodes.BAD_REQUEST
    );
    return handleServiceResponse(serviceResponse, res);
  }

  logger.error(err);

  const serviceResponse = ServiceResponse.failure(
    'An unknown error occurred',
    null,
    StatusCodes.INTERNAL_SERVER_ERROR
  );
  return handleServiceResponse(serviceResponse, res);
};

export default errorHandler;
