import api from './api';
import type {
  SystemUser,
  CreateUserData,
  UpdateUserData,
  Role,
  UsersListResponse,
  RolesListResponse,
  SettingsStats,
} from '../types/settings';

// ========== Usuarios ==========
export const usersService = {
  // Obtener lista de usuarios (admin/staff)
  getAll: async (params?: {
    page?: number;
    search?: string;
    role?: string;
    is_active?: boolean;
  }): Promise<UsersListResponse> => {
    const response = await api.get('/users/', { params });
    return response.data;
  },

  // Obtener usuario por ID
  getById: async (id: number): Promise<SystemUser> => {
    const response = await api.get(`/users/${id}/`);
    return response.data;
  },

  // Crear usuario
  create: async (data: CreateUserData): Promise<SystemUser> => {
    const response = await api.post('/users/', data);
    return response.data;
  },

  // Actualizar usuario
  update: async (id: number, data: UpdateUserData): Promise<SystemUser> => {
    const response = await api.patch(`/users/${id}/`, data);
    return response.data;
  },

  // Eliminar usuario
  delete: async (id: number): Promise<void> => {
    await api.delete(`/users/${id}/`);
  },

  // Activar/Desactivar usuario
  toggleActive: async (id: number, isActive: boolean): Promise<SystemUser> => {
    const response = await api.patch(`/users/${id}/`, { is_active: isActive });
    return response.data;
  },

  // Cambiar contraseña de usuario (admin)
  resetPassword: async (id: number, newPassword: string): Promise<void> => {
    await api.post(`/users/${id}/reset_password/`, { new_password: newPassword });
  },

  // Cambiar contraseña propia
  changePassword: async (currentPassword: string, newPassword: string): Promise<void> => {
    await api.post('/users/change_password/', {
      current_password: currentPassword,
      new_password: newPassword,
    });
  },
};

// ========== Roles ==========
export const rolesService = {
  // Obtener lista de roles
  getAll: async (): Promise<RolesListResponse> => {
    const response = await api.get('/roles/');
    return response.data;
  },

  // Obtener rol por ID
  getById: async (id: number): Promise<Role> => {
    const response = await api.get(`/roles/${id}/`);
    return response.data;
  },

  // Crear rol
  create: async (data: Partial<Role>): Promise<Role> => {
    const response = await api.post('/roles/', data);
    return response.data;
  },

  // Actualizar rol
  update: async (id: number, data: Partial<Role>): Promise<Role> => {
    const response = await api.patch(`/roles/${id}/`, data);
    return response.data;
  },

  // Eliminar rol
  delete: async (id: number): Promise<void> => {
    await api.delete(`/roles/${id}/`);
  },
};

// ========== Estadísticas ==========
export const settingsStatsService = {
  // Obtener estadísticas generales
  getStats: async (): Promise<SettingsStats> => {
    const response = await api.get('/users/dashboard_stats/');
    return response.data;
  },

  // Obtener conteo de usuarios por rol
  getUsersByRole: async (): Promise<{ role: string; count: number }[]> => {
    const response = await api.get('/users/stats/by_role/');
    return response.data;
  },
};

// ========== Notificaciones (Templates) ==========
export const notificationSettingsService = {
  // Obtener plantillas de notificación
  getTemplates: async () => {
    const response = await api.get('/notifications/templates/');
    return response.data;
  },

  // Actualizar plantilla
  updateTemplate: async (id: number, data: Record<string, unknown>) => {
    const response = await api.patch(`/notifications/templates/${id}/`, data);
    return response.data;
  },

  // Obtener preferencias de notificación
  getPreferences: async (userId: number) => {
    const response = await api.get(`/notifications/preferences/${userId}/`);
    return response.data;
  },

  // Actualizar preferencias de notificación
  updatePreferences: async (userId: number, data: Record<string, unknown>) => {
    const response = await api.patch(`/notifications/preferences/${userId}/`, data);
    return response.data;
  },
};

// ========== Exportar servicio completo ==========
const settingsService = {
  users: usersService,
  roles: rolesService,
  stats: settingsStatsService,
  notifications: notificationSettingsService,
};

export default settingsService;
