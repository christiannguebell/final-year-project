import { useQuery } from '@tanstack/react-query';
import { examsApi } from '../api/modules/exams';
import type { ExamSession, ExamCenter, ExamAssignment } from '../types/entities';

export function useExamSessions() {
  return useQuery({
    queryKey: ['exam', 'sessions'],
    queryFn: () => examsApi.getSessions(),
    select: (response) => response.data?.data as { items: ExamSession[]; pagination: any },
  });
}

export function useExamSessionById(id: string) {
  return useQuery({
    queryKey: ['exam', 'session', id],
    queryFn: () => examsApi.getSessionById(id),
    select: (response) => response.data?.data as ExamSession,
    enabled: !!id,
  });
}

export function useExamCenters() {
  return useQuery({
    queryKey: ['exam', 'centers'],
    queryFn: () => examsApi.getCenters(),
    select: (response) => response.data?.data as { items: ExamCenter[]; pagination: any },
  });
}

export function useExamCenterById(id: string) {
  return useQuery({
    queryKey: ['exam', 'center', id],
    queryFn: () => examsApi.getCenterById(id),
    select: (response) => response.data?.data as ExamCenter,
    enabled: !!id,
  });
}

export function useMyExamAssignment() {
  return useQuery({
    queryKey: ['exam', 'my-assignment'],
    queryFn: () => examsApi.getMyAssignment(),
    select: (response) => response.data?.data as ExamAssignment,
  });
}

export function useAdmissionSlip() {
  return {
    queryFn: () => examsApi.getAdmissionSlip(),
  };
}