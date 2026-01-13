import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  ChevronLeft,
  ChevronRight,
  Filter,
  Loader2,
} from 'lucide-react';
import { gymClassService, classTypeService, reservationService } from '../../services/classes';
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

  useEffect(() => {
    fetchData();
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

  const handleReserve = async (gymClass: GymClass) => {
    // TODO: Obtener member ID del usuario actual
    try {
      await reservationService.create(gymClass.id, 1); // Placeholder member ID
      await fetchData(); // Refresh
      alert('¡Reserva exitosa!');
    } catch (error: any) {
      alert(error.response?.data?.message || 'Error al reservar');
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
          <h1 className="text-2xl font-bold text-slate-900">Clases</h1>
          <p className="text-slate-500 mt-1">Calendario semanal de clases</p>
        </div>
        <button
          onClick={() => navigate('/classes/new')}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-cyan-600 text-white font-medium rounded-xl hover:from-purple-500 hover:to-cyan-500 shadow-lg shadow-purple-500/25 transition-all"
        >
          <Plus className="w-5 h-5" />
          Nueva Clase
        </button>
      </div>

      {/* Filters and Week Navigation */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Week Navigation */}
          <div className="flex items-center gap-3">
            <button
              onClick={previousWeek}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-slate-600" />
            </button>
            <span className="font-semibold text-slate-900 min-w-[200px] text-center">
              {formatWeekRange(currentWeekStart)}
            </span>
            <button
              onClick={nextWeek}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-slate-600" />
            </button>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-slate-400" />
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">Todos los tipos</option>
              {classTypes.map(type => (
                <option key={type.id} value={type.id}>{type.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-7 gap-4">
          {weekDays.map((day, index) => {
            const dayClasses = getClassesForDay(day);
            const isToday = day.toDateString() === new Date().toDateString();

            return (
              <div key={index} className="space-y-3">
                {/* Day Header */}
                <div className={`
                  text-center p-3 rounded-xl border-2
                  ${isToday 
                    ? 'bg-purple-50 border-purple-300' 
                    : 'bg-white border-slate-200'
                  }
                `}>
                  <p className="text-xs font-medium text-slate-500 uppercase">
                    {day.toLocaleDateString('es-ES', { weekday: 'short' })}
                  </p>
                  <p className={`text-xl font-bold ${isToday ? 'text-purple-600' : 'text-slate-900'}`}>
                    {day.getDate()}
                  </p>
                  <p className="text-xs text-slate-500">
                    {day.toLocaleDateString('es-ES', { month: 'short' })}
                  </p>
                </div>

                {/* Classes for this day */}
                <div className="space-y-3">
                  {dayClasses.length === 0 ? (
                    <div className="text-center p-6 bg-slate-50 rounded-xl">
                      <p className="text-sm text-slate-400">Sin clases</p>
                    </div>
                  ) : (
                    dayClasses.map(gymClass => (
                      <ClassCard
                        key={gymClass.id}
                        gymClass={gymClass}
                        onReserve={handleReserve}
                        onCancel={handleCancelReservation}
                        onViewDetails={(c) => navigate(`/classes/${c.id}`)}
                        isReserved={isReserved(gymClass)}
                      />
                    ))
                  )}
                </div>
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
