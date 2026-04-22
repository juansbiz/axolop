/**
 * Safe Array Operations
 *
 * Provides type-safe wrappers for common array operations that prevent crashes
 * when data is null, undefined, or not an array.
 *
 * Replaces unsafe patterns like:
 * ❌ array.map(fn) → ✅ safeMap(array, fn)
 * ❌ array.filter(fn) → ✅ safeFilter(array, fn)
 * ❌ array.reduce(fn) → ✅ safeReduce(array, fn, initial)
 */

/**
 * Safe array map operation
 * @param {*} data - Potentially unsafe data
 * @param {Function} fn - Mapping function
 * @param {*} fallback - Value to return if data is not an array (default: [])
 * @returns {Array} - Mapped array or fallback
 */
export function safeMap(data, fn, fallback = []) {
  if (!Array.isArray(data)) {
    console.warn('safeMap: Expected array, got', typeof data, data);
    return fallback;
  }
  try {
    return data.map(fn);
  } catch (error) {
    console.error('safeMap: Error during mapping', error);
    return fallback;
  }
}

/**
 * Safe array filter operation
 * @param {*} data - Potentially unsafe data
 * @param {Function} fn - Filter function
 * @param {*} fallback - Value to return if data is not an array (default: [])
 * @returns {Array} - Filtered array or fallback
 */
export function safeFilter(data, fn, fallback = []) {
  if (!Array.isArray(data)) {
    console.warn('safeFilter: Expected array, got', typeof data, data);
    return fallback;
  }
  try {
    return data.filter(fn);
  } catch (error) {
    console.error('safeFilter: Error during filtering', error);
    return fallback;
  }
}

/**
 * Safe array reduce operation
 * @param {*} data - Potentially unsafe data
 * @param {Function} fn - Reduce function
 * @param {*} initial - Initial accumulator value
 * @param {*} fallback - Value to return if data is not an array or reduce fails (default: initial)
 * @returns {*} - Reduced value or fallback
 */
export function safeReduce(data, fn, initial, fallback = initial) {
  if (!Array.isArray(data)) {
    console.warn('safeReduce: Expected array, got', typeof data, data);
    return fallback;
  }
  try {
    return data.reduce(fn, initial);
  } catch (error) {
    console.error('safeReduce: Error during reduction', error);
    return fallback;
  }
}

/**
 * Safe array find operation
 * @param {*} data - Potentially unsafe data
 * @param {Function} fn - Find function
 * @param {*} fallback - Value to return if data is not an array or item not found (default: undefined)
 * @returns {*} - Found item or fallback
 */
export function safeFind(data, fn, fallback = undefined) {
  if (!Array.isArray(data)) {
    console.warn('safeFind: Expected array, got', typeof data, data);
    return fallback;
  }
  try {
    return data.find(fn) ?? fallback;
  } catch (error) {
    console.error('safeFind: Error during find', error);
    return fallback;
  }
}

/**
 * Safe array some operation
 * @param {*} data - Potentially unsafe data
 * @param {Function} fn - Test function
 * @param {boolean} fallback - Value to return if data is not an array (default: false)
 * @returns {boolean} - Result or fallback
 */
export function safeSome(data, fn, fallback = false) {
  if (!Array.isArray(data)) {
    console.warn('safeSome: Expected array, got', typeof data, data);
    return fallback;
  }
  try {
    return data.some(fn);
  } catch (error) {
    console.error('safeSome: Error during some check', error);
    return fallback;
  }
}

/**
 * Safe array every operation
 * @param {*} data - Potentially unsafe data
 * @param {Function} fn - Test function
 * @param {boolean} fallback - Value to return if data is not an array (default: true)
 * @returns {boolean} - Result or fallback
 */
export function safeEvery(data, fn, fallback = true) {
  if (!Array.isArray(data)) {
    console.warn('safeEvery: Expected array, got', typeof data, data);
    return fallback;
  }
  try {
    return data.every(fn);
  } catch (error) {
    console.error('safeEvery: Error during every check', error);
    return fallback;
  }
}

/**
 * Safe array spread operation
 * Safely convert potentially non-array data to array
 * @param {*} data - Potentially unsafe data
 * @param {*} fallback - Value to return if data is not an array (default: [])
 * @returns {Array} - Array or fallback
 */
export function safeSpread(data, fallback = []) {
  if (data === null || data === undefined) {
    return fallback;
  }
  if (Array.isArray(data)) {
    return [...data];
  }
  console.warn('safeSpread: Expected array, got', typeof data, data);
  return fallback;
}

/**
 * Safe array length check
 * @param {*} data - Potentially unsafe data
 * @param {number} fallback - Value to return if not array (default: 0)
 * @returns {number} - Array length or fallback
 */
