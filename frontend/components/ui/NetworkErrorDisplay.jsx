/**
 * NetworkErrorDisplay Component
 *
 * Beautiful error UI for network failures with retry functionality.
 *
 * Features:
 * - User-friendly error messages (mapped from technical errors)
 * - Retry countdown with manual override
 * - Save offline option (when available)
 * - Clear explanation and actionable next steps
 * - Auto-retry with exponential backoff
 */

import { useState, useEffect } from 'react';
import { AlertCircle, RefreshCw, Wifi, WifiOff, Save } from 'lucide-react';
import { getUserFriendlyMessage } from '@/lib/error-messages';

export function NetworkErrorDisplay({
  error,
  onRetry,
  onSaveOffline,
  autoRetry = true,
  retryCount = 0,
  maxRetries = 3,
  showSaveOffline = false,
  className = '',
}) {
  const [countdown, setCountdown] = useState(null);
  const [isRetrying, setIsRetrying] = useState(false);

  // Calculate retry delay based on exponential backoff
  const getRetryDelay = (attempt) => {
    const baseDelay = 1000; // 1 second
    const maxDelay = 8000; // 8 seconds max
    const delay = Math.min(baseDelay * Math.pow(2, attempt), maxDelay);
    return delay;
  };

  useEffect(() => {
    if (!autoRetry || retryCount >= maxRetries || !onRetry) {
      return;
    }

    const delay = getRetryDelay(retryCount);
    setCountdown(Math.ceil(delay / 1000));

    // Countdown timer
    const countdownInterval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownInterval);
          return null;
        }
        return prev - 1;
      });
    }, 1000);

    // Auto-retry after delay
    const retryTimeout = setTimeout(() => {
      handleRetry();
    }, delay);

    return () => {
      clearInterval(countdownInterval);
      clearTimeout(retryTimeout);
    };
  }, [retryCount, autoRetry, maxRetries]);

  const handleRetry = async () => {
    if (isRetrying || !onRetry) return;

    setIsRetrying(true);
    setCountdown(null);

    try {
      await onRetry();
    } catch (err) {
      console.error('[NetworkErrorDisplay] Retry failed:', err);
    } finally {
      setIsRetrying(false);
    }
  };

  const handleSaveOffline = () => {
    if (onSaveOffline) {
      onSaveOffline();
    }
  };

  // Get user-friendly error message
  const friendlyError = getUserFriendlyMessage(error, { context: 'network' });

  // Determine if this is a network connectivity error
  const isOfflineError =
    error?.message?.toLowerCase().includes('network') ||
    error?.message?.toLowerCase().includes('offline') ||
    error?.code === 'ERR_NETWORK' ||
    !navigator.onLine;

  const maxRetriesReached = retryCount >= maxRetries;

  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-xl border border-red-200 dark:border-red-800/30 p-6 ${className}`}
    >
      {/* Header */}
      <div className="flex items-start gap-4 mb-4">
        <div className="flex-shrink-0">
          {isOfflineError ? (
            <WifiOff className="w-8 h-8 text-red-500" />
          ) : (
            <AlertCircle className="w-8 h-8 text-red-500" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
            {friendlyError.title}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            {friendlyError.description}
          </p>

          {/* Technical details (dev mode only) */}
          {import.meta.env.DEV && error?.message && (
            <details className="mt-2">
              <summary className="text-xs text-gray-500 cursor-pointer hover:text-gray-700 dark:hover:text-gray-300">
                Technical details
              </summary>
              <pre className="mt-2 text-xs bg-gray-100 dark:bg-gray-900 p-2 rounded overflow-auto">
                {error.message}
              </pre>
            </details>
          )}
        </div>
      </div>

      {/* Retry Status */}
      {retryCount > 0 && !maxRetriesReached && (
        <div className="mb-4 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <p className="text-sm text-blue-700 dark:text-blue-300">
            Retry attempt {retryCount} of {maxRetries}
          </p>
        </div>
      )}

      {/* Max Retries Reached */}
      {maxRetriesReached && (
        <div className="mb-4 px-4 py-2 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
          <p className="text-sm text-yellow-700 dark:text-yellow-300">
            Maximum retry attempts reached. Please try again manually.
          </p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3">
        {/* Retry Button */}
        {onRetry && (
          <button
            onClick={handleRetry}
            disabled={isRetrying || (countdown !== null && countdown > 0)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 text-white rounded-lg font-medium transition-colors disabled:cursor-not-allowed"
          >
            <RefreshCw
              className={`w-4 h-4 ${isRetrying || countdown !== null ? 'animate-spin' : ''}`}
            />
            {isRetrying ? (
              'Retrying...'
            ) : countdown !== null ? (
              `Retrying in ${countdown}s...`
            ) : (
              'Retry Now'
            )}
          </button>
        )}

        {/* Save Offline Button */}
        {showSaveOffline && onSaveOffline && (
          <button
            onClick={handleSaveOffline}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors"
          >
            <Save className="w-4 h-4" />
            Save Offline
          </button>
        )}

        {/* Check Connection (only for offline errors) */}
        {isOfflineError && (
          <a
            href="https://www.google.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg font-medium transition-colors"
          >
            <Wifi className="w-4 h-4" />
            Check Connection
          </a>
        )}
      </div>

      {/* Suggestions */}
      {friendlyError.suggestions && friendlyError.suggestions.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            What you can try:
          </p>
          <ul className="space-y-1">
            {friendlyError.suggestions.map((suggestion, index) => (
              <li
                key={index}
                className="text-sm text-gray-600 dark:text-gray-400 flex items-start gap-2"
              >
                <span className="text-primary-500 mt-0.5">•</span>
                <span>{suggestion}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default NetworkErrorDisplay;
