import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { candidatesApi, type CreateCandidatePayload, type UpdateCandidatePayload } from '../api/modules/candidates';
import type { Candidate } from '../types/entities';

export function useCandidateProfile() {
  return useQuery({
    queryKey: ['candidate', 'me'],
    queryFn: () => candidatesApi.getMe(),
  });
}

export function useCandidateById(id: string) {
  return useQuery({
    queryKey: ['candidate', id],
    queryFn: () => candidatesApi.getById(id),
    select: (response) => response.data?.data,
    enabled: !!id,
  });
}

export function useCreateCandidate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateCandidatePayload) => candidatesApi.create(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['candidate', 'me'] });
      return response.data?.data as Candidate;
    },
  });
}

export function useUpdateCandidate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateCandidatePayload) => candidatesApi.update(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['candidate', 'me'] });
      return response.data?.data as Candidate;
    },
  });
}

export function useUploadCandidatePhoto() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (file: File) => candidatesApi.uploadPhoto(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['candidate', 'me'] });
    },
  });
}