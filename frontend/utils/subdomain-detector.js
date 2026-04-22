/**
 * Subdomain Detection Utilities
 *
 * Provides utilities for detecting, validating, and managing subdomains
 * in the Axolop CRM multi-tenant architecture.
 */

// Reserved subdomains that cannot be used by agencies
export const RESERVED_SUBDOMAINS = [
  'www', 'app', 'api', 'admin', 'auth', 'login', 'signup',
  'beta', 'staging', 'dev', 'test', 'demo', 'docs', 'help',
  'support', 'blog', 'mail', 'cdn', 'static', 'assets', 'media', 'files'
];

// Base domain (production)
export const BASE_DOMAIN = 'axolop.com';

/**
 * Extract subdomain from current hostname
 *
 * @param {string} hostname - Optional hostname (defaults to window.location.hostname)
 * @returns {string|null} - Subdomain or null if none detected
 *
 * Examples:
 *   extractSubdomain('acme.axolop.com') � 'acme'
 *   extractSubdomain('www.axolop.com') � null
 *   extractSubdomain('axolop.com') � null
 *   extractSubdomain('localhost') � null
 */
export function extractSubdomain(hostname = window.location.hostname) {
  // Handle localhost development
  if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname.startsWith('192.168.')) {
    // Check for subdomain in localhost format: test.localhost
    if (hostname.includes('.localhost')) {
      const parts = hostname.split('.');
      const potentialSubdomain = parts[0].toLowerCase();
      return RESERVED_SUBDOMAINS.includes(potentialSubdomain) ? null : potentialSubdomain;
    }
    return null;
  }

  // Split hostname into parts
  const parts = hostname.split('.');

  // Need at least 3 parts for a subdomain (subdomain.domain.tld)
  if (parts.length < 3) {
    return null;
  }

  const potentialSubdomain = parts[0].toLowerCase();

  // Check if it's a reserved subdomain
  if (RESERVED_SUBDOMAINS.includes(potentialSubdomain)) {
    return null;
  }

  return potentialSubdomain;
}

/**
 * Validate subdomain format
 *
 * Rules:
 * - 3-63 characters
 * - Lowercase letters, numbers, hyphens only
 * - Cannot start or end with hyphen
 * - Cannot be reserved
 *
 * @param {string} subdomain - Subdomain to validate
 * @returns {boolean} - True if valid
 */
export function isValidSubdomain(subdomain) {
  if (!subdomain || typeof subdomain !== 'string') {
    return false;
  }

  // Check length
  if (subdomain.length < 3 || subdomain.length > 63) {
    return false;
  }

  // Check format (lowercase alphanumeric + hyphens, no leading/trailing hyphens)
  const pattern = /^[a-z0-9][a-z0-9-]{1,61}[a-z0-9]$/;
  if (!pattern.test(subdomain)) {
    return false;
  }

  // Check if reserved
  if (RESERVED_SUBDOMAINS.includes(subdomain.toLowerCase())) {
    return false;
  }

  return true;
}

/**
 * Check subdomain availability via API
 *
 * @param {string} subdomain - Subdomain to check
 * @returns {Promise<Object>} - { available: boolean, reason?: string, message?: string }
 */
