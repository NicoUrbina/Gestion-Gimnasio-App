import { useEffect, useState } from 'react';
import { useAuthStore } from '../stores/authStore';
import api from '../services/api';

// Shared Components
import DashboardHeader from '../components/dashboard/shared/DashboardHeader';
import Spinner from '../components/dashboard/shared/Spinner';

// Role-Specific Sections
import AdminSection from '../components/dashboard/admin/AdminSection';
import MemberSection from '../components/dashboard/member/MemberSection';

// TODO: Importar cuando estén creados
// import StaffSection from '../components/dashboard/staff/StaffSection';
// import TrainerSection from '../components/dashboard/trainer/TrainerSection';

/**
 * Dashboard Principal Unificado
 * 
 * Usa renderizado condicional para mostrar el contenido apropiado
 * según el rol del usuario (admin, staff, trainer, member).
 * 
 * Principio DRY: Un solo shell, componentes reutilizables.
 */
export default function DashboardPage() {
  const { user } = useAuthStore();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const role = user?.role_name?.toLowerCase() || 'member';

  useEffect(() => {
    loadDashboardData();
  }, [role]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      let response;

      switch (role) {
        case 'admin':
          // Admin: Stats globales del sistema
          const [membersRes, paymentsRes, expiringRes] = await Promise.all([
            api.get('/members/stats/'),
            api.get('/payments/stats/'),
            api.get('/memberships/expiring/').catch(() => ({ data: [] })),
          ]);
          
          response = {
            members: membersRes.data,
            revenue: paymentsRes.data,
            expiring: Array.isArray(expiringRes.data) ? expiringRes.data : [],
          };
          break;

        case 'staff':
          // Staff: Stats operativas del día
          response = await api.get('/staff/dashboard/');
          break;

        case 'trainer':
          // Trainer: Sus clases y clientes
          response = await api.get('/staff/my-stats/');
          break;

        case 'member':
        default:
          // Member: Stats personales
          response = await api.get('/users/stats/');
          break;
      }

      setStats(response.data || response);
    } catch (error: any) {
      console.error('Error loading dashboard data:', error);
      setError(error.response?.data?.message || 'Error al cargar datos del dashboard');
      
      // Set default data para evitar crashes
      setStats({
        members: { total: 0, active: 0, inactive: 0, expired: 0 },
        revenue: { month: 0, today: 0 },
        expiring: [],
        membership: { days_remaining: 0, expiring_soon: false },
        reservations: { upcoming: 0, list: [] },
        attendance: { month: 0 },
        streak: { days: 0, best: 0 },
        goals: { monthlyClasses: 12 },
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-zinc-900 border border-red-500/50 rounded-2xl p-8 text-center">
        <p className="text-red-400 font-bold mb-2">Error al cargar dashboard</p>
        <p className="text-gray-400 text-sm">{error}</p>
        <button
          onClick={() => loadDashboardData()}
          className="mt-4 px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-bold transition-colors"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header compartido con personalización por rol */}
      {user && (
        <DashboardHeader 
          user={{
            first_name: user.first_name,
            full_name: user.full_name,
          }} 
          role={role} 
        />
      )}

      {/* Renderizado condicional del contenido según rol */}
      {role === 'admin' && <AdminSection stats={stats} />}
      {role === 'member' && <MemberSection stats={stats} />}
      
      {/* TODO: Descomentar cuando estén implementados */}
      {/* {role === 'staff' && <StaffSection stats={stats} />} */}
      {/* {role === 'trainer' && <TrainerSection stats={stats} />} */}
      
      {/* Fallback para roles sin implementar aún */}
      {(role === 'staff' || role === 'trainer') && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 text-center">
          <p className="text-white font-bold mb-2">
            Dashboard de {role === 'staff' ? 'Staff' : 'Entrenador'}
          </p>
          <p className="text-gray-400 text-sm">
            Sección en desarrollo...
          </p>
        </div>
      )}
    </div>
  );
}
