import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { candidatesApi, type CreateCandidatePayload, type UpdateCandidatePayload } from '../api/modules/candidates';
import type { Candidate } from '../types/entities';
import { STORAGE_KEYS } from '../config/constants';

export function useCandidateProfile() {
  return useQuery({
    queryKey: ['candidate', 'me'],
    queryFn: async () => {
      const response = await candidatesApi.getMe();
      return response.data || null;
    },
    enabled: !!localStorage.getItem(STORAGE_KEYS.TOKEN),
  });
}

export function useCandidateById(id: string) {
  return useQuery({
    queryKey: ['candidate', id],
    queryFn: () => candidatesApi.getById(id),
    select: (response) => response.data,
    enabled: !!id,
  });
}

export function useCreateCandidate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateCandidatePayload) => candidatesApi.create(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['candidate', 'me'] });
      return response.data as Candidate;
    },
  });
}

export function useUpdateCandidate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateCandidatePayload) => candidatesApi.update(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['candidate', 'me'] });
      return response.data as Candidate;
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