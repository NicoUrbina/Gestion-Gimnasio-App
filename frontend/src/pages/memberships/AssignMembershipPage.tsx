import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, UserPlus, Loader2 } from 'lucide-react';
import { membershipService, membershipPlanService } from '../../services/memberships';
import api from '../../services/api';
import PlanCard from '../../components/memberships/PlanCard';
import PriceDisplay from '../../components/PriceDisplay';
import type { MembershipPlan, Member } from '../../types';

export default function AssignMembershipPage() {
  const navigate = useNavigate();

  const [members, setMembers] = useState<Member[]>([]);
  const [plans, setPlans] = useState<MembershipPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    member: '',
    plan: '',
    start_date: new Date().toISOString().split('T')[0],
    notes: '',
  });

  const [selectedPlan, setSelectedPlan] = useState<MembershipPlan | null>(null);
  const [calculatedEndDate, setCalculatedEndDate] = useState<string>('');

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (formData.plan && formData.start_date) {
      calculateEndDate();
    }
  }, [formData.plan, formData.start_date]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [membersData, plansData] = await Promise.all([
        api.get('/members/'),
        membershipPlanService.getAll(),
      ]);
      setMembers(membersData.data.results || membersData.data);
      const plansArray = Array.isArray(plansData) ? plansData : (plansData.results || plansData.data || []);
      setPlans(plansArray.filter(p => p.is_active));
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('No se pudieron cargar los datos');
    } finally {
      setLoading(false);
    }
  };

  const calculateEndDate = () => {
    const plan = plans.find(p => p.id === parseInt(formData.plan));
    if (!plan) return;

    const startDate = new Date(formData.start_date);
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + plan.duration_days);

    setCalculatedEndDate(endDate.toISOString().split('T')[0]);
    setSelectedPlan(plan);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.member || !formData.plan) {
      setError('Debes seleccionar un miembro y un plan');
      return;
    }

    try {
      setSaving(true);
      setError(null);

      await membershipService.assign({
        member: parseInt(formData.member),
        plan: parseInt(formData.plan),
        start_date: formData.start_date,
        notes: formData.notes,
      });

      navigate('/memberships');
    } catch (err: any) {
      console.error('Error assigning membership:', err);
      setError(err.response?.data?.message || 'Error al asignar la membresía');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/memberships')}
          className="p-2 hover:bg-zinc-800/50 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-400" />
        </button>
        <div>
          <h1 className="text-3xl font-black text-white uppercase tracking-tight">
            Asignar Membresía
          </h1>
          <p className="text-gray-400 mt-1">Asigna un plan de membresía a un miembro</p>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Seleccionar Miembro */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          <h2 className="text-lg font-bold text-white mb-4">
            1. Seleccionar Miembro
          </h2>
          <select
            required
            value={formData.member}
            onChange={(e) => setFormData(prev => ({ ...prev, member: e.target.value }))}
            className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="">-- Selecciona un miembro --</option>
            {members.map(member => (
              <option key={member.id} value={member.id}>
                {member.full_name || 'Sin nombre'} ({member.email || 'Sin email'})
              </option>
            ))}
          </select>
        </div>

        {/* Seleccionar Plan */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          <h2 className="text-lg font-bold text-white mb-4">
            2. Seleccionar Plan
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {plans.map(plan => (
              <PlanCard
                key={plan.id}
                plan={plan}
                selected={formData.plan === String(plan.id)}
                onSelect={(p) => setFormData(prev => ({ ...prev, plan: String(p.id) }))}
              />
            ))}
          </div>
        </div>

        {/* Detalles */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          <h2 className="text-lg font-bold text-white mb-4">
            3. Detalles de la Membresía
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Fecha de Inicio *
              </label>
              <input
                type="date"
                required
                value={formData.start_date}
                onChange={(e) => setFormData(prev => ({ ...prev, start_date: e.target.value }))}
                className="w-full px-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Fecha de Vencimiento
              </label>
              <input
                type="text"
                disabled
                value={calculatedEndDate || 'Selecciona un plan'}
                className="w-full px-4 py-2.5 bg-zinc-800/50 border border-zinc-700 rounded-xl text-sm text-gray-400"
              />
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Notas (Opcional)
            </label>
            <textarea
              rows={3}
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Cualquier observación o detalle adicional..."
              className="w-full px-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
            />
          </div>

          {/* Resumen */}
          {selectedPlan && formData.member && (
            <div className="mt-6 p-4 bg-orange-500/10 border border-orange-500/20 rounded-xl">
              <h3 className="font-bold text-orange-400 mb-3">📋 Resumen</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Plan:</span>
                  <span className="text-white font-medium">{selectedPlan.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Duración:</span>
                  <span className="text-white font-medium">{selectedPlan.duration_days} días</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Precio:</span>
                  <PriceDisplay amountUsd={parseFloat(selectedPlan.price.toString())} size="sm" priceColorClass="text-orange-400" />
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Vence:</span>
                  <span className="text-white font-medium">{calculatedEndDate}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate('/memberships')}
            className="px-6 py-2.5 text-gray-300 hover:bg-zinc-800 border border-zinc-700 rounded-xl transition-colors font-medium"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={saving || !formData.member || !formData.plan}
            className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold rounded-xl hover:from-orange-600 hover:to-orange-700 shadow-lg shadow-orange-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wide"
          >
            {saving ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Asignando...
              </>
            ) : (
              <>
                <UserPlus className="w-5 h-5" />
                Asignar Membresía
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
