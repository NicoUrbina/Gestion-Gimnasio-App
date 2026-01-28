import { LucideIcon } from 'lucide-react';
import {
  ArrowUpRight,
  ArrowDownRight,
  AlertTriangle,
} from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  total?: number;
  icon: LucideIcon;
  color: string; // Tailwind gradient classes (e.g., "from-orange-500 to-orange-600")
  alert?: boolean;
  change?: number;
  changeType?: 'positive' | 'negative';
}

/**
 * Componente reutilizable para tarjetas de estadísticas
 * Mantiene el estilo dark theme con gradientes naranja del proyecto
 */
export default function StatsCard({
  title,
  value,
  subtitle,
  total,
  icon: Icon,
  color,
  alert,
  change,
  changeType,
}: StatsCardProps) {
  return (
    <div className="bg-zinc-900 rounded-2xl p-6 border border-zinc-800 hover:border-zinc-700 transition-all">
      <div className="flex items-start justify-between mb-4">
        {/* Icon */}
        <div className={`p-3 rounded-xl bg-gradient-to-br ${color} bg-opacity-10`}>
          <Icon className={`w-6 h-6 bg-gradient-to-r ${color} text-transparent bg-clip-text`} />
        </div>

        {/* Alert badge */}
        {alert && (
          <span className="px-2 py-1 bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-semibold rounded-full flex items-center gap-1 uppercase tracking-wide">
            <AlertTriangle className="w-3 h-3" />
            Atención
          </span>
        )}
      </div>

      {/* Value */}
      <div className="space-y-1">
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide">
          {title}
        </h3>
        <p className="text-3xl font-black text-white">
          {value}
        </p>
        {(subtitle || total) && (
          <p className="text-sm text-gray-500">
            {subtitle || (total ? `de ${total} totales` : '')}
          </p>
        )}
      </div>

      {/* Change indicator */}
      {change !== undefined && (
        <div className="mt-4 flex items-center gap-2 pt-3 border-t border-zinc-800">
          {changeType === 'positive' ? (
            <ArrowUpRight className="w-4 h-4 text-emerald-400" />
          ) : (
            <ArrowDownRight className="w-4 h-4 text-red-400" />
          )}
          <span
            className={`text-sm font-bold ${
              changeType === 'positive' ? 'text-emerald-400' : 'text-red-400'
            }`}
          >
            {change}%
          </span>
          <span className="text-sm text-gray-500">vs mes anterior</span>
        </div>
      )}
    </div>
  );
}
