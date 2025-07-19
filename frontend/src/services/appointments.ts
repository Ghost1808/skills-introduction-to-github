import { apiService } from './api';
import { ApiResponse, PaginatedResponse, Appointment, AppointmentFormData } from '@/types';

export const appointmentService = {
  async getAppointments(params?: {
    page?: number;
    limit?: number;
    status?: string;
    date?: string;
    doctorId?: string;
    patientId?: string;
  }): Promise<PaginatedResponse<Appointment>> {
    const queryParams = new URLSearchParams();
    
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.status) queryParams.append('status', params.status);
    if (params?.date) queryParams.append('date', params.date);
    if (params?.doctorId) queryParams.append('doctorId', params.doctorId);
    if (params?.patientId) queryParams.append('patientId', params.patientId);

    const url = `/appointments${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return await apiService.get(url);
  },

  async getAppointment(id: string): Promise<ApiResponse<Appointment>> {
    return await apiService.get(`/appointments/${id}`);
  },

  async createAppointment(data: AppointmentFormData): Promise<ApiResponse<Appointment>> {
    return await apiService.post('/appointments', data);
  },

  async updateAppointment(id: string, data: Partial<AppointmentFormData>): Promise<ApiResponse<Appointment>> {
    return await apiService.put(`/appointments/${id}`, data);
  },

  async cancelAppointment(id: string): Promise<ApiResponse<Appointment>> {
    return await apiService.patch(`/appointments/${id}/cancel`);
  },

  async getDoctorAvailability(doctorId: string, date: string): Promise<ApiResponse<{
    doctor: {
      id: string;
      firstName: string;
      lastName: string;
      specialization: string;
      availability: any[];
    };
    appointments: Array<{
      startTime: string;
      endTime: string;
      status: string;
    }>;
  }>> {
    return await apiService.get(`/appointments/doctor/${doctorId}/availability?date=${date}`);
  },
};