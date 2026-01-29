import { CheckCircle2, Flame } from 'lucide-react';

interface MyProgressSectionProps {
  stats: {
    attendance: {
      month: number;
    };
    goals: {
      monthlyClasses: number;
    };
    streak: {
      days: number;
      best: number;
    };
  };
}

export default function MyProgressSection({ stats }: MyProgressSectionProps) {
  const progressPercentage = (stats.attendance.month / stats.goals.monthlyClasses) * 100;

  return (
    <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-6">
      <h3 className="text-lg font-bold text-white uppercase tracking-wide mb-6">
        Mi Progreso
      </h3>

      {/* Asistencia Mensual */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm text-gray-400">Asistencia Mensual</p>
          <p className="text-sm font-bold text-white">
            {stats.attendance.month}/{stats.goals.monthlyClasses} clases
          </p>
        </div>
        <div className="w-full bg-zinc-800 rounded-full h-3 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-orange-500 to-orange-600 transition-all duration-500 rounded-full"
            style={{ width: `${Math.min(progressPercentage, 100)}%` }}
          />
        </div>
        <p className="text-xs text-gray-500 mt-1">
          {progressPercentage >= 100 ? '¡Meta alcanzada! 🎉' : `${(100 - progressPercentage).toFixed(0)}% para completar tu meta`}
        </p>
      </div>

      {/* Racha de Asistencia */}
      <div className="p-4 bg-gradient-to-br from-orange-500/10 to-orange-600/10 border border-orange-500/20 rounded-lg mb-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center shadow-lg shadow-orange-500/30 flex-shrink-0">
            <Flame className="w-7 h-7 text-white" />
          </div>
          <div>
            <p className="text-3xl font-black text-white">{stats.streak.days} días</p>
            <p className="text-xs text-gray-400 uppercase tracking-wide">Racha actual</p>
            {stats.streak.best > 0 && (
              <p className="text-xs text-orange-400 mt-1">
                Mejor racha: {stats.streak.best} días
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Objetivo de la Semana */}
      <div className="p-4 bg-zinc-800/50 rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <p className="text-sm font-semibold text-white">Objetivo de la Semana</p>
        </div>
        <p className="text-xs text-gray-400">
          Asistir a 3 clases esta semana (2/3 completadas)
        </p>
        <div className="w-full bg-zinc-800 rounded-full h-1.5 overflow-hidden mt-2">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600 transition-all duration-500"
            style={{ width: '66%' }}
          />
        </div>
      </div>
    </div>
  );
}
