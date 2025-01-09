import { userRepo } from '@/common/db/repos/users/user.repo';
import { ForbiddenError } from '@/common/errors/forbidden-error';
import { NotFoundError } from '@/common/errors/not-found-error';
import { ServiceResponse } from '@/common/models/serviceResponse';
import {
  handleServiceResponse,
  validateReq,
} from '@/common/utils/httpHandlers';
import { toDTO } from '@/common/utils/toDTO';
import type { Request, RequestHandler, Response } from 'express';
import { ObjectId } from 'mongodb';
import { UpdateUser_Req_Schema, UpdateUser_ResBodyObj } from './model';

export const updateUser: RequestHandler = async (
  req: Request,
  res: Response
) => {
  const { params, body: userData } = validateReq(req, UpdateUser_Req_Schema);

  const hasAccess = params.id === req.userId;
  if (!hasAccess) {
    throw new ForbiddenError('You are not allowed to update this user');
  }

  const user = await userRepo.updateUser(new ObjectId(params.id), userData);
  if (!user) {
    throw new NotFoundError('User');
  }

  const serviceResponse = ServiceResponse.success<UpdateUser_ResBodyObj>(
    'User found',
    toDTO(user)
  );
  handleServiceResponse(serviceResponse, res);
};
