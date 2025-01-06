import { StatusCodes } from 'http-status-codes';
import { BaseError } from './base-error';

export class NotFoundError extends BaseError {
  statusCode = StatusCodes.NOT_FOUND;

  constructor(resource: string) {
    super(`${resource} not found`);
  }
}
