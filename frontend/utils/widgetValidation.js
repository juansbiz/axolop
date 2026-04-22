/**
 * Widget Validation Framework
 *
 * Centralized validation utilities for all widget inputs
 * Ensures consistent validation logic and error messages across all 78 widgets
 *
 * Usage:
 * ```javascript
 * import { validators, validateField, validateForm } from '@/utils/widgetValidation';
 *
 * // Validate single field
 * const error = validateField('email', 'user@example.com', {
 *   required: true,
 *   email: true,
 * });
 *
 * // Validate entire form
 * const errors = validateForm({
 *   email: 'user@example.com',
 *   age: 25,
 * }, {
 *   email: { required: true, email: true },
 *   age: { required: true, min: 18 },
 * });
 * ```
 */

/**
 * Validators object
 * Each validator returns an error message or null
 */
export const validators = {
  /**
   * Required field validator
   */
  required: (value, message = 'This field is required') => {
    if (value === '' || value === null || value === undefined) {
      return message;
    }
    return null;
  },

  /**
   * Minimum length validator
   */
  minLength: (value, min, message = `Must be at least ${min} characters`) => {
    if (value && String(value).length < min) {
      return message;
    }
    return null;
  },

  /**
   * Maximum length validator
   */
  maxLength: (value, max, message = `Must be no more than ${max} characters`) => {
    if (value && String(value).length > max) {
      return message;
    }
    return null;
  },

  /**
   * Pattern/regex validator
   */
  pattern: (value, pattern, message = 'Invalid format') => {
    if (value && !pattern.test(String(value))) {
      return message;
    }
    return null;
  },

  /**
   * Email validator
   */
  email: (value, message = 'Invalid email address') => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (value && !emailRegex.test(String(value))) {
      return message;
    }
    return null;
  },

  /**
   * URL validator
   */
  url: (value, message = 'Invalid URL') => {
    try {
      if (value) {
        new URL(String(value));
      }
      return null;
    } catch {
      return message;
    }
  },

  /**
   * Number validator
   */
  number: (value, message = 'Must be a number') => {
    if (value && isNaN(Number(value))) {
      return message;
    }
    return null;
  },

  /**
   * Minimum value validator
   */
  min: (value, min, message = `Must be at least ${min}`) => {
    if (value !== null && value !== undefined && Number(value) < min) {
      return message;
    }
    return null;
  },

  /**
   * Maximum value validator
   */
  max: (value, max, message = `Must be no more than ${max}`) => {
    if (value !== null && value !== undefined && Number(value) > max) {
      return message;
    }
    return null;
  },

  /**
   * Phone number validator
   */
  phone: (value, message = 'Invalid phone number') => {
    const phoneRegex = /^[\d\s\-\+\(\)]+$|^$/;
    if (value && !phoneRegex.test(String(value))) {
      return message;
    }
    // Check minimum length (allowing for various formats)
    if (value && value.replace(/\D/g, '').length < 10) {
      return message;
    }
    return null;
  },

  /**
   * Credit card validator
   */
  creditCard: (value, message = 'Invalid credit card number') => {
    if (!value) return null;

    const cleaned = String(value).replace(/\s/g, '');
    if (!/^\d{13,19}$/.test(cleaned)) {
      return message;
    }

    // Luhn algorithm
    let sum = 0;
    let isEven = false;

    for (let i = cleaned.length - 1; i >= 0; i--) {
      let digit = parseInt(cleaned[i], 10);

      if (isEven) {
        digit *= 2;
        if (digit > 9) {
          digit -= 9;
        }
      }

      sum += digit;
      isEven = !isEven;
    }

    if (sum % 10 !== 0) {
      return message;
    }

    return null;
  },

  /**
   * Date validator
   */
  date: (value, message = 'Invalid date') => {
    if (!value) return null;
    const date = new Date(String(value));
    if (isNaN(date.getTime())) {
      return message;
    }
    return null;
  },

  /**
   * Match validator (for password confirmation, etc)
   */
  match: (value, compareValue, message = 'Fields do not match') => {
    if (value !== compareValue) {
      return message;
    }
    return null;
  },

  /**
   * Custom validator
   */
  custom: (value, fn, message = 'Invalid value') => {
    try {
      if (!fn(value)) {
        return message;
      }
      return null;
    } catch (error) {
      return message;
    }
  },

  /**
   * Array/list validator
   */
  minItems: (value, min, message = `Select at least ${min} item(s)`) => {
    if (Array.isArray(value) && value.length < min) {
      return message;
    }
    return null;
  },

  /**
   * Array/list maximum items validator
   */
  maxItems: (value, max, message = `Select no more than ${max} item(s)`) => {
    if (Array.isArray(value) && value.length > max) {
      return message;
    }
    return null;
  },

  /**
   * Unique values validator
   */
  unique: (value, message = 'Values must be unique') => {
    if (Array.isArray(value)) {
      const uniqueValues = new Set(value);
      if (uniqueValues.size !== value.length) {
        return message;
      }
    }
    return null;
  },
};

