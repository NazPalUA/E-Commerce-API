import { StatusCodes } from 'http-status-codes';
import { BaseError } from './base-error';

export class ConflictError extends BaseError {
  statusCode = StatusCodes.CONFLICT;

  constructor(message: string) {
    super(message);
  }
}
