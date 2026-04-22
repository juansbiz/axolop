/**
 * Centralized Date Formatting Utilities
 *
 * Consolidates 70+ instances of duplicate date formatting across the codebase.
 * Wraps existing formatters.js for backwards compatibility while adding convenience functions.
 *
 * Uses date-fns and Intl API for locale-aware formatting.
 */

import {
  formatDate as formatDateBase,
  formatDateShort as formatDateShortBase,
  formatDateLong as formatDateLongBase,
  formatDateTime as formatDateTimeBase,
  formatRelativeTime as formatRelativeTimeBase,
  formatRelativeDate as formatRelativeDateBase,
  formatTime as formatTimeBase,
} from '@/utils/formatters';
import { format, parseISO, isValid, startOfDay, endOfDay, isToday, isYesterday, isTomorrow, differenceInDays } from 'date-fns';

/**
 * Get current language from i18n or localStorage
 */
const getCurrentLanguage = () => {
  // Try to get from i18n instance
  if (typeof window !== 'undefined') {
    const storedLang = localStorage.getItem('i18nextLng') || 'en';
    return storedLang.split('-')[0]; // Extract 'en' from 'en-US'
  }
  return 'en';
};

/**
 * Parse any date input to Date object
 * @param {Date|string|number} date - Date input
 * @returns {Date|null}
 */
const parseDate = (date) => {
  if (!date) return null;

  if (date instanceof Date) {
    return isValid(date) ? date : null;
  }

  if (typeof date === 'string') {
    const parsed = parseISO(date);
    return isValid(parsed) ? parsed : null;
  }

  if (typeof date === 'number') {
    const parsed = new Date(date);
    return isValid(parsed) ? parsed : null;
  }

  return null;
};

/**
 * Format date with automatic language detection
 * @param {Date|string} date
 * @param {string} formatStr - date-fns format string
 * @returns {string}
 */
export const formatDate = (date, formatStr = 'PP') => {
  const lang = getCurrentLanguage();
  return formatDateBase(date, formatStr, lang);
};

/**
 * Format date as short format (Dec 7, 2025 / 7 dic 2025)
 * @param {Date|string} date
 * @returns {string}
 */
export const formatDateShort = (date) => {
  const lang = getCurrentLanguage();
  return formatDateShortBase(date, lang);
};

/**
 * Format date as long format (December 7, 2025 / 7 de diciembre de 2025)
 * @param {Date|string} date
 * @returns {string}
 */
export const formatDateLong = (date) => {
  const lang = getCurrentLanguage();
  return formatDateLongBase(date, lang);
};

/**
 * Format date with time (Dec 7, 2025, 3:30 PM / 7 dic 2025, 15:30)
 * @param {Date|string} date
 * @returns {string}
 */
export const formatDateTime = (date) => {
  const lang = getCurrentLanguage();
  return formatDateTimeBase(date, lang);
};

/**
 * Format date as relative time (2 hours ago / hace 2 horas)
 * @param {Date|string} date
 * @returns {string}
 */
export const formatRelativeTime = (date) => {
  const lang = getCurrentLanguage();
  return formatRelativeTimeBase(date, lang);
};

/**
 * Format date as relative to today (today, yesterday, etc.)
 * @param {Date|string} date
 * @returns {string}
 */
export const formatRelativeDate = (date) => {
  const lang = getCurrentLanguage();
  return formatRelativeDateBase(date, lang);
};

/**
 * Format time only (3:30 PM / 15:30)
 * @param {Date|string} date
 * @returns {string}
 */
export const formatTime = (date) => {
  const lang = getCurrentLanguage();
  return formatTimeBase(date, lang);
};

/**
 * Format date range (Dec 1 - Dec 7, 2025)
 * @param {Date|string} startDate
 * @param {Date|string} endDate
 * @returns {string}
 */
export const formatDateRange = (startDate, endDate) => {
  const start = parseDate(startDate);
  const end = parseDate(endDate);

  if (!start || !end) return '';

  const startStr = formatDateShort(start);
  const endStr = formatDateShort(end);

  return `${startStr} - ${endStr}`;
};

/**
 * Format date as "smart" relative or absolute
 * - Today/Yesterday/Tomorrow for recent dates
 * - "5 days ago" for dates within 7 days
 * - Full date for older dates
 * @param {Date|string} date
 * @returns {string}
 */
export const formatSmartDate = (date) => {
  const parsed = parseDate(date);
  if (!parsed) return '';

  if (isToday(parsed)) return 'Today';
  if (isYesterday(parsed)) return 'Yesterday';
  if (isTomorrow(parsed)) return 'Tomorrow';

  const daysDiff = Math.abs(differenceInDays(new Date(), parsed));

  if (daysDiff <= 7) {
    return formatRelativeTime(parsed);
  }

  return formatDateShort(parsed);
};

/**
 * Format date as ISO string (for API calls)
 * @param {Date|string} date
 * @returns {string}
 */
export const formatDateISO = (date) => {
  const parsed = parseDate(date);
  if (!parsed) return '';

  try {
    return parsed.toISOString();
  } catch {
    return '';
  }
};

/**
 * Format date for input[type="date"] (YYYY-MM-DD)
 * @param {Date|string} date
 * @returns {string}
 */
export const formatDateInput = (date) => {
  const parsed = parseDate(date);
  if (!parsed) return '';

  try {
    return format(parsed, 'yyyy-MM-dd');
  } catch {
    return '';
  }
};

/**
 * Format date for input[type="datetime-local"] (YYYY-MM-DDTHH:mm)
 * @param {Date|string} date
 * @returns {string}
 */
export const formatDateTimeInput = (date) => {
  const parsed = parseDate(date);
  if (!parsed) return '';

  try {
    return format(parsed, "yyyy-MM-dd'T'HH:mm");
  } catch {
    return '';
  }
};

/**
 * Get start of day for a date
 * @param {Date|string} date
 * @returns {Date}
 */
export const getStartOfDay = (date) => {
  const parsed = parseDate(date);
  return parsed ? startOfDay(parsed) : null;
};

/**
 * Get end of day for a date
 * @param {Date|string} date
 * @returns {Date}
 */
export const getEndOfDay = (date) => {
  const parsed = parseDate(date);
  return parsed ? endOfDay(parsed) : null;
};

/**
 * Check if date is valid
 * @param {Date|string} date
 * @returns {boolean}
 */
export const isValidDate = (date) => {
  return parseDate(date) !== null;
};

/**
 * Get time ago text (e.g., "2h ago", "5m ago")
 * Compact version of formatRelativeTime
 * @param {Date|string} date
 * @returns {string}
 */
export const getTimeAgo = (date) => {
  const parsed = parseDate(date);
  if (!parsed) return '';

  const now = new Date();
  const seconds = Math.floor((now - parsed) / 1000);

  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
  if (seconds < 2592000) return `${Math.floor(seconds / 604800)}w ago`;
  if (seconds < 31536000) return `${Math.floor(seconds / 2592000)}mo ago`;
  return `${Math.floor(seconds / 31536000)}y ago`;
};

// Export all formatters
export default {
  formatDate,
  formatDateShort,
  formatDateLong,
  formatDateTime,
  formatRelativeTime,
  formatRelativeDate,
  formatTime,
  formatDateRange,
  formatSmartDate,
  formatDateISO,
  formatDateInput,
  formatDateTimeInput,
  getStartOfDay,
  getEndOfDay,
  isValidDate,
  getTimeAgo,
  parseDate,
};
