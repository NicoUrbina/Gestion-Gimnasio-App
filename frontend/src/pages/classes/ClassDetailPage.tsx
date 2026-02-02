import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import {
    ArrowLeft,
    Calendar,
    Clock,
    MapPin,
    Users,
    User,
    CheckCircle,
    AlertCircle,
    Edit,
    Loader2,
    Trash2,
} from 'lucide-react';
import { gymClassService, reservationService } from '../../services/classes';
import { membershipService } from '../../services/memberships';
import type { GymClass, Reservation } from '../../types';
import toast from 'react-hot-toast';

export default function ClassDetailPage() {
    const navigate = useNavigate();
    const { id } = useParams();
    const { user } = useAuthStore();
    const [gymClass, setGymClass] = useState<GymClass | null>(null);
    const [loading, setLoading] = useState(true);
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [myReservation, setMyReservation] = useState<Reservation | null>(null);
    const [activeMembership, setActiveMembership] = useState<any>(null);

    const isStaffOrAdmin = user?.role_name === 'admin' || user?.role_name === 'staff';
    const isTrainer = user?.role_name === 'trainer';

    useEffect(() => {
        if (id) {
            fetchClassData();
            fetchMembershipStatus();
        }
    }, [id]);

    const fetchClassData = async () => {
        try {
            setLoading(true);
            const data = await gymClassService.getById(parseInt(id!));
            setGymClass(data);

            // Si es staff o admin, cargar lista de reservas
            if (isStaffOrAdmin || isTrainer) {
                try {
                    const resList = await gymClassService.getReservations(parseInt(id!));
                    setReservations(Array.isArray(resList) ? resList : []);
                } catch (e) {
                    console.error("Error fetching class reservations", e);
                }
            }

            // Verificar si el usuario actual tiene reserva
            checkMyReservation(parseInt(id!));
        } catch (error) {
            console.error('Error fetching class:', error);
            toast.error('Error al cargar la clase');
            navigate('/classes');
        } finally {
            setLoading(false);
        }
    };

    const fetchMembershipStatus = async () => {
        try {
            const data = await membershipService.getMyMemberships();
            const membershipList = Array.isArray(data) ? data : [];
            const active = membershipList.find((m: any) => m.status === 'active');
            setActiveMembership(active || null);
        } catch (error) {
            console.error('Error fetching memberships:', error);
        }
    };

    const checkMyReservation = async (classId: number) => {
        try {
            const myRes = await reservationService.getMyReservations();
            const found = myRes.find((r: Reservation) => r.gym_class === classId && r.status === 'confirmed');
            setMyReservation(found || null);
        } catch (error) {
            console.error('Error checking my reservation:', error);
        }
    };

    const handleReserve = async () => {
        if (!gymClass) return;

        if (!activeMembership && !isStaffOrAdmin) {
            toast.error('Necesitas una membresía activa para reservar');
            return;
        }

        try {
            await reservationService.create(gymClass.id);
            toast.success('¡Reserva confirmada!');
            fetchClassData();
        } catch (error: any) {
            console.error('Error al reservar:', error);
            const errorMessage = error.response?.data?.detail || 
                                error.response?.data?.non_field_errors?.[0] ||
                                'Error al reservar';
            toast.error(errorMessage);
        }
    };

    const handleCancelReservation = async (reservationId: number | undefined) => {
        const idToCancel = reservationId || myReservation?.id;
        if (!idToCancel) return;

        if (!confirm('¿Estás seguro de cancelar esta reserva?')) return;

        try {
            await reservationService.cancel(idToCancel);
            toast.success('Reserva cancelada');
            setMyReservation(null);
            fetchClassData();
        } catch (error) {
            toast.error('Error al cancelar reserva');
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
            </div>
        );
    }

    if (!gymClass) return null;

    const spotsColor = gymClass.available_spots === 0
        ? 'text-red-400'
        : gymClass.available_spots <= 3
            ? 'text-yellow-400'
            : 'text-emerald-400';

    const classDate = new Date(gymClass.start_datetime);
    const endDate = new Date(gymClass.end_datetime);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <button
                    onClick={() => navigate('/classes')}
                    className="p-2 hover:bg-zinc-800 rounded-lg transition-colors"
                >
                    <ArrowLeft className="w-5 h-5 text-gray-400" />
                </button>
                <div className="flex-1">
                    <div className="flex items-center gap-3">
                        <h1 className="text-2xl font-bold text-white">{gymClass.title}</h1>
                        <span
                            className="px-3 py-1 text-xs font-bold rounded-full text-white"
                            style={{ backgroundColor: gymClass.color }}
                        >
                            {gymClass.class_type_name}
                        </span>
                    </div>
                    <p className="text-slate-500 mt-1">Detalles de la clase</p>
                </div>
                {isStaffOrAdmin && (
                    <button
                        onClick={() => navigate(`/classes/${id}/edit`)}
                        className="flex items-center gap-2 px-4 py-2 bg-zinc-800 text-white font-medium rounded-xl hover:bg-zinc-700 transition-colors"
                    >
                        <Edit className="w-4 h-4" />
                        Editar
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Info */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-6">
                        <h2 className="text-lg font-semibold text-white mb-4">Información</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <Calendar className="w-5 h-5 text-orange-500 mt-0.5" />
                                    <div>
                                        <p className="text-sm text-gray-400">Fecha</p>
                                        <p className="font-medium text-white capitalize">
                                            {classDate.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <Clock className="w-5 h-5 text-orange-500 mt-0.5" />
                                    <div>
                                        <p className="text-sm text-gray-400">Horario</p>
                                        <p className="font-medium text-white">
                                            {classDate.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })} - {endDate.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <User className="w-5 h-5 text-orange-500 mt-0.5" />
                                    <div>
                                        <p className="text-sm text-gray-400">Instructor</p>
                                        <p className="font-medium text-white">{gymClass.instructor_name || 'Sin asignar'}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <MapPin className="w-5 h-5 text-orange-500 mt-0.5" />
                                    <div>
                                        <p className="text-sm text-gray-400">Ubicación</p>
                                        <p className="font-medium text-white">{gymClass.location || 'Sala Principal'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {gymClass.description && (
                            <div className="mt-6 pt-6 border-t border-zinc-800">
                                <p className="text-sm text-gray-400 uppercase font-bold mb-2">Descripción</p>
                                <p className="text-gray-300 leading-relaxed">{gymClass.description}</p>
                            </div>
                        )}
                    </div>

                    {/* Participants List (Staff Only) */}
                    {(isStaffOrAdmin || isTrainer) && (
                        <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                                    <Users className="w-5 h-5 text-gray-400" />
                                    Participantes ({reservations.length})
                                </h2>
                            </div>

                            {reservations.length === 0 ? (
                                <p className="text-gray-500 text-center py-4">No hay inscritos aún.</p>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left">
                                        <thead className="text-xs text-gray-400 uppercase border-b border-zinc-800">
                                            <tr>
                                                <th className="px-4 py-3">Nombre</th>
                                                <th className="px-4 py-3">Estado</th>
                                                <th className="px-4 py-3 text-right">Acciones</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-zinc-800">
                                            {reservations.map((res) => (
                                                <tr key={res.id} className="hover:bg-zinc-800/50">
                                                    <td className="px-4 py-3 font-medium text-white">
                                                        {res.member_name}
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${res.status === 'confirmed' ? 'bg-green-900/30 text-green-400' :
                                                            res.status === 'waitlist' ? 'bg-yellow-900/30 text-yellow-400' :
                                                                'bg-red-900/30 text-red-400'
                                                            }`}>
                                                            {res.status_display}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-3 text-right">
                                                        {res.status !== 'cancelled' && (
                                                            <button
                                                                onClick={() => handleCancelReservation(res.id)}
                                                                className="text-red-400 hover:text-red-300 p-1 rounded hover:bg-red-900/20"
                                                                title="Cancelar reserva"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Action Panel */}
                <div className="lg:col-span-1">
                    <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-6 sticky top-6">
                        <h3 className="text-lg font-semibold text-white mb-4">Estado de la Clase</h3>

                        <div className="flex items-center justify-between mb-4 pb-4 border-b border-zinc-800">
                            <span className="text-gray-400">Cupos disponibles</span>
                            <span className={`text-xl font-bold ${spotsColor}`}>
                                {gymClass.available_spots} / {gymClass.capacity}
                            </span>
                        </div>

                        {gymClass.is_cancelled ? (
                            <div className="p-4 bg-red-900/20 border border-red-500/30 rounded-xl text-center">
                                <p className="text-red-400 font-bold">Clase Cancelada</p>
                                {gymClass.cancellation_reason && (
                                    <p className="text-sm text-red-400/80 mt-1">{gymClass.cancellation_reason}</p>
                                )}
                            </div>
                        ) : isStaffOrAdmin ? (
                            <div className="p-4 bg-zinc-800 rounded-xl text-center border border-zinc-700">
                                <p className="text-gray-300 font-medium mb-2">Modo Administrador</p>
                                <p className="text-xs text-gray-500">
                                    Como administrador gestionas la clase, no te inscribes.
                                </p>
                                <p className="text-xs text-gray-500 mt-2 border-t border-zinc-700 pt-2">
                                    * Cupos Disponibles = Capacidad Total - Reservas Confirmadas
                                </p>
                            </div>
                        ) : myReservation ? (
                            <div className="space-y-3">
                                <div className="p-3 bg-green-900/20 border border-green-500/30 rounded-xl flex items-center gap-3">
                                    <CheckCircle className="w-5 h-5 text-green-500" />
                                    <div>
                                        <p className="font-bold text-green-400">¡Ya estás inscrito!</p>
                                        <p className="text-xs text-green-400/80">Te esperamos en la clase.</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleCancelReservation(undefined)}
                                    className="w-full py-3 bg-zinc-800 hover:bg-zinc-700 text-gray-300 rounded-xl font-medium transition-colors"
                                >
                                    Cancelar mi reserva
                                </button>
                            </div>
                        ) : gymClass.is_full ? (
                            <button
                                // Logic for waitlist could go here
                                onClick={handleReserve}
                                className="w-full py-3 bg-yellow-600 hover:bg-yellow-700 text-white rounded-xl font-bold shadow-lg shadow-yellow-600/20 transition-all"
                            >
                                Unirse a Lista de Espera
                            </button>
                        ) : (
                            <button
                                onClick={handleReserve}
                                className="w-full py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-xl font-bold shadow-lg shadow-orange-500/20 transition-all flex items-center justify-center gap-2"
                            >
                                <CheckCircle className="w-5 h-5" />
                                Reservar Cupo
                            </button>
                        )}

                        {!activeMembership && !isStaffOrAdmin && (
                            <div className="mt-4 flex items-start gap-2 p-3 bg-amber-900/10 rounded-lg">
                                <AlertCircle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                                <p className="text-xs text-amber-500/80">
                                    Necesitas una membresía activa para inscribirte a esta clase.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
