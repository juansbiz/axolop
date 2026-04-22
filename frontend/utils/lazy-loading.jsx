import React, { lazy, Suspense } from "react";

export const FullPageLoader = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
  </div>
);

export const ComponentLoader = () => (
  <div className="flex items-center justify-center p-4">
    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
  </div>
);

export const LazyDashboard = lazy(() => import("@/pages/Dashboard"));
export const LazySettings = lazy(() => import("@/pages/Settings"));
export const LazyEmails = lazy(() => import("@/pages/Emails"));
export const LazyProfile = lazy(() => import("@/pages/Profile"));

export const withSuspense = (Component, fallback) => (
  <Suspense fallback={fallback || <ComponentLoader />}>
    <Component />
  </Suspense>
);

export class LazyErrorBoundary extends React.Component {
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state?.hasError) {
      return (
        <div className="p-8 text-center">
          <p className="text-red-600">Something went wrong.</p>
          <button onClick={() => window.location.reload()} className="text-blue-600 underline">
            Refresh
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

// Lazy load functions for heavy libraries
export const lazyLoadRecharts = () => import("recharts");
export const lazyLoadGSAP = () => import("gsap");
export const lazyLoadFramerMotion = () => import("framer-motion");
export const lazyLoadFullCalendar = () => import("@fullcalendar/react");
