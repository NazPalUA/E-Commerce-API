import { userRepo } from '@/db/repos/users/user.repo';
import { NotFoundError } from '@/errors/not-found-error';
import { ServiceResponse } from '@/models/serviceResponse';
import {
  createAuthTokensAndSetThemToCookies,
  getTokenPayloadFromUser,
} from '@/utils/auth';
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
  if (!user) throw new NotFoundError('User not found');

  await userRepo.checkPasswordResetToken(email, resetToken);

  await userRepo.resetPassword(user.id, newPassword);

  const accessJWTPayload = getTokenPayloadFromUser(user);

  await createAuthTokensAndSetThemToCookies(req, res, accessJWTPayload);

  const serviceResponse = ServiceResponse.success<ResetPassword_ResBodyObj>(
    'Password has been reset. Please login to continue.',
    null
  );
  handleServiceResponse(serviceResponse, res);
};
