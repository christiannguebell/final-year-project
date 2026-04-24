import { useQuery } from '@tanstack/react-query';
import { resultsApi } from '../api/modules/results';
import type { Result } from '../types/entities';
import type { PaginatedResponse } from '../types/api';

export function useMyResults() {
  return useQuery({
    queryKey: ['results', 'mine'],
    queryFn: () => resultsApi.getMy(),
    select: (response) => response.data as PaginatedResponse<Result>,
  });
}

export function useResultsBySession(sessionId: string) {
  return useQuery({
    queryKey: ['results', 'session', sessionId],
    queryFn: () => resultsApi.getBySession(sessionId),
    select: (response) => response.data as PaginatedResponse<Result>,
    enabled: !!sessionId,
  });
}

export function useResultById(id: string) {
  return useQuery({
    queryKey: ['result', id],
    queryFn: () => resultsApi.getById(id),
    select: (response) => response.data as Result,
    enabled: !!id,
  });
}