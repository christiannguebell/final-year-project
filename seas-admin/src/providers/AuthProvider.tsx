import { useState, type ReactNode } from 'react';
import type { User } from '../types/api';
import { STORAGE_KEYS } from '../config/constants';
import { AuthContext, type AuthContextType } from './AuthContext';



interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const initialUser: User | null = (() => {
    try {
      const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
      const userStr = localStorage.getItem(STORAGE_KEYS.USER);
      if (!token || !userStr) return null;
      return JSON.parse(userStr) as User;
    } catch {
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER);
      return null;
    }
  })();

  const [user, setUser] = useState<User | null>(initialUser);
  const [isLoading] = useState(false);

  const login = (user: User, token: string, refreshToken: string) => {
    localStorage.setItem(STORAGE_KEYS.TOKEN, token);
    localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    setUser(user);
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    setUser,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}



export default AuthProvider;