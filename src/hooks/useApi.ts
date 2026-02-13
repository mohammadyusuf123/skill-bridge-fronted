import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { tutorApi } from '@/services/tutor.service';
import { bookingApi } from '@/services/booking.service';
import { reviewApi } from '@/services/review.service';
import { availabilityApi } from '@/services/availability.service';
import { categoryApi } from '@/services/category.service';
import { dashboardApi } from '@/services/dashboard.service';
import { userApi } from '@/services/user.service';
import { useAppSelector } from '@/store/hooks';
import { toast } from 'sonner';
import type {
  CreateTutorProfileFormData,
  UpdateTutorProfileFormData,
  CreateBookingFormData,
  CreateReviewFormData,
  CreateAvailabilityFormData,
  UpdateProfileFormData,
} from '@/types';
import { BulkCreateAvailabilityFormData } from '@/lib/validations';

// ============================================
// TUTOR HOOKS
// ============================================
//get all tutors
export function useAllTutors(page: number = 1, limit: number = 10) {
  return useQuery({
    queryKey: ['all-tutors', page, limit],
    queryFn: () => tutorApi.getAllTutors({ page, limit }),
  });
}
export function useTutors() {
  const filters = useAppSelector(state => state.tutor.filters);
  
  return useQuery({
    queryKey: ['tutors', filters],
    queryFn: () => tutorApi.searchTutors(filters),
  });
}
// Get tutor profile by user ID (for booking)
export function useTutorProfileByUserId(userId: string | null) {
  return useQuery({
    queryKey: ['tutor-by-user', userId],
    queryFn: () => tutorApi.getProfileByUserId(userId!),
    enabled: !!userId,
  });
}
export function useTutorProfile(tutorId: string | null) {
  return useQuery({
    queryKey: ['tutor', tutorId],
    queryFn: () => tutorApi.getProfileById(tutorId!),
    enabled: !!tutorId,
  });
}

export function useOwnTutorProfile() {
  return useQuery({
    queryKey: ['tutor', 'own'],
    queryFn: () => tutorApi.getOwnProfile(),
  });
}

export function useCreateTutorProfile() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateTutorProfileFormData) => tutorApi.createProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tutor', 'own'] });
      toast.success('Tutor profile created successfully!');
    },
    onError: () => {
      toast.error('Failed to create tutor profile');
    },
  });
}

export function useUpdateTutorProfile() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: UpdateTutorProfileFormData) => tutorApi.updateProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tutor', 'own'] });
      toast.success('Profile updated successfully!');
    },
    onError: () => {
      toast.error('Failed to update profile');
    },
  });
}

export function useToggleTutorAvailability() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: () => tutorApi.toggleAvailability(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tutor', 'own'] });
      toast.success('Availability status updated!');
    },
    onError: () => {
      toast.error('Failed to update availability');
    },
  });
}

// ============================================
// BOOKING HOOKS
// ============================================

export function useBookings() {
  const filters = useAppSelector(state => state.booking.filters);
  
  return useQuery({
    queryKey: ['bookings', filters],
    queryFn: () => bookingApi.getUserBookings(filters),
  });
}

export function useBooking(bookingId: string | null) {
  return useQuery({
    queryKey: ['booking', bookingId],
    queryFn: () => bookingApi.getBookingById(bookingId!),
    enabled: !!bookingId,
  });
}

export function useCreateBooking() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateBookingFormData) => bookingApi.createBooking(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      toast.success('Booking created successfully!');
    },
    onError: () => {
      toast.error('Failed to create booking');
    },
  });
}

export function useCancelBooking() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ bookingId, reason }: { bookingId: string; reason?: string }) =>
      bookingApi.cancelBooking(bookingId, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      toast.success('Booking cancelled');
    },
    onError: () => {
      toast.error('Failed to cancel booking');
    },
  });
}

export function useCompleteBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ bookingId, tutorNotes }: { bookingId: string; tutorNotes?: string }) =>
      bookingApi.markAsComplete(bookingId, tutorNotes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      toast.success('Booking marked as complete!');
    },
    onError: (error: any) => {
      console.error('Complete Booking Error:', error);

      // Axios error has response.data.message
      const message =
        error?.response?.data?.message ||
        error?.message ||
        'Failed to complete booking';
      toast.error(message);
    },
  });
}


