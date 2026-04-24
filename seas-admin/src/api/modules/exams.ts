import apiClient from '../client';
import type { ExamSession, ExamCenter, ExamSessionStatus } from '../../types/entities';

export interface ListSessionsParams {
  page?: number;
  limit?: number;
  status?: ExamSessionStatus;
}

export interface CreateSessionPayload {
  name: string;
  startDate: string;
  endDate: string;
}

export interface UpdateSessionPayload {
  name?: string;
}

export interface ListCentersParams {
  page?: number;
  limit?: number;
}

export interface CreateCenterPayload {
  name: string;
  location: string;
  capacity: number;
}

export interface UpdateCenterPayload {
  name?: string;
  location?: string;
  capacity?: number;
}

export interface AutoAllocatePayload {
  sessionId: string;
}

export const examsApi = {
  async createSession(data: CreateSessionPayload) {
    const response = await apiClient.post<ExamSession>('/exams/sessions', data);
    return response.data.data;
  },

  async listSessions(params?: ListSessionsParams) {
    const response = await apiClient.get<{ items: ExamSession[]; pagination: any }>('/exams/sessions', { params: params as any });
    return response.data.data;
  },

  async getSessionById(id: string) {
    const response = await apiClient.get<ExamSession>(`/exams/sessions/${id}`);
    return response.data.data;
  },

  async updateSession(id: string, data: UpdateSessionPayload) {
    const response = await apiClient.put<ExamSession>(`/exams/sessions/${id}`, data);
    return response.data.data;
  },

  async deleteSession(id: string) {
    const response = await apiClient.delete(`/exams/sessions/${id}`);
    return response.data.data;
  },

  async createCenter(data: CreateCenterPayload) {
    const response = await apiClient.post<ExamCenter>('/exams/centers', data);
    return response.data.data;
  },

  async listCenters(params?: ListCentersParams) {
    const response = await apiClient.get<{ items: ExamCenter[]; pagination: any }>('/exams/centers', { params: params as any });
    return response.data.data;
  },

  async getCenterById(id: string) {
    const response = await apiClient.get<ExamCenter>(`/exams/centers/${id}`);
    return response.data.data;
  },

  async updateCenter(id: string, data: UpdateCenterPayload) {
    const response = await apiClient.put<ExamCenter>(`/exams/centers/${id}`, data);
    return response.data.data;
  },

  async deleteCenter(id: string) {
    const response = await apiClient.delete(`/exams/centers/${id}`);
    return response.data.data;
  },

  async autoAllocate(data: AutoAllocatePayload) {
    const response = await apiClient.post('/exams/auto-allocate', data);
    return response.data.data;
  },
};

export default examsApi;