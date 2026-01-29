import { useEffect, useState } from 'react';
import {
  Users,
  Shield,
  Bell,
  CreditCard,
  Building,
  Lock,
  Wrench,
  Activity,
  CheckCircle,
  AlertTriangle,
  Loader2,
} from 'lucide-react';
import SettingsCard from '../../components/settings/SettingsCard';
import api from '../../services/api';

export default function SettingsPage() {
  const [stats, setStats] = useState({
    totalMembers: 0,
    activeMembers: 0,
    pending: 0,
    loading: true,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // Usar el endpoint de dashboard_stats que ya existe
      const response = await api.get('/users/dashboard_stats/');

      setStats({
        totalMembers: response.data.total_members || 0,
        activeMembers: response.data.active_members || 0,
        pending: response.data.pending_payments || 0,
        loading: false,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
      // Si falla, intentar endpoint Users count
      try {
        const usersResponse = await api.get('/users/', { params: { limit: 1000 } });
        const users = Array.isArray(usersResponse.data) ? usersResponse.data : usersResponse.data.results || [];

        setStats({
          totalMembers: users.length,
          activeMembers: users.filter((u: any) => u.is_active).length,
          pending: 0,
          loading: false,
        });
      } catch (fallbackError) {
        console.error('Fallback error:', fallbackError);
        setStats({ totalMembers: 0, activeMembers: 0, pending: 0, loading: false });
      }
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-white uppercase tracking-tight">
          Configuración
        </h1>
        <p className="text-gray-400 mt-1">
          Administra la configuración del sistema, usuarios y preferencias
        </p>
      </div>

      {/* Status Banner */}
      <div className="p-4 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-xl flex items-center gap-4">
        <div className="p-2 bg-green-500/20 rounded-lg">
          <CheckCircle className="w-6 h-6 text-green-400" />
        </div>
        <div>
          <p className="text-green-400 font-semibold">Sistema funcionando correctamente</p>
          <p className="text-green-400/70 text-sm">Todos los servicios están operativos</p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <Users className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              {stats.loading ? (
                <div className="flex items-center">
                  <Loader2 className="w-5 h-5 text-blue-400 animate-spin" />
                </div>
              ) : (
                <p className="text-2xl font-bold text-white">{stats.totalMembers}</p>
              )}
              <p className="text-sm text-gray-400">Miembros totales</p>
            </div>
          </div>
        </div>

        <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-500/20 rounded-lg">
              <Activity className="w-5 h-5 text-green-400" />
            </div>
            <div>
              {stats.loading ? (
                <div className="flex items-center">
                  <Loader2 className="w-5 h-5 text-green-400 animate-spin" />
                </div>
              ) : (
                <p className="text-2xl font-bold text-white">{stats.activeMembers}</p>
              )}
              <p className="text-sm text-gray-400">Miembros activos</p>
            </div>
          </div>
        </div>

        <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-500/20 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-orange-400" />
            </div>
            <div>
              {stats.loading ? (
                <div className="flex items-center">
                  <Loader2 className="w-5 h-5 text-orange-400 animate-spin" />
                </div>
              ) : (
                <p className="text-2xl font-bold text-white">{stats.pending}</p>
              )}
              <p className="text-sm text-gray-400">Pagos pendientes</p>
            </div>
          </div>
        </div>
      </div>

      {/* Settings Cards Grid */}
      <div>
        <h2 className="text-lg font-bold text-white mb-4">Configuración del Sistema</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <SettingsCard
            title="Usuarios"
            description="Gestiona usuarios del sistema, asigna roles y permisos"
            icon={Users}
            href="/settings/users"
          />

          <SettingsCard
            title="Roles y Permisos"
            description="Configura los roles y niveles de acceso del sistema"
            icon={Shield}
            href="/settings/roles"
          />

          <SettingsCard
            title="Información del Gimnasio"
            description="Actualiza datos, logo y horarios del gimnasio"
            icon={Building}
            href="/settings/gym"
          />

          <SettingsCard
            title="Notificaciones"
            description="Configura emails, recordatorios y alertas automáticas"
            icon={Bell}
            href="/settings/notifications"
            badge={{ text: 'Email + WhatsApp', color: 'blue' }}
          />

          <SettingsCard
            title="Pagos"
            description="Métodos de pago, facturación y configuración financiera"
            icon={CreditCard}
            href="/settings/payments"
          />

          <SettingsCard
            title="Seguridad"
            description="Contraseñas, sesiones activas y auditoría"
            icon={Lock}
            href="/settings/security"
          />

          <SettingsCard
            title="Sistema"
            description="Zona horaria, idioma y configuración general"
            icon={Wrench}
            href="/settings/system"
          />
        </div>
      </div>

      {/* Info Footer */}
      <div className="p-4 bg-zinc-900/50 border border-zinc-800 rounded-xl">
        <p className="text-sm text-gray-500">
          <span className="text-orange-400 font-semibold">Nota:</span> Solo los administradores
          tienen acceso completo a la configuración del sistema. Algunos ajustes pueden requerir
          reiniciar la sesión para aplicarse correctamente.
        </p>
      </div>
    </div>
  );
}
