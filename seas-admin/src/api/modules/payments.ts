import apiClient from '../client';
import type { Payment, PaymentStatus } from '../../types/entities';
import type { PaginatedParams, PaginatedResponse } from '../../types/api';

export interface ListPaymentsParams extends PaginatedParams {
  status?: PaymentStatus;
  search?: string;
  method?: string;
  startDate?: string;
  endDate?: string;
}

export interface VerifyPaymentPayload {
  status: PaymentStatus;
  notes?: string;
}

export const paymentsApi = {
  async list(params?: ListPaymentsParams) {
    const response = await apiClient.get<PaginatedResponse<Payment>>('/payments', { params });
    return response.data.data;
  },

  async getById(id: string) {
    const response = await apiClient.get<Payment>(`/payments/${id}`);
    return response.data.data;
  },

  async verify(id: string, data: VerifyPaymentPayload) {
    const response = await apiClient.patch<Payment>(`/payments/${id}/verify`, data);
    return response.data.data;
  },

  async flag(id: string, notes?: string) {
    const response = await apiClient.patch<Payment>(`/payments/${id}/flag`, { notes });
    return response.data.data;
  },
};

export default paymentsApi;
