import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * useDebounce Hook
 *
 * Purpose: Debounce value changes to prevent excessive API calls
 * Critical for search inputs to avoid calling API on every keystroke
 *
 * @param {any} value - Value to debounce
 * @param {number} delay - Delay in milliseconds (default: 500)
 * @returns {any} Debounced value
 *
 * @example
 * const [searchTerm, setSearchTerm] = useState('');
 * const debouncedSearchTerm = useDebounce(searchTerm, 500);
 *
 * useEffect(() => {
 *   if (debouncedSearchTerm) {
 *     api.get(`/search?q=${debouncedSearchTerm}`);
 *   }
 * }, [debouncedSearchTerm]);
 *
 * // Result: API only called 500ms after user stops typing
 */
export function useDebounce(value, delay = 500) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // Set timeout to update debounced value after delay
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cleanup: cancel timeout if value changes before delay expires
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

/**
 * useDebouncedCallback Hook
 *
 * Purpose: Debounce a callback function instead of a value
 * Useful when you want to debounce the actual API call, not just the value
 *
 * @param {Function} callback - Callback to debounce
 * @param {number} delay - Delay in milliseconds (default: 500)
 * @param {Array} deps - Dependencies for the callback
 * @returns {Function} Debounced callback
 *
 * @example
 * const debouncedSearch = useDebouncedCallback((term) => {
 *   api.get(`/search?q=${term}`);
 * }, 500);
 *
 * <input onChange={(e) => debouncedSearch(e.target.value)} />
 */
export function useDebouncedCallback(callback, delay = 500, deps = []) {
  const timeoutRef = useRef(null);

  const debouncedCallback = useCallback(
    (...args) => {
      // Clear existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Set new timeout
      timeoutRef.current = setTimeout(() => {
        callback(...args);
      }, delay);
    },
    [callback, delay, ...deps]
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return debouncedCallback;
}

/**
 * useThrottle Hook
 *
 * Purpose: Throttle value changes (different from debounce)
 * Throttle: Executes at most once per interval (good for scroll handlers)
 * Debounce: Executes after delay of inactivity (good for search)
 *
 * @param {any} value - Value to throttle
 * @param {number} interval - Interval in milliseconds (default: 500)
 * @returns {any} Throttled value
 *
 * @example
 * const [scrollPosition, setScrollPosition] = useState(0);
 * const throttledScroll = useThrottle(scrollPosition, 200);
 *
 * // Result: Updates at most once every 200ms, even if scrolling continuously
 */
export function useThrottle(value, interval = 500) {
  const [throttledValue, setThrottledValue] = useState(value);
  const lastExecuted = useRef(Date.now());

  useEffect(() => {
    const now = Date.now();
    const timeSinceLastExecution = now - lastExecuted.current;

    if (timeSinceLastExecution >= interval) {
      // Enough time has passed, update immediately
      setThrottledValue(value);
      lastExecuted.current = now;
    } else {
      // Not enough time, schedule update after remaining time
      const timer = setTimeout(() => {
        setThrottledValue(value);
        lastExecuted.current = Date.now();
      }, interval - timeSinceLastExecution);

      return () => clearTimeout(timer);
    }
  }, [value, interval]);

  return throttledValue;
}

/**
 * useThrottledCallback Hook
 *
 * Purpose: Throttle a callback function
 * Executes callback at most once per interval
 *
 * @param {Function} callback - Callback to throttle
 * @param {number} interval - Interval in milliseconds (default: 500)
 * @param {Array} deps - Dependencies for the callback
 * @returns {Function} Throttled callback
 *
 * @example
 * const throttledScroll = useThrottledCallback(() => {
 *   console.log('Scroll event', window.scrollY);
 * }, 200);
 *
 * window.addEventListener('scroll', throttledScroll);
 */
export function useThrottledCallback(callback, interval = 500, deps = []) {
  const lastExecuted = useRef(Date.now());
  const timeoutRef = useRef(null);

  const throttledCallback = useCallback(
    (...args) => {
      const now = Date.now();
      const timeSinceLastExecution = now - lastExecuted.current;

      if (timeSinceLastExecution >= interval) {
        // Execute immediately
        callback(...args);
        lastExecuted.current = now;
      } else {
        // Schedule for later
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = setTimeout(() => {
          callback(...args);
          lastExecuted.current = Date.now();
        }, interval - timeSinceLastExecution);
      }
    },
    [callback, interval, ...deps]
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return throttledCallback;
}

/**
 * useDebouncedState Hook
 *
 * Purpose: Provides both immediate and debounced state
 * Useful when you need instant UI feedback but delayed API calls
 *
 * @param {any} initialValue - Initial value
 * @param {number} delay - Delay in milliseconds (default: 500)
 * @returns {[any, any, Function]} [immediateValue, debouncedValue, setValue]
 *
 * @example
 * const [searchTerm, debouncedSearchTerm, setSearchTerm] = useDebouncedState('', 500);
 *
 * // searchTerm updates immediately (for input value)
 * // debouncedSearchTerm updates after 500ms delay (for API call)
 *
 * <input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
 *
 * useEffect(() => {
 *   if (debouncedSearchTerm) {
 *     api.get(`/search?q=${debouncedSearchTerm}`);
 *   }
 * }, [debouncedSearchTerm]);
 */
export function useDebouncedState(initialValue, delay = 500) {
  const [immediateValue, setImmediateValue] = useState(initialValue);
  const debouncedValue = useDebounce(immediateValue, delay);

  return [immediateValue, debouncedValue, setImmediateValue];
}

/**
 * useDebounceEffect Hook
 *
 * Purpose: useEffect that only runs after debounced dependencies change
 * Prevents effect from running on every keystroke
 *
 * @param {Function} effect - Effect callback
 * @param {Array} deps - Dependencies to debounce
 * @param {number} delay - Delay in milliseconds (default: 500)
 *
 * @example
 * const [searchTerm, setSearchTerm] = useState('');
 *
 * useDebounceEffect(() => {
 *   if (searchTerm) {
 *     api.get(`/search?q=${searchTerm}`);
 *   }
 * }, [searchTerm], 500);
 *
 * // Effect only runs 500ms after searchTerm stops changing
 */
export function useDebounceEffect(effect, deps, delay = 500) {
  const debouncedDeps = deps.map((dep) => useDebounce(dep, delay));

  useEffect(() => {
    effect();
     
  }, debouncedDeps);
}

export default useDebounce;
