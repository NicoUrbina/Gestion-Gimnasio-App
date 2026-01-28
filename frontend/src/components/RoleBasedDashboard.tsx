import { useAuthStore } from '../stores/authStore';
import DashboardPage from '../pages/DashboardPage';
import StaffDashboard from '../pages/dashboards/StaffDashboard';
import TrainerDashboard from '../pages/dashboards/TrainerDashboard';
import MemberDashboard from '../pages/dashboards/MemberDashboard';

/**
 * Componente que renderiza el dashboard correcto según el rol del usuario
 * Soporta roles: admin, staff, trainer, member
 */
export default function RoleBasedDashboard() {
  const { user } = useAuthStore();
  
  // Si no hay usuario, mostrar dashboard de member por defecto
  if (!user || !user.role) {
    return <MemberDashboard />;
  }

  // Renderizar dashboard según el rol del usuario
  const roleName = user.role.name?.toLowerCase() || 'member';

  switch (roleName) {
    case 'admin':
      return <DashboardPage />;
    
    case 'staff':
      return <StaffDashboard />;
    
    case 'trainer':
      return <TrainerDashboard />;
    
    case 'member':
    default:
      return <MemberDashboard />;
  }
}
