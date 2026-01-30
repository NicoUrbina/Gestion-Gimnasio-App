import { TrendingUp } from 'lucide-react';

interface EmptyProgressStateProps {
  onAction?: () => void;
}

export default function EmptyProgressState({ onAction }: EmptyProgressStateProps) {
  return (
    <div className="text-center py-16 px-6">
      <div className="max-w-md mx-auto">
        {/* Icon */}
        <div className="w-20 h-20 bg-gradient-to-br from-orange-500/20 to-orange-600/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <TrendingUp className="w-10 h-10 text-orange-400" />
        </div>

        {/* Message */}
        <h3 className="text-2xl font-bold text-white mb-3">
          Comienza tu Seguimiento
        </h3>
        <p className="text-gray-400 mb-8 leading-relaxed">
          Aún no has registrado ningún dato de progreso. 
          <br />
          Empieza ahora para ver cómo evoluciona tu cuerpo a lo largo del tiempo.
        </p>

        {/* Action Button */}
        {onAction && (
          <button
            onClick={onAction}
            className="px-8 py-3 bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-xl font-bold hover:shadow-lg hover:shadow-orange-500/30 transition-all inline-flex items-center gap-2"
          >
            <TrendingUp className="w-5 h-5" />
            Registrar mi Primer Progreso
          </button>
        )}

        {/* Tips */}
        <div className="mt-12 text-left bg-zinc-900 rounded-xl border border-zinc-800 p-6">
          <h4 className="text-sm font-bold text-white uppercase tracking-wide mb-4">
            💡 Consejos para comenzar
          </h4>
          <ul className="text-sm text-gray-400 space-y-2">
            <li className="flex items-start gap-2">
              <span className="text-orange-500 flex-shrink-0">•</span>
              <span>Regístrate siempre a la misma hora del día</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-500 flex-shrink-0">•</span>
              <span>Usa la misma báscula para mediciones consistentes</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-500 flex-shrink-0">•</span>
              <span>Registra al menos una vez por semana para ver tu evolución</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-500 flex-shrink-0">•</span>
              <span>No te preocupes si no tienes todas las métricas disponibles</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
