import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Loader2, Upload, X, Search } from 'lucide-react';
import { paymentService } from '../../services/payments';
import { membershipService } from '../../services/memberships';
import api from '../../services/api';
import type { Membership } from '../../types';

interface Member {
  id: number;
  user_name: string;
  email: string;
}

export default function PaymentFormPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [loadingMembers, setLoadingMembers] = useState(false);
  const [members, setMembers] = useState<Member[]>([]);
  const [memberships, setMemberships] = useState<Membership[]>([]);
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [receiptPreview, setReceiptPreview] = useState<string | null>(null);
  const [memberSearch, setMemberSearch] = useState('');

  const [formData, setFormData] = useState({
    member: '',
    membership: '',
    amount: '',
    payment_method: 'cash' as const,
    reference_number: '',
    description: '',
    notes: '',
  });

  useEffect(() => {
    fetchMembers();
  }, []);

  // Fetch members for selector
  const fetchMembers = async () => {
    try {
      setLoadingMembers(true);
      const response = await api.get('/members/');
      const data = response.data.results || response.data;
      setMembers(data);
    } catch (error) {
      console.error('Error fetching members:', error);
      setMembers([]);
    } finally {
      setLoadingMembers(false);
    }
  };

  // When member selected, fetch their memberships
  const handleMemberChange = async (memberId: string) => {
    setFormData(prev => ({ ...prev, member: memberId, membership: '', amount: '' }));
    setMemberships([]);

    if (!memberId) return;

    try {
      const data = await membershipService.getAll({ member: parseInt(memberId), status: 'active' });
      setMemberships(data);
    } catch (error) {
      console.error('Error fetching memberships:', error);
      setMemberships([]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Solo se permiten imágenes');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('La imagen no debe superar 5MB');
      return;
    }

    setReceiptFile(file);
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

    if (membershipId) {
      const selected = memberships.find(m => m.id === parseInt(membershipId));
      if (selected) {
        setFormData(prev => ({ ...prev, amount: selected.plan_price }));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.member) {
      alert('Selecciona un miembro');
      return;
    }

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

      const data = new FormData();
      data.append('payment_type', 'membership');
      data.append('member', formData.member);
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
      alert('Pago registrado exitosamente');
      navigate('/payments');
    } catch (error: any) {
      console.error('Error:', error);
      const errorMsg = error.response?.data?.membership?.[0] ||
        error.response?.data?.message ||
        'Error al registrar el pago';
      alert(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const filteredMembers = members.filter(m =>
    m.user_name.toLowerCase().includes(memberSearch.toLowerCase()) ||
    m.email.toLowerCase().includes(memberSearch.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/payments')}
          className="p-2 hover:bg-zinc-800/50 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-400" />
        </button>
        <div>
          <h1 className="text-3xl font-black text-white uppercase tracking-tight">
            Registrar Pago
          </h1>
          <p className="text-gray-400 mt-1">Registrar pago de membresía de un miembro</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Miembro */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Miembro <span className="text-orange-500">*</span>
            </label>

            {/* Search input */}
            <div className="relative mb-2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar miembro por nombre o email..."
                value={memberSearch}
                onChange={(e) => setMemberSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-zinc-800 border border-zinc-700 text-white placeholder-gray-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            {/* Member selector */}
            <select
              value={formData.member}
              onChange={(e) => handleMemberChange(e.target.value)}
              required
              disabled={loadingMembers}
              className="w-full px-4 py-2.5 bg-zinc-800 border border-zinc-700 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 max-h-10 overflow-y-auto"
            >
              <option value="">Seleccionar miembro</option>
              {filteredMembers.map(m => (
                <option key={m.id} value={m.id}>
                  {m.user_name} - {m.email}
                </option>
              ))}
            </select>
            {loadingMembers && (
              <p className="text-sm text-gray-400 mt-2">Cargando miembros...</p>
            )}
          </div>

          {/* Membresía (solo si se seleccionó miembro) */}
          {formData.member && (
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Membresía a Pagar <span className="text-orange-500">*</span>
              </label>
              <select
                value={formData.membership}
                onChange={(e) => handleMembershipChange(e.target.value)}
                required
                className="w-full px-4 py-2.5 bg-zinc-800 border border-zinc-700 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 max-h-10"
              >
                <option value="">Seleccionar membresía</option>
                {memberships.map(m => (
                  <option key={m.id} value={m.id}>
                    {m.plan_name} - Vence: {new Date(m.end_date).toLocaleDateString('es-ES')} - ${m.plan_price}
                  </option>
                ))}
              </select>
              {memberships.length === 0 && (
                <p className="text-sm text-amber-400 mt-2">
                  Este miembro no tiene membresías activas.
                </p>
              )}
            </div>
          )}

          {/* Rest of form only shows if membership selected */}
          {formData.membership && (
            <>
              {/* Monto */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Monto <span className="text-orange-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.amount}
                    onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                    required
                    className="w-full pl-8 pr-4 py-2.5 bg-zinc-800 border border-zinc-700 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              {/* Método de Pago */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Método de Pago <span className="text-orange-500">*</span>
                </label>
                <select
                  value={formData.payment_method}
                  onChange={(e) => setFormData(prev => ({ ...prev, payment_method: e.target.value as any }))}
                  required
                  className="w-full px-4 py-2.5 bg-zinc-800 border border-zinc-700 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
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
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Número de Referencia <span className="text-orange-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.reference_number}
                    onChange={(e) => setFormData(prev => ({ ...prev, reference_number: e.target.value }))}
                    required
                    placeholder="Ej: 123456789"
                    className="w-full px-4 py-2.5 bg-zinc-800 border border-zinc-700 text-white placeholder-gray-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              )}

              {/* Comprobante */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Comprobante de Pago (opcional)
                </label>

                {!receiptPreview ? (
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-zinc-700 rounded-xl cursor-pointer hover:border-orange-500 hover:bg-zinc-800/50 transition-colors">
                    <div className="flex flex-col items-center">
                      <Upload className="w-8 h-8 text-gray-400 mb-2" />
                      <p className="text-sm text-gray-300">
                        <span className="font-semibold text-orange-400">Click para subir</span> o arrastra aquí
                      </p>
                      <p className="text-xs text-gray-500 mt-1">PNG, JPG (max 5MB)</p>
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
                      className="w-full h-48 object-contain bg-zinc-800 rounded-xl border border-zinc-700"
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
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Descripción
                </label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Pago de membresía mensual"
                  className="w-full px-4 py-2.5 bg-zinc-800 border border-zinc-700 text-white placeholder-gray-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              {/* Notas */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Notas Adicionales
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  rows={3}
                  placeholder="Información adicional..."
                  className="w-full px-4 py-2.5 bg-zinc-800 border border-zinc-700 text-white placeholder-gray-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
                />
              </div>
            </>
          )}
        </div>

        {/* Actions */}
        {formData.membership && (
          <div className="flex items-center justify-end gap-3 mt-6 pt-6 border-t border-zinc-800">
            <button
              type="button"
              onClick={() => navigate('/payments')}
              className="px-6 py-2.5 border border-zinc-700 text-gray-300 font-medium rounded-xl hover:bg-zinc-800 transition-all"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold rounded-xl hover:from-orange-600 hover:to-orange-700 shadow-lg shadow-orange-500/25 transition-all disabled:opacity-50 uppercase tracking-wide"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Registrando...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Registrar Pago
                </>
              )}
            </button>
          </div>
        )}
      </form>
    </div>
  );
}
