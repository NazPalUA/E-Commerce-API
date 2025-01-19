import { userRepo } from '@/db/repos/users/user.repo';
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

  await userRepo.verify(email, verificationToken);

  const serviceResponse = ServiceResponse.success<VerifyEmail_ResBodyObj>(
    'Email verified successfully',
    null
  );

  handleServiceResponse(serviceResponse, res);
};
