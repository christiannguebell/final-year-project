import apiClient from '../client';
import type { User, PaginatedParams, PaginatedResponse } from '../../types/api';

export interface ListUsersParams extends PaginatedParams {
  search?: string;
}

export interface UpdateUserPayload {
  firstName?: string;
  lastName?: string;
  isActive?: boolean;
}

export const usersApi = {
  async list(params?: ListUsersParams) {
    const response = await apiClient.get<PaginatedResponse<User>>('/users', { params });
    return response.data;
  },

  async getById(id: string) {
    const response = await apiClient.get<User>(`/users/${id}`);
    return response.data;
  },

  async update(id: string, data: UpdateUserPayload) {
    const response = await apiClient.put<User>(`/users/${id}`, data);
    return response.data;
  },

  async activate(id: string) {
    const response = await apiClient.patch<User>(`/users/${id}/activate`);
    return response.data;
  },

  async deactivate(id: string) {
    const response = await apiClient.patch<User>(`/users/${id}/deactivate`);
    return response.data;
  },

  async delete(id: string) {
    const response = await apiClient.delete(`/users/${id}`);
    return response.data;
  },
};

export default usersApi;