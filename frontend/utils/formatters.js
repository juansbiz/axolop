/**
 * Locale-Aware Formatters for Axolop CRM
 *
 * Provides formatting utilities for dates, numbers, and currency
 * that respect the user's language preference.
 *
 * English (en): US format - Dec 7, 2025 | 1,000.50 | $1,000.00
 * Spanish (es): LATAM format - 7 dic 2025 | 1.000,50 | $1.000,00
 */

import { format, formatDistance, formatRelative, parseISO, isValid } from 'date-fns';
import { es } from 'date-fns/locale';

// Locale mapping for date-fns
const DATE_LOCALES = {
  en: undefined, // Default (US English)
  es: es,        // Spanish
};

// Intl locale mapping
const INTL_LOCALES = {
  en: 'en-US',
  es: 'es-419', // Latin American Spanish
};

/**
 * Get the date-fns locale object for a language
 * @param {string} lang - Language code ('en' or 'es')
 * @returns {Locale|undefined}
 */
export const getDateLocale = (lang = 'en') => {
  return DATE_LOCALES[lang] || DATE_LOCALES.en;
};

/**
 * Get the Intl locale string for a language
 * @param {string} lang - Language code ('en' or 'es')
 * @returns {string}
 */
export const getIntlLocale = (lang = 'en') => {
  return INTL_LOCALES[lang] || INTL_LOCALES.en;
};

// ============================================
// DATE FORMATTING
// ============================================

/**
 * Format a date according to the user's language preference
 * @param {Date|string} date - Date to format
 * @param {string} formatStr - date-fns format string
 * @param {string} lang - Language code ('en' or 'es')
 * @returns {string}
 */
export const formatDate = (date, formatStr = 'PP', lang = 'en') => {
  if (!date) return '';

  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  if (!isValid(dateObj)) return '';

  try {
    return format(dateObj, formatStr, { locale: getDateLocale(lang) });
  } catch {
    return '';
  }
};

/**
 * Format date as short format (Dec 7, 2025 / 7 dic 2025)
 * @param {Date|string} date
 * @param {string} lang
 * @returns {string}
 */
export const formatDateShort = (date, lang = 'en') => {
  return formatDate(date, 'PP', lang);
};

/**
 * Format date as long format (December 7, 2025 / 7 de diciembre de 2025)
 * @param {Date|string} date
 * @param {string} lang
 * @returns {string}
 */
export const formatDateLong = (date, lang = 'en') => {
  return formatDate(date, 'PPP', lang);
};

/**
 * Format date with time (Dec 7, 2025, 3:30 PM / 7 dic 2025, 15:30)
 * @param {Date|string} date
 * @param {string} lang
 * @returns {string}
 */
export const formatDateTime = (date, lang = 'en') => {
  return formatDate(date, 'Pp', lang);
};

/**
 * Format date as relative time (2 hours ago / hace 2 horas)
 * @param {Date|string} date
 * @param {string} lang
 * @returns {string}
 */
export const formatRelativeTime = (date, lang = 'en') => {
  if (!date) return '';

  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  if (!isValid(dateObj)) return '';

  try {
    return formatDistance(dateObj, new Date(), {
      addSuffix: true,
      locale: getDateLocale(lang),
    });
  } catch {
    return '';
  }
};

/**
 * Format date as relative to today (today, yesterday, etc.)
 * @param {Date|string} date
 * @param {string} lang
 * @returns {string}
 */
export const formatRelativeDate = (date, lang = 'en') => {
  if (!date) return '';

  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  if (!isValid(dateObj)) return '';

  try {
    return formatRelative(dateObj, new Date(), {
      locale: getDateLocale(lang),
    });
  } catch {
    return '';
  }
};

/**
 * Format time only (3:30 PM / 15:30)
 * @param {Date|string} date
 * @param {string} lang
 * @returns {string}
 */
export const formatTime = (date, lang = 'en') => {
  return formatDate(date, lang === 'es' ? 'HH:mm' : 'p', lang);
};

// ============================================
// NUMBER FORMATTING
// ============================================

/**
 * Format a number according to locale (1,000.50 / 1.000,50)
 * @param {number} value - Number to format
 * @param {string} lang - Language code
 * @param {Object} options - Intl.NumberFormat options
 * @returns {string}
 */
export const formatNumber = (value, lang = 'en', options = {}) => {
  if (value === null || value === undefined || isNaN(value)) return '';

  try {
    return new Intl.NumberFormat(getIntlLocale(lang), {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
      ...options,
    }).format(value);
  } catch {
    return String(value);
  }
};

/**
 * Format a number as integer (no decimals)
 * @param {number} value
 * @param {string} lang
 * @returns {string}
 */
