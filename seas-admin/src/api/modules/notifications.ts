import apiClient from '../client';

export interface BroadcastPayload {
  title: string;
  message: string;
  role?: 'ADMIN' | 'CANDIDATE';
}

export const notificationsApi = {
  async broadcast(data: BroadcastPayload) {
    const response = await apiClient.post('/notifications/broadcast', data);
    return response.data.data!;
  },
};

export default notificationsApi;
