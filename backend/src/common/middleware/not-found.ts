import type { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { ServiceResponse } from '../models/serviceResponse';
import { handleServiceResponse } from '../utils/httpHandlers';

const notFound = (_req: Request, res: Response) => {
  const serviceResponse = ServiceResponse.failure(
    'Route does not exist',
    null,
    StatusCodes.NOT_FOUND
  );
  handleServiceResponse(serviceResponse, res);
};

export default notFound;
