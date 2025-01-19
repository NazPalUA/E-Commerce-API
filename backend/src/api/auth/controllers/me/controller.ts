import { UnauthorizedError } from '@/errors/unauthorized-error';
import { ServiceResponse } from '@/models/serviceResponse';
import { handleServiceResponse } from '@/utils/httpHandlers';

import { decodeAccessJWT } from '@/utils/auth';
import { Request, RequestHandler, Response } from 'express';
import { Me_ResBodyObj } from './model';

export const getMe: RequestHandler = async (req: Request, res: Response) => {
  const token = req.signedCookies['token'];

  if (!token) throw new UnauthorizedError('Authentication token missing');

  const { iat, exp, ...payload } = decodeAccessJWT(token);

  const serviceResponse = ServiceResponse.success<Me_ResBodyObj>(
    'Current user retrieved',
    payload
  );

  handleServiceResponse(serviceResponse, res);
};
