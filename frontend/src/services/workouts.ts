/**
 * API Service para Rutinas y Ejercicios
 */

import api from './api';
import type { MuscleGroup, Exercise, WorkoutRoutine, WorkoutRoutineCreate, RoutineExercise } from '../types/workouts';

export const workoutService = {
  // Grupos Musculares
  getMuscleGroups: async (): Promise<MuscleGroup[]> => {
    const response = await api.get('/muscle-groups/');
    return response.data;
  },

  // Ejercicios
  getExercises: async (params?: { muscle_group?: number; difficulty?: string }): Promise<Exercise[]> => {
    const response = await api.get('/exercises/', { params });
    return response.data;
  },

  getExerciseById: async (id: number): Promise<Exercise> => {
    const response = await api.get(`/exercises/${id}/`);
    return response.data;
  },

  createExercise: async (data: Partial<Exercise>): Promise<Exercise> => {
    const response = await api.post('/exercises/', data);
    return response.data;
  },

  updateExercise: async (id: number, data: Partial<Exercise>): Promise<Exercise> => {
    const response = await api.patch(`/exercises/${id}/`, data);
    return response.data;
  },

  deleteExercise: async (id: number): Promise<void> => {
    await api.delete(`/exercises/${id}/`);
  },

  // Rutinas
  getRoutines: async (): Promise<WorkoutRoutine[]> => {
    const response = await api.get('/routines/');
    return response.data;
  },

  getRoutineById: async (id: number): Promise<WorkoutRoutine> => {
    const response = await api.get(`/routines/${id}/`);
    return response.data;
  },

  getMyRoutine: async (): Promise<WorkoutRoutine> => {
    const response = await api.get('/routines/my_routine/');
    return response.data;
  },

  createRoutine: async (data: WorkoutRoutineCreate): Promise<WorkoutRoutine> => {
    const response = await api.post('/routines/', data);
    return response.data;
  },

  updateRoutine: async (id: number, data: Partial<WorkoutRoutine>): Promise<WorkoutRoutine> => {
    const response = await api.patch(`/routines/${id}/`, data);
    return response.data;
  },

  deleteRoutine: async (id: number): Promise<void> => {
    await api.delete(`/routines/${id}/`);
  },

  activateRoutine: async (id: number): Promise<WorkoutRoutine> => {
    const response = await api.post(`/routines/${id}/activate/`);
    return response.data;
  },

  notifyClient: async (id: number): Promise<{ message: string; notified_at: string }> => {
    const response = await api.post(`/routines/${id}/notify/`);
    return response.data;
  },

  // Ejercicios en Rutina
  getRoutineExercises: async (routineId?: number): Promise<RoutineExercise[]> => {
    const params = routineId ? { routine: routineId } : {};
    const response = await api.get('/routine-exercises/', { params });
    return response.data;
  },
};
