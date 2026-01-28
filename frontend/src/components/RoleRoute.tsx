import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';

interface RoleRouteProps {
    allowedRoles: Array<'admin' | 'staff' | 'trainer' | 'member'>;
    redirectTo?: string;
}

/**
 * RoleRoute - Protects routes based on allowed roles
 * 
 * @param allowedRoles - Array of role names that can access this route
 * @param redirectTo - Where to redirect if access is denied (default: /dashboard)
 * 
 * Example:
 * <Route element={<RoleRoute allowedRoles={['admin', 'staff']} />}>
 *   <Route path="/members" element={<MembersPage />} />
 * </Route>
 */
export default function RoleRoute({ allowedRoles, redirectTo = '/dashboard' }: RoleRouteProps) {
    const { user, isAuthenticated } = useAuthStore();

    // Not logged in
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // Logged in but role not allowed
    if (!user?.role || !allowedRoles.includes(user.role.name)) {
        return <Navigate to={redirectTo} replace />;
    }

    // User has allowed role - grant access
    return <Outlet />;
}
