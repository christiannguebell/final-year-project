import { useMutation, useQueryClient } from '@tanstack/react-query';
import { documentsApi } from '../api/modules/documents';

export function useVerifyDocument() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status, notes }: { id: string; status: 'verified' | 'rejected'; notes?: string }) =>
      documentsApi.verify(id, status, notes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] });
      queryClient.invalidateQueries({ queryKey: ['application'] });
    },
  });
}
