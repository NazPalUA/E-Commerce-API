import { userRepo } from '@/db/repos/users/user.repo';
import { BadRequestError } from '@/errors/bad-request-error';
import { NotFoundError } from '@/errors/not-found-error';
import { ServiceResponse } from '@/models/serviceResponse';
import { handleServiceResponse, validateReq } from '@/utils/httpHandlers';
import { Request, RequestHandler, Response } from 'express';
import { ResetPassword_Req_Schema, ResetPassword_ResBodyObj } from './model';

export const resetPassword: RequestHandler = async (
  req: Request,
  res: Response
) => {
  const {
    body: { email, resetToken, newPassword },
  } = validateReq(req, ResetPassword_Req_Schema);

  const user = await userRepo.findUserByEmail(email);
  if (!user) throw new NotFoundError('User');

  const isPasswordResetTokenCorrect = resetToken === user.passwordResetToken;
  if (!isPasswordResetTokenCorrect)
    throw new BadRequestError('Invalid reset token');

  const isPasswordResetTokenValid =
    user.passwordResetTokenExpiration &&
    user.passwordResetTokenExpiration > new Date();
  if (!isPasswordResetTokenValid)
    throw new BadRequestError('Reset token expired');

  await userRepo.resetPassword(user.id, newPassword);

  const serviceResponse = ServiceResponse.success<ResetPassword_ResBodyObj>(
    'Password has been reset. Please login to continue.',
    null
  );
  handleServiceResponse(serviceResponse, res);
};
