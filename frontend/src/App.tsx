import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { Toaster } from "react-hot-toast"
import { useEffect } from "react"
import { useAuthStore } from "./stores/authStore"
import HomePage from "./pages/HomePage"

// Layouts
import MainLayout from "./layouts/MainLayout"

// Pages
import LoginPage from "./pages/LoginPage"
import RegisterPage from "./pages/auth/RegisterPage"
import DashboardPage from "./pages/DashboardPage"
import MembersPage from "./pages/MembersPage"
import MemberFormPage from "./pages/MemberFormPage"
import MemberDetailPage from "./pages/MemberDetailPage"

// Memberships
import MembershipPlansPage from "./pages/memberships/MembershipPlansPage"
import MembershipPlanFormPage from "./pages/memberships/MembershipPlanFormPage"
import AssignMembershipPage from "./pages/memberships/AssignMembershipPage"
import MembershipsListPage from "./pages/memberships/MembershipsListPage"

// Classes
import ClassesCalendarPage from "./pages/classes/ClassesCalendarPage"
import MyReservationsPage from "./pages/classes/MyReservationsPage"
import ClassFormPage from "./pages/classes/ClassFormPage"

// Payments
import PaymentsPage from "./pages/payments/PaymentsPage"
import MyPaymentsPage from "./pages/payments/MyPaymentsPage"
import PaymentFormPage from "./pages/payments/PaymentFormPage"
import PaymentDetailPage from "./pages/payments/PaymentDetailPage"

// Progress
import ProgressDashboard from "./pages/progress/ProgressDashboard"
import UpdateProgressPage from "./pages/progress/UpdateProgressPage"
import EvolutionCharts from "./pages/progress/EvolutionCharts"
import ProgressHistory from "./pages/progress/ProgressHistory"
import ComparisonView from "./pages/progress/ComparisonView"

// Workouts & Exercises
import ExerciseLibraryPage from "./pages/workouts/ExerciseLibraryPage"
import RoutineBuilderPage from "./pages/workouts/RoutineBuilderPage"
import MyRoutinePage from "./pages/workouts/MyRoutinePage"

// Evaluations & Goals
import RequestEvaluationPage from "./pages/evaluations/RequestEvaluationPage"
import EvaluationFormPage from "./pages/evaluations/EvaluationFormPage"
import EvaluationHistoryPage from "./pages/evaluations/EvaluationHistoryPage"

// Access Control
import AccessLogsPage from "./pages/access/AccessLogsPage"
import AbandonmentAlertsPage from "./pages/access/AbandonmentAlertsPage"

// Equipment Management
import EquipmentListPage from "./pages/equipment/EquipmentListPage"
import EquipmentFormPage from "./pages/equipment/EquipmentFormPage"

// Settings
import {
  SettingsPage,
  UsersSettingsPage,
  UserFormPage,
  RolesSettingsPage,
  GymSettingsPage,
  NotificationsSettingsPage,
  PaymentsSettingsPage,
  SecuritySettingsPage,
  SystemSettingsPage,
} from "./pages/settings"
import AuditLogsPage from "./components/settings/audit/AuditLogsPage"

// Components
import ProtectedRoute from "./components/ProtectedRoute"
import AdminRoute from "./components/AdminRoute"
import QuestionsPage from "./pages/footerPages/questions"
import WorkWithUsPage from "./pages/footerPages/WorkWithUs"
import PlantsPricesPage from "./pages/classes/pages Index/PlantsPrices"
import Step1SchedulePage from "./pages/classes/pages Index/Step1Schedule"
import Step2SchedulePage from "./pages/classes/pages Index/Step2Schedule"
import Step3SchedulePage from "./pages/classes/pages Index/Step3Schedule"
import Step4SchedulePage from "./pages/classes/pages Index/Step4Schedule"


