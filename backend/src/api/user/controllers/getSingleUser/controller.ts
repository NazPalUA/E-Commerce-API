import { userRepo } from '@/common/db/repos/users/user.repo';
import { NotFoundError } from '@/common/errors/not-found-error';
import { ServiceResponse } from '@/common/models/serviceResponse';
import {
  handleServiceResponse,
  validateReq,
} from '@/common/utils/httpHandlers';
import type { Request, RequestHandler, Response } from 'express';
import { GetSingleUser_Req_Schema, GetSingleUser_ResBodyObj } from './model';

export const getSingleUser: RequestHandler = async (
  req: Request,
  res: Response
) => {
  const { params } = validateReq(req, GetSingleUser_Req_Schema);

  const user = await userRepo.findUserById(params.id);
  if (!user) {
    throw new NotFoundError('User');
  }

  const serviceResponse = ServiceResponse.success<GetSingleUser_ResBodyObj>(
    'User found',
    user
  );
  handleServiceResponse(serviceResponse, res);
};
