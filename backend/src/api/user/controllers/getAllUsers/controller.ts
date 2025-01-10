import { userRepo } from '@/common/db/repos/users/user.repo';
import { NotFoundError } from '@/common/errors/not-found-error';
import { ServiceResponse } from '@/common/models/serviceResponse';
import { handleServiceResponse } from '@/common/utils/httpHandlers';
import type { Request, RequestHandler, Response } from 'express';
import { GetAllUsers_ResBodyObj } from './model';

export const getAllUsers: RequestHandler = async (
  _req: Request,
  res: Response
) => {
  const users = await userRepo.findAllUsers();
  if (!users.length) {
    throw new NotFoundError('No Users');
  }

  const serviceResponse = ServiceResponse.success<GetAllUsers_ResBodyObj>(
    'Users found',
    users
  );

  handleServiceResponse(serviceResponse, res);
};
