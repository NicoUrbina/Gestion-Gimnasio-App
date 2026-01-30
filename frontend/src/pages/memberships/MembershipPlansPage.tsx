import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Loader2 } from 'lucide-react';
import { membershipPlanService } from '../../services/memberships';
import PlanCard from '../../components/memberships/PlanCard';
import type { MembershipPlan } from '../../types';
import toast from 'react-hot-toast';

export default function MembershipPlansPage() {
  const navigate = useNavigate();
  const [plans, setPlans] = useState<MembershipPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      console.log('Fetching membership plans...');
      setLoading(true);
      setError(null);
      const data = await membershipPlanService.getAll();
      console.log('API Response:', data);
      console.log('Is Array?', Array.isArray(data));
      console.log('Data length:', Array.isArray(data) ? data.length : 'Not an array');
      setPlans(Array.isArray(data) ? data : []);
      console.log('Plans set to state:', Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching membership plans:', err);
      setError('No se pudieron cargar los planes. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleEditPlan = (plan: MembershipPlan) => {
    navigate(`/memberships/plans/${plan.id}/edit`);
  };

  const handleCreatePlan = () => {
    navigate('/memberships/plans/new');
  };

  const handleDeletePlan = async (plan: MembershipPlan) => {
    const confirmed = window.confirm(
      `¿Estás seguro de que deseas eliminar el plan "${plan.name}"?\n\nEsta acción no se puede deshacer.`
    );

    if (!confirmed) return;

    try {
      await membershipPlanService.delete(plan.id);
      toast.success('Plan eliminado correctamente');
      // Actualizar la lista removiendo el plan eliminado
      setPlans(prevPlans => prevPlans.filter(p => p.id !== plan.id));
    } catch (error: any) {
      console.error('Error deleting plan:', error);
      const errorMessage = error.response?.data?.detail || 
                          error.response?.data?.message || 
                          'Error al eliminar el plan';
      toast.error(errorMessage);
    }
  };

  // Determinar el plan más popular (por ahora, el del medio)
  const popularPlanIndex = Math.floor(plans.length / 2);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Planes de Membresía</h1>
          <p className="text-slate-500 mt-1">Gestiona los planes disponibles para tus miembros</p>
        </div>
        <button
          onClick={handleCreatePlan}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-cyan-600 text-white font-medium rounded-xl hover:from-purple-500 hover:to-cyan-500 shadow-lg shadow-purple-500/25 transition-all"
        >
          <Plus className="w-5 h-5" />
          Crear Plan
        </button>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <p className="text-red-700 text-sm">{error}</p>
          <button
            onClick={fetchPlans}
            className="mt-2 text-red-600 hover:text-red-800 font-medium text-sm"
          >
            Reintentar
          </button>
        </div>
      )}

      {/* Plans Grid */}
      {!loading && !error && (
        <>
          {plans.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-slate-400">
              <p className="text-lg font-medium">No hay planes disponibles</p>
              <p className="text-sm mt-1">Crea tu primer plan de membresía</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {plans.map((plan, index) => (
                <PlanCard
                  key={plan.id}
                  plan={plan}
                  onEdit={handleEditPlan}
                  onDelete={handleDeletePlan}
                  isPopular={index === popularPlanIndex}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
