import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authApi } from '../api';
import type { LoginRequest, RegisterRequest, ChangePasswordRequest } from '../types/api';
import { STORAGE_KEYS } from '../config/constants';
import type { User, ApiResponse, LoginResponse } from '../types/api';
import { useAuth } from '../providers';

const TOKEN_KEYS = STORAGE_KEYS;

export function useLogin() {
  const { login } = useAuth();
  return useMutation({
    mutationFn: (data: LoginRequest) => authApi.login(data),
    onSuccess: (response: ApiResponse<LoginResponse>) => {
      if (response.data) {
        const { tokens, user } = response.data;
        login(user, tokens.accessToken, tokens.refreshToken);
      }
    },
  });
}

export function useRegister() {
  return useMutation({
    mutationFn: (data: RegisterRequest) => authApi.register(data),
  });
}

export function useVerifyOtp() {
  const { login } = useAuth();
  return useMutation({
    mutationFn: ({ email, otp }: { email: string; otp: string }) => authApi.verifyOtp(email, otp),
    onSuccess: (response: ApiResponse<LoginResponse>) => {
      if (response.data) {
        const { tokens, user } = response.data;
        login(user, tokens.accessToken, tokens.refreshToken);
      }
    },
  });
}

export function useChangePassword() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ChangePasswordRequest) => authApi.changePassword(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
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