import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { paymentsApi, type CreatePaymentPayload, type VerifyPaymentPayload } from '../api/modules/payments';
import { applicationsApi } from '../api/modules/applications';
import type { Payment, Application } from '../types/entities';

async function fetchAllMyPayments(): Promise<Payment[]> {
  const appsResponse = await applicationsApi.getMine();
  const payload = appsResponse.data;
  const applications: Application[] = Array.isArray(payload)
    ? payload
    : (payload as { items?: Application[] } | null)?.items ?? [];

  const paymentGroups = await Promise.all(
    applications.map(async (app) => {
      const response = await paymentsApi.getByApplication(app.id);
      return (response.data ?? []) as Payment[];
    })
  );

  return paymentGroups.flat();
}

export function usePayments() {
  return useQuery({
    queryKey: ['payments', 'mine'],
    queryFn: fetchAllMyPayments,
  });
}

export function usePaymentById(id: string) {
  return useQuery({
    queryKey: ['payment', id],
    queryFn: async () => {
      const payments = await fetchAllMyPayments();
      const payment = payments.find((p) => p.id === id);
      if (!payment) throw new Error('Payment not found');
      return payment;
    },
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
      queryClient.invalidateQueries({ queryKey: ['payments'] });
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
