import { apiClient } from '@/lib/api-client';
import { 
  Availability, 
  CreateAvailabilityFormData,
  BulkCreateAvailabilityFormData,
  ApiResponse 
} from '@/types';

export const availabilityApi = {
  // Add single availability slot
  addAvailability: async (data: CreateAvailabilityFormData): Promise<ApiResponse<Availability>> => {
    return apiClient.post('/availability', data);
  },

  // Get tutor availability by tutor ID
  getTutorAvailability: async (tutorId: string): Promise<ApiResponse<Record<string, Availability[]>>> => {
    return apiClient.get(`/availability/tutor/${tutorId}`);
  },

  // Get own availability (for logged-in tutor)
  getOwnAvailability: async (): Promise<ApiResponse<Record<string, Availability[]>>> => {
    return apiClient.get('/availability/me');
  },

  // Update availability slot
  updateAvailability: async (
    availabilityId: string, 
    data: Partial<CreateAvailabilityFormData>
  ): Promise<ApiResponse<Availability>> => {
    return apiClient.put(`/availability/${availabilityId}`, data);
  },

  // Delete availability slot
  deleteAvailability: async (availabilityId: string): Promise<ApiResponse<any>> => {
    return apiClient.delete(`/availability/${availabilityId}`);
  },

  // Toggle availability slot active status
  toggleAvailability: async (availabilityId: string): Promise<ApiResponse<Availability>> => {
    return apiClient.patch(`/availability/${availabilityId}/toggle`);
  },

  // Bulk add availability slots
  bulkAddAvailability: async (data: BulkCreateAvailabilityFormData): Promise<ApiResponse<any>> => {
    return apiClient.post('/availability/bulk', data);
  },
};
