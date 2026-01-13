import { Check, Dumbbell, Snowflake, Calendar } from 'lucide-react';
import type { MembershipPlan } from '../../types';

interface PlanCardProps {
  plan: MembershipPlan;
  onSelect?: (plan: MembershipPlan) => void;
  onEdit?: (plan: MembershipPlan) => void;
  selected?: boolean;
  isPopular?: boolean;
}

export default function PlanCard({ plan, onSelect, onEdit, selected, isPopular }: PlanCardProps) {
  const duration = getDurationLabel(plan.duration_days);
  
  return (
    <div
      className={`
        relative bg-white rounded-2xl border-2 transition-all cursor-pointer overflow-hidden
        ${selected 
          ? 'border-purple-500 shadow-lg shadow-purple-500/20' 
          : 'border-slate-200 hover:border-purple-300 hover:shadow-md'
        }
      `}
      onClick={() => onSelect?.(plan)}
    >
      {/* Badge "Popular" */}
      {isPopular && (
        <div className="absolute top-4 right-4">
          <span className="px-3 py-1 bg-gradient-to-r from-purple-500 to-cyan-500 text-white text-xs font-semibold rounded-full">
            Más Popular
          </span>
        </div>
      )}

      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <h3 className="text-2xl font-bold text-slate-900 mb-2">{plan.name}</h3>
          <p className="text-slate-500 text-sm">{plan.description}</p>
        </div>

        {/* Precio */}
        <div className="mb-6">
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold text-slate-900">${plan.price}</span>
            <span className="text-slate-500">/ {duration}</span>
          </div>
        </div>

        {/* Características */}
        <ul className="space-y-3 mb-6">
          <Feature
            icon={<Calendar className="w-5 h-5" />}
            text={`Duración: ${plan.duration_days} días`}
          />
          
          {plan.max_classes_per_month ? (
            <Feature
              icon={<Dumbbell className="w-5 h-5" />}
              text={`${plan.max_classes_per_month} clases mensuales`}
            />
          ) : (
            <Feature
              icon={<Dumbbell className="w-5 h-5" />}
              text="Clases ilimitadas"
              highlighted
            />
          )}

          {plan.includes_trainer && (
            <Feature
              icon={<Check className="w-5 h-5" />}
              text="Incluye entrenador personal"
              highlighted
            />
          )}

          {plan.can_freeze && (
            <Feature
              icon={<Snowflake className="w-5 h-5" />}
              text={`Congelamiento: ${plan.max_freeze_days} días`}
            />
          )}
        </ul>

        {/* Botones de acción */}
        {onEdit && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(plan);
            }}
            className="w-full px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-xl transition-colors"
          >
            Editar Plan
          </button>
        )}
      </div>
    </div>
  );
}

/**
 * Componente auxiliar para características del plan
 */
function Feature({ icon, text, highlighted }: { 
  icon: React.ReactNode; 
  text: string; 
  highlighted?: boolean;
}) {
  return (
    <li className="flex items-center gap-3">
      <div className={`
        flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center
        ${highlighted 
          ? 'bg-gradient-to-br from-purple-500 to-cyan-500 text-white' 
          : 'bg-slate-100 text-slate-600'
        }
      `}>
        {icon}
      </div>
      <span className={highlighted ? 'font-medium text-slate-900' : 'text-slate-600'}>
        {text}
      </span>
    </li>
  );
}

/**
 * Helper para convertir días a etiqueta legible
 */
function getDurationLabel(days: number): string {
  if (days === 30) return 'mes';
  if (days === 90) return 'trimestre';
  if (days === 365) return 'año';
  return `${days} días`;
}
