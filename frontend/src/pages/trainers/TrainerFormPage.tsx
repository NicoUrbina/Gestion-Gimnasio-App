import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  Dumbbell,
  Save,
  Loader2,
  Calendar,
  DollarSign,
  Award,
  Plus,
  X,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { trainersService } from '../../services/trainers';
import Spinner from '../../components/Spinner';

// Schema de validación
const trainerSchema = z.object({
  email: z.string().email('Email inválido'),
  first_name: z.string().min(2, 'Mínimo 2 caracteres'),
  last_name: z.string().min(2, 'Mínimo 2 caracteres'),
  phone: z.string().optional(),
  bio: z.string().optional(),
  hire_date: z.string().min(1, 'Fecha de contratación requerida'),
  hourly_rate: z.number().min(0, 'Tarifa debe ser mayor a 0').optional().or(z.literal('')),
  is_active: z.boolean(),
});

type TrainerFormData = z.infer<typeof trainerSchema>;

export default function TrainerFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEditing = Boolean(id);
  const [certifications, setCertifications] = useState<string[]>([]);
  const [newCertification, setNewCertification] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TrainerFormData>({
    resolver: zodResolver(trainerSchema),
    defaultValues: {
      email: '',
      first_name: '',
      last_name: '',
      phone: '',
      bio: '',
      hire_date: '',
      hourly_rate: '' as any,
      is_active: true,
    },
  });

  // Obtener entrenador si estamos editando
  const { data: trainer, isLoading: loadingTrainer } = useQuery({
    queryKey: ['trainer', id],
    queryFn: () => trainersService.getById(Number(id)),
    enabled: isEditing,
  });

  // Cargar datos del entrenador al editar
  useEffect(() => {
    if (trainer && !loadingTrainer) {
      reset({
        email: trainer.email || '',
        first_name: trainer.first_name || '',
        last_name: trainer.last_name || '',
        phone: trainer.phone || '',
        bio: trainer.bio || '',
        hire_date: trainer.hire_date || '',
        hourly_rate: trainer.hourly_rate || ('' as any),
        is_active: trainer.is_active ?? true,
      });
      setCertifications(trainer.certifications || []);
    }
  }, [trainer, loadingTrainer, reset]);

  // Mutación para crear entrenador
  const createMutation = useMutation({
    mutationFn: (data: TrainerFormData) => {
      const payload = {
        ...data,
        certifications,
        hourly_rate: data.hourly_rate ? Number(data.hourly_rate) : undefined,
      };
      return trainersService.create(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trainers'] });
      toast.success('Entrenador creado correctamente');
      navigate('/trainers');
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.detail
        || error.response?.data?.message
        || Object.values(error.response?.data || {}).flat().join(', ')
        || 'Error al crear el entrenador';
      toast.error(errorMessage);
      console.error('Error creating trainer:', error.response?.data);
    },
  });

  // Mutación para actualizar entrenador
  const updateMutation = useMutation({
    mutationFn: (data: TrainerFormData) => {
      const payload = {
        ...data,
        certifications,
        hourly_rate: data.hourly_rate ? Number(data.hourly_rate) : undefined,
      };
      return trainersService.update(Number(id), payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trainers'] });
      queryClient.invalidateQueries({ queryKey: ['trainer', id] });
      toast.success('Entrenador actualizado correctamente');
      navigate('/trainers');
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.detail
        || error.response?.data?.message
        || Object.values(error.response?.data || {}).flat().join(', ')
        || 'Error al actualizar el entrenador';
      toast.error(errorMessage);
      console.error('Error updating trainer:', error.response?.data);
    },
  });

  const onSubmit = (data: TrainerFormData) => {
    if (isEditing) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  // Manejar certificaciones
  const addCertification = () => {
    if (newCertification.trim() && !certifications.includes(newCertification.trim())) {
      setCertifications([...certifications, newCertification.trim()]);
      setNewCertification('');
    }
  };

  const removeCertification = (index: number) => {
    setCertifications(certifications.filter((_, i) => i !== index));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addCertification();
    }
  };

  if (isEditing && loadingTrainer) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          to="/trainers"
          className="p-2 text-gray-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-black text-white uppercase tracking-tight">
            {isEditing ? 'Editar Entrenador' : 'Nuevo Entrenador'}
          </h1>
          <p className="text-gray-400 text-sm">
            {isEditing
              ? 'Modifica los datos del entrenador'
              : 'Completa los datos para crear un nuevo entrenador'}
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Información Personal */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <User className="w-5 h-5 text-orange-500" />
            Información Personal
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Nombre *
              </label>
              <input
                {...register('first_name')}
                type="text"
                className="w-full px-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 transition-colors"
                placeholder="Nombre"
              />
              {errors.first_name && (
                <p className="mt-1 text-sm text-red-400">{errors.first_name.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Apellido *
              </label>
              <input
                {...register('last_name')}
                type="text"
                className="w-full px-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 transition-colors"
                placeholder="Apellido"
              />
              {errors.last_name && (
                <p className="mt-1 text-sm text-red-400">{errors.last_name.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Contacto */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Mail className="w-5 h-5 text-orange-500" />
            Contacto
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Email *
              </label>
              <input
                {...register('email')}
                type="email"
                className="w-full px-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 transition-colors"
                placeholder="email@ejemplo.com"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-400">{errors.email.message}</p>
              )}
            </div>

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
                placeholder="+58 412 123 4567"
              />
            </div>
          </div>
        </div>

        {/* Información Profesional */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Dumbbell className="w-5 h-5 text-orange-500" />
            Información Profesional
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Biografía
              </label>
              <textarea
                {...register('bio')}
                rows={3}
                className="w-full px-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 transition-colors resize-none"
                placeholder="Describe la experiencia y especialidades del entrenador..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  <span className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Fecha de Contratación *
                  </span>
                </label>
                <input
                  {...register('hire_date')}
                  type="date"
                  className="w-full px-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-xl text-white focus:outline-none focus:border-orange-500 transition-colors"
                />
                {errors.hire_date && (
                  <p className="mt-1 text-sm text-red-400">{errors.hire_date.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  <span className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4" />
                    Tarifa por Hora
                  </span>
                </label>
                <input
                  {...register('hourly_rate', { valueAsNumber: true })}
                  type="number"
                  step="0.01"
                  min="0"
                  className="w-full px-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 transition-colors"
                  placeholder="25.00"
                />
                {errors.hourly_rate && (
                  <p className="mt-1 text-sm text-red-400">{errors.hourly_rate.message}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Certificaciones */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Award className="w-5 h-5 text-orange-500" />
            Certificaciones
          </h2>

          <div className="space-y-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={newCertification}
                onChange={(e) => setNewCertification(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1 px-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 transition-colors"
                placeholder="Ej: Personal Training Certificate, CrossFit Level 1..."
              />
              <button
                type="button"
                onClick={addCertification}
                className="px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl transition-colors flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Agregar
              </button>
            </div>

            {certifications.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {certifications.map((cert, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-500/20 text-blue-400 rounded-lg text-sm"
                  >
                    {cert}
                    <button
                      type="button"
                      onClick={() => removeCertification(index)}
                      className="text-blue-400 hover:text-red-400 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Estado */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          <h2 className="text-lg font-bold text-white mb-4">Estado</h2>
          <label className="flex items-center gap-3 p-3 bg-zinc-800 border border-zinc-700 rounded-xl cursor-pointer hover:border-orange-500/50 transition-colors">
            <input
              {...register('is_active')}
              type="checkbox"
              className="w-5 h-5 rounded bg-zinc-700 border-zinc-600 text-orange-500 focus:ring-orange-500 focus:ring-offset-0"
            />
            <span className="text-white">Entrenador activo</span>
          </label>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-4">
          <Link
            to="/trainers"
            className="px-6 py-2.5 text-gray-400 hover:text-white transition-colors"
          >
            Cancelar
          </Link>
          <button
            type="submit"
            disabled={isPending || isSubmitting}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg shadow-orange-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Guardando...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                {isEditing ? 'Actualizar' : 'Crear Entrenador'}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}