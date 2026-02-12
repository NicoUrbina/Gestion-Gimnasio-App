import api from './api';

export interface JobApplicationData {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    position: string;
    experience_summary: string;
    portfolio_url?: string;
}

export const careersService = {
    submitApplication: async (data: JobApplicationData) => {
        const response = await api.post('/careers/applications/', data);
        return response.data;
    }
};
