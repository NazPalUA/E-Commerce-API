import { StatusCodes } from 'http-status-codes';
import { BaseError } from './base-error';

export class UnauthorizedError extends BaseError {
  statusCode = StatusCodes.UNAUTHORIZED;

  constructor(message: string = 'Unauthorized') {
    super(message);
  }
}
