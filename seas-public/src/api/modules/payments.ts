import apiClient from '../client';
import type { Payment, PaymentStatus } from '../../types/entities';
import type { PaginatedParams, PaginatedResponse } from '@/types/api';

export interface CreatePaymentPayload {
  applicationId: string;
  amount: number;
  paymentDate: string;
  method: 'BANK_TRANSFER' | 'MOBILE_MONEY' | 'CASH';
  transactionId?: string;
}

export interface VerifyPaymentPayload {
  status: 'VERIFIED' | 'REJECTED';
  comment?: string;
}

export interface ListPaymentsParams extends PaginatedParams {
  status?: PaymentStatus;
}

export const paymentsApi = {
  async create(data: CreatePaymentPayload) {
    const response = await apiClient.post<Payment>('/payments', data);
    return response.data;
  },

  async uploadReceipt(paymentId: string, receiptFile: File, transactionId?: string, amount?: string) {
    const formData = new FormData();
    formData.append('receipt', receiptFile);
    if (transactionId) formData.append('transactionId', transactionId);
    if (amount) formData.append('amount', amount);
    
    const response = await apiClient.uploadFile<Payment>(`/payments/${paymentId}/receipt`, formData);
    return response.data;
  },

  async getByApplication(applicationId: string) {
    const response = await apiClient.get<Payment[]>(`/payments/application/${applicationId}`);
    return response.data;
  },

  async verify(paymentId: string, data: VerifyPaymentPayload) {
    const response = await apiClient.patch<Payment>(`/payments/${paymentId}/verify`, data);
    return response.data;
  },

  async delete(paymentId: string) {
    const response = await apiClient.delete(`/payments/${paymentId}`);
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