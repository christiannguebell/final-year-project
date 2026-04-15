import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import config from '../../config/app.config';
import { authRepository } from './auth.repository';
import { ApiError } from '../../common/errors/ApiError';
import { User, UserRole, UserStatus } from '../../database';
import { AUTH_MESSAGES } from './auth.constants';
import { generateId } from '../../common/utils';
import { notificationsService } from '../notifications/notifications.service';

interface TokenPayload {
  userId: string;
  email: string;
  role: string;
  tokenVersion: number;
}

interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export const authService = {
  async register(
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    phone?: string
  ): Promise<{ message: string; email: string }> {
    const existingUser = await authRepository.findByEmail(email);
    if (existingUser) {
      throw ApiError.conflict(AUTH_MESSAGES.USER_EXISTS);
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15 mins expiry
    const hashedOtp = await bcrypt.hash(otp, 10);
    
    const user = await authRepository.createUser({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      phone,
      role: UserRole.CANDIDATE,
      status: UserStatus.PENDING,
      otp: hashedOtp,
      otpExpiry,
    });

    await notificationsService.sendTemplatedEmail(
      user.id,
      'otp-verification',
      { name: user.firstName, otp },
      '' // placeholder URL
    );

    return { message: 'OTP sent to email. Please verify to complete registration.', email: user.email };
  },

  async verifyOtp(email: string, otp: string): Promise<{ user: Partial<User>; tokens: AuthTokens }> {
    const user = await authRepository.findByEmail(email);
    if (!user) {
      throw ApiError.notFound(AUTH_MESSAGES.USER_NOT_FOUND);
    }

    if (user.status === UserStatus.ACTIVE) {
      throw ApiError.badRequest('Account already verified');
    }

    if (!user.otp || !user.otpExpiry || user.otpExpiry < new Date()) {
      throw ApiError.badRequest('OTP expired or invalid. Please request a new one.');
    }

    const isOtpValid = await bcrypt.compare(otp, user.otp);
    if (!isOtpValid) {
      throw ApiError.badRequest('Invalid OTP');
    }

    await authRepository.updateUser(user.id, {
      status: UserStatus.ACTIVE,
      otp: '' as any,
      otpExpiry: null as any,
    });

    const updatedUser = await authRepository.findById(user.id);
    const tokens = this.generateTokens(updatedUser!);
    
    const { password: _, otp: __, otpExpiry: ___, ...userWithoutPassword } = updatedUser!;
    return { user: userWithoutPassword, tokens };
  },

  async login(email: string, password: string): Promise<{ user: Partial<User>; tokens: AuthTokens }> {
    const user = await authRepository.findByEmail(email);
    if (!user) {
      throw ApiError.unauthorized(AUTH_MESSAGES.INVALID_CREDENTIALS);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw ApiError.unauthorized(AUTH_MESSAGES.INVALID_CREDENTIALS);
    }

    if (user.status === UserStatus.INACTIVE) {
      throw ApiError.forbidden('Your account has been deactivated');
    }

    if (user.status === UserStatus.PENDING) {
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const otpExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15 mins expiry
      const hashedOtp = await bcrypt.hash(otp, 10);

      await authRepository.updateUser(user.id, {
        otp: hashedOtp,
        otpExpiry,
      });

      await notificationsService.sendTemplatedEmail(
        user.id,
        'otp-verification',
        { name: user.firstName, otp },
        '' // placeholder URL
      );

      throw ApiError.forbidden('ACCOUNT_UNVERIFIED');
    }

    const tokens = this.generateTokens(user);
    const { password: _, otp: __, otpExpiry: ___, ...userWithoutPassword } = user;
    
    return { user: userWithoutPassword, tokens };
  },

  async refreshToken(refreshToken: string): Promise<AuthTokens> {
    try {
      const decoded = jwt.verify(refreshToken, config.jwt.refreshSecret) as TokenPayload;
      const user = await authRepository.findById(decoded.userId);
      
      if (!user || user.status === UserStatus.INACTIVE) {
        throw ApiError.unauthorized(AUTH_MESSAGES.TOKEN_INVALID);
      }

      if (user.tokenVersion !== decoded.tokenVersion) {
        throw ApiError.unauthorized('Session expired due to security changes');
      }

      return this.generateTokens(user);
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw ApiError.unauthorized(AUTH_MESSAGES.TOKEN_EXPIRED);
      }
      throw ApiError.unauthorized(AUTH_MESSAGES.TOKEN_INVALID);
    }
  },

  async changePassword(userId: string, currentPassword: string, newPassword: string): Promise<void> {
    const user = await authRepository.findById(userId);
    if (!user) {
      throw ApiError.notFound(AUTH_MESSAGES.USER_NOT_FOUND);
    }

    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordValid) {
      throw ApiError.badRequest('Current password is incorrect');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);
    await authRepository.updateUser(userId, { 
      password: hashedPassword,
      tokenVersion: user.tokenVersion + 1 
    });
  },

  async forgotPassword(email: string): Promise<void> {
    const user = await authRepository.findByEmail(email);
    if (!user) {
      return;
    }

    const resetToken = generateId();
    const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000);
    await authRepository.setResetToken(user.id, resetToken, resetTokenExpiry);

    const resetUrl = `${config.frontendUrl}/reset-password?token=${resetToken}`;
    await notificationsService.sendTemplatedEmail(
      user.id,
      'password-reset',
      { name: user.firstName || user.email },
      resetUrl
    );
  },

  async resetPassword(token: string, newPassword: string): Promise<void> {
    const user = await authRepository.findByResetToken(token);
    
    if (!user || !user.resetTokenExpiry || user.resetTokenExpiry < new Date()) {
      throw ApiError.badRequest('Reset token is invalid or has expired');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);
    
    await authRepository.updateUser(user.id, {
      password: hashedPassword,
      tokenVersion: user.tokenVersion + 1
    });

    await authRepository.clearResetToken(user.id);
  },

  generateTokens(user: User): AuthTokens {
    const payload: TokenPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
      tokenVersion: user.tokenVersion || 0,
    };

    const accessToken = jwt.sign(payload, config.jwt.secret, {
      expiresIn: config.jwt.expiresIn as jwt.SignOptions['expiresIn'],
    });

    const refreshToken = jwt.sign(payload, config.jwt.refreshSecret, {
      expiresIn: config.jwt.refreshExpiresIn as jwt.SignOptions['expiresIn'],
    });

    return { accessToken, refreshToken };
  },

  async getProfile(userId: string): Promise<Partial<User>> {
    const user = await authRepository.findById(userId);
    if (!user) {
      throw ApiError.notFound(AUTH_MESSAGES.USER_NOT_FOUND);
    }
    const { password: _password, otp: _otp, resetToken: _reset, ...userWithoutPassword } = user;
    return userWithoutPassword;
  },
};

export default authService;