import apiClient from '../client';
import type { Payment, PaymentStatus } from '../types/entities';
import type { PaginatedParams, PaginatedResponse } from '../types/api';

export interface CreatePaymentIntentPayload {
  applicationId: string;
  amount: number;
  currency?: string;
}

export interface ListPaymentsParams extends PaginatedParams {
  status?: PaymentStatus;
}

export const paymentsApi = {
  async createIntent(data: CreatePaymentIntentPayload) {
    const response = await apiClient.post<Payment>('/payments/intent', data);
    return response.data;
  },

  async confirm(paymentId: string, paymentMethodId: string) {
    const response = await apiClient.post<Payment>(`/payments/${paymentId}/confirm`, { paymentMethodId });
    return response.data;
  },

  async list(params?: ListPaymentsParams) {
    const response = await apiClient.get<PaginatedResponse<Payment>>('/payments', { params });
    return response.data;
  },

  async getById(id: string) {
    const response = await apiClient.get<Payment>(`/payments/${id}`);
    return response.data;
  },
};

export default paymentsApi;