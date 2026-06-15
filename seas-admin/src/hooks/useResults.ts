import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { resultsApi, type EnterScoresPayload, type CreateResultPayload } from '../api/modules/results';

export function useResults(status?: string) {
  return useQuery({
    queryKey: ['results', status],
    queryFn: () => resultsApi.list(status),
  });
}

export function useResultsBySession(sessionId: string) {
  return useQuery({
    queryKey: ['results', 'session', sessionId],
    queryFn: () => resultsApi.getBySession(sessionId),
    enabled: !!sessionId,
  });
}

export function useCreateResult() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateResultPayload) => resultsApi.create(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['results'] }),
  });
}

export function useEnterScores() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: EnterScoresPayload) => resultsApi.enterScores(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['results'] }),
  });
}

export function usePublishResult() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => resultsApi.publishResult(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['results'] }),
  });
}

export function usePublishSessionResults() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (sessionId: string) => resultsApi.publishSessionResults(sessionId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['results'] }),
  });
}
