/**
 * OfflineBanner Component
 *
 * Persistent banner showing offline status and pending sync queue.
 *
 * Features:
 * - Slides down from top when offline
 * - Shows pending changes count
 * - Shows sync progress when online
 * - Success toast when all synced
 * - Minimal, non-intrusive design
 * - Auto-hides when online and queue empty
 */

import { useState, useEffect } from 'react';
import { WifiOff, Loader } from 'lucide-react';
import { useOfflineQueue } from '@/hooks/useOfflineQueue';
import { toast } from '@/components/ui/toast-provider';

export function OfflineBanner() {
  const { queue, queueLength, isOnline, isSyncing, syncNow } = useOfflineQueue();
  const [wasOffline, setWasOffline] = useState(false);
  const [previousQueueLength, setPreviousQueueLength] = useState(0);

  // Track when we go offline/online
  useEffect(() => {
    if (!isOnline) {
      setWasOffline(true);
    } else if (wasOffline && queueLength === 0 && !isSyncing) {
      // Just came back online and queue is empty - show toast only
      toast.success('✅ All changes synced!', {
        duration: 3000,
        position: 'top-center',
      });
      setWasOffline(false);
    }
  }, [isOnline, wasOffline, queueLength, isSyncing]);

  // Track queue length changes during sync
  useEffect(() => {
    if (isSyncing && queueLength < previousQueueLength) {
      // Items being synced
      setPreviousQueueLength(queueLength);
    } else if (!isSyncing && queueLength > 0) {
      setPreviousQueueLength(queueLength);
    }
  }, [queueLength, isSyncing]);

  // Show banner only if offline OR if there are queued items OR if syncing
  // Banner is completely hidden when online and everything is synced
  const shouldShow = !isOnline || queueLength > 0 || isSyncing;

  if (!shouldShow) {
    return null;
  }

  // Determine banner state (only offline or syncing - no 'online' state since banner is hidden when online)
  let bannerState = 'offline';

  if (isOnline && isSyncing) {
    bannerState = 'syncing';
  }

  return (
    <div
      className={`
        fixed top-0 left-0 right-0 z-50
        transform transition-transform duration-300 ease-in-out
        ${shouldShow ? 'translate-y-0' : '-translate-y-full'}
      `}
    >
      <div
        className={`
          px-4 py-3 shadow-lg backdrop-blur-lg
          ${
            bannerState === 'offline'
              ? 'bg-yellow-500/90 border-b-2 border-yellow-600'
              : 'bg-blue-500/90 border-b-2 border-blue-600'
          }
        `}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Left: Status Icon + Message */}
          <div className="flex items-center gap-3">
            {bannerState === 'offline' && (
              <>
                <WifiOff className="w-5 h-5 text-white flex-shrink-0" />
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-white font-medium">You're offline</span>
                  {queueLength > 0 && (
                    <span className="text-white/90 text-sm">
                      ({queueLength} {queueLength === 1 ? 'change' : 'changes'} pending)
                    </span>
                  )}
                </div>
              </>
            )}

            {bannerState === 'syncing' && (
              <>
                <Loader className="w-5 h-5 text-white animate-spin flex-shrink-0" />
                <div className="flex items-center gap-2">
                  <span className="text-white font-medium">Syncing changes...</span>
                  {queueLength > 0 && (
                    <span className="text-white/90 text-sm">
                      {previousQueueLength - queueLength}/{previousQueueLength} synced
                    </span>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2">
            {/* Manual Sync Button (only when offline with pending items) */}
            {bannerState === 'offline' && queueLength > 0 && (
              <button
                onClick={syncNow}
                disabled={isSyncing}
                className="px-3 py-1.5 bg-white/20 hover:bg-white/30 disabled:bg-white/10 text-white text-sm font-medium rounded-lg transition-colors disabled:cursor-not-allowed backdrop-blur-sm"
              >
                Retry Sync
              </button>
            )}

            {/* View Queue Button (when there are pending items) */}
            {queueLength > 0 && (
              <button
                onClick={() => {
                  // TODO: Open modal showing queue details
                  console.log('[OfflineBanner] View queue:', queue);
                  toast('Queue viewer coming soon!', { icon: '🔧' });
                }}
                className="px-3 py-1.5 bg-white/20 hover:bg-white/30 text-white text-sm font-medium rounded-lg transition-colors backdrop-blur-sm"
              >
                View Queue
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default OfflineBanner;
