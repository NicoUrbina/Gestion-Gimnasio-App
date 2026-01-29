import { Calendar, Users, Clock } from 'lucide-react';

interface ClassInfo {
  id: number;
  name: string;
  trainer: string;
  time: string;
  reservations: number;
  capacity: number;
}

interface TodayClassesCardProps {
  classes: ClassInfo[];
}

export default function TodayClassesCard({ classes }: TodayClassesCardProps) {
  if (!classes || classes.length === 0) {
    return (
      <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-6">
        <h3 className="text-lg font-bold text-white uppercase tracking-wide mb-4">
          Clases de Hoy
        </h3>
        <p className="text-gray-400 text-center py-8">
          No hay clases programadas para hoy
        </p>
      </div>
    );
  }

  return (
    <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-white uppercase tracking-wide">
          Clases de Hoy
        </h3>
        <span className="px-3 py-1 bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-bold rounded-full">
          {classes.length} Programadas
        </span>
      </div>

      <div className="space-y-2">
        {classes.map((classItem) => {
          const occupancyPercent = (classItem.reservations / classItem.capacity) * 100;
          const isFull = occupancyPercent >= 100;
          const isAlmostFull = occupancyPercent >= 80;

          return (
            <div
              key={classItem.id}
              className="flex items-center justify-between p-3 bg-zinc-800/50 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-5 h-5 text-white" />
                </div>
                
                <div>
                  <p className="font-bold text-white text-sm">
                    {classItem.name}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="flex items-center gap-1 text-xs text-gray-400">
                      <Clock className="w-3 h-3" />
                      {classItem.time}
                    </span>
                    <span className="text-gray-600">•</span>
                    <span className="text-xs text-gray-400">
                      {classItem.trainer}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4 text-gray-400" />
                  <span className={`text-sm font-bold ${
                    isFull ? 'text-red-400' : 
                    isAlmostFull ? 'text-orange-400' : 
                    'text-gray-300'
                  }`}>
                    {classItem.reservations}/{classItem.capacity}
                  </span>
                </div>
                {isFull && (
                  <span className="px-2 py-0.5 bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-bold rounded">
                    LLENA
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
