/**
 * SuccessAnimation Component
 *
 * Beautiful success checkmark animation
 * Apple-inspired with smooth spring physics
 */

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Sparkles } from 'lucide-react';
import { usePrefersReducedMotion } from '@/hooks/useAccessibility';

export function SuccessAnimation({ show, message, onComplete, duration = 2000 }) {
  const prefersReducedMotion = usePrefersReducedMotion();

  const springConfig = {
    type: prefersReducedMotion ? 'tween' : 'spring',
    stiffness: 300,
    damping: 20,
    duration: prefersReducedMotion ? 0.2 : undefined,
  };

  // Auto-hide after duration
  React.useEffect(() => {
    if (show && onComplete) {
      const timer = setTimeout(onComplete, duration);
      return () => clearTimeout(timer);
    }
  }, [show, duration, onComplete]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9998] flex items-center justify-center bg-black/20 backdrop-blur-sm"
          onClick={onComplete}
        >
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 180 }}
            transition={springConfig}
            className="relative"
          >
            {/* Glow effect */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 2, opacity: [0, 0.5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="absolute inset-0 bg-green-400 rounded-full blur-3xl"
            />

            {/* Main circle */}
            <div className="relative w-32 h-32 bg-gradient-to-br from-green-400 to-green-600 rounded-full shadow-2xl flex items-center justify-center">
              {/* Checkmark */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, ...springConfig }}
              >
                <Check className="w-16 h-16 text-white stroke-[3]" />
              </motion.div>

              {/* Sparkles */}
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0, x: 0, y: 0 }}
                  animate={{
                    scale: [0, 1, 0],
                    x: Math.cos((i * Math.PI * 2) / 8) * 60,
                    y: Math.sin((i * Math.PI * 2) / 8) * 60,
                  }}
                  transition={{
                    delay: 0.3 + i * 0.05,
                    duration: 0.8,
                  }}
                  className="absolute"
                  style={{
                    left: '50%',
                    top: '50%',
                  }}
                >
                  <Sparkles className="w-4 h-4 text-yellow-300" />
                </motion.div>
              ))}
            </div>

            {/* Message */}
            {message && (
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mt-6 text-center text-white font-semibold text-lg drop-shadow-lg"
              >
                {message}
              </motion.p>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/**
 * useSuccessAnimation Hook
 */
export function useSuccessAnimation() {
  const [show, setShow] = React.useState(false);
  const [message, setMessage] = React.useState('');

  const trigger = React.useCallback((msg = 'Success!', duration = 2000) => {
    setMessage(msg);
    setShow(true);
    setTimeout(() => setShow(false), duration);
  }, []);

  return { show, message, trigger };
}
