/**
 * Language Utility Functions
 * Centralized language detection and management
 */

/**
 * Get current language from URL pathname with localStorage fallback
 * @returns {string} 'en' or 'es'
 */
export const getCurrentLanguage = () => {
  // Try to extract from URL path first
  const path = window.location.pathname;
  const match = path.match(/^\/(en|es)(?:\/|$)/);
  if (match) return match[1];

  // Fallback to localStorage
  const stored = localStorage.getItem('axolop_language');
  if (stored === 'English') return 'en';
  if (stored === 'Spanish') return 'es';

  // Default to English
  return 'en';
};
