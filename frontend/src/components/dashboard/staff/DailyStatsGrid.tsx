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
  // Safe defaults to prevent crashes when stats is null/undefined
  const paymentsToday = stats?.payments?.today ?? 0;
  const reservationsToday = stats?.reservations?.today ?? 0;
  const newMembers = stats?.members?.newThisMonth ?? 0;
  const pendingRenewals = stats?.renewals?.pending ?? 0;

  return (
    <StatsGrid columns={4}>
      <StatsCard
        title="Pagos Hoy"
        value={`$${paymentsToday.toLocaleString()}`}
        icon={DollarSign}
        color="green"
      />

      <StatsCard
        title="Reservas Hoy"
        value={reservationsToday}
        subtitle="clases reservadas"
        icon={Calendar}
        color="blue"
      />

      <StatsCard
        title="Miembros Nuevos (Mes)"
        value={newMembers}
        icon={UserPlus}
        color="purple"
      />

      <StatsCard
        title="Renovaciones Pendientes"
        value={pendingRenewals}
        icon={AlertCircle}
        color="orange"
        alert={pendingRenewals > 0}
      />
    </StatsGrid>
  );
}
