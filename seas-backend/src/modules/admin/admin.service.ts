import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import config from '../../config/app.config';
import { AppDataSource, User, UserRole } from '../../database';
import { ApiError } from '../../common/errors/ApiError';
import { ADMIN_MESSAGES } from './admin.constants';
import { generateId } from '../../common/utils';
import { notificationsService } from '../notifications/notifications.service';
import { EMAIL_TEMPLATES } from '../notifications';

interface AdminTokenPayload {
  userId: string;
  email: string;
  role: string;
  type: 'admin';
  tokenVersion: number;
}

interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

const userRepository = AppDataSource.getRepository(User);

export const adminService = {
  async createAdmin(
    email: string,
    role: UserRole = UserRole.ADMIN,
    createdBy: string
  ): Promise<{ message: string; email: string }> {
    const existingUser = await userRepository.findOne({ where: { email } });
    if (existingUser) {
      throw ApiError.conflict(ADMIN_MESSAGES.EMAIL_EXISTS);
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours for admin OTP
    const hashedOtp = await bcrypt.hash(otp, 10);

    const adminUser = userRepository.create({
      email,
      password: '', // No password yet - must setup via OTP
      firstName: '',
      lastName: '',
      role,
      status: 'pending' as any,
      otp: hashedOtp,
      otpExpiry,
    });

    await userRepository.save(adminUser);

    const verifyUrl = `${config.frontendUrl}/admin/verify/${adminUser.id}?otp=${otp}`;
    await notificationsService.sendTemplatedEmail(
      adminUser.id,
      EMAIL_TEMPLATES.OTP_VERIFICATION,
      { name: email, otp, verifyUrl },
      verifyUrl
    );

    return { message: 'Admin created. Verification link sent to email.', email: adminUser.email };
  },

  async verifyOtp(userId: string, otp: string): Promise<{ verified: boolean; email: string }> {
    const user = await userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw ApiError.notFound(ADMIN_MESSAGES.ADMIN_NOT_FOUND);
    }

    if (user.status === 'active') {
      throw ApiError.badRequest('Account already verified');
    }

    if (!user.otp || !user.otpExpiry || user.otpExpiry < new Date()) {
      throw ApiError.badRequest('OTP expired. Please request a new one.');
    }

    const isOtpValid = await bcrypt.compare(otp, user.otp);
    if (!isOtpValid) {
      throw ApiError.badRequest('Invalid OTP');
    }

    await userRepository.update(user.id, {
      otp: '' as any,
      otpExpiry: null as any,
    });

    return { verified: true, email: user.email };
  },

  async setupPassword(
    userId: string,
    password: string
  ): Promise<{ message: string }> {
    const user = await userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw ApiError.notFound(ADMIN_MESSAGES.ADMIN_NOT_FOUND);
    }

    if (!user.password) {
      throw ApiError.badRequest('Please verify your email first');
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    await userRepository.update(user.id, {
      password: hashedPassword,
      status: 'active' as any,
    });

    return { message: 'Password set successfully. Please login.' };
  },

  async login(email: string, password: string): Promise<{ user: Partial<User>; tokens: AuthTokens }> {
    const user = await userRepository.findOne({ where: { email } });
    if (!user) {
      throw ApiError.unauthorized(ADMIN_MESSAGES.INVALID_CREDENTIALS);
    }

    if (user.role === UserRole.CANDIDATE) {
      throw ApiError.unauthorized(ADMIN_MESSAGES.INVALID_CREDENTIALS);
    }

    if (!user.password) {
      throw ApiError.unauthorized('Please setup your password first');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw ApiError.unauthorized(ADMIN_MESSAGES.INVALID_CREDENTIALS);
    }

    if (user.status === 'inactive') {
      throw ApiError.forbidden('Your account has been deactivated');
    }

    const tokens = this.generateTokens(user);
    const { password: _, otp: __, otpExpiry: ___, ...userWithoutPassword } = user;

    return { user: userWithoutPassword, tokens };
  },

  async resendOtp(email: string): Promise<{ message: string }> {
    const user = await userRepository.findOne({ where: { email } });
    if (!user) {
      throw ApiError.notFound(ADMIN_MESSAGES.ADMIN_NOT_FOUND);
    }

    if (user.role === UserRole.CANDIDATE) {
      throw ApiError.badRequest('Invalid request');
    }

    if (user.status === 'active') {
      throw ApiError.badRequest('Account already verified');
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);
    const hashedOtp = await bcrypt.hash(otp, 10);

    await userRepository.update(user.id, {
      otp: hashedOtp,
      otpExpiry,
    });

    const verifyUrl = `${config.frontendUrl}/admin/verify/${user.id}?otp=${otp}`;
    await notificationsService.sendTemplatedEmail(
      user.id,
      'admin-verification',
      { name: user.email, otp, verifyUrl },
      verifyUrl
    );

    return { message: 'OTP sent to email' };
  },

  async refreshToken(refreshToken: string): Promise<AuthTokens> {
    try {
      const decoded = jwt.verify(refreshToken, config.jwt.refreshSecret) as AdminTokenPayload;
      const user = await userRepository.findOne({ where: { id: decoded.userId } });

      if (!user || user.status === 'inactive') {
        throw ApiError.unauthorized(ADMIN_MESSAGES.TOKEN_INVALID);
      }

      if (user.tokenVersion !== decoded.tokenVersion) {
        throw ApiError.unauthorized('Session expired due to security changes');
      }

      return this.generateTokens(user);
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw ApiError.unauthorized(ADMIN_MESSAGES.TOKEN_EXPIRED);
      }
      throw ApiError.unauthorized(ADMIN_MESSAGES.TOKEN_INVALID);
    }
  },

  generateTokens(user: User): AuthTokens {
    const payload: AdminTokenPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
      type: 'admin',
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

  async getAdmins(): Promise<Partial<User>[]> {
    const admins = await userRepository.find({
      where: [
        { role: UserRole.ADMIN },
        { role: UserRole.SUPER_ADMIN },
      ],
      select: ['id', 'email', 'firstName', 'lastName', 'role', 'status', 'createdAt', 'updatedAt'],
    });
    return admins;
  },

  async getAdminById(id: string): Promise<Partial<User> | null> {
    const admin = await userRepository.findOne({
      where: { id },
      select: ['id', 'email', 'firstName', 'lastName', 'role', 'status', 'createdAt', 'updatedAt'],
    });
    return admin;
  },

  async deleteAdmin(id: string, deletedBy: string): Promise<void> {
    const admin = await userRepository.findOne({ where: { id } });
    if (!admin) {
      throw ApiError.notFound(ADMIN_MESSAGES.ADMIN_NOT_FOUND);
    }

    if (admin.role === UserRole.SUPER_ADMIN) {
      throw ApiError.forbidden('Cannot delete super admin');
    }

    await userRepository.update(id, { status: 'inactive' as any });
  },

  async forgotPassword(email: string): Promise<void> {
    const user = await userRepository.findOne({ where: { email } });
    if (!user) {
      return;
    }

    if (user.role === UserRole.CANDIDATE) {
      throw ApiError.badRequest('Invalid request');
    }

    const resetToken = generateId();
    const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000);
    await userRepository.update(user.id, {
      resetToken,
      resetTokenExpiry,
    });

    const resetUrl = `${config.frontendUrl}/admin/reset-password?token=${resetToken}`;
    await notificationsService.sendTemplatedEmail(
      user.id,
      'password-reset',
      { name: user.firstName || user.email },
      resetUrl
    );
  },

  async resetPassword(token: string, newPassword: string): Promise<void> {
    const user = await userRepository.findOne({ where: { resetToken: token } });

    if (!user || !user.resetTokenExpiry || user.resetTokenExpiry < new Date()) {
      throw ApiError.badRequest('Reset token is invalid or has expired');
    }

    if (user.role === UserRole.CANDIDATE) {
      throw ApiError.badRequest('Invalid request');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);

    await userRepository.update(user.id, {
      password: hashedPassword,
      tokenVersion: user.tokenVersion + 1,
      resetToken: '' as any,
      resetTokenExpiry: null as any,
    });
  },
};

export default adminService;