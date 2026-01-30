import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { History, Calendar, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { progressService } from '../../services/progress';
import type { ProgressLog } from '../../types/progress';
import toast from 'react-hot-toast';

export default function ProgressHistory() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [logs, setLogs] = useState<ProgressLog[]>([]);
  const [expandedLogId, setExpandedLogId] = useState<number | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await progressService.getLogs();
      // Sort by date descending (newest first)
      const sorted = data.sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      setLogs(sorted);
    } catch (error: any) {
      console.error('Error loading progress history:', error);
      toast.error('Error al cargar historial');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Estás seguro que deseas eliminar este registro?')) return;

    try {
      await progressService.deleteLog(id);
      toast.success('Registro eliminado');
      loadData();
    } catch (error: any) {
      console.error('Error deleting log:', error);
      toast.error('Error al eliminar registro');
    }
  };

  const toggleExpand = (id: number) => {
    setExpandedLogId(expandedLogId === id ? null : id);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-3">
          <History className="w-7 h-7 text-orange-500" />
          Historial de Progreso
        </h1>
        <p className="text-gray-500 mt-1">
          {logs.length} {logs.length === 1 ? 'registro guardado' : 'registros guardados'}
        </p>
      </div>

      {/* Empty State */}
      {logs.length === 0 && (
        <div className="text-center py-16 px-6">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <History className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">
            No hay registros aún
          </h3>
          <p className="text-gray-500 mb-6">
            Comienza registrando tu primer progreso
          </p>
          <button
            onClick={() => navigate('/progress/update')}
            className="px-6 py-3 bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-xl font-bold hover:shadow-lg hover:shadow-orange-500/30 transition-all"
          >
            Registrar Progreso
          </button>
        </div>
      )}

      {/* History List */}
      <div className="space-y-3">
        {logs.map((log, index) => {
          const isExpanded = expandedLogId === log.id;
          const isLatest = index === 0;

          return (
            <div
              key={log.id}
              className={`bg-white rounded-2xl border-2 transition-all ${
                isLatest ? 'border-orange-200' : 'border-gray-100'
              } overflow-hidden`}
            >
              {/* Header */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Calendar className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900">
                        {new Date(log.date).toLocaleDateString('es-ES', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </h3>
                      <p className="text-xs text-gray-500">
                        Hace {Math.floor((Date.now() - new Date(log.date).getTime()) / (1000 * 60 * 60 * 24))} días
                      </p>
                    </div>
                    {isLatest && (
                      <span className="px-2.5 py-1 bg-orange-100 text-orange-600 text-xs font-bold rounded-full">
                        MÁS RECIENTE
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleExpand(log.id)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5 text-gray-600" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-600" />
                      )}
                    </button>
                    <button
                      onClick={() => handleDelete(log.id)}
                      className="p-2 hover:bg-red-50 rounded-lg transition-colors group"
                    >
                      <Trash2 className="w-5 h-5 text-gray-400 group-hover:text-red-500" />
                    </button>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {log.weight && (
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-xs text-gray-500 mb-1">Peso</p>
                      <p className="text-lg font-bold text-slate-900">{log.weight} kg</p>
                    </div>
                  )}
                  {log.bmi && (
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-xs text-gray-500 mb-1">IMC</p>
                      <p className="text-lg font-bold text-slate-900">{log.bmi.toFixed(1)}</p>
                    </div>
                  )}
                  {log.body_fat_percentage && (
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-xs text-gray-500 mb-1">Grasa</p>
                      <p className="text-lg font-bold text-slate-900">{log.body_fat_percentage}%</p>
                    </div>
                  )}
                  {log.muscle_mass && (
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-xs text-gray-500 mb-1">Músculo</p>
                      <p className="text-lg font-bold text-slate-900">{log.muscle_mass} kg</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Expanded Details */}
              {isExpanded && (
                <div className="px-6 pb-6 border-t border-gray-100 pt-6">
                  <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-4">
                    Detalles Completos
                  </h4>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                    {log.height && (
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Altura</p>
                        <p className="text-sm font-bold text-slate-900">{log.height} cm</p>
                      </div>
                    )}
                    {log.chest && (
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Pecho</p>
                        <p className="text-sm font-bold text-slate-900">{log.chest} cm</p>
                      </div>
                    )}
                    {log.waist && (
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Cintura</p>
                        <p className="text-sm font-bold text-slate-900">{log.waist} cm</p>
                      </div>
                    )}
                    {log.hips && (
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Cadera</p>
                        <p className="text-sm font-bold text-slate-900">{log.hips} cm</p>
                      </div>
                    )}
                  </div>

                  {log.notes && (
                    <div className="bg-blue-50 rounded-lg p-4">
                      <p className="text-xs text-blue-600 font-bold mb-2">NOTAS</p>
                      <p className="text-sm text-blue-900">{log.notes}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
