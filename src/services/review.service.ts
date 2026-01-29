import { apiClient } from '@/lib/api-client';
import { 
  Review, 
  CreateReviewFormData,
  PaginatedResponse,
  ApiResponse 
} from '@/types';

export const reviewApi = {
  // Create a review for a completed booking
  createReview: async (data: CreateReviewFormData): Promise<ApiResponse<Review>> => {
    return apiClient.post('/reviews', data);
  },

  // Get review by ID
  getReviewById: async (reviewId: string): Promise<ApiResponse<Review>> => {
    return apiClient.get(`/reviews/${reviewId}`);
  },

  // Get all reviews for a specific tutor
  getTutorReviews: async (
    tutorId: string,
    page: number = 1,
    limit: number = 10
  ): Promise<ApiResponse<PaginatedResponse<Review>>> => {
    return apiClient.get(`/reviews/tutor/${tutorId}`, {
      params: { page, limit }
    });
  },

  // Tutor responds to a review
  respondToReview: async (
    reviewId: string,
    response: string
  ): Promise<ApiResponse<Review>> => {
    return apiClient.post(`/reviews/${reviewId}/respond`, { response });
  },

  // Admin: Delete a review
  deleteReview: async (reviewId: string): Promise<ApiResponse<any>> => {
    return apiClient.delete(`/reviews/${reviewId}`);
  },
};
