/**
 * API Service para Progreso y Tracking
 */

import api from './api';
import type {
  ProgressLog,
  Achievement,
  WorkoutSession,
  WorkoutSessionCreate,
  EvolutionData,
  ExerciseHistory,
  ProgressStats
} from '../types/progress';

export const progressService = {
  // Progress Logs
  getLogs: async (): Promise<ProgressLog[]> => {
    const response = await api.get('/progress/logs/');
    return response.data;
  },

  getLogById: async (id: number): Promise<ProgressLog> => {
    const response = await api.get(`/progress/logs/${id}/`);
    return response.data;
  },

  createLog: async (data: Partial<ProgressLog>): Promise<ProgressLog> => {
    const response = await api.post('/progress/logs/', data);
    return response.data;
  },

  updateLog: async (id: number, data: Partial<ProgressLog>): Promise<ProgressLog> => {
    const response = await api.patch(`/progress/logs/${id}/`, data);
    return response.data;
  },

  deleteLog: async (id: number): Promise<void> => {
    await api.delete(`/progress/logs/${id}/`);
  },

  getEvolution: async (days: number = 90): Promise<EvolutionData> => {
    const response = await api.get(`/progress/logs/evolution/`, {
      params: { days }
    });
    return response.data;
  },

  // Achievements
  getAchievements: async (): Promise<Achievement[]> => {
    const response = await api.get('/progress/achievements/');
    return response.data;
  },

  createAchievement: async (data: Partial<Achievement>): Promise<Achievement> => {
    const response = await api.post('/progress/achievements/', data);
    return response.data;
  },

  // Workout Sessions
  getSessions: async (): Promise<WorkoutSession[]> => {
    const response = await api.get('/progress/sessions/');
    return response.data;
  },

  getSessionById: async (id: number): Promise<WorkoutSession> => {
    const response = await api.get(`/progress/sessions/${id}/`);
    return response.data;
  },

  createSession: async (data: WorkoutSessionCreate): Promise<WorkoutSession> => {
    const response = await api.post('/progress/sessions/', data);
    return response.data;
  },

  addFeedback: async (id: number, feedback: string): Promise<WorkoutSession> => {
    const response = await api.post(`/progress/sessions/${id}/add_feedback/`, {
      trainer_feedback: feedback
    });
    return response.data;
  },

  getStats: async (): Promise<ProgressStats> => {
    const response = await api.get('/progress/sessions/stats/');
    return response.data;
  },

  // Exercise History
  getExerciseHistory: async (exerciseId: number): Promise<ExerciseHistory> => {
    const response = await api.get('/progress/exercise-logs/exercise_history/', {
      params: { exercise_id: exerciseId }
    });
    return response.data;
  },
};
