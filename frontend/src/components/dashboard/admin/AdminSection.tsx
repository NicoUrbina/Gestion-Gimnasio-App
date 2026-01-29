import { UserPlus, CreditCard, Calendar, FileText } from 'lucide-react';
import SystemStatsGrid from './SystemStatsGrid';
import ExpiringMembershipsCard from './ExpiringMembershipsCard';
import QuickActions from '../shared/QuickActions';

interface AdminSectionProps {
  stats: any; // TODO: Tipar correctamente según API
}

export default function AdminSection({ stats }: AdminSectionProps) {
  const quickActions = [
    { label: 'Nuevo Miembro', href: '/members/new', icon: UserPlus, color: 'blue' as const },
    { label: 'Registrar Pago', href: '/payments/new', icon: CreditCard, color: 'green' as const },
    { label: 'Crear Clase', href: '/classes/new', icon: Calendar, color: 'orange' as const },
    { label: 'Ver Auditoría', href: '/settings/audit', icon: FileText, color: 'purple' as const },
  ];

  return (
    <div className="space-y-6">
      {/* System Stats */}
      <SystemStatsGrid stats={stats} />

      {/* Expiring Memberships Alert */}
      <ExpiringMembershipsCard memberships={stats.expiring || []} />

      {/* Quick Actions */}
      <QuickActions actions={quickActions} title="Acciones Administrativas" />
    </div>
  );
}
