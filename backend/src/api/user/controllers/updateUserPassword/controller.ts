import { userRepo } from '@/db/repos/users/user.repo';
import { UnauthorizedError } from '@/errors/unauthorized-error';
import { ServiceResponse } from '@/models/serviceResponse';
import { handleServiceResponse, validateReq } from '@/utils/httpHandlers';
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
    body: { currentPassword, newPassword },
  } = validateReq(req, UpdateUserPassword_Req_Schema);

  const userId = req.userId;
  if (!userId) throw new UnauthorizedError('User ID not found');

  await userRepo.updatePassword(userId, currentPassword, newPassword);

  const serviceResponse =
    ServiceResponse.success<UpdateUserPassword_ResBodyObj>(
      'Password updated',
      null
    );
  handleServiceResponse(serviceResponse, res);
};
