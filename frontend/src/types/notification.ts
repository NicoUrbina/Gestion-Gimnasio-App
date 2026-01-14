// Notification types matching backend
export interface Notification {
  id: number;
  user: number;
  user_name: string;
  title: string;
  message: string;
  notification_type: 'info' | 'success' | 'warning' | 'error';
  is_read: boolean;
  read_at: string | null;
  link: string;
  created_at: string;
  time_since: string;
}

export interface NotificationPreference {
  email_enabled: boolean;
  whatsapp_enabled: boolean;
  renewal_reminders: boolean;
  class_reminders: boolean;
  promotional: boolean;
}
