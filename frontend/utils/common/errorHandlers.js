/**
 * Centralized Error Handling Utilities
 *
 * Consolidates 180+ instances of duplicate error handling across the codebase.
 * Provides consistent error formatting, logging, and user-friendly messages.
 */

import * as Sentry from '@sentry/react';

/**
 * Extract user-friendly error message from various error types
 * @param {Error|Object|string} error - Error object or message
 * @returns {string} User-friendly error message
 */
export const getErrorMessage = (error) => {
  if (!error) return 'An unknown error occurred';

  // String error
  if (typeof error === 'string') return error;

  // Error object with message
  if (error.message) return error.message;

  // API error response
  if (error.response?.data?.error) {
    return error.response.data.error;
  }

  if (error.response?.data?.message) {
    return error.response.data.message;
  }

  // Axios error
  if (error.response?.statusText) {
    return error.response.statusText;
  }

  // Network error
  if (error.request && !error.response) {
    return 'Network error. Please check your connection.';
  }

  // Supabase error
  if (error.code && error.message) {
    return error.message;
  }

  return 'An unexpected error occurred';
};

/**
 * Format error for display in toast notifications
 * @param {Error|Object|string} error
 * @param {string} context - Context where error occurred (e.g., "loading contacts")
 * @returns {Object} { title, description }
 */
export const formatErrorForToast = (error, context = null) => {
  const message = getErrorMessage(error);

  return {
    title: context ? `Error ${context}` : 'Error',
    description: message,
    variant: 'destructive',
  };
};

/**
 * Handle API error with logging and optional toast
 * @param {Error} error - Error object
 * @param {Object} options - Configuration options
 * @param {string} options.context - Error context
 * @param {Function} options.toast - Toast function from useToast()
 * @param {boolean} options.silent - Don't show toast (default: false)
 * @param {boolean} options.logToSentry - Log to Sentry (default: true)
 * @param {Object} options.extra - Extra context for logging
 * @returns {string} Error message
 */
export const handleApiError = (error, options = {}) => {
  const {
    context = null,
    toast = null,
    silent = false,
    logToSentry = true,
    extra = {},
  } = options;

  const message = getErrorMessage(error);

  // Log to console in development
  if (import.meta.env.DEV) {
    console.error(`[ERROR]${context ? ` ${context}:` : ''}`, error);
    if (Object.keys(extra).length > 0) {
      console.error('[ERROR] Extra context:', extra);
    }
  }

  // Log to Sentry
  if (logToSentry && !import.meta.env.DEV) {
    Sentry.captureException(error, {
      tags: {
        errorType: 'api_error',
        context: context || 'unknown',
      },
      extra: {
        message,
        ...extra,
      },
    });
  }

  // Show toast notification
  if (!silent && toast) {
    toast(formatErrorForToast(error, context));
  }

  return message;
};

/**
 * Wrap async function with error handling
 * @param {Function} fn - Async function to wrap
 * @param {Object} options - Error handling options
 * @returns {Function} Wrapped function
 *
 * @example
 * const saveContact = withErrorHandling(
 *   async (data) => await contactsApi.create(data),
 *   { context: 'saving contact', toast }
 * );
 * await saveContact(contactData);
 */
export const withErrorHandling = (fn, options = {}) => {
  return async (...args) => {
    try {
      return await fn(...args);
    } catch (error) {
      handleApiError(error, options);
      throw error; // Re-throw to allow caller to handle if needed
    }
  };
};

/**
 * Create error handler for React components
 * @param {Function} toast - Toast function from useToast()
 * @param {string} defaultContext - Default error context
 * @returns {Function} Error handler function
 *
 * @example
 * const { toast } = useToast();
 * const handleError = createErrorHandler(toast, 'Contacts page');
 * try {
 *   await contactsApi.delete(id);
 * } catch (error) {
 *   handleError(error, 'deleting contact');
 * }
 */
export const createErrorHandler = (toast, defaultContext = null) => {
  return (error, context = null) => {
    handleApiError(error, {
      context: context || defaultContext,
      toast,
    });
  };
};

/**
 * Check if error is network error
 * @param {Error} error
 * @returns {boolean}
 */
export const isNetworkError = (error) => {
  return (
    error.request &&
    !error.response &&
    (error.message?.includes('Network') || error.message?.includes('timeout'))
  );
};

/**
 * Check if error is authentication error
 * @param {Error} error
 * @returns {boolean}
 */
export const isAuthError = (error) => {
  return (
    error.response?.status === 401 ||
    error.response?.status === 403 ||
    error.code === 'PGRST301' || // Supabase auth error
    error.message?.toLowerCase().includes('unauthorized') ||
    error.message?.toLowerCase().includes('not authenticated')
  );
};

/**
 * Check if error is validation error
 * @param {Error} error
 * @returns {boolean}
 */
export const isValidationError = (error) => {
  return (
    error.response?.status === 400 ||
    error.response?.status === 422 ||
    error.code === 'PGRST102' || // Supabase validation error
    error.message?.toLowerCase().includes('validation') ||
    error.message?.toLowerCase().includes('invalid')
  );
};

/**
 * Check if error is rate limit error
 * @param {Error} error
 * @returns {boolean}
 */
export const isRateLimitError = (error) => {
  return (
    error.response?.status === 429 ||
    error.message?.toLowerCase().includes('rate limit') ||
    error.message?.toLowerCase().includes('too many requests')
  );
};

/**
 * Get retry-after time from rate limit error
 * @param {Error} error
 * @returns {number} Seconds to wait before retry
 */
export const getRetryAfter = (error) => {
  if (error.response?.headers?.['retry-after']) {
    return parseInt(error.response.headers['retry-after'], 10);
  }
  return 60; // Default 60 seconds
};

/**
 * Log error to console with context
 * @param {string} context - Error context
 * @param {Error} error - Error object
 * @param {Object} extra - Extra data to log
 */
export const logError = (context, error, extra = {}) => {
  if (import.meta.env.DEV) {
    console.group(`[ERROR] ${context}`);
    console.error('Error:', error);
    if (Object.keys(extra).length > 0) {
      console.error('Context:', extra);
    }
    console.groupEnd();
  }
};

/**
 * Create standardized error object
 * @param {string} message - Error message
 * @param {string} code - Error code
 * @param {Object} details - Additional details
 * @returns {Error} Error object
 */
export const createError = (message, code = null, details = {}) => {
  const error = new Error(message);
  error.code = code;
  error.details = details;
  return error;
};

/**
 * Handle form validation errors
 * @param {Error} error - Error from API
 * @param {Object} form - React Hook Form instance
 * @returns {boolean} Whether errors were set
 */
export const handleFormErrors = (error, form) => {
  if (!form) return false;

  const errors = error.response?.data?.errors || error.response?.data?.validation;

  if (errors && typeof errors === 'object') {
    Object.entries(errors).forEach(([field, message]) => {
      form.setError(field, {
        type: 'server',
        message: Array.isArray(message) ? message[0] : message,
      });
    });
    return true;
  }

  return false;
};

// Export all error handlers
export default {
  getErrorMessage,
  formatErrorForToast,
  handleApiError,
  withErrorHandling,
  createErrorHandler,
  isNetworkError,
  isAuthError,
  isValidationError,
  isRateLimitError,
  getRetryAfter,
  logError,
  createError,
  handleFormErrors,
};
