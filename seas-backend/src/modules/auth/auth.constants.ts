import { UserRole, UserStatus } from '../../common/constants/enums';

export const AUTH_MESSAGES = {
  INVALID_CREDENTIALS: 'Invalid email or password',
  USER_EXISTS: 'User already exists with this email',
  USER_NOT_FOUND: 'User not found',
  TOKEN_EXPIRED: 'Token has expired',
  TOKEN_INVALID: 'Invalid token',
  PASSWORD_CHANGED: 'Password has been changed',
  EMAIL_VERIFIED: 'Email verified successfully',
  VERIFICATION_SENT: 'Verification email sent',
} as const;

export const AUTH_CONFIG = {
  ACCESS_TOKEN_EXPIRY: '7d',
  REFRESH_TOKEN_EXPIRY: '30d',
  PASSWORD_MIN_LENGTH: 8,
  VERIFICATION_TOKEN_EXPIRY: 24 * 60 * 60 * 1000, // 24 hours
} as const;

export { UserRole, UserStatus };