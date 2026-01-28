import { LucideIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

interface SettingsCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  href: string;
  stats?: {
    label: string;
    value: string | number;
    color?: 'default' | 'success' | 'warning' | 'error';
  };
  badge?: {
    text: string;
    color: 'orange' | 'green' | 'red' | 'yellow' | 'blue';
  };
}

export default function SettingsCard({
  title,
  description,
  icon: Icon,
  href,
  stats,
  badge,
}: SettingsCardProps) {
  const badgeColors = {
    orange: 'bg-orange-500/20 text-orange-400',
    green: 'bg-green-500/20 text-green-400',
    red: 'bg-red-500/20 text-red-400',
    yellow: 'bg-yellow-500/20 text-yellow-400',
    blue: 'bg-blue-500/20 text-blue-400',
  };

  const statsColors = {
    default: 'text-white',
    success: 'text-green-400',
    warning: 'text-yellow-400',
    error: 'text-red-400',
  };

  return (
    <Link
      to={href}
      className="group block p-6 bg-zinc-900 border border-zinc-800 rounded-xl hover:border-orange-500/50 hover:bg-zinc-800/50 transition-all duration-300"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="p-3 bg-gradient-to-br from-orange-500/20 to-orange-600/10 rounded-xl group-hover:from-orange-500/30 group-hover:to-orange-600/20 transition-colors">
          <Icon className="w-6 h-6 text-orange-500" />
        </div>
        {badge && (
          <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${badgeColors[badge.color]}`}>
            {badge.text}
          </span>
        )}
      </div>

      <h3 className="text-lg font-bold text-white mb-1 group-hover:text-orange-400 transition-colors">
        {title}
      </h3>
      <p className="text-sm text-gray-400 mb-4">{description}</p>

      {stats && (
        <div className="pt-4 border-t border-zinc-800">
          <p className="text-xs text-gray-500 uppercase tracking-wide">{stats.label}</p>
          <p className={`text-2xl font-bold ${statsColors[stats.color || 'default']}`}>
            {stats.value}
          </p>
        </div>
      )}
    </Link>
  );
}
