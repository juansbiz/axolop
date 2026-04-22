/**
 * Validated API Client
 *
 * Wraps the base API instance with validation and error handling.
 * Ensures all responses conform to the standard structure:
 * - { success: true, data: {...}, code: 'SUCCESS' }
 * - { success: false, error: 'message', code: 'ERROR_CODE' }
 *
 * Provides safe access methods that handle errors gracefully.
 */

import api from '../lib/api.js';

/**
 * Validate response structure
 * @param {*} response - API response data
 * @returns {boolean} - True if valid, false otherwise
 */
function isValidResponse(response) {
  if (!response || typeof response !== 'object') return false;
  if (!('success' in response)) return false;

  if (response.success) {
    // Success response should have 'data' field
    return 'data' in response;
  } else {
    // Error response should have 'error' field
    return 'error' in response;
  }
}

/**
 * Safe GET request
 * @param {string} path - API path
 * @param {Object} config - Axios config options
 * @returns {Promise} - { success, data, error, code }
 */
export async function safeGet(path, config = {}) {
  try {
    const response = await api.get(path, config);

    if (!isValidResponse(response.data)) {
      console.warn(`Invalid response structure from ${path}:`, response.data);
      return {
        success: false,
        data: null,
        error: 'Invalid response structure from server',
        code: 'INVALID_RESPONSE',
      };
    }

    if (response.data.success) {
      return {
        success: true,
        data: response.data.data,
        code: response.data.code,
      };
    } else {
      return {
        success: false,
        data: null,
        error: response.data.error,
        code: response.data.code,
      };
    }
  } catch (error) {
    return {
      success: false,
      data: null,
      error: error.response?.data?.error || error.message || 'Network error',
      code: error.response?.data?.code || 'NETWORK_ERROR',
      statusCode: error.response?.status,
    };
  }
}

/**
 * Safe POST request
 * @param {string} path - API path
 * @param {Object} data - Request body
 * @param {Object} config - Axios config options
 * @returns {Promise} - { success, data, error, code }
 */
export async function safePost(path, data, config = {}) {
  try {
    const response = await api.post(path, data, config);

    if (!isValidResponse(response.data)) {
      console.warn(`Invalid response structure from ${path}:`, response.data);
      return {
        success: false,
        data: null,
        error: 'Invalid response structure from server',
        code: 'INVALID_RESPONSE',
      };
    }

    if (response.data.success) {
      return {
        success: true,
        data: response.data.data,
        code: response.data.code,
      };
    } else {
      return {
        success: false,
        data: null,
        error: response.data.error,
        code: response.data.code,
      };
    }
  } catch (error) {
    return {
      success: false,
      data: null,
      error: error.response?.data?.error || error.message || 'Network error',
      code: error.response?.data?.code || 'NETWORK_ERROR',
      statusCode: error.response?.status,
    };
  }
}

/**
 * Safe PUT request
 * @param {string} path - API path
 * @param {Object} data - Request body
 * @param {Object} config - Axios config options
 * @returns {Promise} - { success, data, error, code }
 */
export async function safePut(path, data, config = {}) {
  try {
    const response = await api.put(path, data, config);

    if (!isValidResponse(response.data)) {
      console.warn(`Invalid response structure from ${path}:`, response.data);
      return {
        success: false,
        data: null,
        error: 'Invalid response structure from server',
        code: 'INVALID_RESPONSE',
      };
    }

    if (response.data.success) {
      return {
        success: true,
        data: response.data.data,
        code: response.data.code,
      };
    } else {
      return {
        success: false,
        data: null,
        error: response.data.error,
        code: response.data.code,
      };
    }
  } catch (error) {
    return {
      success: false,
      data: null,
      error: error.response?.data?.error || error.message || 'Network error',
      code: error.response?.data?.code || 'NETWORK_ERROR',
      statusCode: error.response?.status,
    };
  }
}

/**
 * Safe DELETE request
 * @param {string} path - API path
 * @param {Object} config - Axios config options
 * @returns {Promise} - { success, data, error, code }
 */
export async function safeDelete(path, config = {}) {
  try {
    const response = await api.delete(path, config);

    // DELETE might return 204 No Content (no response body)
    if (response.status === 204) {
      return {
        success: true,
        data: null,
        code: 'SUCCESS',
      };
    }

    if (!isValidResponse(response.data)) {
      console.warn(`Invalid response structure from ${path}:`, response.data);
      return {
        success: false,
        data: null,
        error: 'Invalid response structure from server',
        code: 'INVALID_RESPONSE',
      };
    }

    if (response.data.success) {
      return {
        success: true,
        data: response.data.data,
        code: response.data.code,
      };
    } else {
      return {
        success: false,
        data: null,
        error: response.data.error,
        code: response.data.code,
      };
    }
  } catch (error) {
    return {
      success: false,
      data: null,
      error: error.response?.data?.error || error.message || 'Network error',
      code: error.response?.data?.code || 'NETWORK_ERROR',
      statusCode: error.response?.status,
    };
  }
}

/**
 * Create a validated request with retry support
 * @param {Function} requestFn - Function that makes the API request
 * @param {number} maxRetries - Maximum number of retries
 * @param {number} delayMs - Delay between retries in milliseconds
 * @returns {Promise} - { success, data, error, code }
 */
export async function withRetry(requestFn, maxRetries = 3, delayMs = 1000) {
  let lastError = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    const result = await requestFn();

    // Retry only on network errors or 5xx errors, not on 4xx client errors
    if (result.success || (result.statusCode && result.statusCode < 500)) {
      return result;
    }

    lastError = result;

    // Wait before retrying (except on last attempt)
    if (attempt < maxRetries) {
      await new Promise((resolve) => setTimeout(resolve, delayMs * attempt));
    }
  }

  return lastError || {
    success: false,
    data: null,
    error: 'Request failed after retries',
    code: 'MAX_RETRIES_EXCEEDED',
  };
}

/**
 * Safe request with retry
 * @param {'get'|'post'|'put'|'delete'} method - HTTP method
 * @param {string} path - API path
 * @param {Object} data - Request data (for post/put)
 * @param {Object} options - { maxRetries, delayMs }
 * @returns {Promise} - { success, data, error, code }
 */
export async function safeRequest(method, path, data = null, options = {}) {
  const { maxRetries = 3, delayMs = 1000 } = options;

  return withRetry(async () => {
    switch (method.toLowerCase()) {
      case 'get':
        return safeGet(path);
      case 'post':
        return safePost(path, data);
      case 'put':
        return safePut(path, data);
      case 'delete':
        return safeDelete(path);
      default:
        return {
          success: false,
          data: null,
          error: `Unknown method: ${method}`,
          code: 'INVALID_METHOD',
        };
    }
  }, maxRetries, delayMs);
}

export default {
  safeGet,
  safePost,
  safePut,
  safeDelete,
  withRetry,
  safeRequest,
};
