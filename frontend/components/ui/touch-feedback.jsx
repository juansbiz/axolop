/**
 * TouchFeedback Component
 *
 * Enhanced touch interactions for mobile devices
 * Provides visual/haptic feedback on touch
 * Apple-inspired press effects
 */

import { motion } from 'framer-motion';
import { useIsTouchDevice } from '@/hooks/useMediaQuery';

export function TouchFeedback({
  children,
  className = '',
  pressScale = 0.95,
  haptic = false,
  ...props
}) {
  const isTouch = useIsTouchDevice();

  const handlePress = () => {
    if (haptic && 'vibrate' in navigator) {
      navigator.vibrate(10); // Light haptic feedback
    }
  };

  // Only apply press effects on touch devices
  if (!isTouch) {
    return <div className={className} {...props}>{children}</div>;
  }

  return (
    <motion.div
      whileTap={{ scale: pressScale }}
      onTapStart={handlePress}
      transition={{ duration: 0.1 }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

/**
 * TouchButton Component
 *
 * Button with enhanced touch feedback
 */
export function TouchButton({
  children,
  onClick,
  className = '',
  variant = 'primary',
  size = 'md',
  disabled = false,
  ...props
}) {
  const isTouch = useIsTouchDevice();

  const sizeClasses = {
    sm: 'px-3 py-2 text-sm min-h-[36px]',
    md: 'px-4 py-2.5 text-base min-h-[44px]', // iOS minimum touch target
    lg: 'px-6 py-3 text-lg min-h-[48px]',
  };

  const variantClasses = {
    primary: 'bg-[#3F0D28] text-white hover:bg-[#5A1840] active:bg-[#2A0919]',
    secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200 active:bg-gray-300',
    ghost: 'bg-transparent hover:bg-gray-100 active:bg-gray-200',
    danger: 'bg-red-600 text-white hover:bg-red-700 active:bg-red-800',
  };

  const handlePress = () => {
    if (isTouch && 'vibrate' in navigator) {
      navigator.vibrate(10);
    }
  };

  return (
    <motion.button
      onClick={onClick}
      onTapStart={handlePress}
      whileTap={!disabled ? { scale: 0.97 } : {}}
      transition={{ duration: 0.1 }}
      disabled={disabled}
      className={`
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        rounded-lg font-medium
        transition-colors duration-150
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
      {...props}
    >
      {children}
    </motion.button>
  );
}

/**
 * TouchCard Component
 *
 * Card with subtle press effect
 */
export function TouchCard({
  children,
  onClick,
  className = '',
  hoverable = true,
  ...props
}) {
  const isTouch = useIsTouchDevice();

  return (
    <motion.div
      onClick={onClick}
      whileTap={onClick && isTouch ? { scale: 0.98 } : {}}
      whileHover={onClick && hoverable && !isTouch ? { y: -2 } : {}}
      transition={{ duration: 0.15 }}
      className={`
        bg-white dark:bg-gray-800
        rounded-xl shadow-md dark:border-gray-700
        shadow-sm
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </motion.div>
  );
}
