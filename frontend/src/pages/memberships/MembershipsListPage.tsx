import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  Filter,
  Snowflake,
  Play,
  AlertCircle,
  CreditCard,
} from 'lucide-react';
import { membershipService } from '../../services/memberships';
import MembershipStatusBadge from '../../components/memberships/MembershipStatusBadge';
import type { Membership } from '../../types';

type StatusFilter = 'all' | 'active' | 'frozen' | 'expired' | 'cancelled';

export default function MembershipsListPage() {
  const navigate = useNavigate();
  const [memberships, setMemberships] = useState<Membership[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [page, setPage] = useState(1);
  const [freezing, setFreezing] = useState<number | null>(null);

  useEffect(() => {
    fetchMemberships();
  }, [statusFilter]);

  const fetchMemberships = async () => {
    try {
      setLoading(true);
      const filters = statusFilter !== 'all' ? { status: statusFilter } : undefined;
      const data = await membershipService.getAll(filters);
      setMemberships(data);
    } catch (error) {
      console.error('Error fetching memberships:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFreeze = async (id: number) => {
    const reason = prompt('Motivo del congelamiento:');
    if (!reason) return;

    try {
      setFreezing(id);
      await membershipService.freeze(id, reason);
      await fetchMemberships();
    } catch (error) {
      console.error('Error freezing membership:', error);
      alert('No se pudo congelar la membresía');
    } finally {
      setFreezing(null);
    }
  };

  const handleUnfreeze = async (id: number) => {
    if (!confirm('¿Descongelar esta membresía?')) return;

    try {
      setFreezing(id);
      await membershipService.unfreeze(id);
      await fetchMemberships();
    } catch (error) {
      console.error('Error unfreezing membership:', error);
      alert('No se pudo descongelar la membresía');
    } finally {
      setFreezing(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white uppercase tracking-tight flex items-center gap-3">
            <CreditCard className="w-7 h-7 text-orange-500" />
            Membresías
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            {memberships.length} membresías registradas
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => navigate('/memberships/plans')}
            className="flex items-center gap-2 px-4 py-2.5 bg-zinc-800 border border-zinc-700 text-gray-300 font-medium rounded-xl hover:bg-zinc-700 hover:text-white transition-all"
          >
            Ver Planes
          </button>
          <button
            onClick={() => navigate('/memberships/assign')}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg shadow-orange-500/30"
          >
            <Plus className="w-5 h-5" />
            Asignar Membresía
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2">
        <Filter className="w-5 h-5 text-gray-400" />
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value as StatusFilter);
            setPage(1);
          }}
          className="px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-orange-500 transition-colors"
        >
          <option value="all">Todos los estados</option>
          <option value="active">Activas</option>
          <option value="frozen">Congeladas</option>
          <option value="expired">Vencidas</option>
          <option value="cancelled">Canceladas</option>
        </select>
      </div>

      {/* Memberships Table */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : memberships.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-400">
            <p className="text-lg font-medium">No se encontraron membresías</p>
            <p className="text-sm mt-1">Asigna una nueva membresía para comenzar</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-zinc-800">
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Miembro
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Plan
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Fecha Inicio
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Vencimiento
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Días Restantes
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="text-right px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {memberships.map((membership) => (
                  <tr
                    key={membership.id}
                    className="hover:bg-zinc-800/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="font-semibold text-white">
                        {membership.member_name}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-400">
                        {membership.plan_name}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-400">
                        {new Date(membership.start_date).toLocaleDateString('es-ES')}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-400">
                        {new Date(membership.end_date).toLocaleDateString('es-ES')}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-sm font-medium ${membership.days_remaining <= 7
                              ? 'text-red-400'
                              : membership.days_remaining <= 15
                                ? 'text-yellow-400'
                                : 'text-white'
                            }`}
                        >
                          {membership.days_remaining} días
                        </span>
                        {membership.is_expiring_soon && (
                          <AlertCircle className="w-4 h-4 text-red-500" />
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <MembershipStatusBadge
                        status={membership.status}
                        daysRemaining={membership.days_remaining}
                      />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {membership.status === 'active' && (
                          <button
                            onClick={() => handleFreeze(membership.id)}
                            disabled={freezing === membership.id}
                            className="p-2 text-blue-400 hover:text-blue-300 hover:bg-zinc-800 rounded-lg transition-colors disabled:opacity-50"
                            title="Congelar"
                          >
                            <Snowflake className="w-4 h-4" />
                          </button>
                        )}
                        {membership.status === 'frozen' && (
                          <button
                            onClick={() => handleUnfreeze(membership.id)}
                            disabled={freezing === membership.id}
                            className="p-2 text-emerald-400 hover:text-emerald-300 hover:bg-zinc-800 rounded-lg transition-colors disabled:opacity-50"
                            title="Descongelar"
                          >
                            <Play className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
