import { body } from 'express-validator';

export const createAdminSchema = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('role').optional().isIn(['admin', 'super_admin']).withMessage('Role must be admin or super_admin'),
];

export const verifyOtpSchema = [
  body('userId').isUUID().withMessage('Valid user ID is required'),
  body('otp').isLength({ min: 6, max: 6 }).withMessage('OTP must be 6 digits'),
];

export const setupPasswordSchema = [
  body('userId').isUUID().withMessage('Valid user ID is required'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
];

export const loginSchema = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
];

export const refreshTokenSchema = [
  body('refreshToken').notEmpty().withMessage('Refresh token is required'),
];

export const resendOtpSchema = [
  body('email').isEmail().withMessage('Valid email is required'),
];

export default {
  createAdminSchema,
  verifyOtpSchema,
  setupPasswordSchema,
  loginSchema,
  refreshTokenSchema,
  resendOtpSchema,
};