import { userRepo } from '@/common/db/repos/users/user.repo';
import { ForbiddenError } from '@/common/errors/forbidden-error';
import { NotFoundError } from '@/common/errors/not-found-error';
import { ServiceResponse } from '@/common/models/serviceResponse';
import {
  handleServiceResponse,
  validateReq,
} from '@/common/utils/httpHandlers';
import {
  attachCookiesToResponse,
  getTokenPayloadFromUser,
} from '@/common/utils/jwt';
import { toDTO } from '@/common/utils/toDTO';
import type { Request, RequestHandler, Response } from 'express';
import { ObjectId } from 'mongodb';
import { UpdateUserInfo_Req_Schema, UpdateUserInfo_ResBodyObj } from './model';

export const updateUserInfo: RequestHandler = async (
  req: Request,
  res: Response
) => {
  const { params, body: userData } = validateReq(
    req,
    UpdateUserInfo_Req_Schema
  );

  const hasAccess = params.id === req.userId;
  if (!hasAccess) {
    throw new ForbiddenError('You are not allowed to update this user');
  }

  const user = await userRepo.findUserAndUpdate(
    new ObjectId(params.id),
    userData
  );
  if (!user) {
    throw new NotFoundError('User');
  }

  const tokenUser = getTokenPayloadFromUser(user);
  attachCookiesToResponse(res, tokenUser);

  const serviceResponse = ServiceResponse.success<UpdateUserInfo_ResBodyObj>(
    'User found',
    toDTO(user)
  );
  handleServiceResponse(serviceResponse, res);
};
