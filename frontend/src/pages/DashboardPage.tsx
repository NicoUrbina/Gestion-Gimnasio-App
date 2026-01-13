```javascript
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  CreditCard,
  TrendingUp,
  Calendar,
  DollarSign,
  Clock,
  Loader2,
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
        const [membersRes, paymentsRes, expiringRes, chartsRes] = await Promise.all([
          api.get('/members/stats/'),
          api.get('/payments/stats/'),
          api.get('/members/expiring_soon/'),
          paymentService.getChartData(),
        ]);
        
        setStats({
          members: membersRes.data,
          payments: paymentsRes.data,
        });
        setExpiring(expiringRes.data);
        setChartData(chartsRes);
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
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      change: stats?.members.active_percentage || 0,
      changeType: 'positive' as const,
    },
    {
      title: 'Ingresos del Mes',
      value: `$${(stats?.payments.month.total || 0).toLocaleString()}`,
      subtitle: `${stats?.payments.month.count || 0} pagos`,
      icon: CreditCard,
      color: 'from-emerald-500 to-emerald-600',
      bgColor: 'bg-emerald-50',
    },
    {
      title: 'Ingresos de Hoy',
      value: `$${(stats?.payments.today.total || 0).toLocaleString()}`,
      subtitle: `${stats?.payments.today.count || 0} pagos`,
      icon: TrendingUp,
      color: 'from-cyan-500 to-cyan-600',
      bgColor: 'bg-cyan-50',
    },
    {
      title: 'Por Vencer',
      value: expiring.length,
      subtitle: 'próximos 7 días',
      icon: Calendar,
      color: 'from-amber-500 to-amber-600',
      bgColor: 'bg-amber-50',
      alert: expiring.length > 0,
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-500 mt-1">Resumen general del gimnasio</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl p-5 border border-slate-200 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                <stat.icon className={`w-6 h-6 bg-gradient-to-r ${stat.color} bg-clip-text`} style={{ color: stat.color.includes('purple') ? '#a855f7' : stat.color.includes('emerald') ? '#10b981' : stat.color.includes('cyan') ? '#06b6d4' : '#f59e0b' }} />
              </div>
              {stat.alert && (
                <span className="px-2 py-1 bg-amber-100 text-amber-700 text-xs font-medium rounded-full flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" />
                  Atención
                </span>
              )}
            </div>
            <div className="mt-4">
              <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
              <p className="text-sm text-slate-500 mt-1">
                {stat.subtitle || (stat.total ? `de ${stat.total} totales` : '')}
              </p>
            </div>
            {stat.change !== undefined && (
              <div className="mt-3 flex items-center gap-1">
                {stat.changeType === 'positive' ? (
                  <ArrowUpRight className="w-4 h-4 text-emerald-500" />
                ) : (
                  <ArrowDownRight className="w-4 h-4 text-red-500" />
                )}
                <span className={`text-sm font-medium ${stat.changeType === 'positive' ? 'text-emerald-600' : 'text-red-600'}`}>
                  {stat.change}%
                </span>
                <span className="text-sm text-slate-400">activos</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Membresías por vencer */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-slate-900">Membresías por Vencer</h2>
              <span className="px-2 py-1 bg-amber-100 text-amber-700 text-xs font-medium rounded-full">
                {expiring.length} miembros
              </span>
            </div>
          </div>
          <div className="divide-y divide-slate-100">
            {expiring.length === 0 ? (
              <div className="px-5 py-8 text-center text-slate-400">
                <CheckCircle2 className="w-12 h-12 mx-auto mb-3 text-emerald-400" />
                <p>No hay membresías por vencer esta semana</p>
              </div>
            ) : (
              expiring.slice(0, 5).map((member) => (
                <div key={member.member_id} className="px-5 py-3 flex items-center justify-between hover:bg-slate-50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                      {member.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium text-slate-900 text-sm">{member.name}</p>
                      <p className="text-xs text-slate-400">{member.email}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-medium ${member.days_remaining <= 2 ? 'text-red-600' : 'text-amber-600'}`}>
                      {member.days_remaining} días
                    </p>
                    <p className="text-xs text-slate-400">restantes</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Actividad Reciente */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100">
            <h2 className="font-semibold text-slate-900">Actividad de Hoy</h2>
          </div>
          <div className="p-5">
            <div className="flex items-center justify-center h-48 text-slate-400">
              <div className="text-center">
                <Activity className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                <p className="text-sm">Gráfica de actividad próximamente</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-r from-purple-600 to-cyan-600 rounded-2xl p-6 text-white">
        <h3 className="font-semibold text-lg mb-4">Acciones Rápidas</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'Nuevo Miembro', icon: Users },
            { label: 'Registrar Pago', icon: CreditCard },
            { label: 'Crear Clase', icon: Calendar },
            { label: 'Registrar Acceso', icon: Clock },
          ].map((action, index) => (
            <button
              key={index}
              className="flex items-center gap-2 px-4 py-3 bg-white/20 hover:bg-white/30 rounded-xl transition-colors"
            >
              <action.icon className="w-5 h-5" />
              <span className="text-sm font-medium">{action.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
