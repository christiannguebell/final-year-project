import { useQuery } from '@tanstack/react-query';
import { resultsApi } from '../api/modules/results';
import type { Result } from '../types/entities';

export function useMyResults() {
  return useQuery({
    queryKey: ['results', 'mine'],
    queryFn: () => resultsApi.getMy(),
    select: (response) => response.data as { items: Result[]; pagination: any },
  });
}

export function useResultsBySession(sessionId: string) {
  return useQuery({
    queryKey: ['results', 'session', sessionId],
    queryFn: () => resultsApi.getBySession(sessionId),
    select: (response) => response.data as { items: Result[]; pagination: any },
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