import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { documentsApi, type UploadDocumentPayload } from '../api/modules/documents';
import type { Document } from '../types/entities';

export function useDocuments(applicationId?: string) {
  return useQuery({
    queryKey: ['documents', applicationId],
    queryFn: () => documentsApi.list(applicationId!),
    select: (response) => (response.data ?? []) as Document[],
    enabled: !!applicationId,
  });
}

export function useDocumentById(id: string) {
  return useQuery({
    queryKey: ['document', id],
    queryFn: () => documentsApi.getById(id),
    select: (response) => response.data as Document,
    enabled: !!id,
  });
}

export function useUploadDocument() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UploadDocumentPayload) => documentsApi.upload(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['documents', variables.applicationId] });
    },
  });
}

export function useDeleteDocument() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => documentsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
    },
  });
}
