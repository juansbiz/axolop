/**
 * Animation Utilities for Premium Share Experience
 * Apple/Typeform-inspired animation tokens and presets
 */

// ========================================
// SPRING CONFIGURATIONS
// ========================================

export const SPRING = {
  // Snappy - Fast, responsive (buttons, icons, toggles)
  snappy: {
    type: 'spring',
    damping: 25,
    stiffness: 400,
    mass: 0.5,
  },

  // Smooth - Balanced (panels, modals, sections)
  smooth: {
    type: 'spring',
    damping: 30,
    stiffness: 300,
    mass: 0.8,
  },

  // Bouncy - Playful (success states, celebrations)
  bouncy: {
    type: 'spring',
    damping: 15,
    stiffness: 300,
    mass: 0.6,
  },

  // Gentle - Slow, smooth (large elements, page transitions)
  gentle: {
    type: 'spring',
    damping: 35,
    stiffness: 250,
    mass: 1,
  },
};

// ========================================
// EASING CURVES
// ========================================

export const EASING = {
  // Material Design swift out
  swift: 'cubic-bezier(0.4, 0.0, 0.2, 1)',

  // Bounce with overshoot
  bounce: 'cubic-bezier(0.34, 1.56, 0.64, 1)',

  // Smooth ease in-out
  smooth: 'cubic-bezier(0.25, 0.1, 0.25, 1)',

  // Apple-style ease out
  apple: 'cubic-bezier(0.16, 1, 0.3, 1)',

  // Linear (for continuous animations)
  linear: 'linear',
};

// ========================================
// DURATION CONSTANTS
// ========================================

export const DURATION = {
  instant: 0.1, // 100ms
  fast: 0.2, // 200ms
  normal: 0.3, // 300ms
  slow: 0.5, // 500ms
  slower: 0.7, // 700ms
  slowest: 1.0, // 1000ms
};

// ========================================
// SHADOW TOKENS
// ========================================

export const SHADOWS = {
  // Elevations
  xs: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  sm: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',

  // Special shadows
  inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.05)',
  glow: '0 0 20px rgba(233, 44, 146, 0.3)', // Brand pink glow
  glowSuccess: '0 0 20px rgba(48, 209, 88, 0.3)', // Success green glow
  glowDanger: '0 0 20px rgba(239, 68, 68, 0.3)', // Danger red glow
  none: 'none',
};

// ========================================
// ANIMATION VARIANTS (Framer Motion)
// ========================================

// Fade in animation
export const fadeIn = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: DURATION.normal, ease: EASING.smooth },
  },
};

// Slide up animation
export const slideUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATION.normal, ease: EASING.apple },
  },
};

// Slide down animation
export const slideDown = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATION.normal, ease: EASING.apple },
  },
};

// Scale animation
export const scale = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: SPRING.smooth,
  },
};

// Scale bounce (for success states)
export const scaleBounce = {
  hidden: { opacity: 0, scale: 0, rotate: -180 },
  visible: {
    opacity: 1,
    scale: [0, 1.2, 1],
    rotate: 0,
    transition: SPRING.bouncy,
  },
};

// Stagger children container
export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
};

// Stagger child item
export const staggerItem = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATION.fast, ease: EASING.apple },
  },
};

// ========================================
// HELPER FUNCTIONS
// ========================================

/**
 * Creates a shimmer animation for background
 * Used for publish button idle state
 */
export const shimmerAnimation = {
  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
  transition: {
    duration: 3,
    repeat: Infinity,
    ease: EASING.linear,
  },
};

/**
 * Creates a ripple effect origin point
 * Used for copy button ripple animation
 */
export const createRipple = (event) => {
  const rect = event.currentTarget.getBoundingClientRect();
  return {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top,
  };
};

/**
 * Pulse animation for live badge
 */
export const pulseAnimation = {
  scale: [1, 1.2, 1],
  opacity: [1, 0.8, 1],
  transition: {
    duration: 2,
    repeat: Infinity,
    ease: EASING.smooth,
  },
};

/**
 * Height auto animation for collapsible sections
 * @deprecated Use collapseVariants instead - height animations cause layout thrashing
 */
export const heightAuto = {
  hidden: {
    height: 0,
    opacity: 0,
    overflow: 'hidden',
  },
  visible: {
    height: 'auto',
    opacity: 1,
    overflow: 'visible',
    transition: SPRING.smooth,
  },
  exit: {
    height: 0,
    opacity: 0,
    overflow: 'hidden',
    transition: SPRING.smooth,
  },
};

/**
 * PERFORMANT Collapse variants using CSS Grid
 * Uses grid-template-rows which doesn't trigger layout recalculations
 * Much better performance than height: 0 -> height: auto
 */
export const collapseVariants = {
  collapsed: {
    gridTemplateRows: '0fr',
    opacity: 0,
  },
  expanded: {
    gridTemplateRows: '1fr',
    opacity: 1,
    transition: {
      gridTemplateRows: { duration: DURATION.normal, ease: EASING.apple },
      opacity: { duration: DURATION.fast, ease: EASING.smooth },
    },
  },
};

/**
 * PERFORMANT Scale-based collapse (vertical)
 * Uses scaleY with transform-origin: top for collapsible content
 * Even better performance than grid-template-rows
 */
export const scaleCollapseVariants = {
  collapsed: {
    scaleY: 0,
    opacity: 0,
    originY: 0,
  },
  expanded: {
    scaleY: 1,
    opacity: 1,
    originY: 0,
    transition: SPRING.smooth,
  },
};

/**
 * Rotate animation for chevrons
 */
export const rotateChevron = (isOpen) => ({
  rotate: isOpen ? 180 : 0,
  transition: SPRING.snappy,
});

export default {
  SPRING,
  EASING,
  DURATION,
  SHADOWS,
  fadeIn,
  slideUp,
  slideDown,
  scale,
  scaleBounce,
  staggerContainer,
  staggerItem,
  shimmerAnimation,
  createRipple,
  pulseAnimation,
  heightAuto,
  rotateChevron,
};
