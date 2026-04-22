/**
 * Widget Helper Utilities
 *
 * Shared utilities for Form Input widgets including:
 * - Debounce function for search/autocomplete
 * - Phone number formatting and validation
 * - SSN validation and masking
 * - Date validation helpers
 * - Input sanitization
 */

/**
 * Debounce Function
 * Delays execution of a function until after a specified delay
 *
 * @param {Function} func - Function to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {Function} Debounced function
 *
 * @example
 * const debouncedSearch = debounce((query) => {
 *   console.log('Searching for:', query);
 * }, 300);
 *
 * debouncedSearch('test'); // Will execute after 300ms
 */
export function debounce(func, delay = 300) {
  let timeoutId;

  return function debounced(...args) {
    const context = this;

    // Clear previous timeout
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    // Set new timeout
    timeoutId = setTimeout(() => {
      func.apply(context, args);
    }, delay);
  };
}

/**
 * Throttle Function
 * Limits execution of a function to once per specified delay
 *
 * @param {Function} func - Function to throttle
 * @param {number} delay - Minimum delay between executions (ms)
 * @returns {Function} Throttled function
 */
export function throttle(func, delay = 300) {
  let lastCall = 0;

  return function throttled(...args) {
    const now = Date.now();

    if (now - lastCall >= delay) {
      lastCall = now;
      return func.apply(this, args);
    }
  };
}

/**
 * SSN Validation
 * Validates Social Security Number format
 *
 * @param {string} ssn - SSN to validate (can include dashes)
 * @returns {boolean} True if valid SSN format
 *
 * @example
 * validateSSN('123-45-6789') // true
 * validateSSN('123456789')   // true
 * validateSSN('000-00-0000') // false (invalid)
 */
export function validateSSN(ssn) {
  if (!ssn) return false;

  // Remove dashes and spaces
  const cleaned = ssn.replace(/[-\s]/g, '');

  // Must be exactly 9 digits
  if (!/^\d{9}$/.test(cleaned)) {
    return false;
  }

  // Invalid SSN patterns
  const invalidPatterns = [
    '000000000', // All zeros
    '111111111', // All same digit
    '222222222',
    '333333333',
    '444444444',
    '555555555',
    '666666666',
    '777777777',
    '888888888',
    '999999999',
  ];

  if (invalidPatterns.includes(cleaned)) {
    return false;
  }

  // First 3 digits cannot be 000 or 666
  const firstThree = cleaned.substring(0, 3);
  if (firstThree === '000' || firstThree === '666') {
    return false;
  }

  // First 3 digits cannot be 900-999
  if (parseInt(firstThree) >= 900) {
    return false;
  }

  // Middle 2 digits cannot be 00
  const middleTwo = cleaned.substring(3, 5);
  if (middleTwo === '00') {
    return false;
  }

  // Last 4 digits cannot be 0000
  const lastFour = cleaned.substring(5, 9);
  if (lastFour === '0000') {
    return false;
  }

  return true;
}

/**
 * Format SSN with Masking
 * Shows only last 4 digits, masks the rest
 *
 * @param {string} ssn - SSN to mask
 * @param {boolean} showFull - If true, shows full SSN with dashes
 * @returns {string} Masked SSN (e.g., "***-**-6789")
 *
 * @example
 * maskSSN('123456789')       // "***-**-6789"
 * maskSSN('123-45-6789')     // "***-**-6789"
 * maskSSN('123456789', true) // "123-45-6789"
 */
export function maskSSN(ssn, showFull = false) {
  if (!ssn) return '';

  // Remove dashes and spaces
  const cleaned = ssn.replace(/[-\s]/g, '');

  // Must be 9 digits
  if (!/^\d{9}$/.test(cleaned)) {
    return ssn; // Return as-is if invalid format
  }

  if (showFull) {
    // Format as XXX-XX-XXXX
    return `${cleaned.substring(0, 3)}-${cleaned.substring(3, 5)}-${cleaned.substring(5)}`;
  }

  // Mask as ***-**-XXXX (show only last 4)
  const lastFour = cleaned.substring(5);
  return `***-**-${lastFour}`;
}

