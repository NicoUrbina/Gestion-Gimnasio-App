import { useState, useCallback, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Users,
  Plus,
  Search,
  ArrowLeft,
  Mail,
  Phone,
  Calendar,
  Edit,
  MoreVertical,
  UserCheck,
  UserX,
  Trash2,
} from 'lucide-react';
import toast from 'react-hot-toast';
import SettingsNav from '../../components/settings/SettingsNav';
import { usersService } from '../../services/settings';
import Spinner from '../../components/Spinner';
import { useDebounce } from '../../hooks/useDebounce';

// Configuración de colores para roles
const roleColors: Record<string, string> = {
  admin: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  staff: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  trainer: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  member: 'bg-green-500/20 text-green-400 border-green-500/30',
};

const roleLabels: Record<string, string> = {
  admin: 'Administrador',
  staff: 'Personal',
  trainer: 'Entrenador',
  member: 'Miembro',
};

export default function UsersSettingsPage() {
  const [search, setSearch] = useState('');
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);
  const queryClient = useQueryClient();
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Debounce search - wait 500ms after user stops typing
  const debouncedSearch = useDebounce(search, 500);

  // Fetch users from API - using debounced search
  const { data: usersData, isLoading, error } = useQuery({
    queryKey: ['settings-users', debouncedSearch],
    queryFn: () => usersService.getAll({ search: debouncedSearch }),
    retry: false, // Don't retry on auth errors
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (userId: number) => usersService.delete(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings-users'] });
      toast.success('Usuario eliminado correctamente');
      setOpenDropdown(null);
    },
    onError: () => {
      toast.error('Error al eliminar el usuario');
    },
  });

  // Toggle active mutation
  const toggleActiveMutation = useMutation({
    mutationFn: ({ userId, isActive }: { userId: number; isActive: boolean }) =>
      usersService.toggleActive(userId, isActive),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings-users'] });
      toast.success('Usuario actualizado correctamente');
      setOpenDropdown(null);
    },
    onError: () => {
      toast.error('Error al actualizar el usuario');
    },
  });

  const users = usersData?.results || [];
  const filteredUsers = users;

  // Keep focus on search input when results update
  useEffect(() => {
    if (searchInputRef.current && document.activeElement === searchInputRef.current) {
      const timeout = setTimeout(() => {
        searchInputRef.current?.focus();
      }, 0);
      return () => clearTimeout(timeout);
    }
  }, [usersData]);

  // Memoize handlers to prevent unnecessary re-renders
  const handleToggleActive = useCallback((userId: number, currentStatus: boolean) => {
    toggleActiveMutation.mutate({ userId, isActive: !currentStatus });
  }, [toggleActiveMutation]);

  const handleDelete = useCallback((userId: number, userName: string) => {
    if (window.confirm(`¿Estás seguro de eliminar a ${userName}?`)) {
      deleteMutation.mutate(userId);
    }
    setOpenDropdown(null);
  }, [deleteMutation]);

  // Memoize search clear handler
  const handleClearSearch = useCallback(() => {
    setSearch('');
    searchInputRef.current?.focus(); // Keep focus after clearing
  }, []);

  // REMOVED: Early returns cause component dismount and input focus loss
  // Instead, we'll use conditional rendering below

  return (
    <div className="space-y-6">
      <SettingsNav />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link
            to="/settings"
            className="p-2 text-gray-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-black text-white uppercase tracking-tight flex items-center gap-3">
              <Users className="w-7 h-7 text-orange-500" />
              Gestión de Usuarios
            </h1>
            <p className="text-gray-400 text-sm">
              {filteredUsers.length} usuarios registrados
            </p>
          </div>
        </div>

        <Link
          to="/settings/users/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg shadow-orange-500/30"
        >
          <Plus className="w-5 h-5" />
          Nuevo Usuario
        </Link>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          ref={searchInputRef}
          type="text"
          placeholder="Buscar por nombre o email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          autoComplete="off"
          className="w-full pl-10 pr-10 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 transition-colors"
        />
        {/* Show loading spinner while debouncing or searching */}
        {search && search !== debouncedSearch && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <div className="w-4 h-4 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}
        {/* Clear button */}
        {search && search === debouncedSearch && (
          <button
            type="button"
            onClick={handleClearSearch}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Loading State */}
      {isLoading && !users.length && (
        <div className="flex items-center justify-center py-16">
          <Spinner size="lg" />
        </div>
      )}

      {/* Error State */}
      {error && !users.length && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
          <p className="text-sm text-red-400">
            Error al cargar usuarios. Por favor, intenta nuevamente.
          </p>
        </div>
      )}

      {/* Users Table - Only show if we have users or if we're not in initial load */}
      {(!isLoading || users.length > 0) && !error && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-zinc-800">
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Usuario
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Contacto
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Rol
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Registro
                  </th>
                  <th className="text-right px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {filteredUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="hover:bg-zinc-800/50 transition-colors"
                  >
                    {/* Usuario */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg shadow-orange-500/20">
                          {user.first_name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-white">{user.full_name}</p>
                          <p className="text-sm text-gray-400">{user.email}</p>
                        </div>
                      </div>
                    </td>

                    {/* Contacto */}
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                          <Mail className="w-4 h-4" />
                          <span className="truncate max-w-[200px]">{user.email}</span>
                        </div>
                        {user.phone && (
                          <div className="flex items-center gap-2 text-sm text-gray-400">
                            <Phone className="w-4 h-4" />
                            <span>{user.phone}</span>
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Rol */}
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 text-xs font-semibold rounded-full border ${user.role_name ? roleColors[user.role_name] : 'bg-gray-500/20 text-gray-400 border-gray-500/30'
                          }`}
                      >
                        {user.role_name ? (roleLabels[user.role_name] || user.role_name) : 'Sin rol'}
                      </span>
                    </td>

                    {/* Estado */}
                    <td className="px-6 py-4">
                      {user.is_active ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full bg-green-500/20 text-green-400">
                          <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                          Activo
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full bg-red-500/20 text-red-400">
                          <span className="w-1.5 h-1.5 bg-red-400 rounded-full" />
                          Inactivo
                        </span>
                      )}
                    </td>

                    {/* Registro */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {new Date(user.date_joined).toLocaleDateString('es-ES', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </span>
                      </div>
                    </td>

                    {/* Acciones */}
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/settings/users/${user.id}/edit`}
                          className="p-2 text-gray-400 hover:text-orange-400 hover:bg-zinc-800 rounded-lg transition-colors"
                          title="Editar"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>

                        {/* Dropdown Menu */}
                        <div className="relative">
                          <button
                            onClick={() =>
                              setOpenDropdown(openDropdown === user.id ? null : user.id)
                            }
                            className="p-2 text-gray-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
                            title="Más opciones"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>

                          {openDropdown === user.id && (
                            <>
                              <div
                                className="fixed inset-0 z-10"
                                onClick={() => setOpenDropdown(null)}
                              />
                              <div className="absolute right-0 mt-2 w-48 bg-zinc-800 border border-zinc-700 rounded-xl shadow-xl z-20 overflow-hidden">
                                <button
                                  onClick={() => handleToggleActive(user.id, user.is_active)}
                                  className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-300 hover:bg-zinc-700 transition-colors"
                                >
                                  {user.is_active ? (
                                    <>
                                      <UserX className="w-4 h-4 text-yellow-400" />
                                      Desactivar
                                    </>
                                  ) : (
                                    <>
                                      <UserCheck className="w-4 h-4 text-green-400" />
                                      Activar
                                    </>
                                  )}
                                </button>
                                <button
                                  onClick={() => handleDelete(user.id, user.full_name)}
                                  className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:bg-zinc-700 transition-colors"
                                >
                                  <Trash2 className="w-4 h-4" />
                                  Eliminar
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* No Results Message */}
      {!isLoading && users.length === 0 && (
        <div className="text-center py-16 bg-zinc-900 border border-zinc-800 rounded-xl mt-4">
          {debouncedSearch ? (
            // Search returned no results
            <div className="space-y-4">
              <div className="w-20 h-20 mx-auto bg-zinc-800 rounded-full flex items-center justify-center">
                <Search className="w-10 h-10 text-gray-500" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-300 mb-2">
                  No se encontraron usuarios
                </h3>
                <p className="text-gray-500 mb-4">
                  No hay usuarios que coincidan con <span className="text-orange-400 font-medium">"{debouncedSearch}"</span>
                </p>
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors text-white"
                >
                  Limpiar búsqueda
                </button>
              </div>
            </div>
          ) : (
            // No users exist at all
            <div className="space-y-3">
              <div className="w-20 h-20 mx-auto bg-zinc-800 rounded-full flex items-center justify-center">
                <Users className="w-10 h-10 text-gray-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-300">
                No hay usuarios registrados
              </h3>
              <p className="text-gray-500">
                Crea el primer usuario para comenzar
              </p>
            </div>
          )}
        </div>
      )}

      {/* Results Count */}
      {debouncedSearch && users.length > 0 && (
        <div className="mt-4 text-sm text-gray-400">
          Se {users.length === 1 ? 'encontró' : 'encontraron'} {users.length} usuario{users.length !== 1 ? 's' : ''}
        </div>
      )}
    </div>
  );
}
