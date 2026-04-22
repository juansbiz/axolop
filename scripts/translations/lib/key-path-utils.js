/**
 * Key Path Utilities for Translation Sync
 *
 * Provides functions to extract, manipulate, and manage nested JSON keys
 * Used for synchronizing translation files between languages
 */

/**
 * Recursively extracts all nested key paths from a JSON object
 * @param {Object} obj - The object to extract keys from
 * @param {string} prefix - Internal prefix for recursion (don't pass manually)
 * @param {WeakSet} visited - Tracks visited objects to prevent circular references
 * @returns {string[]} Array of dot-notation key paths
 * @example
 * extractAllKeys({ hero: { title: "Hi", subtitle: "World" } })
 * // Returns: ["hero.title", "hero.subtitle"]
 */
export function extractAllKeys(obj, prefix = '', visited = new WeakSet()) {
  // Prevent circular references
  if (visited.has(obj)) {
    console.warn(`Circular reference detected at ${prefix || 'root'}`);
    return [];
  }
  visited.add(obj);

  const keys = [];

  for (const key in obj) {
    if (!obj.hasOwnProperty(key)) continue;

    const fullKey = prefix ? `${prefix}.${key}` : key;
    const value = obj[key];

    // If value is an object (but not an array or null), recurse
    if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
      keys.push(...extractAllKeys(value, fullKey, visited));
    } else {
      // Leaf node (string, number, boolean, array, or null)
      keys.push(fullKey);
    }
  }

  return keys;
}

/**
 * Gets a value from an object using a dot-notation path
 * @param {Object} obj - The object to get the value from
 * @param {string} path - Dot-notation path (e.g., "hero.title.main")
 * @returns {*} The value at the path, or undefined if not found
 * @example
 * getValueByPath({ hero: { title: "Hi" } }, "hero.title") // Returns: "Hi"
 */
export function getValueByPath(obj, path) {
  const keys = path.split('.');
  let current = obj;

  for (const key of keys) {
    if (current === null || current === undefined) return undefined;
    current = current[key];
  }

  return current;
}

/**
 * Sets a value in an object using a dot-notation path
 * Creates intermediate objects as needed
 * @param {Object} obj - The object to set the value in (mutated in place)
 * @param {string} path - Dot-notation path (e.g., "hero.title.main")
 * @param {*} value - The value to set
 * @example
 * const obj = {};
 * setValueByPath(obj, "hero.title", "Hello");
 * // obj is now: { hero: { title: "Hello" } }
 */
export function setValueByPath(obj, path, value) {
  const keys = path.split('.');
  const lastKey = keys.pop();
  let current = obj;

  // Create intermediate objects
  for (const key of keys) {
    if (!(key in current) || typeof current[key] !== 'object' || current[key] === null) {
      current[key] = {};
    }
    current = current[key];
  }

  // Set the value
  current[lastKey] = value;
}

/**
 * Deletes a key from an object using a dot-notation path
 * Cleans up empty parent objects after deletion
 * @param {Object} obj - The object to delete from (mutated in place)
 * @param {string} path - Dot-notation path (e.g., "hero.title.main")
 * @returns {boolean} True if key was deleted, false if not found
 * @example
 * const obj = { hero: { title: "Hi", subtitle: "World" } };
 * deleteKeyByPath(obj, "hero.title");
 * // obj is now: { hero: { subtitle: "World" } }
 */
export function deleteKeyByPath(obj, path) {
  const keys = path.split('.');
  const lastKey = keys.pop();

  // Navigate to the parent object
  let current = obj;
  const parents = [{ obj: current, key: null }];

  for (const key of keys) {
    if (!(key in current)) return false; // Path doesn't exist
    current = current[key];
    parents.push({ obj: current, key });
  }

  // Delete the key
  if (!(lastKey in current)) return false;
  delete current[lastKey];

  // Clean up empty parent objects (bottom-up)
  for (let i = parents.length - 1; i > 0; i--) {
    const { obj: parentObj } = parents[i - 1];
    const { key } = parents[i];
    const childObj = parents[i].obj;

    // If child object is now empty, delete it from parent
    if (Object.keys(childObj).length === 0) {
      delete parentObj[key];
    } else {
      break; // Stop if we encounter a non-empty object
    }
  }

  return true;
}

/**
 * Compares two sets of keys and finds orphans and missing
 * @param {string[]} sourceKeys - Keys from the source (e.g., English)
 * @param {string[]} targetKeys - Keys from the target (e.g., Spanish)
 * @returns {Object} Object with orphanKeys and missingKeys arrays
 * @example
 * const result = compareKeys(["a", "b"], ["b", "c"]);
 * // Returns: { orphanKeys: ["c"], missingKeys: ["a"] }
 */
export function compareKeys(sourceKeys, targetKeys) {
  const sourceSet = new Set(sourceKeys);
  const targetSet = new Set(targetKeys);

  const orphanKeys = targetKeys.filter(key => !sourceSet.has(key));
  const missingKeys = sourceKeys.filter(key => !targetSet.has(key));

  return { orphanKeys, missingKeys };
}

/**
 * Validates that a key path is valid (no empty segments, special chars)
 * @param {string} path - The key path to validate
 * @returns {boolean} True if valid, false otherwise
 */
export function isValidKeyPath(path) {
  if (typeof path !== 'string' || path.length === 0) return false;
  if (path.startsWith('.') || path.endsWith('.')) return false;
  if (path.includes('..')) return false;
  return true;
}
