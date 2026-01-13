/**
 * Servicios de Autenticación
 */
import api from './api';
import type { LoginRequest, LoginResponse, User } from '../types/auth';

export const authService = {
    /**
     * Login con email y contraseña
     */
    login: async (credentials: LoginRequest): Promise<LoginResponse> => {
        const response = await api.post<LoginResponse>('/auth/login/', credentials);
        return response.data;
    },

    /**
     * Refresh del access token
     */
    refreshToken: async (refreshToken: string): Promise<{ access: string }> => {
        const response = await api.post<{ access: string }>('/auth/refresh/', {
            refresh: refreshToken,
        });
        return response.data;
    },

    /**
     * Obtener datos del usuario actual
     */
    getCurrentUser: async (): Promise<User> => {
        const response = await api.get<User>('/users/me/');
        return response.data;
    },

    /**
     * Logout (limpiar tokens del cliente)
     */
    logout: () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
    },
};
