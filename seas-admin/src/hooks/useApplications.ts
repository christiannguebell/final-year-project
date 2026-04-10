import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { applicationsApi, type ListApplicationsParams, type UpdateApplicationPayload } from '../api/modules/applications';
import type { Application } from '../types/entities';

export function useApplications(params?: ListApplicationsParams) {
  return useQuery({
    queryKey: ['applications', params],
    queryFn: () => applicationsApi.list(params),
    select: (response) => response.data?.data as { items: Application[]; pagination: any },
  });
}

export function useApplicationById(id: string) {
  return useQuery({
    queryKey: ['application', id],
    queryFn: () => applicationsApi.getById(id),
    select: (response) => response.data?.data as Application,
    enabled: !!id,
  });
}

export function useUpdateApplication() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateApplicationPayload }) => applicationsApi.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['applications'] });
      queryClient.invalidateQueries({ queryKey: ['application', variables.id] });
    },
  });
}

export function useApproveApplication() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => applicationsApi.approve(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['applications'] });
      queryClient.invalidateQueries({ queryKey: ['application', id] });
    },
  });
}

export function useRejectApplication() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => applicationsApi.reject(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['applications'] });
      queryClient.invalidateQueries({ queryKey: ['application', id] });
    },
  });
}

export function useDeleteApplication() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => applicationsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] });
    },
  });
}