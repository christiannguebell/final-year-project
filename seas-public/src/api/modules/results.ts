import apiClient from '../client';
import type { Result } from '../../types/entities';
import type { PaginatedParams, PaginatedResponse } from '../../types/api';

export type ListResultsParams = PaginatedParams;

export const resultsApi = {
  async getMy(params?: ListResultsParams) {
    const response = await apiClient.get<PaginatedResponse<Result>>('/results/mine', { params });
    return response.data;
  },

  async getBySession(sessionId: string, params?: ListResultsParams) {
    const response = await apiClient.get<PaginatedResponse<Result>>(`/results/session/${sessionId}`, { params });
    return response.data;
  },

  async getById(id: string) {
    const response = await apiClient.get<Result>(`/results/${id}`);
    return response.data;
  },
};

export default resultsApi;