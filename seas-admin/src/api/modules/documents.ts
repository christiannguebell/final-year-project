import apiClient from '../client';

export const documentsApi = {
  async verify(id: string, status: 'verified' | 'rejected', notes?: string) {
    const response = await apiClient.patch(`/documents/${id}/verify`, { status, notes });
    return response.data.data;
  },
};

export default documentsApi;
