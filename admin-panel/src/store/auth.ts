import { create } from 'zustand';
import type { User } from '../types/index';

interface AuthStore {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  error: string | null;
  
  setUser: (user: User | null) => void;
  setTokens: (accessToken: string, refreshToken: string) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  logout: () => void;
  isAuthenticated: () => boolean;
}

const initializeAuth = () => {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('auth');
    return stored ? JSON.parse(stored) : null;
  }
  return null;
};

export const useAuthStore = create<AuthStore>((set, get) => {
  const stored = initializeAuth();

  return {
    user: stored?.user || null,
    accessToken: stored?.accessToken || null,
    refreshToken: stored?.refreshToken || null,
    isLoading: false,
    error: null,

    setUser: (user) => {
      set({ user });
      const state = get();
      localStorage.setItem(
        'auth',
        JSON.stringify({
          user: state.user,
          accessToken: state.accessToken,
          refreshToken: state.refreshToken,
        })
      );
    },

    setTokens: (accessToken, refreshToken) => {
      set({ accessToken, refreshToken });
      const state = get();
      localStorage.setItem(
        'auth',
        JSON.stringify({
          user: state.user,
          accessToken,
          refreshToken,
        })
      );
    },

    setLoading: (isLoading) => set({ isLoading }),

    setError: (error) => set({ error }),

    logout: () => {
      set({ user: null, accessToken: null, refreshToken: null });
      localStorage.removeItem('auth');
    },

    isAuthenticated: () => {
      const state = get();
      return !!state.accessToken && !!state.user;
    },
  };
});
