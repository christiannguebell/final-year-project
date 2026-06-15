import { useQuery } from '@tanstack/react-query';
import { examsApi } from '../api/modules/exams';
import type { ExamAssignment } from '../types/entities';

export function useMyExamAssignment() {
  return useQuery({
    queryKey: ['exam-assignment'],
    queryFn: () => examsApi.getMyAssignment(),
    select: (response) => response.data as ExamAssignment,
    retry: false,
  });
}
