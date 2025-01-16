import { userRepo } from '@/db/repos/users/user.repo';
import { ServiceResponse } from '@/models/serviceResponse';
import { handleServiceResponse, validateReq } from '@/utils/httpHandlers';
import { sendForgotPasswordEmail } from '@/utils/mail/sendForgotPasswordEmail';
import crypto from 'crypto';
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
  if (!user) {
    const serviceResponse = ServiceResponse.success<ForgotPassword_ResBodyObj>(
      'User not found',
      null
    );
    handleServiceResponse(serviceResponse, res);
    return;
  }

  const passwordResetToken = crypto.randomBytes(32).toString('hex');
  const passwordResetTokenExpiration = new Date(Date.now() + 1000 * 60 * 30); // 0.5 hour

  await userRepo.updateUserPasswordResetToken(
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
