import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';

/**
 * AdminRoute - Protects routes that require admin access
 * 
 * Redirects to:
 * - /login if not authenticated
 * - /dashboard if authenticated but not admin
 */
export default function AdminRoute() {
  const { user, isAuthenticated } = useAuthStore();

  // Not logged in
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Logged in but not admin
  if (user?.role?.name !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  // Admin user - allow access
  return <Outlet />;
}
