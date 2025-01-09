import { ServiceResponse } from '@/common/models/serviceResponse';
import { handleServiceResponse } from '@/common/utils/httpHandlers';
import { clearCookies } from '@/common/utils/jwt';
import { Request, RequestHandler, Response } from 'express';
import { Logout_ResBodyObj } from './model';

export const logout: RequestHandler = async (_req: Request, res: Response) => {
  clearCookies(res);

  const serviceResponse = ServiceResponse.success<Logout_ResBodyObj>(
    'Logout successful',
    null
  );

  handleServiceResponse(serviceResponse, res);
};