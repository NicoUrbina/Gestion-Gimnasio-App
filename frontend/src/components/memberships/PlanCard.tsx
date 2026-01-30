[mport { Check, Dumbbell, Snowflake, Calendar, Trash2 } from 'lucide-react';
import type { MembershipPlan } from '../../types';

interface PlanCardProps {
  plan: MembershipPlan;
  onSelect?: (plan: MembershipPlan) => void;
  onEdit?: (plan: MembershipPlan) => void;
  onDelete?: (plan: MembershipPlan) => void;
  selected?: boolean;
  isPopular?: boolean;
}

export default function PlanCard({ plan, onSelect, onEdit, onDelete, selected, isPopular }: PlanCardProps) {
  const duration = getDurationLabel(plan.duration_days);

  return (
    <div
      className={`
        relative bg-zinc-900 rounded-2xl border-2 transition-all cursor-pointer overflow-hidden
        ${selected
          ? 'border-orange-500 shadow-lg shadow-orange-500/20'
          : 'border-zinc-800 hover:border-orange-400/50 hover:shadow-md hover:shadow-orange-500/10'
        }
      `}
      onClick={() => onSelect?.(plan)}
    >
      {/* Badge "Popular" */}
      {isPopular && (
        <div className="absolute top-4 right-4">
          <span className="px-3 py-1 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-xs font-semibold rounded-full shadow-lg">
            Más Popular
          </span>
        </div>
      )}

      {/* Selected Indicator */}
      {selected && (
        <div className="absolute top-4 left-4">
          <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center shadow-lg">
            <Check className="w-5 h-5 text-white" />
          </div>
        </div>
      )}

      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
          <p className="text-gray-400 text-sm">{plan.description}</p>
        </div>

        {/* Precio */}
        <div className="mb-6">
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold text-white">${plan.price}</span>
            <span className="text-gray-400">/ {duration}</span>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            ${(parseFloat(plan.price.toString()) / plan.duration_days).toFixed(2)} por día
          </p>
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
        {(onEdit || onDelete) && (
          <div className="flex gap-2">
            {onEdit && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(plan);
                }}
                className="flex-1 px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-gray-300 font-medium rounded-xl transition-colors border border-zinc-700"
              >
                Editar
              </button>
            )}
            {onDelete && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(plan);
                }}
                className="px-4 py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 font-medium rounded-xl transition-colors border border-red-500/20"
                title="Eliminar plan"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            )}
          </div>
        )}

        {/* Status Badge */}
        {plan.is_active ? (
          <div className="mt-4 text-center">
            <span className="text-xs text-green-400 font-semibold">✓ Disponible</span>
          </div>
        ) : (
          <div className="mt-4 text-center">
            <span className="text-xs text-gray-600">No disponible</span>
          </div>
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
          ? 'bg-gradient-to-br from-orange-500 to-orange-600 text-white'
          : 'bg-zinc-800 text-gray-400'
        }
      `}>
        {icon}
      </div>
      <span className={highlighted ? 'font-medium text-white' : 'text-gray-400'}>
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
  if (days === 180) return 'semestre';
  if (days === 365) return 'año';
  return `${days} días`;
}
