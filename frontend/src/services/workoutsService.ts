/**
 * Workouts Service
 * API calls para rutinas y ejercicios
 */

import api from './api';
import type {
    MuscleGroup,
    Exercise,
    ExerciseFilters,
    WorkoutRoutine,
    WorkoutRoutineCreate,
    WorkoutSession,
    WorkoutSessionCreate,
    ExerciseLog,
    ExerciseLogCreate,
    PaginatedResponse
} from '../types/workouts';

const BASE_URL = '';

// ==================== MUSCLE GROUPS ====================

export const getMuscleGroups = async (): Promise<MuscleGroup[]> => {
    const response = await api.get<PaginatedResponse<MuscleGroup>>(`${BASE_URL}/muscle-groups/`);
    return response.data.results;
};

// ==================== EXERCISES ====================

export const getExercises = async (filters?: ExerciseFilters): Promise<PaginatedResponse<Exercise>> => {
    const params = new URLSearchParams();

    if (filters?.muscle_group) {
        params.append('muscle_group', filters.muscle_group.toString());
    }
    if (filters?.difficulty) {
        params.append('difficulty', filters.difficulty);
    }
    if (filters?.search) {
        params.append('search', filters.search);
    }

    const response = await api.get<PaginatedResponse<Exercise>>(
        `${BASE_URL}/exercises/?${params.toString()}`
    );
    return response.data;
};

export const getExerciseById = async (id: number): Promise<Exercise> => {
    const response = await api.get<Exercise>(`${BASE_URL}/exercises/${id}/`);
    return response.data;
};

// ==================== WORKOUT ROUTINES ====================

export const getRoutines = async (): Promise<PaginatedResponse<WorkoutRoutine>> => {
    const response = await api.get<PaginatedResponse<WorkoutRoutine>>(`${BASE_URL}/routines/`);
    return response.data;
};

export const getRoutineById = async (id: number): Promise<WorkoutRoutine> => {
    const response = await api.get<WorkoutRoutine>(`${BASE_URL}/routines/${id}/`);
    return response.data;
};
export const getMyRoutine = async (): Promise<WorkoutRoutine> => {
    const response = await api.get<WorkoutRoutine>(`${BASE_URL}/routines/my_routine/`);
    return response.data;
};

export const createRoutine = async (data: WorkoutRoutineCreate): Promise<WorkoutRoutine> => {
    const response = await api.post<WorkoutRoutine>(`${BASE_URL}/routines/`, data);
    return response.data;
};

export const updateRoutine = async (
    id: number,
    data: Partial<WorkoutRoutineCreate>
): Promise<WorkoutRoutine> => {
    const response = await api.put<WorkoutRoutine>(`${BASE_URL}/routines/${id}/`, data);
    return response.data;
};

export const deleteRoutine = async (id: number): Promise<void> => {
    await api.delete(`${BASE_URL}/routines/${id}/`);
};

export const activateRoutine = async (id: number): Promise<WorkoutRoutine> => {
    const response = await api.post<WorkoutRoutine>(`${BASE_URL}/routines/${id}/activate/`);
    return response.data;
};

export const notifyMember = async (id: number): Promise<{ message: string; notified_at: string }> => {
    const response = await api.post(`${BASE_URL}/routines/${id}/notify/`);
    return response.data;
};

// ==================== WORKOUT SESSIONS ====================

export const getSessions = async (): Promise<PaginatedResponse<WorkoutSession>> => {
    const response = await api.get<PaginatedResponse<WorkoutSession>>(`${BASE_URL}/sessions/`);
    return response.data;
};

export const getMySessions = async (): Promise<WorkoutSession[]> => {
    const response = await api.get<WorkoutSession[]>(`${BASE_URL}/sessions/my_sessions/`);
    return response.data;
};

export const getSessionById = async (id: number): Promise<WorkoutSession> => {
    const response = await api.get<WorkoutSession>(`${BASE_URL}/sessions/${id}/`);
    return response.data;
};

export const createSession = async (data: WorkoutSessionCreate): Promise<WorkoutSession> => {
    const response = await api.post<WorkoutSession>(`${BASE_URL}/sessions/`, data);
    return response.data;
};

export const completeSession = async (
    id: number,
    duration_minutes?: number
): Promise<WorkoutSession> => {
    const response = await api.post<WorkoutSession>(`${BASE_URL}/sessions/${id}/complete/`, {
        duration_minutes
    });
    return response.data;
};

export const deleteSession = async (id: number): Promise<void> => {
    await api.delete(`${BASE_URL}/sessions/${id}/`);
};

// ==================== EXERCISE LOGS ====================

export const getExerciseLogs = async (): Promise<PaginatedResponse<ExerciseLog>> => {
    const response = await api.get<PaginatedResponse<ExerciseLog>>(`${BASE_URL}/exercise-logs/`);
    return response.data;
};

export const getExerciseProgress = async (routineExerciseId: number): Promise<ExerciseLog[]> => {
    const response = await api.get<ExerciseLog[]>(
        `${BASE_URL}/exercise-logs/progress/?routine_exercise=${routineExerciseId}`
    );
    return response.data;
};

export const createExerciseLog = async (data: ExerciseLogCreate): Promise<ExerciseLog> => {
    const response = await api.post<ExerciseLog>(`${BASE_URL}/exercise-logs/`, data);
    return response.data;
};

export const deleteExerciseLog = async (id: number): Promise<void> => {
    await api.delete(`${BASE_URL}/exercise-logs/${id}/`);
};

// Default export
const workoutsService = {
    getMuscleGroups,
    getExercises,
    getExerciseById,
    getRoutines,
    getRoutineById,
    getMyRoutine,
    createRoutine,
    updateRoutine,
    deleteRoutine,
    activateRoutine,
    notifyMember,
    getSessions,
    getMySessions,
    getSessionById,
    createSession,
    completeSession,
    deleteSession,
    getExerciseLogs,
    getExerciseProgress,
    createExerciseLog,
    deleteExerciseLog
};

export default workoutsService;
