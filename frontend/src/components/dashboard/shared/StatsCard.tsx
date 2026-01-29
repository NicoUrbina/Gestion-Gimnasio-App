import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  color?: 'blue' | 'green' | 'orange' | 'purple' | 'red' | 'cyan' | 'emerald';
  alert?: boolean;
}

const colorClasses = {
  blue: 'from-blue-500 to-blue-600',
  green: 'from-green-500 to-green-600',
  orange: 'from-orange-500 to-orange-600',
  purple: 'from-purple-500 to-purple-600',
  red: 'from-red-500 to-red-600',
  cyan: 'from-cyan-500 to-cyan-600',
  emerald: 'from-emerald-500 to-emerald-600',
};

const shadowClasses = {
  blue: 'shadow-blue-500/30',
  green: 'shadow-green-500/30',
  orange: 'shadow-orange-500/30',
  purple: 'shadow-purple-500/30',
  red: 'shadow-red-500/30',
  cyan: 'shadow-cyan-500/30',
  emerald: 'shadow-emerald-500/30',
};

export default function StatsCard({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  color = 'orange',
  alert = false 
}: StatsCardProps) {
  return (
    <div className={`bg-zinc-900 rounded-xl border ${alert ? 'border-orange-500/50' : 'border-zinc-800'} p-6 hover:border-zinc-700 transition-all`}>
      <div className="flex items-center gap-4">
        {/* Icon */}
        <div className={`w-14 h-14 bg-gradient-to-br ${colorClasses[color]} rounded-xl flex items-center justify-center shadow-lg ${shadowClasses[color]} flex-shrink-0`}>
          <Icon className="w-7 h-7 text-white" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <p className="text-xs text-gray-400 uppercase font-medium tracking-wide mb-1">
            {title}
          </p>
          <p className="text-3xl font-black text-white truncate">
            {value}
          </p>
          {subtitle && (
            <p className="text-xs text-gray-500 mt-1">
              {subtitle}
            </p>
          )}
        </div>

        {/* Alert Badge */}
        {alert && (
          <div className="flex-shrink-0">
            <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-orange-500/10 border border-orange-500/30">
              <span className="w-2 h-2 bg-orange-500 rounded-full mr-2 animate-pulse"></span>
              <span className="text-xs font-bold text-orange-400">ATENCIÓN</span>
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
