import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DollarSign, Plus, Download, CheckCircle, XCircle, Eye, Image, Search, X } from 'lucide-react';
import { paymentService } from '../../services/payments';
import api from '../../services/api';
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
  const [searchTerm, setSearchTerm] = useState('');

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
    let result = payments;
    
    // Filtrar por estado
    if (activeTab !== 'all') {
      result = result.filter(p => p.status === activeTab);
    }
    
    // Filtrar por término de búsqueda
    if (searchTerm.trim()) {
      result = result.filter(p => 
        p.member_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return result;
  };

  const filtered = filterPayments();

  const handleExport = async () => {
    // Validar que fecha inicio no sea posterior a fecha fin
    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
      alert('La fecha de inicio no puede ser posterior a la fecha de fin');
      return;
    }

    const params = new URLSearchParams();
    if (startDate) params.append('start_date', startDate);
    if (endDate) params.append('end_date', endDate);

    try {
      const response = await api.get(`/payments/export_report/?${params.toString()}`, {
        responseType: 'blob',
      });
      
      // Crear enlace de descarga
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `pagos_${new Date().getTime()}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error: any) {
      alert(error.response?.data?.detail || 'Error al exportar el reporte');
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
        <div className="flex flex-col gap-4">
          {/* Search */}
          <div className="flex items-center gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por nombre de miembro..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 transition-colors"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  title="Limpiar búsqueda"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
          
          {/* Date filters and export */}
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
          </div>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white font-medium rounded-xl hover:bg-emerald-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            Exportar Excel
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
                        {payment.receipt_image && (
                          <span title="Tiene comprobante">
                            <Image className="w-4 h-4 text-green-400 ml-auto" />
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <PaymentStatusBadge status={payment.status} />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        {/* Botón ver detalles para todos los pagos */}
                        <button
                          onClick={() => navigate(`/payments/${payment.id}`)}
                          className="p-2 text-blue-400 hover:text-blue-300 hover:bg-zinc-800 rounded-lg transition-colors"
                          title="Ver detalles"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                        
                        {/* Botones aprobar/rechazar solo para pendientes */}
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
