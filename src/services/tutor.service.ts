import { apiClient } from '@/lib/api-client';
import { 
  TutorProfile, 
  CreateTutorProfileFormData, 
  UpdateTutorProfileFormData,
  TutorFilters,
  PaginatedResponse,
  ApiResponse 
} from '@/types';

export const tutorApi = {
  // Create tutor profile
  createProfile: async (data: CreateTutorProfileFormData): Promise<ApiResponse<TutorProfile>> => {
    return apiClient.post('/tutors/profile', data);
  },

  // Get own tutor profile
  getOwnProfile: async (): Promise<ApiResponse<TutorProfile>> => {
    return apiClient.get('/tutors/profile/me');
  },

  // Get tutor profile by user ID
  getProfileByUserId: async (userId: string): Promise<ApiResponse<TutorProfile>> => {
    return apiClient.get(`/tutors/user/${userId}`);
  },

  // Get tutor profile by ID
  getProfileById: async (tutorId: string): Promise<ApiResponse<TutorProfile>> => {
    return apiClient.get(`/tutors/${tutorId}`);
  },

  // Update tutor profile
  updateProfile: async (data: UpdateTutorProfileFormData): Promise<ApiResponse<TutorProfile>> => {
    return apiClient.put('/tutors/profile', data);
  },

  // Search tutors
  searchTutors: async (filters: TutorFilters): Promise<ApiResponse<PaginatedResponse<TutorProfile>>> => {
    return apiClient.get('/tutors/search', { params: filters });
  },

  // Toggle availability
  toggleAvailability: async (): Promise<ApiResponse<TutorProfile>> => {
    return apiClient.patch('/tutors/availability/toggle');
  },
};
