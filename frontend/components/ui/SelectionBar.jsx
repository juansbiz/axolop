/**
 * SelectionBar Component
 *
 * Floating bottom bar that appears when items are multi-selected.
 * Shows: "[5 selected] | Move | Email | Delete | x Clear"
 *
 * Uses framer-motion for slide-up animation.
 * Supports dark mode.
 */

import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, Mail, Trash2, Download, Tag } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function SelectionBar({
  count = 0,
  entityType = 'items',
  onMove,
  onEmail,
  onDelete,
  onExport,
  onTag,
  onClear,
}) {
  if (count === 0) return null;

  const entityLabel = count === 1 ? entityType : `${entityType}s`;

  return (
    <AnimatePresence>
      {count > 0 && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          className={cn(
            "fixed bottom-6 left-1/2 -translate-x-1/2 z-[9990]",
            "flex items-center gap-1 px-2 py-1.5",
            // Light mode
            "bg-white/95 backdrop-blur-xl",
            "border border-gray-200/60",
            "shadow-2xl shadow-gray-900/15",
            "rounded-full",
            // Dark mode
            "dark:bg-[#0f0f0f]/95 dark:backdrop-blur-2xl",
            "dark:border-[#101010]/30",
            "dark:shadow-[0_8px_40px_rgba(0,0,0,0.4)]"
          )}
        >
          {/* Selection count */}
          <div className={cn(
            "px-3 py-1.5 rounded-full text-sm font-semibold",
            "bg-yellow-500 text-yellow-500",
            "dark:bg-yellow-500/20 dark:text-yellow-500"
          )}>
            {count} {entityLabel}
          </div>

          {/* Divider */}
          <div className="w-px h-6 bg-gray-200 dark:bg-gray-700 mx-1" />

          {/* Action buttons */}
          {onMove && (
            <button
              onClick={onMove}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium",
                "text-gray-700 hover:bg-gray-100",
                "dark:text-gray-300 dark:hover:bg-gray-800",
                "transition-colors"
              )}
            >
              <ArrowRight className="w-4 h-4" />
              <span className="hidden sm:inline">Move</span>
            </button>
          )}

          {onEmail && (
            <button
              onClick={onEmail}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium",
                "text-gray-700 hover:bg-gray-100",
                "dark:text-gray-300 dark:hover:bg-gray-800",
                "transition-colors"
              )}
            >
              <Mail className="w-4 h-4" />
              <span className="hidden sm:inline">Email</span>
            </button>
          )}

          {onTag && (
            <button
              onClick={onTag}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium",
                "text-gray-700 hover:bg-gray-100",
                "dark:text-gray-300 dark:hover:bg-gray-800",
                "transition-colors"
              )}
            >
              <Tag className="w-4 h-4" />
              <span className="hidden sm:inline">Tag</span>
            </button>
          )}

          {onExport && (
            <button
              onClick={onExport}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium",
                "text-gray-700 hover:bg-gray-100",
                "dark:text-gray-300 dark:hover:bg-gray-800",
                "transition-colors"
              )}
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Export</span>
            </button>
          )}

          {onDelete && (
            <button
              onClick={onDelete}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium",
                "text-red-600 hover:bg-red-50",
                "dark:text-red-400 dark:hover:bg-red-900/20",
                "transition-colors"
              )}
            >
              <Trash2 className="w-4 h-4" />
              <span className="hidden sm:inline">Delete</span>
            </button>
          )}

          {/* Divider */}
          <div className="w-px h-6 bg-gray-200 dark:bg-gray-700 mx-1" />

          {/* Clear button */}
          <button
            onClick={onClear}
            className={cn(
              "p-1.5 rounded-full",
              "text-gray-400 hover:text-gray-600 hover:bg-gray-100",
              "dark:text-gray-500 dark:hover:text-gray-300 dark:hover:bg-gray-800",
              "transition-colors"
            )}
            title="Clear selection"
          >
            <X className="w-4 h-4" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
