import apiClient from '../client';
import type { Result } from '../../types/entities';

export const resultsApi = {
  async getMyResult() {
    const response = await apiClient.get<Result>('/results/my-result');
    return response.data;
  },

  async getMyResultReport() {
    const response = await apiClient.download('/results/my-result/report');
    return response.data;
  },

  async getBySession(sessionId: string) {
    const response = await apiClient.get<Result[]>(`/results/session/${sessionId}`);
    return response.data;
  },

  async getById(id: string) {
    const response = await apiClient.get<Result>(`/results/${id}`);
    return response.data;
  },
};

export default resultsApi;
