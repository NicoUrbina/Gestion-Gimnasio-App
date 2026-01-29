import { Calendar, Users, MapPin, AlertCircle, CheckCircle } from 'lucide-react';
import type { GymClass } from '../../types';

interface ClassCardProps {
  gymClass: GymClass;
  onReserve?: (gymClass: GymClass) => void;
  onCancel?: (gymClass: GymClass) => void;
  onViewDetails?: (gymClass: GymClass) => void;
  showReserveButton?: boolean;
  isReserved?: boolean;
}

export default function ClassCard({
  gymClass,
  onReserve,
  onCancel,
  onViewDetails,
  showReserveButton = true,
  isReserved = false
}: ClassCardProps) {
  const startTime = new Date(gymClass.start_datetime).toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit'
  });

  const endTime = new Date(gymClass.end_datetime).toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit'
  });

  const spotsColor = gymClass.available_spots === 0
    ? 'text-red-400'
    : gymClass.available_spots <= 3
      ? 'text-yellow-400'
      : 'text-emerald-400';

  return (
    <div
      className={`
        relative bg-zinc-900 rounded-xl border-2 transition-all cursor-pointer overflow-hidden
        ${gymClass.is_cancelled
          ? 'border-zinc-800 opacity-60'
          : 'border-zinc-800 hover:border-orange-500/50 hover:shadow-lg hover:shadow-orange-500/10'
        }
      `}
      onClick={() => onViewDetails?.(gymClass)}
    >
      {/* Color indicator */}
      <div
        className="absolute top-0 left-0 w-1.5 h-full"
        style={{ backgroundColor: gymClass.color }}
      />

      {/* Cancelled badge */}
      {gymClass.is_cancelled && (
        <div className="absolute top-2 right-2">
          <span className="px-2 py-1 bg-red-900/30 text-red-400 text-xs font-semibold rounded-full border border-red-500/30">
            Cancelada
          </span>
        </div>
      )}

      <div className="p-4 pl-5">
        {/* Header */}
        <div className="mb-3">
          <h3 className="font-bold text-white mb-1">{gymClass.title}</h3>
          <p className="text-xs text-gray-400">{gymClass.class_type_name}</p>
        </div>

        {/* Details */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Calendar className="w-4 h-4" />
            <span>{startTime} - {endTime}</span>
          </div>

          {gymClass.instructor_name && (
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Users className="w-4 h-4" />
              <span>{gymClass.instructor_name}</span>
            </div>
          )}

          {gymClass.location && (
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <MapPin className="w-4 h-4" />
              <span>{gymClass.location}</span>
            </div>
          )}

          {/* Capacity */}
          <div className="flex items-center justify-between pt-2 border-t border-zinc-800">
            <span className={`text-sm font-medium ${spotsColor}`}>
              {gymClass.available_spots} cupos disponibles
            </span>
            {gymClass.waitlist_count > 0 && (
              <span className="text-xs text-yellow-400">
                {gymClass.waitlist_count} en espera
              </span>
            )}
          </div>
        </div>

        {/* Action buttons */}
        {!gymClass.is_cancelled && showReserveButton && (
          <div className="mt-4 pt-3 border-t border-zinc-800">
            {isReserved ? (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onCancel?.(gymClass);
                }}
                className="w-full px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-gray-300 hover:text-white font-medium rounded-lg transition-colors text-sm"
              >
                Cancelar Reserva
              </button>
            ) : gymClass.is_full ? (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onReserve?.(gymClass);
                }}
                className="w-full px-4 py-2 bg-yellow-900/20 border border-yellow-500/30 hover:bg-yellow-900/30 text-yellow-400 font-medium rounded-lg transition-colors text-sm flex items-center justify-center gap-2"
              >
                <AlertCircle className="w-4 h-4" />
                Unirse a Lista de Espera
              </button>
            ) : (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onReserve?.(gymClass);
                }}
                className="w-full px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-medium rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all text-sm flex items-center justify-center gap-2 shadow-lg shadow-orange-500/25"
              >
                <CheckCircle className="w-4 h-4" />
                Reservar Clase
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
