/**
 * Types para Rutinas y Ejercicios
 */

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
  exercise_detail: Exercise;
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
  trainer: number;
  trainer_name: string;
  name: string;
  description: string;
  goal: string;
  duration_weeks: number;
  is_active: boolean;
  exercises: RoutineExercise[];
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
