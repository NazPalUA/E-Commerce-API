import { userRepo } from '@/db/repos/users/user.repo';
import { ServiceResponse } from '@/models/serviceResponse';
import { createAuthTokensAndSetThemToCookies } from '@/utils/auth';
import { handleServiceResponse, validateReq } from '@/utils/httpHandlers';
import { Request, RequestHandler, Response } from 'express';
import { Login_Req_Schema, Login_ResBodyObj } from './model';

export const login: RequestHandler = async (req: Request, res: Response) => {
  const { body } = validateReq(req, Login_Req_Schema);
  const { email, password } = body;

  const basicUserInfo = await userRepo.checkPasswordAndVerification(
    email,
    password
  );

  await createAuthTokensAndSetThemToCookies(req, res, basicUserInfo);

  const serviceResponse = ServiceResponse.success<Login_ResBodyObj>(
    'Login successful',
    basicUserInfo
  );

  handleServiceResponse(serviceResponse, res);
};
