import apiClient from '../client';
import type { Program } from '../../types/entities';
import type { PaginatedParams, PaginatedResponse } from '../../types/api';

export interface ListProgramsParams extends PaginatedParams {
  search?: string;
}

export interface CreateProgramPayload {
  name: string;
  code: string;
  description?: string;
}

export interface UpdateProgramPayload {
  name?: string;
  description?: string;
}

export const programsApi = {
  async list(params?: ListProgramsParams) {
    const response = await apiClient.get<PaginatedResponse<Program>>('/programs', { params });
    return response.data.data;
  },

  async getById(id: string) {
    const response = await apiClient.get<Program>(`/programs/${id}`);
    return response.data.data;
  },

  async create(data: CreateProgramPayload) {
    const response = await apiClient.post<Program>('/programs', data);
    return response.data.data;
  },

  async update(id: string, data: UpdateProgramPayload) {
    const response = await apiClient.put<Program>(`/programs/${id}`, data);
    return response.data.data;
  },

  async activate(id: string) {
    const response = await apiClient.patch<Program>(`/programs/${id}/activate`);
    return response.data.data;
  },

  async deactivate(id: string) {
    const response = await apiClient.patch<Program>(`/programs/${id}/deactivate`);
    return response.data.data;
  },

  async delete(id: string) {
    const response = await apiClient.delete(`/programs/${id}`);
    return response.data.data;
  },
};

export default programsApi;