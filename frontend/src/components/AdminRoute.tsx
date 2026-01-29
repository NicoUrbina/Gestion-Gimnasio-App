import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';

/**
 * AdminRoute - Protects routes that require admin access
 * 
 * Uses role_name field from backend for role verification
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
  // Backend sends role_name as a string field
  if (user?.role_name !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  // Admin user - allow access
  return <Outlet />;
}
