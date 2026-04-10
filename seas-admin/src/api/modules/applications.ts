import apiClient from '../client';
import type { Application, ApplicationStatus } from '../../types/entities';
import type { PaginatedParams } from '../../types/api';

export interface ListApplicationsParams extends PaginatedParams {
  status?: ApplicationStatus;
  search?: string;
  programId?: string;
}

export interface UpdateApplicationPayload {
  programId?: string;
}

export const applicationsApi = {
  async list(params?: ListApplicationsParams) {
    const response = await apiClient.get<{ items: Application[]; pagination: any }>('/applications', { params: params as any });
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

  async approve(id: string) {
    const response = await apiClient.patch<Application>(`/applications/${id}/approve`);
    return response.data;
  },

  async reject(id: string) {
    const response = await apiClient.patch<Application>(`/applications/${id}/reject`);
    return response.data;
  },

  async delete(id: string) {
    const response = await apiClient.delete(`/applications/${id}`);
    return response.data;
  },
};

export default applicationsApi;