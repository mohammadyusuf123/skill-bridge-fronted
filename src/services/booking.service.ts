import { apiClient } from '@/lib/api-client';
import { Booking, CreateBookingFormData, BookingFilters, PaginatedResponse, ApiResponse } from '@/types';

export const bookingApi = {
  createBooking: async (data: CreateBookingFormData): Promise<ApiResponse<Booking>> => {
    return apiClient.post('/bookings', data);
  },

  getBookingById: async (bookingId: string): Promise<ApiResponse<Booking>> => {
    return apiClient.get(`/bookings/${bookingId}`);
  },

  getUserBookings: async (filters?: BookingFilters): Promise<ApiResponse<PaginatedResponse<Booking>>> => {
    return apiClient.get('/bookings/my-bookings', { params: filters });
  },

  updateBooking: async (bookingId: string, data: any): Promise<ApiResponse<Booking>> => {
    return apiClient.put(`/bookings/${bookingId}`, data);
  },

  cancelBooking: async (bookingId: string, reason?: string): Promise<ApiResponse<Booking>> => {
    return apiClient.post(`/bookings/${bookingId}/cancel`, { reason });
  },

  markAsComplete: async (bookingId: string, tutorNotes?: string): Promise<ApiResponse<Booking>> => {
    return apiClient.post(`/bookings/${bookingId}/complete`, { tutorNotes });
  },

  getBookingStats: async (): Promise<ApiResponse<any>> => {
    return apiClient.get('/bookings/stats');
  },
};
