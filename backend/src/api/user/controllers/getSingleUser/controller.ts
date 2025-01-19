import { userRepo } from '@/db/repos/users/user.repo';
import { NotFoundError } from '@/errors/not-found-error';
import { ServiceResponse } from '@/models/serviceResponse';
import { handleServiceResponse, validateReq } from '@/utils/httpHandlers';
import type { Request, RequestHandler, Response } from 'express';
import { GetSingleUser_Req_Schema, GetSingleUser_ResBodyObj } from './model';

export const getSingleUser: RequestHandler = async (
  req: Request,
  res: Response
) => {
  const { params } = validateReq(req, GetSingleUser_Req_Schema);

  const user = await userRepo.findUserById(params.id);
  if (!user) throw new NotFoundError('User with this id not found');

  const serviceResponse = ServiceResponse.success<GetSingleUser_ResBodyObj>(
    'User found',
    user
  );
  handleServiceResponse(serviceResponse, res);
};
