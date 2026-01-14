import api from './api';
import type { Notification, NotificationPreference } from '../types/notification';

/**
 * Notification Service
 * API calls for notifications management
 */
export const notificationService = {
  /**
   * Get all notifications for current user
   */
  getAll: async (): Promise<Notification[]> => {
    const response = await api.get('/notifications/');
    return response.data;
  },

  /**
   * Get unread count (for badge)
   */
  getUnreadCount: async (): Promise<number> => {
    const response = await api.get('/notifications/unread_count/');
    return response.data.count;
  },

  /**
   * Get recent notifications (last 5 for dropdown)
   */
  getRecent: async (): Promise<Notification[]> => {
    const response = await api.get('/notifications/recent/');
    return response.data;
  },

  /**
   * Mark notification as read
   */
  markRead: async (id: number): Promise<Notification> => {
    const response = await api.post(`/notifications/${id}/mark_read/`);
    return response.data;
  },

  /**
   * Mark all notifications as read
   */
  markAllRead: async (): Promise<{ updated: number; message: string }> => {
    const response = await api.post('/notifications/mark_all_read/');
    return response.data;
  },

  /**
   * Get notification preferences
   */
  getPreferences: async (): Promise<NotificationPreference> => {
    const response = await api.get('/notifications/preferences/');
    return response.data;
  },

  /**
   * Update notification preferences
   */
  updatePreferences: async (preferences: Partial<NotificationPreference>): Promise<NotificationPreference> => {
    const response = await api.patch('/notifications/preferences/', preferences);
    return response.data;
  },
};
