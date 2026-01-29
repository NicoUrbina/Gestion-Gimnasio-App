import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../services/api';
import type { User, LoginCredentials, LoginResponse } from '../types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  login: (credentials: LoginCredentials) => Promise<boolean>;
  logout: () => void;
  checkAuth: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false, // Start as false - will be set by checkAuth if needed
      error: null,

      login: async (credentials) => {
        set({ isLoading: true, error: null });

        try {
          const response = await api.post<LoginResponse>('/auth/login/', credentials);
          const { access, refresh, user } = response.data;

          // Guardar tokens
          localStorage.setItem('access_token', access);
          localStorage.setItem('refresh_token', refresh);

          set({
            user,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });

          return true;
        } catch (error: any) {
          const message = error.response?.data?.detail || 'Error al iniciar sesión';
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: message,
          });
          return false;
        }
      },

      logout: () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        set({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        });
      },

      checkAuth: async () => {
        const token = localStorage.getItem('access_token');
        if (!token) {
          set({ isAuthenticated: false, user: null, isLoading: false });
          return;
        }

        // Get current state to check if already authenticated
        const currentState = get();

        // Only show loading if we're not already authenticated
        // This allows background validation after login without showing spinner
        if (!currentState.isAuthenticated) {
          set({ isLoading: true });
        }

        try {
          const response = await api.get('/users/me/');
          set({
            user: response.data,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          // Token inválido, limpiar
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
);
