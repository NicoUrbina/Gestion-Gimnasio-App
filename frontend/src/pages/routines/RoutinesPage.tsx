/**
 * Página de Lista de Rutinas (para Entrenadores)
 * Sistema de Gestión de Gimnasio
 */

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit, Trash2, Power, Bell, Users } from 'lucide-react';
import workoutsService from '../../services/workoutsService';
import type { WorkoutRoutine } from '../../types/workouts';

const RoutinesPage = () => {
    const [routines, setRoutines] = useState<WorkoutRoutine[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadRoutines();
    }, []);

    const loadRoutines = async () => {
        try {
            setLoading(true);
            const response = await workoutsService.getRoutines();
            setRoutines(response.results);
        } catch (err: any) {
            setError(err.response?.data?.detail || 'Error al cargar rutinas');
        } finally {
            setLoading(false);
        }
    };

    const handleActivate = async (id: number) => {
        try {
            await workoutsService.activateRoutine(id);
            loadRoutines();
        } catch (err: any) {
            alert(err.response?.data?.detail || 'Error al activar rutina');
        }
    };

    const handleNotify = async (id: number) => {
        try {
            await workoutsService.notifyMember(id);
            alert('Miembro notificado exitosamente');
            loadRoutines();
        } catch (err: any) {
            alert(err.response?.data?.message || 'Error al notificar');
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('¿Seguro que deseas eliminar esta rutina?')) return;

        try {
            await workoutsService.deleteRoutine(id);
            loadRoutines();
        } catch (err: any) {
            alert(err.response?.data?.detail || 'Error al eliminar rutina');
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-gray-400">Cargando rutinas...</div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">
                        Rutinas de Entrenamiento
                    </h1>
                    <p className="text-gray-400">
                        Gestiona las rutinas personalizadas de tus miembros
                    </p>
                </div>
                <Link
                    to="/workouts/routines/create"
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
                >
                    <Plus size={20} />
                    Nueva Rutina
                </Link>
            </div>

            {/* Error Message */}
            {error && (
                <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg mb-6">
                    {error}
                </div>
            )}

            {/* Routines Grid */}
            {routines.length === 0 ? (
                <div className="text-center py-12">
                    <Users size={64} className="mx-auto text-gray-600 mb-4" />
                    <h3 className="text-xl text-gray-400 mb-2">No hay rutinas creadas</h3>
                    <p className="text-gray-500 mb-6">
                        Crea la primera rutina para tus miembros
                    </p>
                    <Link
                        to="/workouts/routines/create"
                        className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
                    >
                        <Plus size={20} />
                        Crear Primera Rutina
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {routines.map((routine) => (
                        <div
                            key={routine.id}
                            className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-gray-600 transition-colors"
                        >
                            {/* Header */}
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex-1">
                                    <h3 className="text-xl font-semibold text-white mb-1">
                                        {routine.name}
                                    </h3>
                                    <p className="text-sm text-gray-400 flex items-center gap-1">
                                        <Users size={14} />
                                        {routine.member_name}
                                    </p>
                                </div>
                                {routine.is_active && (
                                    <span className="bg-green-500/20 text-green-500 text-xs px-2 py-1 rounded-full">
                                        Activa
                                    </span>
                                )}
                            </div>

                            {/* Details */}
                            <div className="space-y-2 mb-4">
                                <p className="text-sm text-gray-400">
                                    <span className="text-gray-500">Objetivo:</span>{' '}
                                    <span className="text-gray-300">{routine.goal}</span>
                                </p>
                                <p className="text-sm text-gray-400">
                                    <span className="text-gray-500">Duración:</span>{' '}
                                    <span className="text-gray-300">{routine.duration_weeks} semanas</span>
                                </p>
                                <p className="text-sm text-gray-400">
                                    <span className="text-gray-500">Ejercicios:</span>{' '}
                                    <span className="text-gray-300">{routine.exercise_count}</span>
                                </p>
                            </div>

                            {/* Description */}
                            <p className="text-sm text-gray-400 mb-4 line-clamp-2">
                                {routine.description}
                            </p>

                            {/* Actions */}
                            <div className="flex flex-wrap gap-2">
                                <Link
                                    to={`/workouts/routines/${routine.id}/edit`}
                                    className="flex items-center gap-1 bg-gray-700 hover:bg-gray-600 text-white px-3 py-2 rounded text-sm transition-colors"
                                >
                                    <Edit size={16} />
                                    Editar
                                </Link>

                                {!routine.is_active && (
                                    <button
                                        onClick={() => handleActivate(routine.id)}
                                        className="flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded text-sm transition-colors"
                                    >
                                        <Power size={16} />
                                        Activar
                                    </button>
                                )}

                                {routine.is_active && !routine.notified_at && (
                                    <button
                                        onClick={() => handleNotify(routine.id)}
                                        className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded text-sm transition-colors"
                                    >
                                        <Bell size={16} />
                                        Notificar
                                    </button>
                                )}

                                <button
                                    onClick={() => handleDelete(routine.id)}
                                    className="flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded text-sm transition-colors ml-auto"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>

                            {/* Notification Status */}
                            {routine.notified_at && (
                                <p className="text-xs text-gray-500 mt-3">
                                    Notificado: {new Date(routine.notified_at).toLocaleDateString()}
                                </p>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default RoutinesPage;
