import apiClient from '../client';

export interface DashboardStats {
  totalCandidates: number;
  totalApplications: number;
  totalPrograms: number;
  pendingApplications: number;
  approvedApplications: number;
  rejectedApplications: number;
}

export interface ApplicationsByStatus {
  status: string;
  count: number;
}

export interface ApplicationsOverTime {
  date: string;
  count: number;
}

export const analyticsApi = {
  async getDashboardStats() {
    const response = await apiClient.get<DashboardStats>('/analytics/dashboard');
    return response.data.data;
  },
  async getApplicationsByStatus() {
    const response = await apiClient.get<ApplicationsByStatus[]>('/analytics/applications-by-status');
    return response.data.data;
  },
  async getApplicationsOverTime() {
    const response = await apiClient.get<ApplicationsOverTime[]>('/analytics/applications-over-time');
    return response.data.data;
  },
};

export default analyticsApi;