/**
 * Format SSN as User Types
 * Adds dashes automatically: XXX-XX-XXXX
 *
 * @param {string} value - Current input value
 * @returns {string} Formatted SSN
 *
 * @example
 * formatSSNInput('123')       // "123"
 * formatSSNInput('12345')     // "123-45"
 * formatSSNInput('123456789') // "123-45-6789"
 */
export function formatSSNInput(value) {
  if (!value) return '';

  // Remove all non-digits
  const digits = value.replace(/\D/g, '');

  // Limit to 9 digits
  const limited = digits.substring(0, 9);

  // Format with dashes
  if (limited.length <= 3) {
    return limited;
  } else if (limited.length <= 5) {
    return `${limited.substring(0, 3)}-${limited.substring(3)}`;
  } else {
    return `${limited.substring(0, 3)}-${limited.substring(3, 5)}-${limited.substring(5)}`;
  }
}

/**
 * Phone Number Formatting (US)
 * Formats phone number as (XXX) XXX-XXXX
 *
 * NOTE: For international phone support with 200+ countries,
 * install 'libphonenumber-js' package and use formatPhoneNumberIntl()
 *
 * @param {string} value - Phone number (can include formatting)
 * @returns {string} Formatted US phone number
 *
 * @example
 * formatPhoneUS('1234567890')    // "(123) 456-7890"
 * formatPhoneUS('(123) 456-7890') // "(123) 456-7890"
 */
export function formatPhoneUS(value) {
  if (!value) return '';

  // Remove all non-digits
  const digits = value.replace(/\D/g, '');

  // Limit to 10 digits (US)
  const limited = digits.substring(0, 10);

  // Format as (XXX) XXX-XXXX
  if (limited.length <= 3) {
    return limited;
  } else if (limited.length <= 6) {
    return `(${limited.substring(0, 3)}) ${limited.substring(3)}`;
  } else {
    return `(${limited.substring(0, 3)}) ${limited.substring(3, 6)}-${limited.substring(6)}`;
  }
}

/**
 * Validate US Phone Number
 * Checks if phone number is valid 10-digit US number
 *
 * @param {string} phone - Phone number to validate
 * @returns {boolean} True if valid US phone
 *
 * @example
 * validatePhoneUS('1234567890')    // true
 * validatePhoneUS('(123) 456-7890') // true
 * validatePhoneUS('123')           // false
 */
export function validatePhoneUS(phone) {
  if (!phone) return false;

  // Remove all non-digits
  const digits = phone.replace(/\D/g, '');

  // Must be exactly 10 digits
  return /^\d{10}$/.test(digits);
}

/**
 * Format Date Input (MM/DD/YYYY)
 * Automatically adds slashes as user types
 *
 * @param {string} value - Date string
 * @returns {string} Formatted date
 *
 * @example
 * formatDateInput('01')       // "01"
 * formatDateInput('0115')     // "01/15"
 * formatDateInput('01152024') // "01/15/2024"
 */
export function formatDateInput(value) {
  if (!value) return '';

  // Remove all non-digits
  const digits = value.replace(/\D/g, '');

  // Limit to 8 digits (MMDDYYYY)
  const limited = digits.substring(0, 8);

  // Format as MM/DD/YYYY
  if (limited.length <= 2) {
    return limited;
  } else if (limited.length <= 4) {
    return `${limited.substring(0, 2)}/${limited.substring(2)}`;
  } else {
    return `${limited.substring(0, 2)}/${limited.substring(2, 4)}/${limited.substring(4)}`;
  }
}

/**
 * Validate Date String (MM/DD/YYYY)
 * Checks if date is valid and in correct format
 *
 * @param {string} dateStr - Date string to validate
 * @returns {boolean} True if valid date
 *
 * @example
 * validateDate('01/15/2024') // true
 * validateDate('13/01/2024') // false (invalid month)
 * validateDate('01/32/2024') // false (invalid day)
 */
export function validateDate(dateStr) {
  if (!dateStr) return false;

  // Check format: MM/DD/YYYY
  const regex = /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/\d{4}$/;
  if (!regex.test(dateStr)) {
    return false;
  }

  // Parse components
  const [month, day, year] = dateStr.split('/').map(Number);

  // Create date object
  const date = new Date(year, month - 1, day);

  // Verify date is valid (handles leap years, etc.)
  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  );
}

