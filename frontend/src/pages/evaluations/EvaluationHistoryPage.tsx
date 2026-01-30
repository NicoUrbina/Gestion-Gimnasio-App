import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ClipboardCheck, Calendar, User, TrendingUp, AlertCircle } from 'lucide-react';
import { assessmentService } from '../../services/assessments';
import type { FitnessAssessment } from '../../types/assessments';
import Spinner from '../../components/Spinner';

export default function EvaluationHistoryPage() {
  const navigate = useNavigate();
  const [evaluations, setEvaluations] = useState<FitnessAssessment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEvaluations();
  }, []);

  const loadEvaluations = async () => {
    try {
      setLoading(true);
      const data = await assessmentService.getAll();
      setEvaluations(data);
    } catch (error) {
      console.error('Error loading evaluations:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const map = {
      pending: { label: 'Pendiente', class: 'bg-yellow-100 text-yellow-700' },
      scheduled: { label: 'Agendada', class: 'bg-blue-100 text-blue-700' },
      completed: { label: 'Completada', class: 'bg-green-100 text-green-700' },
      cancelled: { label: 'Cancelada', class: 'bg-gray-100 text-gray-700' },
    };
    return map[status as keyof typeof map] || map.pending;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white uppercase tracking-tight flex items-center gap-3">
            <ClipboardCheck className="w-7 h-7 text-orange-500" />
            Mis Evaluaciones
          </h1>
          <p className="text-gray-500 mt-1">Historial de evaluaciones físicas</p>
        </div>
        <button
          onClick={() => navigate('/evaluations/request')}
          className="px-6 py-3 bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-xl font-bold hover:shadow-lg hover:shadow-orange-500/30 transition-all"
        >
          Nueva Solicitud
        </button>
      </div>

      {/* Evaluations List */}
      {evaluations.length === 0 ? (
        <div className="bg-zinc-900 rounded-2xl border-2 border-zinc-800 p-12 text-center">
          <ClipboardCheck className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-white mb-2">No tienes evaluaciones</h3>
          <p className="text-gray-500 mb-6">Solicita tu primera evaluación física</p>
          <button
            onClick={() => navigate('/evaluations/request')}
            className="px-6 py-3 bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-xl font-bold inline-flex items-center gap-2"
          >
            Solicitar Evaluación
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {evaluations.map((evaluation) => {
            const statusBadge = getStatusBadge(evaluation.status);
            
            return (
              <div
                key={evaluation.id}
                className="bg-zinc-900 rounded-2xl border-2 border-zinc-800 p-5 hover:border-orange-200 hover:shadow-lg transition-all cursor-pointer"
                onClick={() => navigate(`/evaluations/${evaluation.id}`)}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/30">
                      <ClipboardCheck className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-lg">
                        Evaluación Física
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-xs px-2 py-1 rounded-lg font-medium ${statusBadge.class}`}>
                          {statusBadge.label}
                        </span>
                        <span className="text-xs text-gray-500">
                          {formatDate(evaluation.requested_at)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  {evaluation.scheduled_for && (
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4 text-blue-600" />
                      <div>
                        <div className="text-gray-500 text-xs">Programada</div>
                        <div className="font-medium text-gray-700">
                          {formatDate(evaluation.scheduled_for)}
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {evaluation.trainer_name && (
                    <div className="flex items-center gap-2 text-sm">
                      <User className="w-4 h-4 text-green-600" />
                      <div>
                        <div className="text-gray-500 text-xs">Entrenador</div>
                        <div className="font-medium text-gray-700">
                          {evaluation.trainer_name}
                        </div>
                      </div>
                    </div>
                  )}

                  {evaluation.bmi && (
                    <div className="flex items-center gap-2 text-sm">
                      <TrendingUp className="w-4 h-4 text-orange-600" />
                      <div>
                        <div className="text-gray-500 text-xs">IMC</div>
                        <div className="font-medium text-gray-700">
                          {evaluation.bmi}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Goals */}
                {evaluation.personal_goals && (
                  <div className="bg-zinc-800/50 rounded-lg p-3">
                    <div className="text-xs text-gray-500 uppercase font-medium mb-1">Objetivos</div>
                    <p className="text-sm text-gray-700 line-clamp-2">
                      {evaluation.personal_goals}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
