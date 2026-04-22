import apiClient from '../client';
import type { LoginRequest, LoginResponse, AuthTokens, User } from '../types/api';

interface AdminLoginResponse {
  user: User;
  tokens: AuthTokens;
}

interface VerifyOtpRequest {
  userId: string;
  otp: string;
}

interface SetupPasswordRequest {
  userId: string;
  password: string;
}

export const adminAuthApi = {
  async login(data: LoginRequest): Promise<AdminLoginResponse> {
    const response = await apiClient.post<AdminLoginResponse>('/admin/login', data);
    return response.data;
  },

  async verifyOtp(data: VerifyOtpRequest): Promise<{ verified: boolean; email: string }> {
    const response = await apiClient.post('/admin/verify-otp', data);
    return response.data;
  },

  async setupPassword(data: SetupPasswordRequest): Promise<{ message: string }> {
    const response = await apiClient.post('/admin/setup-password', data);
    return response.data;
  },

  async refreshToken(refreshToken: string): Promise<AuthTokens> {
    const response = await apiClient.post<AuthTokens>('/admin/refresh-token', { refreshToken });
    return response.data;
  },

  async resendOtp(email: string): Promise<{ message: string }> {
    const response = await apiClient.post('/admin/resend-otp', { email });
    return response.data;
  },

  async createAdmin(email: string, role: string): Promise<{ message: string; email: string }> {
    const response = await apiClient.post('/admin/create', { email, role });
    return response.data;
  },

  async getAdmins(): Promise<User[]> {
    const response = await apiClient.get<User[]>('/admin/admins');
    return response.data;
  },

  async deleteAdmin(id: string): Promise<void> {
    const response = await apiClient.delete(`/admin/admins/${id}`);
    return response.data;
  },
};

export default adminAuthApi;