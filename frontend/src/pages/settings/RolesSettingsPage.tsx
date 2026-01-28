import { Link } from 'react-router-dom';
import {
  Shield,
  ArrowLeft,
  Users,
  Dumbbell,
  UserCog,
  UserCircle,
  Check,
  X,
} from 'lucide-react';
import SettingsNav from '../../components/settings/SettingsNav';

// Configuración de iconos y colores por rol
const roleConfig: Record<string, { icon: typeof Shield; color: string; bgColor: string }> = {
  admin: {
    icon: Shield,
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/20',
  },
  staff: {
    icon: UserCog,
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/20',
  },
  trainer: {
    icon: Dumbbell,
    color: 'text-orange-400',
    bgColor: 'bg-orange-500/20',
  },
  member: {
    icon: UserCircle,
    color: 'text-green-400',
    bgColor: 'bg-green-500/20',
  },
};

// Permisos por defecto para cada rol (para mostrar en la UI)
const defaultPermissions: Record<string, Record<string, boolean>> = {
  admin: {
    'Ver Dashboard': true,
    'Gestionar Miembros': true,
    'Gestionar Membresías': true,
    'Gestionar Clases': true,
    'Gestionar Pagos': true,
    'Aprobar Pagos': true,
    'Gestionar Personal': true,
    'Ver Reportes': true,
    'Exportar Datos': true,
    'Configuración del Sistema': true,
    'Gestionar Usuarios': true,
  },
  staff: {
    'Ver Dashboard': true,
    'Gestionar Miembros': true,
    'Gestionar Membresías': true,
    'Gestionar Clases': true,
    'Gestionar Pagos': true,
    'Aprobar Pagos': true,
    'Gestionar Personal': false,
    'Ver Reportes': true,
    'Exportar Datos': false,
    'Configuración del Sistema': false,
    'Gestionar Usuarios': false,
  },
  trainer: {
    'Ver Dashboard': true,
    'Gestionar Miembros': false,
    'Gestionar Membresías': false,
    'Gestionar Clases': true,
    'Gestionar Pagos': false,
    'Aprobar Pagos': false,
    'Gestionar Personal': false,
    'Ver Reportes': false,
    'Exportar Datos': false,
    'Configuración del Sistema': false,
    'Gestionar Usuarios': false,
  },
  member: {
    'Ver Dashboard': true,
    'Gestionar Miembros': false,
    'Gestionar Membresías': false,
    'Gestionar Clases': false,
    'Gestionar Pagos': false,
    'Aprobar Pagos': false,
    'Gestionar Personal': false,
    'Ver Reportes': false,
    'Exportar Datos': false,
    'Configuración del Sistema': false,
    'Gestionar Usuarios': false,
  },
};

// Roles predefinidos del sistema
const systemRoles = [
  { id: 1, name: 'admin', description: 'Acceso completo al sistema. Puede gestionar usuarios, configuración y todos los módulos.' },
  { id: 2, name: 'staff', description: 'Personal del gimnasio con acceso a operaciones diarias y gestión de miembros.' },
  { id: 3, name: 'trainer', description: 'Entrenador con acceso a gestión de clases y seguimiento de miembros asignados.' },
  { id: 4, name: 'member', description: 'Miembro del gimnasio con acceso limitado a su perfil y reservas.' },
];

export default function RolesSettingsPage() {
  const roles = systemRoles;

  return (
    <div className="space-y-6">
      <SettingsNav />

      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          to="/settings"
          className="p-2 text-gray-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-black text-white uppercase tracking-tight flex items-center gap-3">
            <Shield className="w-7 h-7 text-orange-500" />
            Roles y Permisos
          </h1>
          <p className="text-gray-400 text-sm">
            Configura los niveles de acceso del sistema
          </p>
        </div>
      </div>

      {/* Info Banner */}
      <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
        <p className="text-sm text-blue-400">
          <span className="font-semibold">Nota:</span> Los roles definen qué acciones puede realizar
          cada tipo de usuario en el sistema. Actualmente los permisos están preconfigurados y no
          pueden modificarse desde la interfaz.
        </p>
      </div>

      {/* Roles Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {roles.map((role) => {
          const config = roleConfig[role.name.toLowerCase()] || {
            icon: Users,
            color: 'text-gray-400',
            bgColor: 'bg-gray-500/20',
          };
          const Icon = config.icon;
          const permissions = defaultPermissions[role.name.toLowerCase()] || {};

          return (
            <div
              key={role.id}
              className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden"
            >
              {/* Role Header */}
              <div className="p-6 border-b border-zinc-800">
                <div className="flex items-start gap-4">
                  <div className={`p-3 ${config.bgColor} rounded-xl`}>
                    <Icon className={`w-6 h-6 ${config.color}`} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-white capitalize">
                      {role.name}
                    </h3>
                    <p className="text-sm text-gray-400 mt-1">
                      {role.description || getDefaultDescription(role.name)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Permissions List */}
              <div className="p-6">
                <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
                  Permisos
                </h4>
                <div className="space-y-3">
                  {Object.entries(permissions).map(([permission, hasAccess]) => (
                    <div
                      key={permission}
                      className="flex items-center justify-between py-2 border-b border-zinc-800/50 last:border-0"
                    >
                      <span className="text-sm text-gray-300">{permission}</span>
                      {hasAccess ? (
                        <span className="flex items-center gap-1 text-green-400">
                          <Check className="w-4 h-4" />
                          <span className="text-xs font-medium">Permitido</span>
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-red-400">
                          <X className="w-4 h-4" />
                          <span className="text-xs font-medium">Denegado</span>
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="p-4 bg-zinc-900/50 border border-zinc-800 rounded-xl">
        <h4 className="text-sm font-semibold text-white mb-3">Leyenda de Roles</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-purple-500 rounded-full" />
            <span className="text-sm text-gray-400">Admin - Acceso total</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full" />
            <span className="text-sm text-gray-400">Staff - Operaciones</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-orange-500 rounded-full" />
            <span className="text-sm text-gray-400">Trainer - Clases</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full" />
            <span className="text-sm text-gray-400">Member - Limitado</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function getDefaultDescription(roleName: string): string {
  const descriptions: Record<string, string> = {
    admin: 'Acceso completo al sistema. Puede gestionar usuarios, configuración y todos los módulos.',
    staff: 'Personal del gimnasio con acceso a operaciones diarias y gestión de miembros.',
    trainer: 'Entrenador con acceso a gestión de clases y seguimiento de miembros asignados.',
    member: 'Miembro del gimnasio con acceso limitado a su perfil y reservas.',
  };
  return descriptions[roleName.toLowerCase()] || 'Sin descripción disponible';
}
