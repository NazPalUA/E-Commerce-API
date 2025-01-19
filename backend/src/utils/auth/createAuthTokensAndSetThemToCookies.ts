import {
  RefreshTokenRevokedReason,
  RefreshTokenRevokedReasons,
} from '@/db/repos/refreshToken/constants';
import { refreshTokenRepo } from '@/db/repos/refreshToken/refreshToken.repo';
import { BadRequestError } from '@/errors/bad-request-error';
import { AccessJWTPayload } from '@/models/AccessToken';
import { Request, Response } from 'express';
import {
  attachAuthCookiesToResponse,
  createAccessJWT,
  generateRandomToken,
} from '.';

type Options = {
  invalidateRefreshTokens?: boolean;
  invalidateRefreshTokensReason?: RefreshTokenRevokedReason;
};

export const createAuthTokensAndSetThemToCookies = async (
  req: Request,
  res: Response,
  { id, name, email, role }: AccessJWTPayload,
  options?: Options
) => {
  const userAgent = req.headers['user-agent'];
  const ip = req.ip;

  if (!userAgent || !ip) {
    throw new BadRequestError('Invalid request: user agent or ip not found');
  }

  if (options?.invalidateRefreshTokens) {
    const reason =
      options.invalidateRefreshTokensReason || RefreshTokenRevokedReasons.OTHER;
    await refreshTokenRepo.invalidateUserTokens(id, reason);
  }

  const refreshTokenSecret = generateRandomToken();

  await refreshTokenRepo.createNew({
    user: id,
    refreshTokenSecret,
    ip,
    userAgent,
  });

  const accessJWT = createAccessJWT({ id, name, email, role });
  attachAuthCookiesToResponse(res, accessJWT, refreshTokenSecret);
};
