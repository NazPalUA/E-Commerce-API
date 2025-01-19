import { RefreshTokenRevokedReasons } from '@/db/repos/refreshToken/constants';
import { userRepo } from '@/db/repos/users/user.repo';
import { NotFoundError } from '@/errors/not-found-error';
import { UnauthorizedError } from '@/errors/unauthorized-error';
import { ServiceResponse } from '@/models/serviceResponse';
import { createAuthTokensAndSetThemToCookies } from '@/utils/auth';
import { handleServiceResponse, validateReq } from '@/utils/httpHandlers';
import type { Request, RequestHandler, Response } from 'express';
import {
  UpdateUserPassword_Req_Schema,
  UpdateUserPassword_ResBodyObj,
} from './model';

export const updateUserPassword: RequestHandler = async (
  req: Request,
  res: Response
) => {
  const {
    body: { currentPassword, newPassword },
  } = validateReq(req, UpdateUserPassword_Req_Schema);

  const userId = req.userId;
  if (!userId) throw new UnauthorizedError('User ID not found');

  const user = await userRepo.findUserById(userId);
  if (!user) throw new NotFoundError('User not found');

  await userRepo.updatePassword(userId, currentPassword, newPassword);

  await createAuthTokensAndSetThemToCookies(req, res, user, {
    invalidateRefreshTokens: true,
    invalidateRefreshTokensReason: RefreshTokenRevokedReasons.PASSWORD_CHANGED,
  });

  const serviceResponse =
    ServiceResponse.success<UpdateUserPassword_ResBodyObj>(
      'Password updated',
      null
    );
  handleServiceResponse(serviceResponse, res);
};
