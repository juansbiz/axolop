/**
 * Typography Utilities
 *
 * Centralized typography helpers for consistent text styling across the application.
 * Uses design system constants from funnelDesignSystem.js
 */

import { FONT_SIZES, MOBILE_FONT_SIZES, FONT_WEIGHTS, LINE_HEIGHTS, LETTER_SPACING } from '@/data/funnelDesignSystem';

/**
 * Typography scale for headlines
 * Maps semantic sizes to actual font sizes with responsive variants
 */
export const HEADLINE_SCALE = {
  xs: { desktop: FONT_SIZES.xl, mobile: MOBILE_FONT_SIZES.lg },
  sm: { desktop: FONT_SIZES['2xl'], mobile: MOBILE_FONT_SIZES.xl },
  md: { desktop: FONT_SIZES['3xl'], mobile: MOBILE_FONT_SIZES['2xl'] },
  lg: { desktop: FONT_SIZES['4xl'], mobile: MOBILE_FONT_SIZES['3xl'] },
  xl: { desktop: FONT_SIZES['5xl'], mobile: MOBILE_FONT_SIZES['4xl'] },
  '2xl': { desktop: FONT_SIZES['6xl'], mobile: MOBILE_FONT_SIZES['5xl'] },
};

/**
 * Typography scale for body text
 */
export const BODY_SCALE = {
  xs: { desktop: FONT_SIZES.xs, mobile: MOBILE_FONT_SIZES.xs },
  sm: { desktop: FONT_SIZES.sm, mobile: MOBILE_FONT_SIZES.sm },
  base: { desktop: FONT_SIZES.base, mobile: MOBILE_FONT_SIZES.base },
  lg: { desktop: FONT_SIZES.lg, mobile: MOBILE_FONT_SIZES.lg },
  xl: { desktop: FONT_SIZES.xl, mobile: MOBILE_FONT_SIZES.xl },
};

/**
 * Typography scale for buttons
 */
export const BUTTON_SCALE = {
  xs: { desktop: FONT_SIZES.xs, mobile: MOBILE_FONT_SIZES.xs },
  sm: { desktop: FONT_SIZES.sm, mobile: MOBILE_FONT_SIZES.sm },
  md: { desktop: FONT_SIZES.base, mobile: MOBILE_FONT_SIZES.base },
  lg: { desktop: FONT_SIZES.lg, mobile: MOBILE_FONT_SIZES.lg },
  xl: { desktop: FONT_SIZES.xl, mobile: MOBILE_FONT_SIZES.xl },
};

/**
 * Typography scale for form inputs
 * IMPORTANT: Minimum 16px on mobile to prevent iOS zoom
 */
export const INPUT_SCALE = {
  sm: { desktop: FONT_SIZES.sm, mobile: '16px' },
  md: { desktop: FONT_SIZES.base, mobile: '16px' },
  lg: { desktop: FONT_SIZES.lg, mobile: MOBILE_FONT_SIZES.lg },
};

/**
 * Typography scale for UI chrome (labels, captions, metadata)
 */
export const UI_SCALE = {
  xs: { desktop: FONT_SIZES.xs, mobile: MOBILE_FONT_SIZES.xs },
  sm: { desktop: FONT_SIZES.sm, mobile: MOBILE_FONT_SIZES.sm },
  base: { desktop: FONT_SIZES.base, mobile: MOBILE_FONT_SIZES.base },
};

/**
 * Get responsive font size CSS
 * @param {Object} scale - Font size object with desktop/mobile values
 * @returns {string} CSS with media query
 */
export const getResponsiveFontSize = (scale) => {
  if (!scale) return '';
  return `
    font-size: ${scale.mobile};
    @media (min-width: 768px) {
      font-size: ${scale.desktop};
    }
  `;
};

/**
 * Get typography styles object for inline styles
 * @param {string} variant - Typography variant (headline, body, button, etc.)
 * @param {string} size - Size key (xs, sm, md, lg, xl)
 * @param {boolean} isMobile - Whether to use mobile size
 * @returns {Object} Style object
 */
export const getTypographyStyles = (variant, size = 'md', isMobile = false) => {
  const scales = {
    headline: HEADLINE_SCALE,
    body: BODY_SCALE,
    button: BUTTON_SCALE,
    input: INPUT_SCALE,
    ui: UI_SCALE,
  };

  const scale = scales[variant]?.[size];
  if (!scale) return {};

  return {
    fontSize: isMobile ? scale.mobile : scale.desktop,
  };
};

/**
 * Headline typography preset
 * @param {string} size - Size key
 * @returns {Object} Complete typography styles
 */
export const headlineTypography = (size = 'md') => ({
  fontSize: HEADLINE_SCALE[size]?.desktop || FONT_SIZES['3xl'],
  fontWeight: FONT_WEIGHTS.bold,
  lineHeight: LINE_HEIGHTS.tight,
  letterSpacing: LETTER_SPACING.tight,
});

/**
 * Body text typography preset
 * @param {string} size - Size key
 * @returns {Object} Complete typography styles
 */
export const bodyTypography = (size = 'base') => ({
  fontSize: BODY_SCALE[size]?.desktop || FONT_SIZES.base,
  fontWeight: FONT_WEIGHTS.normal,
  lineHeight: LINE_HEIGHTS.normal,
  letterSpacing: LETTER_SPACING.normal,
});

/**
 * Button typography preset
 * @param {string} size - Size key
 * @returns {Object} Complete typography styles
 */
export const buttonTypography = (size = 'md') => ({
  fontSize: BUTTON_SCALE[size]?.desktop || FONT_SIZES.base,
  fontWeight: FONT_WEIGHTS.semibold,
  lineHeight: LINE_HEIGHTS.none,
  letterSpacing: LETTER_SPACING.tight,
});

/**
 * Input typography preset
 * @param {string} size - Size key
 * @returns {Object} Complete typography styles
 */
export const inputTypography = (size = 'md') => ({
  fontSize: INPUT_SCALE[size]?.desktop || FONT_SIZES.base,
  fontWeight: FONT_WEIGHTS.normal,
  lineHeight: LINE_HEIGHTS.normal,
  letterSpacing: LETTER_SPACING.normal,
});

/**
 * UI chrome typography preset (labels, captions)
 * @param {string} size - Size key
 * @returns {Object} Complete typography styles
 */
export const uiTypography = (size = 'sm') => ({
  fontSize: UI_SCALE[size]?.desktop || FONT_SIZES.sm,
  fontWeight: FONT_WEIGHTS.medium,
  lineHeight: LINE_HEIGHTS.snug,
  letterSpacing: LETTER_SPACING.normal,
});

export default {
  HEADLINE_SCALE,
  BODY_SCALE,
  BUTTON_SCALE,
  INPUT_SCALE,
  UI_SCALE,
  getResponsiveFontSize,
  getTypographyStyles,
  headlineTypography,
  bodyTypography,
  buttonTypography,
  inputTypography,
  uiTypography,
};
