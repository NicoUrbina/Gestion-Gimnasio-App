import { Calendar, Clock, User, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ClassReservation {
  id: number;
  class_name: string;
  trainer_name: string;
  date: string;
  time: string;
}

interface MyUpcomingClassesProps {
  classes: ClassReservation[];
}

export default function MyUpcomingClasses({ classes }: MyUpcomingClassesProps) {
  const navigate = useNavigate();

  if (!classes || classes.length === 0) {
    return (
      <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-white uppercase tracking-wide">
            Próximas Clases
          </h3>
          <span className="px-3 py-1 bg-zinc-800 text-gray-400 text-xs font-bold rounded-full">
            0 Reservadas
          </span>
        </div>
        
        <div className="text-center py-8">
          <Calendar className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400 mb-4">No tienes clases reservadas</p>
          <button
            onClick={() => navigate('/classes')}
            className="px-6 py-3 bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-xl font-bold hover:shadow-lg hover:shadow-orange-500/30 transition-all"
          >
            Reservar Clase
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-white uppercase tracking-wide">
          Próximas Clases
        </h3>
        <span className="px-3 py-1 bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-bold rounded-full">
          {classes.length} Reservadas
        </span>
      </div>

      <div className="space-y-3">
        {classes.map((classItem) => (
          <div
            key={classItem.id}
            className="flex items-center justify-between p-4 bg-zinc-800/50 rounded-lg hover:bg-zinc-800 transition-colors group cursor-pointer"
            onClick={() => navigate('/classes/my-reservations')}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              
              <div>
                <p className="font-bold text-white text-sm">
                  {classItem.class_name}
                </p>
                <div className="flex items-center gap-3 mt-1">
                  <span className="flex items-center gap-1 text-xs text-gray-400">
                    <User className="w-3 h-3" />
                    {classItem.trainer_name}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-gray-400">
                    <Clock className="w-3 h-3" />
                    {classItem.time}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-orange-400">
                {classItem.date}
              </span>
              <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-orange-500 transition-colors" />
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={() => navigate('/classes')}
        className="w-full mt-4 py-2 text-sm font-bold text-orange-400 hover:text-orange-300 transition-colors"
      >
        + Reservar otra clase
      </button>
    </div>
  );
}
