import apiClient from './client';
import type { LoginRequest, LoginResponse, User, AuthTokens } from '../types/api';

export const authApi = {
  async login(data: LoginRequest) {
    const response = await apiClient.post<LoginResponse>('/auth/login', data);
    return response.data;
  },

  async refreshToken(refreshToken: string) {
    const response = await apiClient.post<AuthTokens>('/auth/refresh-token', { refreshToken });
    return response.data;
  },

  async changePassword(data: { currentPassword: string; newPassword: string }) {
    const response = await apiClient.put('/auth/change-password', data);
    return response.data;
  },

  async getProfile() {
    const response = await apiClient.get<User>('/auth/profile');
    return response.data;
  },
};

export default authApi;