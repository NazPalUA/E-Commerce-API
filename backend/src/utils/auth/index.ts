import { User_DTO } from '@/db/repos/users/user.model';
import { AccessJWTPayload } from '@/models/AccessToken';
import crypto from 'crypto';

const generateRandomToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

const getTokenPayloadFromUser = (user: User_DTO): AccessJWTPayload => {
  const { id, name, email, role } = user;
  return { id, name, email, role };
};

export { attachAuthCookiesToResponse, clearAuthCookies } from './authCookies';
export { createAccessJWT, decodeAccessJWT, verifyAccessJWT } from './jwt';
export { generateRandomToken, getTokenPayloadFromUser };

export { createAuthTokensAndSetThemToCookies } from './createAuthTokensAndSetThemToCookies';
