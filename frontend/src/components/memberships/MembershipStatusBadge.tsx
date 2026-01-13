import { CheckCircle2, XCircle, Snowflake, Clock } from 'lucide-react';

type MembershipStatus = 'active' | 'frozen' | 'expired' | 'cancelled';

interface MembershipStatusBadgeProps {
  status: MembershipStatus;
  daysRemaining?: number;
}

export default function MembershipStatusBadge({ status, daysRemaining }: MembershipStatusBadgeProps) {
  const config = getStatusConfig(status, daysRemaining);

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${config.bg} ${config.color}`}
    >
      {config.icon}
      {config.label}
    </span>
  );
}

/**
 * Configuración de estilos y contenido por estado
 */
function getStatusConfig(status: MembershipStatus, daysRemaining?: number) {
  const configs = {
    active: {
      color: 'text-emerald-700',
      bg: 'bg-emerald-100',
      icon: <CheckCircle2 className="w-4 h-4" />,
      label: daysRemaining !== undefined && daysRemaining <= 7 
        ? `Activa (${daysRemaining}d)` 
        : 'Activa',
    },
    frozen: {
      color: 'text-blue-700',
      bg: 'bg-blue-100',
      icon: <Snowflake className="w-4 h-4" />,
      label: 'Congelada',
    },
    expired: {
      color: 'text-red-700',
      bg: 'bg-red-100',
      icon: <Clock className="w-4 h-4" />,
      label: 'Vencida',
    },
    cancelled: {
      color: 'text-slate-600',
      bg: 'bg-slate-100',
      icon: <XCircle className="w-4 h-4" />,
      label: 'Cancelada',
    },
  };

  return configs[status];
}
