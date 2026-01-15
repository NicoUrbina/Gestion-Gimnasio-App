import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Loader2, DollarSign, CheckCircle, XCircle, User } from 'lucide-react';
import { paymentService } from '../../services/payments';
import PaymentStatusBadge from '../../components/payments/PaymentStatusBadge';
import PaymentMethodIcon from '../../components/payments/PaymentMethodIcon';
import type { Payment } from '../../types';

export default function PaymentDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [payment, setPayment] = useState<Payment | null>(null);
  const [loading, setLoading] = useState(true);
  const [acting, setActing] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  useEffect(() => {
    if (id) {
      fetchPayment();
    }
  }, [id]);

  const fetchPayment = async () => {
    try {
      setLoading(true);
      const data = await paymentService.getById(parseInt(id!));
      setPayment(data);
    } catch (error) {
      console.error('Error:', error);
      alert('Error al cargar el pago');
      navigate('/payments');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    if (!confirm('¿Aprobar este pago? Se generará una factura automáticamente.')) return;

    try {
      setActing(true);
      await paymentService.approve(payment!.id);
      alert('Pago aprobado exitosamente');
      await fetchPayment();
    } catch (error: any) {
      alert(error.response?.data?.detail || 'Error al aprobar');
    } finally {
      setActing(false);
    }
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) {
      alert('Debes ingresar un motivo de rechazo');
      return;
    }

    try {
      setActing(true);
      await paymentService.reject(payment!.id, rejectReason);
      alert('Pago rechazado');
      setShowRejectModal(false);
      setRejectReason('');
      await fetchPayment();
    } catch (error: any) {
      alert(error.response?.data?.detail || 'Error al rechazar');
    } finally {
      setActing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
      </div>
    );
  }

  if (!payment) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/payments')}
          className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-slate-600" />
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-slate-900">Detalle de Pago</h1>
          <p className="text-slate-500 mt-1">ID: #{payment.id}</p>
        </div>
        <PaymentStatusBadge status={payment.status} />
      </div>

      {/* Amount Card */}
      <div className="bg-gradient-to-br from-purple-600 to-cyan-600 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-purple-100 text-sm font-medium mb-2">Monto Total</p>
            <p className="text-5xl font-bold">${parseFloat(payment.amount).toFixed(2)}</p>
            <p className="text-purple-100 mt-2">
              {new Date(payment.payment_date).toLocaleDateString('es-ES', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>
          <DollarSign className="w-20 h-20 text-white opacity-20" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Payment Info */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <h2 className="text-lg font-bold text-slate-900 mb-4">Información del Pago</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-slate-500">Miembro</p>
                <div className="flex items-center gap-2 mt-1">
                  <User className="w-4 h-4 text-slate-400" />
                  <p className="font-medium text-slate-900">{payment.member_name}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-slate-500">Método de Pago</p>
                <div className="flex items-center gap-2 mt-1">
                  <PaymentMethodIcon method={payment.payment_method} className="w-4 h-4" />
                  <p className="font-medium text-slate-900">{payment.payment_method_display}</p>
                </div>
              </div>
              {payment.reference_number && (
                <div>
                  <p className="text-sm text-slate-500">Nº Referencia</p>
                  <p className="font-medium text-slate-900 mt-1">{payment.reference_number}</p>
                </div>
              )}
              {payment.description && (
                <div className={payment.reference_number ? '' : 'col-span-2'}>
                  <p className="text-sm text-slate-500">Descripción</p>
                  <p className="font-medium text-slate-900 mt-1">{payment.description}</p>
                </div>
              )}
            </div>
            {payment.notes && (
              <div className="mt-4 pt-4 border-t border-slate-200">
                <p className="text-sm text-slate-500">Notas</p>
                <p className="text-slate-700 mt-1">{payment.notes}</p>
              </div>
            )}
          </div>

          {/* Receipt */}
          {payment.receipt_image && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <h2 className="text-lg font-bold text-slate-900 mb-4">Comprobante</h2>
              <img
                src={payment.receipt_image}
                alt="Comprobante"
                className="w-full rounded-xl border border-slate-200 cursor-pointer hover:opacity-90 transition"
                onClick={() => window.open(payment.receipt_image, '_blank')}
              />
              <p className="text-sm text-slate-500 mt-2 text-center">
                Click para ampliar
              </p>
            </div>
          )}

          {/* Rejection Reason */}
          {payment.rejection_reason && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-red-900 mb-2">Motivo de Rechazo</h3>
              <p className="text-red-700">{payment.rejection_reason}</p>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Timeline */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <h2 className="text-lg font-bold text-slate-900 mb-4">Historial</h2>
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className="w-2 h-2 rounded-full bg-slate-400 mt-1.5" />
                  <div className="w-px h-full bg-slate-200 my-1" />
                </div>
                <div className="flex-1 pb-4">
                  <p className="font-medium text-slate-900 text-sm">Pago Registrado</p>
                  <p className="text-xs text-slate-500 mt-1">
                    {new Date(payment.created_at).toLocaleDateString('es-ES')}
                  </p>
                </div>
              </div>

              {payment.approved_at && (
                <div className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className={`w-2 h-2 rounded-full mt-1.5 ${payment.status === 'completed' ? 'bg-green-500' : 'bg-red-500'
                      }`} />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-slate-900 text-sm">
                      {payment.status === 'completed' ? 'Aprobado' : 'Rechazado'}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      {new Date(payment.approved_at).toLocaleDateString('es-ES')}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          {payment.status === 'pending' && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-3">
              <h3 className="font-bold text-slate-900 mb-4">Acciones</h3>
              <button
                onClick={handleApprove}
                disabled={acting}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white font-medium rounded-xl hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                <CheckCircle className="w-5 h-5" />
                Aprobar Pago
              </button>
              <button
                onClick={() => setShowRejectModal(true)}
                disabled={acting}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-600 text-white font-medium rounded-xl hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                <XCircle className="w-5 h-5" />
                Rechazar Pago
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Rechazar Pago</h3>
            <p className="text-sm text-slate-600 mb-4">
              Ingresa el motivo del rechazo. El miembro verá este mensaje.
            </p>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Ej: Comprobante ilegible, monto incorrecto..."
              rows={4}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
            />
            <div className="flex items-center gap-3 mt-4">
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectReason('');
                }}
                className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-700 font-medium rounded-xl hover:bg-slate-50 transition-all"
              >
                Cancelar
              </button>
              <button
                onClick={handleReject}
                disabled={acting || !rejectReason.trim()}
                className="flex-1 px-4 py-2.5 bg-red-600 text-white font-medium rounded-xl hover:bg-red-700 transition-all disabled:opacity-50"
              >
                {acting ? 'Rechazando...' : 'Confirmar Rechazo'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
