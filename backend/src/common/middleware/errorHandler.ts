import type { ErrorRequestHandler } from 'express';
import { StatusCodes } from 'http-status-codes';
import pino from 'pino';
import { ZodError } from 'zod';
import { BaseError } from '../errors/base-error';
import { ServiceResponse } from '../models/serviceResponse';
import { handleServiceResponse } from '../utils/httpHandlers';

const logger = pino({ name: 'Error Handler' });

const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof BaseError) {
    logger.warn(`[BaseError] ${err.statusCode} - ${err.message}`);
    const serviceResponse = ServiceResponse.failure(
      err.message,
      null,
      err.statusCode
    );
    handleServiceResponse(serviceResponse, res);
    return;
  }

  if (err instanceof ZodError) {
    const issueSummaries = err.issues.map(issue => {
      const path = issue.path.join('.');
      return `(${path}) ${issue.message}`;
    });

    logger.warn(`[ZodError] Invalid input: ${issueSummaries.join(', ')}`);

    const serviceResponse = ServiceResponse.failure(
      `Invalid input: ${issueSummaries.join(', ')}`,
      null,
      StatusCodes.BAD_REQUEST
    );
    handleServiceResponse(serviceResponse, res);
    return;
  }

  logger.error(`[UnhandledError] ${err}`);
  const serviceResponse = ServiceResponse.failure(
    'An unknown error occurred',
    null,
    StatusCodes.INTERNAL_SERVER_ERROR
  );
  handleServiceResponse(serviceResponse, res);
};

export default errorHandler;
