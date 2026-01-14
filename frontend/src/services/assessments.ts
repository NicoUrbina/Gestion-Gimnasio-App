/**
 * API Service para Evaluaciones Físicas
 */

import api from './api';
import type { FitnessAssessment, AssessmentRequest, AssessmentSchedule, Goal, NutritionPlan } from '../types/assessments';

export const assessmentService = {
  // Evaluaciones
  getAll: async (): Promise<FitnessAssessment[]> => {
    const response = await api.get('/assessments/');
    return response.data;
  },

  getById: async (id: number): Promise<FitnessAssessment> => {
    const response = await api.get(`/assessments/${id}/`);
    return response.data;
  },

  requestEvaluation: async (data: AssessmentRequest): Promise<FitnessAssessment> => {
    const response = await api.post('/assessments/request_evaluation/', data);
    return response.data;
  },

  schedule: async (id: number, data: AssessmentSchedule): Promise<FitnessAssessment> => {
    const response = await api.post(`/assessments/${id}/schedule/`, data);
    return response.data;
  },

  complete: async (id: number, data: Partial<FitnessAssessment>): Promise<FitnessAssessment> => {
    const response = await api.post(`/assessments/${id}/complete/`, data);
    return response.data;
  },

  cancel: async (id: number): Promise<FitnessAssessment> => {
    const response = await api.post(`/assessments/${id}/cancel/`);
    return response.data;
  },

  update: async (id: number, data: Partial<FitnessAssessment>): Promise<FitnessAssessment> => {
    const response = await api.patch(`/assessments/${id}/`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/assessments/${id}/`);
  },

  // Metas
  getGoals: async (): Promise<Goal[]> => {
    const response = await api.get('/goals/');
    return response.data;
  },

  createGoal: async (data: Partial<Goal>): Promise<Goal> => {
    const response = await api.post('/goals/', data);
    return response.data;
  },

  updateGoal: async (id: number, data: Partial<Goal>): Promise<Goal> => {
    const response = await api.patch(`/goals/${id}/`, data);
    return response.data;
  },

  deleteGoal: async (id: number): Promise<void> => {
    await api.delete(`/goals/${id}/`);
  },

  // Planes Nutricionales
  getNutritionPlans: async (): Promise<NutritionPlan[]> => {
    const response = await api.get('/nutrition-plans/');
    return response.data;
  },

  createNutritionPlan: async (data: Partial<NutritionPlan>): Promise<NutritionPlan> => {
    const response = await api.post('/nutrition-plans/', data);
    return response.data;
  },

  updateNutritionPlan: async (id: number, data: Partial<NutritionPlan>): Promise<NutritionPlan> => {
    const response = await api.patch(`/nutrition-plans/${id}/`, data);
    return response.data;
  },

  deleteNutritionPlan: async (id: number): Promise<void> => {
    await api.delete(`/nutrition-plans/${id}/`);
  },
};
