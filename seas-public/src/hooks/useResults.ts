import { useQuery } from '@tanstack/react-query';
import { resultsApi } from '../api/modules/results';
import type { Result } from '../types/entities';

export function useMyResults() {
  return useQuery({
    queryKey: ['results', 'mine'],
    queryFn: () => resultsApi.getMyResult(),
    select: (response) => {
      const raw = response.data as unknown as Record<string, unknown> | undefined;
      if (!raw) return undefined;
      return {
        ...raw,
        score: Number(raw.totalScore ?? raw.score ?? 0),
        status: String(raw.status ?? 'pending'),
        scores: (raw.scores as Result['scores']) ?? [],
      } as Result;
    },
    retry: false,
  });
}

export function useResultsBySession(sessionId: string) {
  return useQuery({
    queryKey: ['results', 'session', sessionId],
    queryFn: () => resultsApi.getBySession(sessionId),
    select: (response) => (response.data ?? []) as Result[],
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
