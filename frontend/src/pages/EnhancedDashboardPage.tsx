import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Calendar, TrendingUp, Dumbbell, CreditCard, 
  Activity, Clock, AlertCircle, ArrowRight, CheckCircle 
} from 'lucide-react';
import api from '../../services/api';
import Spinner from '../../components/Spinner';

interface DashboardStats {
  membership: {
    is_active: boolean;
    plan_name: string | null;
    days_until_expiry: number | null;
    expiring_soon: boolean;
  };
  next_class: {
    has_reservation: boolean;
    class_name: string | null;
    date: string | null;
    time: string | null;
  };
  activity: {
    sessions_this_month: number;
    classes_last_30_days: number;
    last_progress_date: string | null;
    current_weight: number | null;
  };
}

export default function EnhancedDashboardPage() {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      const response = await api.get('/users/dashboard_stats/');
      setStats(response.data);
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="bg-white rounded-2xl border-2 border-gray-100 p-12 text-center">
        <AlertCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-bold text-slate-900 mb-2">Error al cargar datos</h3>
      </div>
    );
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight">
          Mi Dashboard
        </h1>
        <p className="text-gray-500 mt-1">Resumen de tu actividad y progreso</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Membership Status */}
        <div className={`rounded-xl border-2 p-4 ${
          stats.membership.is_active
            ? 'bg-green-50 border-green-200'
            : 'bg-red-50 border-red-200'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-sm ${
              stats.membership.is_active
                ? 'bg-gradient-to-br from-green-500 to-green-600'
                : 'bg-gradient-to-br from-red-500 to-red-600'
            }`}>
              {stats.membership.is_active ? (
                <CheckCircle className="w-6 h-6 text-white" />
              ) : (
                <AlertCircle className="w-6 h-6 text-white" />
              )}
            </div>
            <div>
              <div className="text-xs text-gray-600 uppercase font-medium">Membresía</div>
              <div className="font-black text-lg text-slate-900">
                {stats.membership.is_active ? 'Activa' : 'Inactiva'}
              </div>
              {stats.membership.days_until_expiry !== null && (
                <div className={`text-xs font-medium ${
                  stats.membership.expiring_soon ? 'text-red-600' : 'text-gray-600'
                }`}>
                  {stats.membership.days_until_expiry} días restantes
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sessions This Month */}
        <div className="bg-white rounded-xl border-2 border-gray-100 p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/30">
              <Dumbbell className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-xs text-gray-500 uppercase font-medium">Este Mes</div>
              <div className="font-black text-2xl text-slate-900">{stats.activity.sessions_this_month}</div>
              <div className="text-xs text-gray-500">Sesiones</div>
            </div>
          </div>
        </div>

        {/* Classes Attended */}
        <div className="bg-white rounded-xl border-2 border-gray-100 p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-sm">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-xs text-gray-500 uppercase font-medium">Últimos 30 Días</div>
              <div className="font-black text-2xl text-slate-900">{stats.activity.classes_last_30_days}</div>
              <div className="text-xs text-gray-500">Clases</div>
            </div>
          </div>
        </div>

        {/* Current Weight */}
        <div className="bg-white rounded-xl border-2 border-gray-100 p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-sm">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-xs text-gray-500 uppercase font-medium">Peso Actual</div>
              <div className="font-black text-2xl text-slate-900">
                {stats.activity.current_weight ? `${stats.activity.current_weight}kg` : 'N/A'}
              </div>
              <div className="text-xs text-gray-500">
                {stats.activity.last_progress_date ? formatDate(stats.activity.last_progress_date) : 'Sin registros'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Membership Expiring Warning */}
      {stats.membership.expiring_soon && stats.membership.is_active && (
        <div className="bg-yellow-50 border-l-4 border-yellow-500 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-yellow-600" />
              <div>
                <div className="font-bold text-yellow-900">Tu membresía está por vencer</div>
                <div className="text-sm text-yellow-800">
                  Renueva ahora para seguir entrenando sin interrupciones
                </div>
              </div>
            </div>
            <button
              onClick={() => navigate('/memberships/renew')}
              className="px-4 py-2 bg-yellow-600 text-white rounded-xl font-bold hover:bg-yellow-700 transition-colors"
            >
              Renovar Ahora
            </button>
          </div>
        </div>
      )}

      {/* Action Shortcuts */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <button
          onClick={() => navigate('/classes/calendar')}
          className="bg-white rounded-xl border-2 border-gray-100 p-5 hover:border-orange-500 hover:shadow-lg transition-all text-left"
        >
          <Calendar className="w-8 h-8 text-orange-500 mb-3" />
          <div className="font-bold text-slate-900">Reservar Clase</div>
          <div className="text-sm text-gray-500">Ver calendario disponible</div>
        </button>

        <button
          onClick={() => navigate('/workouts/my-routine')}
          className="bg-white rounded-xl border-2 border-gray-100 p-5 hover:border-orange-500 hover:shadow-lg transition-all text-left"
        >
          <Dumbbell className="w-8 h-8 text-orange-500 mb-3" />
          <div className="font-bold text-slate-900">Mi Rutina</div>
          <div className="text-sm text-gray-500">Ver plan de entrenamiento</div>
        </button>

        <button
          onClick={() => navigate('/progress/update')}
          className="bg-white rounded-xl border-2 border-gray-100 p-5 hover:border-orange-500 hover:shadow-lg transition-all text-left"
        >
          <TrendingUp className="w-8 h-8 text-orange-500 mb-3" />
          <div className="font-bold text-slate-900">Registrar Progreso</div>
          <div className="text-sm text-gray-500">Actualizar medidas</div>
        </button>

        <button
          onClick={() => navigate('/progress/evolution')}
          className="bg-white rounded-xl border-2 border-gray-100 p-5 hover:border-orange-500 hover:shadow-lg transition-all text-left"
        >
          <Activity className="w-8 h-8 text-orange-500 mb-3" />
          <div className="font-bold text-slate-900">Ver Evolución</div>
          <div className="text-sm text-gray-500">Gráficas de progreso</div>
        </button>
      </div>

      {/* Next Class Card */}
      {stats.next_class.has_reservation && (
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 text-white mb-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs opacity-90 uppercase font-medium mb-1">Próxima Clase</div>
              <h3 className="text-2xl font-black mb-2">{stats.next_class.class_name}</h3>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{stats.next_class.date && formatDate(stats.next_class.date)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{stats.next_class.time}</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => navigate('/classes/my-reservations')}
              className="px-6 py-3 bg-white text-orange-600 rounded-xl font-bold hover:shadow-2xl transition-all flex items-center gap-2"
            >
              Ver Detalles
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* No Active Membership */}
      {!stats.membership.is_active && (
        <div className="bg-white rounded-2xl border-2 border-gray-100 p-8 text-center">
          <CreditCard className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-900 mb-2">No tienes una membresía activa</h3>
          <p className="text-gray-500 mb-6">Contacta con recepción o renueva tu membresía para seguir entrenando</p>
          <button
            onClick={() => navigate('/memberships/renew')}
            className="px-6 py-3 bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-xl font-bold inline-flex items-center gap-2"
          >
            Renovar Membresía
          </button>
        </div>
      )}
    </div>
  );
}
