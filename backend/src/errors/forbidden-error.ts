import { StatusCodes } from 'http-status-codes';
import { BaseError } from './base-error';

export class ForbiddenError extends BaseError {
  statusCode = StatusCodes.FORBIDDEN;

  constructor(message: string = 'Forbidden') {
    super(message);
  }
}
