import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { systemApi, type SystemConfig } from '../api/modules/system';

export function useSystemConfig() {
  return useQuery({
    queryKey: ['system', 'config'],
    queryFn: () => systemApi.getConfig(),
    select: (response) => response.data?.data as SystemConfig[],
  });
}

export function useUpdateSystemConfig() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ key, value }: { key: string; value: string }) => systemApi.updateConfig(key, value),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['system', 'config'] });
    },
  });
}

export function useSystemHealth() {
  return useQuery({
    queryKey: ['system', 'health'],
    queryFn: () => systemApi.getHealth(),
  });
}