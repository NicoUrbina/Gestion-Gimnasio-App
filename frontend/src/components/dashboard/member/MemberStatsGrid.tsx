import { CreditCard, Calendar, Activity, Flame } from 'lucide-react';
import StatsCard from '../shared/StatsCard';
import StatsGrid from '../shared/StatsGrid';

interface MemberStatsGridProps {
  stats: {
    membership: {
      days_remaining: number;
      expiring_soon: boolean;
    };
    reservations: {
      upcoming: number;
    };
    attendance: {
      month: number;
    };
    streak: {
      days: number;
    };
  };
}

export default function MemberStatsGrid({ stats }: MemberStatsGridProps) {
  return (
    <StatsGrid columns={4}>
      <StatsCard
        title="Mi Membresía"
        value={stats.membership.days_remaining}
        subtitle="días restantes"
        icon={CreditCard}
        color="orange"
        alert={stats.membership.expiring_soon}
      />
      
      <StatsCard
        title="Clases Reservadas"
        value={stats.reservations.upcoming}
        subtitle="próximas sesiones"
        icon={Calendar}
        color="cyan"
      />
      
      <StatsCard
        title="Clases este Mes"
        value={stats.attendance.month}
        subtitle="sesiones completadas"
        icon={Activity}
        color="emerald"
      />
      
      <StatsCard
        title="Racha Actual"
        value={`${stats.streak.days} 🔥`}
        subtitle="días consecutivos"
        icon={Flame}
        color="red"
      />
    </StatsGrid>
  );
}
