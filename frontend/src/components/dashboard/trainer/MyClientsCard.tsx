import { TrendingUp, Calendar, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Client {
  id: number;
  name: string;
  classes: number;
  lastVisit: string;
  progress: 'up' | 'stable' | 'down';
}

interface MyClientsCardProps {
  clients: Client[];
}

export default function MyClientsCard({ clients }: MyClientsCardProps) {
  const navigate = useNavigate();

  if (!clients || clients.length === 0) {
    return (
      <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-6">
        <h3 className="text-lg font-bold text-white uppercase tracking-wide mb-4">
          Mis Clientes Top
        </h3>
        <p className="text-gray-400 text-center py-8">
          No tienes clientes asignados
        </p>
      </div>
    );
  }

  const getProgressIcon = (progress: string) => {
    switch (progress) {
      case 'up':
        return <span className="text-emerald-400">⬆️</span>;
      case 'down':
        return <span className="text-red-400">⬇️</span>;
      default:
        return <span className="text-gray-400">➡️</span>;
    }
  };

  return (
    <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-white uppercase tracking-wide">
          Mis Clientes Top
        </h3>
        <span className="px-3 py-1 bg-green-500/10 border border-green-500/30 text-green-400 text-xs font-bold rounded-full">
          {clients.length} Activos
        </span>
      </div>

      <div className="space-y-2">
        {clients.slice(0, 5).map((client) => (
          <div
            key={client.id}
            className="flex items-center justify-between p-3 bg-zinc-800/50 rounded-lg hover:bg-zinc-800 transition-colors group cursor-pointer"
            onClick={() => navigate(`/members/${client.id}`)}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                {client.name.charAt(0)}
              </div>
              
              <div>
                <p className="font-bold text-white text-sm">
                  {client.name}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="flex items-center gap-1 text-xs text-gray-400">
                    <Calendar className="w-3 h-3" />
                    {client.classes} clases este mes
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="text-right mr-2">
                <p className="text-xs text-gray-400">
                  Última: {client.lastVisit}
                </p>
                <p className="text-xs text-gray-500 flex items-center gap-1 justify-end">
                  Progreso: {getProgressIcon(client.progress)}
                </p>
              </div>
              <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-green-500 transition-colors" />
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={() => navigate('/trainer/clients')}
        className="w-full mt-4 py-2 text-sm font-bold text-green-400 hover:text-green-300 transition-colors"
      >
        Ver todos mis clientes
      </button>
    </div>
  );
}
