import { apiClient } from '@/lib/api-client';
import { 
  StudentDashboard,
  TutorDashboard,
  AdminDashboard,
  ApiResponse 
} from '@/types';

export const dashboardApi = {
  // Get student dashboard data
  getStudentDashboard: async (): Promise<ApiResponse<StudentDashboard>> => {
    return apiClient.get('/dashboard/student');
  },

  // Get tutor dashboard data
  getTutorDashboard: async (): Promise<ApiResponse<TutorDashboard>> => {
    return apiClient.get('/dashboard/tutor');
  },

  // Get admin dashboard data
  getAdminDashboard: async (): Promise<ApiResponse<AdminDashboard>> => {
    return apiClient.get('/dashboard/admin');
  },

  // Get booking statistics by date range
  getBookingStats: async (params?: {
    startDate?: string;
    endDate?: string;
  }): Promise<ApiResponse<any>> => {
    return apiClient.get('/dashboard/stats', { params });
  },
};
