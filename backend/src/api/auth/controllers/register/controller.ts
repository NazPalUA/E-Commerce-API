import { userRepo } from '@/db/repos/users/user.repo';
import { ServiceResponse } from '@/models/serviceResponse';
import { handleServiceResponse, validateReq } from '@/utils/httpHandlers';
import { generateVerificationToken } from '@/utils/jwt';
import { sendVerificationEmail } from '@/utils/sendVerificationEmail';
import { Request, RequestHandler, Response } from 'express';
import { Register_Req_Schema, Register_ResBodyObj } from './model';

export const register: RequestHandler = async (req: Request, res: Response) => {
  const { body } = validateReq(req, Register_Req_Schema);

  const verificationToken = generateVerificationToken();

  const insertedUser = await userRepo.insertUser({
    ...body,
    verificationToken,
  });

  await sendVerificationEmail({
    to: body.email,
    verificationToken,
    name: body.name,
  });

  const serviceResponse = ServiceResponse.success<Register_ResBodyObj>(
    'User registered. Please check your email to verify your account.',
    insertedUser
  );
  handleServiceResponse(serviceResponse, res);
};
