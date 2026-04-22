/**
 * DegradedModeBanner Component
 *
 * Shows when optional contexts fail to load, indicating reduced functionality.
 *
 * Features:
 * - Lists affected features/contexts
 * - "Retry Now" button to attempt reload
 * - "Contact Support" link
 * - Non-blocking (app still functional)
 * - Dismissible after showing error details
 */

import { useState } from 'react';
import { AlertTriangle, RefreshCw, X, HelpCircle } from 'lucide-react';

export function DegradedModeBanner({
  failedContexts = [],
  onRetry,
  onDismiss,
  supportUrl = 'mailto:support@axolop.com',
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);

  if (failedContexts.length === 0) {
    return null;
  }

  const handleRetry = async () => {
    setIsRetrying(true);

    if (onRetry) {
      await onRetry();
    }

    // Reset after delay
    setTimeout(() => {
      setIsRetrying(false);
    }, 2000);
  };

  const handleDismiss = () => {
    if (onDismiss) {
      onDismiss();
    }
  };

  // Get user-friendly feature names from context names
  const getFeatureName = (contextName) => {
    const featureMap = {
      business_context: 'Workspace & Agency Management',
      subdomain_context: 'Custom Subdomain',
      roles_context: 'Team Permissions & Roles',
      affiliate_popup_context: 'Affiliate Program',
    };

    return featureMap[contextName] || contextName;
  };

  return (
    <div className="bg-yellow-50 dark:bg-yellow-900/20 border-b-2 border-yellow-400 dark:border-yellow-600">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-start gap-3">
          {/* Icon */}
          <div className="flex-shrink-0 mt-0.5">
            <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-yellow-800 dark:text-yellow-200">
                  Limited Functionality
                </h3>
                <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                  Some features are temporarily unavailable. You can still use core features.
                </p>

                {/* Expandable Details */}
                {isExpanded && (
                  <div className="mt-3 space-y-2">
                    <p className="text-xs font-medium text-yellow-800 dark:text-yellow-200">
                      Affected Features:
                    </p>
                    <ul className="space-y-1">
                      {failedContexts.map((context) => (
                        <li
                          key={context.name}
                          className="text-xs text-yellow-700 dark:text-yellow-300 flex items-start gap-2"
                        >
                          <span className="text-yellow-500 mt-0.5">•</span>
                          <div>
                            <span className="font-medium">{getFeatureName(context.name)}</span>
                            {context.error && (
                              <span className="text-yellow-600 dark:text-yellow-400 ml-2">
                                ({context.error.message || 'Unknown error'})
                              </span>
                            )}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Toggle Details Button */}
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="text-xs text-yellow-700 dark:text-yellow-300 hover:text-yellow-900 dark:hover:text-yellow-100 font-medium mt-2 underline"
                >
                  {isExpanded ? 'Hide Details' : 'Show Details'}
                </button>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                {/* Retry Button */}
                {onRetry && (
                  <button
                    onClick={handleRetry}
                    disabled={isRetrying}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-yellow-600 hover:bg-yellow-700 disabled:bg-yellow-400 text-white text-sm font-medium rounded-lg transition-colors disabled:cursor-not-allowed"
                  >
                    <RefreshCw
                      className={`w-4 h-4 ${isRetrying ? 'animate-spin' : ''}`}
                    />
                    {isRetrying ? 'Retrying...' : 'Retry'}
                  </button>
                )}

                {/* Contact Support Button */}
                <a
                  href={supportUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-gray-700 border border-yellow-300 dark:border-yellow-700 hover:bg-yellow-50 dark:hover:bg-gray-600 text-yellow-800 dark:text-yellow-200 text-sm font-medium rounded-lg transition-colors"
                >
                  <HelpCircle className="w-4 h-4" />
                  Support
                </a>

                {/* Dismiss Button */}
                {onDismiss && (
                  <button
                    onClick={handleDismiss}
                    className="p-1.5 hover:bg-yellow-200 dark:hover:bg-yellow-800 rounded-lg transition-colors"
                    aria-label="Dismiss"
                  >
                    <X className="w-4 h-4 text-yellow-700 dark:text-yellow-300" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DegradedModeBanner;
