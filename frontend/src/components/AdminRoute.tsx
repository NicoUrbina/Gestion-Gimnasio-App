import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';

/**
 * Componente para proteger rutas que solo pueden ser accedidas por administradores.
 * Redirige al dashboard si el usuario no tiene rol de admin.
 */
export default function AdminRoute() {
  const { user, isAuthenticated } = useAuthStore();

  // Si no está autenticado, redirigir al login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Verificar si el usuario es admin
  const isAdmin = user?.role?.toLowerCase() === 'admin' || 
                  user?.role?.toLowerCase() === 'administrador';

  if (!isAdmin) {
    // Redirigir al dashboard si no es admin
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
