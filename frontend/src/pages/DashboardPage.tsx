import { useEffect, useState } from 'react';
import { useAuthStore } from '../stores/authStore';
import api from '../services/api';

// Shared Components
import DashboardHeader from '../components/dashboard/shared/DashboardHeader';
import Spinner from '../components/dashboard/shared/Spinner';

// Role-Specific Sections
import AdminSection from '../components/dashboard/admin/AdminSection';
import StaffSection from '../components/dashboard/staff/StaffSection';
import TrainerSection from '../components/dashboard/trainer/TrainerSection';
import MemberSection from '../components/dashboard/member/MemberSection';

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
          // Admin: Stats globales del sistema (endpoints reales)
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
          // Staff: Datos mock (endpoint /staff/dashboard/ no existe aún en backend)
          console.warn('⚠️ Usando datos MOCK para Staff - Endpoint /staff/dashboard/ no implementado');
          response = {
            payments: { today: 15000 },
            reservations: { today: 24 },
            members: { newThisMonth: 8 },
            renewals: { pending: 5 },
            classes: [
              { id: 1, name: 'Yoga Matutino', trainer: 'Ana Morales', time: '08:00 AM', reservations: 12, capacity: 15 },
              { id: 2, name: 'CrossFit', trainer: 'Carlos Vargas', time: '06:00 PM', reservations: 18, capacity: 20 },
              { id: 3, name: 'Pilates', trainer: 'Lucia Rojas', time: '07:00 PM', reservations: 10, capacity: 15 },
            ]
          };
          break;

        case 'trainer':
          // Trainer: Datos mock (endpoint /staff/my-stats/ no existe aún en backend)
          console.warn('⚠️ Usando datos MOCK para Trainer - Endpoint /staff/my-stats/ no implementado');
          response = {
            classes: {
              today: 3,
              week: 12,
              list: [
                { id: 1, name: 'Yoga Matutino', time: '08:00 AM', date: 'Hoy', participants: 12, capacity: 15 },
                { id: 2, name: 'Yoga Vespertino', time: '06:00 PM', date: 'Hoy', participants: 10, capacity: 15 },
                { id: 3, name: 'Yoga Matutino', time: '08:00 AM', date: 'Mañana', participants: 8, capacity: 15 },
              ]
            },
            clients: {
              total: 24,
              list: [
                { id: 1, name: 'Juan Pérez', classes: 24, lastVisit: 'Hoy', progress: 'up' },
                { id: 2, name: 'María González', classes: 18, lastVisit: 'Ayer', progress: 'stable' },
                { id: 3, name: 'Carlos Ruiz', classes: 15, lastVisit: '2 días', progress: 'up' },
                { id: 4, name: 'Ana Martínez', classes: 12, lastVisit: '3 días', progress: 'down' },
              ]
            },
            sessions: { month: 87 }
          };
          break;

        case 'member':
        default:
          // Member: Stats personales (endpoint real)
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
      {stats && role === 'admin' && <AdminSection stats={stats} />}
      {stats && role === 'staff' && <StaffSection stats={stats} />}
      {stats && role === 'trainer' && <TrainerSection stats={stats} />}
      {stats && role === 'member' && <MemberSection stats={stats} />}
    </div>
  );
}
