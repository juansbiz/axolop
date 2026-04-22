/**
 * Alignment Utility Functions
 * Provides consistent alignment mapping across funnel blocks
 */

/**
 * Converts alignment values to flexbox justify-content classes
 * @param {string} alignment - Alignment value (left, center, right, mx-auto, ml-auto, mr-auto)
 * @returns {string} - Tailwind justify-content class
 */
export const getFlexAlignment = (alignment) => {
  const alignmentMap = {
    'left': 'justify-start',
    'center': 'justify-center',
    'right': 'justify-end',
    'mx-auto': 'justify-center',
    'ml-auto': 'justify-end',
    'mr-auto': 'justify-start',
    'justify-start': 'justify-start',
    'justify-center': 'justify-center',
    'justify-end': 'justify-end',
  };
  return alignmentMap[alignment] || 'justify-start';
};

/**
 * Converts alignment values to text-align classes
 * @param {string} alignment - Alignment value
 * @returns {string} - Tailwind text-align class
 */
export const getTextAlignment = (alignment) => {
  const textMap = {
    'left': 'text-left',
    'center': 'text-center',
    'right': 'text-right',
  };
  return textMap[alignment] || 'text-left';
};

/**
 * Converts alignment values to items-align classes
 * @param {string} alignment - Alignment value
 * @returns {string} - Tailwind items-align class
 */
export const getItemsAlignment = (alignment) => {
  const itemsMap = {
    'left': 'items-start',
    'center': 'items-center',
    'right': 'items-end',
    'justify-start': 'items-start',
    'justify-center': 'items-center',
    'justify-end': 'items-end',
  };
  return itemsMap[alignment] || 'items-start';
};
