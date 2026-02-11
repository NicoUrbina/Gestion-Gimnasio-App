import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  Search,
  Filter,
  MoreVertical,
  Mail,
  Phone,
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
  Snowflake,
  ChevronLeft,
  ChevronRight,
  Users,
  Eye,
  Pencil,
  Trash2,
} from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';
import type { Member } from '../types';

type SubscriptionStatus = 'all' | 'active' | 'inactive' | 'expired' | 'frozen';

export default function MembersPage() {
  const navigate = useNavigate();
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<SubscriptionStatus>('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchMembers();
  }, [statusFilter, page]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchMembers = async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = {};
      if (statusFilter !== 'all') {
        params.subscription_status = statusFilter;
      }
      if (searchQuery) {
        params.search = searchQuery;
      }

      const response = await api.get('/members/', { params });
      setMembers(response.data.results || response.data);
      // Si hay paginación
      if (response.data.count) {
        setTotalPages(Math.ceil(response.data.count / 10));
      }
    } catch (error) {
      console.error('Error fetching members:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchMembers();
  };

  const handleDeleteMember = async (memberId: number) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este miembro? Esta acción no se puede deshacer.')) {
      return;
    }
    try {
      await api.delete(`/members/${memberId}/`);
      toast.success('Miembro eliminado correctamente');
      setOpenMenuId(null);
      fetchMembers();
    } catch (error: any) {
      console.error('Error deleting member:', error);
      toast.error(error.response?.data?.detail || 'Error al eliminar el miembro');
    }
  };

  const getStatusConfig = (status: string) => {
    const configs: Record<string, { color: string; bg: string; icon: React.ReactNode; label: string }> = {
      active: {
        color: 'text-emerald-700',
        bg: 'bg-emerald-100',
        icon: <CheckCircle2 className="w-4 h-4" />,
        label: 'Activo',
      },
      inactive: {
        color: 'text-gray-400',
        bg: 'bg-zinc-800',
        icon: <XCircle className="w-4 h-4" />,
        label: 'Inactivo',
      },
      expired: {
        color: 'text-red-700',
        bg: 'bg-red-100',
        icon: <Clock className="w-4 h-4" />,
        label: 'Vencido',
      },
      frozen: {
        color: 'text-blue-700',
        bg: 'bg-blue-100',
        icon: <Snowflake className="w-4 h-4" />,
        label: 'Congelado',
      },
    };
    return configs[status] || configs.inactive;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white uppercase tracking-tight flex items-center gap-3">
            <Users className="w-7 h-7 text-orange-500" />
            Miembros
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            {members.length} miembros registrados
          </p>
        </div>
        <button
          onClick={() => navigate('/members/new')}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg shadow-orange-500/30"
        >
          <Plus className="w-5 h-5" />
          Nuevo Miembro
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Buscar por nombre, email o teléfono..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch(e)}
          autoComplete="off"
          className="w-full pl-10 pr-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 transition-colors"
        />
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-gray-400" />
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value as SubscriptionStatus);
              setPage(1);
            }}
            className="px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-orange-500 transition-colors"
          >
            <option value="all">Todos los estados</option>
            <option value="active">Activos</option>
            <option value="inactive">Inactivos</option>
            <option value="expired">Vencidos</option>
            <option value="frozen">Congelados</option>
          </select>
        </div>
      </div>

      {/* Members Table */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : members.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-400">
            <p className="text-lg font-medium">No se encontraron miembros</p>
            <p className="text-sm mt-1">Intenta cambiar los filtros de búsqueda</p>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-zinc-800">
                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Miembro
                    </th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Contacto
                    </th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Inscripción
                    </th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Último Acceso
                    </th>
                    <th className="text-right px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800">
                  {members.map((member) => {
                    const status = getStatusConfig(member.subscription_status);
                    return (
                      <tr
                        key={member.id}
                        className="hover:bg-zinc-800/50 transition-colors cursor-pointer"
                        onClick={() => navigate(`/members/${member.id}`)}
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg shadow-orange-500/20">
                              {member.user?.first_name?.charAt(0) || 'M'}
                            </div>
                            <div>
                              <p className="font-semibold text-white">
                                {member.user?.first_name} {member.user?.last_name}
                              </p>
                              <p className="text-sm text-gray-400">ID: {member.id}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-sm text-gray-400">
                              <Mail className="w-4 h-4" />
                              {member.user?.email}
                            </div>
                            {member.phone && (
                              <div className="flex items-center gap-2 text-sm text-gray-400">
                                <Phone className="w-4 h-4" />
                                {member.phone}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${status.bg} ${status.color}`}
                          >
                            {status.icon}
                            {status.label}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 text-sm text-gray-400">
                            <Calendar className="w-4 h-4" />
                            {member.joined_date
                              ? new Date(member.joined_date).toLocaleDateString('es-ES')
                              : '-'}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-gray-400">
                            {member.last_access
                              ? new Date(member.last_access).toLocaleDateString('es-ES')
                              : 'Nunca'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="relative inline-block" ref={openMenuId === member.id ? menuRef : null}>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setOpenMenuId(openMenuId === member.id ? null : member.id);
                              }}
                              className="p-2 text-gray-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
                            >
                              <MoreVertical className="w-5 h-5" />
                            </button>

                            {openMenuId === member.id && (
                              <div className="absolute right-0 top-full mt-1 w-48 bg-zinc-800 border border-zinc-700 rounded-xl shadow-2xl shadow-black/50 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setOpenMenuId(null);
                                    navigate(`/members/${member.id}`);
                                  }}
                                  className="flex items-center gap-3 w-full px-4 py-3 text-sm text-gray-300 hover:bg-zinc-700 hover:text-white transition-colors"
                                >
                                  <Eye className="w-4 h-4" />
                                  Ver detalles
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setOpenMenuId(null);
                                    navigate(`/members/${member.id}/edit`);
                                  }}
                                  className="flex items-center gap-3 w-full px-4 py-3 text-sm text-gray-300 hover:bg-zinc-700 hover:text-white transition-colors"
                                >
                                  <Pencil className="w-4 h-4" />
                                  Editar
                                </button>
                                <div className="border-t border-zinc-700" />
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteMember(member.id);
                                  }}
                                  className="flex items-center gap-3 w-full px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
                                >
                                  <Trash2 className="w-4 h-4" />
                                  Eliminar
                                </button>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden divide-y divide-zinc-800">
              {members.map((member) => {
                const status = getStatusConfig(member.subscription_status);
                return (
                  <div
                    key={member.id}
                    className="p-4 hover:bg-zinc-800/50 transition-colors"
                    onClick={() => navigate(`/members/${member.id}`)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg shadow-orange-500/20">
                          {member.user?.first_name?.charAt(0) || 'M'}
                        </div>
                        <div>
                          <p className="font-semibold text-white">
                            {member.user?.first_name} {member.user?.last_name}
                          </p>
                          <p className="text-sm text-gray-400">{member.user?.email}</p>
                        </div>
                      </div>
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${status.bg} ${status.color}`}
                      >
                        {status.icon}
                        {status.label}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-zinc-800">
            <p className="text-sm text-gray-400">
              Página {page} de {totalPages}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-2 rounded-lg border border-zinc-700 text-gray-400 hover:bg-zinc-800 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-gray-400 transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-2 rounded-lg border border-zinc-700 text-gray-400 hover:bg-zinc-800 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-gray-400 transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
