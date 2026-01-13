import { CheckCircle2, Clock, XCircle, ListOrdered, UserCheck } from 'lucide-react';

type ReservationStatus = 'confirmed' | 'waitlist' | 'cancelled' | 'attended' | 'no_show';

interface ReservationStatusBadgeProps {
  status: ReservationStatus;
  waitlistPosition?: number | null;
}

export default function ReservationStatusBadge({ status, waitlistPosition }: ReservationStatusBadgeProps) {
  const config = getStatusConfig(status, waitlistPosition);

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
 * Configuración de estilos por estado
 */
function getStatusConfig(status: ReservationStatus, waitlistPosition?: number | null) {
  const configs = {
    confirmed: {
      color: 'text-emerald-700',
      bg: 'bg-emerald-100',
      icon: <CheckCircle2 className="w-4 h-4" />,
      label: 'Confirmada',
    },
    waitlist: {
      color: 'text-yellow-700',
      bg: 'bg-yellow-100',
      icon: <ListOrdered className="w-4 h-4" />,
      label: waitlistPosition ? `Lista de espera #${waitlistPosition}` : 'Lista de espera',
    },
    cancelled: {
      color: 'text-slate-600',
      bg: 'bg-slate-100',
      icon: <XCircle className="w-4 h-4" />,
      label: 'Cancelada',
    },
    attended: {
      color: 'text-blue-700',
      bg: 'bg-blue-100',
      icon: <UserCheck className="w-4 h-4" />,
      label: 'Asistió',
    },
    no_show: {
      color: 'text-red-700',
      bg: 'bg-red-100',
      icon: <Clock className="w-4 h-4" />,
      label: 'No asistió',
    },
  };

  return configs[status];
}
