import { useAuthStore } from '../stores/authStore';
import DashboardPage from '../pages/DashboardPage';  // Dashboard admin con stats del gimnasio
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
  if (!user || !user.role_name) {
    return <MemberDashboard />;
  }

  // Renderizar dashboard según el rol del usuario
  // El backend retorna role_name como string directamente
  const roleName = user.role_name.toLowerCase();

  switch (roleName) {
    case 'admin':
      return <DashboardPage />;  // Dashboard admin con estadísticas del gimnasio

    case 'staff':
      return <StaffDashboard />;

    case 'trainer':
      return <TrainerDashboard />;

    case 'member':
    default:
      return <MemberDashboard />;
  }
}
