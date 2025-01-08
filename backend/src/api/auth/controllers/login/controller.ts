import { userRepo } from '@/common/db/repos/users/user.repo';
import { UnauthorizedError } from '@/common/errors/unauthorized-error';
import { ServiceResponse } from '@/common/models/serviceResponse';
import {
  handleServiceResponse,
  validateReq,
} from '@/common/utils/httpHandlers';
import { attachCookiesToResponse, TokenPayload } from '@/common/utils/jwt';
import bcrypt from 'bcrypt';
import { Request, RequestHandler, Response } from 'express';
import { Login_Req_Schema, Login_ResBodyObj } from './model';

export const login: RequestHandler = async (req: Request, res: Response) => {
  const { body } = validateReq(req, Login_Req_Schema);
  const { email, password } = body;

  const user = await userRepo.findUserByEmail(email);
  if (!user) throw new UnauthorizedError('Invalid credentials');

  const isPasswordCorrect = await bcrypt.compare(password, user.password);
  if (!isPasswordCorrect) throw new UnauthorizedError('Invalid credentials');

  const tokenUser: TokenPayload = {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role,
  };

  attachCookiesToResponse(res, tokenUser);

  const serviceResponse = ServiceResponse.success<Login_ResBodyObj>(
    'Login successful',
    tokenUser
  );

  handleServiceResponse(serviceResponse, res);
};
