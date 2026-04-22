import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Hook for debounced input handling
 * Maintains local state and syncs with parent after delay
 *
 * @param {any} initialValue - Initial value from parent
 * @param {Function} onCommit - Callback to commit value to parent
 * @param {number} delay - Debounce delay in ms (default: 300)
 * @returns {[any, Function, Function]} - [localValue, handleChange, handleCommit]
 */
export function useDebouncedInput(initialValue, onCommit, delay = 300) {
  const [localValue, setLocalValue] = useState(initialValue);
  const timeoutRef = useRef(null);
  const commitCallbackRef = useRef(onCommit);

  // Update callback ref when onCommit changes
  useEffect(() => {
    commitCallbackRef.current = onCommit;
  }, [onCommit]);

  // Sync local value when external value changes (e.g., from parent state)
  useEffect(() => {
    setLocalValue(initialValue);
  }, [initialValue]);

  // Debounced commit to parent
  const handleChange = useCallback((newValue) => {
    // Update local state immediately for responsive UI
    setLocalValue(newValue);

    // Clear any pending timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Schedule commit to parent after delay
    timeoutRef.current = setTimeout(() => {
      commitCallbackRef.current(newValue);
    }, delay);
  }, [delay]);

  // Immediate commit (for blur events or manual save)
  const handleCommit = useCallback(() => {
    // Clear pending timeout to prevent double commit
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    // Commit current value immediately
    commitCallbackRef.current(localValue);
  }, [localValue]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return [localValue, handleChange, handleCommit];
}
