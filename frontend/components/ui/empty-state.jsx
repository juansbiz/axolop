/**
 * EmptyState Component
 *
 * Beautiful empty states with illustrations
 * Apple-inspired design with subtle animations
 */

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  actionLabel,
  secondaryAction,
  secondaryActionLabel,
  illustration,
  className = '',
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={`flex flex-col items-center justify-center text-center p-6 md:p-12 ${className}`}
    >
      {/* Icon or Illustration */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="mb-6"
      >
        {illustration ? (
          <div className="w-48 h-48 md:w-64 md:h-64">{illustration}</div>
        ) : Icon ? (
          <div className="relative">
            {/* Glow effect */}
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="absolute inset-0 bg-[#3F0D28]/20 dark:bg-[#CBA6F7]/20 rounded-full blur-2xl"
            />

            {/* Icon */}
            <div className="relative w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-[#3F0D28]/10 to-[#3F0D28]/20 dark:from-[#3F0D28]/20 dark:to-[#3F0D28]/30 rounded-full flex items-center justify-center">
              <Icon className="w-10 h-10 md:w-12 md:h-12 text-[#3F0D28] dark:text-[#7A3D5C]" />
            </div>
          </div>
        ) : null}
      </motion.div>

      {/* Title */}
      <motion.h3
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="text-xl md:text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-2"
      >
        {title}
      </motion.h3>

      {/* Description */}
      {description && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="text-sm md:text-base text-gray-600 dark:text-gray-400 mb-6 md:mb-8 max-w-md px-4 md:px-0"
        >
          {description}
        </motion.p>
      )}

      {/* Actions */}
      {(action || secondaryAction) && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="flex flex-col sm:flex-row items-center gap-2 md:gap-3 w-full sm:w-auto px-4 md:px-0"
        >
          {action && (
            <Button
              onClick={action}
              size="lg"
              className="gap-2 shadow-lg hover:shadow-xl transition-shadow w-full sm:w-auto"
            >
              {actionLabel || 'Get Started'}
            </Button>
          )}
          {secondaryAction && (
            <Button
              onClick={secondaryAction}
              variant="outline"
              size="lg"
              className="gap-2 w-full sm:w-auto"
            >
              {secondaryActionLabel || 'Learn More'}
            </Button>
          )}
        </motion.div>
      )}
    </motion.div>
  );
}
