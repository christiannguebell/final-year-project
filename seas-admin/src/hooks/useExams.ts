import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { examsApi, type ListSessionsParams, type CreateSessionPayload, type UpdateSessionPayload, type CreateCenterPayload, type UpdateCenterPayload, type AutoAllocatePayload } from '../api/modules/exams';


export function useExamSessions(params?: ListSessionsParams) {
  return useQuery({
    queryKey: ['examSessions', params],
    queryFn: () => examsApi.listSessions(params),
  });
}

export function useExamSessionById(id: string) {
  return useQuery({
    queryKey: ['examSession', id],
    queryFn: () => examsApi.getSessionById(id),
    enabled: !!id,
  });
}

export function useCreateExamSession() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateSessionPayload) => examsApi.createSession(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['examSessions'] });
    },
  });
}

export function useUpdateExamSession() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateSessionPayload }) => examsApi.updateSession(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['examSessions'] });
      queryClient.invalidateQueries({ queryKey: ['examSession', variables.id] });
    },
  });
}

export function useDeleteExamSession() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => examsApi.deleteSession(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['examSessions'] });
    },
  });
}

export function useExamCenters(params?: { page?: number; limit?: number }) {
  return useQuery({
    queryKey: ['examCenters', params],
    queryFn: () => examsApi.listCenters(params),
  });
}

export function useExamCenterById(id: string) {
  return useQuery({
    queryKey: ['examCenter', id],
    queryFn: () => examsApi.getCenterById(id),
    enabled: !!id,
  });
}

export function useCreateExamCenter() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateCenterPayload) => examsApi.createCenter(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['examCenters'] });
    },
  });
}

export function useUpdateExamCenter() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCenterPayload }) => examsApi.updateCenter(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['examCenters'] });
      queryClient.invalidateQueries({ queryKey: ['examCenter', variables.id] });
    },
  });
}

export function useDeleteExamCenter() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => examsApi.deleteCenter(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['examCenters'] });
    },
  });
}

export function useAutoAllocate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: AutoAllocatePayload) => examsApi.autoAllocate(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['examSessions'] });
    },
  });
}