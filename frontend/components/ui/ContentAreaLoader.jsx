/**
 * ContentAreaLoader - Loading components that stay within content area
 *
 * CRITICAL: These components NEVER use min-h-screen or 100vh
 * They only fill available space within their container.
 *
 * This prevents the sidebar and header from flickering during:
 * - Auth loading
 * - Bootstrap loading
 * - Page transitions
 * - Context gate waiting
 */

import React from 'react';

/**
 * ContentAreaLoader - Branded loader for bootstrap/auth states
 * Shows Axolop logo with animated dots
 */
export const ContentAreaLoader = ({ message = 'Loading...' }) => {
  return (
    <div className="flex-1 flex items-center justify-center min-h-[400px] bg-white dark:bg-[#0a0a0a] transition-colors duration-200">
      <div className="text-center">
        {/* Axolop Logo */}
        <div className="w-12 h-12 mx-auto mb-3 relative">
          <div className="absolute inset-0 bg-gradient-to-br from-[#3F0D28] to-[#8B1538] rounded-lg animate-pulse"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <img
              src="/axolop-logo.webp"
              alt="Axolop CRM"
              className="w-8 h-8 object-contain"
            />
          </div>
        </div>

        {/* Loading Animation - Bouncing Dots */}
        <div className="flex space-x-1 justify-center mb-3">
          <div
            className="w-1.5 h-1.5 bg-[#3F0D28] rounded-full animate-bounce"
            style={{ animationDelay: '0ms' }}
          ></div>
          <div
            className="w-1.5 h-1.5 bg-[#3F0D28] rounded-full animate-bounce"
            style={{ animationDelay: '100ms' }}
          ></div>
          <div
            className="w-1.5 h-1.5 bg-[#3F0D28] rounded-full animate-bounce"
            style={{ animationDelay: '200ms' }}
          ></div>
        </div>

        <p className="text-sm text-gray-500 dark:text-gray-400">
          {message}
        </p>
      </div>
    </div>
  );
};

/**
 * ContentAreaSpinner - Simple spinner for page transitions
 * Minimal, fast-rendering loader
 */
export const ContentAreaSpinner = () => {
  return (
    <div className="flex-1 flex items-center justify-center min-h-[200px]">
      <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-200 dark:border-gray-700 border-t-[#3F0D28]" />
    </div>
  );
};

/**
 * ContentAreaSkeleton - Skeleton loader for content areas
 * Shows animated placeholders while content loads
 */
export const ContentAreaSkeleton = ({ rows = 3 }) => {
  return (
    <div className="flex-1 p-6 space-y-4 animate-pulse">
      {/* Header skeleton */}
      <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-lg w-1/3"></div>

      {/* Content rows skeleton */}
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="space-y-2">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
        </div>
      ))}
    </div>
  );
};

/**
 * ContentAreaError - Error state for content area
 * Shows error message with retry option
 */
export const ContentAreaError = ({ message, onRetry }) => {
  return (
    <div className="flex-1 flex items-center justify-center min-h-[400px]">
      <div className="text-center max-w-md px-4">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
          <svg
            className="w-8 h-8 text-red-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Something went wrong
        </h3>
        <p className="text-gray-500 dark:text-gray-400 mb-4">
          {message || 'An error occurred while loading this content.'}
        </p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="px-4 py-2 bg-[#3F0D28] text-white rounded-lg hover:bg-[#5a1a3d] transition-colors"
          >
            Try Again
          </button>
        )}
      </div>
    </div>
  );
};

export default ContentAreaLoader;
