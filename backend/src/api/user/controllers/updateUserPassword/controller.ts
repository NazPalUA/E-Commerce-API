import { userRepo } from '@/common/db/repos/users/user.repo';
import { BadRequestError } from '@/common/errors/bad-request-error';
import { ForbiddenError } from '@/common/errors/forbidden-error';
import { NotFoundError } from '@/common/errors/not-found-error';
import { UnauthorizedError } from '@/common/errors/unauthorized-error';
import { ServiceResponse } from '@/common/models/serviceResponse';
import {
  handleServiceResponse,
  validateReq,
} from '@/common/utils/httpHandlers';
import bcrypt from 'bcrypt';
import type { Request, RequestHandler, Response } from 'express';
import { ObjectId } from 'mongodb';
import {
  UpdateUserPassword_Req_Schema,
  UpdateUserPassword_ResBodyObj,
} from './model';

export const updateUserPassword: RequestHandler = async (
  req: Request,
  res: Response
) => {
  const { params, body: userData } = validateReq(
    req,
    UpdateUserPassword_Req_Schema
  );
  const { currentPassword, newPassword } = userData;

  const hasAccess = params.id === req.userId;
  if (!hasAccess) {
    throw new ForbiddenError('You are not allowed to update this user');
  }

  const user = await userRepo.findUserById(new ObjectId(params.id));
  if (!user) {
    throw new NotFoundError('User');
  }

  const isPasswordCorrect = await bcrypt.compare(
    currentPassword,
    user.password
  );
  if (!isPasswordCorrect) throw new UnauthorizedError('Incorrect password');

  const isTheSamePassword = await bcrypt.compare(newPassword, user.password);
  if (isTheSamePassword) {
    throw new BadRequestError('New password is the same as the old password');
  }

  const newHashedPassword = await bcrypt.hash(newPassword, 10);

  await userRepo.updateUser(new ObjectId(params.id), {
    password: newHashedPassword,
  });

  const serviceResponse =
    ServiceResponse.success<UpdateUserPassword_ResBodyObj>(
      'Password updated',
      null
    );
  handleServiceResponse(serviceResponse, res);
};
