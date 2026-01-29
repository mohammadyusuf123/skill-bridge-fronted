import { z } from 'zod';

// Auth Schemas
export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
});

// Profile Schemas
export const updateProfileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').optional(),
  bio: z.string().max(500, 'Bio must be less than 500 characters').optional(),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number').optional().or(z.literal('')),
  image: z.string().url('Invalid image URL').optional().or(z.literal('')),
});

// Tutor Profile Schemas
export const createTutorProfileSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  headline: z.string().max(200, 'Headline must be less than 200 characters').optional(),
  description: z.string().max(2000, 'Description must be less than 2000 characters').optional(),
  hourlyRate: z.number().min(1, 'Hourly rate must be at least $1').max(1000, 'Hourly rate must be less than $1000'),
  experience: z.number().min(0, 'Experience cannot be negative').max(50, 'Experience must be less than 50 years').optional(),
  education: z.string().max(500, 'Education must be less than 500 characters').optional(),
  categoryIds: z.array(z.string()).min(1, 'Select at least one category'),
});

export const updateTutorProfileSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').optional(),
  headline: z.string().max(200, 'Headline must be less than 200 characters').optional(),
  description: z.string().max(2000, 'Description must be less than 2000 characters').optional(),
  hourlyRate: z.number().min(1, 'Hourly rate must be at least $1').max(1000, 'Hourly rate must be less than $1000').optional(),
  experience: z.number().min(0, 'Experience cannot be negative').max(50, 'Experience must be less than 50 years').optional(),
  education: z.string().max(500, 'Education must be less than 500 characters').optional(),
  isAvailable: z.boolean().optional(),
  categoryIds: z.array(z.string()).min(1, 'Select at least one category').optional(),
});

// Booking Schemas
export const createBookingSchema = z.object({
  tutorId: z.string().min(1, 'Tutor is required'),
  subject: z.string().min(3, 'Subject must be at least 3 characters'),
  sessionDate: z.string().min(1, 'Session date is required'),
  startTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:mm)'),
  endTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:mm)'),
  studentNotes: z.string().max(1000, 'Notes must be less than 1000 characters').optional(),
}).refine(
  (data) => {
    const start = data.startTime.split(':').map(Number);
    const end = data.endTime.split(':').map(Number);
    const startMinutes = start[0] * 60 + start[1];
    const endMinutes = end[0] * 60 + end[1];
    return endMinutes > startMinutes;
  },
  {
    message: 'End time must be after start time',
    path: ['endTime'],
  }
);

// Review Schemas
export const createReviewSchema = z.object({
  bookingId: z.string().min(1, 'Booking is required'),
  rating: z.number().min(1, 'Rating must be at least 1').max(5, 'Rating must be at most 5'),
  comment: z.string().max(1000, 'Comment must be less than 1000 characters').optional(),
});

export const respondToReviewSchema = z.object({
  response: z.string().min(1, 'Response is required').max(1000, 'Response must be less than 1000 characters'),
});

// Availability Schemas
export const createAvailabilitySchema = z.object({
  dayOfWeek: z.enum(['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY']),
  startTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:mm)'),
  endTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:mm)'),
}).refine(
  (data) => {
    const start = data.startTime.split(':').map(Number);
    const end = data.endTime.split(':').map(Number);
    const startMinutes = start[0] * 60 + start[1];
    const endMinutes = end[0] * 60 + end[1];
    return endMinutes > startMinutes;
  },
  {
    message: 'End time must be after start time',
    path: ['endTime'],
  }
);

export const bulkCreateAvailabilitySchema = z.object({
  slots: z.array(createAvailabilitySchema).min(1, 'Add at least one availability slot'),
});

// Category Schemas
export const createCategorySchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  slug: z.string().min(2, 'Slug must be at least 2 characters').regex(/^[a-z0-9-]+$/, 'Slug must be lowercase with hyphens'),
  description: z.string().max(500, 'Description must be less than 500 characters').optional(),
  icon: z.string().optional(),
  color: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Invalid color format').optional(),
});

export const updateCategorySchema = createCategorySchema.partial().extend({
  isActive: z.boolean().optional(),
});

// Type exports
export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type UpdateProfileFormData = z.infer<typeof updateProfileSchema>;
export type CreateTutorProfileFormData = z.infer<typeof createTutorProfileSchema>;
export type UpdateTutorProfileFormData = z.infer<typeof updateTutorProfileSchema>;
export type CreateBookingFormData = z.infer<typeof createBookingSchema>;
export type CreateReviewFormData = z.infer<typeof createReviewSchema>;
export type CreateAvailabilityFormData = z.infer<typeof createAvailabilitySchema>;
export type BulkCreateAvailabilityFormData = z.infer<typeof bulkCreateAvailabilitySchema>;
export type CreateCategoryFormData = z.infer<typeof createCategorySchema>;
export type UpdateCategoryFormData = z.infer<typeof updateCategorySchema>;
