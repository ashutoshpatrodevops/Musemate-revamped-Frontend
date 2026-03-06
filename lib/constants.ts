// lib/constants.ts

export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || 'MuseMate';
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Museum Categories
export const MUSEUM_CATEGORIES = [
  'Art Museums',
  'History Museums',
  'Science Museums',
  'Technology & Innovation Museums',
  'Biographical Museums',
  'War & Military Museums',
  'Fashion & Textile Museums',
  'Aviation & Aerospace Museums',
] as const;

export type MuseumCategory = typeof MUSEUM_CATEGORIES[number];

// Ticket Types
export const TICKET_TYPES = [
  { value: 'adult', label: 'Adult' },
  { value: 'child', label: 'Child' },
  { value: 'senior', label: 'Senior' },
  { value: 'student', label: 'Student' },
  { value: 'group', label: 'Group' },
] as const;

export type TicketType = 'adult' | 'child' | 'senior' | 'student' | 'group';

// Identity Types
export const IDENTITY_TYPES = [
  { value: 'aadhaar', label: 'Aadhaar Card' },
  { value: 'pan-card', label: 'PAN Card' },
  { value: 'voter-id', label: 'Voter ID' },
  { value: 'passport', label: 'Passport' },
  { value: 'driving-licence', label: 'Driving Licence' },
] as const;

export type IdentityType = 'aadhaar' | 'pan-card' | 'voter-id' | 'passport' | 'driving-licence';

// Booking Status
export const BOOKING_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  CANCELLED: 'cancelled',
  COMPLETED: 'completed',
  NO_SHOW: 'no-show',
} as const;

export type BookingStatus = typeof BOOKING_STATUS[keyof typeof BOOKING_STATUS];

// Payment Status
export const PAYMENT_STATUS = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  FAILED: 'failed',
  REFUNDED: 'refunded',
} as const;

export type PaymentStatus = typeof PAYMENT_STATUS[keyof typeof PAYMENT_STATUS];

// Review Status
export const REVIEW_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  FLAGGED: 'flagged',
} as const;

export type ReviewStatus = typeof REVIEW_STATUS[keyof typeof REVIEW_STATUS];

// Museum Status
export const MUSEUM_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  PENDING_APPROVAL: 'pending_approval',
} as const;

export type MuseumStatus = typeof MUSEUM_STATUS[keyof typeof MUSEUM_STATUS];

// User Roles
export const USER_ROLES = {
  USER: 'user',
  MUSEUM_ADMIN: 'museum_admin',
  ADMIN: 'admin',
} as const;

export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES];

// Days of Week
export const DAYS_OF_WEEK = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
] as const;

export type DayOfWeek = typeof DAYS_OF_WEEK[number];

// Pagination
export const DEFAULT_PAGE_SIZE = 12;
export const BOOKINGS_PAGE_SIZE = 10;
export const REVIEWS_PAGE_SIZE = 10;
export const ADMIN_PAGE_SIZE = 20;

// Rating
export const MAX_RATING = 5;
export const MIN_RATING = 1;

// File Upload
export const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
export const MAX_IMAGES_PER_MUSEUM = 10;

// Date Formats
export const DATE_FORMAT = 'MMM dd, yyyy';
export const TIME_FORMAT = 'hh:mm a';
export const DATETIME_FORMAT = 'MMM dd, yyyy hh:mm a';

// Currency
export const CURRENCY = 'INR';
export const CURRENCY_SYMBOL = '₹';

// Social Media
export const SOCIAL_LINKS = {
  facebook: 'https://facebook.com/musemate',
  twitter: 'https://twitter.com/musemate',
  instagram: 'https://instagram.com/musemate',
  linkedin: 'https://linkedin.com/company/musemate',
};

// Contact
export const CONTACT_EMAIL = 'support@musemate.com';
export const CONTACT_PHONE = '+91-1234567890';

// Error Messages
export const ERROR_MESSAGES = {
  GENERIC: 'Something went wrong. Please try again.',
  NETWORK: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'You need to be logged in to access this.',
  FORBIDDEN: 'You don\'t have permission to access this.',
  NOT_FOUND: 'The requested resource was not found.',
  VALIDATION: 'Please check your input and try again.',
};

// Success Messages
export const SUCCESS_MESSAGES = {
  BOOKING_CREATED: 'Booking created successfully!',
  BOOKING_CANCELLED: 'Booking cancelled successfully.',
  REVIEW_CREATED: 'Review submitted successfully!',
  REVIEW_UPDATED: 'Review updated successfully!',
  PROFILE_UPDATED: 'Profile updated successfully!',
  MUSEUM_CREATED: 'Museum created successfully!',
  MUSEUM_UPDATED: 'Museum updated successfully!',
};