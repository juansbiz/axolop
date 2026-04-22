/**
 * Centralized API Helper Utilities
 *
 * Provides common API call patterns, query building, response handling, and retry logic.
 * Complements existing lib/api.js with higher-level utilities.
 */

import { handleApiError } from './errorHandlers';

/**
 * Build query string from object
 * @param {Object} params - Query parameters
 * @returns {string} Query string (without leading ?)
 *
 * @example
 * buildQueryString({ page: 1, limit: 10, status: 'active' })
 * // Returns: "page=1&limit=10&status=active"
 */
export const buildQueryString = (params) => {
  if (!params || typeof params !== 'object') return '';

  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    // Skip null, undefined, and empty strings
    if (value === null || value === undefined || value === '') return;

    // Handle arrays
    if (Array.isArray(value)) {
      value.forEach((item) => {
        if (item !== null && item !== undefined) {
          searchParams.append(key, String(item));
        }
      });
    } else {
      searchParams.append(key, String(value));
    }
  });

  return searchParams.toString();
};

/**
 * Build full URL with query string
 * @param {string} baseUrl - Base URL
 * @param {Object} params - Query parameters
 * @returns {string} Full URL
 */
export const buildUrl = (baseUrl, params = {}) => {
  const queryString = buildQueryString(params);
  if (!queryString) return baseUrl;

  const separator = baseUrl.includes('?') ? '&' : '?';
  return `${baseUrl}${separator}${queryString}`;
};

/**
 * Parse API response to extract data
 * Handles various response formats from different APIs
 * @param {Object} response - Axios response
 * @returns {any} Response data
 */
export const parseResponse = (response) => {
  // Direct data response
  if (response.data) {
    // Standard format: { success: true, data: [...] }
    if (response.data.data !== undefined) {
      return response.data.data;
    }

    // Supabase format: { data: [...], error: null }
    if (response.data.error !== undefined) {
      return response.data.data || response.data;
    }

    // Direct data
    return response.data;
  }

  return response;
};

/**
 * Parse paginated response
 * @param {Object} response - API response
 * @returns {Object} { data, pagination: { page, limit, total, totalPages } }
 */
export const parsePaginatedResponse = (response) => {
  const data = parseResponse(response);

  return {
    data: Array.isArray(data) ? data : data.items || data.results || [],
    pagination: {
      page: data.page || data.currentPage || 1,
      limit: data.limit || data.pageSize || data.per_page || 10,
      total: data.total || data.totalCount || data.total_count || 0,
      totalPages: data.totalPages || data.total_pages || Math.ceil((data.total || 0) / (data.limit || 10)),
    },
  };
};

/**
 * Retry function with exponential backoff
 * @param {Function} fn - Async function to retry
 * @param {Object} options - Retry options
 * @param {number} options.maxAttempts - Maximum retry attempts (default: 3)
 * @param {number} options.delay - Initial delay in ms (default: 1000)
 * @param {number} options.backoff - Backoff multiplier (default: 2)
 * @param {Function} options.shouldRetry - Function to determine if should retry
 * @returns {Promise<any>}
 *
 * @example
 * const data = await retryRequest(
 *   () => api.get('/contacts'),
 *   { maxAttempts: 3, delay: 1000 }
 * );
 */
export const retryRequest = async (fn, options = {}) => {
  const {
    maxAttempts = 3,
    delay = 1000,
    backoff = 2,
    shouldRetry = (error) => {
      // Retry on network errors or 5xx errors
      return (
        error.response?.status >= 500 ||
        error.request && !error.response
      );
    },
  } = options;

  let lastError;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      // Don't retry if shouldRetry returns false
      if (!shouldRetry(error)) {
        throw error;
      }

      // Don't delay on last attempt
      if (attempt < maxAttempts) {
        const waitTime = delay * Math.pow(backoff, attempt - 1);

        if (import.meta.env.DEV) {
          console.log(`[RETRY] Attempt ${attempt}/${maxAttempts} failed. Retrying in ${waitTime}ms...`);
        }

        await new Promise((resolve) => setTimeout(resolve, waitTime));
      }
    }
  }

  throw lastError;
};

/**
 * Batch API requests with concurrency limit
 * @param {Array<Function>} requests - Array of request functions
 * @param {number} concurrency - Maximum concurrent requests
 * @returns {Promise<Array>} Array of results
 *
 * @example
 * const contacts = await batchRequests(
 *   ids.map(id => () => contactsApi.get(id)),
 *   5 // Max 5 concurrent requests
 * );
 */
