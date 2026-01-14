import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import {
  LayoutDashboard,
  Users,
  CreditCard,
  Calendar,
  Dumbbell,
  TrendingUp,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  Zap,
} from 'lucide-react';
import { useState } from 'react';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Miembros', href: '/members', icon: Users },
  { name: 'Membresías', href: '/memberships', icon: CreditCard },
  { name: 'Clases', href: '/classes', icon: Calendar },
  { name: 'Entrenadores', href: '/staff', icon: Dumbbell },
  { name: 'Progreso', href: '/progress', icon: TrendingUp },
  { name: 'Configuración', href: '/settings', icon: Settings },
];

export default function MainLayout() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-screen bg-zinc-900 border-r border-zinc-800 transform transition-all duration-300 ${sidebarCollapsed ? 'w-20' : 'w-64'
          } ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          }`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-4 py-5 border-b border-zinc-800">
          {!sidebarCollapsed && (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/30">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-black text-white uppercase tracking-tight">GymPro</span>
            </div>
          )}

          {/* Collapse button - Desktop */}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="hidden lg:flex p-2 text-gray-400 hover:text-orange-500 hover:bg-zinc-800 rounded-lg transition-colors"
          >
            {sidebarCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
          </button>

          {/* Close button - Mobile */}
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 text-gray-400 hover:text-white rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="px-3 py-4 space-y-2">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-all group ${isActive
                  ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/30'
                  : 'text-gray-400 hover:text-white hover:bg-zinc-800'
                }`
              }
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {!sidebarCollapsed && <span>{item.name}</span>}
            </NavLink>
          ))}
        </nav>

        {/* User section at bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-zinc-800">
          {!sidebarCollapsed && user && (
            <div className="px-3 py-3 mb-2 rounded-lg bg-zinc-800/50">
              <p className="text-sm font-bold text-white truncate">{user.full_name}</p>
              <p className="text-xs text-gray-500 uppercase truncate">{user.role || 'Usuario'}</p>
            </div>
          )}

          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-3 w-full px-4 py-3 text-gray-400 hover:text-red-400 hover:bg-zinc-800 rounded-lg transition-all"
            title="Cerrar sesión"
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {!sidebarCollapsed && <span className="text-sm font-semibold">Cerrar sesión</span>}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div
        className={`min-h-screen transition-all duration-300 ${sidebarCollapsed ? 'ml-0 lg:ml-20' : 'ml-0 lg:ml-64'
          }`}
      >
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-zinc-900/80 backdrop-blur-xl border-b border-zinc-800">
          <div className="flex items-center justify-between px-4 lg:px-6 py-4">
            {/* Mobile menu button */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 text-gray-400 hover:text-white hover:bg-zinc-800 rounded-lg"
            >
              <Menu className="w-6 h-6" />
            </button>

            {/* Page title or search */}
            <div className="flex-1 lg:mx-4">
              <h2 className="text-lg font-bold text-white uppercase tracking-wide lg:hidden">
                GymPro
              </h2>
            </div>

            {/* Right section */}
            <div className="flex items-center gap-3">
              {/* User info */}
              <div className="flex items-center gap-3 px-3 py-2 bg-zinc-800 rounded-lg">
                <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-orange-500/30">
                  {user?.first_name?.charAt(0) || 'U'}
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm font-bold text-white">{user?.full_name || 'Admin Sistema'}</p>
                  <p className="text-xs text-gray-400 uppercase">{user?.role || 'Admin'}</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
