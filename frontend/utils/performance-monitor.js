/**
 * Performance Monitor
 *
 * Tracks app initialization time, context loading times, and other performance metrics.
 * Integrates with PostHog for analytics.
 */

class PerformanceMonitor {
  constructor() {
    this.metrics = {
      appInitStart: null,
      appInitEnd: null,
      contextTimings: {},
      pageLoadTimings: {},
      errorCounts: {},
    };

    this.startAppInit();
  }

  startAppInit() {
    this.metrics.appInitStart = performance.now();

    // Mark navigation start for reference
    if (performance.navigation) {
      this.metrics.navigationStart = performance.timing?.navigationStart;
    }
  }

  endAppInit() {
    if (!this.metrics.appInitStart) return;

    this.metrics.appInitEnd = performance.now();
    const duration = this.metrics.appInitEnd - this.metrics.appInitStart;

    console.log(`[Performance] App initialization: ${duration.toFixed(2)}ms`);

    // Send to PostHog
    if (window.posthog) {
      window.posthog.capture('app_init_complete', {
        duration_ms: duration,
        contexts_loaded: Object.keys(this.metrics.contextTimings).length,
      });
    }

    return duration;
  }

  trackContextInit(contextName, startTime) {
    if (!this.metrics.contextTimings[contextName]) {
      this.metrics.contextTimings[contextName] = {
        start: startTime || performance.now(),
        end: null,
        duration: null,
      };
    }
  }

  trackContextReady(contextName) {
    const timing = this.metrics.contextTimings[contextName];
    if (!timing || timing.end) return;

    timing.end = performance.now();
    timing.duration = timing.end - timing.start;

    console.log(`[Performance] ${contextName} ready in ${timing.duration.toFixed(2)}ms`);

    // Send to PostHog
    if (window.posthog) {
      window.posthog.capture('context_init_time', {
        context: contextName,
        duration_ms: timing.duration,
      });
    }

    return timing.duration;
  }

  trackPageLoad(pageName) {
    const now = performance.now();

    if (!this.metrics.pageLoadTimings[pageName]) {
      this.metrics.pageLoadTimings[pageName] = {
        start: now,
        end: null,
        duration: null,
      };
    }

    return now;
  }

  trackPageReady(pageName) {
    const timing = this.metrics.pageLoadTimings[pageName];
    if (!timing || timing.end) return;

    timing.end = performance.now();
    timing.duration = timing.end - timing.start;

    console.log(`[Performance] ${pageName} loaded in ${timing.duration.toFixed(2)}ms`);

    // Send to PostHog
    if (window.posthog) {
      window.posthog.capture('page_load_time', {
        page: pageName,
        duration_ms: timing.duration,
      });
    }

    return timing.duration;
  }

  trackError(errorType, errorMessage, context = {}) {
    if (!this.metrics.errorCounts[errorType]) {
      this.metrics.errorCounts[errorType] = 0;
    }
    this.metrics.errorCounts[errorType]++;

    console.error(`[Performance] Error tracked: ${errorType}`, errorMessage);

    // Send to PostHog
    if (window.posthog) {
      window.posthog.capture('error_occurred', {
        error_type: errorType,
        error_message: errorMessage,
        error_count: this.metrics.errorCounts[errorType],
        ...context,
      });
    }

    // Send to Sentry if available
    if (window.Sentry && context.error) {
      window.Sentry.captureException(context.error, {
        tags: {
          error_type: errorType,
        },
        extra: context,
      });
    }
  }

  trackRetry(retryType, retryCount, success) {
    console.log(`[Performance] Retry ${retryType}: attempt ${retryCount}, ${success ? 'succeeded' : 'failed'}`);

    if (window.posthog) {
      window.posthog.capture('retry_attempt', {
        retry_type: retryType,
        retry_count: retryCount,
        success: success,
      });
    }
  }

  getMetrics() {
    return {
      ...this.metrics,
      totalInitTime: this.metrics.appInitEnd
        ? this.metrics.appInitEnd - this.metrics.appInitStart
        : null,
    };
  }

  getContextMetrics() {
    return this.metrics.contextTimings;
  }

  getErrorCounts() {
    return this.metrics.errorCounts;
  }

  // Web Vitals monitoring
  trackWebVitals() {
    // First Contentful Paint (FCP)
    if (window.PerformanceObserver) {
      try {
        const fcpObserver = new PerformanceObserver((entryList) => {
          for (const entry of entryList.getEntries()) {
            if (entry.name === 'first-contentful-paint') {
              console.log(`[Performance] FCP: ${entry.startTime.toFixed(2)}ms`);

              if (window.posthog) {
                window.posthog.capture('web_vital_fcp', {
                  value: entry.startTime,
                });
              }
            }
          }
        });

        fcpObserver.observe({ entryTypes: ['paint'] });
      } catch (e) {
        console.warn('[Performance] FCP observer not supported');
      }

      // Largest Contentful Paint (LCP)
      try {
        const lcpObserver = new PerformanceObserver((entryList) => {
          const entries = entryList.getEntries();
          const lastEntry = entries[entries.length - 1];

          console.log(`[Performance] LCP: ${lastEntry.startTime.toFixed(2)}ms`);

          if (window.posthog) {
            window.posthog.capture('web_vital_lcp', {
              value: lastEntry.startTime,
            });
          }
        });

        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
      } catch (e) {
        console.warn('[Performance] LCP observer not supported');
      }

      // Cumulative Layout Shift (CLS)
      try {
        let clsValue = 0;
        const clsObserver = new PerformanceObserver((entryList) => {
          for (const entry of entryList.getEntries()) {
            if (!entry.hadRecentInput) {
              clsValue += entry.value;
            }
          }

          console.log(`[Performance] CLS: ${clsValue.toFixed(4)}`);

          if (window.posthog) {
            window.posthog.capture('web_vital_cls', {
              value: clsValue,
            });
          }
        });

        clsObserver.observe({ entryTypes: ['layout-shift'] });
      } catch (e) {
        console.warn('[Performance] CLS observer not supported');
      }
    }
  }
}

// Create singleton instance
const performanceMonitor = new PerformanceMonitor();

// Start tracking Web Vitals
if (typeof window !== 'undefined') {
  performanceMonitor.trackWebVitals();
}

export default performanceMonitor;

// Convenient exports
export const {
  endAppInit,
  trackContextInit,
  trackContextReady,
  trackPageLoad,
  trackPageReady,
  trackError,
  trackRetry,
  getMetrics,
  getContextMetrics,
  getErrorCounts,
} = performanceMonitor;
