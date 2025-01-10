import { userRepo } from '@/common/db/repos/users/user.repo';
import { NotFoundError } from '@/common/errors/not-found-error';
import { UnauthorizedError } from '@/common/errors/unauthorized-error';
import { ServiceResponse } from '@/common/models/serviceResponse';
import {
  handleServiceResponse,
  validateReq,
} from '@/common/utils/httpHandlers';
import {
  attachCookiesToResponse,
  getTokenPayloadFromUser,
} from '@/common/utils/jwt';
import type { Request, RequestHandler, Response } from 'express';
import { UpdateUserInfo_Req_Schema, UpdateUserInfo_ResBodyObj } from './model';

export const updateUserInfo: RequestHandler = async (
  req: Request,
  res: Response
) => {
  const { body: userData } = validateReq(req, UpdateUserInfo_Req_Schema);

  const userId = req.userId;
  if (!userId) throw new UnauthorizedError('User ID not found');

  const user = await userRepo.updateUser(userId, userData);
  if (!user) throw new NotFoundError('User');

  const tokenUser = getTokenPayloadFromUser(user);
  attachCookiesToResponse(res, tokenUser);

  const serviceResponse = ServiceResponse.success<UpdateUserInfo_ResBodyObj>(
    'User info updated',
    user
  );
  handleServiceResponse(serviceResponse, res);
};
