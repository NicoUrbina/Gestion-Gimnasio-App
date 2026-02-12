import api from './api';

export interface Member {
    id: number;
    full_name: string;
    email: string;
    phone?: string;
    subscription_status: string;
    subscription_status_display?: string;
    joined_date?: string;
    last_access?: string;
}

export const membersService = {
    /**
     * Get all members (for trainers/admins)
     */
    getAll: async (): Promise<Member[]> => {
        const response = await api.get('/members/');
        // Handle paginated response
        return Array.isArray(response.data) ? response.data : response.data.results || [];
    },

    /**
     * Get a specific member by ID
     */
    getById: async (id: number): Promise<Member> => {
        const response = await api.get(`/members/${id}/`);
        return response.data;
    },
};