export function safeLength(data, fallback = 0) {
  if (!Array.isArray(data)) {
    return fallback;
  }
  return data.length;
}

/**
 * Safe array access by index
 * @param {*} data - Potentially unsafe data
 * @param {number} index - Array index
 * @param {*} fallback - Value to return if not found (default: undefined)
 * @returns {*} - Item at index or fallback
 */
export function safeAt(data, index, fallback = undefined) {
  if (!Array.isArray(data) || index < 0 || index >= data.length) {
    return fallback;
  }
  return data[index] ?? fallback;
}

/**
 * Safe array sort operation
 * @param {*} data - Potentially unsafe data
 * @param {Function} compareFn - Compare function
 * @param {*} fallback - Value to return if data is not an array (default: [])
 * @returns {Array} - Sorted array or fallback (does not mutate original)
 */
export function safeSort(data, compareFn, fallback = []) {
  if (!Array.isArray(data)) {
    console.warn('safeSort: Expected array, got', typeof data, data);
    return fallback;
  }
  try {
    return [...data].sort(compareFn);
  } catch (error) {
    console.error('safeSort: Error during sorting', error);
    return fallback;
  }
}

/**
 * Safe array slice operation
 * @param {*} data - Potentially unsafe data
 * @param {number} start - Start index
 * @param {number} end - End index
 * @param {*} fallback - Value to return if data is not an array (default: [])
 * @returns {Array} - Sliced array or fallback
 */
export function safeSlice(data, start = 0, end = undefined, fallback = []) {
  if (!Array.isArray(data)) {
    console.warn('safeSlice: Expected array, got', typeof data, data);
    return fallback;
  }
  try {
    return data.slice(start, end);
  } catch (error) {
    console.error('safeSlice: Error during slicing', error);
    return fallback;
  }
}

/**
 * Safe array concat operation
 * @param {*} data - Potentially unsafe data
 * @param {...Array} items - Items to concatenate
 * @returns {Array} - Concatenated array
 */
export function safeConcat(data, ...items) {
  if (!Array.isArray(data)) {
    console.warn('safeConcat: Expected array, got', typeof data, data);
    return items.flat();
  }
  try {
    return data.concat(...items);
  } catch (error) {
    console.error('safeConcat: Error during concatenation', error);
    return data;
  }
}

/**
 * Safe array includes check
 * @param {*} data - Potentially unsafe data
 * @param {*} item - Item to check
 * @param {boolean} fallback - Value to return if not array (default: false)
 * @returns {boolean} - Whether array includes item
 */
export function safeIncludes(data, item, fallback = false) {
  if (!Array.isArray(data)) {
    return fallback;
  }
  try {
    return data.includes(item);
  } catch (error) {
    console.error('safeIncludes: Error during check', error);
    return fallback;
  }
}

/**
 * Safe array indexOf
 * @param {*} data - Potentially unsafe data
 * @param {*} item - Item to find
 * @param {number} fallback - Value to return if not found (default: -1)
 * @returns {number} - Index of item
 */
export function safeIndexOf(data, item, fallback = -1) {
  if (!Array.isArray(data)) {
    return fallback;
  }
  try {
    const index = data.indexOf(item);
    return index >= 0 ? index : fallback;
  } catch (error) {
    console.error('safeIndexOf: Error during search', error);
    return fallback;
  }
}

/**
 * Safe array forEach operation
 * @param {*} data - Potentially unsafe data
 * @param {Function} fn - Function to execute for each element
 * @returns {void}
 */
export function safeForEach(data, fn) {
  if (!Array.isArray(data)) {
    console.warn('safeForEach: Expected array, got', typeof data, data);
    return;
  }
  try {
    data.forEach(fn);
  } catch (error) {
    console.error('safeForEach: Error during forEach', error);
  }
}

/**
 * Ensure data is an array
 * @param {*} data - Potentially unsafe data
 * @param {*} fallback - Value to return if not array (default: [])
 * @returns {Array} - Array or fallback
 */
export function ensureArray(data, fallback = []) {
  if (Array.isArray(data)) {
    return data;
  }
  if (data === null || data === undefined) {
    return fallback;
  }
  console.warn('ensureArray: Expected array, got', typeof data, data);
  return fallback;
}

export default {
  safeMap,
  safeFilter,
  safeReduce,
  safeFind,
  safeSome,
  safeEvery,
  safeForEach,
  safeSpread,
  safeLength,
  safeAt,
  safeSort,
  safeSlice,
  safeConcat,
  safeIncludes,
  safeIndexOf,
  ensureArray,
};
