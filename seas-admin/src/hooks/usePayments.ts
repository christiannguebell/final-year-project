import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { paymentsApi, type ListPaymentsParams, type VerifyPaymentPayload } from '../api/modules/payments';


export function usePayments(params?: ListPaymentsParams) {
  return useQuery({
    queryKey: ['payments', params],
    queryFn: () => paymentsApi.list(params),
  });
}

export function usePaymentById(id: string) {
  return useQuery({
    queryKey: ['payment', id],
    queryFn: () => paymentsApi.getById(id),
    enabled: !!id,
  });
}

export function useVerifyPayment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: VerifyPaymentPayload }) => paymentsApi.verify(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] });
    },
  });
}

export function useFlagPayment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, notes }: { id: string; notes?: string }) => paymentsApi.flag(id, notes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] });
    },
  });
}
