import { userRepo } from '@/db/repos/users/user.repo';
import { NotFoundError } from '@/errors/not-found-error';
import { UnauthorizedError } from '@/errors/unauthorized-error';
import { ServiceResponse } from '@/models/serviceResponse';
import { handleServiceResponse } from '@/utils/httpHandlers';
import type { Request, RequestHandler, Response } from 'express';
import { GetMe_ResBodyObj } from './model';

export const getMe: RequestHandler = async (req: Request, res: Response) => {
  const userId = req.userId;
  if (!userId) throw new UnauthorizedError('User ID not found');

  const user = await userRepo.findUserById(userId);
  if (!user) {
    throw new NotFoundError('User');
  }

  const serviceResponse = ServiceResponse.success<GetMe_ResBodyObj>(
    'User found',
    user
  );
  handleServiceResponse(serviceResponse, res);
};
