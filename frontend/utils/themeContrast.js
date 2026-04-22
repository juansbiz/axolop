/**
 * Theme Contrast Utilities
 * WCAG 2.1 compliant contrast calculations for form builder theming
 */

/**
 * Calculate relative luminance per WCAG 2.1
 * @param {string} hexColor - Hex color code (with or without #)
 * @returns {number} Luminance value between 0 and 1
 */
function getLuminance(hexColor) {
  if (!hexColor) return 0;

  const hex = hexColor.replace('#', '');
  if (hex.length !== 6) return 0;

  const r = parseInt(hex.substr(0, 2), 16) / 255;
  const g = parseInt(hex.substr(2, 2), 16) / 255;
  const b = parseInt(hex.substr(4, 2), 16) / 255;

  const toLinear = (c) => c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
}

/**
 * Get contrast ratio between two colors (1-21)
 * WCAG AA requires 4.5:1 for normal text, 3:1 for large text
 * WCAG AAA requires 7:1 for normal text, 4.5:1 for large text
 * @param {string} color1 - First hex color
 * @param {string} color2 - Second hex color
 * @returns {number} Contrast ratio
 */
export function getContrastRatio(color1, color2) {
  const lum1 = getLuminance(color1);
  const lum2 = getLuminance(color2);
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  return (brightest + 0.05) / (darkest + 0.05);
}

/**
 * Get accessible text color for any background
 * Returns white or dark color based on which provides better contrast
 * @param {string} backgroundColor - Background hex color
 * @param {string} lightText - Light text color option (default white)
 * @param {string} darkText - Dark text color option (default dark gray)
 * @returns {string} The color that provides better contrast
 */
export function getContrastingTextColor(backgroundColor, lightText = '#FFFFFF', darkText = '#1F2937') {
  if (!backgroundColor || backgroundColor === 'transparent') return darkText;

  try {
    const contrastWithLight = getContrastRatio(backgroundColor, lightText);
    const contrastWithDark = getContrastRatio(backgroundColor, darkText);
    return contrastWithLight >= contrastWithDark ? lightText : darkText;
  } catch {
    return darkText; // Fallback for invalid colors
  }
}

/**
 * Check if background is dark (for conditional styling)
 * @param {string} hexColor - Hex color to check
 * @returns {boolean} True if dark, false if light
 */
export function isDarkBackground(hexColor) {
  if (!hexColor || hexColor === 'transparent') return false;
  try {
    return getLuminance(hexColor) < 0.5;
  } catch {
    return false;
  }
}

/**
 * Add transparency to hex color (returns hex with alpha)
 * @param {string} hexColor - 6-character hex color
 * @param {number} opacity - Opacity value between 0 and 1
 * @returns {string} Hex color with alpha channel
 */
export function withOpacity(hexColor, opacity) {
  if (!hexColor) return 'transparent';
  const hex = hexColor.replace('#', '');
  if (hex.length !== 6) return hexColor;
  const alpha = Math.round(opacity * 255).toString(16).padStart(2, '0');
  return `#${hex}${alpha}`;
}

/**
 * Get input field styling based on background
 * @param {string} backgroundColor - Form background color
 * @param {string} accentColor - Theme accent color
 * @returns {object} Style object for input fields
 */
export function getInputStyles(backgroundColor, accentColor = '#3F0D28') {
  const isDark = isDarkBackground(backgroundColor);
  return {
    backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : '#FFFFFF',
    color: getContrastingTextColor(backgroundColor),
    borderColor: isDark ? 'rgba(255,255,255,0.2)' : '#E5E7EB',
    placeholderColor: isDark ? 'rgba(255,255,255,0.5)' : '#9CA3AF',
    focusRingColor: accentColor,
  };
}

/**
 * Get border color that works on the given background
 * @param {string} backgroundColor - Background color
 * @param {boolean} isSelected - Whether element is selected
 * @param {string} accentColor - Theme accent color for selected state
 * @returns {string} Appropriate border color
 */
export function getBorderColor(backgroundColor, isSelected = false, accentColor = '#3F0D28') {
  if (isSelected) return accentColor;
  const isDark = isDarkBackground(backgroundColor);
  return isDark ? 'rgba(255,255,255,0.2)' : '#E5E7EB';
}
