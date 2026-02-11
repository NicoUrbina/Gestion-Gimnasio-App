import api from './api';
import type { Payment, PaymentStats } from '../types';

/**
 * Payment Service
 * API calls for payment management
 */
export const paymentService = {
  /**
   * Get all payments (admin/staff) or filtered
   */
  getAll: async (filters?: {
    status?: string;
    payment_method?: string;
    member?: number;
  }): Promise<Payment[]> => {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.payment_method) params.append('payment_method', filters.payment_method);
    if (filters?.member) params.append('member', filters.member.toString());

    const response = await api.get(`/payments/?${params.toString()}`);
    if (response.data.results) return response.data.results;
    return response.data;
  },

  /**
   * Get my payments (member only)
   */
  getMyPayments: async (): Promise<Payment[]> => {
    const response = await api.get('/payments/my_payments/');
    if (response.data.results) return response.data.results;
    return response.data;
  },

  /**
   * Get payment by ID
   */
  getById: async (id: number): Promise<Payment> => {
    const response = await api.get(`/payments/${id}/`);
    return response.data;
  },

  /**
   * Create payment (staff: completed, member: pending)
   */
  create: async (data: FormData | any): Promise<Payment> => {
    const config = data instanceof FormData ? {
      headers: { 'Content-Type': 'multipart/form-data' }
    } : {};

    const response = await api.post('/payments/', data, config);
    return response.data;
  },

  /**
   * Update payment
   */
  update: async (id: number, data: Partial<Payment>): Promise<Payment> => {
    const response = await api.patch(`/payments/${id}/`, data);
    return response.data;
  },

  /**
   * Delete payment
   */
  delete: async (id: number): Promise<void> => {
    await api.delete(`/payments/${id}/`);
  },

  /**
   * Approve pending payment (staff only)
   */
  approve: async (id: number): Promise<Payment> => {
    const response = await api.post(`/payments/${id}/approve/`);
    return response.data.payment;
  },

  /**
   * Reject pending payment (staff only)
   */
  reject: async (id: number, reason: string): Promise<Payment> => {
    const response = await api.post(`/payments/${id}/reject/`, { reason });
    return response.data.payment;
  },

  /**
   * Get payment statistics
   */
  getStats: async (): Promise<PaymentStats> => {
    const response = await api.get('/payments/stats/');
    return response.data;
  },

  /**
   * Get count of pending payments
   */
  getPendingCount: async (): Promise<number> => {
    const response = await api.get('/payments/pending_count/');
    return response.data.count;
  },

  getChartData: async (): Promise<{
    revenue: { labels: string[]; revenues: number[] };
    payment_methods: { labels: string[]; values: number[] };
  }> => {
    const response = await api.get('/payments/chart_data/');
    return response.data;
  },

  /**
   * Export payments report as Excel file
   */
  exportReport: async (startDate?: string, endDate?: string): Promise<Blob> => {
    const params = new URLSearchParams();
    if (startDate) params.append('start_date', startDate);
    if (endDate) params.append('end_date', endDate);

    const response = await api.get(`/payments/export_report/?${params.toString()}`, {
      responseType: 'blob',
    });
    return response.data;
  },
};

/**
 * Invoice Service
 * API calls for invoice management
 */
export const invoiceService = {
  /**
   * Get all invoices
   */
  getAll: async (): Promise<any[]> => {
    const response = await api.get('/invoices/');
    return response.data;
  },

  /**
   * Get invoice by ID
   */
  getById: async (id: number): Promise<any> => {
    const response = await api.get(`/invoices/${id}/`);
    return response.data;
  },

  /**
   * Create invoice for payment
   */
  create: async (data: any): Promise<any> => {
    const response = await api.post('/invoices/', data);
    return response.data;
  },

  /**
   * Download invoice PDF
   */
  downloadPDF: async (id: number): Promise<Blob> => {
    const response = await api.get(`/invoices/${id}/`, {
      responseType: 'blob',
    });
    return response.data;
  },
};
