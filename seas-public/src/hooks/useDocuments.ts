import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { documentsApi, type UploadDocumentPayload } from '../api/modules/documents';
import type { Document } from '../types/entities';
import type { PaginatedResponse } from '../types/api';
import type { DocumentType } from '../types/entities';

export function useDocuments(type?: string) {
  return useQuery({
    queryKey: ['documents', type],
    queryFn: () => documentsApi.list(type ? { type: type as DocumentType } : undefined),
    select: (response) => response.data as PaginatedResponse<Document>,
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
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