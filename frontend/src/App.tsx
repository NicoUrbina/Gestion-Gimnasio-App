import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useEffect } from 'react';
import { useAuthStore } from './stores/authStore';

// Layouts
import MainLayout from './layouts/MainLayout';

// Pages
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import MembersPage from './pages/MembersPage';
import MemberFormPage from './pages/MemberFormPage';
import MemberDetailPage from './pages/MemberDetailPage';

// Memberships
import MembershipPlansPage from './pages/memberships/MembershipPlansPage';
import MembershipPlanFormPage from './pages/memberships/MembershipPlanFormPage';
import AssignMembershipPage from './pages/memberships/AssignMembershipPage';
import MembershipsListPage from './pages/memberships/MembershipsListPage';

// Classes
import ClassesCalendarPage from './pages/classes/ClassesCalendarPage';
import MyReservationsPage from './pages/classes/MyReservationsPage';
import ClassFormPage from './pages/classes/ClassFormPage';

// Payments
import PaymentsPage from './pages/payments/PaymentsPage';
import MyPaymentsPage from './pages/payments/MyPaymentsPage';
import PaymentFormPage from './pages/payments/PaymentFormPage';
import PaymentDetailPage from './pages/payments/PaymentDetailPage';

// Notifications
import NotificationsPage from './pages/NotificationsPage';

// Evaluations (Phase 5)
import RequestEvaluationPage from './pages/evaluations/RequestEvaluationPage';
import EvaluationHistoryPage from './pages/evaluations/EvaluationHistoryPage';
import EvaluationFormPage from './pages/evaluations/EvaluationFormPage';

// Workouts (Phase 5)
import MyRoutinePage from './pages/workouts/MyRoutinePage';
import ExerciseLibraryPage from './pages/workouts/ExerciseLibraryPage';
import RoutineBuilderPage from './pages/workouts/RoutineBuilderPage';

// Progress (Phase 6)
import EvolutionChartsPage from './pages/progress/EvolutionChartsPage';
import UpdateProgressPage from './pages/progress/UpdateProgressPage';

// Memberships - Renewal (Phase 7)
import RenewalPortalPage from './pages/memberships/RenewalPortalPage';

// Public & Dashboard (Phase 8)
import PublicRegistrationPage from './pages/PublicRegistrationPage';
import EnhancedDashboardPage from './pages/EnhancedDashboardPage';

// Error pages
import NotFoundPage from './pages/NotFoundPage';

// Components
import ProtectedRoute from './components/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  const { checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <BrowserRouter>
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#1e293b',
            color: '#fff',
            borderRadius: '12px',
            border: '1px solid #334155',
          },
          success: {
            iconTheme: {
              primary: '#f97316',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
      <ErrorBoundary>
        <Routes>
        {/* Public routes */}
        <Route path="/register" element={<PublicRegistrationPage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* Protected routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            {/* Enhanced Dashboard (Phase 8) */}
            <Route path="/dashboard" element={<EnhancedDashboardPage />} />
            <Route path="/dashboard/old" element={<DashboardPage />} />
            
            {/* Members */}
            <Route path="/members" element={<MembersPage />} />
            <Route path="/members/new" element={<MemberFormPage />} />
            <Route path="/members/:id" element={<MemberDetailPage />} />
            <Route path="/members/:id/edit" element={<MemberFormPage />} />
            
            {/* Memberships */}
            <Route path="/memberships" element={<MembershipsListPage />} />
            <Route path="/memberships/plans" element={<MembershipPlansPage />} />
            <Route path="/memberships/plans/new" element={<MembershipPlanFormPage />} />
            <Route path="/memberships/plans/:id/edit" element={<MembershipPlanFormPage />} />
            <Route path="/memberships/assign" element={<AssignMembershipPage />} />
            <Route path="/memberships/renew" element={<RenewalPortalPage />} />
            
            {/* Classes */}
            <Route path="/classes" element={<ClassesCalendarPage />} />
            <Route path="/classes/calendar" element={<ClassesCalendarPage />} />
            <Route path="/classes/new" element={<ClassFormPage />} />
            <Route path="/classes/:id/edit" element={<ClassFormPage />} />
            <Route path="/classes/my-reservations" element={<MyReservationsPage />} />
            
            {/* Payments */}
            <Route path="/payments" element={<PaymentsPage />} />
            <Route path="/payments/my-payments" element={<MyPaymentsPage />} />
            <Route path="/payments/submit" element={<PaymentFormPage />} />
            <Route path="/payments/new" element={<PaymentFormPage />} />
            <Route path="/payments/:id" element={<PaymentDetailPage />} />
            
            {/* Evaluations (Phase 5) */}
            <Route path="/evaluations" element={<EvaluationHistoryPage />} />
            <Route path="/evaluations/request" element={<RequestEvaluationPage />} />
            <Route path="/evaluations/:id/form" element={<EvaluationFormPage />} />
            
            {/* Workouts (Phase 5) */}
            <Route path="/workouts/my-routine" element={<MyRoutinePage />} />
            <Route path="/workouts/exercises" element={<ExerciseLibraryPage />} />
            <Route path="/workouts/builder" element={<RoutineBuilderPage />} />
            <Route path="/workouts/routines" element={<PlaceholderPage title="Mis Rutinas" />} />
            
            {/* Progress (Phase 6) */}
            <Route path="/progress" element={<EvolutionChartsPage />} />
            <Route path="/progress/evolution" element={<EvolutionChartsPage />} />
            <Route path="/progress/update" element={<UpdateProgressPage />} />
            <Route path="/progress/log" element={<UpdateProgressPage />} />
            
            {/* Notifications */}
            <Route path="/notifications" element={<NotificationsPage />} />
            
            {/* Placeholder pages */}
            <Route path="/staff" element={<PlaceholderPage title="Entrenadores" />} />
            <Route path="/settings" element={<PlaceholderPage title="Configuración" />} />
          </Route>
        </Route>

          {/* Default redirect */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          
          {/* 404 - Catch all */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </ErrorBoundary>
    </BrowserRouter>
  );
}

// Placeholder para páginas en desarrollo
function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="flex items-center justify-center h-[60vh]">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">{title}</h1>
        <p className="text-slate-500">Página en desarrollo</p>
      </div>
    </div>
  );
}

export default App;
