/**
 * Consent Utilities
 * GDPR-compliant consent management for funnel analytics
 */

const CONSENT_KEY = 'funnel_analytics_consent';
const CONSENT_TIMESTAMP_KEY = 'funnel_analytics_consent_at';

/**
 * Check if analytics consent has been given
 * @returns {boolean}
 */
export const hasAnalyticsConsent = () => {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(CONSENT_KEY) === 'true';
};

/**
 * Check if consent decision has been made (either accept or decline)
 * @returns {boolean}
 */
export const hasConsentDecision = () => {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(CONSENT_KEY) !== null;
};

/**
 * Get consent timestamp
 * @returns {string|null} ISO timestamp or null
 */
export const getConsentTimestamp = () => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(CONSENT_TIMESTAMP_KEY);
};

/**
 * Grant analytics consent
 */
export const grantConsent = () => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(CONSENT_KEY, 'true');
  localStorage.setItem(CONSENT_TIMESTAMP_KEY, new Date().toISOString());
};

/**
 * Deny analytics consent
 */
export const denyConsent = () => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(CONSENT_KEY, 'false');
  localStorage.removeItem(CONSENT_TIMESTAMP_KEY);
};

/**
 * Clear all consent data (reset to undecided)
 */
export const clearConsent = () => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(CONSENT_KEY);
  localStorage.removeItem(CONSENT_TIMESTAMP_KEY);
};

/**
 * Get consent data object for tracking requests
 * @returns {Object} Consent data to include in analytics requests
 */
export const getConsentData = () => {
  return {
    consent_given: hasAnalyticsConsent(),
    consent_timestamp: getConsentTimestamp(),
  };
};

/**
 * Track event only if consent has been given
 * @param {Function} trackFn - The tracking function to call
 * @param  {...any} args - Arguments to pass to the tracking function
 * @returns {Promise<any>} Result of tracking function or null if no consent
 */
export const trackWithConsent = async (trackFn, ...args) => {
  if (!hasAnalyticsConsent()) {
    console.debug('Analytics tracking skipped: no consent');
    return null;
  }

  return trackFn(...args);
};

export default {
  hasAnalyticsConsent,
  hasConsentDecision,
  getConsentTimestamp,
  grantConsent,
  denyConsent,
  clearConsent,
  getConsentData,
  trackWithConsent,
};
