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
      month: number;
      today: number;
    };
  };
}

export default function SystemStatsGrid({ stats }: SystemStatsGridProps) {
  return (
    <StatsGrid columns={4}>
      <StatsCard
        title="Miembros Totales"
        value={stats.members.total}
        icon={Users}
        color="blue"
      />
      
      <StatsCard
        title="Miembros Activos"
        value={stats.members.active}
        subtitle={`${((stats.members.active / stats.members.total) * 100).toFixed(0)}% del total`}
        icon={CheckCircle}
        color="green"
      />
      
      <StatsCard
        title="Ingresos del Mes"
        value={`$${stats.revenue.month.toLocaleString()}`}
        icon={DollarSign}
        color="emerald"
      />
      
      <StatsCard
        title="Ingresos Hoy"
        value={`$${stats.revenue.today.toLocaleString()}`}
        icon={TrendingUp}
        color="orange"
      />
    </StatsGrid>
  );
}
