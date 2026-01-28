import { Link } from 'react-router-dom';
import {
  Building,
  ArrowLeft,
  MapPin,
  Phone,
  Mail,
  Globe,
  Clock,
  Instagram,
  Facebook,
  Save,
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import SettingsNav from '../../components/settings/SettingsNav';

interface GymFormData {
  name: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  description: string;
  instagram: string;
  facebook: string;
}

// Horarios de operación (hardcoded por ahora)
const operatingHours = [
  { day: 'Lunes', open: '06:00', close: '22:00', isOpen: true },
  { day: 'Martes', open: '06:00', close: '22:00', isOpen: true },
  { day: 'Miércoles', open: '06:00', close: '22:00', isOpen: true },
  { day: 'Jueves', open: '06:00', close: '22:00', isOpen: true },
  { day: 'Viernes', open: '06:00', close: '22:00', isOpen: true },
  { day: 'Sábado', open: '07:00', close: '18:00', isOpen: true },
  { day: 'Domingo', open: '08:00', close: '14:00', isOpen: true },
];

export default function GymSettingsPage() {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<GymFormData>({
    defaultValues: {
      name: 'GymPro Fitness Center',
      address: 'Av. Principal #123, Ciudad',
      phone: '+58 412 123 4567',
      email: 'info@gympro.com',
      website: 'www.gympro.com',
      description: 'El mejor gimnasio de la ciudad con equipos de última generación.',
      instagram: '@gympro_fitness',
      facebook: 'GymProFitness',
    },
  });

  const onSubmit = async (data: GymFormData) => {
    // Simular guardado
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log('Gym settings:', data);
    toast.success('Configuración guardada correctamente');
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
            <Building className="w-7 h-7 text-orange-500" />
            Información del Gimnasio
          </h1>
          <p className="text-gray-400 text-sm">
            Configura los datos de tu gimnasio
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Información General */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          <h2 className="text-lg font-bold text-white mb-4">Información General</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Nombre del Gimnasio
              </label>
              <input
                {...register('name')}
                type="text"
                className="w-full px-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 transition-colors"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Descripción
              </label>
              <textarea
                {...register('description')}
                rows={3}
                className="w-full px-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 transition-colors resize-none"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-400 mb-2">
                <span className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Dirección
                </span>
              </label>
              <input
                {...register('address')}
                type="text"
                className="w-full px-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Contacto */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          <h2 className="text-lg font-bold text-white mb-4">Información de Contacto</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                <span className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  Teléfono
                </span>
              </label>
              <input
                {...register('phone')}
                type="tel"
                className="w-full px-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                <span className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email
                </span>
              </label>
              <input
                {...register('email')}
                type="email"
                className="w-full px-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                <span className="flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  Sitio Web
                </span>
              </label>
              <input
                {...register('website')}
                type="text"
                className="w-full px-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Redes Sociales */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          <h2 className="text-lg font-bold text-white mb-4">Redes Sociales</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                <span className="flex items-center gap-2">
                  <Instagram className="w-4 h-4" />
                  Instagram
                </span>
              </label>
              <input
                {...register('instagram')}
                type="text"
                className="w-full px-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 transition-colors"
                placeholder="@usuario"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                <span className="flex items-center gap-2">
                  <Facebook className="w-4 h-4" />
                  Facebook
                </span>
              </label>
              <input
                {...register('facebook')}
                type="text"
                className="w-full px-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 transition-colors"
                placeholder="Página de Facebook"
              />
            </div>
          </div>
        </div>

        {/* Horarios */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-orange-500" />
            Horarios de Operación
          </h2>

          <div className="space-y-3">
            {operatingHours.map((schedule) => (
              <div
                key={schedule.day}
                className="flex items-center justify-between py-3 border-b border-zinc-800 last:border-0"
              >
                <span className="font-medium text-white w-28">{schedule.day}</span>
                {schedule.isOpen ? (
                  <div className="flex items-center gap-4">
                    <span className="text-gray-400">
                      {schedule.open} - {schedule.close}
                    </span>
                    <span className="px-2 py-0.5 text-xs font-semibold bg-green-500/20 text-green-400 rounded-full">
                      Abierto
                    </span>
                  </div>
                ) : (
                  <span className="px-2 py-0.5 text-xs font-semibold bg-red-500/20 text-red-400 rounded-full">
                    Cerrado
                  </span>
                )}
              </div>
            ))}
          </div>

          <p className="text-sm text-gray-500 mt-4">
            Para modificar los horarios, contacta al administrador del sistema.
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
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg shadow-orange-500/30 disabled:opacity-50"
          >
            <Save className="w-5 h-5" />
            Guardar Cambios
          </button>
        </div>
      </form>
    </div>
  );
}
