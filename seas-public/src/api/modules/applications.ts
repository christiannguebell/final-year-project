import apiClient from '../client';
import type { Application, ApplicationStatus } from '../types/entities';
import type { PaginatedParams, PaginatedResponse } from '../types/api';

export interface CreateApplicationPayload {
  programId: string;
}

export interface UpdateApplicationPayload {
  programId?: string;
}

export interface ListApplicationsParams extends PaginatedParams {
  status?: ApplicationStatus;
}

export const applicationsApi = {
  async create(data: CreateApplicationPayload) {
    const response = await apiClient.post<Application>('/applications', data);
    return response.data;
  },

  async getMine() {
    const response = await apiClient.get<PaginatedResponse<Application>>('/applications/mine');
    return response.data;
  },

  async getAll(params?: ListApplicationsParams) {
    const response = await apiClient.get<PaginatedResponse<Application>>('/applications', { params });
    return response.data;
  },

  async getById(id: string) {
    const response = await apiClient.get<Application>(`/applications/${id}`);
    return response.data;
  },

  async update(id: string, data: UpdateApplicationPayload) {
    const response = await apiClient.put<Application>(`/applications/${id}`, data);
    return response.data;
  },

  async submit(id: string) {
    const response = await apiClient.post<Application>(`/applications/${id}/submit`);
    return response.data;
  },

  async delete(id: string) {
    const response = await apiClient.delete(`/applications/${id}`);
    return response.data;
  },
};

export default applicationsApi;