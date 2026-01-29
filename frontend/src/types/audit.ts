/**
 * Audit and Logging Types
 * Types for audit logs, user sessions, and statistics
 */

export interface AuditLog {
  id: number;
  user: number | null;
  user_name: string;
  action: AuditAction;
  action_display: string;
  model_name: string;
  object_id: number | null;
  object_repr: string;
  changes: Record<string, { old: string; new: string }> | null;
  changes_summary: string;
  ip_address: string | null;
  user_agent: string;
  timestamp: string;
  extra_data: Record<string, any> | null;
  success: boolean;
  error_message: string;
}

export type AuditAction =
  | 'CREATE'
  | 'UPDATE'
  | 'DELETE'
  | 'APPROVE'
  | 'REJECT'
  | 'LOGIN'
  | 'LOGOUT'
  | 'FAILED_LOGIN'
  | 'ACCESS'
  | 'FREEZE'
  | 'UNFREEZE'
  | 'CANCEL'
  | 'EXPORT'
  | 'VIEW';

export interface AuditLogFilters {
  user?: number;
  action?: AuditAction;
  model?: string;
  start_date?: string;
  end_date?: string;
  success?: boolean;
  object_id?: number;
  page?: number;
}

export interface AuditStats {
  total_today: number;
  total_week: number;
  total_month: number;
  actions_by_type: Record<string, number>;
  top_users: Array<{
    user__first_name: string;
    user__last_name: string;
    user__email: string;
    count: number;
  }>;
  recent_critical: AuditLog[];
  failed_logins_today: number;
  active_sessions: number;
}

export interface UserSession {
  id: number;
  user: number;
  user_name: string;
  session_key: string;
  ip_address: string;
  user_agent: string;
  login_time: string;
  logout_time: string | null;
  is_active: boolean;
  location: string;
  duration_str: string;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}
