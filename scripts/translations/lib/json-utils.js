/**
 * JSON Utilities for Translation Sync
 *
 * Provides functions to read, write, and manage JSON files
 * Preserves formatting and handles errors gracefully
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { dirname } from 'path';

/**
 * Reads a JSON file and returns the parsed object
 * @param {string} filePath - Path to the JSON file
 * @returns {Object} Parsed JSON object
 * @throws {Error} If file doesn't exist or JSON is invalid
 */
export function readJSON(filePath) {
  if (!existsSync(filePath)) {
    throw new Error(`File not found: ${filePath}`);
  }

  try {
    const content = readFileSync(filePath, 'utf8');
    return JSON.parse(content);
  } catch (error) {
    throw new Error(`Failed to parse JSON in ${filePath}: ${error.message}`);
  }
}

/**
 * Recursively sorts object keys alphabetically
 * Preserves arrays and non-object values as-is
 * @param {*} obj - Object to sort (or any value)
 * @returns {*} Object with sorted keys, or original value if not an object
 */
function sortObjectKeys(obj) {
  // Return primitives, null, undefined, and arrays as-is
  if (obj === null || obj === undefined || typeof obj !== 'object' || Array.isArray(obj)) {
    return obj;
  }

  // Sort object keys alphabetically
  const sorted = {};
  Object.keys(obj)
    .sort()
    .forEach(key => {
      sorted[key] = sortObjectKeys(obj[key]);
    });

  return sorted;
}

/**
 * Writes an object to a JSON file with proper formatting
 * Keys are automatically sorted alphabetically for cleaner git diffs
 * @param {string} filePath - Path to write the JSON file
 * @param {Object} data - Object to write as JSON
 * @param {number} indent - Number of spaces for indentation (default: 2)
 */
export function writeJSON(filePath, data, indent = 2) {
  try {
    // Ensure directory exists
    ensureDirectory(dirname(filePath));

    // Sort keys alphabetically for consistent git diffs
    const sortedData = sortObjectKeys(data);

    // Convert to JSON with indentation and trailing newline
    const jsonContent = JSON.stringify(sortedData, null, indent) + '\n';

    // Write to file
    writeFileSync(filePath, jsonContent, 'utf8');
  } catch (error) {
    throw new Error(`Failed to write JSON to ${filePath}: ${error.message}`);
  }
}

/**
 * Ensures a directory exists, creating it if necessary
 * @param {string} dirPath - Path to the directory
 */
export function ensureDirectory(dirPath) {
  if (!existsSync(dirPath)) {
    mkdirSync(dirPath, { recursive: true });
  }
}

/**
 * Checks if a file exists
 * @param {string} filePath - Path to check
 * @returns {boolean} True if file exists
 */
export function fileExists(filePath) {
  return existsSync(filePath);
}

/**
 * Safely reads a JSON file, returning a default value if it doesn't exist
 * @param {string} filePath - Path to the JSON file
 * @param {Object} defaultValue - Default value if file doesn't exist (default: {})
 * @returns {Object} Parsed JSON object or default value
 */
export function readJSONSafe(filePath, defaultValue = {}) {
  if (!existsSync(filePath)) {
    return defaultValue;
  }

  try {
    return readJSON(filePath);
  } catch (error) {
    console.warn(`Warning: Could not read ${filePath}, using default value`);
    return defaultValue;
  }
}
