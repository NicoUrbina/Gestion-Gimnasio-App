import { Calendar, TrendingUp, CreditCard, Dumbbell } from 'lucide-react';
import MemberStatsGrid from './MemberStatsGrid';
import MyUpcomingClasses from './MyUpcomingClasses';
import MyProgressSection from './MyProgressSection';
import QuickActions from '../shared/QuickActions';

interface MemberSectionProps {
  stats: any; // TODO: Tipar correctamente
}

export default function MemberSection({ stats }: MemberSectionProps) {
  const quickActions = [
    { label: 'Reservar Clase', href: '/classes', icon: Calendar, color: 'orange' as const },
    { label: 'Mi Progreso', href: '/progress', icon: TrendingUp, color: 'blue' as const },
    { label: 'Mis Pagos', href: '/payments/my-payments', icon: CreditCard, color: 'green' as const },
    { label: 'Mi Entrenador', href: '/trainer/contact', icon: Dumbbell, color: 'purple' as const },
  ];

  return (
    <div className="space-y-6">
      {/* Member Stats */}
      <MemberStatsGrid stats={stats} />

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Classes */}
        <MyUpcomingClasses classes={stats.reservations?.list || []} />

        {/* Progress Section */}
        <MyProgressSection stats={stats} />
      </div>

      {/* Quick Actions */}
      <QuickActions actions={quickActions} title="Acceso Rápido" />
    </div>
  );
}
