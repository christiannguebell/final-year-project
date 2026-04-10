import apiClient from './client';
import type {
  LoginRequest,
  RegisterRequest,
  ChangePasswordRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  LoginResponse,
  User,
  AuthTokens,
} from '../types/api';

export const authApi = {
  async register(data: RegisterRequest) {
    const response = await apiClient.post<LoginResponse>('/auth/register', data);
    return response.data;
  },

  async verifyOtp(email: string, otp: string) {
    const response = await apiClient.post<LoginResponse>('/auth/verify-otp', { email, otp });
    return response.data;
  },

  async login(data: LoginRequest) {
    const response = await apiClient.post<LoginResponse>('/auth/login', data);
    return response.data;
  },

  async refreshToken(refreshToken: string) {
    const response = await apiClient.post<AuthTokens>('/auth/refresh-token', { refreshToken });
    return response.data;
  },

  async changePassword(data: ChangePasswordRequest) {
    const response = await apiClient.put('/auth/change-password', data);
    return response.data;
  },

  async getProfile() {
    const response = await apiClient.get<User>('/auth/profile');
    return response.data;
  },

  async forgotPassword(data: ForgotPasswordRequest) {
    const response = await apiClient.post('/auth/forgot-password', data);
    return response.data;
  },

  async resetPassword(data: ResetPasswordRequest) {
    const response = await apiClient.post('/auth/reset-password', data);
    return response.data;
  },
};

export default authApi;