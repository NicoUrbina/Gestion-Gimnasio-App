import { useState } from 'react';
import type { AuditLogFilters, AuditAction } from '../../../types/audit';
import { Filter, X, Calendar } from 'lucide-react';

interface AuditFiltersProps {
  filters: AuditLogFilters;
  onFiltersChange: (filters: AuditLogFilters) => void;
  onReset: () => void;
}

const ACTIONS: AuditAction[] = [
  'CREATE',
  'UPDATE',
  'DELETE',
  'APPROVE',
  'REJECT',
  'LOGIN',
  'LOGOUT',
  'FAILED_LOGIN',
  'ACCESS',
  'FREEZE',
  'UNFREEZE',
  'CANCEL',
];

const MODELS = [
  'Payment',
  'Membership',
  'Member',
  'GymClass',
  'Reservation',
  'User',
  'Staff',
  'Invoice',
];

export default function AuditFilters({
  filters,
  onFiltersChange,
  onReset,
}: AuditFiltersProps) {
  const [showFilters, setShowFilters] = useState(false);

  const hasActiveFilters = Object.values(filters).some((v) => v !== undefined);

  const handleFilterChange = (key: keyof AuditLogFilters, value: any) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
      {/* Filter Toggle */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-sm font-medium transition-colors"
        >
          <Filter className="w-4 h-4" />
          Filtros
          {hasActiveFilters && (
            <span className="ml-1 px-2 py-0.5 bg-orange-500/20 text-orange-400 text-xs rounded-full">
              Activos
            </span>
          )}
        </button>

        {hasActiveFilters && (
          <button
            onClick={onReset}
            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
            Limpiar Filtros
          </button>
        )}
      </div>

      {/* Filter Controls */}
      {showFilters && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-zinc-800">
          {/* Action Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Acción
            </label>
            <select
              value={filters.action || ''}
              onChange={(e) =>
                handleFilterChange('action', e.target.value || undefined)
              }
              className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="">Todas</option>
              {ACTIONS.map((action) => (
                <option key={action} value={action}>
                  {action}
                </option>
              ))}
            </select>
          </div>

          {/* Model Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Modelo
            </label>
            <select
              value={filters.model || ''}
              onChange={(e) =>
                handleFilterChange('model', e.target.value || undefined)
              }
              className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="">Todos</option>
              {MODELS.map((model) => (
                <option key={model} value={model}>
                  {model}
                </option>
              ))}
            </select>
          </div>

          {/* Start Date */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Fecha Desde
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="date"
                value={filters.start_date || ''}
                onChange={(e) =>
                  handleFilterChange('start_date', e.target.value || undefined)
                }
                className="w-full pl-10 pr-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>

          {/* End Date */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Fecha Hasta
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="date"
                value={filters.end_date || ''}
                onChange={(e) =>
                  handleFilterChange('end_date', e.target.value || undefined)
                }
                className="w-full pl-10 pr-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>

          {/* Success Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Estado
            </label>
            <select
              value={
                filters.success === undefined
                  ? ''
                  : filters.success
                  ? 'true'
                  : 'false'
              }
              onChange={(e) =>
                handleFilterChange(
                  'success',
                  e.target.value === '' ? undefined : e.target.value === 'true'
                )
              }
              className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="">Todos</option>
              <option value="true">Exitoso</option>
              <option value="false">Fallido</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
}
