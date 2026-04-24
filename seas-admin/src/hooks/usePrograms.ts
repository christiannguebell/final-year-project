import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { programsApi, type ListProgramsParams, type CreateProgramPayload, type UpdateProgramPayload } from '../api/modules/programs';
import type { Program } from '../types/entities';

export function usePrograms(params?: ListProgramsParams) {
  return useQuery({
    queryKey: ['programs', params],
    queryFn: () => programsApi.list(params),
  });
}

export function useProgramById(id: string) {
  return useQuery({
    queryKey: ['program', id],
    queryFn: () => programsApi.getById(id),
    enabled: !!id,
  });
}

export function useCreateProgram() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateProgramPayload) => programsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['programs'] });
    },
  });
}

export function useUpdateProgram() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateProgramPayload }) => programsApi.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['programs'] });
      queryClient.invalidateQueries({ queryKey: ['program', variables.id] });
    },
  });
}

export function useActivateProgram() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => programsApi.activate(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['programs'] });
    },
  });
}

export function useDeactivateProgram() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => programsApi.deactivate(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['programs'] });
    },
  });
}

export function useDeleteProgram() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => programsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['programs'] });
    },
  });
}