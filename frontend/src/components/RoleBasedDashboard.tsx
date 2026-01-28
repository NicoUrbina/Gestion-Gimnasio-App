import { useAuthStore } from '../stores/authStore';
import AdminDashboard from '../pages/dashboards/AdminDashboard';
import StaffDashboard from '../pages/dashboards/StaffDashboard';
import TrainerDashboard from '../pages/dashboards/TrainerDashboard';
import MemberDashboard from '../pages/dashboards/MemberDashboard';

/**
 * Componente que renderiza el dashboard correcto según el rol del usuario
 * Soporta roles: admin, staff, trainer, member
 */
export default function RoleBasedDashboard() {
  const { user } = useAuthStore();
  
  // Si no hay usuario autenticado, mostrar dashboard de member por defecto
  if (!user || !user.role) {
    return <MemberDashboard />;
  }

  // Renderizar dashboard según el rol
  switch (user.role.toLowerCase()) {
    case 'admin':
      return <AdminDashboard />;
    
    case 'staff':
      return <StaffDashboard />;
    
    case 'trainer':
      return <TrainerDashboard />;
    
    case 'member':
      return <MemberDashboard />;
    
    default:
      // Por defecto, mostrar dashboard de member
      return <MemberDashboard />;
  }
}
