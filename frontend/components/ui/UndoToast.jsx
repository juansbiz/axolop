/**
 * UndoToast Component
 *
 * Shows an undo notification with countdown progress bar.
 * "Lead archived. [Undo - 5s]"
 * Clicking Undo calls the reverse operation.
 *
 * Uses the existing toast-helper system (Sonner).
 */

import { toast as sonnerToast } from '@/components/ui/toast-provider';

const UNDO_DURATION = 5000; // 5 seconds

/**
 * Show an undo toast notification
 * @param {string} message - What happened (e.g., "Lead archived")
 * @param {function} undoFn - Function to call to reverse the action
 * @param {object} options - Additional options
 * @returns {string|number} Toast ID
 */
export function showUndoToast(message, undoFn, options = {}) {
  const duration = options.duration || UNDO_DURATION;

  return sonnerToast(message, {
    duration,
    position: options.position || 'bottom-center',
    style: {
      borderRadius: '12px',
      fontWeight: '500',
      background: '#1f2937', // gray-800
      color: '#f9fafb', // gray-50
      border: '1px solid rgba(63, 13, 40, 0.3)',
    },
    action: {
      label: 'Undo',
      onClick: async () => {
        try {
          await undoFn?.();
          sonnerToast.success('Action undone', {
            duration: 2000,
            position: options.position || 'bottom-center',
            style: {
              borderRadius: '12px',
              background: '#10B981',
              color: '#FFFFFF',
            },
          });
        } catch (error) {
          sonnerToast.error('Failed to undo', {
            duration: 3000,
            position: options.position || 'bottom-center',
            style: {
              borderRadius: '12px',
              background: '#EF4444',
              color: '#FFFFFF',
            },
          });
        }
      },
    },
    ...options,
  });
}

/**
 * Show a bulk action undo toast with progress
 * @param {number} total - Total items affected
 * @param {number} succeeded - Number that succeeded
 * @param {string} actionLabel - What was done (e.g., "moved")
 * @param {function} undoFn - Undo function
 */
export function showBulkUndoToast(total, succeeded, actionLabel, undoFn) {
  const failed = total - succeeded;
  const message = failed > 0
    ? `${succeeded} ${actionLabel}. ${failed} failed.`
    : `${succeeded} items ${actionLabel}.`;

  return showUndoToast(message, undoFn);
}

export default showUndoToast;
