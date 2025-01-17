import { RefreshToken_Input } from '@/db/repos/refreshToken/refreshToken.model';
import { tokenRepo } from '@/db/repos/refreshToken/refreshToken.repo';
import { userRepo } from '@/db/repos/users/user.repo';
import { BadRequestError } from '@/errors/bad-request-error';
import { InternalServerError } from '@/errors/server-error';
import { UnauthorizedError } from '@/errors/unauthorized-error';
import { ServiceResponse } from '@/models/serviceResponse';
import { attachAuthCookiesToResponse } from '@/utils/auth/authCookies';
import {
  createAccessJWT,
  generateRandomToken,
  getTokenPayloadFromUser,
} from '@/utils/auth/jwt';
import { handleServiceResponse, validateReq } from '@/utils/httpHandlers';
import { Request, RequestHandler, Response } from 'express';
import { Login_Req_Schema, Login_ResBodyObj } from './model';
export const login: RequestHandler = async (req: Request, res: Response) => {
  const { body } = validateReq(req, Login_Req_Schema);
  const { email, password } = body;

  const user = await userRepo.findUserByEmail(email);
  const isPasswordCorrect = user
    ? await userRepo.checkPassword(user.id, password)
    : false;

  if (!user || !isPasswordCorrect) {
    throw new UnauthorizedError('Invalid credentials');
  }

  if (!user.isVerified)
    throw new UnauthorizedError('Please verify your email before logging in');

  const userAgent = req.headers['user-agent'];
  const ip = req.ip;

  if (!userAgent || !ip) {
    throw new BadRequestError('Invalid request: user agent or ip not found');
  }

  const tokenUser = getTokenPayloadFromUser(user);
  const refreshToken = generateRandomToken();

  const refreshTokenPayload: RefreshToken_Input = {
    user: user.id,
    refreshToken,
    ip,
    userAgent,
    isValid: true,
  };

  await tokenRepo.invalidateUserTokens(user.id);
  const newToken = await tokenRepo.insertToken(refreshTokenPayload);

  if (!newToken) throw new InternalServerError('Failed to create token');

  const accessJWT = createAccessJWT(tokenUser);
  attachAuthCookiesToResponse(res, accessJWT, refreshToken);

  const serviceResponse = ServiceResponse.success<Login_ResBodyObj>(
    'Login successful',
    tokenUser
  );

  handleServiceResponse(serviceResponse, res);
};
