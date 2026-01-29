import type { AuditLog } from '../../../types/audit';
import { X, User, Clock, Server, CheckCircle2, XCircle, Code } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import ActionBadge from './ActionBadge';

interface AuditLogDetailProps {
  log: AuditLog;
  onClose: () => void;
}

export default function AuditLogDetail({ log, onClose }: AuditLogDetailProps) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-zinc-800">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold text-white">Detalle del Log</h2>
            <span className="text-gray-500">#{log.id}</span>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-zinc-800 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto p-6 space-y-6">
          {/* Action and Status */}
          <div className="flex items-center gap-4">
            <ActionBadge action={log.action} size="lg" />
            {log.success ? (
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-lg text-green-400 font-medium">
                <CheckCircle2 className="w-5 h-5" />
                Exitoso
              </span>
            ) : (
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 font-medium">
                <XCircle className="w-5 h-5" />
                Fallido
              </span>
            )}
          </div>

          {/* Main Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <DetailField
              label="Usuario"
              value={log.user_name || 'Sistema'}
              icon={User}
            />
            <DetailField
              label="Timestamp"
              value={format(new Date(log.timestamp), 'dd/MM/yyyy HH:mm:ss', {
                locale: es,
              })}
              icon={Clock}
            />
            <DetailField
              label="Modelo"
              value={log.model_name}
              icon={Server}
            />
            <DetailField
              label="Objeto"
              value={log.object_repr}
            />
          </div>

          {/* Network Info */}
          {(log.ip_address || log.user_agent) && (
            <div className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-4 space-y-3">
              <h3 className="text-sm font-semibold text-gray-400 uppercase">
                Información de Red
              </h3>
              {log.ip_address && (
                <div>
                  <div className="text-xs text-gray-500 mb-1">IP Address</div>
                  <div className="text-white font-mono">{log.ip_address}</div>
                </div>
              )}
              {log.user_agent && (
                <div>
                  <div className="text-xs text-gray-500 mb-1">User Agent</div>
                  <div className="text-white text-sm break-all">{log.user_agent}</div>
                </div>
              )}
            </div>
          )}

          {/* Changes */}
          {log.changes && Object.keys(log.changes).length > 0 && (
            <div className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-4">
              <h3 className="text-sm font-semibold text-gray-400 uppercase mb-3 flex items-center gap-2">
                <Code className="w-4 h-4" />
                Cambios Realizados
              </h3>
              <div className="space-y-3">
                {Object.entries(log.changes).map(([field, values]) => (
                  <div key={field} className="border-l-2 border-orange-500 pl-4">
                    <div className="text-sm font-medium text-white mb-2">{field}</div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Antes</div>
                        <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded px-2 py-1 font-mono">
                          {values.old || 'null'}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Después</div>
                        <div className="text-sm text-green-400 bg-green-500/10 border border-green-500/20 rounded px-2 py-1 font-mono">
                          {values.new || 'null'}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Extra Data */}
          {log.extra_data && Object.keys(log.extra_data).length > 0 && (
            <div className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-4">
              <h3 className="text-sm font-semibold text-gray-400 uppercase mb-3">
                Datos Adicionales
              </h3>
              <pre className="text-sm text-gray-300 bg-zinc-900 border border-zinc-700 rounded-lg p-3 overflow-x-auto">
                {JSON.stringify(log.extra_data, null, 2)}
              </pre>
            </div>
          )}

          {/* Error Message */}
          {!log.success && log.error_message && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
              <h3 className="text-sm font-semibold text-red-400 uppercase mb-2">
                Mensaje de Error
              </h3>
              <p className="text-white">{log.error_message}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-zinc-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-white font-medium transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}

interface DetailFieldProps {
  label: string;
  value: string;
  icon?: any;
}

function DetailField({ label, value, icon: Icon }: DetailFieldProps) {
  return (
    <div className="bg-zinc-800/50 border border-zinc-700 rounded-lg p-4">
      <div className="text-xs text-gray-500 mb-1">{label}</div>
      <div className="flex items-center gap-2 text-white">
        {Icon && <Icon className="w-4 h-4 text-gray-500" />}
        <span className="font-medium">{value}</span>
      </div>
    </div>
  );
}
