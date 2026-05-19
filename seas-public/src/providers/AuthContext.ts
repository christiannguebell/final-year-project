import { createContext, type Dispatch, type SetStateAction } from 'react';
import type { User } from '../types/api';

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: Dispatch<SetStateAction<User | null>>;
  login: (user: User, token: string, refreshToken: string) => void;
  logout: () => void;
  checkAuth: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);
