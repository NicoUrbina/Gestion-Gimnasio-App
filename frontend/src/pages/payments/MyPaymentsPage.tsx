import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Loader2, DollarSign } from 'lucide-react';
import { paymentService } from '../../services/payments';
import PaymentStatusBadge from '../../components/payments/PaymentStatusBadge';
import PaymentMethodIcon from '../../components/payments/PaymentMethodIcon';
import type { Payment } from '../../types';

type TabType = 'all' | 'pending' | 'completed' | 'cancelled';

export default function MyPaymentsPage() {
  const navigate = useNavigate();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>('all');

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const data = await paymentService.getMyPayments();
      setPayments(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching payments:', error);
      setPayments([]);
    } finally {
      setLoading(false);
    }
  };

  const filterPayments = () => {
    if (activeTab === 'all') return payments;
    return payments.filter(p => p.status === activeTab);
  };

  const filtered = filterPayments();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Mis Pagos</h1>
          <p className="text-slate-500 mt-1">Historial de tus pagos y transacciones</p>
        </div>
        <button
          onClick={() => navigate('/payments/submit')}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-cyan-600 text-white font-medium rounded-xl hover:from-purple-500 hover:to-cyan-500 shadow-lg shadow-purple-500/25 transition-all"
        >
          <Plus className="w-5 h-5" />
          Registrar Pago
        </button>
      </div>

      {/* Tabs */}
      <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-1">
        <div className="grid grid-cols-4 gap-2">
          {[
            { key: 'all', label: 'Todos' },
            { key: 'pending', label: 'Pendientes' },
            { key: 'completed', label: 'Pagados' },
            { key: 'cancelled', label: 'Rechazados' },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as TabType)}
              className={`
                px-4 py-2.5 rounded-xl font-medium text-sm transition-all
                ${activeTab === tab.key
                  ? 'bg-gradient-to-r from-purple-600 to-cyan-600 text-white shadow-lg shadow-purple-500/25'
                  : 'text-gray-400 hover:bg-zinc-800/30'
                }
              `}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Payments List */}
      <div className="bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-slate-400">
            <DollarSign className="w-12 h-12 mb-3" />
            <p className="text-lg font-medium">No hay pagos</p>
            <p className="text-sm mt-1">
              {activeTab === 'all' && 'Registra tu primer pago'}
              {activeTab === 'pending' && 'No tienes pagos pendientes'}
              {activeTab === 'completed' && 'No tienes pagos completados'}
              {activeTab === 'cancelled' && 'No tienes pagos rechazados'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filtered.map(payment => (
              <div
                key={payment.id}
                onClick={() => navigate(`/payments/${payment.id}`)}
                className="p-4 hover:bg-zinc-800/30 transition-colors cursor-pointer"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <PaymentMethodIcon method={payment.payment_method} />
                      <h3 className="font-semibold text-white">
                        ${parseFloat(payment.amount).toFixed(2)}
                      </h3>
                    </div>
                    <p className="text-sm text-gray-400 mb-2">
                      {payment.description || payment.payment_method_display}
                    </p>
                    <div className="flex items-center gap-3">
                      <PaymentStatusBadge status={payment.status} />
                      <span className="text-xs text-slate-500">
                        {new Date(payment.payment_date).toLocaleDateString('es-ES')}
                      </span>
                    </div>
                    {payment.rejection_reason && (
                      <p className="mt-2 text-sm text-red-600">
                        Motivo: {payment.rejection_reason}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
