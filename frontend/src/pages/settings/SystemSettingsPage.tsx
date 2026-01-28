import { Link } from 'react-router-dom';
import {
  Wrench,
  ArrowLeft,
  Globe,
  Clock,
  Calendar,
  Save,
  Database,
  Server,
  HardDrive,
} from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import SettingsNav from '../../components/settings/SettingsNav';

export default function SystemSettingsPage() {
  const [timezone, setTimezone] = useState('America/Caracas');
  const [dateFormat, setDateFormat] = useState('DD/MM/YYYY');
  const [timeFormat, setTimeFormat] = useState('24h');
  const [language, setLanguage] = useState('es');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSaving(false);
    toast.success('Configuración del sistema guardada');
  };

  // Información del sistema (mock)
  const systemInfo = {
    version: '1.0.0',
    environment: 'Producción',
    database: 'PostgreSQL 16',
    uptime: '15 días, 8 horas',
    lastBackup: '2026-01-27 03:00:00',
    diskUsage: '45%',
    memoryUsage: '62%',
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
            <Wrench className="w-7 h-7 text-orange-500" />
            Sistema
          </h1>
          <p className="text-gray-400 text-sm">
            Configuración regional y del sistema
          </p>
        </div>
      </div>

      {/* Regional Settings */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Globe className="w-5 h-5 text-orange-500" />
          Configuración Regional
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              <span className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Zona Horaria
              </span>
            </label>
            <select
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              className="w-full px-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-xl text-white focus:outline-none focus:border-orange-500 transition-colors"
            >
              <option value="America/Caracas">America/Caracas (UTC-4)</option>
              <option value="America/Bogota">America/Bogota (UTC-5)</option>
              <option value="America/Mexico_City">America/Mexico_City (UTC-6)</option>
              <option value="America/Lima">America/Lima (UTC-5)</option>
              <option value="America/Buenos_Aires">America/Buenos_Aires (UTC-3)</option>
              <option value="America/Santiago">America/Santiago (UTC-4)</option>
              <option value="Europe/Madrid">Europe/Madrid (UTC+1)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Idioma
            </label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full px-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-xl text-white focus:outline-none focus:border-orange-500 transition-colors"
            >
              <option value="es">Español</option>
              <option value="en">English</option>
              <option value="pt">Português</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              <span className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Formato de Fecha
              </span>
            </label>
            <select
              value={dateFormat}
              onChange={(e) => setDateFormat(e.target.value)}
              className="w-full px-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-xl text-white focus:outline-none focus:border-orange-500 transition-colors"
            >
              <option value="DD/MM/YYYY">DD/MM/YYYY (27/01/2026)</option>
              <option value="MM/DD/YYYY">MM/DD/YYYY (01/27/2026)</option>
              <option value="YYYY-MM-DD">YYYY-MM-DD (2026-01-27)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Formato de Hora
            </label>
            <select
              value={timeFormat}
              onChange={(e) => setTimeFormat(e.target.value)}
              className="w-full px-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-xl text-white focus:outline-none focus:border-orange-500 transition-colors"
            >
              <option value="24h">24 horas (14:30)</option>
              <option value="12h">12 horas (2:30 PM)</option>
            </select>
          </div>
        </div>
      </div>

      {/* System Info */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Server className="w-5 h-5 text-orange-500" />
          Información del Sistema
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-4 bg-zinc-800 rounded-xl">
            <p className="text-sm text-gray-400">Versión</p>
            <p className="font-bold text-white text-lg">{systemInfo.version}</p>
          </div>

          <div className="p-4 bg-zinc-800 rounded-xl">
            <p className="text-sm text-gray-400">Entorno</p>
            <p className="font-bold text-white text-lg flex items-center gap-2">
              {systemInfo.environment}
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            </p>
          </div>

          <div className="p-4 bg-zinc-800 rounded-xl">
            <p className="text-sm text-gray-400">Base de Datos</p>
            <p className="font-bold text-white text-lg flex items-center gap-2">
              <Database className="w-4 h-4 text-blue-400" />
              {systemInfo.database}
            </p>
          </div>

          <div className="p-4 bg-zinc-800 rounded-xl">
            <p className="text-sm text-gray-400">Tiempo Activo</p>
            <p className="font-bold text-white text-lg">{systemInfo.uptime}</p>
          </div>

          <div className="p-4 bg-zinc-800 rounded-xl">
            <p className="text-sm text-gray-400">Último Backup</p>
            <p className="font-bold text-white text-lg">{systemInfo.lastBackup}</p>
          </div>

          <div className="p-4 bg-zinc-800 rounded-xl">
            <p className="text-sm text-gray-400 flex items-center gap-2">
              <HardDrive className="w-4 h-4" />
              Uso de Disco
            </p>
            <div className="mt-2">
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-white">{systemInfo.diskUsage}</span>
              </div>
              <div className="w-full bg-zinc-700 rounded-full h-2">
                <div
                  className="bg-orange-500 h-2 rounded-full"
                  style={{ width: systemInfo.diskUsage }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Membership Settings */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
        <h2 className="text-lg font-bold text-white mb-4">Configuración de Membresías</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-zinc-800 rounded-xl">
            <p className="text-sm text-gray-400">Días de congelación por año</p>
            <p className="font-bold text-white text-lg">30 días</p>
          </div>

          <div className="p-4 bg-zinc-800 rounded-xl">
            <p className="text-sm text-gray-400">Período de gracia</p>
            <p className="font-bold text-white text-lg">3 días</p>
          </div>

          <div className="p-4 bg-zinc-800 rounded-xl">
            <p className="text-sm text-gray-400">Límite de cancelación de clases</p>
            <p className="font-bold text-white text-lg">2 horas antes</p>
          </div>

          <div className="p-4 bg-zinc-800 rounded-xl">
            <p className="text-sm text-gray-400">Lista de espera</p>
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 text-xs font-semibold bg-green-500/20 text-green-400 rounded-full">
              Habilitada
            </span>
          </div>
        </div>

        <p className="text-sm text-gray-500 mt-4">
          Estas configuraciones afectan el comportamiento de las membresías y clases en todo el sistema.
        </p>
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
