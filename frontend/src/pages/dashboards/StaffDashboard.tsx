import { useEffect, useState } from 'react';
import {
  Users,
  CreditCard,
  DollarSign,
  Calendar,
  Loader2,
  CheckCircle2,
  Clock,
} from 'lucide-react';
import api from '../../services/api';
import StatsCard from '../../components/dashboards/StatsCard';
import QuickActions from '../../components/dashboards/QuickActions';

interface Stats {
  members: {
    total: number;
    active: number;
  };
  payments: {
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

/**
 * Dashboard del Staff
 * Enfocado en operaciones diarias: membresías, pagos y asistencia
 */
export default function StaffDashboard() {
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

  const quickActions = [
    { label: 'Registrar Pago', icon: DollarSign, href: '/payments/new' },
    { label: 'Asignar Membresía', icon: CreditCard, href: '/memberships/assign' },
    { label: 'Registrar Acceso', icon: Clock, href: '/members' },
    { label: 'Ver Clases', icon: Calendar, href: '/classes' },
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
          Dashboard de Personal
        </h1>
        <p className="text-gray-400 mt-1">Gestión de operaciones diarias</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatsCard
          title="Miembros Activos"
          value={stats?.members.active || 0}
          total={stats?.members.total || 0}
          icon={Users}
          color="from-orange-500 to-orange-600"
        />

        <StatsCard
          title="Ingresos de Hoy"
          value={`$${(stats?.payments.today.total || 0).toLocaleString()}`}
          subtitle={`${stats?.payments.today.count || 0} pagos`}
          icon={DollarSign}
          color="from-emerald-500 to-emerald-600"
        />

        <StatsCard
          title="Membresías por Renovar"
          value={expiring.length}
          subtitle="próximos 7 días"
          icon={Calendar}
          color="from-amber-500 to-amber-600"
          alert={expiring.length > 0}
        />
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Renovaciones Pendientes */}
        <div className="bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden">
          <div className="px-6 py-4 border-b border-zinc-800">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-white uppercase tracking-wide">
                Renovaciones Pendientes
              </h2>
              <span className="px-3 py-1 bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-bold rounded-full uppercase tracking-wide">
                {expiring.length}
              </span>
            </div>
          </div>
          <div className="divide-y divide-zinc-800 max-h-96 overflow-y-auto">
            {expiring.length === 0 ? (
              <div className="px-6 py-12 text-center">
                <CheckCircle2 className="w-12 h-12 mx-auto mb-3 text-emerald-400" />
                <p className="text-gray-500">Todas las membresías están al día</p>
              </div>
            ) : (
              expiring.map((member) => (
                <div
                  key={member.member_id}
                  className="px-6 py-4 flex items-center justify-between hover:bg-zinc-800/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-orange-500/30">
                      {member.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-white text-sm">{member.name}</p>
                      <p className="text-xs text-gray-500">{member.email}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p
                      className={`text-sm font-bold ${
                        member.days_remaining <= 2 ? 'text-red-400' : 'text-amber-400'
                      }`}
                    >
                      {member.days_remaining} días
                    </p>
                    <p className="text-xs text-gray-500">restantes</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Tareas del Día */}
        <div className="bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden">
          <div className="px-6 py-4 border-b border-zinc-800">
            <h2 className="font-bold text-white uppercase tracking-wide">Tareas de Hoy</h2>
          </div>
          <div className="p-6 space-y-3">
            <div className="flex items-center gap-3 p-3 bg-zinc-800/50 rounded-lg">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              <p className="text-sm text-gray-300">Revisar pagos pendientes</p>
            </div>
            <div className="flex items-center gap-3 p-3 bg-zinc-800/50 rounded-lg">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              <p className="text-sm text-gray-300">Contactar renovaciones vencidas</p>
            </div>
            <div className="flex items-center gap-3 p-3 bg-zinc-800/50 rounded-lg">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              <p className="text-sm text-gray-300">Confirmar clases de mañana</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <QuickActions actions={quickActions} title="Acceso Rápido" />
    </div>
  );
}
