import { User_DbEntity } from '@/common/db/repos/users/user.model';
import { userRepo } from '@/common/db/repos/users/user.repo';
import { ServiceResponse } from '@/common/models/serviceResponse';
import {
  handleServiceResponse,
  validateReq,
} from '@/common/utils/httpHandlers';
import {
  attachCookiesToResponse,
  getTokenPayloadFromUser,
} from '@/common/utils/jwt';
import bcrypt from 'bcrypt';
import { Request, RequestHandler, Response } from 'express';
import { Register_Req_Schema, Register_ResBodyObj } from './model';

export const register: RequestHandler = async (req: Request, res: Response) => {
  const { body } = validateReq(req, Register_Req_Schema);
  const { password, ...rest } = body;

  const hashedPassword = await bcrypt.hash(password, 10);
  const isFirstUser = (await userRepo.countDocuments()) === 0;

  const newUser = {
    ...rest,
    password: hashedPassword,
    role: isFirstUser ? 'admin' : ('user' as User_DbEntity['role']),
  };

  const insertedUser = await userRepo.insertUser(newUser);

  const tokenUser = getTokenPayloadFromUser(insertedUser);

  attachCookiesToResponse(res, tokenUser);

  const serviceResponse = ServiceResponse.success<Register_ResBodyObj>(
    'User registered',
    tokenUser
  );
  handleServiceResponse(serviceResponse, res);
};