/**
 * Centralized Validation Utilities
 *
 * Provides common validation functions for forms, inputs, and data.
 * Complements existing useValidation.js hook with reusable validators.
 */

/**
 * Validate email address
 * @param {string} email - Email to validate
 * @returns {boolean}
 */
export const validateEmail = (email) => {
  if (!email || typeof email !== 'string') return false;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
};

/**
 * Validate phone number (US format)
 * @param {string} phone - Phone number to validate
 * @returns {boolean}
 */
export const validatePhone = (phone) => {
  if (!phone || typeof phone !== 'string') return false;

  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, '');

  // US phone: 10 or 11 digits (with country code)
  return cleaned.length === 10 || (cleaned.length === 11 && cleaned[0] === '1');
};

/**
 * Validate international phone number
 * @param {string} phone - Phone number to validate
 * @returns {boolean}
 */
export const validatePhoneInternational = (phone) => {
  if (!phone || typeof phone !== 'string') return false;

  const cleaned = phone.replace(/\D/g, '');
  return cleaned.length >= 7 && cleaned.length <= 15;
};

/**
 * Validate URL
 * @param {string} url - URL to validate
 * @returns {boolean}
 */
export const validateUrl = (url) => {
  if (!url || typeof url !== 'string') return false;

  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Validate required field
 * @param {any} value - Value to validate
 * @returns {boolean}
 */
export const validateRequired = (value) => {
  if (value === null || value === undefined) return false;

  if (typeof value === 'string') {
    return value.trim().length > 0;
  }

  if (Array.isArray(value)) {
    return value.length > 0;
  }

  return true;
};

/**
 * Validate minimum length
 * @param {string} value - Value to validate
 * @param {number} minLength - Minimum length
 * @returns {boolean}
 */
export const validateMinLength = (value, minLength) => {
  if (!value || typeof value !== 'string') return false;
  return value.trim().length >= minLength;
};

/**
 * Validate maximum length
 * @param {string} value - Value to validate
 * @param {number} maxLength - Maximum length
 * @returns {boolean}
 */
export const validateMaxLength = (value, maxLength) => {
  if (!value || typeof value !== 'string') return true; // Empty is valid
  return value.trim().length <= maxLength;
};

/**
 * Validate string matches pattern
 * @param {string} value - Value to validate
 * @param {RegExp} pattern - Regular expression pattern
 * @returns {boolean}
 */
export const validatePattern = (value, pattern) => {
  if (!value || typeof value !== 'string') return false;
  return pattern.test(value);
};

/**
 * Validate number is within range
 * @param {number} value - Value to validate
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {boolean}
 */
export const validateNumberRange = (value, min = -Infinity, max = Infinity) => {
  const num = Number(value);
  if (isNaN(num)) return false;
  return num >= min && num <= max;
};

/**
 * Validate number is positive
 * @param {number} value - Value to validate
 * @returns {boolean}
 */
export const validatePositiveNumber = (value) => {
  const num = Number(value);
  return !isNaN(num) && num > 0;
};

/**
 * Validate number is non-negative
 * @param {number} value - Value to validate
 * @returns {boolean}
 */
export const validateNonNegativeNumber = (value) => {
  const num = Number(value);
  return !isNaN(num) && num >= 0;
};

/**
 * Validate date is in the future
 * @param {Date|string} date - Date to validate
 * @returns {boolean}
 */
export const validateFutureDate = (date) => {
  if (!date) return false;

  const dateObj = date instanceof Date ? date : new Date(date);
  if (isNaN(dateObj.getTime())) return false;

  return dateObj > new Date();
};

/**
 * Validate date is in the past
 * @param {Date|string} date - Date to validate
 * @returns {boolean}
 */
export const validatePastDate = (date) => {
  if (!date) return false;

  const dateObj = date instanceof Date ? date : new Date(date);
  if (isNaN(dateObj.getTime())) return false;

  return dateObj < new Date();
};

/**
 * Validate date is within range
 * @param {Date|string} date - Date to validate
 * @param {Date|string} minDate - Minimum date
 * @param {Date|string} maxDate - Maximum date
 * @returns {boolean}
 */
export const validateDateRange = (date, minDate, maxDate) => {
  if (!date) return false;

  const dateObj = date instanceof Date ? date : new Date(date);
  if (isNaN(dateObj.getTime())) return false;

  const min = minDate instanceof Date ? minDate : new Date(minDate);
  const max = maxDate instanceof Date ? maxDate : new Date(maxDate);

  return dateObj >= min && dateObj <= max;
};

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @param {Object} options - Validation options
 * @param {number} options.minLength - Minimum length (default: 8)
 * @param {boolean} options.requireUppercase - Require uppercase letter (default: true)
 * @param {boolean} options.requireLowercase - Require lowercase letter (default: true)
 * @param {boolean} options.requireNumber - Require number (default: true)
 * @param {boolean} options.requireSpecial - Require special character (default: false)
 * @returns {Object} { valid: boolean, errors: string[] }
 */
export const validatePassword = (password, options = {}) => {
  const {
    minLength = 8,
    requireUppercase = true,
    requireLowercase = true,
    requireNumber = true,
    requireSpecial = false,
  } = options;

  const errors = [];

  if (!password || typeof password !== 'string') {
    errors.push('Password is required');
    return { valid: false, errors };
  }

  if (password.length < minLength) {
    errors.push(`Password must be at least ${minLength} characters`);
  }

  if (requireUppercase && !/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }

  if (requireLowercase && !/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }

  if (requireNumber && !/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }

  if (requireSpecial && !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};

/**
 * Validate slug format (URL-safe string)
 * @param {string} slug - Slug to validate
 * @returns {boolean}
 */
export const validateSlug = (slug) => {
  if (!slug || typeof slug !== 'string') return false;

  // Slug: lowercase letters, numbers, hyphens only
  const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
  return slugRegex.test(slug);
};

/**
 * Validate file extension
 * @param {string} filename - Filename to validate
 * @param {string[]} allowedExtensions - Allowed extensions (e.g., ['jpg', 'png'])
 * @returns {boolean}
 */
export const validateFileExtension = (filename, allowedExtensions) => {
  if (!filename || typeof filename !== 'string') return false;

  const extension = filename.split('.').pop()?.toLowerCase();
  if (!extension) return false;

  return allowedExtensions.some(
    (ext) => ext.toLowerCase() === extension
  );
};

/**
 * Validate file size
 * @param {number} sizeInBytes - File size in bytes
 * @param {number} maxSizeInMB - Maximum size in MB
 * @returns {boolean}
 */
export const validateFileSize = (sizeInBytes, maxSizeInMB) => {
  if (typeof sizeInBytes !== 'number' || sizeInBytes < 0) return false;
  const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
  return sizeInBytes <= maxSizeInBytes;
};

/**
 * Validate JSON string
 * @param {string} jsonString - JSON string to validate
 * @returns {boolean}
 */
export const validateJSON = (jsonString) => {
  if (!jsonString || typeof jsonString !== 'string') return false;

  try {
    JSON.parse(jsonString);
    return true;
  } catch {
    return false;
  }
};

/**
 * Validate credit card number (basic Luhn algorithm)
 * @param {string} cardNumber - Card number to validate
 * @returns {boolean}
 */
export const validateCreditCard = (cardNumber) => {
  if (!cardNumber || typeof cardNumber !== 'string') return false;

  const cleaned = cardNumber.replace(/\D/g, '');

  if (cleaned.length < 13 || cleaned.length > 19) return false;

  let sum = 0;
  let isEven = false;

  for (let i = cleaned.length - 1; i >= 0; i--) {
    let digit = parseInt(cleaned.charAt(i), 10);

    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }

    sum += digit;
    isEven = !isEven;
  }

  return sum % 10 === 0;
};

/**
 * Validate ZIP code (US format)
 * @param {string} zip - ZIP code to validate
 * @returns {boolean}
 */
export const validateZipCode = (zip) => {
  if (!zip || typeof zip !== 'string') return false;

  // US ZIP: 5 digits or 5+4 format
  const zipRegex = /^\d{5}(-\d{4})?$/;
  return zipRegex.test(zip);
};

/**
 * Create validator with custom error message
 * @param {Function} validatorFn - Validation function
 * @param {string} errorMessage - Error message
 * @returns {Function} Validator function that returns error message on failure
 *
 * @example
 * const emailValidator = createValidator(validateEmail, 'Invalid email address');
 * const error = emailValidator('test@example.com'); // null
 * const error = emailValidator('invalid'); // 'Invalid email address'
 */
export const createValidator = (validatorFn, errorMessage) => {
  return (value) => {
    const isValid = validatorFn(value);
    return isValid ? null : errorMessage;
  };
};

/**
 * Combine multiple validators
 * @param {...Function} validators - Validator functions
 * @returns {Function} Combined validator that returns first error or null
 *
 * @example
 * const validator = combineValidators(
 *   (v) => validateRequired(v) || 'Required',
 *   (v) => validateEmail(v) || 'Invalid email'
 * );
 * const error = validator(''); // 'Required'
 */
export const combineValidators = (...validators) => {
  return (value) => {
    for (const validator of validators) {
      const error = validator(value);
      if (error) return error;
    }
    return null;
  };
};

// Export all validators
export default {
  validateEmail,
  validatePhone,
  validatePhoneInternational,
  validateUrl,
  validateRequired,
  validateMinLength,
  validateMaxLength,
  validatePattern,
  validateNumberRange,
  validatePositiveNumber,
  validateNonNegativeNumber,
  validateFutureDate,
  validatePastDate,
  validateDateRange,
  validatePassword,
  validateSlug,
  validateFileExtension,
  validateFileSize,
  validateJSON,
  validateCreditCard,
  validateZipCode,
  createValidator,
  combineValidators,
};
