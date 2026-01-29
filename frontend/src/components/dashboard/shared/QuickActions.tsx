import { useNavigate } from 'react-router-dom';
import { LucideIcon } from 'lucide-react';

interface QuickAction {
  label: string;
  href: string;
  icon: LucideIcon;
  color?: 'orange' | 'blue' | 'green' | 'purple';
}

interface QuickActionsProps {
  actions: QuickAction[];
  title?: string;
}

const colorClasses = {
  orange: 'text-orange-500 hover:border-orange-500',
  blue: 'text-blue-500 hover:border-blue-500',
  green: 'text-green-500 hover:border-green-500',
  purple: 'text-purple-500 hover:border-purple-500',
};

export default function QuickActions({ actions, title = "Acciones Rápidas" }: QuickActionsProps) {
  const navigate = useNavigate();

  return (
    <div className="space-y-4">
      {title && (
        <h2 className="text-lg font-bold text-white uppercase tracking-wide">
          {title}
        </h2>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {actions.map((action) => {
          const Icon = action.icon;
          const colorClass = colorClasses[action.color || 'orange'];

          return (
            <button
              key={action.label}
              onClick={() => navigate(action.href)}
              className={`bg-zinc-900 rounded-xl border-2 border-zinc-800 p-5 hover:shadow-lg transition-all text-left group ${colorClass}`}
            >
              <Icon className="w-8 h-8 mb-3 transition-transform group-hover:scale-110" />
              <div className="font-bold text-white text-sm">
                {action.label}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
