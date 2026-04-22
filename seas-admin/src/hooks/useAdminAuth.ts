import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { adminAuthApi } from '../api/modules/adminAuth';
import type { LoginRequest, AuthTokens } from '../types/api';

export function useAdminLogin() {
  return useMutation({
    mutationFn: (data: LoginRequest) => adminAuthApi.login(data),
  });
}

export function useVerifyOtp() {
  return useMutation({
    mutationFn: (data: { userId: string; otp: string }) => adminAuthApi.verifyOtp(data),
  });
}

export function useSetupPassword() {
  return useMutation({
    mutationFn: (data: { userId: string; password: string }) => adminAuthApi.setupPassword(data),
  });
}

export function useRefreshAdminToken() {
  return useMutation({
    mutationFn: (refreshToken: string) => adminAuthApi.refreshToken(refreshToken),
  });
}

export function useResendOtp() {
  return useMutation({
    mutationFn: (email: string) => adminAuthApi.resendOtp(email),
  });
}

export function useCreateAdmin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { email: string; role: string }) => adminAuthApi.createAdmin(data.email, data.role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admins'] });
    },
  });
}

export function useAdmins() {
  return useQuery({
    queryKey: ['admins'],
    queryFn: () => adminAuthApi.getAdmins(),
  });
}

export function useDeleteAdmin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminAuthApi.deleteAdmin(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admins'] });
    },
  });
}