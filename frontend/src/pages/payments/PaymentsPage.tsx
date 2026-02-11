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

  const [exporting, setExporting] = useState(false);

  const handleExport = async () => {
    try {
      setExporting(true);
      const blob = await paymentService.exportReport(startDate, endDate);

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `reporte_pagos_${new Date().toISOString().slice(0, 10)}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error: any) {
      console.error('Error exportando:', error);
      alert(error.response?.data?.detail || 'Error al exportar el reporte');
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white uppercase tracking-tight flex items-center gap-3">
            <DollarSign className="w-7 h-7 text-orange-500" />
            Pagos
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            {payments.length} transacciones registradas
          </p>
        </div>
        <button
          onClick={() => navigate('/payments/new')}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg shadow-orange-500/30"
        >
          <Plus className="w-5 h-5" />
          Registrar Pago
        </button>
      </div>

      {/* Filters and Export */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div>
              <label className="block text-xs text-gray-400 mb-1">Desde</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-white focus:outline-none focus:border-orange-500 transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Hasta</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-white focus:outline-none focus:border-orange-500 transition-colors"
              />
            </div>
          </div>
          <button
            onClick={handleExport}
            disabled={exporting}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white font-medium rounded-xl hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {exporting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Download className="w-4 h-4" />
            )}
            {exporting ? 'Exportando...' : 'Exportar Excel'}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-1">
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
                  ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/25'
                  : 'text-gray-400 hover:bg-zinc-800 hover:text-white'
                }
              `}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-400">
            <DollarSign className="w-12 h-12 mb-3" />
            <p className="text-lg font-medium">No hay pagos</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-zinc-800">
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Fecha</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Miembro</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Monto</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Método</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Estado</th>
                  <th className="text-right px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {filtered.map(payment => (
                  <tr key={payment.id} className="hover:bg-zinc-800/50 transition-colors">
                    <td className="px-6 py-4 text-sm text-gray-400">
                      {new Date(payment.payment_date).toLocaleDateString('es-ES')}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-white">{payment.member_name}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-semibold text-white">
                        ${parseFloat(payment.amount).toFixed(2)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-gray-400">
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
                              className="p-2 text-green-400 hover:text-green-300 hover:bg-zinc-800 rounded-lg transition-colors disabled:opacity-50"
                              title="Aprobar"
                            >
                              <CheckCircle className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => handleReject(payment.id)}
                              disabled={acting === payment.id}
                              className="p-2 text-red-400 hover:text-red-300 hover:bg-zinc-800 rounded-lg transition-colors disabled:opacity-50"
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
