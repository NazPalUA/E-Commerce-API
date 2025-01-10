import { StatusCodes } from 'http-status-codes';
import { BaseError } from './base-error';

export class BadRequestError extends BaseError {
  statusCode = StatusCodes.BAD_REQUEST;

  constructor(message: string) {
    super(message);
  }
}
