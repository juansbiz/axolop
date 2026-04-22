import { lazy, Suspense } from 'react';
import { LazyErrorBoundary } from '@/utils/lazy-loading';

/**
 * Invisible loading fallback for public pages
 *
 * Public pages should feel like a normal website - no spinners, just instant loading.
 * While React lazy-loads the component chunk (typically 100-500ms), we show nothing
 * instead of a spinner. This creates a better UX - the page appears smoothly when ready
 * instead of showing an "app-like" loading state.
 *
 * On modern connections, the delay is imperceptible. On slower connections, users see
 * a brief blank transition which is preferable to showing a spinner for public content.
 */
const PublicPageFallback = () => null;

/**
 * Public route wrapper - NO context gates, instant loading
 *
 * Use this for public pages (landing, pricing, features, signin, signup, etc.)
 * that don't require authentication or context initialization.
 *
 * Benefits over withContextGate:
 * - No 10-second timeout delays
 * - No context readiness checks
 * - No full-screen loading spinners
 * - Instant page load for better UX
 *
 * Includes LazyErrorBoundary to catch chunk load errors and network failures,
 * showing a friendly retry UI instead of a blank screen.
 *
 * @param {Function} importFn - Dynamic import function (e.g., () => import('@/pages/Landing'))
 * @returns {React.Component} Wrapped component with error boundary and minimal loading fallback
 *
 * @example
 * // In App.jsx or routes file:
 * const Landing = withPublicRoute(() => import("@/pages/Landing"));
 * const Pricing = withPublicRoute(() => import("@/pages/public/Pricing"));
 * const SignIn = withPublicRoute(() => import("@/pages/SignIn"));
 */
export function withPublicRoute(importFn) {
  const Component = lazy(importFn);

  return function PublicRouteWrapper(props) {
    return (
      <LazyErrorBoundary>
        <Suspense fallback={<PublicPageFallback />}>
          <Component {...props} />
        </Suspense>
      </LazyErrorBoundary>
    );
  };
}

export default withPublicRoute;
