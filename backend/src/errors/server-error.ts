import { StatusCodes } from 'http-status-codes';
import { BaseError } from './base-error';

export class InternalServerError extends BaseError {
  statusCode = StatusCodes.INTERNAL_SERVER_ERROR;

  constructor(message: string) {
    super(message);
  }
}
