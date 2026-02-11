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
  Clock,
  MapPin,
  Users,
  Eye,
  XCircle,
} from 'lucide-react';
import { gymClassService, classTypeService, reservationService } from '../../services/classes';
import { membershipService } from '../../services/memberships';
import type { GymClass, ClassType, Reservation } from '../../types';
import toast from 'react-hot-toast';

export default function ClassesCalendarPage() {
  const navigate = useNavigate();
  const [classes, setClasses] = useState<GymClass[]>([]);
  const [classTypes, setClassTypes] = useState<ClassType[]>([]);
  const [myReservations, setMyReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentWeekStart, setCurrentWeekStart] = useState(getWeekStart(new Date()));
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 6;
  const { user } = useAuthStore();
  const [activeMembership, setActiveMembership] = useState<any>(null);
  const [reservingId, setReservingId] = useState<number | null>(null);

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
    if (!activeMembership && !isAdminOrStaff) {
      toast.error('No tienes una membresía activa. Contacta con el gimnasio.');
      return;
    }

    try {
      setReservingId(gymClass.id);
      await reservationService.create(gymClass.id);
      await fetchData();
      toast.success('¡Reserva exitosa!');
    } catch (error: any) {
      const errorMsg = error.response?.data?.detail || error.response?.data?.message || 'Error al reservar';
      toast.error(errorMsg);
    } finally {
      setReservingId(null);
    }
  };

  const handleCancelReservation = async (gymClass: GymClass) => {
    const reservation = myReservations.find(r => r.gym_class === gymClass.id);
    if (!reservation) return;

    if (!confirm('¿Cancelar esta reserva?')) return;

    try {
      await reservationService.cancel(reservation.id);
      await fetchData();
      toast.success('Reserva cancelada');
    } catch (error) {
      toast.error('Error al cancelar');
    }
  };

  const previousWeek = () => {
    const newDate = new Date(currentWeekStart);
    newDate.setDate(newDate.getDate() - 7);
    setCurrentWeekStart(newDate);
    setSelectedDay(null);
  };

  const nextWeek = () => {
    const newDate = new Date(currentWeekStart);
    newDate.setDate(newDate.getDate() + 7);
    setCurrentWeekStart(newDate);
    setSelectedDay(null);
  };

  const goToToday = () => {
    setCurrentWeekStart(getWeekStart(new Date()));
    setSelectedDay(null);
  };

  const isReserved = (gymClass: GymClass) => {
    return myReservations.some(r => r.gym_class === gymClass.id && r.status === 'confirmed');
  };

  // Week days
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(currentWeekStart);
    date.setDate(date.getDate() + i);
    return date;
  });

  // Filter classes by selected day
  const getFilteredClasses = () => {
    let filtered = classes;
    if (selectedDay !== null) {
      const day = weekDays[selectedDay];
      filtered = filtered.filter(c => {
        const classDate = new Date(c.start_datetime);
        return classDate.toDateString() === day.toDateString();
      });
    }
    return filtered.sort((a, b) => new Date(a.start_datetime).getTime() - new Date(b.start_datetime).getTime());
  };

  const filteredClasses = getFilteredClasses();

  // Pagination
  const totalPages = Math.ceil(filteredClasses.length / ITEMS_PER_PAGE);
  const paginatedClasses = filteredClasses.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedDay, selectedType, currentWeekStart]);

  // Count classes per day for the calendar pills
  const getClassCountForDay = (dayIndex: number) => {
    const day = weekDays[dayIndex];
    return classes.filter(c => {
      const classDate = new Date(c.start_datetime);
      return classDate.toDateString() === day.toDateString();
    }).length;
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
            {classes.length} clases esta semana
          </p>
        </div>
        {isAdminOrStaff && (
          <button
            onClick={() => navigate('/classes/new')}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg shadow-orange-500/30"
          >
            <Plus className="w-5 h-5" />
            Nueva Clase
          </button>
        )}
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

      {/* Week Navigation + Filter Bar */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 space-y-4">
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
            <button
              onClick={goToToday}
              className="px-3 py-1.5 text-xs font-medium text-orange-400 border border-orange-500/30 rounded-lg hover:bg-orange-500/10 transition-colors"
            >
              Hoy
            </button>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-xl text-white text-sm focus:outline-none focus:border-orange-500 transition-colors"
            >
              <option value="all">Todos los tipos</option>
              {classTypes.map(type => (
                <option key={type.id} value={type.id}>{type.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Calendar Day Pills */}
        <div className="grid grid-cols-7 gap-2">
          {weekDays.map((day, index) => {
            const isToday = day.toDateString() === new Date().toDateString();
            const isSelected = selectedDay === index;
            const classCount = getClassCountForDay(index);

            return (
              <button
                key={index}
                onClick={() => setSelectedDay(isSelected ? null : index)}
                className={`
                  relative flex flex-col items-center py-3 px-2 rounded-xl transition-all border-2
                  ${isSelected
                    ? 'bg-orange-500/20 border-orange-500 text-white'
                    : isToday
                      ? 'bg-zinc-800 border-orange-500/40 text-white'
                      : 'bg-zinc-800/50 border-zinc-700/50 text-gray-400 hover:border-zinc-600 hover:text-gray-300'
                  }
                `}
              >
                <span className="text-[10px] font-medium uppercase tracking-wider">
                  {day.toLocaleDateString('es-ES', { weekday: 'short' })}
                </span>
                <span className={`text-xl font-bold mt-0.5 ${isToday && !isSelected ? 'text-orange-400' : ''}`}>
                  {day.getDate()}
                </span>
                {classCount > 0 && (
                  <span className={`mt-1 text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${isSelected
                    ? 'bg-orange-500 text-white'
                    : 'bg-zinc-700 text-gray-300'
                    }`}>
                    {classCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Classes Table */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
          </div>
        ) : filteredClasses.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-400">
            <CalendarIcon className="w-12 h-12 mb-3" />
            <p className="text-lg font-medium">No hay clases programadas</p>
            <p className="text-sm mt-1">
              {selectedDay !== null ? 'Intenta seleccionar otro día' : 'No hay clases esta semana'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-zinc-800">
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Día / Hora</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Clase</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Instructor</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Ubicación</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Cupos</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Estado</th>
                  <th className="text-right px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {paginatedClasses.map(gymClass => {
                  const startDate = new Date(gymClass.start_datetime);
                  const endDate = new Date(gymClass.end_datetime);
                  const startTime = startDate.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
                  const endTime = endDate.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
                  const dayName = startDate.toLocaleDateString('es-ES', { weekday: 'short' });
                  const dayNum = startDate.getDate();
                  const reserved = isReserved(gymClass);
                  const spotsColor = gymClass.available_spots === 0
                    ? 'text-red-400'
                    : gymClass.available_spots <= 3
                      ? 'text-yellow-400'
                      : 'text-emerald-400';

                  return (
                    <tr
                      key={gymClass.id}
                      className={`hover:bg-zinc-800/50 transition-colors ${gymClass.is_cancelled ? 'opacity-50' : ''}`}
                    >
                      {/* Day / Time */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-1 h-10 rounded-full" style={{ backgroundColor: gymClass.color || '#f97316' }} />
                          <div>
                            <p className="text-xs text-gray-400 uppercase font-medium">{dayName} {dayNum}</p>
                            <div className="flex items-center gap-1.5 text-white font-semibold">
                              <Clock className="w-3.5 h-3.5 text-gray-500" />
                              {startTime} - {endTime}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Class */}
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-semibold text-white">{gymClass.title}</p>
                          <p className="text-xs text-gray-400">{gymClass.class_type_name}</p>
                        </div>
                      </td>

                      {/* Instructor */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm text-gray-300">
                          <Users className="w-4 h-4 text-gray-500" />
                          {gymClass.instructor_name || '—'}
                        </div>
                      </td>

                      {/* Location */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm text-gray-300">
                          <MapPin className="w-4 h-4 text-gray-500" />
                          {gymClass.location || '—'}
                        </div>
                      </td>

                      {/* Capacity */}
                      <td className="px-6 py-4">
                        <span className={`text-sm font-semibold ${spotsColor}`}>
                          {gymClass.available_spots}/{gymClass.capacity}
                        </span>
                        {gymClass.waitlist_count > 0 && (
                          <p className="text-[10px] text-yellow-400 mt-0.5">
                            +{gymClass.waitlist_count} en espera
                          </p>
                        )}
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4">
                        {gymClass.is_cancelled ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-red-900/30 text-red-400 text-xs font-semibold rounded-full border border-red-500/30">
                            Cancelada
                          </span>
                        ) : reserved ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-green-900/30 text-green-400 text-xs font-semibold rounded-full border border-green-500/30">
                            <CheckCircle className="w-3 h-3" />
                            Reservada
                          </span>
                        ) : gymClass.available_spots === 0 ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-yellow-900/30 text-yellow-400 text-xs font-semibold rounded-full border border-yellow-500/30">
                            Llena
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-900/30 text-emerald-400 text-xs font-semibold rounded-full border border-emerald-500/30">
                            Disponible
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => navigate(`/classes/${gymClass.id}`)}
                            className="p-2 text-gray-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
                            title="Ver detalles"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {!gymClass.is_cancelled && (
                            reserved ? (
                              <button
                                onClick={() => handleCancelReservation(gymClass)}
                                className="px-3 py-1.5 text-xs font-medium text-red-400 border border-red-500/30 rounded-lg hover:bg-red-500/10 transition-colors"
                              >
                                <XCircle className="w-3.5 h-3.5 inline mr-1" />
                                Cancelar
                              </button>
                            ) : (
                              <button
                                onClick={() => handleReserve(gymClass)}
                                disabled={reservingId === gymClass.id}
                                className="px-3 py-1.5 text-xs font-medium text-white bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all shadow shadow-orange-500/25 disabled:opacity-50"
                              >
                                {reservingId === gymClass.id ? (
                                  <Loader2 className="w-3.5 h-3.5 inline animate-spin mr-1" />
                                ) : (
                                  <CheckCircle className="w-3.5 h-3.5 inline mr-1" />
                                )}
                                {gymClass.available_spots === 0 ? 'Lista espera' : 'Reservar'}
                              </button>
                            )
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {!loading && filteredClasses.length > 0 && (
          <div className="px-6 py-3 border-t border-zinc-800 flex items-center justify-between">
            <p className="text-sm text-gray-400">
              Mostrando {Math.min((currentPage - 1) * ITEMS_PER_PAGE + 1, filteredClasses.length)}-{Math.min(currentPage * ITEMS_PER_PAGE, filteredClasses.length)} de {filteredClasses.length} clases
              {selectedDay !== null && (
                <span className="text-orange-400 ml-1">
                  · {weekDays[selectedDay].toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'short' })}
                </span>
              )}
            </p>
            <div className="flex items-center gap-2">
              {selectedDay !== null && (
                <button
                  onClick={() => setSelectedDay(null)}
                  className="text-xs text-orange-400 hover:text-orange-300 transition-colors mr-2"
                >
                  Ver toda la semana
                </button>
              )}
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1.5 text-sm font-medium text-gray-300 bg-zinc-800 border border-zinc-700 rounded-lg hover:bg-zinc-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-zinc-800"
              >
                <ChevronLeft className="w-4 h-4 inline -mt-0.5" /> Anterior
              </button>
              <span className="text-sm text-gray-400 min-w-[80px] text-center">
                Pág. {currentPage} / {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 text-sm font-medium text-gray-300 bg-zinc-800 border border-zinc-700 rounded-lg hover:bg-zinc-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-zinc-800"
              >
                Siguiente <ChevronRight className="w-4 h-4 inline -mt-0.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Helper: Get Monday of current week
 */
function getWeekStart(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
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
