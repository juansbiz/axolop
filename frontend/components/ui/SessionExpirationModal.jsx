/**
 * SessionExpirationModal Component
 *
 * Critical warning modal for session expiration.
 *
 * Features:
 * - Cannot be dismissed (modal backdrop prevents clicking away)
 * - Live countdown timer
 * - "Extend Session" button (refreshes token)
 * - "Save & Sign Out" button (saves work, signs out gracefully)
 * - Auto-triggers at 30s remaining
 * - Prevents data loss
 */

import { useEffect, useState } from 'react';
import { Clock, AlertTriangle, RefreshCw, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function SessionExpirationModal({
  isOpen,
  timeRemaining,
  onExtendSession,
  onSignOut,
  isExtending = false,
}) {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(timeRemaining);

  // Update countdown from parent
  useEffect(() => {
    setCountdown(timeRemaining);
  }, [timeRemaining]);

  const handleExtend = async () => {
    if (onExtendSession) {
      await onExtendSession();
    }
  };

  const handleSaveAndSignOut = async () => {
    if (onSignOut) {
      await onSignOut();
    }
    navigate('/signin');
  };

  // Format countdown display
  const formatCountdown = (seconds) => {
    if (seconds === null || seconds === undefined) return '00:00';

    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Determine urgency level
  const isUrgent = countdown !== null && countdown <= 10;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      {/* Backdrop - cannot dismiss */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      {/* Modal */}
      <div className="relative z-10 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full mx-4 border-4 border-red-500 dark:border-red-600 animate-pulse-border">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-500 to-red-600 p-6 rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0">
              <div className="bg-white/20 backdrop-blur-lg rounded-full p-3">
                <AlertTriangle className="w-8 h-8 text-white animate-pulse" />
              </div>
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-white">Session Expiring</h2>
              <p className="text-red-100 text-sm mt-1">Action required to continue</p>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* Countdown Display */}
          <div className="bg-gray-100 dark:bg-gray-900 rounded-xl p-6 border-2 border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-center gap-3">
              <Clock
                className={`w-6 h-6 ${isUrgent ? 'text-red-500 animate-pulse' : 'text-gray-500'}`}
              />
              <div className="text-center">
                <div
                  className={`text-5xl font-mono font-bold ${
                    isUrgent
                      ? 'text-red-600 dark:text-red-400 animate-pulse'
                      : 'text-gray-900 dark:text-white'
                  }`}
                >
                  {formatCountdown(countdown)}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {countdown === 1 ? 'second' : 'seconds'} remaining
                </p>
              </div>
            </div>
          </div>

          {/* Message */}
          <div className="text-center">
            <p className="text-gray-700 dark:text-gray-300">
              Your session is about to expire. Extend your session to keep working or save your
              changes and sign out.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            {/* Extend Session Button */}
            <button
              onClick={handleExtend}
              disabled={isExtending}
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 text-white rounded-lg font-semibold text-lg transition-colors disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
            >
              <RefreshCw className={`w-5 h-5 ${isExtending ? 'animate-spin' : ''}`} />
              {isExtending ? 'Extending Session...' : 'Extend Session'}
            </button>

            {/* Save & Sign Out Button */}
            <button
              onClick={handleSaveAndSignOut}
              disabled={isExtending}
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400 text-white rounded-lg font-medium transition-colors disabled:cursor-not-allowed"
            >
              <LogOut className="w-5 h-5" />
              Save & Sign Out
            </button>
          </div>

          {/* Warning Text */}
          {isUrgent && (
            <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-lg p-4">
              <p className="text-sm text-red-800 dark:text-red-300 font-medium text-center">
                ⚠️ Your session will expire in {countdown} {countdown === 1 ? 'second' : 'seconds'}
                !
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Custom pulse border animation */}
      <style>{`
        @keyframes pulse-border {
          0%, 100% {
            border-color: rgb(239 68 68); /* red-500 */
          }
          50% {
            border-color: rgb(220 38 38); /* red-600 */
          }
        }

        .animate-pulse-border {
          animation: pulse-border 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

export default SessionExpirationModal;
