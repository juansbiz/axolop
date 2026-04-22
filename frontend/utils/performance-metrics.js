/**
 * Performance Metrics Utility
 *
 * Provides tools to measure and track page load performance, including:
 * - Time to First Byte (TTFB)
 * - First Contentful Paint (FCP)
 * - DOM Content Loaded
 * - Load Complete
 * - Custom timing marks
 *
 * Use this to monitor the impact of performance optimizations,
 * especially for public pages where instant loading is critical.
 */

/**
 * Measure page load performance and log key metrics
 *
 * @param {string} pageName - Name of the page being measured (e.g., 'Landing', 'SignIn')
 * @returns {Object|null} Performance metrics object or null if not available
 *
 * @example
 * // In a page component's useEffect:
 * useEffect(() => {
 *   measurePageLoad('Landing');
 * }, []);
 */
export function measurePageLoad(pageName) {
  if (typeof window === 'undefined') return null;

  try {
    // Get navigation timing
    const navigationTiming = performance.getEntriesByType('navigation')[0];

    if (!navigationTiming) {
      console.warn('[Performance] Navigation timing not available');
      return null;
    }

    // Get paint timing
    const paintEntries = performance.getEntriesByType('paint');
    const firstPaint = paintEntries.find(entry => entry.name === 'first-paint');
    const firstContentfulPaint = paintEntries.find(entry => entry.name === 'first-contentful-paint');

    const metrics = {
      pageName,
      ttfb: Math.round(navigationTiming.responseStart - navigationTiming.requestStart),
      domContentLoaded: Math.round(navigationTiming.domContentLoadedEventEnd - navigationTiming.requestStart),
      loadComplete: Math.round(navigationTiming.loadEventEnd - navigationTiming.requestStart),
      firstPaint: firstPaint ? Math.round(firstPaint.startTime) : 0,
      firstContentfulPaint: firstContentfulPaint ? Math.round(firstContentfulPaint.startTime) : 0,
      domInteractive: Math.round(navigationTiming.domInteractive - navigationTiming.requestStart),
      timestamp: new Date().toISOString(),
    };

    // Log formatted metrics
    console.log(`[Performance] ${pageName} Metrics:`, {
      'TTFB': `${metrics.ttfb}ms`,
      'FCP': `${metrics.firstContentfulPaint}ms`,
      'DOM Content Loaded': `${metrics.domContentLoaded}ms`,
      'Load Complete': `${metrics.loadComplete}ms`,
    });

    // Send to analytics in production
    if (import.meta.env.PROD) {
      sendToAnalytics('page_load', metrics);
    }

    return metrics;
  } catch (error) {
    console.error('[Performance] Error measuring page load:', error);
    return null;
  }
}

/**
 * Create a custom performance mark
 *
 * @param {string} markName - Name of the performance mark
 *
 * @example
 * mark('context-initialization-start');
 * // ... some work
 * mark('context-initialization-end');
 * measure('context-initialization', 'context-initialization-start', 'context-initialization-end');
 */
export function mark(markName) {
  if (typeof window === 'undefined' || !performance.mark) return;

  try {
    performance.mark(markName);
  } catch (error) {
    console.warn('[Performance] Error creating mark:', error);
  }
}

/**
 * Measure time between two performance marks
 *
 * @param {string} measureName - Name of the measurement
 * @param {string} startMark - Name of the start mark
 * @param {string} endMark - Name of the end mark
 * @returns {number|null} Duration in milliseconds or null if measurement failed
 *
 * @example
 * mark('api-call-start');
 * // ... API call
 * mark('api-call-end');
 * const duration = measure('api-call-duration', 'api-call-start', 'api-call-end');
 * console.log(`API call took ${duration}ms`);
 */
export function measure(measureName, startMark, endMark) {
  if (typeof window === 'undefined' || !performance.measure) return null;

  try {
    performance.measure(measureName, startMark, endMark);
    const entries = performance.getEntriesByName(measureName);
    const latestEntry = entries[entries.length - 1];

    if (latestEntry) {
      const duration = Math.round(latestEntry.duration);
      console.log(`[Performance] ${measureName}: ${duration}ms`);

      // Send to analytics in production
      if (import.meta.env.PROD) {
        sendToAnalytics('performance_measure', {
          measureName,
          duration,
          timestamp: new Date().toISOString(),
        });
      }

      return duration;
    }

    return null;
  } catch (error) {
    console.warn('[Performance] Error measuring:', error);
    return null;
  }
}

