import apiClient from '../client';
import type { ExamSession, ExamCenter, ExamAssignment } from '../../types/entities';

export const examsApi = {
  async getSessions() {
    const response = await apiClient.get<{ items: ExamSession[]; pagination: any }>('/exams/sessions');
    return response.data;
  },

  async getSessionById(id: string) {
    const response = await apiClient.get<ExamSession>(`/exams/sessions/${id}`);
    return response.data;
  },

  async getCenters() {
    const response = await apiClient.get<{ items: ExamCenter[]; pagination: any }>('/exams/centers');
    return response.data;
  },

  async getCenterById(id: string) {
    const response = await apiClient.get<ExamCenter>(`/exams/centers/${id}`);
    return response.data;
  },

  async getMyAssignment() {
    const response = await apiClient.get<ExamAssignment>('/exams/my-assignment');
    return response.data;
  },

  async getAdmissionSlip() {
    const response = await apiClient.download('/exams/my-assignment/slip');
    return response.data;
  },
};

export default examsApi;