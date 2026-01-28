import { LucideIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface QuickAction {
  label: string;
  icon: LucideIcon;
  onClick?: () => void;
  href?: string;
}

interface QuickActionsProps {
  actions: QuickAction[];
  title?: string;
}

/**
 * Componente reutilizable para sección de acciones rápidas
 * Mantiene el estilo dark theme con gradientes naranja
 */
export default function QuickActions({ actions, title = 'Acciones Rápidas' }: QuickActionsProps) {
  const navigate = useNavigate();

  const handleAction = (action: QuickAction) => {
    if (action.onClick) {
      action.onClick();
    } else if (action.href) {
      navigate(action.href);
    }
  };

  return (
    <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 shadow-xl shadow-orange-500/20">
      <h3 className="font-black text-lg mb-4 text-white uppercase tracking-wide">
        {title}
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {actions.map((action, index) => (
          <button
            key={index}
            onClick={() => handleAction(action)}
            className="flex flex-col items-center gap-2 px-4 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-xl transition-all duration-200 border border-white/20 hover:border-white/30 group"
          >
            <action.icon className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
            <span className="text-xs font-semibold text-white text-center leading-tight">
              {action.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
