import { NavLink } from 'react-router-dom';
import {
  Settings,
  Users,
  Shield,
  Bell,
  CreditCard,
  Lock,
  Building,
  Wrench,
} from 'lucide-react';

const settingsNavItems = [
  { name: 'General', href: '/settings', icon: Settings, exact: true },
  { name: 'Usuarios', href: '/settings/users', icon: Users },
  { name: 'Roles', href: '/settings/roles', icon: Shield },
  { name: 'Gimnasio', href: '/settings/gym', icon: Building },
  { name: 'Notificaciones', href: '/settings/notifications', icon: Bell },
  { name: 'Pagos', href: '/settings/payments', icon: CreditCard },
  { name: 'Seguridad', href: '/settings/security', icon: Lock },
  { name: 'Sistema', href: '/settings/system', icon: Wrench },
];

export default function SettingsNav() {
  return (
    <nav className="flex flex-wrap gap-2 p-1 bg-zinc-900 rounded-xl border border-zinc-800 mb-6">
      {settingsNavItems.map((item) => (
        <NavLink
          key={item.href}
          to={item.href}
          end={item.exact}
          className={({ isActive }) =>
            `flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
              isActive
                ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/30'
                : 'text-gray-400 hover:text-white hover:bg-zinc-800'
            }`
          }
        >
          <item.icon className="w-4 h-4" />
          <span className="hidden sm:inline">{item.name}</span>
        </NavLink>
      ))}
    </nav>
  );
}
