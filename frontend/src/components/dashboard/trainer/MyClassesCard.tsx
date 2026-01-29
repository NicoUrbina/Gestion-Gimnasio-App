import { Calendar, Users, Clock, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ClassItem {
  id: number;
  name: string;
  time: string;
  date: string;
  participants: number;
  capacity: number;
}

interface MyClassesCardProps {
  classes: ClassItem[];
}

export default function MyClassesCard({ classes }: MyClassesCardProps) {
  const navigate = useNavigate();

  if (!classes || classes.length === 0) {
    return (
      <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-6">
        <h3 className="text-lg font-bold text-white uppercase tracking-wide mb-4">
          Mis Próximas Clases
        </h3>
        <p className="text-gray-400 text-center py-8">
          No tienes clases programadas
        </p>
      </div>
    );
  }

  return (
    <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-white uppercase tracking-wide">
          Mis Próximas Clases
        </h3>
        <span className="px-3 py-1 bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-bold rounded-full">
          {classes.length} Programadas
        </span>
      </div>

      <div className="space-y-3">
        {classes.slice(0, 5).map((classItem) => {
          const occupancyPercent = (classItem.participants / classItem.capacity) * 100;
          const isFull = occupancyPercent >= 100;

          return (
            <div
              key={classItem.id}
              className="flex items-center justify-between p-4 bg-zinc-800/50 rounded-lg hover:bg-zinc-800 transition-colors group cursor-pointer"
              onClick={() => navigate('/classes')}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                
                <div>
                  <p className="font-bold text-white text-sm">
                    {classItem.name}
                  </p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="flex items-center gap-1 text-xs text-gray-400">
                      <Clock className="w-3 h-3" />
                      {classItem.time}
                    </span>
                    <span className="text-gray-600">•</span>
                    <span className="flex items-center gap-1 text-xs text-gray-400">
                      <Users className="w-3 h-3" />
                      {classItem.participants}/{classItem.capacity}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-orange-400">
                  {classItem.date}
                </span>
                {isFull && (
                  <span className="px-2 py-0.5 bg-green-500/10 border border-green-500/30 text-green-400 text-xs font-bold rounded">
                    LLENA
                  </span>
                )}
                <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-orange-500 transition-colors" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
