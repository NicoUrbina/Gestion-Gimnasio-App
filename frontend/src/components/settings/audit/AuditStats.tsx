import { useEffect, useState } from 'react';
import { auditService } from '../../../services/audit';
import type { AuditStats as AuditStatsType } from '../../../types/audit';
import {
  Activity,
  Users,
  AlertTriangle,
  TrendingUp,
  BarChart3,
} from 'lucide-react';

export default function AuditStats() {
  const [stats, setStats] = useState<AuditStatsType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const data = await auditService.getStats();
      setStats(data);
    } catch (error) {
      console.error('Error loading audit stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center text-gray-400 py-12">
        Error al cargar estadísticas
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          title="Hoy"
          value={stats.total_today}
          icon={Activity}
          color="blue"
        />
        <StatCard
          title="Esta Semana"
          value={stats.total_week}
          icon={TrendingUp}
          color="green"
        />
        <StatCard
          title="Este Mes"
          value={stats.total_month}
          icon={BarChart3}
          color="purple"
        />
        <StatCard
          title="Sesiones Activas"
          value={stats.active_sessions}
          icon={Users}
          color="cyan"
        />
        <StatCard
          title="Logins Fallidos"
          value={stats.failed_logins_today}
          icon={AlertTriangle}
          color="red"
          highlight={stats.failed_logins_today > 5}
        />
      </div>

      {/* Actions by Type */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-orange-500" />
          Acciones por Tipo (Últimos 30 días)
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Object.entries(stats.actions_by_type).map(([action, count]) => (
            <div
              key={action}
              className="bg-zinc-800/50 border border-zinc-700 rounded-lg p-4"
            >
              <div className="text-sm text-gray-400 mb-1">{action}</div>
              <div className="text-2xl font-bold text-white">{count}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Users */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Users className="w-5 h-5 text-orange-500" />
          Usuarios Más Activos (Últimos 30 días)
        </h3>
        <div className="space-y-3">
          {stats.top_users.slice(0, 10).map((user, index) => (
            <div
              key={user.user__email}
              className="flex items-center justify-between p-3 bg-zinc-800/50 border border-zinc-700 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {index + 1}
                </div>
                <div>
                  <div className="text-white font-medium">
                    {user.user__first_name} {user.user__last_name}
                  </div>
                  <div className="text-sm text-gray-400">{user.user__email}</div>
                </div>
              </div>
              <div className="text-xl font-bold text-orange-500">
                {user.count}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: number;
  icon: any;
  color: 'blue' | 'green' | 'purple' | 'cyan' | 'red';
  highlight?: boolean;
}

function StatCard({ title, value, icon: Icon, color, highlight }: StatCardProps) {
  const colors = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    purple: 'from-purple-500 to-purple-600',
    cyan: 'from-cyan-500 to-cyan-600',
    red: 'from-red-500 to-red-600',
  };

  return (
    <div
      className={`bg-zinc-900 border ${
        highlight ? 'border-red-500' : 'border-zinc-800'
      } rounded-xl p-6 ${highlight ? 'ring-2 ring-red-500/20' : ''}`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-400 text-sm mb-1">{title}</p>
          <p className="text-3xl font-bold text-white">{value.toLocaleString()}</p>
        </div>
        <div
          className={`p-3 bg-gradient-to-br ${colors[color]} rounded-xl shadow-lg`}
        >
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );
}
