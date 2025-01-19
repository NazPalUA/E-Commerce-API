import { userRepo } from '@/db/repos/users/user.repo';
import { NotFoundError } from '@/errors/not-found-error';
import { ServiceResponse } from '@/models/serviceResponse';
import { handleServiceResponse } from '@/utils/httpHandlers';
import type { Request, RequestHandler, Response } from 'express';
import { GetAllUsers_ResBodyObj } from './model';

export const getAllUsers: RequestHandler = async (
  _req: Request,
  res: Response
) => {
  const users = await userRepo.findAll();
  if (!users.length) throw new NotFoundError('No Users Found');

  const serviceResponse = ServiceResponse.success<GetAllUsers_ResBodyObj>(
    'Users found',
    users
  );

  handleServiceResponse(serviceResponse, res);
};
