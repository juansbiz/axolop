/**
 * LoadingOverlay Component
 *
 * Apple-inspired loading overlay with blur backdrop and spinner
 * Used for async operations throughout the Form Builder
 *
 * Usage:
 *   <LoadingOverlay isLoading={isSaving} message="Saving form..." />
 *
 * Props:
 * - isLoading: boolean - Show/hide the overlay
 * - message: string (optional) - Loading message to display
 * - blur: boolean (default: true) - Apply backdrop blur
 * - spinner: boolean (default: true) - Show spinner animation
 */

import { motion, AnimatePresence } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';

export function LoadingOverlay({
  isLoading = false,
  message,
  blur = true,
  spinner = true,
  className
}) {
  const { t } = useTranslation(['common']);
  const loadingMessage = message || t('messages.loading');
  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className={cn(
            'absolute inset-0 z-50 flex items-center justify-center',
            blur && 'backdrop-blur-sm bg-white/80 dark:bg-gray-900/80',
            !blur && 'bg-white/90 dark:bg-gray-900/90',
            className
          )}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.2 }}
            className="flex flex-col items-center gap-3 px-6 py-4 bg-white dark:bg-gray-800 rounded-xl shadow-lg shadow-md dark:border-gray-700"
          >
            {spinner && (
              <Loader2 className="h-8 w-8 text-[#3F0D28] dark:text-[#7A3D5C] animate-spin" />
            )}
            {loadingMessage && (
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {loadingMessage}
              </p>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/**
 * Inline Loading Indicator
 * Smaller version for inline use (buttons, small sections)
 */
export function LoadingSpinner({ size = 'md', className }) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
  };

  return (
    <Loader2
      className={cn(
        sizeClasses[size],
        'text-[#3F0D28] dark:text-[#7A3D5C] animate-spin',
        className
      )}
    />
  );
}

/**
 * Skeleton Loader for Form Cards
 * Used when loading form lists
 */
export function FormCardSkeleton() {
  return (
    <div className="rounded-lg shadow-md dark:border-gray-800 p-6 space-y-4 animate-pulse">
      <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded w-2/3"></div>
      <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-full"></div>
      <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-5/6"></div>
      <div className="flex gap-2 pt-2">
        <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded w-20"></div>
        <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded w-20"></div>
      </div>
    </div>
  );
}

/**
 * Loading Button State
 * Replaces button content with spinner while loading
 */
export function ButtonLoading({ children, isLoading, ...props }) {
  const { t } = useTranslation(['common']);
  return (
    <button disabled={isLoading} {...props}>
      {isLoading ? (
        <span className="flex items-center gap-2">
          <LoadingSpinner size="sm" />
          <span>{typeof children === 'string' ? children : t('messages.loading')}</span>
        </span>
      ) : (
        children
      )}
    </button>
  );
}
