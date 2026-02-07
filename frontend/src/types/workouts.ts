/**
 * Types para Rutinas y Ejercicios
 */

// Enums
export enum Difficulty {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced'
}

export enum DayOfWeek {
  MONDAY = 1,
  TUESDAY = 2,
  WEDNESDAY = 3,
  THURSDAY = 4,
  FRIDAY = 5,
  SATURDAY = 6,
  SUNDAY = 7
}

export const DAY_NAMES: Record<DayOfWeek, string> = {
  [DayOfWeek.MONDAY]: 'Lunes',
  [DayOfWeek.TUESDAY]: 'Martes',
  [DayOfWeek.WEDNESDAY]: 'Miércoles',
  [DayOfWeek.THURSDAY]: 'Jueves',
  [DayOfWeek.FRIDAY]: 'Viernes',
  [DayOfWeek.SATURDAY]: 'Sábado',
  [DayOfWeek.SUNDAY]: 'Domingo'
};

export interface MuscleGroup {
  id: number;
  name: string;
  description: string;
}

export interface Exercise {
  id: number;
  name: string;
  description: string;
  muscle_group: number;
  muscle_group_name: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  equipment_needed: string;
  video_url: string;
  image_url: string;
  instructions: string;
  is_active: boolean;
  created_by: number | null;
  created_by_name: string | null;
  created_at: string;
  updated_at: string;
}

export interface RoutineExercise {
  id: number;
  routine: number;
  exercise: number;
  exercise_name: string;
  exercise_detail: Exercise;
  muscle_group: string;
  day_of_week: number;
  day_name: string;
  order: number;
  sets: number;
  reps: number;
  rest_seconds: number;
  weight_kg: number | null;
  notes: string;
}

export interface RoutineExerciseCreate {
  exercise: number;
  day_of_week: number;
  order: number;
  sets: number;
  reps: number;
  rest_seconds: number;
  weight_kg?: number | null;
  notes?: string;
}

export interface WorkoutRoutine {
  id: number;
  member: number;
  member_name: string;
  member_email: string;
  trainer: number;
  trainer_name: string;
  name: string;
  description: string;
  goal: string;
  duration_weeks: number;
  is_active: boolean;
  exercises: RoutineExercise[];
  exercise_count: number;
  notified_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface WorkoutRoutineCreate {
  member: number;
  trainer?: number;
  name: string;
  description: string;
  goal: string;
  duration_weeks: number;
  is_active: boolean;
  exercises: RoutineExerciseCreate[];
}

export interface WorkoutSession {
  id: number;
  member: number;
  member_name: string;
  routine: number;
  routine_name: string;
  date: string;
  day_of_week: number;
  day_name: string;
  duration_minutes: number | null;
  notes: string;
  completed: boolean;
  exercise_logs: ExerciseLog[];
  completed_exercises_count: number;
  total_exercises_count: number;
}

export interface WorkoutSessionCreate {
  member: number;
  routine: number;
  day_of_week: number;
  notes?: string;
}

export interface ExerciseLog {
  id: number;
  session: number;
  routine_exercise: number;
  exercise: number;
  exercise_name: string;
  muscle_group: string;
  planned_sets: number;
  planned_reps: number;
  actual_sets: number;
  actual_reps: number;
  weight_used: number | null;
  difficulty_rating: number;
  notes: string;
  completed_at: string;
  avg_reps_per_set: number;
}

export interface ExerciseLogCreate {
  session: number;
  routine_exercise: number;
  exercise: number;
  planned_sets: number;
  planned_reps: number;
  actual_sets: number;
  actual_reps: number;
  weight_used?: number | null;
  difficulty_rating: number;
  notes?: string;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface ExerciseFilters {
  muscle_group?: number;
  difficulty?: Difficulty;
  search?: string;
}
