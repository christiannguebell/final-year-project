import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '../types/api';
import { STORAGE_KEYS } from '../config/constants';

interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, token: string, refreshToken: string) => void;
  updateUser: (user: Partial<User>) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
      setAuth: (user, token, refreshToken) => {
        localStorage.setItem(STORAGE_KEYS.TOKEN, token);
        localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
        set({ user, token, refreshToken, isAuthenticated: true });
      },
      updateUser: (updates) =>
        set((state) => {
          const updatedUser = { ...state.user, ...updates } as User;
          localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updatedUser));
          return { user: updatedUser };
        }),
      logout: () => {
        localStorage.removeItem(STORAGE_KEYS.TOKEN);
        localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.USER);
        set({ user: null, token: null, refreshToken: null, isAuthenticated: false });
      },
    }),
    {
      name: 'seas-admin-auth',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export default useAuthStore;