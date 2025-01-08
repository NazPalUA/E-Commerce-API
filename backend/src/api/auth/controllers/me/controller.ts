import { UnauthorizedError } from '@/common/errors/unauthorized-error';
import { ServiceResponse } from '@/common/models/serviceResponse';
import { handleServiceResponse } from '@/common/utils/httpHandlers';
import { decodeToken } from '@/common/utils/jwt';
import { Request, RequestHandler, Response } from 'express';
import { Me_ResBodyObj } from './model';

export const getMe: RequestHandler = async (req: Request, res: Response) => {
  const token = req.signedCookies['token'];

  if (!token) {
    throw new UnauthorizedError('Authentication token missing');
  }

  const decoded = decodeToken(token);
  const { iat, exp, ...payload } = decoded;

  const serviceResponse = ServiceResponse.success<Me_ResBodyObj>(
    'Current user retrieved',
    payload
  );

  handleServiceResponse(serviceResponse, res);
};
