import { useEffect, useState } from 'react';
import { Search, Dumbbell } from 'lucide-react';
import { workoutService } from '../../services/workouts';
import type { Exercise, MuscleGroup } from '../../types/workouts';
import Spinner from '../../components/Spinner';

export default function ExerciseLibraryPage() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [muscleGroups, setMuscleGroups] = useState<MuscleGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState<number | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, [selectedMuscleGroup, selectedDifficulty]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [exercisesData, muscleGroupsData] = await Promise.all([
        workoutService.getExercises({
          muscle_group: selectedMuscleGroup || undefined,
          difficulty: selectedDifficulty || undefined,
        }),
        workoutService.getMuscleGroups(),
      ]);
      setExercises(exercisesData);
      setMuscleGroups(muscleGroupsData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredExercises = exercises.filter(ex =>
    ex.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ex.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getDifficultyLabel = (difficulty: string) => {
    const map = {
      beginner: 'Principiante',
      intermediate: 'Intermedio',
      advanced: 'Avanzado',
    };
    return map[difficulty as keyof typeof map] || difficulty;
  };

  const getDifficultyColor = (difficulty: string) => {
    const map = {
      beginner: 'bg-green-100 text-green-700',
      intermediate: 'bg-blue-100 text-blue-700',
      advanced: 'bg-red-100 text-red-700',
    };
    return map[difficulty as keyof typeof map] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-black text-white uppercase tracking-tight flex items-center gap-3">
          <Dumbbell className="w-7 h-7 text-orange-500" />
          Biblioteca de Ejercicios
        </h1>
        <p className="text-gray-500 mt-1">Explora todos los ejercicios disponibles</p>
      </div>

      {/* Filters */}
      <div className="bg-zinc-900 rounded-2xl border-2 border-zinc-800 p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar ejercicio..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border-2 border-zinc-700 rounded-xl focus:outline-none focus:border-orange-500"
            />
          </div>

          {/* Muscle Group Filter */}
          <select
            value={selectedMuscleGroup || ''}
            onChange={(e) => setSelectedMuscleGroup(e.target.value ? Number(e.target.value) : null)}
            className="px-4 py-2.5 border-2 border-zinc-700 rounded-xl focus:outline-none focus:border-orange-500"
          >
            <option value="">Todos los grupos musculares</option>
            {muscleGroups.map(mg => (
              <option key={mg.id} value={mg.id}>{mg.name}</option>
            ))}
          </select>

          {/* Difficulty Filter */}
          <select
            value={selectedDifficulty || ''}
            onChange={(e) => setSelectedDifficulty(e.target.value || null)}
            className="px-4 py-2.5 border-2 border-zinc-700 rounded-xl focus:outline-none focus:border-orange-500"
          >
            <option value="">Todas las dificultades</option>
            <option value="beginner">Principiante</option>
            <option value="intermediate">Intermedio</option>
            <option value="advanced">Avanzado</option>
          </select>
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-4">
        <p className="text-sm text-gray-500">
          {filteredExercises.length} ejercicio{filteredExercises.length !== 1 ? 's' : ''} encontrado{filteredExercises.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Exercise Grid */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Spinner size="lg" />
        </div>
      ) : filteredExercises.length === 0 ? (
        <div className="bg-zinc-900 rounded-2xl border-2 border-zinc-800 p-12 text-center">
          <Dumbbell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-white mb-2">No se encontraron ejercicios</h3>
          <p className="text-gray-500">Intenta ajustar los filtros de búsqueda</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredExercises.map(exercise => (
            <div
              key={exercise.id}
              className="bg-zinc-900 rounded-2xl border-2 border-zinc-800 p-5 hover:border-orange-500/50 hover:shadow-lg transition-all"
            >
              {/* Header */}
              <div className="mb-3">
                <h3 className="font-bold text-white mb-2">{exercise.name}</h3>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded-lg font-medium">
                    {exercise.muscle_group_name}
                  </span>
                  <span className={`text-xs px-2 py-1 rounded-lg font-medium ${getDifficultyColor(exercise.difficulty)}`}>
                    {getDifficultyLabel(exercise.difficulty)}
                  </span>
                </div>
              </div>

              {/* Description */}
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                {exercise.description}
              </p>

              {/* Equipment */}
              {exercise.equipment_needed && (
                <div className="bg-zinc-800/50 rounded-lg p-2 mb-3">
                  <div className="text-xs text-gray-500 uppercase font-medium mb-1">Equipo</div>
                  <div className="text-sm text-gray-700">{exercise.equipment_needed}</div>
                </div>
              )}

              {/* Video Link */}
              {exercise.video_url && (
                <a
                  href={exercise.video_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-orange-600 hover:text-orange-700 font-medium"
                >
                  Ver video demostrativo →
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
