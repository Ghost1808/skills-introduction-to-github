import { apiService } from './api';
import { ApiResponse, User, LoginData, RegisterData } from '@/types';

export const authService = {
  async login(data: LoginData): Promise<ApiResponse<{ user: User; token: string }>> {
    return await apiService.post('/auth/login', data);
  },

  async register(data: RegisterData): Promise<ApiResponse<{ user: User; token: string }>> {
    return await apiService.post('/auth/register', data);
  },

  async getProfile(): Promise<ApiResponse<User>> {
    return await apiService.get('/auth/profile');
  },

  async updateProfile(data: Partial<User>): Promise<ApiResponse<User>> {
    return await apiService.put('/auth/profile', data);
  },

  async changePassword(data: {
    currentPassword: string;
    newPassword: string;
  }): Promise<ApiResponse> {
    return await apiService.put('/auth/change-password', data);
  },

  logout() {
    localStorage.removeItem('clinic_token');
    localStorage.removeItem('clinic_user');
  },
};