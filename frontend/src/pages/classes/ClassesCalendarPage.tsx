import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import {
  Plus,
  ChevronLeft,
  ChevronRight,
  Filter,
  Loader2,
  AlertCircle,
  CheckCircle,
  Calendar as CalendarIcon,
} from 'lucide-react';
import { gymClassService, classTypeService, reservationService } from '../../services/classes';
import { membershipService } from '../../services/memberships';
import ClassCard from '../../components/classes/ClassCard';
import type { GymClass, ClassType, Reservation } from '../../types';

export default function ClassesCalendarPage() {
  const navigate = useNavigate();
  const [classes, setClasses] = useState<GymClass[]>([]);
  const [classTypes, setClassTypes] = useState<ClassType[]>([]);
  const [myReservations, setMyReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentWeekStart, setCurrentWeekStart] = useState(getWeekStart(new Date()));
  const [selectedType, setSelectedType] = useState<string>('all');
  const { user } = useAuthStore();
  const [activeMembership, setActiveMembership] = useState<any>(null);

  const isAdminOrStaff = user?.role_name === 'admin' || user?.role_name === 'staff';

  useEffect(() => {
    fetchData();
    fetchMemberships();
  }, [currentWeekStart, selectedType]);

  const fetchData = async () => {
    try {
      setLoading(true);

      const weekEnd = new Date(currentWeekStart);
      weekEnd.setDate(weekEnd.getDate() + 6);

      const filters: any = {
        date_from: formatDateISO(currentWeekStart),
        date_to: formatDateISO(weekEnd),
      };

      if (selectedType !== 'all') {
        filters.class_type = parseInt(selectedType);
      }

      const [classesData, typesData, reservationsData] = await Promise.all([
        gymClassService.getAll(filters).catch(() => []),
        classTypeService.getAll().catch(() => []),
        reservationService.getMyReservations().catch(() => []),
      ]);

      setClasses(Array.isArray(classesData) ? classesData : []);
      setClassTypes(Array.isArray(typesData) ? typesData : []);
      setMyReservations(Array.isArray(reservationsData) ? reservationsData : []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMemberships = async () => {
    try {
      const data = await membershipService.getMyMemberships();
      const membershipList = Array.isArray(data) ? data : [];
      const active = membershipList.find((m: any) => m.status === 'active');
      setActiveMembership(active || null);
    } catch (error) {
      console.error('Error fetching memberships:', error);
      setActiveMembership(null);
    }
  };

  const handleReserve = async (gymClass: GymClass) => {
    // Validate active membership before reserving (skip for admins/staff)
    if (!activeMembership && !isAdminOrStaff) {
      alert('⚠️ No tienes una membresía activa.\n\nContacta con el gimnasio para activar tu membresía antes de reservar clases.');
      return;
    }

    try {
      await reservationService.create(gymClass.id, 1);
      await fetchData();
      alert('✅ ¡Reserva exitosa!');
    } catch (error: any) {
      const errorMsg = error.response?.data?.detail || error.response?.data?.message || 'Error al reservar';

      // Show user-friendly error messages
      if (errorMsg.includes('membresía activa')) {
        alert('⚠️ ' + errorMsg);
      } else if (errorMsg.includes('límite')) {
        alert('📊 ' + errorMsg + '\n\nConsulta con el gimnasio para actualizar tu plan.');
      } else if (errorMsg.includes('ya tienes')) {
        alert('ℹ️ ' + errorMsg);
      } else {
        alert('❌ ' + errorMsg);
      }
    }
  };

  const handleCancelReservation = async (gymClass: GymClass) => {
    const reservation = myReservations.find(r => r.gym_class === gymClass.id);
    if (!reservation) return;

    if (!confirm('¿Cancelar esta reserva?')) return;

    try {
      await reservationService.cancel(reservation.id);
      await fetchData();
      alert('Reserva cancelada');
    } catch (error) {
      alert('Error al cancelar');
    }
  };

  const previousWeek = () => {
    const newDate = new Date(currentWeekStart);
    newDate.setDate(newDate.getDate() - 7);
    setCurrentWeekStart(newDate);
  };

  const nextWeek = () => {
    const newDate = new Date(currentWeekStart);
    newDate.setDate(newDate.getDate() + 7);
    setCurrentWeekStart(newDate);
  };

  const isReserved = (gymClass: GymClass) => {
    return myReservations.some(r => r.gym_class === gymClass.id && r.status === 'confirmed');
  };

  // Agrupar clases por día
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(currentWeekStart);
    date.setDate(date.getDate() + i);
    return date;
  });

  const getClassesForDay = (date: Date) => {
    return classes.filter(c => {
      const classDate = new Date(c.start_datetime);
      return classDate.toDateString() === date.toDateString();
    }).sort((a, b) => new Date(a.start_datetime).getTime() - new Date(b.start_datetime).getTime());
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white uppercase tracking-tight flex items-center gap-3">
            <CalendarIcon className="w-7 h-7 text-orange-500" />
            Clases
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Calendario semanal de clases
          </p>
        </div>
        <button
          onClick={() => navigate('/classes/new')}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg shadow-orange-500/30"
        >
          <Plus className="w-5 h-5" />
          Nueva Clase
        </button>
      </div>

      {/* Membership Status Alert - Only show for members */}
      {!isAdminOrStaff && (
        !activeMembership ? (
          <div className="bg-amber-900/20 border border-amber-500/30 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-amber-300">No tienes membresía activa</p>
                <p className="text-sm text-amber-400/80 mt-1">
                  Necesitas una membresía activa para reservar clases. Contacta con el gimnasio.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-green-900/20 border border-green-500/30 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <div>
                  <p className="font-semibold text-green-300">Membresía Activa: {activeMembership.plan_name}</p>
                  <p className="text-sm text-green-400/80">
                    Válida hasta: {new Date(activeMembership.end_date).toLocaleDateString('es-ES')}
                  </p>
                </div>
              </div>
              {activeMembership.max_classes_per_month && (
                <div className="text-right">
                  <p className="text-sm text-green-400/80">Clases este mes</p>
                  <p className="text-lg font-bold text-green-300">
                    {myReservations.filter((r: any) => {
                      const resDate = new Date(r.reserved_at);
                      const now = new Date();
                      return resDate.getMonth() === now.getMonth() && r.status === 'confirmed';
                    }).length} / {activeMembership.max_classes_per_month}
                  </p>
                </div>
              )}
            </div>
          </div>
        )
      )}

      {/* Filters and Week Navigation */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Week Navigation */}
          <div className="flex items-center gap-3">
            <button
              onClick={previousWeek}
              className="p-2 text-gray-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="font-semibold text-white min-w-[200px] text-center">
              {formatWeekRange(currentWeekStart)}
            </span>
            <button
              onClick={nextWeek}
              className="p-2 text-gray-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-xl text-white focus:outline-none focus:border-orange-500 transition-colors"
            >
              <option value="all">Todos los tipos</option>
              {classTypes.map(type => (
                <option key={type.id} value={type.id}>{type.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Calendar - Grouped List View */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
        </div>
      ) : (
        <div className="space-y-8">
          {weekDays.map((day, index) => {
            const dayClasses = getClassesForDay(day);
            const isToday = day.toDateString() === new Date().toDateString();

            return (
              <div key={index} className="space-y-4">
                {/* Day Header */}
                <div className="flex items-center gap-4 pb-3 border-b border-zinc-800">
                  <div className={`
                    flex items-center gap-3 px-4 py-2 rounded-xl border-2
                    ${isToday
                      ? 'bg-orange-900/20 border-orange-500/50'
                      : 'bg-zinc-900 border-zinc-800'
                    }
                  `}>
                    <div>
                      <p className="text-xs font-medium text-gray-400 uppercase">
                        {day.toLocaleDateString('es-ES', { weekday: 'long' })}
                      </p>
                      <p className={`text-2xl font-bold ${isToday ? 'text-orange-400' : 'text-white'}`}>
                        {day.getDate()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-400">
                        {day.toLocaleDateString('es-ES', { month: 'short', year: 'numeric' })}
                      </p>
                      <p className={`text-sm font-medium ${isToday ? 'text-orange-400' : 'text-gray-300'}`}>
                        {dayClasses.length} {dayClasses.length === 1 ? 'clase' : 'clases'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Classes Grid - 2-3 columns */}
                {dayClasses.length === 0 ? (
                  <div className="text-center py-8 bg-zinc-900 border border-zinc-800 rounded-xl">
                    <p className="text-sm text-gray-400">No hay clases programadas</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {dayClasses.map(gymClass => (
                      <ClassCard
                        key={gymClass.id}
                        gymClass={gymClass}
                        onReserve={handleReserve}
                        onCancel={handleCancelReservation}
                        onViewDetails={(c) => navigate(`/classes/${c.id}`)}
                        isReserved={isReserved(gymClass)}
                      />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/**
 * Helper: Get Monday of current week
 */
function getWeekStart(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust for Monday start
  return new Date(d.setDate(diff));
}

/**
 * Helper: Format date to ISO string (YYYY-MM-DD)
 */
function formatDateISO(date: Date): string {
  return date.toISOString().split('T')[0];
}

/**
 * Helper: Format week range display
 */
function formatWeekRange(start: Date): string {
  const end = new Date(start);
  end.setDate(end.getDate() + 6);

  return `${start.getDate()} ${start.toLocaleDateString('es-ES', { month: 'short' })} - ${end.getDate()} ${end.toLocaleDateString('es-ES', { month: 'short' })} ${end.getFullYear()}`;
}
