import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Loader2, DollarSign, CheckCircle, XCircle, Download } from 'lucide-react';
import { paymentService } from '../../services/payments';
import PaymentStatusBadge from '../../components/payments/PaymentStatusBadge';
import PaymentMethodIcon from '../../components/payments/PaymentMethodIcon';
import type { Payment } from '../../types';

type TabType = 'all' | 'pending' | 'completed' | 'cancelled';

export default function PaymentsPage() {
  const navigate = useNavigate();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [pendingCount, setPendingCount] = useState(0);
  const [acting, setActing] = useState<number | null>(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    fetchPayments();
    fetchPendingCount();
  }, []);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const data = await paymentService.getAll();
      setPayments(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error:', error);
      setPayments([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchPendingCount = async () => {
    try {
      const count = await paymentService.getPendingCount();
      setPendingCount(count);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleApprove = async (id: number) => {
    if (!confirm('¿Aprobar este pago?')) return;

    try {
      setActing(id);
      await paymentService.approve(id);
      await fetchPayments();
      await fetchPendingCount();
      alert('Pago aprobado exitosamente');
    } catch (error: any) {
      alert(error.response?.data?.detail || 'Error al aprobar');
    } finally {
      setActing(null);
    }
  };

  const handleReject = async (id: number) => {
    const reason = prompt('Motivo del rechazo:');
    if (!reason) return;

    try {
      setActing(id);
      await paymentService.reject(id, reason);
      await fetchPayments();
      await fetchPendingCount();
      alert('Pago rechazado');
    } catch (error: any) {
      alert(error.response?.data?.detail || 'Error al rechazar');
    } finally {
      setActing(null);
    }
  };

  const filterPayments = () => {
    if (activeTab === 'all') return payments;
    return payments.filter(p => p.status === activeTab);
  };

  const filtered = filterPayments();

  const handleExport = () => {
    const params = new URLSearchParams();
    if (startDate) params.append('start_date', startDate);
    if (endDate) params.append('end_date', endDate);

    const url = `http://localhost:8000/api/payments/export_report/?${params.toString()}`;
    window.open(url, '_blank');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Pagos</h1>
          <p className="text-slate-500 mt-1">Gestión de pagos y transacciones</p>
        </div>
        <button
          onClick={() => navigate('/payments/new')}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-cyan-600 text-white font-medium rounded-xl hover:from-purple-500 hover:to-cyan-500 shadow-lg shadow-purple-500/25 transition-all"
        >
          <Plus className="w-5 h-5" />
          Registrar Pago
        </button>
      </div>

      {/* Filters and Export */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div>
              <label className="block text-xs text-slate-500 mb-1">Desde</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">Hasta</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white font-medium rounded-xl hover:bg-green-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            Exportar Excel
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl border border-slate-200 p-1">
        <div className="grid grid-cols-4 gap-2">
          {[
            { key: 'all', label: 'Todos' },
            { key: 'pending', label: `Pendientes ${pendingCount > 0 ? `(${pendingCount})` : ''}` },
            { key: 'completed', label: 'Completados' },
            { key: 'cancelled', label: 'Rechazados' },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as TabType)}
              className={`
                px-4 py-2.5 rounded-xl font-medium text-sm transition-all
                ${activeTab === tab.key
                  ? 'bg-gradient-to-r from-purple-600 to-cyan-600 text-white shadow-lg shadow-purple-500/25'
                  : 'text-slate-600 hover:bg-slate-50'
                }
              `}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-slate-400">
            <DollarSign className="w-12 h-12 mb-3" />
            <p className="text-lg font-medium">No hay pagos</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Fecha</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Miembro</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Monto</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Método</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Estado</th>
                  <th className="text-right px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map(payment => (
                  <tr key={payment.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {new Date(payment.payment_date).toLocaleDateString('es-ES')}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-900">{payment.member_name}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-semibold text-slate-900">
                        ${parseFloat(payment.amount).toFixed(2)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <PaymentMethodIcon method={payment.payment_method} className="w-4 h-4" />
                        {payment.payment_method_display}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <PaymentStatusBadge status={payment.status} />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        {payment.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleApprove(payment.id)}
                              disabled={acting === payment.id}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors disabled:opacity-50"
                              title="Aprobar"
                            >
                              <CheckCircle className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => handleReject(payment.id)}
                              disabled={acting === payment.id}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                              title="Rechazar"
                            >
                              <XCircle className="w-5 h-5" />
                            </button>
                          </>
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
