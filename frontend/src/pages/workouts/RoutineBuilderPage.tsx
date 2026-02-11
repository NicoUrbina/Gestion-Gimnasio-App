import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Plus, Save, Trash2, Target, Dumbbell } from 'lucide-react';
import workoutsService from '../../services/workoutsService';
import api from '../../services/api';
import type { Exercise, MuscleGroup, WorkoutRoutineCreate, RoutineExerciseCreate } from '../../types/workouts';
import toast from 'react-hot-toast';
import Spinner from '../../components/Spinner';

const WEEKDAYS = [
  { value: 1, label: 'Lunes' },
  { value: 2, label: 'Martes' },
  { value: 3, label: 'Miércoles' },
  { value: 4, label: 'Jueves' },
  { value: 5, label: 'Viernes' },
  { value: 6, label: 'Sábado' },
  { value: 7, label: 'Domingo' },
];

interface Member {
  id: number;
  user: number;
  full_name: string;
}

export default function RoutineBuilderPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditMode = Boolean(id);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Data sources
  const [members, setMembers] = useState<Member[]>([]);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [muscleGroups, setMuscleGroups] = useState<MuscleGroup[]>([]);

  // Form state
  const [selectedMember, setSelectedMember] = useState<number | null>(null);
  const [routineName, setRoutineName] = useState('');
  const [description, setDescription] = useState('');
  const [goal, setGoal] = useState('');
  const [durationWeeks, setDurationWeeks] = useState(4);
  const [selectedDay, setSelectedDay] = useState(1);

  // Routine exercises organized by day
  const [routineExercises, setRoutineExercises] = useState<{ [key: number]: RoutineExerciseCreate[] }>({
    1: [], 2: [], 3: [], 4: [], 5: [], 6: [], 7: []
  });

  // Exercise selector
  const [showExerciseSelector, setShowExerciseSelector] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMuscleGroup, setFilterMuscleGroup] = useState<number | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (isEditMode && id) {
      loadRoutineData(parseInt(id));
    }
  }, [id, isEditMode]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [membersRes, exercisesData, muscleGroupsData] = await Promise.all([
        api.get('/members/'),
        workoutsService.getExercises(),
        workoutsService.getMuscleGroups(),
      ]);

      // Handle paginated response for members
      const membersArray = membersRes.data.results || membersRes.data;
      setMembers(membersArray.map((m: any) => ({
        id: m.id,
        user: m.user,
        full_name: m.full_name || 'Sin nombre'
      })));
      setExercises(exercisesData.results);
      setMuscleGroups(muscleGroupsData);
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Error al cargar datos');
    } finally {
      setLoading(false);
    }
  };

  const loadRoutineData = async (routineId: number) => {
    try {
      const routine = await workoutsService.getRoutineById(routineId);

      // Populate form fields
      setSelectedMember(routine.member);
      setRoutineName(routine.name);
      setDescription(routine.description);
      setGoal(routine.goal);
      setDurationWeeks(routine.duration_weeks);

      // Organize exercises by day
      const exercisesByDay: { [key: number]: RoutineExerciseCreate[] } = {
        1: [], 2: [], 3: [], 4: [], 5: [], 6: [], 7: []
      };

      routine.exercises.forEach((ex: any) => {
        console.log('Loading exercise:', ex); // Debug log
        const dayExercises = exercisesByDay[ex.day_of_week] || [];

        // Extract exercise ID from the correct field
        // Backend sends: { exercise_detail: { id: X }, ... }
        let exerciseId: number | undefined;

        if (ex.exercise_detail && ex.exercise_detail.id) {
          // From detailed response
          exerciseId = ex.exercise_detail.id;
        } else if (ex.exercise) {
          // From nested object or direct ID
          exerciseId = typeof ex.exercise === 'object' ? ex.exercise.id : ex.exercise;
        }

        console.log(`  → Extracted exercise ID: ${exerciseId}`);

        if (!exerciseId) {
          console.error('❌ CRITICAL: Exercise without ID!', ex);
          return; // Skip this exercise
        }

        dayExercises.push({
          exercise: exerciseId,  // ✅ Always include exercise ID
          day_of_week: ex.day_of_week,
          order: ex.order,
          sets: ex.sets,
          reps: ex.reps,
          rest_seconds: ex.rest_seconds,
          weight_kg: ex.weight_kg,
          notes: ex.notes || ''
        });
        exercisesByDay[ex.day_of_week] = dayExercises;
      });

      console.log('📦 Final exercisesByDay state:', exercisesByDay);
      setRoutineExercises(exercisesByDay);
      toast.success('Rutina cargada');
    } catch (error) {
      console.error('❌ Error loading routine:', error);
      toast.error('Error al cargar rutina');
      navigate('/workouts/routines');
    }
  };

  const addExerciseToDay = (exercise: Exercise) => {
    console.log('➕ Adding exercise to day', selectedDay, ':', exercise);
    const dayExercises = routineExercises[selectedDay];
    const newExercise: RoutineExerciseCreate = {
      exercise: exercise.id,
      day_of_week: selectedDay,
      order: dayExercises.length,
      sets: 3,
      reps: 12,
      rest_seconds: 60,
      weight_kg: null,
      notes: '',
    };
    console.log('➕ New exercise object:', newExercise);

    const updatedDayExercises = [...dayExercises, newExercise];
    console.log('➕ Updated day exercises:', updatedDayExercises);

    setRoutineExercises({
      ...routineExercises,
      [selectedDay]: updatedDayExercises
    });

    setShowExerciseSelector(false);
    setSearchTerm('');
    toast.success(`${exercise.name} agregado`);
  };

  const removeExercise = (day: number, index: number) => {
    console.log(`🗑️ Removing exercise [day=${day}, idx=${index}]`);
    console.log('🗑️ Before:', routineExercises[day]);
    const dayExercises = routineExercises[day].filter((_, i) => i !== index);
    // Reorder
    const reordered = dayExercises.map((ex, i) => ({ ...ex, order: i }));
    console.log('🗑️ After reorder:', reordered);
    setRoutineExercises({
      ...routineExercises,
      [day]: reordered
    });
  };

  const updateExercise = (day: number, index: number, field: string, value: any) => {
    console.log(`✏️ Updating exercise [day=${day}, idx=${index}, field=${field}, value=${value}]`);
    const dayExercises = [...routineExercises[day]];
    console.log('✏️ Before update:', dayExercises[index]);
    dayExercises[index] = { ...dayExercises[index], [field]: value };
    console.log('✏️ After update:', dayExercises[index]);
    setRoutineExercises({
      ...routineExercises,
      [day]: dayExercises
    });
  };

  const handleSave = async () => {
    // Validation
    if (!selectedMember) {
      toast.error('Selecciona un miembro');
      return;
    }
    if (!routineName.trim()) {
      toast.error('Ingresa un nombre para la rutina');
      return;
    }
    if (!goal.trim()) {
      toast.error('Define el objetivo de la rutina');
      return;
    }

    // Flatten all exercises
    const allExercises: RoutineExerciseCreate[] = [];
    Object.values(routineExercises).forEach(dayExercises => {
      allExercises.push(...dayExercises);
    });

    if (allExercises.length === 0) {
      toast.error('Agrega al menos un ejercicio');
      return;
    }

    // ✅ VALIDATE: Ensure all exercises have exercise IDs
    console.log('All exercises before validation:', allExercises);
    const invalidExercises = allExercises.filter(ex => !ex.exercise);
    if (invalidExercises.length > 0) {
      console.error('❌ Exercises missing exercise ID:', invalidExercises);
      toast.error('Error: Algunos ejercicios están corruptos. Recarga la página.');
      return;
    }
    console.log('✅ All exercises have IDs');

    const routineData: WorkoutRoutineCreate = {
      member: selectedMember,
      name: routineName,
      description: description,
      goal: goal,
      duration_weeks: durationWeeks,
      is_active: false,  // ✅ Changed to false by default to avoid conflicts
      exercises: allExercises,
    };

    try {
      setSaving(true);

      console.log('=== SAVING ROUTINE ===');
      console.log('Is Edit Mode:', isEditMode);
      console.log('Routine ID:', id);
      console.log('Payload:', JSON.stringify(routineData, null, 2));

      if (isEditMode && id) {
        await workoutsService.updateRoutine(parseInt(id), routineData);
        toast.success('Rutina actualizada exitosamente');
      } else {
        await workoutsService.createRoutine(routineData);
        toast.success('Rutina creada exitosamente');
      }
      navigate('/workouts/routines');
    } catch (error: any) {
      console.error('Error saving routine:', error);
      console.error('Error response:', error.response?.data);
      toast.error(error.response?.data?.detail || `Error al ${isEditMode ? 'actualizar' : 'crear'} rutina`);
    } finally {
      setSaving(false);
    }
  };

  const filteredExercises = exercises.filter(ex => {
    const matchesSearch = ex.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGroup = !filterMuscleGroup || ex.muscle_group === filterMuscleGroup;
    return matchesSearch && matchesGroup;
  });

  const getExerciseName = (exerciseId: number) => {
    return exercises.find(e => e.id === exerciseId)?.name || 'Ejercicio';
  };

  const getTotalExercises = () => {
    return Object.values(routineExercises).reduce((sum, day) => sum + day.length, 0);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-black text-white uppercase tracking-tight flex items-center gap-3">
          <Dumbbell className="w-7 h-7 text-orange-500" />
          {isEditMode ? 'Editar Rutina' : 'Crear Rutina Personalizada'}
        </h1>
        <p className="text-gray-500 mt-1">{isEditMode ? 'Modifica el plan de entrenamiento' : 'Diseña un plan de entrenamiento para un miembro'}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Routine Info */}
        <div className="lg:col-span-1 space-y-6">
          {/* Basic Info */}
          <div className="bg-zinc-900 rounded-2xl border-2 border-zinc-800 p-6">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-orange-500" />
              Información General
            </h2>

            <div className="space-y-4">
              {/* Member */}
              <div>
                <label className="block text-sm font-bold text-white mb-2">
                  Miembro *
                </label>
                <select
                  value={selectedMember || ''}
                  onChange={(e) => setSelectedMember(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-zinc-800 text-white border-2 border-zinc-700 rounded-xl focus:outline-none focus:border-orange-500"
                  required
                >
                  <option value="">Seleccionar miembro...</option>
                  {members.map(member => (
                    <option key={member.id} value={member.id}>
                      {member.full_name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Name */}
              <div>
                <label className="block text-sm font-bold text-white mb-2">
                  Nombre de la Rutina *
                </label>
                <input
                  type="text"
                  value={routineName}
                  onChange={(e) => setRoutineName(e.target.value)}
                  placeholder="Ej: Rutina Principiante Full Body"
                  className="w-full px-3 py-2 bg-zinc-800 text-white border-2 border-zinc-700 rounded-xl focus:outline-none focus:border-orange-500 placeholder-gray-500"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-bold text-white mb-2">
                  Descripción
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Descripción breve de la rutina..."
                  rows={3}
                  className="w-full px-3 py-2 bg-zinc-800 text-white border-2 border-zinc-700 rounded-xl focus:outline-none focus:border-orange-500 resize-none placeholder-gray-500"
                />
              </div>

              {/* Goal */}
              <div>
                <label className="block text-sm font-bold text-white mb-2">
                  Objetivo *
                </label>
                <textarea
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  placeholder="Ej: Desarrollar fuerza y resistencia muscular..."
                  rows={3}
                  className="w-full px-3 py-2 bg-zinc-800 text-white border-2 border-zinc-700 rounded-xl focus:outline-none focus:border-orange-500 resize-none placeholder-gray-500"
                  required
                />
              </div>

              {/* Duration */}
              <div>
                <label className="block text-sm font-bold text-white mb-2">
                  Duración (semanas) *
                </label>
                <input
                  type="number"
                  min="1"
                  max="52"
                  value={durationWeeks}
                  onChange={(e) => setDurationWeeks(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-zinc-800 text-white border-2 border-zinc-700 rounded-xl focus:outline-none focus:border-orange-500"
                  required
                />
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 text-white shadow-lg shadow-orange-500/30">
            <h3 className="font-bold mb-4">Resumen</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="opacity-90">Total ejercicios:</span>
                <span className="font-black">{getTotalExercises()}</span>
              </div>
              <div className="flex justify-between">
                <span className="opacity-90">Días activos:</span>
                <span className="font-black">
                  {Object.values(routineExercises).filter(d => d.length > 0).length}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Exercise Builder */}
        <div className="lg:col-span-2 space-y-4">
          {/* Day Selector */}
          <div className="bg-zinc-900 rounded-2xl border-2 border-zinc-800 p-4">
            <div className="flex items-center gap-2 overflow-x-auto" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              {WEEKDAYS.map(({ value, label }) => {
                const dayExercises = routineExercises[value];
                const isSelected = selectedDay === value;

                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setSelectedDay(value)}
                    className={`px-4 py-2 rounded-xl font-medium whitespace-nowrap transition-all ${isSelected
                      ? 'bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/30'
                      : 'bg-zinc-800 text-gray-300 hover:bg-zinc-700 border-2 border-zinc-700'
                      }`}
                  >
                    {label}
                    {dayExercises.length > 0 && (
                      <span className="ml-2 text-xs opacity-75">
                        ({dayExercises.length})
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Exercises for Selected Day */}
          <div className="bg-zinc-900 rounded-2xl border-2 border-zinc-800 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-white">
                Ejercicios - {WEEKDAYS.find(d => d.value === selectedDay)?.label}
              </h2>
              <button
                type="button"
                onClick={() => setShowExerciseSelector(true)}
                className="px-4 py-2 bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-xl font-bold hover:shadow-lg hover:shadow-orange-500/30 transition-all flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Agregar Ejercicio
              </button>
            </div>

            {routineExercises[selectedDay].length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <Dumbbell className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No hay ejercicios para este día</p>
                <p className="text-sm mt-1">Haz clic en "Agregar Ejercicio" para comenzar</p>
              </div>
            ) : (
              <div className="space-y-3">
                {routineExercises[selectedDay].map((ex, index) => (
                  <div
                    key={index}
                    className="bg-zinc-800/50 rounded-xl p-4 border-2 border-zinc-700"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center text-white font-black text-sm">
                          {index + 1}
                        </div>
                        <div>
                          <h4 className="font-bold text-white">{getExerciseName(ex.exercise)}</h4>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeExercise(selectedDay, index)}
                        className="text-red-600 hover:text-red-700 p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Series</label>
                        <input
                          type="number"
                          min="1"
                          value={ex.sets}
                          onChange={(e) => updateExercise(selectedDay, index, 'sets', Number(e.target.value))}
                          className="w-full px-2 py-1.5 bg-zinc-800 text-white border border-zinc-700 rounded-lg text-sm focus:outline-none focus:border-orange-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Reps</label>
                        <input
                          type="number"
                          min="1"
                          value={ex.reps}
                          onChange={(e) => updateExercise(selectedDay, index, 'reps', Number(e.target.value))}
                          className="w-full px-2 py-1.5 bg-zinc-800 text-white border border-zinc-700 rounded-lg text-sm focus:outline-none focus:border-orange-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Descanso (s)</label>
                        <input
                          type="number"
                          min="0"
                          value={ex.rest_seconds}
                          onChange={(e) => updateExercise(selectedDay, index, 'rest_seconds', Number(e.target.value))}
                          className="w-full px-2 py-1.5 bg-zinc-800 text-white border border-zinc-700 rounded-lg text-sm focus:outline-none focus:border-orange-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Peso (kg)</label>
                        <input
                          type="number"
                          step="0.5"
                          value={ex.weight_kg || ''}
                          onChange={(e) => updateExercise(selectedDay, index, 'weight_kg', e.target.value ? Number(e.target.value) : null)}
                          className="w-full px-2 py-1.5 bg-zinc-800 text-white border border-zinc-700 rounded-lg text-sm focus:outline-none focus:border-orange-500 placeholder-gray-500"
                          placeholder="Opcional"
                        />
                      </div>
                    </div>

                    <div className="mt-3">
                      <label className="block text-xs text-gray-600 mb-1">Notas</label>
                      <input
                        type="text"
                        value={ex.notes || ''}
                        onChange={(e) => updateExercise(selectedDay, index, 'notes', e.target.value)}
                        placeholder="Notas para el cliente..."
                        className="w-full px-2 py-1.5 bg-zinc-800 text-white border border-zinc-700 rounded-lg text-sm focus:outline-none focus:border-orange-500 placeholder-gray-500"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex-1 px-6 py-3 border-2 border-zinc-700 rounded-xl font-bold text-white hover:bg-zinc-800/50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="flex-1 px-6 py-3 bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl font-bold hover:shadow-lg hover:shadow-green-500/30 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Save className="w-5 h-5" />
              {saving ? 'Guardando...' : 'Guardar Rutina'}
            </button>
          </div>
        </div>
      </div>

      {/* Exercise Selector Modal */}
      {showExerciseSelector && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-zinc-900 rounded-2xl max-w-4xl w-full max-h-[80vh] overflow-hidden">
            {/* Modal Header */}
            <div className="p-6 border-b-2 border-zinc-800">
              <h3 className="text-xl font-bold text-white">Seleccionar Ejercicio</h3>

              {/* Filters */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                <input
                  type="text"
                  placeholder="Buscar ejercicio..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="px-3 py-2 bg-zinc-800 text-white border-2 border-zinc-700 rounded-xl focus:outline-none focus:border-orange-500 placeholder-gray-500"
                />
                <select
                  value={filterMuscleGroup || ''}
                  onChange={(e) => setFilterMuscleGroup(e.target.value ? Number(e.target.value) : null)}
                  className="px-3 py-2 bg-zinc-800 text-white border-2 border-zinc-700 rounded-xl focus:outline-none focus:border-orange-500"
                >
                  <option value="">Todos los grupos</option>
                  {muscleGroups.map(mg => (
                    <option key={mg.id} value={mg.id}>{mg.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Exercise List */}
            <div className="p-6 overflow-y-auto max-h-[50vh]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {filteredExercises.map(exercise => (
                  <button
                    key={exercise.id}
                    type="button"
                    onClick={() => addExerciseToDay(exercise)}
                    className="bg-zinc-800/50 hover:bg-orange-500/10 border-2 border-zinc-700 hover:border-orange-500 rounded-xl p-4 text-left transition-all"
                  >
                    <h4 className="font-bold text-white mb-1">{exercise.name}</h4>
                    <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-lg font-medium">
                      {exercise.muscle_group_name}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="p-6 border-t-2 border-gray-100">
              <button
                type="button"
                onClick={() => {
                  setShowExerciseSelector(false);
                  setSearchTerm('');
                  setFilterMuscleGroup(null);
                }}
                className="w-full px-6 py-3 border-2 border-zinc-700 rounded-xl font-bold text-white hover:bg-zinc-800/50 transition-colors"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