/**
 * Get Core Web Vitals metrics
 *
 * Includes Largest Contentful Paint (LCP), First Input Delay (FID), and Cumulative Layout Shift (CLS)
 *
 * @returns {Promise<Object>} Promise that resolves with Core Web Vitals metrics
 *
 * @example
 * const vitals = await getCoreWebVitals();
 * console.log('LCP:', vitals.lcp, 'FID:', vitals.fid, 'CLS:', vitals.cls);
 */
export async function getCoreWebVitals() {
  if (typeof window === 'undefined') return {};

  return new Promise((resolve) => {
    const vitals = {};

    // Measure LCP (Largest Contentful Paint)
    try {
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        vitals.lcp = Math.round(lastEntry.startTime);
        console.log('[Performance] LCP:', vitals.lcp + 'ms');

        if (import.meta.env.PROD) {
          sendToAnalytics('core_web_vitals', { metric: 'lcp', value: vitals.lcp });
        }
      });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
    } catch (e) {
      console.warn('[Performance] LCP not supported');
    }

    // Measure FID (First Input Delay)
    try {
      const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          vitals.fid = Math.round(entry.processingStart - entry.startTime);
          console.log('[Performance] FID:', vitals.fid + 'ms');

          if (import.meta.env.PROD) {
            sendToAnalytics('core_web_vitals', { metric: 'fid', value: vitals.fid });
          }
        });
      });
      fidObserver.observe({ entryTypes: ['first-input'] });
    } catch (e) {
      console.warn('[Performance] FID not supported');
    }

    // Measure CLS (Cumulative Layout Shift)
    try {
      let clsValue = 0;
      const clsObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        }
        vitals.cls = Math.round(clsValue * 1000) / 1000; // Round to 3 decimal places
        console.log('[Performance] CLS:', vitals.cls);

        if (import.meta.env.PROD) {
          sendToAnalytics('core_web_vitals', { metric: 'cls', value: vitals.cls });
        }
      });
      clsObserver.observe({ entryTypes: ['layout-shift'] });
    } catch (e) {
      console.warn('[Performance] CLS not supported');
    }

    // Resolve after 3 seconds to give metrics time to be captured
    setTimeout(() => resolve(vitals), 3000);
  });
}

/**
 * Send performance metrics to analytics service
 *
 * @param {string} eventName - Name of the analytics event
 * @param {Object} data - Metrics data to send
 */
function sendToAnalytics(eventName, data) {
  // Send to PostHog if available
  if (typeof window !== 'undefined' && window.posthog) {
    try {
      window.posthog.capture(eventName, data);
    } catch (error) {
      console.warn('[Performance] Error sending to PostHog:', error);
    }
  }

  // Could also send to other analytics services here
  // e.g., Google Analytics, custom endpoint, etc.
}

/**
 * Clear all performance marks and measures
 *
 * Useful for cleanup or resetting measurements
 */
export function clearPerformanceData() {
  if (typeof window === 'undefined' || !performance.clearMarks) return;

  try {
    performance.clearMarks();
    performance.clearMeasures();
    console.log('[Performance] Cleared all marks and measures');
  } catch (error) {
    console.warn('[Performance] Error clearing performance data:', error);
  }
}

/**
 * Get all performance entries of a specific type
 *
 * @param {string} entryType - Type of entries to retrieve ('mark', 'measure', 'navigation', 'paint', etc.)
 * @returns {PerformanceEntry[]} Array of performance entries
 */
export function getPerformanceEntries(entryType) {
  if (typeof window === 'undefined' || !performance.getEntriesByType) return [];

  try {
    return performance.getEntriesByType(entryType);
  } catch (error) {
    console.warn('[Performance] Error getting performance entries:', error);
    return [];
  }
}

export default {
  measurePageLoad,
  mark,
  measure,
  getCoreWebVitals,
  clearPerformanceData,
  getPerformanceEntries,
};
