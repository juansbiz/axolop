/**
 * CSRF Token Utilities
 * Helper functions to get and use CSRF tokens
 *
 * Token Priority:
 * 1. window.csrfToken (set by useCSRFBootstrap hook - most reliable)
 * 2. _csrf cookie (fallback)
 */

/**
 * Get cookie value by name
 * @param {string} name - Cookie name
 * @returns {string|null} Cookie value or null
 */
export function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop().split(';').shift();
  }
  return null;
}

/**
 * Get CSRF token - prioritizes bootstrapped token over cookie
 * @returns {string|null} CSRF token or null
 */
export function getCSRFToken() {
  // Prefer the bootstrapped token from useCSRFBootstrap (most reliable)
  if (window.csrfToken) {
    return window.csrfToken;
  }
  // Fallback to cookie (may be stale after server restart)
  return getCookie('_csrf');
}

/**
 * Add CSRF token to fetch headers
 * @param {HeadersInit} headers - Existing headers object
 * @returns {HeadersInit} Headers with CSRF token added
 */
export function addCSRFToken(headers = {}) {
  const csrfToken = getCSRFToken();
  if (csrfToken) {
    return {
      ...headers,
      'x-csrf-token': csrfToken,
    };
  }
  return headers;
}

/**
 * Create fetch options with CSRF protection
 * @param {RequestInit} options - Fetch options
 * @returns {RequestInit} Options with CSRF token in headers
 */
export function withCSRF(options = {}) {
  const csrfToken = getCSRFToken();
  const headers = options.headers || {};

  if (csrfToken) {
    return {
      ...options,
      headers: {
        ...headers,
        'x-csrf-token': csrfToken,
      },
    };
  }

  return options;
}
