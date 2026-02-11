import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Calendar, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import Spinner from '../../components/Spinner';
import PriceDisplay from '../../components/PriceDisplay';

interface Membership {
  id: number;
  plan: number;
  plan_name: string;
  start_date: string;
  end_date: string;
  status: string;
  plan_price: number;
}

const DURATION_OPTIONS = [
  { months: 1, label: '1 Mes', discount: 0 },
  { months: 3, label: '3 Meses', discount: 5 },
  { months: 6, label: '6 Meses', discount: 10 },
  { months: 12, label: '12 Meses', discount: 15 },
];

export default function RenewalPortalPage() {
  const navigate = useNavigate();
  const [membership, setMembership] = useState<Membership | null>(null);
  const [loading, setLoading] = useState(true);
  const [renewing, setRenewing] = useState(false);
  const [selectedDuration, setSelectedDuration] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('efectivo');

  useEffect(() => {
    loadMembership();
  }, []);

  const loadMembership = async () => {
    try {
      setLoading(true);
      const response = await api.get('/memberships/');
      // Assuming first active membership
      const activeMembership = response.data.find((m: Membership) => m.status === 'active');
      setMembership(activeMembership || null);
    } catch (error) {
      console.error('Error loading membership:', error);
      toast.error('Error al cargar membresía');
    } finally {
      setLoading(false);
    }
  };

  const handleRenew = async () => {
    if (!membership) return;

    try {
      setRenewing(true);
      await api.post(`/memberships/${membership.id}/renew/`, {
        duration_months: selectedDuration,
        payment_method: paymentMethod
      });
      
      toast.success('¡Membresía renovada exitosamente!');
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Error renewing membership:', error);
      toast.error(error.response?.data?.error || 'Error al renovar membresía');
    } finally {
      setRenewing(false);
    }
  };

  const calculatePrice = () => {
    if (!membership) return 0;
    const option = DURATION_OPTIONS.find(o => o.months === selectedDuration);
    const basePrice = membership.plan_price * selectedDuration;
    const discount = option ? (basePrice * option.discount / 100) : 0;
    return basePrice - discount;
  };

  const calculateDiscount = () => {
    const option = DURATION_OPTIONS.find(o => o.months === selectedDuration);
    return option?.discount || 0;
  };

  const getDaysUntilExpiry = () => {
    if (!membership) return 0;
    const today = new Date();
    const endDate = new Date(membership.end_date);
    const diffTime = endDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!membership) {
    return (
      <div>
        <div className="mb-6">
          <h1 className="text-2xl font-black text-white uppercase tracking-tight flex items-center gap-3">
            <CreditCard className="w-7 h-7 text-orange-500" />
            Renovar Membresía
          </h1>
        </div>

        <div className="bg-zinc-900 rounded-2xl border-2 border-zinc-800 p-12 text-center">
          <AlertCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-white mb-2">No tienes una membresía activa</h3>
          <p className="text-gray-500">Contacta con recepción para adquirir una membresía</p>
        </div>
      </div>
    );
  }

  const daysLeft = getDaysUntilExpiry();
  const isExpiring = daysLeft <= 7;
  const totalPrice = calculatePrice();
  const discount = calculateDiscount();

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-black text-white uppercase tracking-tight flex items-center gap-3">
          <CreditCard className="w-7 h-7 text-orange-500" />
          Renovar Membresía
        </h1>
        <p className="text-gray-500 mt-1">Extiende tu membresía y sigue entrenando</p>
      </div>

      {/* Alert if expiring soon */}
      {isExpiring && (
        <div className={`border-l-4 rounded-lg p-4 mb-6 ${
          daysLeft <= 3 
            ? 'bg-red-50 border-red-500' 
            : 'bg-yellow-50 border-yellow-500'
        }`}>
          <div className="flex items-center gap-2">
            <Clock className={`w-5 h-5 ${daysLeft <= 3 ? 'text-red-600' : 'text-yellow-600'}`} />
            <div>
              <div className={`font-bold ${daysLeft <= 3 ? 'text-red-900' : 'text-yellow-900'}`}>
                {daysLeft <= 3 ? '¡URGENTE!' : '¡Atención!'} Tu membresía vence pronto
              </div>
              <div className={`text-sm ${daysLeft <= 3 ? 'text-red-800' : 'text-yellow-800'}`}>
                Te quedan {daysLeft} día{daysLeft !== 1 ? 's' : ''} de membresía. Renueva ahora para no perder acceso.
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Current Membership Info */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-zinc-900 rounded-2xl border-2 border-zinc-800 p-6">
            <h2 className="text-lg font-bold text-white mb-4">Membresía Actual</h2>
            
            <div className="space-y-3">
              <div>
                <div className="text-xs text-gray-500 uppercase font-medium">Plan</div>
                <div className="font-bold text-white">{membership.plan_name}</div>
              </div>

              <div>
                <div className="text-xs text-gray-500 uppercase font-medium">Vence</div>
                <div className="font-bold text-white">
                  {new Date(membership.end_date).toLocaleDateString('es-ES', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric'
                  })}
                </div>
              </div>

              <div>
                <div className="text-xs text-gray-500 uppercase font-medium">Estado</div>
                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium ${
                  membership.status === 'active' 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-red-100 text-red-700'
                }`}>
                  {membership.status === 'active' ? (
                    <>
                      <CheckCircle className="w-3 h-3" />
                      Activa
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-3 h-3" />
                      Vencida
                    </>
                  )}
                </span>
              </div>

              <div>
                <div className="text-xs text-gray-500 uppercase font-medium">Precio Mensual</div>
                <PriceDisplay amountUsd={membership.plan_price} size="md" priceColorClass="text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Renewal Options */}
        <div className="lg:col-span-2 space-y-6">
          {/* Duration Selection */}
          <div className="bg-zinc-900 rounded-2xl border-2 border-zinc-800 p-6">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-orange-500" />
              Selecciona la Duración
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {DURATION_OPTIONS.map((option) => {
                const isSelected = selectedDuration === option.months;
                return (
                  <button
                    key={option.months}
                    onClick={() => setSelectedDuration(option.months)}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      isSelected
                        ? 'border-orange-500 bg-orange-50'
                        : 'border-zinc-700 hover:border-orange-200'
                    }`}
                  >
                    <div className="text-center">
                      <div className="font-black text-2xl text-white">{option.months}</div>
                      <div className="text-xs text-gray-500 uppercase">
                        {option.months === 1 ? 'Mes' : 'Meses'}
                      </div>
                      {option.discount > 0 && (
                        <div className="mt-1 text-xs font-bold text-green-600">
                          {option.discount}% OFF
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-zinc-900 rounded-2xl border-2 border-zinc-800 p-6">
            <h2 className="text-lg font-bold text-white mb-4">Método de Pago</h2>
            
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full px-4 py-3 border-2 border-zinc-700 rounded-xl focus:outline-none focus:border-orange-500 font-medium"
            >
              <option value="efectivo">Efectivo</option>
              <option value="tarjeta">Tarjeta</option>
              <option value="transferencia">Transferencia</option>
            </select>
          </div>

          {/* Price Summary */}
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 text-white">
            <h3 className="font-bold text-lg mb-4">Resumen de Pago</h3>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="opacity-90">Duración:</span>
                <span className="font-bold">{selectedDuration} mes{selectedDuration !== 1 ? 'es' : ''}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="opacity-90">Precio base:</span>
                <PriceDisplay amountUsd={membership.plan_price * selectedDuration} size="sm" priceColorClass="text-white" bsColorClass="text-white/80" className="text-right" />
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-green-300">
                  <span>Descuento ({discount}%):</span>
                  <span className="font-bold">-${(membership.plan_price * selectedDuration * discount / 100).toFixed(2)}</span>
                </div>
              )}

              <div className="border-t border-white/20 pt-2 mt-2">
                <div className="flex justify-between items-center">
                  <span className="text-xl font-bold">Total a Pagar:</span>
                  <PriceDisplay amountUsd={totalPrice} size="lg" priceColorClass="text-white" bsColorClass="text-white/80" />
                </div>
              </div>
            </div>

            <button
              onClick={handleRenew}
              disabled={renewing}
              className="w-full mt-6 px-6 py-4 bg-white text-orange-600 rounded-xl font-black text-lg hover:shadow-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {renewing ? (
                <>Procesando...</>
              ) : (
                <>
                  <CheckCircle className="w-6 h-6" />
                  Renovar Membresía
                </>
              )}
            </button>

            <p className="text-xs text-white/80 text-center mt-3">
              Tu nueva fecha de vencimiento será calculada desde tu fecha actual de fin
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
