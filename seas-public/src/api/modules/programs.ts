import apiClient from '../client';
import type { Program } from '../../types/entities';
import type { PaginatedParams, PaginatedResponse } from '../../types/api';

export type ListProgramsParams = PaginatedParams;

export const programsApi = {
  async list(params?: ListProgramsParams) {
    const response = await apiClient.get<PaginatedResponse<Program>>('/programs', { params });
    return response.data;
  },

  async getById(id: string) {
    const response = await apiClient.get<Program>(`/programs/${id}`);
    return response.data;
  },
};

export default programsApi;