/**
 * Common Utilities Index
 *
 * Centralized export for all common utilities.
 * Import from this file for convenience.
 *
 * @example
 * import { formatDate, handleApiError, validateEmail } from '@/utils/common';
 */

// Date formatters
export * from './dateFormatters';

// Error handlers
export * from './errorHandlers';

// API helpers
export * from './apiHelpers';

// Validators
export * from './validators';

// Default exports for convenience
export { default as dateFormatters } from './dateFormatters';
export { default as errorHandlers } from './errorHandlers';
export { default as apiHelpers } from './apiHelpers';
export { default as validators } from './validators';
