import { useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationsApi, type BroadcastPayload } from '../api/modules/notifications';

export function useBroadcastNotification() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: BroadcastPayload) => notificationsApi.broadcast(data),
    onSuccess: () => {
      // Invalidate related notifications cache if any
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
}
