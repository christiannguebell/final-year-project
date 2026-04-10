import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { paymentsApi, type CreatePaymentIntentPayload } from '../api/modules/payments';
import type { Payment } from '../types/entities';

export function usePayments() {
  return useQuery({
    queryKey: ['payments'],
    queryFn: () => paymentsApi.list(),
    select: (response) => response.data?.data as { items: Payment[]; pagination: any },
  });
}

export function usePaymentById(id: string) {
  return useQuery({
    queryKey: ['payment', id],
    queryFn: () => paymentsApi.getById(id),
    select: (response) => response.data?.data as Payment,
    enabled: !!id,
  });
}

export function useCreatePaymentIntent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreatePaymentIntentPayload) => paymentsApi.createIntent(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      return response.data?.data as Payment;
    },
  });
}

export function useConfirmPayment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ paymentId, paymentMethodId }: { paymentId: string; paymentMethodId: string }) =>
      paymentsApi.confirm(paymentId, paymentMethodId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] });
    },
  });
}