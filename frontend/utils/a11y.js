/**
 * Accessibility Utilities (a11y)
 *
 * WCAG 2.1 AA compliant accessibility helpers for widgets
 * Ensures keyboard navigation, screen reader support, and focus management
 *
 * Usage:
 * ```javascript
 * import { useA11yId, announceToScreenReader, createAriaLabel } from '@/utils/a11y';
 *
 * const id = useA11yId('input');
 * announceToScreenReader('Form submitted successfully');
 * const label = createAriaLabel('Save', 'Saves your changes');
 * ```
 */

/**
 * Generate unique accessible IDs
 * Ensures no duplicate IDs in the DOM which breaks accessibility
 */
let idCounter = 0;

export const useA11yId = (prefix = 'element') => {
  idCounter += 1;
  return `${prefix}-${idCounter}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Reset ID counter (useful for testing)
 */
export const resetA11yIdCounter = () => {
  idCounter = 0;
};

/**
 * Announce messages to screen readers
 * Uses aria-live region to communicate with assistive technologies
 */
export const announceToScreenReader = (message, priority = 'polite') => {
  // Get or create announcement region
  let region = document.getElementById('a11y-announcements');

  if (!region) {
    region = document.createElement('div');
    region.id = 'a11y-announcements';
    region.setAttribute('aria-live', priority);
    region.setAttribute('aria-atomic', 'true');
    region.style.position = 'absolute';
    region.style.left = '-10000px';
    region.style.width = '1px';
    region.style.height = '1px';
    region.style.overflow = 'hidden';
    document.body.appendChild(region);
  }

  region.setAttribute('aria-live', priority);
  region.textContent = message;

  // Clear after announcement
  setTimeout(() => {
    region.textContent = '';
  }, 1000);
};

/**
 * Create accessible label combining label text and description
 * Used for inputs with additional help text
 */
export const createAriaLabel = (label, description = '') => {
  return description ? `${label}. ${description}` : label;
};

/**
 * Generate aria-describedby attributes for form fields
 * Links inputs to their error/help text
 */
export const createAriaDescribedBy = (baseId, hasError = false, hasHelp = false) => {
  const ids = [];
  if (hasError) ids.push(`${baseId}-error`);
  if (hasHelp) ids.push(`${baseId}-help`);
  return ids.length > 0 ? ids.join(' ') : undefined;
};

/**
 * Check if element is disabled for accessibility
 * Checks both disabled attribute and aria-disabled
 */
export const isAccessiblyDisabled = (element) => {
  if (!element) return false;
  return element.disabled || element.getAttribute('aria-disabled') === 'true';
};

/**
 * Create keyboard navigation config for list items
 * Handles arrow key navigation, Enter, and Escape
 */
export const createKeyboardNavConfig = (options = {}) => {
  const {
    onArrowUp = null,
    onArrowDown = null,
    onArrowLeft = null,
    onArrowRight = null,
    onEnter = null,
    onEscape = null,
    onHome = null,
    onEnd = null,
  } = options;

  return {
    handleKeyDown: (event) => {
      switch (event.key) {
        case 'ArrowUp':
          event.preventDefault();
          onArrowUp?.();
          break;
        case 'ArrowDown':
          event.preventDefault();
          onArrowDown?.();
          break;
        case 'ArrowLeft':
          event.preventDefault();
          onArrowLeft?.();
          break;
        case 'ArrowRight':
          event.preventDefault();
          onArrowRight?.();
          break;
        case 'Enter':
        case ' ':
          event.preventDefault();
          onEnter?.();
          break;
        case 'Escape':
          event.preventDefault();
          onEscape?.();
          break;
        case 'Home':
          event.preventDefault();
          onHome?.();
          break;
        case 'End':
          event.preventDefault();
          onEnd?.();
          break;
        default:
          break;
      }
    },
  };
};

/**
 * Keyboard event checker utility
 * Simplifies keyboard event checking
 */
export const keyboard = {
  isEnter: (event) => event.key === 'Enter',
  isEscape: (event) => event.key === 'Escape',
  isSpace: (event) => event.key === ' ',
  isArrowUp: (event) => event.key === 'ArrowUp',
  isArrowDown: (event) => event.key === 'ArrowDown',
  isArrowLeft: (event) => event.key === 'ArrowLeft',
  isArrowRight: (event) => event.key === 'ArrowRight',
  isHome: (event) => event.key === 'Home',
  isEnd: (event) => event.key === 'End',
  isTab: (event) => event.key === 'Tab',
  isArrow: (event) =>
    ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key),
};

/**
 * Focus management utilities
 */
export const focusManagement = {
  /**
   * Set focus with visual feedback
   */
  setFocus: (element) => {
    if (element) {
      element.focus();
      // Ensure focus is visible
      element.style.outline = '2px solid var(--form-accent, #3F0D28)';
      element.style.outlineOffset = '2px';
    }
  },

  /**
   * Remove focus styles
   */
  removeFocusStyles: (element) => {
    if (element) {
      element.style.outline = '';
      element.style.outlineOffset = '';
    }
  },

  /**
   * Get first focusable element in container
   */
  getFirstFocusable: (container) => {
    const focusableSelectors =
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
    return container?.querySelector(focusableSelectors);
  },

  /**
   * Get all focusable elements in container
   */
  getAllFocusable: (container) => {
    const focusableSelectors =
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
    return container ? Array.from(container.querySelectorAll(focusableSelectors)) : [];
  },

  /**
   * Focus first element on mount
   */
  focusFirstElement: (containerRef) => {
    const firstElement = focusManagement.getFirstFocusable(containerRef.current);
    if (firstElement) {
      setTimeout(() => focusManagement.setFocus(firstElement), 0);
    }
  },

  /**
   * Trap focus within container (modal, popup)
   * Prevents tab from escaping the container
   */
  trapFocus: (event, containerRef) => {
    const focusable = focusManagement.getAllFocusable(containerRef.current);
    if (focusable.length === 0) return;

    const firstElement = focusable[0];
    const lastElement = focusable[focusable.length - 1];

    if (event.shiftKey) {
      // Shift+Tab
      if (document.activeElement === firstElement) {
        event.preventDefault();
        focusManagement.setFocus(lastElement);
      }
    } else {
      // Tab
      if (document.activeElement === lastElement) {
        event.preventDefault();
        focusManagement.setFocus(firstElement);
      }
    }
  },
};

/**
 * ARIA attribute helpers
 */
export const ariaAttributes = {
  /**
   * Create aria-label for button
   */
  button: (label, description = '') => ({
    'aria-label': createAriaLabel(label, description),
  }),

  /**
   * Create aria attributes for expandable element
   */
  expandable: (isExpanded, id) => ({
    'aria-expanded': isExpanded,
    'aria-controls': id,
  }),

  /**
   * Create aria attributes for modal/dialog
   */
  modal: (title, description = '') => ({
    'role': 'dialog',
    'aria-modal': 'true',
    'aria-labelledby': `modal-title-${title}`,
    ...(description && { 'aria-describedby': `modal-desc-${title}` }),
  }),

  /**
   * Create aria attributes for loader/spinner
   */
  loader: () => ({
    'role': 'status',
    'aria-label': 'Loading',
    'aria-live': 'polite',
  }),

  /**
   * Create aria attributes for alert
   */
  alert: (type = 'info') => ({
    'role': 'alert',
    'aria-live': type === 'error' ? 'assertive' : 'polite',
    'aria-atomic': 'true',
  }),

  /**
   * Create aria attributes for form group
   */
  formGroup: (legend) => ({
    'role': 'group',
    'aria-labelledby': `legend-${legend}`,
  }),

  /**
   * Create aria attributes for listbox/select
   */
  listbox: (isOpen, activeId) => ({
    'role': 'listbox',
    'aria-expanded': isOpen,
    'aria-activedescendant': isOpen ? activeId : undefined,
  }),

  /**
   * Create aria attributes for tab panel
   */
  tabPanel: (tabId) => ({
    'role': 'tabpanel',
    'aria-labelledby': `tab-${tabId}`,
  }),
};

/**
 * Check color contrast ratio for accessibility
 */
export const checkContrast = (foreground, background) => {
  const getLuminance = (color) => {
    const rgb = parseInt(color.slice(1), 16);
    const r = (rgb >> 16) & 0xff;
    const g = (rgb >> 8) & 0xff;
    const b = (rgb >> 0) & 0xff;

    const luminance = [r, g, b].map((val) => {
      val = val / 255;
      return val <= 0.03928
        ? val / 12.92
        : Math.pow((val + 0.055) / 1.055, 2.4);
    });

    return luminance[0] * 0.2126 + luminance[1] * 0.7152 + luminance[2] * 0.0722;
  };

  const lum1 = getLuminance(foreground);
  const lum2 = getLuminance(background);
  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);

  const ratio = (lighter + 0.05) / (darker + 0.05);
  return {
    ratio: ratio.toFixed(2),
    meetsAAA: ratio >= 7,
    meetsAA: ratio >= 4.5,
  };
};

/**
 * Skip link helper
 * Provides keyboard shortcut to skip repetitive content
 */
export const createSkipLink = (targetId, label = 'Skip to main content') => {
  return {
    component: {
      id: 'skip-link',
      href: `#${targetId}`,
      className:
        'absolute top-0 left-0 bg-blue-600 text-white px-4 py-2 -translate-y-full focus:translate-y-0 transition-transform',
      children: label,
    },
    ariaAttributes: {
      id: targetId,
      tabIndex: '-1',
    },
  };
};

/**
 * Reducemotion preference helper
 * Respects user's motion preferences
 */
export const prefersReducedMotion = () => {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

/**
 * Get animation duration based on user preference
 */
export const getAnimationDuration = (normalDuration = 300) => {
  return prefersReducedMotion() ? 0 : normalDuration;
};

/**
 * Check if dark mode is preferred
 */
export const prefersDarkMode = () => {
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
};

export default {
  useA11yId,
  resetA11yIdCounter,
  announceToScreenReader,
  createAriaLabel,
  createAriaDescribedBy,
  isAccessiblyDisabled,
  createKeyboardNavConfig,
  keyboard,
  focusManagement,
  ariaAttributes,
  checkContrast,
  createSkipLink,
  prefersReducedMotion,
  getAnimationDuration,
  prefersDarkMode,
};
