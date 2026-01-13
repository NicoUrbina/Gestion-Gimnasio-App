import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Loader2, X } from 'lucide-react';
import { reservationService } from '../../services/classes';
import ReservationStatusBadge from '../../components/classes/ReservationStatusBadge';
import type { Reservation } from '../../types';

type TabType = 'upcoming' | 'waitlist' | 'history';

export default function MyReservationsPage() {
  const navigate = useNavigate();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>('upcoming');
  const [cancelling, setCancelling] = useState<number | null>(null);

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    try {
      setLoading(true);
      const data = await reservationService.getMyReservations();
      setReservations(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching reservations:', error);
      setReservations([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelReservation = async (id: number) => {
    if (!confirm('¿Cancelar esta reserva?')) return;

    try {
      setCancelling(id);
      await reservationService.cancel(id);
      await fetchReservations();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Error al cancelar');
    } finally {
      setCancelling(null);
    }
  };

  const filterReservations = () => {
    const now = new Date();

    switch (activeTab) {
      case 'upcoming':
        return reservations.filter(r => 
          r.status === 'confirmed' && new Date(r.reserved_at) >= now
        );
      case 'waitlist':
        return reservations.filter(r => r.status === 'waitlist');
      case 'history':
        return reservations.filter(r => 
          r.status === 'attended' || r.status === 'cancelled' || r.status === 'no_show'
        );
      default:
        return reservations;
    }
  };

  const filtered = filterReservations();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Mis Reservas</h1>
        <p className="text-slate-500 mt-1">Gestiona tus reservas de clases</p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl border border-slate-200 p-1">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`
              flex-1 px-4 py-2.5 rounded-xl font-medium text-sm transition-all
              ${activeTab === 'upcoming'
                ? 'bg-gradient-to-r from-purple-600 to-cyan-600 text-white shadow-lg shadow-purple-500/25'
                : 'text-slate-600 hover:bg-slate-50'
              }
            `}
          >
            Próximas
          </button>
          <button
            onClick={() => setActiveTab('waitlist')}
            className={`
              flex-1 px-4 py-2.5 rounded-xl font-medium text-sm transition-all
              ${activeTab === 'waitlist'
                ? 'bg-gradient-to-r from-purple-600 to-cyan-600 text-white shadow-lg shadow-purple-500/25'
                : 'text-slate-600 hover:bg-slate-50'
              }
            `}
          >
            Lista de Espera
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`
              flex-1 px-4 py-2.5 rounded-xl font-medium text-sm transition-all
              ${activeTab === 'history'
                ? 'bg-gradient-to-r from-purple-600 to-cyan-600 text-white shadow-lg shadow-purple-500/25'
                : 'text-slate-600 hover:bg-slate-50'
              }
            `}
          >
            Historial
          </button>
        </div>
      </div>

      {/* Reservations List */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-slate-400">
            <Calendar className="w-12 h-12 mb-3" />
            <p className="text-lg font-medium">No hay reservas</p>
            <p className="text-sm mt-1">
              {activeTab === 'upcoming' && 'Reserva una clase para comenzar'}
              {activeTab === 'waitlist' && 'No estás en ninguna lista de espera'}
              {activeTab === 'history' && 'Aún no tienes historial'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filtered.map(reservation => (
              <div
                key={reservation.id}
                className="p-4 hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-900 mb-1">
                      {reservation.class_title}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {new Date(reservation.reserved_at).toLocaleDateString('es-ES', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </span>
                    </div>
                    <ReservationStatusBadge 
                      status={reservation.status}
                      waitlistPosition={reservation.waitlist_position}
                    />
                  </div>

                  {/* Cancel button */}
                  {(reservation.status === 'confirmed' || reservation.status === 'waitlist') && (
                    <button
                      onClick={() => handleCancelReservation(reservation.id)}
                      disabled={cancelling === reservation.id}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                      title="Cancelar reserva"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* CTA */}
      {!loading && filtered.length === 0 && activeTab === 'upcoming' && (
        <div className="text-center">
          <button
            onClick={() => navigate('/classes')}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-cyan-600 text-white font-medium rounded-xl hover:from-purple-500 hover:to-cyan-500 shadow-lg shadow-purple-500/25 transition-all"
          >
            Ver Calendario de Clases
          </button>
        </div>
      )}
    </div>
  );
}
