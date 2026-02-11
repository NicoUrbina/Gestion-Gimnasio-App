import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { membershipPlanService } from '../../services/memberships';
import type { MembershipPlan } from '../../types';
import toast from 'react-hot-toast';

type FormData = Omit<MembershipPlan, 'id' | 'created_at' | 'updated_at'>;

export default function MembershipPlanFormPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditMode = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: '',
    price: '',
    duration_days: 30,
    max_classes_per_month: null,
    includes_trainer: false,
    can_freeze: true,
    max_freeze_days: 15,
    is_active: true,
  });

  useEffect(() => {
    if (isEditMode && id) {
      fetchPlan(parseInt(id));
    }
  }, [id, isEditMode]);

  const fetchPlan = async (planId: number) => {
    try {
      setLoading(true);
      const plan = await membershipPlanService.getById(planId);
      setFormData({
        name: plan.name,
        description: plan.description,
        price: plan.price,
        duration_days: plan.duration_days,
        max_classes_per_month: plan.max_classes_per_month,
        includes_trainer: plan.includes_trainer,
        can_freeze: plan.can_freeze,
        max_freeze_days: plan.max_freeze_days,
        is_active: plan.is_active,
      });
    } catch (err) {
      console.error('Error fetching plan:', err);
      setError('No se pudo cargar el plan');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError(null);

      if (isEditMode && id) {
        await membershipPlanService.update(parseInt(id), formData);
        toast.success('Plan actualizado correctamente');
      } else {
        await membershipPlanService.create(formData);
        toast.success('Plan creado correctamente');
      }

      navigate('/memberships/plans');
    } catch (err: any) {
      console.error('Error saving plan:', err);
      const errorMessage = err.response?.data?.message || 'Error al guardar el plan';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/memberships/plans')}
          className="p-2 hover:bg-zinc-800 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-400" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-white">
            {isEditMode ? 'Editar Plan' : 'Crear Nuevo Plan'}
          </h1>
          <p className="text-slate-500 mt-1">
            {isEditMode ? 'Modifica los detalles del plan' : 'Configura un nuevo plan de membresía'}
          </p>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-zinc-900 rounded-2xl border border-zinc-800 p-6">
        <div className="space-y-6">
          {/* Información Básica */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Nombre del Plan *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="Ej: Mensual Básico"
                className="w-full px-4 py-2.5 bg-zinc-800/30 border border-zinc-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-white placeholder-gray-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Precio *
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">$</span>
                <input
                  type="number"
                  required
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={(e) => handleChange('price', e.target.value)}
                  placeholder="0.00"
                  className="w-full pl-8 pr-4 py-2.5 bg-zinc-800/30 border border-zinc-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-white placeholder-gray-500"
                />
              </div>
            </div>
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Descripción
            </label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Describe los beneficios del plan..."
              className="w-full px-4 py-2.5 bg-zinc-800/30 border border-zinc-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-white placeholder-gray-500 resize-none"
            />
          </div>

          {/* Duración y Clases */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Duración (días) *
              </label>
              <select
                required
                value={formData.duration_days}
                onChange={(e) => handleChange('duration_days', parseInt(e.target.value))}
                className="w-full px-4 py-2.5 bg-zinc-800/30 border border-zinc-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
              >
                <option value={30}>30 días (Mensual)</option>
                <option value={90}>90 días (Trimestral)</option>
                <option value={180}>180 días (Semestral)</option>
                <option value={365}>365 días (Anual)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Clases por mes
              </label>
              <input
                type="number"
                min="0"
                value={formData.max_classes_per_month || ''}
                onChange={(e) => handleChange('max_classes_per_month', e.target.value ? parseInt(e.target.value) : null)}
                placeholder="Dejar vacío para ilimitadas"
                className="w-full px-4 py-2.5 bg-zinc-800/30 border border-zinc-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-white placeholder-gray-500"
              />
            </div>
          </div>

          {/* Opciones de Congelamiento */}
          {formData.can_freeze && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Días máximos de congelamiento
              </label>
              <input
                type="number"
                min="0"
                max="90"
                value={formData.max_freeze_days}
                onChange={(e) => handleChange('max_freeze_days', parseInt(e.target.value))}
                className="w-full px-4 py-2.5 bg-zinc-800/30 border border-zinc-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-white placeholder-gray-500"
              />
            </div>
          )}

          {/* Toggles */}
          <div className="space-y-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.includes_trainer}
                onChange={(e) => handleChange('includes_trainer', e.target.checked)}
                className="w-5 h-5 text-purple-600 border-slate-300 rounded focus:ring-purple-500"
              />
              <div>
                <span className="text-sm font-medium text-white">Incluye entrenador personal</span>
                <p className="text-xs text-slate-500">Acceso a sesiones con entrenador</p>
              </div>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.can_freeze}
                onChange={(e) => handleChange('can_freeze', e.target.checked)}
                className="w-5 h-5 text-purple-600 border-slate-300 rounded focus:ring-purple-500"
              />
              <div>
                <span className="text-sm font-medium text-white">Permite congelamiento</span>
                <p className="text-xs text-slate-500">Los miembros pueden pausar su membresía</p>
              </div>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.is_active}
                onChange={(e) => handleChange('is_active', e.target.checked)}
                className="w-5 h-5 text-purple-600 border-slate-300 rounded focus:ring-purple-500"
              />
              <div>
                <span className="text-sm font-medium text-white">Plan activo</span>
                <p className="text-xs text-slate-500">Disponible para nuevas suscripciones</p>
              </div>
            </label>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 mt-8 pt-6 border-t border-zinc-700">
          <button
            type="button"
            onClick={() => navigate('/memberships/plans')}
            className="px-4 py-2.5 text-gray-300 hover:bg-zinc-800 rounded-xl transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-purple-600 to-cyan-600 text-white font-medium rounded-xl hover:from-purple-500 hover:to-cyan-500 shadow-lg shadow-purple-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Guardando...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                {isEditMode ? 'Actualizar Plan' : 'Crear Plan'}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
