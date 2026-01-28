import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Lock,
  ArrowLeft,
  Key,
  Shield,
  Monitor,
  Clock,
  Eye,
  EyeOff,
  Save,
  Loader2,
  LogOut,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { usersService } from '../../services/settings';
import { useAuthStore } from '../../stores/authStore';
import SettingsNav from '../../components/settings/SettingsNav';

// Schema de validación para cambio de contraseña
const passwordSchema = z.object({
  current_password: z.string().min(1, 'Contraseña actual requerida'),
  new_password: z.string().min(6, 'Mínimo 6 caracteres'),
  confirm_password: z.string(),
}).refine((data) => data.new_password === data.confirm_password, {
  message: 'Las contraseñas no coinciden',
  path: ['confirm_password'],
});

type PasswordFormData = z.infer<typeof passwordSchema>;

// Sesiones activas (mock)
const activeSessions = [
  {
    id: '1',
    device: 'Windows 10 - Chrome',
    ip: '192.168.1.100',
    location: 'Caracas, Venezuela',
    lastActivity: '2026-01-27T10:30:00',
    isCurrent: true,
  },
  {
    id: '2',
    device: 'iPhone 14 - Safari',
    ip: '192.168.1.105',
    location: 'Caracas, Venezuela',
    lastActivity: '2026-01-26T18:45:00',
    isCurrent: false,
  },
];

export default function SecuritySettingsPage() {
  const { user } = useAuthStore();
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
  });

  const onSubmitPassword = async (data: PasswordFormData) => {
    setIsChangingPassword(true);
    try {
      await usersService.changePassword(data.current_password, data.new_password);
      toast.success('Contraseña actualizada correctamente');
      reset();
    } catch (error: unknown) {
      const err = error as { response?: { data?: { detail?: string } } };
      toast.error(err.response?.data?.detail || 'Error al cambiar la contraseña');
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleCloseSession = (sessionId: string) => {
    toast.success('Sesión cerrada correctamente');
    console.log('Closing session:', sessionId);
  };

  const handleCloseAllSessions = () => {
    if (window.confirm('¿Cerrar todas las sesiones excepto la actual?')) {
      toast.success('Todas las sesiones han sido cerradas');
    }
  };

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
            <Lock className="w-7 h-7 text-orange-500" />
            Seguridad
          </h1>
          <p className="text-gray-400 text-sm">
            Gestiona tu contraseña y sesiones activas
          </p>
        </div>
      </div>

      {/* Cambiar Contraseña */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Key className="w-5 h-5 text-orange-500" />
          Cambiar Contraseña
        </h2>

        <form onSubmit={handleSubmit(onSubmitPassword)} className="space-y-4 max-w-md">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Contraseña Actual
            </label>
            <div className="relative">
              <input
                {...register('current_password')}
                type={showCurrentPassword ? 'text' : 'password'}
                className="w-full px-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 transition-colors pr-12"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
              >
                {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {errors.current_password && (
              <p className="mt-1 text-sm text-red-400">{errors.current_password.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Nueva Contraseña
            </label>
            <div className="relative">
              <input
                {...register('new_password')}
                type={showNewPassword ? 'text' : 'password'}
                className="w-full px-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 transition-colors pr-12"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
              >
                {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {errors.new_password && (
              <p className="mt-1 text-sm text-red-400">{errors.new_password.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Confirmar Nueva Contraseña
            </label>
            <input
              {...register('confirm_password')}
              type="password"
              className="w-full px-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 transition-colors"
              placeholder="••••••••"
            />
            {errors.confirm_password && (
              <p className="mt-1 text-sm text-red-400">{errors.confirm_password.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isChangingPassword}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg shadow-orange-500/30 disabled:opacity-50"
          >
            {isChangingPassword ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Actualizando...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                Actualizar Contraseña
              </>
            )}
          </button>
        </form>
      </div>

      {/* Sesiones Activas */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Monitor className="w-5 h-5 text-orange-500" />
            Sesiones Activas
          </h2>
          <button
            onClick={handleCloseAllSessions}
            className="text-sm text-red-400 hover:text-red-300 transition-colors"
          >
            Cerrar todas
          </button>
        </div>

        <div className="space-y-4">
          {activeSessions.map((session) => (
            <div
              key={session.id}
              className={`p-4 rounded-xl border ${session.isCurrent
                ? 'bg-green-500/10 border-green-500/30'
                : 'bg-zinc-800 border-zinc-700'
                }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg ${session.isCurrent ? 'bg-green-500/20' : 'bg-zinc-700'
                    }`}>
                    <Monitor className={`w-5 h-5 ${session.isCurrent ? 'text-green-400' : 'text-gray-400'
                      }`} />
                  </div>
                  <div>
                    <p className="font-medium text-white flex items-center gap-2">
                      {session.device}
                      {session.isCurrent && (
                        <span className="px-2 py-0.5 text-xs font-semibold bg-green-500/20 text-green-400 rounded-full">
                          Sesión actual
                        </span>
                      )}
                    </p>
                    <p className="text-sm text-gray-400 mt-1">
                      {session.ip} • {session.location}
                    </p>
                    <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                      <Clock className="w-3 h-3" />
                      Última actividad:{' '}
                      {new Date(session.lastActivity).toLocaleString('es-ES', {
                        day: '2-digit',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>

                {!session.isCurrent && (
                  <button
                    onClick={() => handleCloseSession(session.id)}
                    className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                    title="Cerrar sesión"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Información de Seguridad */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Shield className="w-5 h-5 text-orange-500" />
          Información de Cuenta
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-zinc-800 rounded-xl">
            <p className="text-sm text-gray-400">Email</p>
            <p className="font-medium text-white">{user?.email || 'No disponible'}</p>
          </div>

          <div className="p-4 bg-zinc-800 rounded-xl">
            <p className="text-sm text-gray-400">Rol</p>
            <p className="font-medium text-white capitalize">{user?.role || 'Sin rol'}</p>
          </div>

          <div className="p-4 bg-zinc-800 rounded-xl">
            <p className="text-sm text-gray-400">Última conexión</p>
            <p className="font-medium text-white">
              {new Date().toLocaleString('es-ES', {
                day: '2-digit',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          </div>

          <div className="p-4 bg-zinc-800 rounded-xl">
            <p className="text-sm text-gray-400">Estado de la cuenta</p>
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 text-xs font-semibold bg-green-500/20 text-green-400 rounded-full">
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
              Activa
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
