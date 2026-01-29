import api from './api';
import type {
  AuditLog,
  AuditLogFilters,
  AuditStats,
  UserSession,
  PaginatedResponse,
} from '../types/audit';

/**
 * Audit Service
 * API calls for audit logs and session management
 */
export const auditService = {
  /**
   * Get all audit logs with optional filters
   */
  getLogs: async (
    filters?: AuditLogFilters
  ): Promise<PaginatedResponse<AuditLog>> => {
    const params = new URLSearchParams();

    if (filters?.user) params.append('user', filters.user.toString());
    if (filters?.action) params.append('action', filters.action);
    if (filters?.model) params.append('model', filters.model);
    if (filters?.start_date) params.append('start_date', filters.start_date);
    if (filters?.end_date) params.append('end_date', filters.end_date);
    if (filters?.success !== undefined)
      params.append('success', filters.success.toString());
    if (filters?.object_id) params.append('object_id', filters.object_id.toString());
    if (filters?.page) params.append('page', filters.page.toString());

    const response = await api.get(`/audit/logs/?${params.toString()}`);
    return response.data;
  },

  /**
   * Get audit log by ID
   */
  getLogById: async (id: number): Promise<AuditLog> => {
    const response = await api.get(`/audit/logs/${id}/`);
    return response.data;
  },

  /**
   * Get audit statistics for dashboard
   */
  getStats: async (): Promise<AuditStats> => {
    const response = await api.get('/audit/logs/stats/');
    return response.data;
  },

  /**
   * Export audit logs to Excel
   */
  exportLogs: async (filters?: AuditLogFilters): Promise<Blob> => {
    const params = new URLSearchParams();

    if (filters?.user) params.append('user', filters.user.toString());
    if (filters?.action) params.append('action', filters.action);
    if (filters?.model) params.append('model', filters.model);
    if (filters?.start_date) params.append('start_date', filters.start_date);
    if (filters?.end_date) params.append('end_date', filters.end_date);
    if (filters?.success !== undefined)
      params.append('success', filters.success.toString());

    const response = await api.get(`/audit/logs/export/?${params.toString()}`, {
      responseType: 'blob',
    });
    return response.data;
  },

  /**
   * Get all user sessions
   */
  getSessions: async (filters?: {
    user?: number;
    active?: boolean;
  }): Promise<PaginatedResponse<UserSession>> => {
    const params = new URLSearchParams();

    if (filters?.user) params.append('user', filters.user.toString());
    if (filters?.active !== undefined)
      params.append('active', filters.active.toString());

    const response = await api.get(`/audit/sessions/?${params.toString()}`);
    return response.data;
  },

  /**
   * Get only active sessions
   */
  getActiveSessions: async (): Promise<UserSession[]> => {
    const response = await api.get('/audit/sessions/active/');
    return response.data;
  },

  /**
   * Terminate a session (admin only)
   */
  terminateSession: async (id: number): Promise<{ detail: string }> => {
    const response = await api.post(`/audit/sessions/${id}/terminate/`);
    return response.data;
  },
};
