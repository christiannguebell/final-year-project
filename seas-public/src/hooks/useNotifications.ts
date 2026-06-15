import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { notificationsApi } from '../api/modules/notifications';
import type { Notification } from '../types/entities';

function mapNotification(raw: Record<string, unknown>): Notification {
  return {
    id: String(raw.id),
    candidateId: String(raw.userId ?? raw.candidateId ?? ''),
    title: String(raw.title ?? ''),
    message: String(raw.message ?? ''),
    isRead: raw.status === 'read' || raw.isRead === true,
    type: raw.type ? String(raw.type) : undefined,
    link: raw.link ? String(raw.link) : undefined,
    createdAt: String(raw.createdAt ?? new Date().toISOString()),
  };
}

export function useNotifications() {
  return useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      const response = await notificationsApi.list();
      return ((response.data ?? []) as unknown as Record<string, unknown>[]).map(mapNotification);
    },
  });
}

export function useUnreadNotificationCount() {
  return useQuery({
    queryKey: ['notifications', 'unread-count'],
    queryFn: () => notificationsApi.getUnreadCount(),
    select: (data) => data.count ?? 0,
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
