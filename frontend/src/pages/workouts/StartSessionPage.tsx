/**
 * Página de Inicio de Sesión de Entrenamiento
 * Para que miembros inicien sus sesiones diarias
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Calendar, Dumbbell, CheckCircle, Clock } from 'lucide-react';
import workoutsService from '../../services/workoutsService';
import type { WorkoutRoutine, WorkoutSession } from '../../types/workouts';
import { DAY_NAMES, DayOfWeek } from '../../types/workouts';
import toast from 'react-hot-toast';
import Spinner from '../../components/Spinner';

export default function StartSessionPage() {
    const navigate = useNavigate();
    const [routine, setRoutine] = useState<WorkoutRoutine | null>(null);
    const [sessions, setSessions] = useState<WorkoutSession[]>([]);
    const [loading, setLoading] = useState(true);
    const [starting, setStarting] = useState(false);
    const [selectedDay, setSelectedDay] = useState<DayOfWeek>(1);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            const [routineData, sessionsData] = await Promise.all([
                workoutsService.getMyRoutine(),
                workoutsService.getMySessions()
            ]);

            setRoutine(routineData);
            setSessions(sessionsData);

            // Set today's day as default
            const today = new Date().getDay(); // 0 = Sunday
            setSelectedDay((today === 0 ? 7 : today) as DayOfWeek);
        } catch (error: any) {
            console.error('Error loading data:', error);
            if (error.response?.status === 404) {
                toast.error('No tienes una rutina asignada');
                navigate('/workouts/my-routine');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleStartSession = async () => {
        if (!routine) return;

        const exercisesForDay = routine.exercises.filter(ex => ex.day_of_week === selectedDay);

        if (exercisesForDay.length === 0) {
            toast.error('No hay ejercicios para este día');
            return;
        }

        try {
            setStarting(true);
            const session = await workoutsService.createSession({
                member: routine.member,
                routine: routine.id,
                day_of_week: selectedDay
            });

            toast.success('Sesión iniciada');
            navigate(`/workouts/sessions/${session.id}`);
        } catch (error: any) {
            console.error('Error starting session:', error);
            toast.error(error.response?.data?.detail || 'Error al iniciar sesión');
        } finally {
            setStarting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Spinner size="lg" />
            </div>
        );
    }

    if (!routine) {
        return null;
    }

    const todaysSessions = sessions.filter(s => {
        const sessionDate = new Date(s.date);
        const today = new Date();
        return sessionDate.toDateString() === today.toDateString();
    });

    const exercisesForSelectedDay = routine.exercises.filter(
        ex => ex.day_of_week === selectedDay
    );

    return (
        <div>
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-black text-white uppercase tracking-tight flex items-center gap-3">
                    <Play className="w-7 h-7 text-orange-500" />
                    Iniciar Entrenamiento
                </h1>
                <p className="text-gray-500 mt-1">Comienza tu sesión de hoy</p>
            </div>

            {/* Today's Completed Sessions */}
            {todaysSessions.length > 0 && (
                <div className="bg-green-500/10 border-2 border-green-500 rounded-2xl p-6 mb-6">
                    <div className="flex items-center gap-3 mb-2">
                        <CheckCircle className="w-6 h-6 text-green-500" />
                        <h3 className="font-bold text-white">Sesiones Completadas Hoy</h3>
                    </div>
                    <div className="space-y-2">
                        {todaysSessions.map(session => (
                            <div key={session.id} className="text-sm text-gray-400">
                                {session.day_name} - {session.routine_name}
                                {session.completed && (
                                    <span className="ml-2 text-green-500">✓ Completada</span>
                                )}
                                {session.duration_minutes && (
                                    <span className="ml-2 text-gray-500">
                                        ({session.duration_minutes} min)
                                    </span>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Day Selector */}
            <div className="bg-zinc-900 rounded-2xl border-2 border-zinc-800 p-4 mb-6">
                <h3 className="font-bold text-white mb-3">Selecciona el Día</h3>
                <div className="flex items-center gap-2 overflow-x-auto">
                    {([1, 2, 3, 4, 5, 6, 7] as DayOfWeek[]).map((dayNum) => {
                        const hasExercises = routine.exercises.some(ex => ex.day_of_week === dayNum);
                        const isSelected = selectedDay === dayNum;

                        return (
                            <button
                                key={dayNum}
                                onClick={() => setSelectedDay(dayNum)}
                                disabled={!hasExercises}
                                className={`px-4 py-2 rounded-xl font-medium whitespace-nowrap transition-all ${isSelected
                                    ? 'bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/30'
                                    : hasExercises
                                        ? 'bg-gray-100 text-white hover:bg-gray-200'
                                        : 'bg-zinc-800/50 text-gray-400 cursor-not-allowed'
                                    }`}
                            >
                                {DAY_NAMES[dayNum]}
                                {hasExercises && (
                                    <span className="ml-2 text-xs opacity-75">
                                        ({routine.exercises.filter(e => e.day_of_week === dayNum).length})
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Session Preview */}
            <div className="bg-zinc-900 rounded-2xl border-2 border-zinc-800 p-6 mb-6">
                <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-orange-500" />
                    Vista Previa - {DAY_NAMES[selectedDay]}
                </h3>

                {exercisesForSelectedDay.length === 0 ? (
                    <p className="text-gray-400 text-center py-8">
                        No hay ejercicios programados para este día
                    </p>
                ) : (
                    <div className="space-y-3">
                        {exercisesForSelectedDay.map((ex, index) => (
                            <div
                                key={ex.id}
                                className="bg-zinc-800/50 rounded-xl p-4 border border-zinc-700"
                            >
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center text-white font-black">
                                        {index + 1}
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-bold text-white">{ex.exercise_name}</h4>
                                        <p className="text-sm text-gray-400">
                                            {ex.sets} series x {ex.reps} reps
                                            {ex.weight_kg && ` · ${ex.weight_kg}kg`}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Start Button */}
            <button
                onClick={handleStartSession}
                disabled={starting || exercisesForSelectedDay.length === 0}
                className="w-full px-6 py-4 bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-2xl font-bold hover:shadow-lg hover:shadow-orange-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
            >
                <Play className="w-6 h-6" />
                {starting ? 'Iniciando...' : `Comenzar Entrenamiento - ${DAY_NAMES[selectedDay]}`}
            </button>

            <p className="text-center text-gray-500 text-sm mt-4">
                Se creará una nueva sesión de entrenamiento que podrás completar
            </p>
        </div>
    );
}
