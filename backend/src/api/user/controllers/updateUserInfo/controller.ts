import { RefreshTokenRevokedReasons } from '@/db/repos/refreshToken/constants';
import { userRepo } from '@/db/repos/users/user.repo';
import { NotFoundError } from '@/errors/not-found-error';
import { UnauthorizedError } from '@/errors/unauthorized-error';
import { ServiceResponse } from '@/models/serviceResponse';
import { createAuthTokensAndSetThemToCookies } from '@/utils/auth';
import { handleServiceResponse, validateReq } from '@/utils/httpHandlers';
import type { Request, RequestHandler, Response } from 'express';
import { UpdateUserInfo_Req_Schema, UpdateUserInfo_ResBodyObj } from './model';

export const updateUserInfo: RequestHandler = async (
  req: Request,
  res: Response
) => {
  const {
    body: { email, name },
  } = validateReq(req, UpdateUserInfo_Req_Schema);

  const userId = req.userId;
  if (!userId) throw new UnauthorizedError('User ID not found');

  const user = await userRepo.updateUser(userId, { email, name });
  if (!user) throw new NotFoundError('User');

  await createAuthTokensAndSetThemToCookies(req, res, user, {
    invalidateRefreshTokens: email ? true : false,
    invalidateRefreshTokensReason: RefreshTokenRevokedReasons.EMAIL_CHANGED,
  });

  const serviceResponse = ServiceResponse.success<UpdateUserInfo_ResBodyObj>(
    'User info updated',
    user
  );
  handleServiceResponse(serviceResponse, res);
};
