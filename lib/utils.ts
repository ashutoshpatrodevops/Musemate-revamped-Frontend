// lib/utils.ts (Extend the existing one)

import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { format } from 'date-fns';
import { CURRENCY_SYMBOL } from './constants';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format currency
 */
export function formatCurrency(amount: number): string {
  return `${CURRENCY_SYMBOL}${amount.toLocaleString('en-IN')}`;
}

/**
 * Format date
 */
export function formatDate(date: Date | string, formatStr: string = 'MMM dd, yyyy'): string {
  return format(new Date(date), formatStr);
}

/**
 * Format time
 */
export function formatTime(time: string): string {
  const [hours, minutes] = time.split(':');
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${minutes} ${ampm}`;
}

/**
 * Get time from now
 */
export function getTimeFromNow(date: Date | string): string {
  const now = new Date();
  const then = new Date(date);
  const diffInMs = then.getTime() - now.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInDays < 0) return 'Past';
  if (diffInDays === 0) return 'Today';
  if (diffInDays === 1) return 'Tomorrow';
  if (diffInDays < 7) return `In ${diffInDays} days`;
  if (diffInDays < 30) return `In ${Math.floor(diffInDays / 7)} weeks`;
  return `In ${Math.floor(diffInDays / 30)} months`;
}

/**
 * Truncate text
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

/**
 * Generate initials from name
 */
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
}

/**
 * Check if date is in the past
 */
export function isPastDate(date: Date | string): boolean {
  return new Date(date) < new Date();
}

/**
 * Check if date is today
 */
export function isToday(date: Date | string): boolean {
  const today = new Date();
  const checkDate = new Date(date);
  return (
    checkDate.getDate() === today.getDate() &&
    checkDate.getMonth() === today.getMonth() &&
    checkDate.getFullYear() === today.getFullYear()
  );
}

/**
 * Validate email
 */
export function isValidEmail(email: string): boolean {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

/**
 * Validate phone number (Indian)
 */
export function isValidPhone(phone: string): boolean {
  const re = /^[6-9]\d{9}$/;
  return re.test(phone);
}

/**
 * Get status color
 */
export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-green-100 text-green-800',
    completed: 'bg-blue-100 text-blue-800',
    cancelled: 'bg-red-100 text-red-800',
    active: 'bg-green-100 text-green-800',
    inactive: 'bg-gray-100 text-gray-800',
    approved: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
    flagged: 'bg-orange-100 text-orange-800',
  };
  return colors[status.toLowerCase()] || 'bg-gray-100 text-gray-800';
}

/**
 * Calculate total from ticket breakdown
 */
export function calculateTotal(tickets: Array<{ quantity: number; pricePerTicket: number }>): number {
  return tickets.reduce((sum, ticket) => sum + (ticket.quantity * ticket.pricePerTicket), 0);
}

/**
 * Sleep utility for testing
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}