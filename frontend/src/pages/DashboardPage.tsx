import { useEffect, useState } from 'react';
import {
  Users,
  CreditCard,
  TrendingUp,
  Calendar,
  ArrowUpRight,
  AlertTriangle,
  CheckCircle2,
  Activity,
  Clock,
  Zap,
} from 'lucide-react';
import api from '../services/api';

interface Stats {
  members: {
    total: number;
    active: number;
    inactive: number;
    expired: number;
    active_percentage: number;
  };
  payments: {
    month: { total: number; count: number };
    today: { total: number; count: number };
  };
}

interface ExpiringMember {
  member_id: number;
  name: string;
  email: string;
  end_date: string;
  days_remaining: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [expiring, setExpiring] = useState<ExpiringMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [membersRes, paymentsRes, expiringRes] = await Promise.all([
          api.get('/members/stats/'),
          api.get('/payments/stats/'),
          api.get('/members/expiring_soon/'),
        ]);

        setStats({
          members: membersRes.data,
          payments: paymentsRes.data,
        });
        setExpiring(expiringRes.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const statCards = [
    {
      title: 'Miembros Activos',
      value: stats?.members.active || 0,
      total: stats?.members.total || 0,
      icon: Users,
      gradient: 'from-orange-500 to-orange-600',
      change: stats?.members.active_percentage || 0,
    },
    {
      title: 'Ingresos del Mes',
      value: `$${(stats?.payments.month.total || 0).toLocaleString()}`,
      subtitle: `${stats?.payments.month.count || 0} pagos`,
      icon: CreditCard,
      gradient: 'from-emerald-500 to-emerald-600',
    },
    {
      title: 'Ingresos de Hoy',
      value: `$${(stats?.payments.today.total || 0).toLocaleString()}`,
      subtitle: `${stats?.payments.today.count || 0} pagos`,
      icon: TrendingUp,
      gradient: 'from-cyan-500 to-cyan-600',
    },
    {
      title: 'Por Vencer',
      value: expiring.length,
      subtitle: 'próximos 7 días',
      icon: Calendar,
      gradient: 'from-amber-500 to-amber-600',
      alert: expiring.length > 0,
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Container con max-width centrado */}
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">

        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-black text-white uppercase tracking-tight flex items-center gap-4 mb-3">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/30">
              <Zap className="text-white" size={24} />
            </div>
            Dashboard
          </h1>
          <p className="text-gray-400 text-sm uppercase tracking-wide ml-16">
            Resumen General del Gimnasio
          </p>
        </div>

        {/* Stats Grid - Más espaciado */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
          {statCards.map((stat, index) => (
            <div
              key={index}
              className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 hover:border-orange-500/50 transition-all group"
            >
              <div className="flex items-start justify-between mb-6">
                <div className={`p-4 rounded-xl bg-gradient-to-br ${stat.gradient} shadow-lg`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                {stat.alert && (
                  <span className="px-2.5 py-1 bg-amber-500/20 border border-amber-500/50 text-amber-400 text-xs font-bold rounded uppercase flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" />
                    Alerta
                  </span>
                )}
              </div>

              <div className="space-y-2">
                <p className="text-3xl font-black text-white">{stat.value}</p>
                <p className="text-sm text-gray-400 uppercase tracking-wider font-semibold">
                  {stat.title}
                </p>
                {stat.subtitle && (
                  <p className="text-xs text-gray-500">{stat.subtitle}</p>
                )}
                {stat.total && (
                  <p className="text-xs text-gray-500">de {stat.total} totales</p>
                )}
              </div>

              {stat.change !== undefined && (
                <div className="mt-6 pt-4 border-t border-zinc-800 flex items-center gap-2">
                  <ArrowUpRight className="w-4 h-4 text-emerald-500" />
                  <span className="text-sm font-bold text-emerald-400">{stat.change}%</span>
                  <span className="text-xs text-gray-500 uppercase">activos</span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Content Grid - Más espaciado */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mt-12">

          {/* Membresías por vencer */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
            <div className="px-7 py-5 border-b border-zinc-800 flex items-center justify-between">
              <h2 className="font-bold text-white text-lg uppercase tracking-wide flex items-center gap-3">
                <Calendar className="w-6 h-6 text-orange-500" />
                Membresías por Vencer
              </h2>
              <span className="px-3 py-1.5 bg-orange-500/20 border border-orange-500/50 text-orange-400 text-sm font-bold rounded-full">
                {expiring.length}
              </span>
            </div>

            <div className="divide-y divide-zinc-800">
              {expiring.length === 0 ? (
                <div className="px-7 py-16 text-center">
                  <CheckCircle2 className="w-16 h-16 mx-auto mb-4 text-emerald-500" />
                  <p className="text-gray-400 text-sm">No hay membresías por vencer esta semana</p>
                </div>
              ) : (
                expiring.slice(0, 5).map((member) => (
                  <div
                    key={member.member_id}
                    className="px-7 py-5 flex items-center justify-between hover:bg-zinc-800/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg shadow-orange-500/30">
                        {member.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-white mb-1">{member.name}</p>
                        <p className="text-xs text-gray-500">{member.email}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-lg font-bold ${member.days_remaining <= 2 ? 'text-red-400' : 'text-amber-400'}`}>
                        {member.days_remaining}
                      </p>
                      <p className="text-xs text-gray-500 uppercase">días</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Actividad Reciente */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
            <div className="px-7 py-5 border-b border-zinc-800">
              <h2 className="font-bold text-white text-lg uppercase tracking-wide flex items-center gap-3">
                <Activity className="w-6 h-6 text-orange-500" />
                Actividad de Hoy
              </h2>
            </div>
            <div className="p-7">
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <Activity className="w-16 h-16 mx-auto mb-4 text-gray-700" />
                  <p className="text-sm text-gray-500 uppercase tracking-wide">Gráfica próximamente</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions - Más espaciado y mejorado */}
        <div className="mt-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-8 shadow-2xl shadow-orange-500/30">
          <h3 className="font-black text-white text-xl mb-6 uppercase tracking-wide">
            Acciones Rápidas
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Nuevo Miembro', icon: Users },
              { label: 'Registrar Pago', icon: CreditCard },
              { label: 'Crear Clase', icon: Calendar },
              { label: 'Registrar Acceso', icon: Clock },
            ].map((action, index) => (
              <button
                key={index}
                className="flex flex-col items-center justify-center gap-3 px-6 py-6 bg-black/20 hover:bg-black/30 backdrop-blur-sm rounded-xl transition-all border border-white/10 hover:border-white/30 hover:scale-105"
              >
                <action.icon className="w-7 h-7 text-white" />
                <span className="text-sm font-bold text-white uppercase tracking-wide text-center leading-tight">
                  {action.label}
                </span>
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