export const batchRequests = async (requests, concurrency = 5) => {
  const results = [];
  const executing = [];

  for (const request of requests) {
    const promise = request().then((result) => {
      executing.splice(executing.indexOf(promise), 1);
      return result;
    });

    results.push(promise);
    executing.push(promise);

    if (executing.length >= concurrency) {
      await Promise.race(executing);
    }
  }

  return Promise.all(results);
};

/**
 * Debounce API calls
 * @param {Function} fn - Function to debounce
 * @param {number} delay - Delay in ms
 * @returns {Function} Debounced function
 */
export const debounceApiCall = (fn, delay = 300) => {
  let timeoutId;

  return (...args) => {
    return new Promise((resolve, reject) => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      timeoutId = setTimeout(async () => {
        try {
          const result = await fn(...args);
          resolve(result);
        } catch (error) {
          reject(error);
        }
      }, delay);
    });
  };
};

/**
 * Create abort controller with timeout
 * @param {number} timeout - Timeout in ms
 * @returns {AbortController}
 */
export const createAbortController = (timeout = 30000) => {
  const controller = new AbortController();

  if (timeout > 0) {
    setTimeout(() => {
      controller.abort(new Error('Request timeout'));
    }, timeout);
  }

  return controller;
};

/**
 * Safe API call with error handling
 * @param {Function} fn - API call function
 * @param {Object} options - Error handling options
 * @returns {Promise<{data: any, error: Error|null}>}
 *
 * @example
 * const { data, error } = await safeApiCall(
 *   () => contactsApi.getAll(),
 *   { context: 'loading contacts', toast }
 * );
 * if (error) return; // Error already handled
 */
export const safeApiCall = async (fn, options = {}) => {
  try {
    const data = await fn();
    return { data, error: null };
  } catch (error) {
    handleApiError(error, options);
    return { data: null, error };
  }
};

/**
 * Create API call wrapper with common options
 * @param {Object} defaultOptions - Default options for all calls
 * @returns {Object} API helpers bound to options
 */
export const createApiHelpers = (defaultOptions = {}) => {
  return {
    safeCall: (fn, options = {}) =>
      safeApiCall(fn, { ...defaultOptions, ...options }),

    retry: (fn, options = {}) =>
      retryRequest(fn, { ...defaultOptions, ...options }),

    batch: (requests, concurrency) =>
      batchRequests(requests, concurrency),
  };
};

/**
 * Transform Supabase response to standard format
 * @param {Object} supabaseResponse - Response from Supabase client
 * @returns {Object} { data, error }
 */
export const transformSupabaseResponse = (supabaseResponse) => {
  const { data, error } = supabaseResponse;

  if (error) {
    return {
      data: null,
      error: new Error(error.message || 'Database error'),
    };
  }

  return { data, error: null };
};

/**
 * Build filters for Supabase queries
 * @param {Object} filters - Filter object
 * @returns {Array<Object>} Array of filter operations
 *
 * @example
 * const filters = buildSupabaseFilters({
 *   status: 'active',
 *   created_at: { gte: '2025-01-01' },
 *   name: { ilike: '%john%' }
 * });
 * // Apply to query:
 * let query = supabase.from('contacts').select('*');
 * filters.forEach(({ field, operator, value }) => {
 *   query = query[operator](field, value);
 * });
 */
export const buildSupabaseFilters = (filters) => {
  const operations = [];

  Object.entries(filters).forEach(([field, value]) => {
    if (value === null || value === undefined) return;

    // Complex filter with operator
    if (typeof value === 'object' && !Array.isArray(value)) {
      Object.entries(value).forEach(([operator, filterValue]) => {
        operations.push({ field, operator, value: filterValue });
      });
    } else {
      // Simple equality filter
      operations.push({ field, operator: 'eq', value });
    }
  });

  return operations;
};

// Export all helpers
export default {
  buildQueryString,
  buildUrl,
  parseResponse,
  parsePaginatedResponse,
  retryRequest,
  batchRequests,
  debounceApiCall,
  createAbortController,
  safeApiCall,
  createApiHelpers,
  transformSupabaseResponse,
  buildSupabaseFilters,
};
