// Types para el módulo de configuración del administrador

// ========== Usuarios ==========
export interface SystemUser {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  full_name: string;
  phone?: string;
  photo?: string;
  role: Role | null;
  role_name?: string;
  is_active: boolean;
  is_staff: boolean;
  date_joined: string;
  last_login?: string;
}

export interface CreateUserData {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  phone?: string;
  role_id?: number;
  is_active?: boolean;
}

export interface UpdateUserData {
  email?: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  role_id?: number;
  is_active?: boolean;
}

// ========== Roles y Permisos ==========
export interface Role {
  id: number;
  name: string;
  description?: string;
  permissions: RolePermissions;
  created_at?: string;
  updated_at?: string;
}

export interface RolePermissions {
  // Permisos de módulos
  dashboard?: boolean;
  members?: PermissionLevel;
  memberships?: PermissionLevel;
  classes?: PermissionLevel;
  payments?: PermissionLevel;
  staff?: PermissionLevel;
  reports?: PermissionLevel;
  settings?: PermissionLevel;
  // Permisos específicos
  can_approve_payments?: boolean;
  can_export_data?: boolean;
  can_manage_users?: boolean;
  can_view_analytics?: boolean;
  [key: string]: boolean | PermissionLevel | undefined;
}

export type PermissionLevel = 'none' | 'read' | 'write' | 'admin';

// ========== Configuración del Gimnasio ==========
export interface GymSettings {
  name: string;
  logo?: string;
  address: string;
  phone: string;
  email: string;
  website?: string;
  description?: string;
  social_media?: SocialMediaLinks;
  operating_hours: OperatingHours;
}

export interface SocialMediaLinks {
  facebook?: string;
  instagram?: string;
  twitter?: string;
  youtube?: string;
  tiktok?: string;
}

export interface OperatingHours {
  monday: DayHours;
  tuesday: DayHours;
  wednesday: DayHours;
  thursday: DayHours;
  friday: DayHours;
  saturday: DayHours;
  sunday: DayHours;
}

export interface DayHours {
  is_open: boolean;
  open_time?: string;
  close_time?: string;
}

// ========== Configuración de Notificaciones ==========
export interface NotificationSettings {
  email_enabled: boolean;
  whatsapp_enabled: boolean;
  sms_enabled: boolean;
  
  // Recordatorios
  membership_expiry_days: number[];
  class_reminder_hours: number;
  payment_reminder_days: number;
  
  // Templates
  templates: NotificationTemplate[];
}

export interface NotificationTemplate {
  id: number;
  name: string;
  type: 'welcome' | 'renewal_reminder' | 'class_reminder' | 'payment_reminder' | 'membership_expired' | 'custom';
  subject: string;
  body: string;
  channels: ('email' | 'whatsapp' | 'sms')[];
  is_active: boolean;
}

// ========== Configuración de Pagos ==========
export interface PaymentSettings {
  currency: string;
  currency_symbol: string;
  tax_rate: number;
  payment_methods: PaymentMethodConfig[];
  invoice_prefix: string;
  invoice_footer?: string;
  require_approval: boolean;
}

export interface PaymentMethodConfig {
  id: string;
  name: string;
  type: 'cash' | 'card' | 'transfer' | 'mobile';
  is_enabled: boolean;
  instructions?: string;
}

// ========== Configuración del Sistema ==========
export interface SystemSettings {
  timezone: string;
  date_format: string;
  time_format: '12h' | '24h';
  language: string;
  
  // Seguridad
  session_timeout_minutes: number;
  max_login_attempts: number;
  password_min_length: number;
  require_strong_password: boolean;
  
  // Membresías
  freeze_days_per_year: number;
  grace_period_days: number;
  auto_expire_memberships: boolean;
  
  // Clases
  cancellation_hours_limit: number;
  waitlist_enabled: boolean;
  max_reservations_per_member: number;
}

// ========== Auditoría ==========
export interface AuditLog {
  id: number;
  user: {
    id: number;
    email: string;
    full_name: string;
  };
  action: string;
  entity_type: string;
  entity_id?: number;
  details?: Record<string, unknown>;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
}

export interface ActiveSession {
  id: string;
  user_id: number;
  ip_address: string;
  user_agent: string;
  last_activity: string;
  created_at: string;
  is_current: boolean;
}

// ========== Estadísticas de Configuración ==========
export interface SettingsStats {
  total_users: number;
  active_users: number;
  inactive_users: number;
  users_by_role: {
    role: string;
    count: number;
  }[];
  pending_payments: number;
  active_memberships: number;
  system_health: 'healthy' | 'warning' | 'critical';
}

// ========== Responses ==========
export interface UsersListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: SystemUser[];
}

export interface RolesListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Role[];
}
