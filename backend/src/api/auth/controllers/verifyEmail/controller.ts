import { userRepo } from '@/db/repos/users/user.repo';
import { BadRequestError } from '@/errors/bad-request-error';
import { NotFoundError } from '@/errors/not-found-error';
import { ServiceResponse } from '@/models/serviceResponse';
import { handleServiceResponse, validateReq } from '@/utils/httpHandlers';
import { Request, RequestHandler, Response } from 'express';
import { VerifyEmail_Req_Schema, VerifyEmail_ResBodyObj } from './model';

export const verifyEmail: RequestHandler = async (
  req: Request,
  res: Response
) => {
  const { body } = validateReq(req, VerifyEmail_Req_Schema);
  const { verificationToken, email } = body;

  const user = await userRepo.findUserByEmail(email);
  if (!user) {
    throw new NotFoundError('Verification token is invalid or expired');
  }

  if (user.isVerified) throw new BadRequestError('Email already verified');

  const isTokenValid = await userRepo.checkVerificationToken(
    email,
    verificationToken
  );
  if (!isTokenValid) throw new BadRequestError('Invalid verification token');

  await userRepo.verifyUser(user.id);

  const serviceResponse = ServiceResponse.success<VerifyEmail_ResBodyObj>(
    'Email verified successfully',
    null
  );

  handleServiceResponse(serviceResponse, res);
};
