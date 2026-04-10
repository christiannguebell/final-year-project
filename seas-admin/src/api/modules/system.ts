import apiClient from '../client';

export interface SystemConfig {
  key: string;
  value: string;
  description?: string;
}

export const systemApi = {
  async getConfig() {
    const response = await apiClient.get<SystemConfig[]>('/system/config');
    return response.data;
  },

  async updateConfig(key: string, value: string) {
    const response = await apiClient.put<SystemConfig>(`/system/config/${key}`, { value });
    return response.data;
  },

  async getHealth() {
    const response = await apiClient.get<{ status: string }>('/system/health');
    return response.data;
  },
};

export default systemApi;