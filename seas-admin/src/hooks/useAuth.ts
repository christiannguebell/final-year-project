import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authApi } from '../api';
import type { LoginRequest, User } from '../types/api';
import { STORAGE_KEYS } from '../config/constants';

const TOKEN_KEYS = STORAGE_KEYS;

export function useLogin() {
  return useMutation({
    mutationFn: (data: LoginRequest) => authApi.login(data),
    onSuccess: (response) => {
      if (response.data?.data) {
        const { tokens, user } = response.data.data;
        localStorage.setItem(TOKEN_KEYS.TOKEN, tokens.accessToken);
        localStorage.setItem(TOKEN_KEYS.REFRESH_TOKEN, tokens.refreshToken);
        localStorage.setItem(TOKEN_KEYS.USER, JSON.stringify(user));
      }
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
  const queryClient = useQueryClient();
  return {
    mutate: () => {
      localStorage.removeItem(TOKEN_KEYS.TOKEN);
      localStorage.removeItem(TOKEN_KEYS.REFRESH_TOKEN);
      localStorage.removeItem(TOKEN_KEYS.USER);
      queryClient.clear();
      window.location.href = '/login';
    },
  };
}

export function useIsAuthenticated() {
  return !!localStorage.getItem(TOKEN_KEYS.TOKEN);
}

export function useCurrentUser(): User | null {
  const userStr = localStorage.getItem(TOKEN_KEYS.USER);
  if (!userStr) return null;
  try {
    return JSON.parse(userStr) as User;
  } catch {
    return null;
  }
}