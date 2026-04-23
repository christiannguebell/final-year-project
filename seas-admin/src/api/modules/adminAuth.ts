import apiClient from '../client';
import type { LoginRequest, AuthTokens, User } from '../types/api';

interface AdminLoginResponse {
  user: User;
  tokens: AuthTokens;
}

const adminAuthApi = {
  async login(data: LoginRequest): Promise<AdminLoginResponse> {
    const response = await apiClient.post<AdminLoginResponse>('/admin/login', data);
    return response.data.data!;
  },
  async verifyOtp(data: { userId: string; otp: string }): Promise<{ verified: boolean; email: string }> {
    const response = await apiClient.post<{ verified: boolean; email: string }>('/admin/verify-otp', data);
    return response.data.data!;
  },
  async setupPassword(data: { userId: string; password: string }): Promise<{ message: string }> {
    const response = await apiClient.post<{ message: string }>('/admin/setup-password', data);
    return response.data.data!;
  },
  async refreshToken(refreshToken: string): Promise<AuthTokens> {
    const response = await apiClient.post<AuthTokens>('/admin/refresh-token', { refreshToken });
    return response.data.data!;
  },
  async resendOtp(email: string): Promise<{ message: string }> {
    const response = await apiClient.post<{ message: string }>('/admin/resend-otp', { email });
    return response.data.data!;
  },
  async createAdmin(email: string, role: string): Promise<{ message: string; email: string }> {
    const response = await apiClient.post<{ message: string; email: string }>('/admin/create', { email, role });
    return response.data.data!;
  },
  async getAdmins(): Promise<User[]> {
    const response = await apiClient.get<User[]>('/admin/admins');
    return response.data.data!;
  },
  async deleteAdmin(id: string): Promise<void> {
    const response = await apiClient.delete(`/admin/admins/${id}`);
    return response.data.data!;
  },
  async forgotPassword(email: string): Promise<{ message: string }> {
    const response = await apiClient.post<{ message: string }>('/admin/forgot-password', { email });
    return response.data.data!;
  },
  async resetPassword(token: string, newPassword: string): Promise<{ message: string }> {
    const response = await apiClient.post<{ message: string }>('/admin/reset-password', { token, newPassword });
    return response.data.data!;
  },
};

export default adminAuthApi;