export function useBookingStats() {
  return useQuery({
    queryKey: ['booking-stats'],
    queryFn: () => bookingApi.getBookingStats(),
  });
}

// ============================================
// REVIEW HOOKS
// ============================================

export function useTutorReviews(tutorId: string | null, page: number = 1, limit: number = 10) {
  return useQuery({
    queryKey: ['reviews', tutorId, page, limit],
    queryFn: () => reviewApi.getTutorReviews(tutorId!, page, limit),
    enabled: !!tutorId,
  });
}

export function useCreateReview() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateReviewFormData) => reviewApi.createReview(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
      queryClient.invalidateQueries({ queryKey: ['booking', variables.bookingId] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      toast.success('Review submitted successfully!');
    },
    onError: () => {
      toast.error('Failed to submit review');
    },
  });
}

export function useRespondToReview() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ reviewId, response }: { reviewId: string; response: string }) =>
      reviewApi.respondToReview(reviewId, response),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
      toast.success('Response added successfully!');
    },
    onError: () => {
      toast.error('Failed to respond to review');
    },
  });
}

// ============================================
// AVAILABILITY HOOKS
// ============================================

export function useTutorAvailability(tutorId: string | null) {
  return useQuery({
    queryKey: ['availability', tutorId],
    queryFn: () => availabilityApi.getTutorAvailability(tutorId!),
    enabled: !!tutorId,
  });
}

export function useOwnAvailability() {
  return useQuery({
    queryKey: ['availability', 'own'],
    queryFn: () => availabilityApi.getOwnAvailability(),
  });
}

export function useAddAvailability() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateAvailabilityFormData) => availabilityApi.addAvailability(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['availability', 'own'] });
      toast.success('Availability added!');
    },
    onError: () => {
      toast.error('Failed to add availability');
    },
  });
}

export function useBulkAddAvailability() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: BulkCreateAvailabilityFormData) => availabilityApi.bulkAddAvailability(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['availability', 'own'] });
      toast.success('Availability slots added!');
    },
    onError: () => {
      toast.error('Failed to add availability');
    },
  });
}

export function useDeleteAvailability() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (availabilityId: string) => availabilityApi.deleteAvailability(availabilityId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['availability', 'own'] });
      toast.success('Availability deleted!');
    },
    onError: () => {
      toast.error('Failed to delete availability');
    },
  });
}

// ============================================
// CATEGORY HOOKS
// ============================================

export function useCategories(includeInactive: boolean = false) {
  return useQuery({
    queryKey: ['categories', includeInactive],
    queryFn: () => categoryApi.getAllCategories(includeInactive),
    staleTime: 5 * 60 * 1000, // Categories don't change often
  });
}

export function useCategory(categoryId: string | null) {
  return useQuery({
    queryKey: ['category', categoryId],
    queryFn: () => categoryApi.getCategoryById(categoryId!),
    enabled: !!categoryId,
  });
}

// ============================================
// DASHBOARD HOOKS
// ============================================

export function useStudentDashboard() {
  return useQuery({
    queryKey: ['dashboard', 'student'],
    queryFn: () => dashboardApi.getStudentDashboard(),
  });
}

export function useTutorDashboard() {
  return useQuery({
    queryKey: ['dashboard', 'tutor'],
    queryFn: () => dashboardApi.getTutorDashboard(),
  });
}

export function useAdminDashboard() {
  return useQuery({
    queryKey: ['dashboard', 'admin'],
    queryFn: () => dashboardApi.getAdminDashboard(),
  });
}

// ============================================
// USER HOOKS
// ============================================

export function useProfile() {
  return useQuery({
    queryKey: ['user', 'profile'],
    queryFn: () => userApi.getProfile(),
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: UpdateProfileFormData) => userApi.updateProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user', 'profile'] });
      toast.success('Profile updated successfully!');
    },
    onError: () => {
      toast.error('Failed to update profile');
    },
  });
}

export function useUser(userId: string | null) {
  return useQuery({
    queryKey: ['user', userId],
    queryFn: () => userApi.getUserById(userId!),
    enabled: !!userId,
  });
}