/**
 * Validate Birthday (Age 18+)
 * Checks if date is valid and person is at least 18 years old
 *
 * @param {string} dateStr - Birthday in MM/DD/YYYY format
 * @returns {Object} { valid: boolean, error: string }
 *
 * @example
 * validateBirthday('01/15/2000') // { valid: true, error: null }
 * validateBirthday('01/15/2020') // { valid: false, error: 'Must be 18+' }
 */
export function validateBirthday(dateStr) {
  // First check if date is valid
  if (!validateDate(dateStr)) {
    return { valid: false, error: 'Invalid date format (MM/DD/YYYY)' };
  }

  // Parse date
  const [month, day, year] = dateStr.split('/').map(Number);
  const birthday = new Date(year, month - 1, day);
  const today = new Date();

  // Check if date is in the future
  if (birthday > today) {
    return { valid: false, error: 'Birthday cannot be in the future' };
  }

  // Check if date is too far in the past (150 years)
  const maxAge = new Date();
  maxAge.setFullYear(maxAge.getFullYear() - 150);
  if (birthday < maxAge) {
    return { valid: false, error: 'Invalid birthday (too old)' };
  }

  // Calculate age
  let age = today.getFullYear() - birthday.getFullYear();
  const monthDiff = today.getMonth() - birthday.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthday.getDate())) {
    age--;
  }

  // Check minimum age (18)
  if (age < 18) {
    return { valid: false, error: 'Must be at least 18 years old' };
  }

  return { valid: true, error: null };
}

/**
 * Sanitize Input
 * Removes potentially harmful characters from user input
 *
 * @param {string} value - Input value
 * @param {Object} options - Sanitization options
 * @returns {string} Sanitized value
 *
 * @example
 * sanitizeInput('<script>alert("xss")</script>') // "scriptalert(xss)script"
 * sanitizeInput('Hello\nWorld', { allowNewlines: true }) // "Hello\nWorld"
 */
export function sanitizeInput(value, options = {}) {
  if (!value) return '';

  const {
    allowNewlines = false,
    allowHTML = false,
    maxLength = null,
  } = options;

  let sanitized = value;

  // Remove HTML tags if not allowed
  if (!allowHTML) {
    sanitized = sanitized.replace(/<[^>]*>/g, '');
  }

  // Remove newlines if not allowed
  if (!allowNewlines) {
    sanitized = sanitized.replace(/[\r\n]/g, '');
  }

  // Trim whitespace
  sanitized = sanitized.trim();

  // Enforce max length
  if (maxLength && sanitized.length > maxLength) {
    sanitized = sanitized.substring(0, maxLength);
  }

  return sanitized;
}

/**
 * Generate UUID
 * Creates a unique identifier for widget instances
 *
 * @returns {string} UUID v4
 *
 * @example
 * generateUUID() // "550e8400-e29b-41d4-a716-446655440000"
 */
export function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Deep Clone Object
 * Creates a deep copy of an object
 *
 * @param {Object} obj - Object to clone
 * @returns {Object} Cloned object
 */
export function deepClone(obj) {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  if (obj instanceof Date) {
    return new Date(obj.getTime());
  }

  if (obj instanceof Array) {
    return obj.map((item) => deepClone(item));
  }

  if (obj instanceof Object) {
    const clonedObj = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        clonedObj[key] = deepClone(obj[key]);
      }
    }
    return clonedObj;
  }
}

/**
 * Check if two values are equal (deep comparison)
 *
 * @param {*} a - First value
 * @param {*} b - Second value
 * @returns {boolean} True if equal
 */
export function isEqual(a, b) {
  if (a === b) return true;

  if (a instanceof Date && b instanceof Date) {
    return a.getTime() === b.getTime();
  }

  if (!a || !b || (typeof a !== 'object' && typeof b !== 'object')) {
    return a === b;
  }

  if (a.prototype !== b.prototype) return false;

  const keys = Object.keys(a);
  if (keys.length !== Object.keys(b).length) return false;

  return keys.every((k) => isEqual(a[k], b[k]));
}
