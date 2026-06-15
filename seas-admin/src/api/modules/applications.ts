import apiClient from '../client';
import type { Application, ApplicationStatus } from '../../types/entities';
import type { PaginatedParams, PaginatedResponse } from '../../types/api';

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
    const response = await apiClient.get<Application[] | PaginatedResponse<Application>>('/applications', { params });
    const data = response.data.data;
    if (Array.isArray(data)) {
      return {
        items: data,
        pagination: {
          page: params?.page ?? 1,
          limit: params?.limit ?? data.length,
          total: data.length,
          totalPages: 1,
          hasNext: false,
          hasPrev: false,
        },
      };
    }
    return data!;
  },

  async getById(id: string) {
    const response = await apiClient.get<Application>(`/applications/${id}`);
    return response.data.data;
  },

  async update(id: string, data: UpdateApplicationPayload) {
    const response = await apiClient.put<Application>(`/applications/${id}`, data);
    return response.data.data;
  },

  async approve(id: string) {
    const response = await apiClient.patch<Application>(`/applications/${id}/approve`);
    return response.data.data;
  },

  async reject(id: string) {
    const response = await apiClient.patch<Application>(`/applications/${id}/reject`);
    return response.data.data;
  },

  async delete(id: string) {
    const response = await apiClient.delete(`/applications/${id}`);
    return response.data.data;
  },
};

export default applicationsApi;