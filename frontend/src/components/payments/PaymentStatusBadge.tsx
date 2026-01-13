import { CheckCircle, Clock, XCircle, RefreshCw } from 'lucide-react';
import type { PaymentStatus } from '../../types';

interface PaymentStatusBadgeProps {
  status: PaymentStatus;
}

export default function PaymentStatusBadge({ status }: PaymentStatusBadgeProps) {
  const config = {
    pending: {
      label: 'Pendiente',
      icon: Clock,
      className: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    },
    completed: {
      label: 'Pagado',
      icon: CheckCircle,
      className: 'bg-green-50 text-green-700 border-green-200',
    },
    cancelled: {
      label: 'Rechazado',
      icon: XCircle,
      className: 'bg-slate-50 text-slate-600 border-slate-200',
    },
    refunded: {
      label: 'Reembolsado',
      icon: RefreshCw,
      className: 'bg-orange-50 text-orange-700 border-orange-200',
    },
  };

  const { label, icon: Icon, className } = config[status];

  return (
    <span
      className={`
        inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium
        border ${className}
      `}
    >
      <Icon className="w-3.5 h-3.5" />
      {label}
    </span>
  );
}
