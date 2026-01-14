/**
 * Types para Progreso y Tracking
 */

export interface ProgressLog {
  id: number;
  member: number;
  member_name: string;
  date: string;
  weight: number | null;
  height: number | null;
  body_fat_percentage: number | null;
  muscle_mass: number | null;
  chest: number | null;
  waist: number | null;
  hips: number | null;
  notes: string;
  bmi: number | null;
  registered_by: number | null;
  created_at: string;
  updated_at: string;
}

export interface Achievement {
  id: number;
  member: number;
  member_name: string;
  achievement_type: string;
  achievement_type_display: string;
  title: string;
  description: string;
  achieved_date: string;
  icon: string;
  created_at: string;
}

export interface ExerciseLog {
  id: number;
  session: number;
  exercise: number;
  exercise_name: string;
  muscle_group: string;
  routine_exercise: number | null;
  planned_sets: number;
  planned_reps: number;
  actual_sets: number;
  actual_reps: number;
  weight_used: number;
  difficulty_rating: number | null;
  completed: boolean;
  notes: string;
}

export interface WorkoutSession {
  id: number;
  member: number;
  member_name: string;
  routine: number | null;
  routine_name: string | null;
  date: string;
  completed: boolean;
  duration_minutes: number | null;
  notes: string;
  trainer_feedback: string;
  exercise_logs: ExerciseLog[];
  created_at: string;
  updated_at: string;
}

export interface WorkoutSessionCreate {
  member?: number;
  routine?: number | null;
  date: string;
  completed: boolean;
  duration_minutes?: number | null;
  notes?: string;
  exercise_logs: ExerciseLogCreate[];
}

export interface ExerciseLogCreate {
  exercise: number;
  routine_exercise?: number | null;
  planned_sets: number;
  planned_reps: number;
  actual_sets: number;
  actual_reps: number;
  weight_used: number;
  difficulty_rating?: number | null;
  completed: boolean;
  notes?: string;
}

export interface EvolutionData {
  dates: string[];
  weight: (number | null)[];
  body_fat: (number | null)[];
  muscle_mass: (number | null)[];
  chest: (number | null)[];
  waist: (number | null)[];
  hips: (number | null)[];
  bmi: (number | null)[];
}

export interface ExerciseHistory {
  dates: string[];
  weights: number[];
  sets: number[];
  reps: number[];
  total_volume: number[];
}

export interface ProgressStats {
  total_sessions: number;
  total_workouts_completed: number;
  current_weight: number;
  weight_change: number;
  latest_bmi: number;
}