function App() {
  const { checkAuth } = useAuthStore()

  useEffect(() => {
    const token = localStorage.getItem('access_token');

    if (token) {
      // If we have a token, always validate it
      checkAuth();
    } else {
      // No token, ensure loading is false so login page shows
      useAuthStore.setState({ isLoading: false });
    }
  }, [])

  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: "#1e293b",
            color: "#fff",
            borderRadius: "12px",
          },
        }}
      />
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/preguntas-frecuentes" element={<QuestionsPage />} />
        <Route path="/trabaja-con-nosotros" element={<WorkWithUsPage />} />
        <Route path="/planes-y-precios" element={<PlantsPricesPage />} />
        <Route path="/step1-schedule" element={<Step1SchedulePage />} />
        <Route path="/step2-schedule" element={<Step2SchedulePage />} />
        <Route path="/step3-schedule" element={<Step3SchedulePage />} />
        <Route path="/step4-schedule" element={<Step4SchedulePage />} />

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
            <Route path="/classes/new" element={<ClassFormPage />} />
            <Route path="/classes/:id/edit" element={<ClassFormPage />} />
            <Route path="/classes/my-reservations" element={<MyReservationsPage />} />

            {/* Payments */}
            <Route path="/payments" element={<PaymentsPage />} />
            <Route path="/payments/my-payments" element={<MyPaymentsPage />} />
            <Route path="/payments/submit" element={<PaymentFormPage />} />
            <Route path="/payments/new" element={<PaymentFormPage />} />
            <Route path="/payments/:id" element={<PaymentDetailPage />} />

            {/* Placeholder pages */}
            <Route path="/staff" element={<PlaceholderPage title="Entrenadores" />} />

            {/* Workouts & Exercises */}
            <Route path="/workouts/exercises" element={<ExerciseLibraryPage />} />
            <Route path="/workouts/routines" element={<RoutineBuilderPage />} />
            <Route path="/workouts/my-routine" element={<MyRoutinePage />} />

            {/* Evaluations & Goals */}
            <Route path="/evaluations/request" element={<RequestEvaluationPage />} />
            <Route path="/evaluations/new" element={<EvaluationFormPage />} />
            <Route path="/evaluations/history" element={<EvaluationHistoryPage />} />

            {/* Access Control */}
            <Route path="/access/logs" element={<AccessLogsPage />} />
            <Route path="/access/alerts" element={<AbandonmentAlertsPage />} />

            {/* Equipment Management */}
            <Route path="/equipment" element={<EquipmentListPage />} />
            <Route path="/equipment/new" element={<EquipmentFormPage />} />
            <Route path="/equipment/:id/edit" element={<EquipmentFormPage />} />
            {/* Progress */}
            <Route path="/progress" element={<ProgressDashboard />} />
            <Route path="/progress/update" element={<UpdateProgressPage />} />
            <Route path="/progress/evolution" element={<EvolutionCharts />} />
            <Route path="/progress/history" element={<ProgressHistory />} />
            <Route path="/progress/compare" element={<ComparisonView />} />

            {/* Settings - Admin Only */}
            <Route element={<AdminRoute />}>
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/settings/users" element={<UsersSettingsPage />} />
              <Route path="/settings/users/new" element={<UserFormPage />} />
              <Route path="/settings/users/:id/edit" element={<UserFormPage />} />
              <Route path="/settings/roles" element={<RolesSettingsPage />} />
              <Route path="/settings/gym" element={<GymSettingsPage />} />
              <Route path="/settings/notifications" element={<NotificationsSettingsPage />} />
              <Route path="/settings/payments" element={<PaymentsSettingsPage />} />
              <Route path="/settings/security" element={<SecuritySettingsPage />} />
              <Route path="/settings/system" element={<SystemSettingsPage />} />
              <Route path="/settings/audit" element={<AuditLogsPage />} />
            </Route>
          </Route >
        </Route >

        {/* Default redirect */}
        < Route path="*" element={< Navigate to="/dashboard" replace />} />
      </Routes >
    </BrowserRouter >
  )
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
  )
}

export default App
