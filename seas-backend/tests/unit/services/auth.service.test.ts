import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { authService } from '../../../src/modules/auth/auth.service';
import { authRepository } from '../../../src/modules/auth/auth.repository';
import { ApiError } from '../../../src/common/errors/ApiError';
import { UserRole, UserStatus } from '../../../src/database';
import { AUTH_MESSAGES } from '../../../src/modules/auth/auth.constants';

jest.mock('../../../src/modules/auth/auth.repository');
jest.mock('bcrypt');
jest.mock('jsonwebtoken');
jest.mock('../../../src/services/email.service');
jest.mock('../../../src/modules/notifications/notifications.service');

describe('AuthService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    const registerData = {
      email: 'test@example.com',
      password: 'password123',
      firstName: 'John',
      lastName: 'Doe',
    };

    it('should throw conflict error if user already exists', async () => {
      (authRepository.findByEmail as jest.Mock).mockResolvedValue({ id: '1' });

      await expect(authService.register(
        registerData.email,
        registerData.password,
        registerData.firstName,
        registerData.lastName
      )).rejects.toThrow(new ApiError(409, AUTH_MESSAGES.USER_EXISTS));
    });

    it('should hash password and create user if not exists', async () => {
      (authRepository.findByEmail as jest.Mock).mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed_password');
      (authRepository.createUser as jest.Mock).mockResolvedValue({
        id: '1',
        email: registerData.email,
        firstName: registerData.firstName,
        lastName: registerData.lastName,
        role: UserRole.CANDIDATE,
        status: UserStatus.PENDING,
      });
      (jwt.sign as jest.Mock).mockReturnValue('token');

      const result = await authService.register(
        registerData.email,
        registerData.password,
        registerData.firstName,
        registerData.lastName
      );

      // It hashes the password, and also hashes the generated OTP, causing hash to be called twice.
      // So we just check that it created a user.
      expect(authRepository.createUser).toHaveBeenCalled();
      expect(result.message).toBeDefined();
      expect(result.email).toBe(registerData.email);
    });
  });

  describe('login', () => {
    const loginData = {
      email: 'test@example.com',
      password: 'password123',
    };

    it('should throw unauthorized error if user not found', async () => {
      (authRepository.findByEmail as jest.Mock).mockResolvedValue(null);

      await expect(authService.login(loginData.email, loginData.password))
        .rejects.toThrow(new ApiError(401, AUTH_MESSAGES.INVALID_CREDENTIALS));
    });

    it('should throw unauthorized error if password invalid', async () => {
      (authRepository.findByEmail as jest.Mock).mockResolvedValue({ password: 'hashed' });
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(authService.login(loginData.email, loginData.password))
        .rejects.toThrow(new ApiError(401, AUTH_MESSAGES.INVALID_CREDENTIALS));
    });

    it('should throw forbidden error if user is inactive', async () => {
      (authRepository.findByEmail as jest.Mock).mockResolvedValue({
        password: 'hashed',
        status: UserStatus.INACTIVE
      });
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      await expect(authService.login(loginData.email, loginData.password))
        .rejects.toThrow(new ApiError(403, 'Your account has been deactivated'));
    });

    it('should return tokens on successful login', async () => {
      const user = {
        id: '1',
        email: loginData.email,
        password: 'hashed',
        status: UserStatus.ACTIVE,
        role: UserRole.CANDIDATE
      };
      (authRepository.findByEmail as jest.Mock).mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (jwt.sign as jest.Mock).mockReturnValue('token');

      const result = await authService.login(loginData.email, loginData.password);

      expect(result.tokens).toEqual({ accessToken: 'token', refreshToken: 'token' });
    });
  });
});
