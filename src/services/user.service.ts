import { apiClient } from '@/lib/api-client';
import { User, UpdateProfileFormData, ApiResponse } from '@/types';

export const userApi = {
  // Get current user profile
  getProfile: async (): Promise<ApiResponse<User>> => {
    return apiClient.get('/users/profile');
  },

  // Get user by ID
  getUserById: async (userId: string): Promise<ApiResponse<User>> => {
    return apiClient.get(`/users/${userId}`);
  },

  // Update user profile
  updateProfile: async (data: UpdateProfileFormData): Promise<ApiResponse<User>> => {
    return apiClient.put('/users/profile', data);
  },

  // Admin: Get all users
  getAllUsers: async (params?: {
    page?: number;
    limit?: number;
    role?: string;
    status?: string;
  }): Promise<ApiResponse<User[]>> => {
    return apiClient.get('/users', { params });
  },

  // Admin: Update user role
  updateUserRole: async (userId: string, role: string): Promise<ApiResponse<User>> => {
    return apiClient.patch(`/users/${userId}/role`, { role });
  },

  // Admin: Update user status
  updateUserStatus: async (userId: string, status: string): Promise<ApiResponse<User>> => {
    return apiClient.patch(`/users/${userId}/status`, { status });
  },

  // Admin: Delete user
  deleteUser: async (userId: string): Promise<ApiResponse<any>> => {
    return apiClient.delete(`/users/${userId}`);
  },
};
