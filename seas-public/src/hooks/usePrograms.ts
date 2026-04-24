import { useQuery } from '@tanstack/react-query';
import { programsApi, type ListProgramsParams } from '../api/modules/programs';
import type { Program } from '../types/entities';
import type { PaginatedResponse } from '../types/api';

export function usePrograms(params?: ListProgramsParams) {
  return useQuery({
    queryKey: ['programs', params],
    queryFn: () => programsApi.list(params),
    select: (response) => response.data as PaginatedResponse<Program>,
  });
}

export function useProgramById(id: string) {
  return useQuery({
    queryKey: ['program', id],
    queryFn: () => programsApi.getById(id),
    select: (response) => response.data as Program,
    enabled: !!id,
  });
}