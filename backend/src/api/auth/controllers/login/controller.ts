import { userRepo } from '@/db/repos/users/user.repo';
import { UnauthorizedError } from '@/errors/unauthorized-error';
import { ServiceResponse } from '@/models/serviceResponse';
import { handleServiceResponse, validateReq } from '@/utils/httpHandlers';
import { attachCookiesToResponse, getTokenPayloadFromUser } from '@/utils/jwt';
import { Request, RequestHandler, Response } from 'express';
import { Login_Req_Schema, Login_ResBodyObj } from './model';

export const login: RequestHandler = async (req: Request, res: Response) => {
  const { body } = validateReq(req, Login_Req_Schema);
  const { email, password } = body;

  const user = await userRepo.findUserByEmail(email);
  if (!user) throw new UnauthorizedError('Invalid credentials');

  const isPasswordCorrect = await userRepo.checkPassword(user.id, password);
  if (!isPasswordCorrect) throw new UnauthorizedError('Invalid credentials');

  const tokenUser = getTokenPayloadFromUser(user);

  attachCookiesToResponse(res, tokenUser);

  const serviceResponse = ServiceResponse.success<Login_ResBodyObj>(
    'Login successful',
    tokenUser
  );

  handleServiceResponse(serviceResponse, res);
};
