import type { ErrorRequestHandler } from 'express';
import { StatusCodes } from 'http-status-codes';
import { MongoError, MongoServerError } from 'mongodb';
import { ZodError } from 'zod';
import { BaseError } from '../errors/base-error';
import { ServiceResponse } from '../models/serviceResponse';
import { handleServiceResponse } from '../utils/httpHandlers';

const errorHandler: ErrorRequestHandler = (err, req, res, _next) => {
  const logError = (type: string, message: string) => {
    console.error(`[${type}] ${message}`);
  };

  if (err instanceof BaseError) {
    logError('BaseError', `${err.statusCode} - ${err.message}`);
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

    logError('ZodError', `Invalid input: ${issueSummaries.join(', ')}`);

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

      logError('MongoServerError', `Duplicate key error: ${field}=${value}`);
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
      logError('MongoError', 'Database connection refused');
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
      logError('MongoError', 'Authentication failed');
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
      logError('MongoError', 'Invalid operation attempted');
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
      logError('MongoError', 'Write concern error');
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
      logError('MongoError', 'Operation timeout');
      const serviceResponse = ServiceResponse.failure(
        'Database operation timed out',
        null,
        StatusCodes.GATEWAY_TIMEOUT
      );
      handleServiceResponse(serviceResponse, res);
      return;
    }
    // Generic MongoDB Error
    logError('MongoError', `Unhandled MongoDB error: ${err.message}`);
    const serviceResponse = ServiceResponse.failure(
      'Database operation failed',
      null,
      StatusCodes.INTERNAL_SERVER_ERROR
    );
    handleServiceResponse(serviceResponse, res);
    return;
  }

  // Fallback for unhandled errors
  logError('UnhandledError', err.message || 'An unknown error occurred');
  const serviceResponse = ServiceResponse.failure(
    'An unknown error occurred',
    null,
    StatusCodes.INTERNAL_SERVER_ERROR
  );
  handleServiceResponse(serviceResponse, res);
};

export default errorHandler;
