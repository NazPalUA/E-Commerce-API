import { userRepo } from '@/db/repos/users/user.repo';
import { NotFoundError } from '@/errors/not-found-error';
import { ServiceResponse } from '@/models/serviceResponse';
import { generateRandomToken } from '@/utils/auth';
import { handleServiceResponse, validateReq } from '@/utils/httpHandlers';
import { sendForgotPasswordEmail } from '@/utils/mail';
import { Request, RequestHandler, Response } from 'express';
import { ForgotPassword_Req_Schema, ForgotPassword_ResBodyObj } from './model';

export const forgotPassword: RequestHandler = async (
  req: Request,
  res: Response
) => {
  const {
    body: { email },
  } = validateReq(req, ForgotPassword_Req_Schema);

  const user = await userRepo.findUserByEmail(email);
  if (!user) throw new NotFoundError('User not found');

  const passwordResetToken = generateRandomToken();
  const passwordResetTokenExpiration = new Date(Date.now() + 1000 * 60 * 30); // 0.5 hour

  await userRepo.updatePasswordResetToken(
    user.id,
    passwordResetToken,
    passwordResetTokenExpiration
  );

  await sendForgotPasswordEmail({
    to: user.email,
    resetToken: passwordResetToken,
    name: user.name,
  });

  const serviceResponse = ServiceResponse.success<ForgotPassword_ResBodyObj>(
    'Password reset email sent. Please check your email to reset your password.',
    null
  );
  handleServiceResponse(serviceResponse, res);
};
