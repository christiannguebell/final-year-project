import { useQuery } from '@tanstack/react-query';
import { analyticsApi } from '../api/modules/analytics';

export function useDashboardStats() {
  return useQuery({
    queryKey: ['analytics', 'dashboard'],
    queryFn: () => analyticsApi.getDashboardStats(),
  });
}

export function useApplicationsByStatus() {
  return useQuery({
    queryKey: ['analytics', 'applications-by-status'],
    queryFn: () => analyticsApi.getApplicationsByStatus(),
  });
}

export function useApplicationsOverTime() {
  return useQuery({
    queryKey: ['analytics', 'applications-over-time'],
    queryFn: () => analyticsApi.getApplicationsOverTime(),
  });
}