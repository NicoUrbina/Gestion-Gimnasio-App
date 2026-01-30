import { LucideIcon, TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface ProgressStatsCardProps {
  title: string;
  value: string | number;
  unit?: string;
  change?: number; // Positive = improvement, negative = decline
  changeLabel?: string;
  icon: LucideIcon;
  color?: 'blue' | 'green' | 'orange' | 'purple' | 'cyan' | 'emerald';
}

const colorClasses = {
  blue: 'from-blue-500 to-blue-600',
  green: 'from-green-500 to-green-600',
  orange: 'from-orange-500 to-orange-600',
  purple: 'from-purple-500 to-purple-600',
  cyan: 'from-cyan-500 to-cyan-600',
  emerald: 'from-emerald-500 to-emerald-600',
};

const shadowClasses = {
  blue: 'shadow-blue-500/30',
  green: 'shadow-green-500/30',
  orange: 'shadow-orange-500/30',
  purple: 'shadow-purple-500/30',
  cyan: 'shadow-cyan-500/30',
  emerald: 'shadow-emerald-500/30',
};

export default function ProgressStatsCard({
  title,
  value,
  unit,
  change,
  changeLabel,
  icon: Icon,
  color = 'orange',
}: ProgressStatsCardProps) {
  const hasChange = change !== undefined && change !== null;
  const isPositive = hasChange && change > 0;
  const isNegative = hasChange && change < 0;
  const isNeutral = hasChange && change === 0;

  return (
    <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-6 hover:border-zinc-700 transition-all">
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className={`w-14 h-14 bg-gradient-to-br ${colorClasses[color]} rounded-xl flex items-center justify-center shadow-lg ${shadowClasses[color]} flex-shrink-0`}>
          <Icon className="w-7 h-7 text-white" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <p className="text-xs text-gray-400 uppercase font-medium tracking-wide mb-1">
            {title}
          </p>
          
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-black text-white">
              {value}
            </p>
            {unit && (
              <span className="text-lg text-gray-500 font-medium">{unit}</span>
            )}
          </div>

          {/* Change Indicator */}
          {hasChange && (
            <div className="mt-2 flex items-center gap-1.5">
              {isPositive && (
                <>
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-bold text-emerald-400">
                    +{Math.abs(change).toFixed(1)}{unit}
                  </span>
                </>
              )}
              {isNegative && (
                <>
                  <TrendingDown className="w-4 h-4 text-orange-400" />
                  <span className="text-xs font-bold text-orange-400">
                    {change.toFixed(1)}{unit}
                  </span>
                </>
              )}
              {isNeutral && (
                <>
                  <Minus className="w-4 h-4 text-gray-400" />
                  <span className="text-xs font-bold text-gray-400">
                    Sin cambios
                  </span>
                </>
              )}
              {changeLabel && (
                <span className="text-xs text-gray-500">{changeLabel}</span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
