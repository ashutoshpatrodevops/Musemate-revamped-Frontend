import { api, endpoints, ApiResponse } from './api';
import { Museum, MuseumStats, Booking, Review } from '@/types/index';

export interface BookingStatsResponse {
  totalBookings: number;
  totalRevenue: number;
  totalVisitors: number;
  bookingsByStatus: Array<{
    _id: string;
    count: number;
  }>;
}

export interface MuseumBookingsResponse {
  data: Booking[];
  stats: Array<{
    _id: string;
    count: number;
    totalRevenue: number;
  }>;
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}


export const museumAdminApi = {
  // ==========================================
  // MUSEUMS
  // ==========================================
  
  /**
   * Get all museums owned by current user
   */
  async getMyMuseums(token: string) {
    return api.get<{ data: Museum[]; count: number }>(
      endpoints.museums.myMuseums,
      token
    );
  },

  /**
   * Get statistics for a specific museum
   */
  async getMuseumStats(museumId: string, token: string) {
    return api.get<MuseumStats>(
      endpoints.museums.stats(museumId),
      token
    );
  },

  /**
   * Create new museum
   */
  async createMuseum(data: any, token: string) {
    return api.post<Museum>(
      endpoints.museums.create,
      data,
      token
    );
  },

  /**
   * Update museum
   */
  async updateMuseum(museumId: string, data: any, token: string) {
    return api.put<Museum>(
      endpoints.museums.update(museumId),
      data,
      token
    );
  },

  /**
   * Delete museum
   */
  async deleteMuseum(museumId: string, token: string) {
    return api.delete(
      endpoints.museums.delete(museumId),
      token
    );
  },

  // ==========================================
  // BOOKINGS
  // ==========================================

  /**
   * Get bookings for a specific museum
   */
  async getMuseumBookings(
    museumId: string,
    params: {
      status?: string;
      startDate?: string;
      endDate?: string;
      page?: number;
      limit?: number;
    },
    token: string
  ) {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, value.toString());
      }
    });

    const endpoint = `${endpoints.bookings.museumBookings(museumId)}${
      queryParams.toString() ? `?${queryParams.toString()}` : ''
    }`;

    return api.get<MuseumBookingsResponse>(endpoint, token);
  },

  /**
   * Get booking statistics for a museum
   */
  async getMuseumBookingStats(
    museumId: string,
    params: {
      startDate?: string;
      endDate?: string;
    },
    token: string
  ) {
    const queryParams = new URLSearchParams();
    if (params.startDate) queryParams.append('startDate', params.startDate);
    if (params.endDate) queryParams.append('endDate', params.endDate);

    const endpoint = `${endpoints.bookings.museumStats(museumId)}${
      queryParams.toString() ? `?${queryParams.toString()}` : ''
    }`;

    return api.get<BookingStatsResponse>(endpoint, token);
  },

  /**
   * Check-in a booking using QR code
   */
  async checkInBooking(qrCode: string, token: string) {
    return api.post(
      endpoints.bookings.checkIn,
      { qrCode },
      token
    );
  },

  // ==========================================
  // REVIEWS
  // ==========================================

  /**
   * Get reviews for a museum
   */
  async getMuseumReviews(museumId: string, token: string) {
    return api.get<Review[]>(
      endpoints.reviews.museumReviews(museumId),
      token
    );
  },

  /**
   * Respond to a review
   */
  async respondToReview(reviewId: string, comment: string, token: string) {
    return api.post(
      endpoints.reviews.respond(reviewId),
      { comment },
      token
    );
  },
};