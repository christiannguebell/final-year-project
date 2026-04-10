import apiClient from '../client';
import type { Candidate, Gender } from '../../types/entities';

export interface CreateCandidatePayload {
  dateOfBirth?: string;
  gender?: Gender;
  nationality?: string;
  address?: string;
  city?: string;
  country?: string;
}

export interface UpdateCandidatePayload extends Partial<CreateCandidatePayload> {}

export interface ListCandidatesParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}

export const candidatesApi = {
  async create(data: CreateCandidatePayload) {
    const response = await apiClient.post<Candidate>('/candidates', data);
    return response.data;
  },

  async list(params?: ListCandidatesParams) {
    const response = await apiClient.get<{ items: Candidate[]; pagination: any }>('/candidates', { params: params as any });
    return response.data;
  },

  async getById(id: string) {
    const response = await apiClient.get<Candidate>(`/candidates/${id}`);
    return response.data;
  },

  async update(id: string, data: UpdateCandidatePayload) {
    const response = await apiClient.put<Candidate>(`/candidates/${id}`, data);
    return response.data;
  },

  async uploadPhoto(id: string, file: File) {
    const formData = new FormData();
    formData.append('photo', file);
    const response = await apiClient.uploadFile<Candidate>(`/candidates/${id}/photo`, formData);
    return response.data;
  },
};

export default candidatesApi;