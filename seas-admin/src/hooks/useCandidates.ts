import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { candidatesApi, type ListCandidatesParams, type CreateCandidatePayload, type UpdateCandidatePayload } from '../api/modules/candidates';
import type { Candidate } from '../types/entities';

export function useCandidates(params?: ListCandidatesParams) {
  return useQuery({
    queryKey: ['candidates', params],
    queryFn: () => candidatesApi.list(params),
  });
}

export function useCandidateById(id: string) {
  return useQuery({
    queryKey: ['candidate', id],
    queryFn: () => candidatesApi.getById(id),
    enabled: !!id,
  });
}

export function useCreateCandidate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateCandidatePayload) => candidatesApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['candidates'] });
    },
  });
}

export function useUpdateCandidate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCandidatePayload }) => candidatesApi.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['candidates'] });
      queryClient.invalidateQueries({ queryKey: ['candidate', variables.id] });
    },
  });
}

export function useUploadCandidatePhoto() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, file }: { id: string; file: File }) => candidatesApi.uploadPhoto(id, file),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['candidate', variables.id] });
    },
  });
}