/**
 * Abandonment Alerts Page - Alertas de abandono
 */
import { useState, useEffect } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { AlertTriangle, CheckCircle, XCircle, Clock } from 'lucide-react';

interface AbandonmentAlert {
    id: number;
    member: number;
    member_name?: string;
    days_inactive: number;
    status: string;
    created_at: string;
    resolved_at: string | null;
    notes: string;
}

export default function AbandonmentAlertsPage() {
    const [alerts, setAlerts] = useState<AbandonmentAlert[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedStatus, setSelectedStatus] = useState<string>('pending');

    useEffect(() => {
        fetchAlerts();
    }, []);

    const fetchAlerts = async () => {
        try {
            const response = await api.get('/access/alerts/');
            setAlerts(response.data);
        } catch (error) {
            toast.error('Error al cargar las alertas');
        } finally {
            setIsLoading(false);
        }
    };

    const handleResolve = async (alertId: number) => {
        try {
            await api.patch(`/access/alerts/${alertId}/`, { status: 'resolved' });
            toast.success('Alerta resuelta');
            fetchAlerts();
        } catch (error) {
            toast.error('Error al resolver la alerta');
        }
    };

    const filteredAlerts = alerts.filter((alert) => !selectedStatus || alert.status === selectedStatus);

    const getStatusBadge = (status: string) => {
        const badges: Record<string, { bg: string; text: string; icon: any }> = {
            pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: Clock },
            contacted: { bg: 'bg-blue-100', text: 'text-blue-800', icon: AlertTriangle },
            resolved: { bg: 'bg-green-100', text: 'text-green-800', icon: CheckCircle },
            dismissed: { bg: 'bg-gray-100', text: 'text-gray-800', icon: XCircle },
        };
        const badge = badges[status] || badges.pending;
        const Icon = badge.icon;
        return (
            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${badge.bg} ${badge.text}`}>
                <Icon className="w-4 h-4" />
                {status === 'pending' ? 'Pendiente' : status === 'contacted' ? 'Contactado' : status === 'resolved' ? 'Resuelto' : 'Descartado'}
            </span>
        );
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tight">Alertas de Abandono</h1>
                <p className="text-slate-600 mt-1">Miembros inactivos que requieren seguimiento</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
                <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                    <option value="">Todos los estados</option>
                    <option value="pending">Pendientes</option>
                    <option value="contacted">Contactados</option>
                    <option value="resolved">Resueltos</option>
                    <option value="dismissed">Descartados</option>
                </select>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {filteredAlerts.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
                        <AlertTriangle className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-slate-900 mb-2">No hay alertas</h3>
                        <p className="text-slate-600">No se encontraron alertas con los filtros seleccionados</p>
                    </div>
                ) : (
                    filteredAlerts.map((alert) => (
                        <div key={alert.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h3 className="text-lg font-bold text-slate-900">
                                            {alert.member_name || `Miembro #${alert.member}`}
                                        </h3>
                                        {getStatusBadge(alert.status)}
                                    </div>
                                    <p className="text-slate-600 mb-2">
                                        <span className="font-semibold">{alert.days_inactive} días</span> sin actividad
                                    </p>
                                    {alert.notes && <p className="text-sm text-slate-500">{alert.notes}</p>}
                                </div>
                                {alert.status === 'pending' && (
                                    <button
                                        onClick={() => handleResolve(alert.id)}
                                        className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold transition"
                                    >
                                        Marcar como Resuelto
                                    </button>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