/**
 * Validate a single field
 * @param {string} fieldName - Name of the field
 * @param {any} value - Value to validate
 * @param {object} rules - Validation rules object
 * @returns {string|null} - Error message or null
 */
export const validateField = (fieldName, value, rules = {}) => {
  for (const [ruleName, ruleValue] of Object.entries(rules)) {
    let validator = validators[ruleName];
    if (!validator) continue;

    let error;

    // Handle different rule value formats
    if (typeof ruleValue === 'boolean') {
      // Boolean rule (required, email, etc)
      error = validator(value);
    } else if (ruleValue && typeof ruleValue === 'object') {
      // Object rule with { value, message }
      error = validator(value, ruleValue.value || ruleValue.args, ruleValue.message);
    } else {
      // Direct value rule (min: 5, minLength: 10, etc)
      error = validator(value, ruleValue);
    }

    if (error) {
      return error;
    }
  }

  return null;
};

/**
 * Validate entire form
 * @param {object} formData - Form data to validate
 * @param {object} schema - Validation schema { fieldName: rules }
 * @returns {object} - Errors object { fieldName: errorMessage }
 */
export const validateForm = (formData = {}, schema = {}) => {
  const errors = {};

  for (const [fieldName, rules] of Object.entries(schema)) {
    const value = formData[fieldName];
    const error = validateField(fieldName, value, rules);
    if (error) {
      errors[fieldName] = error;
    }
  }

  return errors;
};

/**
 * Check if form has errors
 */
export const hasErrors = (errors = {}) => {
  return Object.keys(errors).length > 0;
};

/**
 * Get first error message
 */
export const getFirstError = (errors = {}) => {
  const firstKey = Object.keys(errors)[0];
  return firstKey ? errors[firstKey] : null;
};

/**
 * Preset validation schemas for common field types
 */
export const validationSchemas = {
  email: {
    required: true,
    email: true,
  },

  password: {
    required: true,
    minLength: 8,
  },

  passwordConfirm: {
    required: true,
    minLength: 8,
  },

  phone: {
    phone: true,
  },

  url: {
    url: true,
  },

  creditCard: {
    required: true,
    creditCard: true,
  },

  dateField: {
    required: true,
    date: true,
  },

  textarea: {
    required: true,
    maxLength: 5000,
  },

  textInput: {
    required: true,
    maxLength: 255,
  },

  zipCode: {
    pattern: {
      value: /^\d{5}(-\d{4})?$/,
      message: 'Invalid zip code format',
    },
  },

  username: {
    required: true,
    minLength: 3,
    maxLength: 20,
    pattern: {
      value: /^[a-zA-Z0-9_-]+$/,
      message: 'Username can only contain letters, numbers, underscores, and dashes',
    },
  },
};

/**
 * Sanitize input to prevent XSS
 * Basic implementation - for production, use a library like DOMPurify
 */
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') {
    return input;
  }

  const div = document.createElement('div');
  div.textContent = input;
  return div.innerHTML;
};

/**
 * Escape HTML special characters
 */
export const escapeHtml = (text) => {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return String(text).replace(/[&<>"']/g, (m) => map[m]);
};

/**
 * Create field-specific error handler
 */
export const createFieldValidator = (rules = {}) => {
  return (value) => validateField('field', value, rules);
};

/**
 * Async field validator
 * For validations that require server calls
 */
export const createAsyncFieldValidator = (asyncValidationFn) => {
  return async (value) => {
    try {
      const isValid = await asyncValidationFn(value);
      return isValid ? null : 'Invalid value';
    } catch (error) {
      return 'Validation error';
    }
  };
};

/**
 * Debounced field validator
 * For real-time validation with server calls
 */
export const createDebouncedValidator = (validationFn, delay = 300) => {
  let timeoutId;
  return (value) => {
    return new Promise((resolve) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        const result = validationFn(value);
        resolve(result);
      }, delay);
    });
  };
};

export default {
  validators,
  validateField,
  validateForm,
  hasErrors,
  getFirstError,
  validationSchemas,
  sanitizeInput,
  escapeHtml,
  createFieldValidator,
  createAsyncFieldValidator,
  createDebouncedValidator,
};
