/**
 * Date Utilities
 * Helper functions for date formatting and manipulation
 */

/**
 * Format a date as relative time (e.g., "2 hours ago", "yesterday")
 * @param {string|Date} date - Date to format
 * @returns {string} Relative time string
 */
export function formatRelativeTime(date) {
  if (!date) return '';

  const now = new Date();
  const then = new Date(date);
  const diffMs = now - then;
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSeconds < 60) {
    return 'just now';
  }

  if (diffMinutes < 60) {
    return diffMinutes === 1 ? '1 min ago' : `${diffMinutes} mins ago`;
  }

  if (diffHours < 24) {
    return diffHours === 1 ? '1 hour ago' : `${diffHours} hours ago`;
  }

  if (diffDays === 1) {
    return 'yesterday';
  }

  if (diffDays < 7) {
    return `${diffDays} days ago`;
  }

  // For older dates, show the actual date
  const options = { month: 'short', day: 'numeric' };
  if (then.getFullYear() !== now.getFullYear()) {
    options.year = 'numeric';
  }

  return then.toLocaleDateString('en-US', options);
}

/**
 * Format a date for display
 * @param {string|Date} date - Date to format
 * @param {Object} options - Intl.DateTimeFormat options
 * @returns {string} Formatted date string
 */
export function formatDate(date, options = {}) {
  if (!date) return '';

  const defaultOptions = {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    ...options,
  };

  return new Date(date).toLocaleDateString('en-US', defaultOptions);
}

/**
 * Format a time for display
 * @param {string|Date} date - Date to format
 * @param {boolean} includeSeconds - Whether to include seconds
 * @returns {string} Formatted time string
 */
export function formatTime(date, includeSeconds = false) {
  if (!date) return '';

  const options = {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  };

  if (includeSeconds) {
    options.second = '2-digit';
  }

  return new Date(date).toLocaleTimeString('en-US', options);
}

export default {
  formatRelativeTime,
  formatDate,
  formatTime,
};
