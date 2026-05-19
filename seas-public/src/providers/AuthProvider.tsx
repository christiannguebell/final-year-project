import { useState, type ReactNode } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import type { User } from '../types/api';
import { STORAGE_KEYS } from '../config/constants';
import { AuthContext, type AuthContextType } from './AuthContext';

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const queryClient = useQueryClient();
  const [user, setUser] = useState<User | null>(() => {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    const userStr = localStorage.getItem(STORAGE_KEYS.USER);
    if (token && userStr) {
      try {
        return JSON.parse(userStr) as User;
      } catch {
        localStorage.removeItem(STORAGE_KEYS.TOKEN);
        localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.USER);
        return null;
      }
    }
    return null;
  });
  const isLoading = false;

  const checkAuth = () => {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    const userStr = localStorage.getItem(STORAGE_KEYS.USER);
    if (token && userStr) {
      try {
        setUser(JSON.parse(userStr) as User);
      } catch {
        localStorage.removeItem(STORAGE_KEYS.TOKEN);
        localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.USER);
        setUser(null);
      }
    } else {
      setUser(null);
    }
  };

  const login = (userData: User, token: string, refreshToken: string) => {
    localStorage.setItem(STORAGE_KEYS.TOKEN, token);
    localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
    setUser(null);
    queryClient.clear();
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    setUser,
    login,
    logout,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthProvider;
