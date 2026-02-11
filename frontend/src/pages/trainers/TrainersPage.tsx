import { useState, useCallback, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Dumbbell,
  Plus,
  Search,
  Mail,
  Phone,
  Calendar,
  Edit,
  MoreVertical,
  UserCheck,
  UserX,
  Trash2,
  DollarSign,
  Filter,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { trainersService } from '../../services/trainers';
import Spinner from '../../components/Spinner';
import { useDebounce } from '../../hooks/useDebounce';

export default function TrainersPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);
  const queryClient = useQueryClient();
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Debounce search - wait 500ms after user stops typing
  const debouncedSearch = useDebounce(search, 500);

  // Fetch trainers from API - using debounced search
  const { data: trainers = [], isLoading, error } = useQuery({
    queryKey: ['trainers', debouncedSearch, statusFilter],
    queryFn: () => {
      const params: any = { search: debouncedSearch };
      if (statusFilter === 'active') {
        params.is_active = true;
      } else if (statusFilter === 'inactive') {
        params.is_active = false;
      }
      // Si statusFilter es 'all', no agregamos el parámetro is_active
      return trainersService.getAll(params);
    },
    retry: false, // Don't retry on auth errors
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (trainerId: number) => trainersService.delete(trainerId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trainers'] });
      toast.success('Entrenador eliminado correctamente');
      setOpenDropdown(null);
    },
    onError: () => {
      toast.error('Error al eliminar el entrenador');
    },
  });

  // Toggle active mutation
  const toggleActiveMutation = useMutation({
    mutationFn: ({ trainerId, isActive }: { trainerId: number; isActive: boolean }) =>
      trainersService.toggleActive(trainerId, isActive),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trainers'] });
      toast.success('Entrenador actualizado correctamente');
      setOpenDropdown(null);
    },
    onError: () => {
      toast.error('Error al actualizar el entrenador');
    },
  });

  // Keep focus on search input when results update
  useEffect(() => {
    if (searchInputRef.current && document.activeElement === searchInputRef.current) {
      const timeout = setTimeout(() => {
        searchInputRef.current?.focus();
      }, 0);
      return () => clearTimeout(timeout);
    }
  }, [trainers]);

  // Memoize handlers to prevent unnecessary re-renders
  const handleToggleActive = useCallback((trainerId: number, currentStatus: boolean) => {
    toggleActiveMutation.mutate({ trainerId, isActive: !currentStatus });
  }, [toggleActiveMutation]);

  const handleDelete = useCallback((trainerId: number, trainerName: string) => {
    if (window.confirm(`¿Estás seguro de eliminar a ${trainerName}?`)) {
      deleteMutation.mutate(trainerId);
    }
    setOpenDropdown(null);
  }, [deleteMutation]);

  // Memoize search clear handler
  const handleClearSearch = useCallback(() => {
    setSearch('');
    searchInputRef.current?.focus(); // Keep focus after clearing
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white uppercase tracking-tight flex items-center gap-3">
            <Dumbbell className="w-7 h-7 text-orange-500" />
            Gestión de Entrenadores
          </h1>
          <p className="text-gray-400 text-sm">
            {trainers.length} entrenador{trainers.length !== 1 ? 'es' : ''} 
            {statusFilter === 'active' && ' activos'}
            {statusFilter === 'inactive' && ' inactivos'}
            {statusFilter === 'all' && ' registrados'}
          </p>
        </div>

        <Link
          to="/trainers/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg shadow-orange-500/30"
        >
          <Plus className="w-5 h-5" />
          Nuevo Entrenador
        </Link>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
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

        {/* Status Filter */}
        <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2.5">
          <Filter className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-400 whitespace-nowrap">Estado:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as 'all' | 'active' | 'inactive')}
            className="bg-transparent text-white text-sm focus:outline-none cursor-pointer"
          >
            <option value="all" className="bg-zinc-800">Todos</option>
            <option value="active" className="bg-zinc-800">Activos</option>
            <option value="inactive" className="bg-zinc-800">Inactivos</option>
          </select>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && !trainers.length && (
        <div className="flex items-center justify-center py-16">
          <Spinner size="lg" />
        </div>
      )}

      {/* Error State */}
      {error && !trainers.length && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
          <p className="text-sm text-red-400">
            Error al cargar entrenadores. Por favor, intenta nuevamente.
          </p>
        </div>
      )}

      {/* Trainers Table - Only show if we have trainers or if we're not in initial load */}
      {(!isLoading || trainers.length > 0) && !error && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-zinc-800">
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Entrenador
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Contacto
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Información
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Contratación
                  </th>
                  <th className="text-right px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {trainers.map((trainer) => (
                  <tr
                    key={trainer.id}
                    className="hover:bg-zinc-800/50 transition-colors"
                  >
                    {/* Entrenador */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg shadow-orange-500/20">
                          {trainer.first_name?.charAt(0) || trainer.full_name?.charAt(0) || '?'}
                        </div>
                        <div>
                          <p className="font-semibold text-white">{trainer.full_name || 'Sin nombre'}</p>
                          <p className="text-sm text-gray-400">{trainer.email || 'Sin email'}</p>
                        </div>
                      </div>
                    </td>

                    {/* Contacto */}
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                          <Mail className="w-4 h-4" />
                          <span className="truncate max-w-[200px]">{trainer.email || 'Sin email'}</span>
                        </div>
                        {trainer.phone && (
                          <div className="flex items-center gap-2 text-sm text-gray-400">
                            <Phone className="w-4 h-4" />
                            <span>{trainer.phone}</span>
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Información */}
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        {trainer.hourly_rate && (
                          <div className="flex items-center gap-2 text-sm text-gray-400">
                            <DollarSign className="w-4 h-4" />
                            <span>${trainer.hourly_rate}/hora</span>
                          </div>
                        )}
                        {trainer.certifications && trainer.certifications.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {trainer.certifications.slice(0, 2).map((cert, index) => (
                              <span
                                key={index}
                                className="inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full bg-blue-500/20 text-blue-400"
                              >
                                {cert}
                              </span>
                            ))}
                            {trainer.certifications.length > 2 && (
                              <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full bg-gray-500/20 text-gray-400">
                                +{trainer.certifications.length - 2}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Estado */}
                    <td className="px-6 py-4">
                      {trainer.is_active ? (
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

                    {/* Contratación */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {trainer.hire_date ? new Date(trainer.hire_date).toLocaleDateString('es-ES', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                          }) : 'Sin fecha'}
                        </span>
                      </div>
                    </td>

                    {/* Acciones */}
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/trainers/${trainer.id}/edit`}
                          className="p-2 text-gray-400 hover:text-orange-400 hover:bg-zinc-800 rounded-lg transition-colors"
                          title="Editar"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>

                        {/* Dropdown Menu */}
                        <div className="relative">
                          <button
                            onClick={() =>
                              setOpenDropdown(openDropdown === trainer.id ? null : trainer.id)
                            }
                            className="p-2 text-gray-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
                            title="Más opciones"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>

                          {openDropdown === trainer.id && (
                            <>
                              <div
                                className="fixed inset-0 z-10"
                                onClick={() => setOpenDropdown(null)}
                              />
                              <div className="absolute right-0 mt-2 w-48 bg-zinc-800 border border-zinc-700 rounded-xl shadow-xl z-20 overflow-hidden">
                                <button
                                  onClick={() => handleToggleActive(trainer.id, trainer.is_active)}
                                  className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-300 hover:bg-zinc-700 transition-colors"
                                >
                                  {trainer.is_active ? (
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
                                  onClick={() => handleDelete(trainer.id, trainer.full_name || 'Entrenador')}
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
      {!isLoading && trainers.length === 0 && (
        <div className="text-center py-16 bg-zinc-900 border border-zinc-800 rounded-xl mt-4">
          {debouncedSearch ? (
            // Search returned no results
            <div className="space-y-4">
              <div className="w-20 h-20 mx-auto bg-zinc-800 rounded-full flex items-center justify-center">
                <Search className="w-10 h-10 text-gray-500" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-300 mb-2">
                  No se encontraron entrenadores
                </h3>
                <p className="text-gray-500 mb-4">
                  No hay entrenadores que coincidan con <span className="text-orange-400 font-medium">"{debouncedSearch}"</span>
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
            // No trainers exist at all
            <div className="space-y-3">
              <div className="w-20 h-20 mx-auto bg-zinc-800 rounded-full flex items-center justify-center">
                <Dumbbell className="w-10 h-10 text-gray-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-300">
                No hay entrenadores registrados
              </h3>
              <p className="text-gray-500">
                Crea el primer entrenador para comenzar
              </p>
            </div>
          )}
        </div>
      )}

      {/* Results Count */}
      {debouncedSearch && trainers.length > 0 && (
        <div className="mt-4 text-sm text-gray-400">
          Se {trainers.length === 1 ? 'encontró' : 'encontraron'} {trainers.length} entrenador{trainers.length !== 1 ? 'es' : ''}
        </div>
      )}
    </div>
  );
}