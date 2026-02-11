import { useEffect, useState } from 'react';
import { Calendar, Dumbbell, Clock, Info, AlertCircle } from 'lucide-react';
import workoutsService from '../../services/workoutsService';
import type { WorkoutRoutine, RoutineExercise } from '../../types/workouts';
import Spinner from '../../components/Spinner';

const WEEKDAYS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

export default function MyRoutinePage() {
  const [routine, setRoutine] = useState<WorkoutRoutine | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState(1);

  useEffect(() => {
    loadRoutine();
  }, []);

  const loadRoutine = async () => {
    try {
      setLoading(true);
      console.log('🔍 Loading member routine...');
      const data = await workoutsService.getMyRoutine();
      console.log('✅ Routine loaded:', data);
      setRoutine(data);
    } catch (error: any) {
      console.error('❌ Error loading routine:', error);
      console.error('Error response:', error.response);
      if (error.response?.status === 404) {
        console.log('ℹ️ No routine found (404)');
        setRoutine(null);
      } else {
        console.error('Error loading routine:', error);
      }
    } finally {
      setLoading(false);
    }
  };

  const getExercisesByDay = (day: number): RoutineExercise[] => {
    if (!routine) return [];
    return routine.exercises.filter(ex => ex.day_of_week === day);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!routine) {
    return (
      <div>
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-black text-white uppercase tracking-tight">
            Mi Rutina
          </h1>
          <p className="text-gray-500 mt-1">Tu plan de entrenamiento personalizado</p>
        </div>

        {/* Empty State */}
        <div className="bg-zinc-900 rounded-2xl border-2 border-zinc-800 p-12 text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-orange-500/30">
            <Dumbbell className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">
            No tienes una rutina asignada
          </h3>
          <p className="text-gray-500 max-w-md mx-auto">
            Tu entrenador aún no te ha asignado una rutina de entrenamiento.
            Solicita una evaluación física para que puedan diseñar un plan personalizado para ti.
          </p>
        </div>
      </div>
    );
  }

  const todayExercises = getExercisesByDay(selectedDay);

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-black text-white uppercase tracking-tight flex items-center gap-3">
          <Dumbbell className="w-7 h-7 text-orange-500" />
          {routine.name}
        </h1>
        <p className="text-gray-500 mt-1">{routine.description}</p>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-zinc-900 rounded-xl border-2 border-zinc-800 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center shadow-sm">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-xs text-gray-500 uppercase tracking-wide font-medium">Duración</div>
              <div className="font-bold text-white">{routine.duration_weeks} semanas</div>
            </div>
          </div>
        </div>

        <div className="bg-zinc-900 rounded-xl border-2 border-zinc-800 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-sm">
              <Info className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-xs text-gray-500 uppercase tracking-wide font-medium">Asignado por</div>
              <div className="font-bold text-white">{routine.trainer_name || 'No asignado'}</div>
            </div>
          </div>
        </div>

        <div className="bg-zinc-900 rounded-xl border-2 border-zinc-800 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-sm">
              <Dumbbell className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-xs text-gray-500 uppercase tracking-wide font-medium">Entrenador</div>
              <div className="font-bold text-white">{routine.trainer_name}</div>
            </div>
          </div>
        </div>

        <div className="bg-zinc-900 rounded-xl border-2 border-zinc-800 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center shadow-sm">
              <Info className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-xs text-gray-500 uppercase tracking-wide font-medium">Objetivo</div>
              <div className="font-bold text-white text-sm">{routine.goal}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Day Selector */}
      <div className="bg-zinc-900 rounded-2xl border-2 border-zinc-800 p-4 mb-6">
        <div className="flex items-center gap-2 overflow-x-auto">
          {WEEKDAYS.map((day, index) => {
            const dayNum = index + 1;
            const hasExercises = getExercisesByDay(dayNum).length > 0;
            const isSelected = selectedDay === dayNum;

            return (
              <button
                key={dayNum}
                onClick={() => setSelectedDay(dayNum)}
                className={`px-4 py-2 rounded-xl font-medium whitespace-nowrap transition-all ${isSelected
                  ? 'bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/30'
                  : hasExercises
                    ? 'bg-gray-100 text-white hover:bg-gray-200'
                    : 'bg-zinc-800/50 text-gray-400 cursor-not-allowed'
                  }`}
                disabled={!hasExercises}
              >
                {day}
                {hasExercises && (
                  <span className="ml-2 text-xs opacity-75">
                    ({getExercisesByDay(dayNum).length})
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Exercises for Selected Day */}
      <div>
        <h2 className="text-lg font-bold text-white mb-4">
          Ejercicios para {WEEKDAYS[selectedDay - 1]}
        </h2>

        {todayExercises.length === 0 ? (
          <div className="bg-zinc-900 rounded-2xl border-2 border-zinc-800 p-8 text-center">
            <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No hay ejercicios programados para este día</p>
          </div>
        ) : (
          <div className="space-y-4">
            {todayExercises.map((routineEx, index) => (
              <div
                key={routineEx.id}
                className="bg-zinc-900 rounded-2xl border-2 border-zinc-800 p-5 hover:border-orange-500/50 transition-colors"
              >
                {/* Exercise Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/30 flex-shrink-0">
                      <span className="text-white font-black text-lg">{index + 1}</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-lg">
                        {routineEx.exercise_detail.name}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded-lg font-medium">
                          {routineEx.exercise_detail.muscle_group_name}
                        </span>
                        <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-lg font-medium">
                          {routineEx.exercise_detail.difficulty === 'beginner' ? 'Principiante' :
                            routineEx.exercise_detail.difficulty === 'intermediate' ? 'Intermedio' : 'Avanzado'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Exercise Details Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                  <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-3">
                    <div className="text-xs text-orange-600 uppercase font-medium mb-1">Series</div>
                    <div className="text-2xl font-black text-orange-700">{routineEx.sets}</div>
                  </div>
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-3">
                    <div className="text-xs text-blue-600 uppercase font-medium mb-1">Repeticiones</div>
                    <div className="text-2xl font-black text-blue-700">{routineEx.reps}</div>
                  </div>
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-3">
                    <div className="text-xs text-purple-600 uppercase font-medium mb-1 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Descanso
                    </div>
                    <div className="text-2xl font-black text-purple-700">{routineEx.rest_seconds}s</div>
                  </div>
                  {routineEx.weight_kg && (
                    <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-3">
                      <div className="text-xs text-green-600 uppercase font-medium mb-1">Peso</div>
                      <div className="text-2xl font-black text-green-700">{routineEx.weight_kg}kg</div>
                    </div>
                  )}
                </div>

                {/* Exercise Description */}
                {routineEx.exercise_detail.description && (
                  <div className="bg-zinc-800/50 rounded-xl p-3 mb-3">
                    <p className="text-sm text-gray-600">{routineEx.exercise_detail.description}</p>
                  </div>
                )}

                {/* Trainer Notes */}
                {routineEx.notes && (
                  <div className="bg-orange-50 border-l-4 border-orange-500 rounded-lg p-3">
                    <div className="flex items-start gap-2">
                      <Info className="w-4 h-4 text-orange-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="text-xs text-orange-600 uppercase font-medium mb-1">Nota del entrenador</div>
                        <p className="text-sm text-orange-900">{routineEx.notes}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
