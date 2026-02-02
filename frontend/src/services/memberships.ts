import api from './api';
import type { MembershipPlan, Membership } from '../types';

/**
 * Servicio para gestión de Planes de Membresía
 */
export const membershipPlanService = {
  /**
   * Obtener todos los planes de membresía
   */
  async getAll(): Promise<MembershipPlan[]> {
    const response = await api.get('/memberships/plans/');
    // Handle DRF pagination
    if (response.data.results) {
      return response.data.results;
    }
    return response.data;
  },

  /**
   * Obtener un plan específico por ID
   */
  async getById(id: number): Promise<MembershipPlan> {
    const response = await api.get(`/memberships/plans/${id}/`);
    return response.data;
  },

  /**
   * Crear un nuevo plan de membresía (solo admin)
   */
  async create(data: Partial<MembershipPlan>): Promise<MembershipPlan> {
    const response = await api.post('/memberships/plans/', data);
    return response.data;
  },

  /**
   * Actualizar un plan existente (solo admin)
   */
  async update(id: number, data: Partial<MembershipPlan>): Promise<MembershipPlan> {
    const response = await api.put(`/memberships/plans/${id}/`, data);
    return response.data;
  },

  /**
   * Eliminar un plan de membresía (solo admin)
   */
  async delete(id: number): Promise<void> {
    await api.delete(`/memberships/plans/${id}/`);
  },
};

/**
 * Servicio para gestión de Membresías activas
 */
export const membershipService = {
  /**
   * Get all memberships with optional filters
   */
  getAll: async (filters?: {
    status?: 'active' | 'frozen' | 'expired' | 'cancelled';
    member?: number;
  }): Promise<Membership[]> => {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.member) params.append('member', filters.member.toString());

    const response = await api.get(`/memberships/?${params.toString()}`);
    // Handle DRF pagination
    if (response.data.results) {
      return response.data.results;
    }
    return response.data;
  },

  /**
   * Get my memberships (for logged-in member)
   */
  getMyMemberships: async (): Promise<Membership[]> => {
    // Obtener el usuario actual y luego sus membresías
    const userResponse = await api.get('/users/me/');
    const memberId = userResponse.data.member_profile;

    const response = await api.get(`/memberships/?member=${memberId}`);
    // Handle DRF pagination
    if (response.data.results) {
      return response.data.results;
    }
    return response.data;
  },

  /**
   * Obtener una membresía específica por ID
   */
  async getById(id: number): Promise<Membership> {
    const response = await api.get(`/memberships/${id}/`);
    return response.data;
  },

  /**
   * Asignar una nueva membresía a un miembro
   */
  async assign(data: {
    member: number;
    plan: number;
    start_date: string;
    notes?: string;
  }): Promise<Membership> {
    const response = await api.post('/memberships/', data);
    return response.data;
  },

  /**
   * Actualizar una membresía existente
   */
  async update(id: number, data: Partial<Membership>): Promise<Membership> {
    const response = await api.patch(`/memberships/${id}/`, data);
    return response.data;
  },

  /**
   * Congelar una membresía
   */
  async freeze(id: number, reason: string): Promise<{ message: string }> {
    const response = await api.post(`/memberships/${id}/freeze/`, { reason });
    return response.data;
  },

  /**
   * Descongelar una membresía
   */
  async unfreeze(id: number): Promise<{ message: string }> {
    const response = await api.post(`/memberships/${id}/unfreeze/`);
    return response.data;
  },
};
