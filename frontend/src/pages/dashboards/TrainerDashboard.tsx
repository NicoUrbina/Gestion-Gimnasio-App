import { useEffect, useState } from 'react';
import {
  Calendar,
  Users,
  TrendingUp,
  Dumbbell,
  Loader2,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import api from '../../services/api';
import StatsCard from '../../components/dashboards/StatsCard';
import QuickActions from '../../components/dashboards/QuickActions';

interface TrainerStats {
  my_classes_today: number;
  my_classes_week: number;
  assigned_clients: number;
}

/**
 * Dashboard del Entrenador
 * Vista enfocada en clases y clientes asignados
 */
export default function TrainerDashboard() {
  const [stats, setStats] = useState<TrainerStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Llamar al endpoint real de trainers
        const response = await api.get('/staff/my-stats/');
        setStats(response.data);
      } catch (error) {
        console.error('Error fetching trainer dashboard data:', error);
        // Fallback a datos por defecto en caso de error
        setStats({
          my_classes_today: 0,
          my_classes_week: 0,
          assigned_clients: 0,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const quickActions = [
    { label: 'Ver Mis Clases', icon: Calendar, href: '/classes' },
    { label: 'Mis Clientes', icon: Users, href: '/members' },
    { label: 'Crear Rutina', icon: Dumbbell, href: '/progress' },
    { label: 'Ver Progreso', icon: TrendingUp, href: '/progress' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-white uppercase tracking-tight">
          Mi Dashboard
        </h1>
        <p className="text-gray-400 mt-1">Gestión de clases y clientes</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatsCard
          title="Clases de Hoy"
          value={stats?.my_classes_today || 0}
          subtitle="sesiones programadas"
          icon={Calendar}
          color="from-orange-500 to-orange-600"
        />

        <StatsCard
          title="Clases esta Semana"
          value={stats?.my_classes_week || 0}
          subtitle="total de sesiones"
          icon={Clock}
          color="from-cyan-500 to-cyan-600"
        />

        <StatsCard
          title="Clientes Asignados"
          value={stats?.assigned_clients || 0}
          subtitle="bajo mi supervisión"
          icon={Users}
          color="from-emerald-500 to-emerald-600"
        />
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Clases de Hoy */}
        <div className="bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden">
          <div className="px-6 py-4 border-b border-zinc-800">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-white uppercase tracking-wide">Mis Clases de Hoy</h2>
              <span className="px-3 py-1 bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-bold rounded-full uppercase tracking-wide">
                {stats?.my_classes_today || 0}
              </span>
            </div>
          </div>
          <div className="divide-y divide-zinc-800">
            {(stats?.my_classes_today || 0) === 0 ? (
              <div className="px-6 py-12 text-center">
                <CheckCircle2 className="w-12 h-12 mx-auto mb-3 text-emerald-400" />
                <p className="text-gray-500">No hay clases programadas para hoy</p>
              </div>
            ) : (
              <>
                <div className="px-6 py-4 hover:bg-zinc-800/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-white text-sm">CrossFit Matutino</p>
                      <p className="text-xs text-gray-500">15 participantes</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-orange-400">07:00 AM</p>
                      <p className="text-xs text-gray-500">60 min</p>
                    </div>
                  </div>
                </div>
                <div className="px-6 py-4 hover:bg-zinc-800/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-white text-sm">Entrenamiento Funcional</p>
                      <p className="text-xs text-gray-500">12 participantes</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-orange-400">10:00 AM</p>
                      <p className="text-xs text-gray-500">45 min</p>
                    </div>
                  </div>
                </div>
                <div className="px-6 py-4 hover:bg-zinc-800/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-white text-sm">Fuerza Avanzada</p>
                      <p className="text-xs text-gray-500">8 participantes</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-orange-400">05:00 PM</p>
                      <p className="text-xs text-gray-500">60 min</p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Clientes Destacados */}
        <div className="bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden">
          <div className="px-6 py-4 border-b border-zinc-800">
            <h2 className="font-bold text-white uppercase tracking-wide">
              Clientes con Mejor Progreso
            </h2>
          </div>
          <div className="divide-y divide-zinc-800">
            <div className="px-6 py-4 hover:bg-zinc-800/50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-emerald-500/30">
                  J
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-white text-sm">Juan García</p>
                  <p className="text-xs text-gray-500">+5 kg en fuerza</p>
                </div>
                <TrendingUp className="w-5 h-5 text-emerald-400" />
              </div>
            </div>
            <div className="px-6 py-4 hover:bg-zinc-800/50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-emerald-500/30">
                  M
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-white text-sm">María Rodríguez</p>
                  <p className="text-xs text-gray-500">-3 kg grasa corporal</p>
                </div>
                <TrendingUp className="w-5 h-5 text-emerald-400" />
              </div>
            </div>
            <div className="px-6 py-4 hover:bg-zinc-800/50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-emerald-500/30">
                  C
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-white text-sm">Carlos Martínez</p>
                  <p className="text-xs text-gray-500">Récord en sentadilla</p>
                </div>
                <TrendingUp className="w-5 h-5 text-emerald-400" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <QuickActions actions={quickActions} title="Herramientas de Entrenador" />
    </div>
  );
}
