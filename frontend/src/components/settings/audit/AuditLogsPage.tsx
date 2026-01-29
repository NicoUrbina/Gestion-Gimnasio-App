import { useState } from 'react';
import type { AuditLog, AuditLogFilters } from '../../../types/audit';
import AuditFilters from './AuditFilters';
import AuditLogsList from './AuditLogsList';
import AuditStats from './AuditStats';
import SessionsList from './SessionsList';
import AuditLogDetail from './AuditLogDetail';
import { ScrollText, BarChart3, Users } from 'lucide-react';

type TabType = 'logs' | 'stats' | 'sessions';

export default function AuditLogsPage() {
  const [activeTab, setActiveTab] = useState<TabType>('logs');
  const [filters, setFilters] = useState<AuditLogFilters>({});
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);

  const handleResetFilters = () => {
    setFilters({});
  };

  const tabs = [
    { id: 'logs' as TabType, name: 'Logs de Auditoría', icon: ScrollText },
    { id: 'stats' as TabType, name: 'Estadísticas', icon: BarChart3 },
    { id: 'sessions' as TabType, name: 'Sesiones', icon: Users },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">
          Auditoría y Logs del Sistema
        </h1>
        <p className="text-gray-400">
          Monitorea todas las acciones y cambios realizados en el sistema
        </p>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-zinc-900 p-1 rounded-xl border border-zinc-800">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all flex-1 ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/30'
                  : 'text-gray-400 hover:text-white hover:bg-zinc-800'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{tab.name}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'logs' && (
          <div className="space-y-6">
            <AuditFilters
              filters={filters}
              onFiltersChange={setFilters}
              onReset={handleResetFilters}
            />
            <AuditLogsList
              filters={filters}
              onViewDetails={setSelectedLog}
            />
          </div>
        )}

        {activeTab === 'stats' && <AuditStats />}

        {activeTab === 'sessions' && <SessionsList />}
      </div>

      {/* Detail Modal */}
      {selectedLog && (
        <AuditLogDetail
          log={selectedLog}
          onClose={() => setSelectedLog(null)}
        />
      )}
    </div>
  );
}
