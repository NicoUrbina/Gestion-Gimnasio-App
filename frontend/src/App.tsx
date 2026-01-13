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

// Components
import ProtectedRoute from './components/ProtectedRoute';

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
          },
        }}
      />
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<LoginPage />} />

        {/* Protected routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            
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
            
            {/* Classes */}
            <Route path="/classes" element={<ClassesCalendarPage />} />
            <Route path="/classes/my-reservations" element={<MyReservationsPage />} />
            
            {/* Placeholder pages */}
            <Route path="/staff" element={<PlaceholderPage title="Entrenadores" />} />
            <Route path="/progress" element={<PlaceholderPage title="Progreso" />} />
            <Route path="/settings" element={<PlaceholderPage title="Configuración" />} />
          </Route>
        </Route>

        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
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
