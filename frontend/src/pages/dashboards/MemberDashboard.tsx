import { useEffect, useState } from 'react';
import {
  Calendar,
  CreditCard,
  TrendingUp,
  Dumbbell,
  Loader2,
  CheckCircle2,
  Activity,
} from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import api from '../../services/api';
import StatsCard from '../../components/dashboards/StatsCard';
import QuickActions from '../../components/dashboards/QuickActions';

interface MemberStats {
  membership_status: string;
  days_remaining: number;
  my_reservations_count: number;
  classes_attended_month: number;
}

/**
 * Dashboard del Miembro
 * Vista enfocada en mi membresía, mis clases y mi progreso personal
 */
export default function MemberDashboard() {
  const { user } = useAuthStore();
  const [stats, setStats] = useState<MemberStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Usar el endpoint mejorado de stats
        const response = await api.get('/users/me/stats/');
        setStats({
          membership_status: response.data.membership_status || 'inactive',
          days_remaining: response.data.days_remaining || 0,
          my_reservations_count: response.data.upcoming_reservations || 0,
          classes_attended_month: response.data.classes_attended || 0,
        });
      } catch (error) {
        console.error('Error fetching member dashboard data:', error);
        // Datos por defecto en caso de error
        setStats({
          membership_status: 'inactive',
          days_remaining: 0,
          my_reservations_count: 0,
          classes_attended_month: 0,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const quickActions = [
    { label: 'Reservar Clase', icon: Calendar, href: '/classes' },
    { label: 'Ver Mi Progreso', icon: TrendingUp, href: '/progress' },
    { label: 'Mis Pagos', icon: CreditCard, href: '/payments/my-payments' },
    { label: 'Mi Entrenador', icon: Dumbbell, href: '/staff' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
      </div>
    );
  }

  const isExpiringSoon = (stats?.days_remaining || 0) <= 7;

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-8 shadow-xl shadow-orange-500/20">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white font-black text-2xl border-2 border-white/30">
            {user?.first_name?.charAt(0) || 'U'}
          </div>
          <div>
            <h1 className="text-3xl font-black text-white uppercase tracking-tight">
              ¡Hola, {user?.first_name || 'Atleta'}!
            </h1>
            <p className="text-orange-100 mt-1">¿Listo para tu entrenamiento de hoy?</p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatsCard
          title="Mi Membresía"
          value={stats?.days_remaining || 0}
          subtitle="días restantes"
          icon={CreditCard}
          color="from-orange-500 to-orange-600"
          alert={isExpiringSoon}
        />

        <StatsCard
          title="Clases Reservadas"
          value={stats?.my_reservations_count || 0}
          subtitle="próximas sesiones"
          icon={Calendar}
          color="from-cyan-500 to-cyan-600"
        />

        <StatsCard
          title="Clases este Mes"
          value={stats?.classes_attended_month || 0}
          subtitle="sesiones completadas"
          icon={Activity}
          color="from-emerald-500 to-emerald-600"
        />
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Mis Próximas Clases */}
        <div className="bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden">
          <div className="px-6 py-4 border-b border-zinc-800">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-white uppercase tracking-wide">Próximas Clases</h2>
              <span className="px-3 py-1 bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-bold rounded-full uppercase tracking-wide">
                {stats?.my_reservations_count || 0}
              </span>
            </div>
          </div>
          <div className="divide-y divide-zinc-800">
            {(stats?.my_reservations_count || 0) === 0 ? (
              <div className="px-6 py-12 text-center">
                <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-600" />
                <p className="text-gray-500 mb-3">No tienes clases reservadas</p>
                <a
                  href="/classes"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold rounded-lg transition-colors"
                >
                  <Calendar className="w-4 h-4" />
                  Reservar Clase
                </a>
              </div>
            ) : (
              <>
                <div className="px-6 py-4 hover:bg-zinc-800/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-white text-sm">Yoga Matutino</p>
                      <p className="text-xs text-gray-500">Con Daniela Muñoz</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-orange-400">Mañana, 08:00 AM</p>
                      <p className="text-xs text-gray-500">45 min</p>
                    </div>
                  </div>
                </div>
                <div className="px-6 py-4 hover:bg-zinc-800/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-white text-sm">Spinning</p>
                      <p className="text-xs text-gray-500">Con Valentina Morales</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-orange-400">Miércoles, 06:00 PM</p>
                      <p className="text-xs text-gray-500">50 min</p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Mi Progreso */}
        <div className="bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden">
          <div className="px-6 py-4 border-b border-zinc-800">
            <h2 className="font-bold text-white uppercase tracking-wide">Mi Progreso</h2>
          </div>
          <div className="p-6 space-y-4">
            {/* Progreso de Asistencia */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-gray-400">Asistencia Mensual</p>
                <p className="text-sm font-bold text-white">{stats?.classes_attended_month || 0}/12 clases</p>
              </div>
              <div className="w-full bg-zinc-800 rounded-full h-2 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-orange-500 to-orange-600 transition-all duration-500"
                  style={{ width: `${((stats?.classes_attended_month || 0) / 12) * 100}%` }}
                />
              </div>
            </div>

            {/* Racha Actual */}
            <div className="p-4 bg-gradient-to-br from-orange-500/10 to-orange-600/10 border border-orange-500/20 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center shadow-lg shadow-orange-500/30">
                  <Activity className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-black text-white">5 días</p>
                  <p className="text-xs text-gray-400 uppercase tracking-wide">Racha actual</p>
                </div>
              </div>
            </div>

            {/* Próximo Objetivo */}
            <div className="p-4 bg-zinc-800/50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <p className="text-sm font-semibold text-white">Objetivo de la Semana</p>
              </div>
              <p className="text-xs text-gray-400">Asistir a 3 clases esta semana (2/3)</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <QuickActions actions={quickActions} title="Acceso Rápido" />
    </div>
  );
}
