import { useQuery } from '@tanstack/react-query';
import { analyticsApi, type DashboardStats, type ApplicationsByStatus, type ApplicationsOverTime } from '../api/modules/analytics';

export function useDashboardStats() {
  return useQuery({
    queryKey: ['analytics', 'dashboard'],
    queryFn: () => analyticsApi.getDashboardStats(),
    select: (response) => response.data?.data as DashboardStats,
  });
}

export function useApplicationsByStatus() {
  return useQuery({
    queryKey: ['analytics', 'applications-by-status'],
    queryFn: () => analyticsApi.getApplicationsByStatus(),
    select: (response) => response.data?.data as ApplicationsByStatus[],
  });
}

export function useApplicationsOverTime() {
  return useQuery({
    queryKey: ['analytics', 'applications-over-time'],
    queryFn: () => analyticsApi.getApplicationsOverTime(),
    select: (response) => response.data?.data as ApplicationsOverTime[],
  });
}