import { Link } from 'react-router-dom';
import {
  Bell,
  ArrowLeft,
  Mail,
  MessageSquare,
  Clock,
  ToggleLeft,
  ToggleRight,
  Save,
} from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import SettingsNav from '../../components/settings/SettingsNav';

interface NotificationSetting {
  id: string;
  name: string;
  description: string;
  email: boolean;
  whatsapp: boolean;
}

const initialSettings: NotificationSetting[] = [
  {
    id: 'welcome',
    name: 'Mensaje de Bienvenida',
    description: 'Enviar mensaje cuando un nuevo miembro se registra',
    email: true,
    whatsapp: true,
  },
  {
    id: 'renewal_reminder',
    name: 'Recordatorio de Renovación',
    description: 'Recordar a miembros cuando su membresía está por vencer',
    email: true,
    whatsapp: true,
  },
  {
    id: 'class_reminder',
    name: 'Recordatorio de Clase',
    description: 'Recordar a miembros sobre sus clases reservadas',
    email: true,
    whatsapp: false,
  },
  {
    id: 'payment_confirmation',
    name: 'Confirmación de Pago',
    description: 'Confirmar cuando se procesa un pago correctamente',
    email: true,
    whatsapp: false,
  },
  {
    id: 'membership_expired',
    name: 'Membresía Expirada',
    description: 'Notificar cuando la membresía ha expirado',
    email: true,
    whatsapp: true,
  },
  {
    id: 'inactivity_alert',
    name: 'Alerta de Inactividad',
    description: 'Notificar a miembros que no han visitado el gimnasio',
    email: true,
    whatsapp: false,
  },
];

export default function NotificationsSettingsPage() {
  const [settings, setSettings] = useState(initialSettings);
  const [reminderDays, setReminderDays] = useState([7, 3, 1]);
  const [classReminderHours, setClassReminderHours] = useState(24);
  const [isSaving, setIsSaving] = useState(false);

  const toggleSetting = (id: string, channel: 'email' | 'whatsapp') => {
    setSettings((prev) =>
      prev.map((setting) =>
        setting.id === id
          ? { ...setting, [channel]: !setting[channel] }
          : setting
      )
    );
  };

  const handleSave = async () => {
    setIsSaving(true);
    // Simular guardado
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSaving(false);
    toast.success('Configuración de notificaciones guardada');
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
            <Bell className="w-7 h-7 text-orange-500" />
            Notificaciones
          </h1>
          <p className="text-gray-400 text-sm">
            Configura los canales y tipos de notificaciones
          </p>
        </div>
      </div>

      {/* Canales de Notificación */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
        <h2 className="text-lg font-bold text-white mb-4">Canales Disponibles</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-zinc-800 rounded-xl flex items-center gap-4">
            <div className="p-3 bg-blue-500/20 rounded-xl">
              <Mail className="w-6 h-6 text-blue-400" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-white">Email</h3>
              <p className="text-sm text-gray-400">Notificaciones por correo electrónico</p>
            </div>
            <span className="px-2 py-1 text-xs font-semibold bg-green-500/20 text-green-400 rounded-full">
              Activo
            </span>
          </div>

          <div className="p-4 bg-zinc-800 rounded-xl flex items-center gap-4">
            <div className="p-3 bg-green-500/20 rounded-xl">
              <MessageSquare className="w-6 h-6 text-green-400" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-white">WhatsApp</h3>
              <p className="text-sm text-gray-400">Mensajes por WhatsApp Business</p>
            </div>
            <span className="px-2 py-1 text-xs font-semibold bg-yellow-500/20 text-yellow-400 rounded-full">
              Configurar
            </span>
          </div>
        </div>
      </div>

      {/* Tipos de Notificación */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
        <h2 className="text-lg font-bold text-white mb-4">Tipos de Notificación</h2>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-zinc-800">
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase">
                  Notificación
                </th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-gray-400 uppercase">
                  Email
                </th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-gray-400 uppercase">
                  WhatsApp
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {settings.map((setting) => (
                <tr key={setting.id} className="hover:bg-zinc-800/50">
                  <td className="px-4 py-4">
                    <p className="font-medium text-white">{setting.name}</p>
                    <p className="text-sm text-gray-400">{setting.description}</p>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <button
                      onClick={() => toggleSetting(setting.id, 'email')}
                      className="inline-flex items-center justify-center"
                    >
                      {setting.email ? (
                        <ToggleRight className="w-8 h-8 text-green-400" />
                      ) : (
                        <ToggleLeft className="w-8 h-8 text-gray-500" />
                      )}
                    </button>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <button
                      onClick={() => toggleSetting(setting.id, 'whatsapp')}
                      className="inline-flex items-center justify-center"
                    >
                      {setting.whatsapp ? (
                        <ToggleRight className="w-8 h-8 text-green-400" />
                      ) : (
                        <ToggleLeft className="w-8 h-8 text-gray-500" />
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Tiempos de Recordatorio */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5 text-orange-500" />
          Tiempos de Recordatorio
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Días antes de vencimiento de membresía
            </label>
            <div className="flex flex-wrap gap-2">
              {[1, 3, 5, 7, 14, 30].map((day) => (
                <button
                  key={day}
                  onClick={() => {
                    if (reminderDays.includes(day)) {
                      setReminderDays(reminderDays.filter((d) => d !== day));
                    } else {
                      setReminderDays([...reminderDays, day].sort((a, b) => b - a));
                    }
                  }}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${reminderDays.includes(day)
                    ? 'bg-orange-500 text-white'
                    : 'bg-zinc-800 text-gray-400 hover:bg-zinc-700'
                    }`}
                >
                  {day} {day === 1 ? 'día' : 'días'}
                </button>
              ))}
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Se enviará recordatorio: {reminderDays.join(', ')} días antes
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Horas antes de una clase reservada
            </label>
            <select
              value={classReminderHours}
              onChange={(e) => setClassReminderHours(Number(e.target.value))}
              className="px-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-xl text-white focus:outline-none focus:border-orange-500 transition-colors"
            >
              <option value={1}>1 hora antes</option>
              <option value={2}>2 horas antes</option>
              <option value={6}>6 horas antes</option>
              <option value={12}>12 horas antes</option>
              <option value={24}>24 horas antes</option>
              <option value={48}>48 horas antes</option>
            </select>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-4">
        <Link
          to="/settings"
          className="px-6 py-2.5 text-gray-400 hover:text-white transition-colors"
        >
          Cancelar
        </Link>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg shadow-orange-500/30 disabled:opacity-50"
        >
          <Save className="w-5 h-5" />
          {isSaving ? 'Guardando...' : 'Guardar Cambios'}
        </button>
      </div>
    </div>
  );
}
