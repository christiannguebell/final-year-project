import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authApi } from '../api';
import type { LoginRequest, RegisterRequest, ChangePasswordRequest } from '../types/api';
import { STORAGE_KEYS } from '../config/constants';
import type { User } from '../types/api';
import { useAuth } from '../providers';

const TOKEN_KEYS = STORAGE_KEYS;

export function useLogin() {
  return useMutation({
    mutationFn: (data: LoginRequest) => authApi.login(data),
  });
}

export function useRegister() {
  return useMutation({
    mutationFn: (data: RegisterRequest) => authApi.register(data),
  });
}

export function useVerifyOtp() {
  return useMutation({
    mutationFn: ({ email, otp }: { email: string; otp: string }) => authApi.verifyOtp(email, otp),
  });
}

export function useChangePassword() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: ChangePasswordRequest) => {
      const result = await authApi.changePassword(data);
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      return result;
    },
  });
}

export function useProfile() {
  return useQuery({
    queryKey: ['profile'],
    queryFn: () => authApi.getProfile(),
    enabled: !!localStorage.getItem(TOKEN_KEYS.TOKEN),
  });
}

export function useLogout() {
  const { logout } = useAuth();
  return {
    mutate: () => {
      logout();
      window.location.href = '/login';
    },
  };
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: (data: { email: string }) => authApi.forgotPassword(data),
  });
}

export function useResetPassword() {
  return useMutation({
    mutationFn: (data: { token: string; newPassword: string }) => authApi.resetPassword(data),
  });
}

export function useIsAuthenticated() {
  const { isAuthenticated } = useAuth();
  return isAuthenticated;
}

export function useCurrentUser(): User | null {
  const { user } = useAuth();
  return user;
}