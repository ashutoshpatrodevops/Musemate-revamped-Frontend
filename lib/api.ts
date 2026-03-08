// lib/api.ts

import { API_URL } from './constants';

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  /**
   * Make API request
   */
  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    token?: string
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;

    // Fix: Create headers as a plain object first
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    // Merge existing headers from options
    if (options.headers) {
      const existingHeaders = new Headers(options.headers);
      existingHeaders.forEach((value, key) => {
        headers[key] = value;
      });
    }

    // Add auth token if provided
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.message || 'Request failed',
        };
      }

      return data;
    } catch (error: any) {
      console.error('API Error:', error);
      return {
        success: false,
        error: error.message || 'Network error',
      };
    }
  }

  // ==========================================
  // PUBLIC METHODS
  // ==========================================

  /**
   * GET request
   */
  async get<T>(endpoint: string, token?: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET' }, token);
  }

  /**
   * POST request
   */
  async post<T>(
    endpoint: string,
    body: any,
    token?: string
  ): Promise<ApiResponse<T>> {
    return this.request<T>(
      endpoint,
      {
        method: 'POST',
        body: JSON.stringify(body),
      },
      token
    );
  }

  /**
   * PUT request
   */
  async put<T>(
    endpoint: string,
    body: any,
    token?: string
  ): Promise<ApiResponse<T>> {
    return this.request<T>(
      endpoint,
      {
        method: 'PUT',
        body: JSON.stringify(body),
      },
      token
    );
  }

  /**
   * DELETE request
   */
  async delete<T>(endpoint: string, token?: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' }, token);
  }

  /**
   * Upload file (multipart/form-data)
   */
  async uploadFile<T>(
    endpoint: string,
    formData: FormData,
    token?: string
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;

    const headers: Record<string, string> = {};

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.message || 'Upload failed',
        };
      }

      return data;
    } catch (error: any) {
      console.error('Upload Error:', error);
      return {
        success: false,
        error: error.message || 'Upload failed',
      };
    }
  }
}

// Create and export API client instance
export const api = new ApiClient(API_URL);

// ==========================================
// API ENDPOINT HELPERS
// ==========================================

export const endpoints = {
  // Auth & Users
  users: {
    profile: '/users/profile',
    updateProfile: '/users/profile',
    bookings: '/users/bookings',
    reviews: '/users/reviews',
    stats: '/users/stats',
    watchlist: '/users/watchlist',
    addToWatchlist: (museumId: string) => `/users/watchlist/add/${museumId}`,
    removeFromWatchlist: (museumId: string) => `/users/watchlist/remove/${museumId}`,
  },

  // Museums
  museums: {
    list: '/museums',
    detail: (id: string) => `/museums/${id}`,
    featured: '/museums/featured',
    search: '/museums/search',
    nearby: '/museums/nearby',
    category: (category: string) => `/museums/category/${category}`,
    create: '/museums/create',
    update: (id: string) => `/museums/${id}`,
    delete: (id: string) => `/museums/${id}`,
    myMuseums: '/museums/my-museums',
    stats: (id: string) => `/museums/${id}/stats`,
  },

  // Bookings
  bookings: {
    create: '/bookings/create',
    verifyPayment: '/bookings/verify-payment',
    myBookings: '/bookings/my-bookings',
    upcoming: '/bookings/upcoming',
    detail: (id: string) => `/bookings/${id}`,
    reference: (ref: string) => `/bookings/reference/${ref}`,
   cancel: (id: string) => `/bookings/${id}/cancel`,
    download: (id: string) => `/bookings/download/${id}`,
    checkIn: '/bookings/check-in',
    museumBookings: (museumId: string) => `/bookings/museum/${museumId}`,
    museumStats: (museumId: string) => `/bookings/museum/${museumId}/stats`,

  },

  // Reviews
  reviews: {
    create: '/reviews/create',
    museumReviews: (museumId: string) => `/reviews/museum/${museumId}`,
    detail: (id: string) => `/reviews/${id}`,
    update: (id: string) => `/reviews/${id}`,
    delete: (id: string) => `/reviews/${id}`,
    myReviews: '/reviews/my-reviews/list',
    markHelpful: (id: string) => `/reviews/${id}/helpful`,
    respond: (id: string) => `/reviews/${id}/respond`,
    flag: (id: string) => `/reviews/${id}/flag`,
    stats: (museumId: string) => `/reviews/museum/${museumId}/stats`,
  },

  // Upload
  upload: {
    image: '/upload/image',
    images: '/upload/images',
    delete: '/upload/image',
  },

  // Chat
  chat: {
    message: '/chat/message',
  },

  // Admin
  admin: {
    users: '/users/admin/all',
    museums: '/museums/admin/all',
    bookings: '/bookings/admin/all',
    reviews: '/reviews/admin/all',
    platformStats: '/museums/admin/platform-stats',
  },
};