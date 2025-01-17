import { userRepo } from '@/db/repos/users/user.repo';
import { ServiceResponse } from '@/models/serviceResponse';
import { generateRandomToken } from '@/utils/auth';
import { handleServiceResponse, validateReq } from '@/utils/httpHandlers';
import { sendVerificationEmail } from '@/utils/mail';
import { Request, RequestHandler, Response } from 'express';
import { Register_Req_Schema, Register_ResBodyObj } from './model';

export const register: RequestHandler = async (req: Request, res: Response) => {
  const {
    body: { name, email, password },
  } = validateReq(req, Register_Req_Schema);

  const verificationToken = generateRandomToken();

  const insertedUser = await userRepo.registerNew({
    name,
    email,
    password,
    verificationToken,
  });

  await sendVerificationEmail({
    to: email,
    verificationToken,
    name,
  });

  const serviceResponse = ServiceResponse.success<Register_ResBodyObj>(
    'User registered. Please check your email to verify your account.',
    insertedUser
  );
  handleServiceResponse(serviceResponse, res);
};
