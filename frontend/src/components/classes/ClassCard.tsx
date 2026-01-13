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
    ? 'text-red-600' 
    : gymClass.available_spots <= 3 
    ? 'text-yellow-600' 
    : 'text-emerald-600';

  return (
    <div
      className={`
        relative bg-white rounded-xl border-2 transition-all cursor-pointer overflow-hidden
        ${gymClass.is_cancelled 
          ? 'border-slate-200 opacity-60' 
          : 'border-slate-200 hover:border-purple-300 hover:shadow-md'
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
          <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded-full">
            Cancelada
          </span>
        </div>
      )}

      <div className="p-4 pl-5">
        {/* Header */}
        <div className="mb-3">
          <h3 className="font-bold text-slate-900 mb-1">{gymClass.title}</h3>
          <p className="text-xs text-slate-500">{gymClass.class_type_name}</p>
        </div>

        {/* Details */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Calendar className="w-4 h-4 text-slate-400" />
            <span>{startTime} - {endTime}</span>
          </div>

          {gymClass.instructor_name && (
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <Users className="w-4 h-4 text-slate-400" />
              <span>{gymClass.instructor_name}</span>
            </div>
          )}

          {gymClass.location && (
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <MapPin className="w-4 h-4 text-slate-400" />
              <span>{gymClass.location}</span>
            </div>
          )}

          {/* Capacity */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-100">
            <span className={`text-sm font-medium ${spotsColor}`}>
              {gymClass.available_spots} cupos disponibles
            </span>
            {gymClass.waitlist_count > 0 && (
              <span className="text-xs text-yellow-600">
                {gymClass.waitlist_count} en espera
              </span>
            )}
          </div>
        </div>

        {/* Action buttons */}
        {!gymClass.is_cancelled && showReserveButton && (
          <div className="mt-4 pt-3 border-t border-slate-100">
            {isReserved ? (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onCancel?.(gymClass);
                }}
                className="w-full px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-lg transition-colors text-sm"
              >
                Cancelar Reserva
              </button>
            ) : gymClass.is_full ? (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onReserve?.(gymClass);
                }}
                className="w-full px-4 py-2 bg-yellow-50 hover:bg-yellow-100 text-yellow-700 font-medium rounded-lg transition-colors text-sm flex items-center justify-center gap-2"
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
                className="w-full px-4 py-2 bg-gradient-to-r from-purple-600 to-cyan-600 text-white font-medium rounded-lg hover:from-purple-500 hover:to-cyan-500 transition-all text-sm flex items-center justify-center gap-2"
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
