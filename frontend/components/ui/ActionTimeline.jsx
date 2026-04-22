/**
 * Action Timeline Panel
 *
 * A slide-in panel showing the last 20 context menu actions grouped by entity.
 * Each entry: icon + action label + entity name + relative timestamp + undo button.
 * Undone entries show with strikethrough.
 *
 * Opens with Cmd+Shift+Z or from "Action History" in universal menu items.
 */

import { motion, AnimatePresence } from 'framer-motion';
import { X, RotateCcw, Clock, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useContextMenuHistory } from '@/hooks/useContextMenuHistory';

function timeAgo(timestamp) {
  const diff = Math.floor((Date.now() - timestamp) / 1000);
  if (diff < 60) return 'Just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export default function ActionTimeline({ isOpen, onClose }) {
  const { history, undoAction, clearHistory, hasHistory } = useContextMenuHistory();

  // Show last 20 actions
  const recentActions = history.slice(0, 20);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9998] bg-black/20 dark:bg-black/40"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className={cn(
              "fixed top-0 right-0 bottom-0 z-[9999] w-[400px] max-w-[90vw]",
              "bg-white dark:bg-[#0f0f0f]",
              "border-l border-gray-200/60 dark:border-[#3F0D28]/20",
              "shadow-2xl dark:shadow-[0_0_60px_rgba(0,0,0,0.5)]",
              "flex flex-col"
            )}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200/60 dark:border-gray-800">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-[#5B1046] dark:text-purple-400" />
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Action History
                </h2>
              </div>
              <div className="flex items-center gap-2">
                {hasHistory && (
                  <button
                    onClick={clearHistory}
                    className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    title="Clear history"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:text-gray-300 dark:hover:bg-gray-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Action List */}
            <div className="flex-1 overflow-y-auto">
              {!hasHistory ? (
                <div className="flex flex-col items-center justify-center h-full text-center px-6">
                  <Clock className="w-12 h-12 text-gray-300 dark:text-gray-700 mb-3" />
                  <p className="text-gray-500 dark:text-gray-400 font-medium">No actions yet</p>
                  <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                    Right-click actions will appear here
                  </p>
                </div>
              ) : (
                <div className="p-4 space-y-1">
                  {recentActions.map((action, index) => {
                    const ActionIcon = action.icon;

                    return (
                      <motion.div
                        key={action.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.03 }}
                        className={cn(
                          "flex items-center gap-3 px-3 py-2.5 rounded-lg",
                          "hover:bg-gray-50 dark:hover:bg-gray-800/50",
                          "transition-colors group",
                          action.isUndone && "opacity-50"
                        )}
                      >
                        {/* Icon */}
                        <div className={cn(
                          "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0",
                          action.isUndone
                            ? "bg-gray-100 dark:bg-gray-800"
                            : "bg-purple-50 dark:bg-purple-900/20"
                        )}>
                          {ActionIcon ? (
                            <ActionIcon className={cn(
                              "w-4 h-4",
                              action.isUndone
                                ? "text-gray-400 dark:text-gray-600"
                                : "text-purple-600 dark:text-purple-400"
                            )} />
                          ) : (
                            <Clock className="w-4 h-4 text-gray-400" />
                          )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className={cn(
                            "text-sm font-medium text-gray-900 dark:text-gray-100",
                            action.isUndone && "line-through text-gray-400 dark:text-gray-600"
                          )}>
                            {action.actionLabel}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                            {action.entityName}
                          </div>
                        </div>

                        {/* Timestamp */}
                        <div className="text-[11px] text-gray-400 dark:text-gray-500 flex-shrink-0">
                          {timeAgo(action.timestamp)}
                        </div>

                        {/* Undo button */}
                        {action.undoFn && !action.isUndone && (
                          <button
                            onClick={() => undoAction(action.id)}
                            className={cn(
                              "p-1.5 rounded-md opacity-0 group-hover:opacity-100",
                              "text-gray-400 hover:text-[#5B1046] hover:bg-purple-50",
                              "dark:hover:text-purple-400 dark:hover:bg-purple-900/20",
                              "transition-all"
                            )}
                            title="Undo this action"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                          </button>
                        )}

                        {/* Undone indicator */}
                        {action.isUndone && (
                          <span className="text-[10px] font-medium text-gray-400 dark:text-gray-600 uppercase">
                            Undone
                          </span>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-3 border-t border-gray-200/60 dark:border-gray-800">
              <p className="text-xs text-gray-400 dark:text-gray-500 text-center">
                Press <kbd className="px-1.5 py-0.5 text-[10px] bg-gray-100 dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 font-mono">
                  {navigator.platform?.includes('Mac') ? '⌘' : 'Ctrl'}+Shift+Z
                </kbd> to toggle
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
