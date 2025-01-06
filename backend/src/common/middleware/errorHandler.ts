import type { ErrorRequestHandler } from 'express';
import { StatusCodes } from 'http-status-codes';
import { MongoError, MongoServerError } from 'mongodb';
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

  // MongoDB Error Handling
  if (err instanceof MongoError) {
    // Duplicate Key Error (e.g., unique constraint violation)
    if (err instanceof MongoServerError && err.code === 11000) {
      const keyValue = err.keyValue as Record<string, any>;
      const field = Object.keys(keyValue)[0];
      const value = keyValue[field];

      logger.warn(`[MongoServerError] Duplicate key error: ${field}=${value}`);
      const serviceResponse = ServiceResponse.failure(
        `${field} "${value}" already exists`,
        null,
        StatusCodes.CONFLICT
      );
      handleServiceResponse(serviceResponse, res);
      return;
    }

    // Connection Errors
    if (err.code === 'ECONNREFUSED') {
      logger.error('[MongoError] Database connection refused');
      const serviceResponse = ServiceResponse.failure(
        'Database connection error',
        null,
        StatusCodes.SERVICE_UNAVAILABLE
      );
      handleServiceResponse(serviceResponse, res);
      return;
    }

    // Authentication Errors
    if (err.code === 18) {
      logger.error('[MongoError] Authentication failed');
      const serviceResponse = ServiceResponse.failure(
        'Database authentication error',
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
      handleServiceResponse(serviceResponse, res);
      return;
    }

    // Invalid Operation Errors
    if (err instanceof MongoServerError && err.code === 51) {
      logger.error('[MongoError] Invalid operation attempted');
      const serviceResponse = ServiceResponse.failure(
        'Invalid database operation',
        null,
        StatusCodes.BAD_REQUEST
      );
      handleServiceResponse(serviceResponse, res);
      return;
    }

    // Write Concern Errors
    if (err instanceof MongoServerError && err.code === 100) {
      logger.error('[MongoError] Write concern error');
      const serviceResponse = ServiceResponse.failure(
        'Database write operation failed',
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
      handleServiceResponse(serviceResponse, res);
      return;
    }

    // Timeout Errors
    if (err.code === 'ETIMEDOUT') {
      logger.error('[MongoError] Operation timeout');
      const serviceResponse = ServiceResponse.failure(
        'Database operation timed out',
        null,
        StatusCodes.GATEWAY_TIMEOUT
      );
      handleServiceResponse(serviceResponse, res);
      return;
    }

    // Generic MongoDB Error
    logger.error(`[MongoError] Unhandled MongoDB error: ${err.message}`);
    const serviceResponse = ServiceResponse.failure(
      'Database operation failed',
      null,
      StatusCodes.INTERNAL_SERVER_ERROR
    );
    handleServiceResponse(serviceResponse, res);
    return;
  }

  // Fallback for unhandled errors
  logger.error(`[UnhandledError] ${err}`);
  const serviceResponse = ServiceResponse.failure(
    'An unknown error occurred',
    null,
    StatusCodes.INTERNAL_SERVER_ERROR
  );
  handleServiceResponse(serviceResponse, res);
};

export default errorHandler;
