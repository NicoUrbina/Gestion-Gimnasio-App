import { Outlet, NavLink, useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import {
  LayoutDashboard,
  Users,
  CreditCard,
  DollarSign,
  Calendar,
  Dumbbell,
  TrendingUp,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useState } from 'react';


const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, allowedRoles: ['admin', 'staff', 'trainer', 'member'] },
  { name: 'Miembros', href: '/members', icon: Users, allowedRoles: ['admin', 'staff'] },
  { name: 'Membresías', href: '/memberships', icon: CreditCard, allowedRoles: ['admin', 'staff'] },
  { name: 'Pagos', href: '/payments', icon: DollarSign, allowedRoles: ['admin', 'staff'] },
  { name: 'Clases', href: '/classes', icon: Calendar, allowedRoles: ['admin', 'staff', 'trainer', 'member'] },
  { name: 'Entrenadores', href: '/trainers', icon: Dumbbell, allowedRoles: ['admin', 'staff'] },
  { name: 'Progreso', href: '/progress', icon: TrendingUp, allowedRoles: ['admin', 'trainer', 'member'] },
  { name: 'Configuración', href: '/settings', icon: Settings, allowedRoles: ['admin'] },
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

  // Filter navigation based on user role
  const userRole = user?.role_name || '';

  const visibleNavigation = navigation.filter(item =>
    item.allowedRoles.includes(userRole)
  );

  return (
    <div className="min-h-screen bg-[#0a0a0b] font-sans selection:bg-orange-600/30">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-md z-[60] lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-[70] h-screen bg-[#0a0a0b] border-r border-white/5 transform transition-all duration-500 ease-in-out ${sidebarCollapsed ? 'w-24' : 'w-72'
          } ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        {/* Logo Section */}
        <div className="flex items-center justify-between px-6 py-8">
          {!sidebarCollapsed && (
            <Link to="/" className="flex items-center gap-3 animate-in fade-in duration-500 hover:opacity-80 transition-opacity">
              <img src="/Img/nexo-logo.png" alt="NEXO" className="h-12 w-auto object-contain brightness-110" />
            </Link>
          )}

          {sidebarCollapsed && (
            <Link to="/" className="mx-auto hover:opacity-80 transition-opacity">
              <img src="/Img/nexo-logo.png" alt="NEXO" className="h-8 w-auto object-contain" />
            </Link>
          )}

          {/* Close button - Mobile */}
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 text-gray-400 hover:text-white rounded-xl bg-white/5"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="px-4 py-6 space-y-1.5 overflow-y-auto h-[calc(100vh-200px)] custom-scrollbar">
          {visibleNavigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-4 px-4 py-3.5 rounded-2xl text-[13px] font-black uppercase tracking-widest transition-all group ${isActive
                  ? 'bg-orange-600 text-white shadow-xl shadow-orange-600/20 active:scale-95'
                  : 'text-gray-500 hover:text-white hover:bg-white/5'
                }`
              }
            >
              <item.icon className="w-5 h-5 flex-shrink-0 transition-transform group-hover:scale-110" />
              {!sidebarCollapsed && <span>{item.name}</span>}
            </NavLink>
          ))}
        </nav>

        {/* User context at bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/5 bg-[#0a0a0b]">
          {!sidebarCollapsed && user && (
            <div className="px-4 py-4 mb-4 rounded-3xl bg-white/5 border border-white/5 animate-in slide-in-from-bottom-2 duration-500">
              <p className="text-xs font-black text-white uppercase tracking-tighter truncate mb-0.5">{user.full_name}</p>
              <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest truncate">{user.role_name || 'Nexo Member'}</p>
            </div>
          )}

          <button
            onClick={handleLogout}
            className={`flex items-center gap-4 w-full px-4 py-3.5 text-gray-500 hover:text-red-500 hover:bg-red-500/5 rounded-2xl transition-all group ${sidebarCollapsed ? 'justify-center' : ''
              }`}
            title="Sincronizar Salida"
          >
            <LogOut className="w-5 h-5 flex-shrink-0 transition-transform group-hover:rotate-12" />
            {!sidebarCollapsed && <span className="text-[10px] font-black uppercase tracking-[0.2em]">Cerrar Sesión</span>}
          </button>
        </div>
      </aside>

      {/* Collapse button - Floating Desktop */}
      <button
        onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
        className={`hidden lg:flex fixed z-[80] bottom-10 p-3 bg-[#0a0a0b] border border-white/10 text-gray-500 hover:text-orange-500 rounded-full shadow-2xl transition-all hover:scale-110 active:scale-90 ${sidebarCollapsed ? 'left-[4.5rem]' : 'left-[16.5rem]'
          }`}
      >
        {sidebarCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
      </button>

      {/* Main content viewport */}
      <div
        className={`min-h-screen transition-all duration-500 ease-in-out ${sidebarCollapsed ? "lg:pl-24" : "lg:pl-72"
          }`}
      >
        {/* Top bar refinement */}
        <header className="sticky top-0 z-40 bg-[#0a0a0b]/60 backdrop-blur-2xl border-b border-white/5">
          <div className="flex items-center justify-between px-6 lg:px-10 h-24">
            {/* Mobile interaction */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-3 text-gray-400 hover:text-white bg-white/5 rounded-xl transition-all"
            >
              <Menu className="w-6 h-6" />
            </button>

            <Link to="/" className="lg:hidden flex-1 flex justify-center hover:opacity-80 transition-opacity">
              <img src="/Img/nexo-logo.png" alt="NEXO" className="h-10 w-auto object-contain" />
            </Link>

            {/* View Context */}
            <div className="hidden lg:flex items-center gap-4">
              <div className="h-1 w-1 rounded-full bg-orange-600 animate-pulse"></div>
              <span className="text-[10px] font-black text-white uppercase tracking-[0.3em]">Operational Panel</span>
            </div>

            {/* Actions & Profile */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-4 pl-4 border-l border-white/5">
                <div className="hidden md:block text-right">
                  <p className="text-[11px] font-black text-white uppercase tracking-tighter leading-none mb-1">{user?.full_name?.split(' ')[0] || 'Admin'}</p>
                  <p className="text-[9px] text-orange-600 font-black uppercase tracking-[0.2em]">Active Session</p>
                </div>
                <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-white font-black text-lg shadow-xl group cursor-pointer hover:border-orange-600/50 transition-all">
                  {user?.full_name?.charAt(0) || 'N'}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Page Layer */}
        <main className="p-6 lg:p-10 animate-in fade-in duration-700">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
