import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { notificationsApi } from '../api/modules/notifications';
import type { Notification } from '../types/entities';
import type { PaginatedResponse } from '../types/api';

export function useNotifications() {
  return useQuery({
    queryKey: ['notifications'],
    queryFn: () => notificationsApi.list(),
    select: (response) => response.data as PaginatedResponse<Notification>,
  });
}

export function useUnreadNotificationCount() {
  return useQuery({
    queryKey: ['notifications', 'unread-count'],
    queryFn: () => notificationsApi.getUnreadCount(),
    select: (response) => response.data as { count: number },
  });
}

export function useMarkNotificationAsRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => notificationsApi.markAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
}

export function useMarkAllNotificationsAsRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => notificationsApi.markAllAsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
}