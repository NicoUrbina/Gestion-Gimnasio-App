// Tipos para autenticación
export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  full_name: string;
  role: string | null;
  phone?: string;
  photo?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthTokens {
  access: string;
  refresh: string;
}

export interface LoginResponse extends AuthTokens {
  user: User;
}

// Tipos para miembros
export interface Member {
  id: number;
  user: User;
  date_of_birth: string | null;
  gender: string;
  phone: string;
  address: string;
  emergency_contact_name: string;
  emergency_contact_phone: string;
  medical_notes: string;
  subscription_status: 'active' | 'inactive' | 'expired' | 'frozen';
  subscription_status_display: string;
  joined_date: string;
  last_access: string | null;
  is_active: boolean;
  days_inactive: number | null;
}

// Tipos para membresías
export interface MembershipPlan {
  id: number;
  name: string;
  description: string;
  price: string;
  duration_days: number;
  max_classes_per_month: number | null;
  includes_trainer: boolean;
  can_freeze: boolean;
  max_freeze_days: number;
  is_active: boolean;
}

export interface Membership {
  id: number;
  member: number;
  member_name: string;
  plan: number;
  plan_name: string;
  start_date: string;
  end_date: string;
  status: 'active' | 'frozen' | 'expired' | 'cancelled';
  status_display: string;
  days_remaining: number;
  is_expiring_soon: boolean;
}

// Tipos para clases
export interface ClassType {
  id: number;
  name: string;
  description: string;
  default_duration_minutes: number;
  default_capacity: number;
  color: string;
  icon: string;
}

export interface GymClass {
  id: number;
  class_type: number;
  class_type_name: string;
  instructor: number | null;
  instructor_name: string;
  title: string;
  description: string;
  start_datetime: string;
  end_datetime: string;
  capacity: number;
  location: string;
  available_spots: number;
  is_full: boolean;
  is_cancelled: boolean;
  color: string;
}

// Tipos para pagos
export interface Payment {
  id: number;
  member: number;
  member_name: string;
  amount: string;
  payment_method: string;
  payment_method_display: string;
  status: 'pending' | 'completed' | 'cancelled' | 'refunded';
  status_display: string;
  reference_number: string;
  payment_date: string;
}

// Tipos para estadísticas del dashboard
export interface DashboardStats {
  members: {
    total: number;
    active: number;
    inactive: number;
    expired: number;
    active_percentage: number;
  };
  payments: {
    month: { total: number; count: number };
    today: { total: number; count: number };
  };
  access: {
    today_count: number;
  };
}

// Tipos para métricas del atleta
export interface AthleteMetric {
  id: number;
  member: number;
  member_name: string;
  metric_type: number;
  metric_name: string;
  value: string;
  unit: string;
  recorded_date: string;
}

export interface PerformanceGoal {
  id: number;
  member: number;
  member_name: string;
  metric_type: number;
  metric_name: string;
  initial_value: string;
  target_value: string;
  current_value: string;
  start_date: string;
  target_date: string;
  status: 'active' | 'achieved' | 'failed' | 'abandoned';
  status_display: string;
  progress_percentage: number;
  days_remaining: number;
  is_on_track: boolean;
}

// Tipos para Clases y Reservas
export interface ClassType {
  id: number;
  name: string;
  description: string;
  default_duration_minutes: number;
  default_capacity: number;
  color: string;
  icon: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface GymClass {
  id: number;
  class_type: number;
  class_type_name: string;
  instructor: number | null;
  instructor_name: string;
  title: string;
  description: string;
  start_datetime: string;
  end_datetime: string;
  capacity: number;
  location: string;
  is_recurring: boolean;
  is_cancelled: boolean;
  cancellation_reason: string;
  available_spots: number;
  is_full: boolean;
  confirmed_reservations_count: number;
  waitlist_count: number;
  color: string;
  created_at: string;
  updated_at: string;
}

export interface Reservation {
  id: number;
  member: number;
  gym_class: number;
  class_title: string;
  reserved_at: string;
  status: 'confirmed' | 'waitlist' | 'cancelled' | 'attended' | 'no_show';
  waitlist_position: number | null;
  attended_at: string | null;
  cancelled_at: string | null;
  created_at: string;
}

// Payments
export type PaymentMethod = 'cash' | 'card' | 'transfer' | 'mobile' | 'other';
export type PaymentStatus = 'pending' | 'completed' | 'cancelled' | 'refunded';

export interface Payment {
  id: number;
  member: number;
  member_name: string;
  membership: number | null;
  amount: string;
  payment_method: PaymentMethod;
  payment_method_display: string;
  status: PaymentStatus;
  status_display: string;
  reference_number: string;
  description: string;
  notes: string;
  receipt_image?: string;
  rejection_reason?: string;
  approved_by?: number;
  approved_at?: string;
  payment_date: string;
  created_by: number | null;
  created_at: string;
  updated_at: string;
}

export interface Invoice {
  id: number;
  payment: number;
  payment_info: Payment;
  invoice_number: string;
  issued_date: string;
  subtotal: string;
  tax: string;
  total: string;
  pdf_file: string;
  created_at: string;
}

export interface PaymentStats {
  month: {
    total: number;
    count: number;
  };
  today: {
    total: number;
    count: number;
  };
}
