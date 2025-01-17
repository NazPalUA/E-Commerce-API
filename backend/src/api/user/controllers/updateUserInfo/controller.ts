import { tokenRepo } from '@/db/repos/refreshToken/refreshToken.repo';
import { userRepo } from '@/db/repos/users/user.repo';
import { NotFoundError } from '@/errors/not-found-error';
import { UnauthorizedError } from '@/errors/unauthorized-error';
import { ServiceResponse } from '@/models/serviceResponse';
import {
  attachAuthCookiesToResponse,
  createAccessJWT,
  generateRandomToken,
  getTokenPayloadFromUser,
} from '@/utils/auth';
import { handleServiceResponse, validateReq } from '@/utils/httpHandlers';
import type { Request, RequestHandler, Response } from 'express';
import { UpdateUserInfo_Req_Schema, UpdateUserInfo_ResBodyObj } from './model';

export const updateUserInfo: RequestHandler = async (
  req: Request,
  res: Response
) => {
  const { body: userData } = validateReq(req, UpdateUserInfo_Req_Schema);

  const userId = req.userId;
  if (!userId) throw new UnauthorizedError('User ID not found');

  const user = await userRepo.updateUser(userId, userData);
  if (!user) throw new NotFoundError('User');

  const tokenUser = getTokenPayloadFromUser(user);

  // Generate a new refresh token
  const newRefreshToken = generateRandomToken();

  // Optionally, invalidate the old refresh tokens and store the new one in the database
  await tokenRepo.invalidateUserTokens(userId);
  await tokenRepo.insertToken({
    user: userId,
    refreshToken: newRefreshToken,
    ip: req.ip || '',
    userAgent: req.headers['user-agent'] || '',
    isValid: true,
  });

  const accessJWT = createAccessJWT(tokenUser);
  attachAuthCookiesToResponse(res, accessJWT, newRefreshToken);

  const serviceResponse = ServiceResponse.success<UpdateUserInfo_ResBodyObj>(
    'User info updated',
    user
  );
  handleServiceResponse(serviceResponse, res);
};
