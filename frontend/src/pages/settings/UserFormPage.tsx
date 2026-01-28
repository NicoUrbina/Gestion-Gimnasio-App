import { useEffect } from 'react';
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
  Lock,
  Shield,
  Save,
  Loader2,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { usersService, rolesService } from '../../services/settings';
import Spinner from '../../components/Spinner';
import SettingsNav from '../../components/settings/SettingsNav';

// Schema de validación
const userSchema = z.object({
  email: z.string().email('Email inválido'),
  first_name: z.string().min(2, 'Mínimo 2 caracteres'),
  last_name: z.string().min(2, 'Mínimo 2 caracteres'),
  phone: z.string().optional(),
  role_id: z.string().optional(),
  is_active: z.boolean(),
  password: z.string().min(6, 'Mínimo 6 caracteres').optional().or(z.literal('')),
  confirm_password: z.string().optional().or(z.literal('')),
}).refine((data) => {
  if (data.password && data.password !== data.confirm_password) {
    return false;
  }
  return true;
}, {
  message: 'Las contraseñas no coinciden',
  path: ['confirm_password'],
});

type UserFormData = z.infer<typeof userSchema>;

export default function UserFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEditing = Boolean(id);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      email: '',
      first_name: '',
      last_name: '',
      phone: '',
      role_id: '',
      is_active: true,
      password: '',
      confirm_password: '',
    },
  });

  // Obtener usuario si estamos editando
  const { data: user, isLoading: loadingUser } = useQuery({
    queryKey: ['settings-user', id],
    queryFn: () => usersService.getById(Number(id)),
    enabled: isEditing,
  });

  // Obtener roles
  const { data: rolesData } = useQuery({
    queryKey: ['settings-roles'],
    queryFn: () => rolesService.getAll(),
    retry: false,
  });

  // Roles por defecto si la API falla
  const defaultRoles = [
    { id: 1, name: 'admin', description: 'Administrador del Sistema' },
    { id: 2, name: 'staff', description: 'Personal del Gimnasio' },
    { id: 3, name: 'trainer', description: 'Entrenador' },
    { id: 4, name: 'member', description: 'Miembro' },
  ];

  // Usar roles de la API solo si tiene elementos, sino usar defaults
  const roles = (rolesData?.results && rolesData.results.length > 0) ? rolesData.results : defaultRoles;

  // Cargar datos del usuario al editar
  useEffect(() => {
    if (user && !loadingUser) {
      reset({
        email: user.email || '',
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        phone: user.phone || '',
        role_id: user.role ? String(user.role) : '',  // Backend devuelve el ID del rol directamente
        is_active: user.is_active ?? true,
        password: '',
        confirm_password: '',
      });
    }
  }, [user, loadingUser, reset]);

  // Mutación para crear usuario
  const createMutation = useMutation({
    mutationFn: (data: UserFormData) => {
      const payload: any = {
        email: data.email,
        password: data.password || 'temp123456',
        password_confirm: data.password || 'temp123456',
        first_name: data.first_name,
        last_name: data.last_name,
        phone: data.phone,
        is_active: data.is_active,
      };

      // Backend expects 'role' not 'role_id'
      if (data.role_id) {
        payload.role = Number(data.role_id);
      }

      return usersService.create(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings-users'] });
      toast.success('Usuario creado correctamente');
      navigate('/settings/users');
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.detail
        || error.response?.data?.message
        || Object.values(error.response?.data || {}).flat().join(', ')
        || 'Error al crear el usuario';
      toast.error(errorMessage);
      console.error('Error creating user:', error.response?.data);
    },
  });

  // Mutación para actualizar usuario
  const updateMutation = useMutation({
    mutationFn: (data: UserFormData) => {
      const payload: any = {
        email: data.email,
        first_name: data.first_name,
        last_name: data.last_name,
        phone: data.phone,
        is_active: data.is_active,
      };

      // Backend expects 'role' not 'role_id'
      if (data.role_id) {
        payload.role = Number(data.role_id);
      }

      return usersService.update(Number(id), payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings-users'] });
      queryClient.invalidateQueries({ queryKey: ['settings-user', id] });
      toast.success('Usuario actualizado correctamente');
      navigate('/settings/users');
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.detail
        || error.response?.data?.message
        || Object.values(error.response?.data || {}).flat().join(', ')
        || 'Error al actualizar el usuario';
      toast.error(errorMessage);
      console.error('Error updating user:', error.response?.data);
    },
  });

  const onSubmit = (data: UserFormData) => {
    if (isEditing) {
      updateMutation.mutate(data);
    } else {
      if (!data.password) {
        toast.error('La contraseña es requerida para nuevos usuarios');
        return;
      }
      createMutation.mutate(data);
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  if (isEditing && loadingUser) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <SettingsNav />

      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          to="/settings/users"
          className="p-2 text-gray-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-black text-white uppercase tracking-tight">
            {isEditing ? 'Editar Usuario' : 'Nuevo Usuario'}
          </h1>
          <p className="text-gray-400 text-sm">
            {isEditing
              ? 'Modifica los datos del usuario'
              : 'Completa los datos para crear un nuevo usuario'}
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

        {/* Rol y Estado */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5 text-orange-500" />
            Rol y Estado
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Rol del Usuario
              </label>
              <select
                {...register('role_id')}
                className="w-full px-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-xl text-white focus:outline-none focus:border-orange-500 transition-colors appearance-none cursor-pointer"
              >
                <option value="">Sin rol asignado</option>
                {roles.map((role) => (
                  <option key={role.id} value={role.id}>
                    {role.name.charAt(0).toUpperCase() + role.name.slice(1)} -{' '}
                    {role.description || 'Sin descripción'}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Estado
              </label>
              <label className="flex items-center gap-3 p-3 bg-zinc-800 border border-zinc-700 rounded-xl cursor-pointer hover:border-orange-500/50 transition-colors">
                <input
                  {...register('is_active')}
                  type="checkbox"
                  className="w-5 h-5 rounded bg-zinc-700 border-zinc-600 text-orange-500 focus:ring-orange-500 focus:ring-offset-0"
                />
                <span className="text-white">Usuario activo</span>
              </label>
            </div>
          </div>
        </div>

        {/* Contraseña */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Lock className="w-5 h-5 text-orange-500" />
            {isEditing ? 'Cambiar Contraseña' : 'Contraseña'}
          </h2>

          {isEditing && (
            <p className="text-sm text-gray-400 mb-4">
              Deja estos campos vacíos si no deseas cambiar la contraseña
            </p>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                {isEditing ? 'Nueva Contraseña' : 'Contraseña *'}
              </label>
              <input
                {...register('password')}
                type="password"
                className="w-full px-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 transition-colors"
                placeholder="••••••••"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-400">{errors.password.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Confirmar Contraseña
              </label>
              <input
                {...register('confirm_password')}
                type="password"
                className="w-full px-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 transition-colors"
                placeholder="••••••••"
              />
              {errors.confirm_password && (
                <p className="mt-1 text-sm text-red-400">
                  {errors.confirm_password.message}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-4">
          <Link
            to="/settings/users"
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
                {isEditing ? 'Actualizar' : 'Crear Usuario'}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
