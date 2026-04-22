/**
 * Toast Provider - Sonner-based toast notification system
 * Replaces browser alerts with professional toast notifications
 *
 * Toast Types:
 * - Success: Green checkmark, smooth slide-in from top-right
 * - Error: Red X, shake animation
 * - Info: Blue info icon
 * - Action: With undo button
 * - Loading: For async operations
 *
 * Design Specs:
 * - Duration: 4s (success), 6s (error), 2s (info)
 * - Position: top-right
 * - Max width: 420px
 * - Animation: slide-in-from-right + fade (200ms)
 * - Font: Inter, 14px
 * - Shadow: subtle, elevation-3
 */

import { Toaster } from 'sonner';
import { useLanguage } from '@/context/LanguageContext';

export function ToastProvider() {
  const { language } = useLanguage();

  return (
    <Toaster
      position="top-right"
      expand={false}
      richColors
      closeButton
      duration={4000}
      toastOptions={{
        style: {
          fontFamily: 'Inter, system-ui, sans-serif',
          fontSize: '14px',
          maxWidth: '420px',
          borderRadius: '8px',
          padding: '12px 16px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        },
        className: 'toast-notification',
      }}
      // Custom language-aware close button
      lang={language}
    />
  );
}

/**
 * Toast helper functions with i18n support
 * Import these functions to show toasts throughout the app
 */
import { toast as sonnerToast } from 'sonner';

export const toast = {
  /**
   * Success toast - Green checkmark, 4s duration
   * @param {string} message - Main message
   * @param {Object} options - Additional options
   */
  success: (message, options = {}) => {
    return sonnerToast.success(message, {
      duration: 4000,
      ...options,
    });
  },

  /**
   * Error toast - Red X, 6s duration
   * @param {string} message - Error message
   * @param {Object} options - Additional options
   */
  error: (message, options = {}) => {
    return sonnerToast.error(message, {
      duration: 6000,
      ...options,
    });
  },

  /**
   * Info toast - Blue info icon, 2s duration
   * @param {string} message - Info message
   * @param {Object} options - Additional options
   */
  info: (message, options = {}) => {
    return sonnerToast.info(message, {
      duration: 2000,
      ...options,
    });
  },

  /**
   * Warning toast - Amber warning icon, 5s duration
   * @param {string} message - Warning message
   * @param {Object} options - Additional options
   */
  warning: (message, options = {}) => {
    return sonnerToast.warning(message, {
      duration: 5000,
      ...options,
    });
  },

  /**
   * Loading toast - Shows until dismissed
   * @param {string} message - Loading message
   * @param {Object} options - Additional options
   */
  loading: (message, options = {}) => {
    return sonnerToast.loading(message, options);
  },

  /**
   * Action toast - With undo/action button
   * @param {string} message - Main message
   * @param {Object} options - Must include action object
   * @example
   * toast.action('Form deleted', {
   *   action: {
   *     label: 'Undo',
   *     onClick: () => restoreForm(),
   *   },
   * })
   */
  action: (message, options = {}) => {
    return sonnerToast(message, {
      duration: 5000,
      ...options,
    });
  },

  /**
   * Promise toast - Automatically handles loading/success/error states
   * @param {Promise} promise - Promise to track
   * @param {Object} messages - Messages for each state
   * @example
   * toast.promise(
   *   saveForm(),
   *   {
   *     loading: 'Saving form...',
   *     success: 'Form saved successfully!',
   *     error: 'Failed to save form',
   *   }
   * )
   */
  promise: (promise, messages) => {
    return sonnerToast.promise(promise, messages);
  },

  /**
   * Custom toast - Full control over appearance
   * @param {string} message - Message
   * @param {Object} options - Full options object
   */
  custom: (message, options = {}) => {
    return sonnerToast(message, options);
  },

  /**
   * Dismiss a specific toast or all toasts
   * @param {string} toastId - Optional toast ID to dismiss
   */
  dismiss: (toastId) => {
    return sonnerToast.dismiss(toastId);
  },
};

export default toast;
