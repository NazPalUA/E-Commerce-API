import { Response } from 'express';
import { env } from '../envConfig';

const setTokenCookie = (
  name: string,
  res: Response,
  expiresIn: number,
  token: string = ''
) => {
  res.cookie(name, token, {
    httpOnly: true,
    expires: new Date(Date.now() + expiresIn),
    secure: env.NODE_ENV === 'production',
    signed: true,
  });
};

const setAccessJWTCookie = (res: Response, expiresIn: number, token?: string) =>
  setTokenCookie('accessToken', res, expiresIn, token);

const setRefreshTokenCookie = (
  res: Response,
  expiresIn: number,
  token?: string
) => setTokenCookie('refreshToken', res, expiresIn, token);

const attachAuthCookiesToResponse = (
  res: Response,
  accessJWT: string,
  refreshToken: string
) => {
  const oneDay = 1000 * 60 * 60 * 24;
  setAccessJWTCookie(res, oneDay, accessJWT);

  const oneWeek = 7 * 24 * 60 * 60 * 1000;
  setRefreshTokenCookie(res, oneWeek, refreshToken);
};

const clearCookies = (res: Response) => {
  setAccessJWTCookie(res, 0);
  setRefreshTokenCookie(res, 0);
};

export { attachAuthCookiesToResponse, clearCookies };
