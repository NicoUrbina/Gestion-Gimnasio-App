import { Calendar, TrendingUp, Users, Activity } from 'lucide-react';
import StatsCard from '../shared/StatsCard';
import StatsGrid from '../shared/StatsGrid';

interface TrainerStatsGridProps {
  stats: {
    classes: {
      today: number;
      week: number;
    };
    clients: {
      total: number;
    };
    sessions: {
      month: number;
    };
  };
}

export default function TrainerStatsGrid({ stats }: TrainerStatsGridProps) {
  return (
    <StatsGrid columns={4}>
      <StatsCard
        title="Clases Hoy"
        value={stats.classes.today}
        icon={Calendar}
        color="orange"
      />
      
      <StatsCard
        title="Clases Esta Semana"
        value={stats.classes.week}
        subtitle="programadas"
        icon={TrendingUp}
        color="blue"
      />
      
      <StatsCard
        title="Mis Clientes"
        value={stats.clients.total}
        subtitle="asignados"
        icon={Users}
        color="green"
      />
      
      <StatsCard
        title="Sesiones del Mes"
        value={stats.sessions.month}
        icon={Activity}
        color="purple"
      />
    </StatsGrid>
  );
}
