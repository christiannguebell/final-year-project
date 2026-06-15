import apiClient from '../client';
import type { Notification } from '@/types/entities';

export interface ListNotificationsParams {
  limit?: number;
}

export const notificationsApi = {
  async list(params?: ListNotificationsParams) {
    const response = await apiClient.get<Notification[]>('/notifications/my', { params });
    return response.data;
  },

  async getUnreadCount() {
    const response = await apiClient.get<Notification[]>('/notifications/unread');
    const notifications = response.data.data ?? [];
    return { count: notifications.length };
  },

  async markAsRead(id: string) {
    const response = await apiClient.put<Notification>(`/notifications/${id}/read`);
    return response.data;
  },

  async markAllAsRead() {
    const response = await apiClient.put('/notifications/read-all');
    return response.data;
  },
};

export default notificationsApi;
