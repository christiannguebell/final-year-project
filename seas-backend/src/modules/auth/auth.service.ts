import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import config from '../../config/app.config';
import { authRepository } from './auth.repository';
import { ApiError } from '../../common/errors/ApiError';
import { User, UserRole, UserStatus } from '../../database';
import { AUTH_MESSAGES } from './auth.constants';
import { emailService } from '../../services/email.service';
import { generateId } from '../../common/utils';

interface TokenPayload {
  userId: string;
  email: string;
  role: string;
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
  ): Promise<{ user: Partial<User>; tokens: AuthTokens }> {
    const existingUser = await authRepository.findByEmail(email);
    if (existingUser) {
      throw ApiError.conflict(AUTH_MESSAGES.USER_EXISTS);
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    
    const user = await authRepository.createUser({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      phone,
      role: UserRole.CANDIDATE,
      status: UserStatus.PENDING,
    });

    const tokens = this.generateTokens(user);
    
    // TODO: Send verification email in production
    // await emailService.sendVerificationEmail(user.email, verificationToken);

    const { password: _, ...userWithoutPassword } = user;
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

    const tokens = this.generateTokens(user);
    const { password: _, ...userWithoutPassword } = user;
    
    return { user: userWithoutPassword, tokens };
  },

  async refreshToken(refreshToken: string): Promise<AuthTokens> {
    try {
      const decoded = jwt.verify(refreshToken, config.jwt.refreshSecret) as TokenPayload;
      const user = await authRepository.findById(decoded.userId);
      
      if (!user || user.status === UserStatus.INACTIVE) {
        throw ApiError.unauthorized(AUTH_MESSAGES.TOKEN_INVALID);
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
    await authRepository.updateUser(userId, { password: hashedPassword });
  },

  async forgotPassword(email: string): Promise<void> {
    const user = await authRepository.findByEmail(email);
    if (!user) {
      // Don't reveal if user exists
      return;
    }

    const resetToken = generateId();
    // TODO: Store reset token with expiry
    // await emailService.sendPasswordResetEmail(user.email, resetToken);
  },

  async resetPassword(token: string, newPassword: string): Promise<void> {
    // TODO: Implement with stored reset token
    throw ApiError.notImplemented('Password reset not implemented');
  },

  generateTokens(user: User): AuthTokens {
    const payload: TokenPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
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
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  },
};

export default authService;