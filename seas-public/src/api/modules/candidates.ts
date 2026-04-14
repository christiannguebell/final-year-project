import apiClient from '../client';
import type { Candidate, Gender } from '@/types/entities';

export interface CreateCandidatePayload {
  dateOfBirth?: string;
  gender?: Gender;
  nationality?: string;
  address?: string;
  city?: string;
  country?: string;
}

export interface UpdateCandidatePayload extends Partial<CreateCandidatePayload> {}

export const candidatesApi = {
  async create(data: CreateCandidatePayload) {
    const response = await apiClient.post<Candidate>('/candidates', data);
    return response.data;
  },

  async getMe() {
    const response = await apiClient.get<Candidate>('/candidates/me');
    return response.data;
  },

  async getById(id: string) {
    const response = await apiClient.get<Candidate>(`/candidates/${id}`);
    return response.data;
  },

  async update(data: UpdateCandidatePayload) {
    const response = await apiClient.put<Candidate>('/candidates', data);
    return response.data;
  },

  async uploadPhoto(file: File) {
    const formData = new FormData();
    formData.append('photo', file);
    const response = await apiClient.uploadFile<Candidate>('/candidates/photo', formData);
    return response.data;
  },
};

export default candidatesApi;