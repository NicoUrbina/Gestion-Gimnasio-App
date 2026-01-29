import type { AuditAction } from '../../../types/audit';
import {
  Plus,
  Edit,
  Trash2,
  Check,
  X,
  LogIn,
  LogOut,
  AlertTriangle,
  Snowflake,
  Sun,
  Ban,
  Download,
  Eye,
} from 'lucide-react';

interface ActionBadgeProps {
  action: AuditAction;
  size?: 'sm' | 'md' | 'lg';
}

const ACTION_CONFIG: Record<
  AuditAction,
  { color: string; bgColor: string; icon: any; label: string }
> = {
  CREATE: {
    color: 'text-green-400',
    bgColor: 'bg-green-500/10 border-green-500/20',
    icon: Plus,
    label: 'Crear',
  },
  UPDATE: {
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/10 border-blue-500/20',
    icon: Edit,
    label: 'Actualizar',
  },
  DELETE: {
    color: 'text-red-400',
    bgColor: 'bg-red-500/10 border-red-500/20',
    icon: Trash2,
    label: 'Eliminar',
  },
  APPROVE: {
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/10 border-purple-500/20',
    icon: Check,
    label: 'Aprobar',
  },
  REJECT: {
    color: 'text-orange-400',
    bgColor: 'bg-orange-500/10 border-orange-500/20',
    icon: X,
    label: 'Rechazar',
  },
  LOGIN: {
    color: 'text-cyan-400',
    bgColor: 'bg-cyan-500/10 border-cyan-500/20',
    icon: LogIn,
    label: 'Login',
  },
  LOGOUT: {
    color: 'text-gray-400',
    bgColor: 'bg-gray-500/10 border-gray-500/20',
    icon: LogOut,
    label: 'Logout',
  },
  FAILED_LOGIN: {
    color: 'text-red-400',
    bgColor: 'bg-red-500/10 border-red-500/20',
    icon: AlertTriangle,
    label: 'Login Fallido',
  },
  ACCESS: {
    color: 'text-teal-400',
    bgColor: 'bg-teal-500/10 border-teal-500/20',
    icon: Eye,
    label: 'Acceso',
  },
  FREEZE: {
    color: 'text-blue-300',
    bgColor: 'bg-blue-400/10 border-blue-400/20',
    icon: Snowflake,
    label: 'Congelar',
  },
  UNFREEZE: {
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-500/10 border-yellow-500/20',
    icon: Sun,
    label: 'Descongelar',
  },
  CANCEL: {
    color: 'text-gray-400',
    bgColor: 'bg-gray-500/10 border-gray-500/20',
    icon: Ban,
    label: 'Cancelar',
  },
  EXPORT: {
    color: 'text-indigo-400',
    bgColor: 'bg-indigo-500/10 border-indigo-500/20',
    icon: Download,
    label: 'Exportar',
  },
  VIEW: {
    color: 'text-gray-400',
    bgColor: 'bg-gray-500/10 border-gray-500/20',
    icon: Eye,
    label: 'Visualizar',
  },
};

export default function ActionBadge({ action, size = 'md' }: ActionBadgeProps) {
  const config = ACTION_CONFIG[action];
  const Icon = config.icon;

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs gap-1',
    md: 'px-3 py-1.5 text-sm gap-1.5',
    lg: 'px-4 py-2 text-base gap-2',
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  return (
    <span
      className={`inline-flex items-center ${sizeClasses[size]} ${config.bgColor} border rounded-lg font-medium ${config.color}`}
    >
      <Icon className={iconSizes[size]} />
      <span>{config.label}</span>
    </span>
  );
}
