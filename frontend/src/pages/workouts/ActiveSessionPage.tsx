/**
 * Página de Sesión Activa
 * Para marcar ejercicios como completados durante el entrenamiento
 */

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle, Clock, Save, TrendingUp } from 'lucide-react';
import workoutsService from '../../services/workoutsService';
import type { WorkoutSession, ExerciseLog, ExerciseLogCreate } from '../../types/workouts';
import toast from 'react-hot-toast';
import Spinner from '../../components/Spinner';

export default function ActiveSessionPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [session, setSession] = useState<WorkoutSession | null>(null);
    const [loading, setLoading] = useState(true);
    const [completing, setCompleting] = useState(false);

    useEffect(() => {
        if (id) {
            loadSession();
        }
    }, [id]);

    const loadSession = async () => {
        try {
            setLoading(true);
            const data = await workoutsService.getSessionById(Number(id));
            setSession(data);
        } catch (error) {
            console.error('Error loading session:', error);
            toast.error('Error al cargar sesión');
            navigate('/workouts/my-routine');
        } finally {
            setLoading(false);
        }
    };

    const handleLogExercise = async (routineExerciseId: number, exerciseId: number, plannedSets: number, plannedReps: number) => {
        const actualSets = prompt('¿Cuántas series completaste?', plannedSets.toString());
        if (!actualSets) return;

        const actualReps = prompt('¿Cuántas repeticiones en total?', (plannedSets * plannedReps).toString());
        if (!actualReps) return;

        const weight = prompt('¿Peso utilizado (kg)? Déjalo vacío si no aplica', '');
        const difficulty = prompt('Dificultad (1-5)', '3');

        const logData: ExerciseLogCreate = {
            session: Number(id),
            routine_exercise: routineExerciseId,
            exercise: exerciseId,
            planned_sets: plannedSets,
            planned_reps: plannedReps,
            actual_sets: Number(actualSets),
            actual_reps: Number(actualReps),
            weight_used: weight ? Number(weight) : null,
            difficulty_rating: Number(difficulty) || 3,
            notes: ''
        };

        try {
            await workoutsService.createExerciseLog(logData);
            toast.success('Ejercicio registrado');
            loadSession(); // Reload to get updated logs
        } catch (error: any) {
            console.error('Error logging exercise:', error);
            toast.error(error.response?.data?.detail || 'Error al registrar');
        }
    };

    const handleCompleteSession = async () => {
        if (!session) return;

        const duration = prompt('¿Duración total en minutos?', '60');
        if (!duration) return;

        try {
            setCompleting(true);
            await workoutsService.completeSession(session.id, Number(duration));
            toast.success('¡Sesión completada!');
            navigate('/workouts/my-routine');
        } catch (error: any) {
            console.error('Error completing session:', error);
            toast.error(error.response?.data?.detail || 'Error al completar sesión');
        } finally {
            setCompleting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Spinner size="lg" />
            </div>
        );
    }

    if (!session) {
        return null;
    }

    // Get routine exercises for this session's day
    const routineExercises = session.exercise_logs.length > 0
        ? session.exercise_logs
        : []; // Would need to fetch routine exercises separately

    return (
        <div>
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-black text-white uppercase tracking-tight flex items-center gap-3">
                    <Clock className="w-7 h-7 text-orange-500" />
                    Sesión en Progreso
                </h1>
                <p className="text-gray-500 mt-1">
                    {session.day_name} - {session.routine_name}
                </p>
            </div>

            {/* Progress Card */}
            <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 mb-6 text-white shadow-lg shadow-orange-500/30">
                <h3 className="font-bold mb-4">Progreso</h3>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <div className="text-sm opacity-90">Completados</div>
                        <div className="text-3xl font-black">
                            {session.completed_exercises_count}
                        </div>
                    </div>
                    <div>
                        <div className="text-sm opacity-90">Total</div>
                        <div className="text-3xl font-black">
                            {session.total_exercises_count}
                        </div>
                    </div>
                </div>
                <div className="mt-4 bg-white/20 rounded-full h-2">
                    <div
                        className="bg-white rounded-full h-2 transition-all"
                        style={{
                            width: `${(session.completed_exercises_count / session.total_exercises_count) * 100}%`
                        }}
                    />
                </div>
            </div>

            {/* Exercise List */}
            <div className="space-y-4 mb-6">
                {session.exercise_logs.map((log, index) => (
                    <div
                        key={log.id}
                        className="bg-zinc-900 rounded-2xl border-2 border-zinc-800 p-5"
                    >
                        <div className="flex items-start justify-between mb-3">
                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center text-white">
                                    <CheckCircle className="w-6 h-6" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-white">{log.exercise_name}</h4>
                                    <p className="text-sm text-gray-400">{log.muscle_group}</p>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-3">
                            <div className="bg-zinc-800/50 rounded-xl p-3">
                                <div className="text-xs text-gray-500 mb-1">Series</div>
                                <div className="font-bold text-white">{log.actual_sets}</div>
                            </div>
                            <div className="bg-zinc-800/50 rounded-xl p-3">
                                <div className="text-xs text-gray-500 mb-1">Reps</div>
                                <div className="font-bold text-white">{log.actual_reps}</div>
                            </div>
                            {log.weight_used && (
                                <div className="bg-zinc-800/50 rounded-xl p-3">
                                    <div className="text-xs text-gray-500 mb-1">Peso</div>
                                    <div className="font-bold text-white">{log.weight_used}kg</div>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Complete Session Button */}
            {!session.completed && (
                <button
                    onClick={handleCompleteSession}
                    disabled={completing}
                    className="w-full px-6 py-4 bg-gradient-to-br from-green-500 to-green-600 text-white rounded-2xl font-bold hover:shadow-lg hover:shadow-green-500/30 transition-all disabled:opacity-50 flex items-center justify-center gap-3"
                >
                    <Save className="w-6 h-6" />
                    {completing ? 'Finalizando...' : 'Finalizar Sesión'}
                </button>
            )}
        </div>
    );
}
