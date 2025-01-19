import { BadRequestError } from '@/errors/bad-request-error';
import { ServiceResponse } from '@/models/serviceResponse';
import { clearAuthCookies } from '@/utils/auth';
import { handleServiceResponse } from '@/utils/httpHandlers';
import { Request, RequestHandler, Response } from 'express';
import { Logout_ResBodyObj } from './model';

export const logout: RequestHandler = async (req: Request, res: Response) => {
  const userId = req.userId;
  if (!userId) throw new BadRequestError('User ID is required');

  clearAuthCookies(res);

  const serviceResponse = ServiceResponse.success<Logout_ResBodyObj>(
    'Logout successful',
    null
  );

  handleServiceResponse(serviceResponse, res);
};
