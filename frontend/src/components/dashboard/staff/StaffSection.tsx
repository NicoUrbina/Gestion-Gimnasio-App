import { CreditCard, UserPlus, Calendar, CheckSquare } from 'lucide-react';
import DailyStatsGrid from './DailyStatsGrid';
import TodayClassesCard from './TodayClassesCard';
import QuickActions from '../shared/QuickActions';

interface StaffSectionProps {
  stats: any; // TODO: Tipar correctamente
}

export default function StaffSection({ stats }: StaffSectionProps) {
  const quickActions = [
    { label: 'Registrar Pago', href: '/payments/new', icon: CreditCard, color: 'green' as const },
    { label: 'Nuevo Miembro', href: '/members/new', icon: UserPlus, color: 'blue' as const },
    { label: 'Asignar Membresía', href: '/memberships/assign', icon: CheckSquare, color: 'purple' as const },
    { label: 'Ver Clases', href: '/classes', icon: Calendar, color: 'orange' as const },
  ];

  return (
    <div className="space-y-6">
      {/* Daily Stats */}
      <DailyStatsGrid stats={stats} />

      {/* Today's Classes */}
      <TodayClassesCard classes={stats.classes || []} />

      {/* Quick Actions */}
      <QuickActions actions={quickActions} title="Operaciones Rápidas" />
    </div>
  );
}
