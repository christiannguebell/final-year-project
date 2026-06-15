import apiClient from '../client';

export interface EnterScoresPayload {
  applicationId: string;
  scores: Array<{ subject: string; score?: number; maxScore?: number }>;
}

export interface CreateResultPayload {
  applicationId: string;
}

export const resultsApi = {
  async list(status?: string) {
    const response = await apiClient.get('/results', { params: status ? { status } : undefined });
    return response.data.data as unknown[];
  },

  async getById(id: string) {
    const response = await apiClient.get(`/results/${id}`);
    return response.data.data;
  },

  async create(data: CreateResultPayload) {
    const response = await apiClient.post('/results', data);
    return response.data.data;
  },

  async enterScores(data: EnterScoresPayload) {
    const response = await apiClient.post('/results/scores', data);
    return response.data.data;
  },

  async publishResult(id: string) {
    const response = await apiClient.post(`/results/${id}/publish`);
    return response.data.data;
  },

  async publishSessionResults(sessionId: string) {
    const response = await apiClient.post(`/results/session/${sessionId}/publish`);
    return response.data.data;
  },

  async getBySession(sessionId: string) {
    const response = await apiClient.get(`/results/session/${sessionId}`);
    return response.data.data as unknown[];
  },
};

export default resultsApi;
