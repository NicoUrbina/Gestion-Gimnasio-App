import { DollarSign, Calendar, UserPlus, AlertCircle } from 'lucide-react';
import StatsCard from '../shared/StatsCard';
import StatsGrid from '../shared/StatsGrid';

interface DailyStatsGridProps {
  stats: {
    payments: {
      today: number;
    };
    reservations: {
      today: number;
    };
    members: {
      newThisMonth: number;
    };
    renewals: {
      pending: number;
    };
  };
}

export default function DailyStatsGrid({ stats }: DailyStatsGridProps) {
  return (
    <StatsGrid columns={4}>
      <StatsCard
        title="Pagos Hoy"
        value={`$${stats.payments.today.toLocaleString()}`}
        icon={DollarSign}
        color="green"
      />
      
      <StatsCard
        title="Reservas Hoy"
        value={stats.reservations.today}
        subtitle="clases reservadas"
        icon={Calendar}
        color="blue"
      />
      
      <StatsCard
        title="Miembros Nuevos (Mes)"
        value={stats.members.newThisMonth}
        icon={UserPlus}
        color="purple"
      />
      
      <StatsCard
        title="Renovaciones Pendientes"
        value={stats.renewals.pending}
        icon={AlertCircle}
        color="orange"
        alert={stats.renewals.pending > 0}
      />
    </StatsGrid>
  );
}
