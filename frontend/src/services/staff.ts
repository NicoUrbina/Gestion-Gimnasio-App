import api from './api';
import type { Staff } from '../types';

/**
 * Servicio para gestión de Personal (Staff/Trainers)
 */
export const staffService = {
    /**
     * Obtener todo el personal con filtros opcionales
     */
    async getAll(filters?: {
        staff_type?: string;
        is_instructor?: boolean;
        search?: string;
    }): Promise<Staff[]> {
        const response = await api.get('/staff/', { params: filters });
        // Manejar paginación de DRF si existe
        if (response.data.results) {
            return response.data.results;
        }
        return response.data;
    },

    /**
     * Obtener un miembro del staff específico
     */
    async getById(id: number): Promise<Staff> {
        const response = await api.get(`/staff/${id}/`);
        return response.data;
    },

    /**
     * Eliminar un miembro del staff
     */
    async delete(id: number): Promise<void> {
        await api.delete(`/staff/${id}/`);
    }
};
