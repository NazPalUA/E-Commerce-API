import { userRepo } from '@/common/db/repos/users/user.repo';
import { ForbiddenError } from '@/common/errors/forbidden-error';
import { ServiceResponse } from '@/common/models/serviceResponse';
import {
  handleServiceResponse,
  validateReq,
} from '@/common/utils/httpHandlers';
import type { Request, RequestHandler, Response } from 'express';
import {
  UpdateUserPassword_Req_Schema,
  UpdateUserPassword_ResBodyObj,
} from './model';

export const updateUserPassword: RequestHandler = async (
  req: Request,
  res: Response
) => {
  const {
    params: { id: userId },
    body: { currentPassword, newPassword },
  } = validateReq(req, UpdateUserPassword_Req_Schema);

  const hasAccess = userId === req.userId;
  if (!hasAccess) {
    throw new ForbiddenError('You are not allowed to update this user');
  }

  await userRepo.updatePassword(userId, currentPassword, newPassword);

  const serviceResponse =
    ServiceResponse.success<UpdateUserPassword_ResBodyObj>(
      'Password updated',
      null
    );
  handleServiceResponse(serviceResponse, res);
};
