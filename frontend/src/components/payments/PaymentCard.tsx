import { LucideIcon } from 'lucide-react';

interface PaymentCardProps {
  title: string;
  amount: number | string;
  count?: number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export default function PaymentCard({
  title,
  amount,
  count,
  icon: Icon,
  trend,
}: PaymentCardProps) {
  const formatAmount = (value: number | string) => {
    const num = typeof value === 'string' ? parseFloat(value) : value;
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'USD',
    }).format(num);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-slate-500 font-medium">{title}</p>
          <p className="text-3xl font-bold text-slate-900 mt-2">
            {formatAmount(amount)}
          </p>
          {count !== undefined && (
            <p className="text-sm text-slate-500 mt-1">{count} pagos</p>
          )}
          {trend && (
            <div className="flex items-center gap-1 mt-2">
              <span
                className={`text-xs font-medium ${
                  trend.isPositive ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {trend.isPositive ? '+' : ''}
                {trend.value}%
              </span>
              <span className="text-xs text-slate-500">vs mes anterior</span>
            </div>
          )}
        </div>
        <div className="p-3 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-xl">
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );
}
