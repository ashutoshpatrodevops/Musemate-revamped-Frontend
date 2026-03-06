// types/index.ts

import { 
  MuseumCategory, 
  TicketType, 
  IdentityType,
  BookingStatus,
  PaymentStatus,
  ReviewStatus,
  MuseumStatus,
  UserRole,
  DayOfWeek,
} from '@/lib/constants';

// ==========================================
// USER TYPES
// ==========================================

export interface User {
  _id: string;
  clerkId: string;
  email: string;
  username: string;
  role: UserRole;
  phone?: string;
  address?: string;
  isBanned: boolean;
  bannedAt?: Date;
  banReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

// ==========================================
// MUSEUM TYPES
// ==========================================

export interface TicketTypeInfo {
  type: TicketType;
  price: number;
  description?: string;
}

export interface TimeSlot {
  startTime: string;
  endTime: string;
  capacity: number;
  isAvailable: boolean;
}

export interface Facility {
  name: string;
  available: boolean;
}

export interface OperatingHours {
  monday: DayHours;
  tuesday: DayHours;
  wednesday: DayHours;
  thursday: DayHours;
  friday: DayHours;
  saturday: DayHours;
  sunday: DayHours;
}

export interface DayHours {
  open: string;
  close: string;
  isClosed: boolean;
}

export interface ContactInfo {
  phone?: string;
  email?: string;
  website?: string;
}

export interface SocialMedia {
  facebook?: string;
  instagram?: string;
  twitter?: string;
}

export interface Geometry {
  type: 'Point';
  coordinates: [number, number]; // [longitude, latitude]
}

export interface MuseumImage {
  url: string;
  filename: string;
  order: number;
}

export interface Museum {
  _id: string;
  title: string;
  description: string;
  images: MuseumImage[];
  ticketTypes: TicketTypeInfo[];
  dailyCapacity: number;
  timeSlots: TimeSlot[];
  location: string;
  city: string;
  state: string;
  country: string;
  zipCode?: string;
  geometry: Geometry;
  category: MuseumCategory;
  operatingHours: OperatingHours;
  facilities: Facility[];
  contactInfo: ContactInfo;
  socialMedia: SocialMedia;
  virtualTourUrl?: string;
  hasAudioGuide: boolean;
  audioGuidePrice?: number;
  reviews: string[]; // Review IDs
  averageRating: number;
  totalReviews: number;
  owner: string; // User ID
  status: MuseumStatus;
  isVerified: boolean;
  isFeatured: boolean;
  viewCount: number;
  totalBookings: number;
  createdAt: Date;
  updatedAt: Date;
}

// ==========================================
// BOOKING TYPES
// ==========================================

export interface Visitor {
  name: string;
  age: number;
  ticketType: TicketType;
}

export interface TicketBreakdown {
  type: TicketType;
  quantity: number;
  pricePerTicket: number;
  subtotal: number;
}

export interface Payment {
  razorpayOrderId: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  paymentMethod?: string;
  paidAt?: Date;
  refundId?: string;
  refundedAt?: Date;
  refundAmount?: number;
}

export interface BookingContactInfo {
  name: string;
  phone: string;
  email: string;
  address: string;
}

export interface BookingTimeSlot {
  startTime: string;
  endTime: string;
}

export interface Booking {
  _id: string;
  bookingReference: string;
  qrCode: string;
  user: string | User; // User ID or populated User
  contactInfo: BookingContactInfo;
  identityType: IdentityType;
  identityNumber?: string;
  museum: string | Museum; // Museum ID or populated Museum
  visitDate: Date;
  timeSlot: BookingTimeSlot;
  visitors: Visitor[];
  totalVisitors: number;
  ticketBreakdown: TicketBreakdown[];
  subtotal: number;
  tax: number;
  platformFee: number;
  totalAmount: number;
  payment: Payment;
  status: BookingStatus;
  isCheckedIn: boolean;
  checkedInAt?: Date;
  cancellationReason?: string;
  cancelledAt?: Date;
  cancelledBy?: string;
  confirmationEmailSent: boolean;
  reminderEmailSent: boolean;
  hasAudioGuide: boolean;
  audioGuideQuantity: number;
  specialRequirements?: string;
  wheelchairAccess: boolean;
  bookedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

// ==========================================
// REVIEW TYPES
// ==========================================

export interface ReviewImage {
  url: string;
  filename: string;
}

export interface ReviewResponse {
  comment: string;
  respondedBy: string | User;
  respondedAt: Date;
}

export interface Review {
  _id: string;
  title: string;
  comment: string;
  rating: number;
  images: ReviewImage[];
  pros?: string[];
  cons?: string[];
  author: string | User;
  museum: string | Museum;
  booking?: string | Booking;
  isVerifiedVisit: boolean;
  visitDate?: Date;
  helpfulCount: number;
  helpfulBy: string[];
  response?: ReviewResponse;
  status: ReviewStatus;
  moderationNote?: string;
  createdAt: Date;
  updatedAt: Date;
}

// ==========================================
// FORM TYPES
// ==========================================

export interface CreateMuseumFormData {
  title: string;
  description: string;
  images: File[];
  ticketTypes: TicketTypeInfo[];
  dailyCapacity: number;
  timeSlots: TimeSlot[];
  location: string;
  city: string;
  state: string;
  country: string;
  zipCode?: string;
  coordinates: [number, number];
  category: MuseumCategory;
  operatingHours: OperatingHours;
  facilities: Facility[];
  contactInfo: ContactInfo;
  socialMedia: SocialMedia;
  virtualTourUrl?: string;
  hasAudioGuide: boolean;
  audioGuidePrice?: number;
}

export interface CreateBookingFormData {
  museumId: string;
  visitDate: Date;
  timeSlot: BookingTimeSlot;
  visitors: Visitor[];
  ticketBreakdown: TicketBreakdown[];
  contactInfo: BookingContactInfo;
  identityType: IdentityType;
  identityNumber?: string;
  hasAudioGuide: boolean;
  audioGuideQuantity: number;
  specialRequirements?: string;
  wheelchairAccess: boolean;
}

export interface CreateReviewFormData {
  museumId: string;
  title: string;
  comment: string;
  rating: number;
  images?: File[];
  pros?: string[];
  cons?: string[];
  bookingId?: string;
}

export interface UpdateProfileFormData {
  username?: string;
  phone?: string;
  address?: string;
}

// ==========================================
// FILTER TYPES
// ==========================================

export interface MuseumFilters {
  category?: MuseumCategory;
  city?: string;
  country?: string;
  search?: string;
  minRating?: number;
  isFeatured?: boolean;
  page?: number;
  limit?: number;
  sortBy?: 'createdAt' | 'averageRating' | 'title';
  sortOrder?: 'asc' | 'desc';
}

export interface BookingFilters {
  status?: BookingStatus;
  museumId?: string;
  startDate?: Date;
  endDate?: Date;
  page?: number;
  limit?: number;
  sortBy?: 'createdAt' | 'visitDate';
  sortOrder?: 'asc' | 'desc';
}

export interface ReviewFilters {
  rating?: number;
  isVerifiedVisit?: boolean;
  sortBy?: 'createdAt' | 'helpfulCount';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface UserFilters {
  role?: UserRole;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: 'createdAt' | 'username';
  sortOrder?: 'asc' | 'desc';
}

// ==========================================
// STATISTICS TYPES
// ==========================================

export interface UserStats {
  totalBookings: number;
  completedBookings: number;
  totalReviews: number;
  totalSpent: number;
}

export interface MuseumStats {
  totalBookings: number;
  completedBookings: number;
  totalRevenue: number;
  totalVisitors: number;
  recentBookings: number;
  averageRating: number;
  totalReviews: number;
  viewCount: number;
}

export interface PlatformStats {
  totalMuseums: number;
  activeMuseums: number;
  pendingMuseums: number;
  museumsByCategory: Array<{
    _id: string;
    count: number;
  }>;
  totalBookings: number;
  totalRevenue: number;
  totalUsers: number;
}

export interface ReviewStats {
  totalReviews: number;
  verifiedReviews: number;
  averageRating: number;
  ratingDistribution: Array<{
    _id: number;
    count: number;
  }>;
}

// ==========================================
// API RESPONSE TYPES
// ==========================================

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface ApiSuccessResponse<T = any> {
  success: true;
  message?: string;
  data: T;
  pagination?: PaginationInfo;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  error?: string;
  errors?: Array<{
    field: string;
    message: string;
  }>;
}

export type ApiResponse<T = any> = ApiSuccessResponse<T> | ApiErrorResponse;

// ==========================================
// RAZORPAY TYPES
// ==========================================

export interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: RazorpayResponse) => void;
  prefill: {
    name: string;
    email: string;
    contact: string;
  };
  theme: {
    color: string;
  };
}

export interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

export type MuseumFormData = {
  title: string;
  description: string;
  category: string;
  virtualTourUrl: string;

  location: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  latitude: string | number;
  longitude: string | number;

  dailyCapacity: number;
  ticketTypes: TicketTypeInfo[];
  timeSlots: TimeSlot[];

  facilities: Facility[];

  hasAudioGuide: boolean;
  audioGuidePrice: number;

  operatingHours: OperatingHours;

  contactPhone: string;
  contactEmail: string;
  contactWebsite: string;

  facebook: string;
  instagram: string;
  twitter: string;
};



// ==========================================
// UTILITY TYPES
// ==========================================

export type WithId<T> = T & { _id: string };
export type WithDates<T> = T & { createdAt: Date; updatedAt: Date };
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;