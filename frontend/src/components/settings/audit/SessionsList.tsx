import { useState, useEffect } from 'react';
import { auditService } from '../../../services/audit';
import type { UserSession } from '../../../types/audit';
import { Users, Clock, Server, Power, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export default function SessionsList() {
  const [sessions, setSessions] = useState<UserSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    loadSessions();
  }, [showAll]);

  const loadSessions = async () => {
    setLoading(true);
    try {
      if (showAll) {
        const data = await auditService.getSessions({});
        setSessions(data.results);
      } else {
        const data = await auditService.getActiveSessions();
        setSessions(data);
      }
    } catch (error) {
      console.error('Error loading sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTerminate = async (sessionId: number) => {
    if (!confirm('¿Estás seguro de que deseas terminar esta sesión?')) return;

    try {
      await auditService.terminateSession(sessionId);
      loadSessions(); // Reload after terminating
    } catch (error) {
      console.error('Error terminating session:', error);
      alert('Error al terminar la sesión');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Toggle */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Users className="w-5 h-5 text-orange-500" />
          <h3 className="text-lg font-semibold text-white">
            {showAll ? 'Todas las Sesiones' : 'Sesiones Activas'}
          </h3>
          <span className="px-3 py-1 bg-zinc-800 rounded-lg text-sm text-gray-400">
            {sessions.length}
          </span>
        </div>
        <button
          onClick={() => setShowAll(!showAll)}
          className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-sm text-white transition-colors"
        >
          {showAll ? 'Solo Activas' : 'Ver Todas'}
        </button>
      </div>

      {/* Sessions List */}
      {sessions.length === 0 ? (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-12 text-center">
          <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400 text-lg">
            No hay sesiones {showAll ? '' : 'activas'}
          </p>
        </div>
      ) : (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-zinc-800 border-b border-zinc-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Usuario
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    IP Address
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Login
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Duración
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {sessions.map((session) => (
                  <tr
                    key={session.id}
                    className="hover:bg-zinc-800/50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                          {session.user_name.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-white font-medium">
                          {session.user_name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Server className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-400 font-mono text-sm">
                          {session.ip_address}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2 text-gray-400 text-sm">
                        <Clock className="w-4 h-4" />
                        {format(new Date(session.login_time), 'dd/MM HH:mm', {
                          locale: es,
                        })}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-white text-sm">
                        {session.duration_str}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {session.is_active ? (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-500/10 border border-green-500/20 rounded-lg text-green-400 text-xs font-medium">
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                          Activa
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-1 bg-gray-500/10 border border-gray-500/20 rounded-lg text-gray-400 text-xs font-medium">
                          Cerrada
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      {session.is_active && (
                        <button
                          onClick={() => handleTerminate(session.id)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-lg text-sm text-red-400 hover:text-red-300 transition-colors"
                        >
                          <Power className="w-4 h-4" />
                          Terminar
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Warning */}
      {sessions.filter((s) => s.is_active).length > 10 && (
        <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-4 flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-orange-500 flex-shrink-0" />
          <p className="text-orange-200 text-sm">
            Hay muchas sesiones activas simultáneamente. Considera revisar la
            actividad inusual.
          </p>
        </div>
      )}
    </div>
  );
}
