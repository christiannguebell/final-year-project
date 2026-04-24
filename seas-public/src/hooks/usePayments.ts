import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { paymentsApi, type CreatePaymentPayload, type VerifyPaymentPayload } from '../api/modules/payments';
import type { Payment } from '../types/entities';

export function usePayments() {
  return useQuery({
    queryKey: ['payments'],
    queryFn: () => paymentsApi.list(),
    select: (response) => response.data?.items as Payment[],
  });
}

export function usePaymentById(id: string) {
  return useQuery({
    queryKey: ['payment', id],
    queryFn: () => paymentsApi.getById(id),
    select: (response) => response.data as Payment,
    enabled: !!id,
  });
}

export function usePaymentsByApplication(applicationId: string) {
  return useQuery({
    queryKey: ['payments', 'application', applicationId],
    queryFn: () => paymentsApi.getByApplication(applicationId),
    select: (response) => response.data as Payment[],
    enabled: !!applicationId,
  });
}

export function useCreatePayment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreatePaymentPayload) => paymentsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] });
    },
  });
}

export function useUploadPaymentReceipt() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ paymentId, receiptFile, transactionId, amount }: { paymentId: string; receiptFile: File; transactionId?: string; amount?: string }) =>
      paymentsApi.uploadReceipt(paymentId, receiptFile, transactionId, amount),
    onSuccess: (_, { paymentId }) => {
      queryClient.invalidateQueries({ queryKey: ['payment', paymentId] });
    },
  });
}

export function useVerifyPayment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ paymentId, data }: { paymentId: string; data: VerifyPaymentPayload }) =>
      paymentsApi.verify(paymentId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] });
    },
  });
}