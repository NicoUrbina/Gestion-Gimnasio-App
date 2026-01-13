import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Loader2, Upload, X } from 'lucide-react';
import { paymentService } from '../../services/payments';
import { membershipService } from '../../services/memberships';
import type { Membership } from '../../types';

export default function PaymentFormPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [memberships, setMemberships] = useState<Membership[]>([]);
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [receiptPreview, setReceiptPreview] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    membership: '',
    amount: '',
    payment_method: 'cash' as const,
    reference_number: '',
    description: '',
    notes: '',
  });

  useEffect(() => {
    fetchMemberships();
  }, []);

  const fetchMemberships = async () => {
    try {
      // Obtener membresías activas del usuario actual (miembro)
      const data = await membershipService.getMyMemberships();
      const active = Array.isArray(data) ? data.filter((m: Membership) => m.status === 'active') : [];
      setMemberships(active);
    } catch (error) {
      console.error('Error fetching memberships:', error);
      setMemberships([]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar tipo
    if (!file.type.startsWith('image/')) {
      alert('Solo se permiten imágenes');
      return;
    }

    // Validar tamaño (5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('La imagen no debe superar 5MB');
      return;
    }

    setReceiptFile(file);

    // Preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setReceiptPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const removeReceipt = () => {
    setReceiptFile(null);
    setReceiptPreview(null);
  };

  const handleMembershipChange = (membershipId: string) => {
    setFormData(prev => ({ ...prev, membership: membershipId }));

    // Auto-fill amount from plan
    if (membershipId) {
      const selected = memberships.find(m => m.id === parseInt(membershipId));
      if (selected) {
        setFormData(prev => ({ ...prev, amount: selected.plan_price }));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validaciones
    if (!formData.membership) {
      alert('Selecciona una membresía');
      return;
    }

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      alert('El monto debe ser mayor a 0');
      return;
    }

    if (['transfer', 'mobile'].includes(formData.payment_method) && !formData.reference_number) {
      alert('El número de referencia es obligatorio para este método de pago');
      return;
    }

    try {
      setLoading(true);

      // Crear FormData para enviar archivo
      const data = new FormData();
      data.append('membership', formData.membership);
      data.append('amount', formData.amount);
      data.append('payment_method', formData.payment_method);
      data.append('reference_number', formData.reference_number);
      data.append('description', formData.description);
      data.append('notes', formData.notes);

      if (receiptFile) {
        data.append('receipt_image', receiptFile);
      }

      await paymentService.create(data);
      alert('Pago registrado exitosamente. Será revisado por el personal.');
      navigate('/payments/my-payments');
    } catch (error: any) {
      console.error('Error:', error);
      alert(error.response?.data?.message || 'Error al registrar el pago');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/payments/my-payments')}
          className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-slate-600" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Registrar Pago</h1>
          <p className="text-slate-500 mt-1">Sube tu comprobante y será revisado</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Membresía */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Membresía a Pagar <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.membership}
              onChange={(e) => handleMembershipChange(e.target.value)}
              required
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">Seleccionar membresía</option>
              {memberships.map(m => (
                <option key={m.id} value={m.id}>
                  {m.plan_name} - Vence: {new Date(m.end_date).toLocaleDateString('es-ES')}
                </option>
              ))}
            </select>
            {memberships.length === 0 && (
              <p className="text-sm text-amber-600 mt-2">
                No tienes membresías activas. Contacta al administrador.
              </p>
            )}
          </div>

          {/* Monto */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Monto <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">$</span>
              <input
                type="number"
                step="0.01"
                value={formData.amount}
                onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                required
                className="w-full pl-8 pr-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          {/* Método de Pago */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Método de Pago <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.payment_method}
              onChange={(e) => setFormData(prev => ({ ...prev, payment_method: e.target.value as any }))}
              required
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="cash">Efectivo</option>
              <option value="card">Tarjeta</option>
              <option value="transfer">Transferencia</option>
              <option value="mobile">Pago Móvil</option>
              <option value="other">Otro</option>
            </select>
          </div>

          {/* Número de Referencia */}
          {['transfer', 'mobile'].includes(formData.payment_method) && (
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Número de Referencia <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.reference_number}
                onChange={(e) => setFormData(prev => ({ ...prev, reference_number: e.target.value }))}
                required
                placeholder="Ej: 123456789"
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          )}

          {/* Comprobante */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Comprobante de Pago
              {['transfer', 'mobile'].includes(formData.payment_method) && (
                <span className="text-red-500"> *</span>
              )}
            </label>

            {!receiptPreview ? (
              <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-slate-300 rounded-xl cursor-pointer hover:border-purple-400 hover:bg-purple-50 transition-colors">
                <div className="flex flex-col items-center">
                  <Upload className="w-10 h-10 text-slate-400 mb-2" />
                  <p className="text-sm text-slate-600">
                    <span className="font-semibold text-purple-600">Click para subir</span> o arrastra aquí
                  </p>
                  <p className="text-xs text-slate-400 mt-1">PNG, JPG (max 5MB)</p>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            ) : (
              <div className="relative">
                <img
                  src={receiptPreview}
                  alt="Comprobante"
                  className="w-full h-60 object-contain bg-slate-50 rounded-xl border border-slate-200"
                />
                <button
                  type="button"
                  onClick={removeReceipt}
                  className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Descripción */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Descripción
            </label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Pago de membresía mensual"
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Notas */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Notas Adicionales
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              rows={3}
              placeholder="Información adicional..."
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 mt-6 pt-6 border-t border-slate-200">
          <button
            type="button"
            onClick={() => navigate('/payments/my-payments')}
            className="px-6 py-2.5 border border-slate-200 text-slate-700 font-medium rounded-xl hover:bg-slate-50 transition-all"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-purple-600 to-cyan-600 text-white font-medium rounded-xl hover:from-purple-500 hover:to-cyan-500 shadow-lg shadow-purple-500/25 transition-all disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Enviando...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                Enviar Pago
              </>
            )}
          </button>
        </div>

        {/* Info Alert */}
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-xl">
          <p className="text-sm text-blue-800">
            <strong>Nota:</strong> Tu pago será revisado por el personal del gimnasio. 
            Recibirás una notificación cuando sea aprobado o si necesita correcciones.
          </p>
        </div>
      </form>
    </div>
  );
}
