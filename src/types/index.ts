// User Types
export type UserRole = 'STUDENT' | 'TUTOR' | 'ADMIN';
export type UserStatus = 'ACTIVE' | 'BANNED' | 'SUSPENDED';
export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW';
export type DayOfWeek = 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY' | 'SUNDAY';

export interface User {
  id: string;
  email: string;
  name: string | null;
  role: UserRole;
  status: UserStatus;
  image: string | null;
  bio: string | null;
  phone: string | null;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  color: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  _count?: {
    tutors: number;
  };
}

export interface TutorProfile {
  id: string;
  userId: string;
  title: string;
  headline: string | null;
  description: string | null;
  hourlyRate: string;
  experience: number;
  education: string | null;
  totalSessions: number;
  averageRating: string | null;
  totalReviews: number;
  isAvailable: boolean;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: string;
    name: string | null;
    email: string;
    image: string | null;
  };
  categories?: TutorCategory[];
  availability?: Availability[];
  reviews?: Review[];
}

export interface TutorCategory {
  id: string;
  tutorId: string;
  categoryId: string;
  isPrimary: boolean;
  category: Category;
  createdAt: string;
}

export interface Availability {
  id: string;
  tutorId: string;
  dayOfWeek: DayOfWeek;
  startTime: string;
  endTime: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Booking {
  id: string;
  studentId: string;
  tutorId: string;
  tutorProfileId: string;
  subject: string;
  sessionDate: string;
  startTime: string;
  endTime: string;
  duration: number;
  price: string;
  status: BookingStatus;
  studentNotes: string | null;
  tutorNotes: string | null;
  cancelledBy: string | null;
  cancelReason: string | null;
  cancelledAt: string | null;
  createdAt: string;
  updatedAt: string;
  student?: {
    id: string;
    name: string | null;
    email: string;
    image: string | null;
  };
  tutor?: {
    id: string;
    name: string | null;
    email: string;
    image: string | null;
  };
  tutorProfile?: {
    id: string;
    title: string;
    hourlyRate: string;
  };
  review?: Review;
}

export interface Review {
  id: string;
  bookingId: string;
  studentId: string;
  tutorId: string;
  rating: number;
  comment: string | null;
  response: string | null;
  respondedAt: string | null;
  isVisible: boolean;
  createdAt: string;
  updatedAt: string;
  student?: {
    id: string;
    name: string | null;
    image: string | null;
  };
  booking?: {
    id: string;
    subject: string;
    sessionDate: string;
  };
}

// Dashboard Types
export interface StudentDashboard {
  overview: {
    totalBookings: number;
    completedSessions: number;
    pendingSessions: number;
    totalSpent: number;
  };
  upcomingBookings: Booking[];
  recentBookings: Booking[];
  favoriteTutors: TutorProfile[];
}

export interface TutorDashboard {
  overview: {
    totalSessions: number;
    completedSessions: number;
    pendingSessions: number;
    totalEarnings: number;
    thisMonthEarnings: number;
    studentsCount: number;
    averageRating: string | null;
    totalReviews: number;
  };
  upcomingSessions: Booking[];
  recentSessions: Booking[];
  recentReviews: Review[];
  profileStatus: {
    isAvailable: boolean;
    isVerified: boolean;
  };
}

export interface AdminDashboard {
  overview: {
    totalUsers: number;
    totalTutors: number;
    totalStudents: number;
    totalBookings: number;
    completedBookings: number;
    totalRevenue: number;
    thisMonthRevenue: number;
    activeCategories: number;
    thisMonthBookings: number;
    lastMonthBookings: number;
    bookingGrowth: number;
  };
  recentUsers: User[];
  recentBookings: Booking[];
  topTutors: TutorProfile[];
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
  errors?: Array<{ field: string; message: string }>;
}


export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Form Data Types
export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  email: string;
  password: string;
  name: string;
}

export interface UpdateProfileFormData {
  name?: string;
  bio?: string;
  phone?: string;
  image?: string;
}

export interface CreateTutorProfileFormData {
  title: string;
  headline?: string;
  description?: string;
  hourlyRate: number;
  experience?: number;
  education?: string;
  categoryIds: string[];
}

export interface UpdateTutorProfileFormData {
  title?: string;
  headline?: string;
  description?: string;
  hourlyRate?: number;
  experience?: number;
  education?: string;
  isAvailable?: boolean;
  categoryIds?: string[];
}

export interface CreateBookingFormData {
  tutorId: string;
  subject: string;
  sessionDate: string;
  startTime: string;
  endTime: string;
  studentNotes?: string;
}

export interface CreateReviewFormData {
  bookingId: string;
  rating: number;
  comment?: string;
}

export interface CreateAvailabilityFormData {
  dayOfWeek: DayOfWeek;
  startTime: string;
  endTime: string;
}

// Filter Types
export interface TutorFilters {
  categoryId?: string;
  minRate?: number;
  maxRate?: number;
  minRating?: number;
  isAvailable?: boolean;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: 'averageRating' | 'hourlyRate' | 'totalSessions';
}

export interface BookingFilters {
  status?: BookingStatus;
  fromDate?: string;
  toDate?: string;
  page?: number;
  limit?: number;
}

export interface BulkCreateAvailabilityFormData {
  slots: CreateAvailabilityFormData[];
}