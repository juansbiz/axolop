// ========================================
// FRONTEND LOGGER UTILITY
// ========================================
// Environment-aware logging with Sentry integration
// Replaces console.log/warn/error with structured logging

import * as Sentry from '@sentry/react';

const isDev = import.meta.env.DEV;
const isProd = import.meta.env.PROD;

/**
 * Logger utility for frontend
 * - Development: Logs to console with colors
 * - Production: Only errors sent to Sentry, warnings logged minimally
 */
export const logger = {
  /**
   * Info logs - only in development
   * @param {string} message - Log message
   * @param {object} context - Additional context
   */
  info: (message, context = {}) => {
    if (isDev) {
      console.log(`%c[INFO] ${message}`, 'color: #3b82f6', context);
    }
  },

  /**
   * Sensitive logs - ONLY in development, NEVER in production
   * Use for auth tokens, session data, user credentials context
   * @param {string} message - Log message (should NOT contain the sensitive data itself)
   * @param {object} context - Context data (will be redacted in output for safety)
   */
  sensitive: (message, context = {}) => {
    if (isDev) {
      // Only show that sensitive operation occurred, not the actual data
      console.log(`%c[SENSITIVE] ${message}`, 'color: #f97316', context ? '[data present]' : '[no data]');
    }
    // In production, this is a no-op - sensitive data is never logged
  },

  /**
   * Auth logs - only in development, for authentication flow tracking
   * @param {string} message - Log message
   * @param {object} context - Additional context (tokens redacted automatically)
   */
  auth: (message, context = {}) => {
    if (isDev) {
      // Redact sensitive fields if present
      const safeContext = { ...context };
      if (safeContext.access_token) safeContext.access_token = '[REDACTED]';
      if (safeContext.refresh_token) safeContext.refresh_token = '[REDACTED]';
      if (safeContext.session?.access_token) {
        safeContext.session = { ...safeContext.session, access_token: '[REDACTED]' };
      }
      if (safeContext.session?.refresh_token) {
        safeContext.session = { ...safeContext.session, refresh_token: '[REDACTED]' };
      }
      console.log(`%c[AUTH] ${message}`, 'color: #22c55e', safeContext);
    }
  },

  /**
   * Warning logs - development console + Sentry in production
   * @param {string} message - Warning message
   * @param {object} context - Additional context
   */
  warn: (message, context = {}) => {
    if (isDev) {
      console.warn(`%c[WARN] ${message}`, 'color: #f59e0b', context);
    }

    if (isProd) {
      Sentry.captureMessage(message, {
        level: 'warning',
        extra: context,
      });
    }
  },

  /**
   * Error logs - always logged, sent to Sentry
   * @param {string} message - Error message
   * @param {Error} error - Error object
   * @param {object} context - Additional context
   */
  error: (message, error = null, context = {}) => {
    if (isDev) {
      console.error(`%c[ERROR] ${message}`, 'color: #ef4444', error, context);
    }

    // Always send errors to Sentry (dev and prod)
    if (error instanceof Error) {
      Sentry.captureException(error, {
        extra: { message, ...context },
      });
    } else {
      Sentry.captureMessage(message, {
        level: 'error',
        extra: { ...context, error },
      });
    }
  },

  /**
   * Debug logs - only in development
   * @param {string} message - Debug message
   * @param {object} context - Additional context
   */
  debug: (message, context = {}) => {
    if (isDev) {
      console.debug(`%c[DEBUG] ${message}`, 'color: #8b5cf6', context);
    }
  },

  /**
   * Success logs - only in development (for user actions)
   * @param {string} message - Success message
   * @param {object} context - Additional context
   */
  success: (message, context = {}) => {
    if (isDev) {
      console.log(`%c[SUCCESS] ${message}`, 'color: #10b981', context);
    }
  },

  /**
   * Performance timing logs - development only
   * @param {string} label - Performance label
   * @param {number} startTime - Performance start time
   */
  perf: (label, startTime) => {
    if (isDev) {
      const duration = performance.now() - startTime;
      console.log(
        `%c[PERF] ${label}: ${duration.toFixed(2)}ms`,
        'color: #06b6d4'
      );
    }
  },

  /**
   * Group logs for better organization - development only
   * @param {string} groupName - Group name
   * @param {function} fn - Function to execute within group
   */
  group: (groupName, fn) => {
    if (isDev) {
      console.group(`%c${groupName}`, 'color: #a855f7; font-weight: bold');
      fn();
      console.groupEnd();
    } else {
      // In production, just execute the function without grouping
      fn();
    }
  },
};

export default logger;