export async function checkSubdomainAvailability(subdomain) {
  try {
    const response = await fetch(`/api/v1/businesses/check-subdomain/${subdomain}`);

    if (!response.ok) {
      throw new Error('Failed to check subdomain availability');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Subdomain availability check failed:', error);
    return {
      available: false,
      reason: 'ERROR',
      message: 'Failed to check availability. Please try again.'
    };
  }
}

/**
 * Generate subdomain suggestions from business name
 *
 * @param {string} businessName - Business name to generate suggestions from
 * @returns {string[]} - Array of suggested subdomains
 *
 * Examples:
 *   generateSubdomainSuggestions('Acme Corp') → ['acme-corp', 'acmecorp', 'acme']
 *   generateSubdomainSuggestions('John\'s Business') → ['johns-business', 'johnsbusiness', 'johns']
 */
export function generateSubdomainSuggestions(businessName) {
  if (!businessName || typeof businessName !== 'string') {
    return [];
  }

  // Clean and normalize the business name
  const cleaned = businessName
    .toLowerCase()
    .trim()
    // Remove apostrophes
    .replace(/'/g, '')
    // Remove special characters except spaces and hyphens
    .replace(/[^a-z0-9\s-]/g, '')
    // Replace multiple spaces/hyphens with single hyphen
    .replace(/[\s-]+/g, '-')
    // Remove leading/trailing hyphens
    .replace(/^-+|-+$/g, '')
    // Limit length
    .substring(0, 40);

  const suggestions = [];

  // Suggestion 1: With hyphens
  if (cleaned.length >= 3 && isValidSubdomain(cleaned)) {
    suggestions.push(cleaned);
  }

  // Suggestion 2: Without hyphens (compact)
  const compact = cleaned.replace(/-/g, '');
  if (compact.length >= 3 && isValidSubdomain(compact) && compact !== cleaned) {
    suggestions.push(compact);
  }

  // Suggestion 3: First word only
  const firstWord = cleaned.split('-')[0];
  if (firstWord.length >= 3 && isValidSubdomain(firstWord) && !suggestions.includes(firstWord)) {
    suggestions.push(firstWord);
  }

  // Suggestion 4: Add suffix if name is short
  if (cleaned.length >= 3 && cleaned.length <= 10) {
    const withAgency = `${cleaned}-agency`;
    if (isValidSubdomain(withAgency) && !suggestions.includes(withAgency)) {
      suggestions.push(withAgency);
    }
  }

  // Filter out any that are reserved or invalid
  return suggestions.filter(s => isValidSubdomain(s));
}

/**
 * Build full subdomain URL
 *
 * @param {string} subdomain - Subdomain
 * @param {string} path - Optional path (e.g., '/app/dashboard')
 * @returns {string} - Full URL
 *
 * Examples:
 *   buildSubdomainUrl('acme') � 'https://acme.axolop.com'
 *   buildSubdomainUrl('acme', '/app/dashboard') � 'https://acme.axolop.com/app/dashboard'
 */
export function buildSubdomainUrl(subdomain, path = '') {
  if (!subdomain) {
    return path || '/';
  }

  const protocol = window.location.protocol; // http: or https:
  const cleanPath = path.startsWith('/') ? path : `/${path}`;

  // Handle localhost development
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    const port = window.location.port ? `:${window.location.port}` : '';
    return `${protocol}//${subdomain}.localhost${port}${cleanPath}`;
  }

  return `${protocol}//${subdomain}.${BASE_DOMAIN}${cleanPath}`;
}

/**
 * Get current subdomain info
 *
 * @returns {Object} - { subdomain: string|null, isSubdomain: boolean, url: string }
 */
export function getCurrentSubdomainInfo() {
  const subdomain = extractSubdomain();
  const isSubdomain = subdomain !== null;
  const url = isSubdomain ? window.location.href : null;

  return {
    subdomain,
    isSubdomain,
    url,
    hostname: window.location.hostname
  };
}

/**
 * Redirect to subdomain URL
 *
 * @param {string} subdomain - Target subdomain
 * @param {string} path - Optional path to redirect to
 */
export function redirectToSubdomain(subdomain, path = window.location.pathname) {
  const url = buildSubdomainUrl(subdomain, path);
  window.location.href = url;
}

/**
 * Redirect to main domain (remove subdomain)
 *
 * @param {string} path - Optional path to redirect to
 */
export function redirectToMainDomain(path = '/') {
  const protocol = window.location.protocol;

  // Handle localhost
  if (window.location.hostname.includes('localhost')) {
    const port = window.location.port ? `:${window.location.port}` : '';
    window.location.href = `${protocol}//localhost${port}${path}`;
    return;
  }

  window.location.href = `${protocol}//${BASE_DOMAIN}${path}`;
}

/**
 * Format subdomain for display
 *
 * @param {string} subdomain - Subdomain
 * @returns {string} - Formatted display (e.g., "acme.axolop.com")
 */
export function formatSubdomainDisplay(subdomain) {
  if (!subdomain) return BASE_DOMAIN;
  return `${subdomain}.${BASE_DOMAIN}`;
}

/**
 * Debounced subdomain availability checker
 * Useful for real-time validation in forms
 *
 * @param {string} subdomain - Subdomain to check
 * @param {number} delay - Debounce delay in ms (default: 500)
 * @returns {Promise<Object>} - Availability result
 */
export function debouncedCheckAvailability(subdomain, delay = 500) {
  return new Promise((resolve) => {
    const timeoutId = setTimeout(async () => {
      const result = await checkSubdomainAvailability(subdomain);
      resolve(result);
    }, delay);

    // Store timeout ID for potential cancellation
    debouncedCheckAvailability._timeoutId = timeoutId;
  });
}

// Cancel pending debounced check
debouncedCheckAvailability.cancel = () => {
  if (debouncedCheckAvailability._timeoutId) {
    clearTimeout(debouncedCheckAvailability._timeoutId);
  }
};