export const formatInteger = (value, lang = 'en') => {
  return formatNumber(value, lang, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
};

/**
 * Format a number as decimal with specific precision
 * @param {number} value
 * @param {string} lang
 * @param {number} decimals
 * @returns {string}
 */
export const formatDecimal = (value, lang = 'en', decimals = 2) => {
  return formatNumber(value, lang, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
};

/**
 * Format a number as percentage (50% / 50%)
 * @param {number} value - Value as decimal (0.5 = 50%)
 * @param {string} lang
 * @param {number} decimals
 * @returns {string}
 */
export const formatPercent = (value, lang = 'en', decimals = 0) => {
  if (value === null || value === undefined || isNaN(value)) return '';

  try {
    return new Intl.NumberFormat(getIntlLocale(lang), {
      style: 'percent',
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(value);
  } catch {
    return `${(value * 100).toFixed(decimals)}%`;
  }
};

// ============================================
// CURRENCY FORMATTING
// ============================================

/**
 * Format a number as currency
 * @param {number} value - Amount to format
 * @param {string} lang - Language code
 * @param {string} currency - Currency code (USD, MXN, etc.)
 * @returns {string}
 */
export const formatCurrency = (value, lang = 'en', currency = 'USD') => {
  if (value === null || value === undefined || isNaN(value)) return '';

  try {
    return new Intl.NumberFormat(getIntlLocale(lang), {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  } catch {
    return `$${formatDecimal(value, lang, 2)}`;
  }
};

/**
 * Format as USD
 * @param {number} value
 * @param {string} lang
 * @returns {string}
 */
export const formatUSD = (value, lang = 'en') => {
  return formatCurrency(value, lang, 'USD');
};

/**
 * Format as Mexican Peso
 * @param {number} value
 * @param {string} lang
 * @returns {string}
 */
export const formatMXN = (value, lang = 'en') => {
  return formatCurrency(value, lang, 'MXN');
};

/**
 * Format currency in compact notation ($1.5K, $1.5M)
 * @param {number} value
 * @param {string} lang
 * @param {string} currency
 * @returns {string}
 */
export const formatCurrencyCompact = (value, lang = 'en', currency = 'USD') => {
  if (value === null || value === undefined || isNaN(value)) return '';

  try {
    return new Intl.NumberFormat(getIntlLocale(lang), {
      style: 'currency',
      currency: currency,
      notation: 'compact',
      compactDisplay: 'short',
    }).format(value);
  } catch {
    return formatCurrency(value, lang, currency);
  }
};

// ============================================
// COMPACT NUMBER FORMATTING
// ============================================

/**
 * Format number in compact notation (1.5K, 1.5M)
 * @param {number} value
 * @param {string} lang
 * @returns {string}
 */
export const formatCompact = (value, lang = 'en') => {
  if (value === null || value === undefined || isNaN(value)) return '';

  try {
    return new Intl.NumberFormat(getIntlLocale(lang), {
      notation: 'compact',
      compactDisplay: 'short',
    }).format(value);
  } catch {
    // Fallback for older browsers
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}K`;
    }
    return String(value);
  }
};

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Parse a locale-formatted number string back to a number
 * @param {string} str - Formatted number string
 * @param {string} lang - Language code
 * @returns {number|NaN}
 */
export const parseLocaleNumber = (str, lang = 'en') => {
  if (!str || typeof str !== 'string') return NaN;

  // Get locale-specific decimal and thousand separators
  const parts = new Intl.NumberFormat(getIntlLocale(lang)).formatToParts(1234.5);
  const decimalSep = parts.find(p => p.type === 'decimal')?.value || '.';
  const groupSep = parts.find(p => p.type === 'group')?.value || ',';

  // Remove currency symbols and whitespace
  let cleaned = str.replace(/[^0-9.,\-]/g, '');

  // Normalize separators
  if (decimalSep === ',') {
    // Spanish format: 1.000,50 -> 1000.50
    cleaned = cleaned.replace(/\./g, '').replace(',', '.');
  } else {
    // English format: 1,000.50 -> 1000.50
    cleaned = cleaned.replace(/,/g, '');
  }

  return parseFloat(cleaned);
};

/**
 * Create a formatter factory for a specific language
 * @param {string} lang - Language code
 * @returns {Object} Object with all formatting functions bound to the language
 */
export const createFormatter = (lang = 'en') => ({
  date: (date, fmt) => formatDate(date, fmt, lang),
  dateShort: (date) => formatDateShort(date, lang),
  dateLong: (date) => formatDateLong(date, lang),
  dateTime: (date) => formatDateTime(date, lang),
  relativeTime: (date) => formatRelativeTime(date, lang),
  relativeDate: (date) => formatRelativeDate(date, lang),
  time: (date) => formatTime(date, lang),
  number: (value, opts) => formatNumber(value, lang, opts),
  integer: (value) => formatInteger(value, lang),
  decimal: (value, decimals) => formatDecimal(value, lang, decimals),
  percent: (value, decimals) => formatPercent(value, lang, decimals),
  currency: (value, currency) => formatCurrency(value, lang, currency),
  currencyCompact: (value, currency) => formatCurrencyCompact(value, lang, currency),
  compact: (value) => formatCompact(value, lang),
  parseNumber: (str) => parseLocaleNumber(str, lang),
});

// Export default formatter (English)
export default createFormatter('en');
