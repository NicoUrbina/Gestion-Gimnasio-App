import { Users, CheckCircle, DollarSign, TrendingUp } from 'lucide-react';
import StatsCard from '../shared/StatsCard';
import StatsGrid from '../shared/StatsGrid';

interface SystemStatsGridProps {
  stats: {
    members: {
      total: number;
      active: number;
      inactive: number;
      expired: number;
    };
    revenue: {
      month: { total: number; count: number };
      today: { total: number; count: number };
    };
  };
}

export default function SystemStatsGrid({ stats }: SystemStatsGridProps) {
  const monthTotal = stats.revenue?.month?.total ?? 0;
  const todayTotal = stats.revenue?.today?.total ?? 0;
  const membersTotal = stats.members?.total ?? 0;
  const membersActive = stats.members?.active ?? 0;

  return (
    <StatsGrid columns={4}>
      <StatsCard
        title="Miembros Totales"
        value={membersTotal}
        icon={Users}
        color="blue"
      />

      <StatsCard
        title="Miembros Activos"
        value={membersActive}
        subtitle={membersTotal > 0 ? `${((membersActive / membersTotal) * 100).toFixed(0)}% del total` : '0% del total'}
        icon={CheckCircle}
        color="green"
      />

      <StatsCard
        title="Ingresos del Mes"
        value={`$${monthTotal.toLocaleString()}`}
        icon={DollarSign}
        color="emerald"
      />

      <StatsCard
        title="Ingresos Hoy"
        value={`$${todayTotal.toLocaleString()}`}
        icon={TrendingUp}
        color="orange"
      />
    </StatsGrid>
  );
}
