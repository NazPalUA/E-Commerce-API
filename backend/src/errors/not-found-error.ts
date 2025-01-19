import { StatusCodes } from 'http-status-codes';
import { BaseError } from './base-error';

export class NotFoundError extends BaseError {
  statusCode = StatusCodes.NOT_FOUND;

  constructor(message?: string) {
    super(message || 'Resource not found');
  }
}
