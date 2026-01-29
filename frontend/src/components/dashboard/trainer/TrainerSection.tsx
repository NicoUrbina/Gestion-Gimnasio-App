import { Calendar, Users, TrendingUp } from 'lucide-react';
import TrainerStatsGrid from './TrainerStatsGrid';
import MyClassesCard from './MyClassesCard';
import MyClientsCard from './MyClientsCard';
import QuickActions from '../shared/QuickActions';

interface TrainerSectionProps {
  stats: any; // TODO: Tipar correctamente
}

export default function TrainerSection({ stats }: TrainerSectionProps) {
  const quickActions = [
    { label: 'Mis Clases', href: '/classes', icon: Calendar, color: 'orange' as const },
    { label: 'Mis Clientes', href: '/trainer/clients', icon: Users, color: 'green' as const },
    { label: 'Ver Progreso', href: '/progress', icon: TrendingUp, color: 'blue' as const },
  ];

  return (
    <div className="space-y-6">
      {/* Trainer Stats */}
      <TrainerStatsGrid stats={stats} />

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* My Classes */}
        <MyClassesCard classes={stats.classes?.list || []} />

        {/* My Clients */}
        <MyClientsCard clients={stats.clients?.list || []} />
      </div>

      {/* Quick Actions */}
      <QuickActions actions={quickActions} title="Acceso Rápido" />
    </div>
  );
}
