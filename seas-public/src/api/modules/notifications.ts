import apiClient from '../client';
import type { Notification } from '../types/entities';
import type { PaginatedParams, PaginatedResponse } from '../types/api';

export interface ListNotificationsParams extends PaginatedParams {}

export const notificationsApi = {
  async list(params?: ListNotificationsParams) {
    const response = await apiClient.get<PaginatedResponse<Notification>>('/notifications', { params });
    return response.data;
  },

  async getUnreadCount() {
    const response = await apiClient.get<{ count: number }>('/notifications/unread-count');
    return response.data;
  },

  async markAsRead(id: string) {
    const response = await apiClient.patch<Notification>(`/notifications/${id}/read`);
    return response.data;
  },

  async markAllAsRead() {
    const response = await apiClient.post('/notifications/mark-all-read');
    return response.data;
  },
};

export default notificationsApi;