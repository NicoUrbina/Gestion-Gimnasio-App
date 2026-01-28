import {
  LayoutDashboard,
  Users,
  CreditCard,
  DollarSign,
  Calendar,
  Dumbbell,
  TrendingUp,
  Settings,
  LucideIcon,
} from 'lucide-react';

/**
 * Tipo de rol de usuario
 */
export type UserRole = 'admin' | 'staff' | 'trainer' | 'member';

/**
 * Item de navegación con permisos basados en roles
 */
export interface NavigationItem {
  name: string;
  href: string;
  icon: LucideIcon;
  allowedRoles: UserRole[];
}

/**
 * Configuración de navegación con permisos por rol
 */
const navigationItems: NavigationItem[] = [
  // Dashboard - Todos los roles
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
    allowedRoles: ['admin', 'staff', 'trainer', 'member']
  },
  
  // Miembros - Solo admin y staff
  {
    name: 'Miembros',
    href: '/members',
    icon: Users,
    allowedRoles: ['admin', 'staff']
  },
  
  // Membresías - Admin y staff
  {
    name: 'Membresías',
    href: '/memberships',
    icon: CreditCard,
    allowedRoles: ['admin', 'staff']
  },
  
  // Pagos - Admin y staff
  {
    name: 'Pagos',
    href: '/payments',
    icon: DollarSign,
    allowedRoles: ['admin', 'staff']
  },
  
  // Mis Pagos - Solo members
  {
    name: 'Mis Pagos',
    href: '/payments/my-payments',
    icon: DollarSign,
    allowedRoles: ['member']
  },
  
  // Clases - Todos
  {
    name: 'Clases',
    href: '/classes',
    icon: Calendar,
    allowedRoles: ['admin', 'staff', 'trainer', 'member']
  },
  
  // Entrenadores - Solo admin
  {
    name: 'Entrenadores',
    href: '/staff',
    icon: Dumbbell,
    allowedRoles: ['admin']
  },
  
  // Mi Progreso - Members y trainers
  {
    name: 'Mi Progreso',
    href: '/progress',
    icon: TrendingUp,
    allowedRoles: ['member', 'trainer']
  },
  
  // Configuración - Todos
  {
    name: 'Configuración',
    href: '/settings',
    icon: Settings,
    allowedRoles: ['admin', 'staff', 'trainer', 'member']
  },
];

/**
 * Filtra los items de navegación según el rol del usuario
 * @param role - Rol del usuario actual
 * @returns Array de items de navegación permitidos para el rol
 */
export function getNavigationForRole(role: string | null): NavigationItem[] {
  if (!role) return [];
  
  return navigationItems.filter(item => 
    item.allowedRoles.includes(role.toLowerCase() as UserRole)
  );
}

/**
 * Verifica si un usuario tiene acceso a una ruta específica
 * @param role - Rol del usuario
 * @param path - Ruta a verificar
 * @returns true si el usuario tiene acceso
 */
export function hasAccessToRoute(role: string | null, path: string): boolean {
  if (!role) return false;
  
  const allowedItems = getNavigationForRole(role);
  return allowedItems.some(item => path.startsWith(item.href));
}

