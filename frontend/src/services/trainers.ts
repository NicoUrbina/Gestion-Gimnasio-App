import api from './api';

export interface Trainer {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  full_name: string;
  phone?: string;
  bio?: string;
  certifications: string[];
  hire_date: string;
  hourly_rate?: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface CreateTrainerData {
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  bio?: string;
  certifications?: string[];
  hire_date: string;
  hourly_rate?: number;
}

export interface UpdateTrainerData {
  email?: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  bio?: string;
  certifications?: string[];
  hire_date?: string;
  hourly_rate?: number;
  is_active?: boolean;
}

export interface TrainerFilters {
  search?: string;
  is_active?: boolean;
}

export interface TrainerStats {
  total: number;
  active: number;
  inactive: number;
  top_trainers: Array<{
    id: number;
    name: string;
    classes_count: number;
  }>;
}

export const trainersService = {
  async getAll(params?: TrainerFilters): Promise<Trainer[]> {
    const response = await api.get('/staff/trainers/', { params });
    return response.data;
  },

  async getById(id: number): Promise<Trainer> {
    const response = await api.get(`/staff/${id}/trainer/`);
    return response.data;
  },

  async create(data: CreateTrainerData): Promise<Trainer> {
    const response = await api.post('/staff/trainers/', data);
    return response.data;
  },

  async update(id: number, data: UpdateTrainerData): Promise<Trainer> {
    const response = await api.put(`/staff/${id}/trainer/`, data);
    return response.data;
  },

  async partialUpdate(id: number, data: Partial<UpdateTrainerData>): Promise<Trainer> {
    const response = await api.patch(`/staff/${id}/trainer/`, data);
    return response.data;
  },

  async toggleActive(id: number, isActive: boolean): Promise<void> {
    await api.post(`/staff/${id}/trainer/toggle-active/`, { is_active: isActive });
  },

  async getStats(): Promise<TrainerStats> {
    const response = await api.get('/staff/trainers/stats/');
    return response.data;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/staff/${id}/`);
  }
};