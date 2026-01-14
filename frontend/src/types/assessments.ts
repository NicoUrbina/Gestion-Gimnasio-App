/**
 * Types para Evaluaciones Físicas y Metas
 */

export interface FitnessAssessment {
  id: number;
  member: number;
  member_name: string;
  assessed_by: number | null;
  trainer_name: string | null;
  
  // Workflow
  status: 'pending' | 'scheduled' | 'completed' | 'cancelled';
  requested_at: string;
  scheduled_for: string | null;
  completed_at: string | null;
  assessment_date: string;
  
  // Información del cliente
  personal_goals: string;
  medical_notes: string;
  
  // Medidas corporales
  weight: number | null;
  height: number | null;
  bmi: number | null;
  body_fat_percentage: number | null;
  muscle_mass: number | null;
  
  // Circunferencias
  chest: number | null;
  waist: number | null;
  hips: number | null;
  biceps: number | null;
  thigh: number | null;
  
  // Performance
  resting_heart_rate: number | null;
  blood_pressure_systolic: number | null;
  blood_pressure_diastolic: number | null;
  
  // Tests de fuerza
  bench_press_max: number | null;
  squat_max: number | null;
  deadlift_max: number | null;
  
  // Tests de resistencia
  pushups_count: number | null;
  situps_count: number | null;
  plank_duration_seconds: number | null;
  
  // Cardio
  vo2_max: number | null;
  run_time_1km: string | null;
  
  // Flexibilidad
  sit_and_reach: number | null;
  
  // Nivel fitness
  fitness_level: 'beginner' | 'intermediate' | 'advanced' | 'athlete' | null;
  cardio_level: number | null;
  strength_level: number | null;
  flexibility_level: number | null;
  
  // Notas
  observations: string;
  recommendations: string;
  
  created_at: string;
  updated_at: string;
}

export interface AssessmentRequest {
  personal_goals: string;
  medical_notes: string;
}

export interface AssessmentSchedule {
  scheduled_for: string;
  trainer_id: number;
}

export interface Goal {
  id: number;
  member: number;
  member_name: string;
  goal_type: 'weight_loss' | 'weight_gain' | 'muscle_gain' | 'endurance' | 'strength' | 'flexibility' | 'health' | 'custom';
  title: string;
  description: string;
  target_value: number | null;
  current_value: number | null;
  unit: string;
  start_date: string;
  target_date: string | null;
  status: 'active' | 'achieved' | 'abandoned';
  achieved_date: string | null;
  progress_percentage: number;
  created_at: string;
  updated_at: string;
}

export interface NutritionPlan {
  id: number;
  member: number;
  member_name: string;
  created_by: number | null;
  created_by_name: string | null;
  name: string;
  description: string;
  daily_calories: number | null;
  protein_grams: number | null;
  carbs_grams: number | null;
  fat_grams: number | null;
  meals_per_day: number;
  meal_details: any;
  restrictions: string;
  start_date: string;
  end_date: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}
