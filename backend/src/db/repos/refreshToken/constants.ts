export const RefreshTokenRevokedReasons = {
  USER_LOGOUT: 'USER_LOGOUT',
  SECURITY_BREACH: 'SECURITY_BREACH',
  TOKEN_REUSE: 'TOKEN_REUSE',
  SUSPICIOUS_ACTIVITY: 'SUSPICIOUS_ACTIVITY',
  OTHER: 'OTHER',
  EMAIL_CHANGED: 'EMAIL_CHANGED',
  PASSWORD_CHANGED: 'PASSWORD_CHANGED',
} as const;

export type RefreshTokenRevokedReason =
  (typeof RefreshTokenRevokedReasons)[keyof typeof RefreshTokenRevokedReasons];

export const REFRESH_TOKEN_REVOKED_REASONS_VALUES = Object.values(
  RefreshTokenRevokedReasons
) as RefreshTokenRevokedReason[];
