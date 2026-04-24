/**
 * LoadingOverlay Component - Phase 4 UX Polish
 *
 * Full-screen semi-transparent overlay with centered spinner
 * Prevents user interaction while loading
 *
 * @example
 * <LoadingOverlay
 *   isVisible={isLoading}
 *   message="Loading your data..."
 *   subMessage="This may take a few seconds"
 * />
 */

import { motion, AnimatePresence } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';

export function LoadingOverlay({
  isVisible = false,
  message,
  subMessage = '',
  onClose = null,
  className = '',
}) {
  const { t } = useTranslation(['common']);
  const loadingMessage = message || t('messages.loading');
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className={cn(
            'fixed inset-0 z-[9999]',
            'flex items-center justify-center',
            'bg-black/30 backdrop-blur-sm',
            'cursor-wait',
            className
          )}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-labelledby="loading-message"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ delay: 0.1, duration: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl px-8 py-6 min-w-[280px] max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Spinner with pulsing animation */}
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                {/* Outer pulsing ring */}
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 0.8, 0.5],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                  className="absolute inset-0 bg-[#101010]/20 dark:bg-[#f2ff00]/30 rounded-full blur-xl"
                />

                {/* Spinner */}
                <Loader2
                  className="h-12 w-12 text-[#101010] dark:text-[#f2ff00] animate-spin relative z-10"
                  strokeWidth={2.5}
                />
              </div>

              {/* Main message */}
              {loadingMessage && (
                <div className="text-center">
                  <p
                    id="loading-message"
                    className="text-base font-semibold text-gray-900 dark:text-gray-100"
                  >
                    {loadingMessage}
                  </p>

                  {/* Sub message */}
                  {subMessage && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                      {subMessage}
                    </p>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/**
 * Inline Loading Spinner
 * Smaller version for buttons and inline use
 *
 * @example
 * <InlineLoader size="sm" />
 */
export function InlineLoader({
  size = 'md',
  className = '',
  color = 'primary'
}) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
    xl: 'h-10 w-10',
  };

  const colorClasses = {
    primary: 'text-[#101010] dark:text-[#f2ff00]',
    white: 'text-white',
    gray: 'text-gray-500',
  };

  return (
    <Loader2
      className={cn(
        sizeClasses[size],
        colorClasses[color],
        'animate-spin',
        className
      )}
      strokeWidth={2.5}
    />
  );
}

/**
 * Full Page Loading Screen
 * For initial page loads
 *
 * @example
 * <FullPageLoader message="Loading Dashboard..." />
 */
export function FullPageLoader({
  message,
  subMessage = ''
}) {
  const { t } = useTranslation(['common']);
  const loadingMessage = message || t('messages.loading');

  // CONTENT AREA ONLY - Uses flex-1 to fill parent, not fixed positioning
  return (
    <div className="flex-1 min-h-[400px] flex items-center justify-center bg-white dark:bg-gray-900">
      <div className="text-center">
        <div className="relative mb-6">
          {/* Animated glow effect */}
          <motion.div
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="absolute inset-0 bg-[#101010]/20 dark:bg-[#f2ff00]/30 rounded-full blur-2xl"
          />

          {/* Spinner */}
          <Loader2
            className="h-16 w-16 text-[#101010] dark:text-[#f2ff00] animate-spin relative mx-auto"
            strokeWidth={2}
          />
        </div>

        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
          {loadingMessage}
        </h2>

        {subMessage && (
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {subMessage}
          </p>
        )}
      </div>
    </div>
  );
}

export default LoadingOverlay;
