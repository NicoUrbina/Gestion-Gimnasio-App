import api from './api';
import type { ClassType, GymClass, Reservation } from '../types';

/**
 * Servicio para gestión de Tipos de Clase
 */
export const classTypeService = {
  /**
   * Obtener todos los tipos de clase
   */
  async getAll(): Promise<ClassType[]> {
    const response = await api.get('/classes/types/');
    if (response.data.results) return response.data.results;
    return response.data;
  },

  /**
   * Crear un nuevo tipo de clase (solo admin)
   */
  async create(data: Partial<ClassType>): Promise<ClassType> {
    const response = await api.post('/classes/types/', data);
    return response.data;
  },

  /**
   * Actualizar un tipo de clase (solo admin)
   */
  async update(id: number, data: Partial<ClassType>): Promise<ClassType> {
    const response = await api.patch(`/classes/types/${id}/`, data);
    return response.data;
  },
};

/**
 * Servicio para gestión de Clases
 */
export const gymClassService = {
  /**
   * Obtener clases con filtros opcionales
   */
  async getAll(filters?: {
    date_from?: string;
    date_to?: string;
    class_type?: number;
    instructor?: number;
  }): Promise<GymClass[]> {
    const response = await api.get('/classes/', { params: filters });
    if (response.data.results) return response.data.results;
    return response.data;
  },

  /**
   * Obtener una clase específica
   */
  async getById(id: number): Promise<GymClass> {
    const response = await api.get(`/classes/${id}/`);
    return response.data;
  },

  /**
   * Crear una nueva clase (solo staff)
   */
  async create(data: Partial<GymClass>): Promise<GymClass> {
    const response = await api.post('/classes/', data);
    return response.data;
  },

  /**
   * Actualizar una clase (solo staff)
   */
  async update(id: number, data: Partial<GymClass>): Promise<GymClass> {
    const response = await api.put(`/classes/${id}/`, data);
    return response.data;
  },

  /**
   * Cancelar una clase (solo staff)
   */
  async cancel(id: number, reason: string): Promise<{ message: string }> {
    const response = await api.post(`/classes/${id}/cancel/`, { reason });
    return response.data;
  },

  /**
   * Obtener reservas de una clase
   */
  async getReservations(id: number): Promise<Reservation[]> {
    const response = await api.get(`/classes/${id}/reservations/`);
    return response.data;
  },
};

/**
 * Servicio para gestión de Reservas
 */
export const reservationService = {
  /**
   * Obtener mis reservas
   */
  async getMyReservations(): Promise<Reservation[]> {
    const response = await api.get('/classes/reservations/');
    if (response.data.results) return response.data.results;
    return response.data;
  },

  /**
   * Crear una nueva reserva
   */
  async create(gymClassId: number): Promise<Reservation> {
    const response = await api.post('/classes/reservations/', {
      gym_class: gymClassId,
      // No enviamos member - el backend lo asigna automáticamente desde el usuario autenticado
    });
    return response.data;
  },

  /**
   * Cancelar una reserva
   */
  async cancel(id: number): Promise<{ message: string }> {
    const response = await api.post(`/classes/reservations/${id}/cancel/`);
    return response.data;
  },

  /**
   * Marcar asistencia (solo staff)
   */
  async markAttended(id: number): Promise<{ message: string }> {
    const response = await api.post(`/classes/reservations/${id}/attend/`);
    return response.data;
  },
};
