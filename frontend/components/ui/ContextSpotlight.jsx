/**
 * Context Spotlight - Unified Command Interface
 *
 * Press "/" anywhere to open a context-aware command palette.
 * Merges global search with context menu actions.
 * If on Leads page, lead actions show first.
 * If hovering a contact card, that contact's actions appear.
 *
 * Features:
 * - "/" opens spotlight
 * - ">" prefix enters command mode (actions only)
 * - Tab switches between Actions and Search
 * - Keyboard navigation (arrows, enter, escape)
 * - Dark mode support
 */

import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Command, Zap, ArrowRight, CornerDownLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useContextSpotlight } from '@/hooks/useContextSpotlight';

const PAGE_LABELS = {
  lead: 'Leads',
  contact: 'Contacts',
  deal: 'Deals',
  task: 'Tasks',
  form: 'Forms',
  workflow: 'Workflows',
  event: 'Calendar',
  message: 'Inbox',
  campaign: 'Campaigns',
};

export default function ContextSpotlight() {
  const {
    isOpen,
    close,
    query,
    setQuery,
    searchQuery,
    isCommandMode,
    activeSection,
    switchSection,
    pageEntityType,
    hoveredEntity,
    inputRef,
  } = useContextSpotlight();

  const listRef = useRef(null);
  const selectedIndexRef = useRef(0);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      selectedIndexRef.current = 0;
    }
  }, [isOpen, inputRef]);

  // Handle keyboard navigation within spotlight
  const handleKeyDown = (e) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      switchSection();
    }

    if (e.key === 'Escape') {
      close();
    }

    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      const items = listRef.current?.querySelectorAll('[data-spotlight-item]');
      if (!items?.length) return;

      if (e.key === 'ArrowDown') {
        selectedIndexRef.current = Math.min(selectedIndexRef.current + 1, items.length - 1);
      } else {
        selectedIndexRef.current = Math.max(selectedIndexRef.current - 1, 0);
      }

      items.forEach((item, i) => {
        item.classList.toggle('bg-purple-50', i === selectedIndexRef.current);
        item.classList.toggle('dark:bg-purple-900/20', i === selectedIndexRef.current);
      });
      items[selectedIndexRef.current]?.scrollIntoView({ block: 'nearest' });
    }

    if (e.key === 'Enter') {
      const items = listRef.current?.querySelectorAll('[data-spotlight-item]');
      items?.[selectedIndexRef.current]?.click();
    }
  };

  const contextLabel = hoveredEntity?.type
    ? PAGE_LABELS[hoveredEntity.type] || hoveredEntity.type
    : pageEntityType
      ? PAGE_LABELS[pageEntityType] || pageEntityType
      : null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[10000] bg-black/30 dark:bg-black/50 backdrop-blur-sm"
            onClick={close}
          />

          {/* Spotlight Panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className={cn(
              "fixed z-[10001] top-[20%] left-1/2 -translate-x-1/2",
              "w-[560px] max-w-[90vw]",
              // Light mode
              "bg-white/98 backdrop-blur-xl",
              "border border-gray-200/60",
              "shadow-2xl shadow-gray-900/20",
              "rounded-xl overflow-hidden",
              // Dark mode
              "dark:bg-[#0f0f0f]/98 dark:backdrop-blur-2xl",
              "dark:border-[#3F0D28]/30",
              "dark:shadow-[0_20px_60px_rgba(0,0,0,0.5)]"
            )}
          >
            {/* Search Input */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-200/60 dark:border-gray-800">
              {isCommandMode ? (
                <Command className="w-5 h-5 text-purple-500 dark:text-purple-400 flex-shrink-0" />
              ) : (
                <Search className="w-5 h-5 text-gray-400 dark:text-gray-500 flex-shrink-0" />
              )}
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={isCommandMode ? 'Type a command...' : 'Search actions or type > for commands...'}
                className={cn(
                  "flex-1 bg-transparent text-base",
                  "text-gray-900 dark:text-gray-100",
                  "placeholder:text-gray-400 dark:placeholder:text-gray-500",
                  "focus:outline-none"
                )}
              />
              <kbd className="hidden sm:inline-flex px-2 py-0.5 text-[10px] font-mono text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700">
                ESC
              </kbd>
            </div>

            {/* Context Badge */}
            {contextLabel && (
              <div className="px-4 py-2 bg-purple-50/50 dark:bg-purple-900/10 border-b border-gray-200/60 dark:border-gray-800">
                <div className="flex items-center gap-2 text-xs">
                  <Zap className="w-3 h-3 text-purple-500 dark:text-purple-400" />
                  <span className="text-purple-600 dark:text-purple-400 font-medium">
                    Context: {contextLabel}
                  </span>
                  {hoveredEntity?.data?.name && (
                    <span className="text-purple-400 dark:text-purple-500">
                      - {hoveredEntity.data.name || hoveredEntity.data.title}
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Section Tabs */}
            <div className="flex border-b border-gray-200/60 dark:border-gray-800">
              <button
                onClick={() => switchSection()}
                className={cn(
                  "flex-1 px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-colors",
                  activeSection === 'actions'
                    ? "text-purple-600 dark:text-purple-400 border-b-2 border-purple-500 dark:border-purple-400"
                    : "text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-400"
                )}
              >
                Actions
              </button>
              <button
                onClick={() => switchSection()}
                className={cn(
                  "flex-1 px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-colors",
                  activeSection === 'search'
                    ? "text-purple-600 dark:text-purple-400 border-b-2 border-purple-500 dark:border-purple-400"
                    : "text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-400"
                )}
              >
                Search
              </button>
            </div>

            {/* Results */}
            <div ref={listRef} className="max-h-[300px] overflow-y-auto py-2">
              {activeSection === 'actions' ? (
                <div className="px-2">
                  {/* Placeholder actions - these would be populated from config files */}
                  <div className="px-3 py-6 text-center">
                    <Command className="w-8 h-8 mx-auto text-gray-300 dark:text-gray-600 mb-2" />
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {searchQuery ? `No actions matching "${searchQuery}"` : 'Type to search actions'}
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                      Use <kbd className="px-1 py-0.5 text-[10px] bg-gray-100 dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 font-mono">&gt;</kbd> for command mode
                    </p>
                  </div>
                </div>
              ) : (
                <div className="px-2">
                  <div className="px-3 py-6 text-center">
                    <Search className="w-8 h-8 mx-auto text-gray-300 dark:text-gray-600 mb-2" />
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {searchQuery ? `Searching for "${searchQuery}"...` : 'Type to search across your CRM'}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between px-4 py-2 border-t border-gray-200/60 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50">
              <div className="flex items-center gap-3 text-[11px] text-gray-400 dark:text-gray-500">
                <span className="flex items-center gap-1">
                  <kbd className="px-1 py-0.5 bg-gray-100 dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 font-mono text-[10px]">Tab</kbd>
                  Switch
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="px-1 py-0.5 bg-gray-100 dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 font-mono text-[10px]">
                    <ArrowRight className="w-2.5 h-2.5 inline" />
                  </kbd>
                  Navigate
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="px-1 py-0.5 bg-gray-100 dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 font-mono text-[10px]">
                    <CornerDownLeft className="w-2.5 h-2.5 inline" />
                  </kbd>
                  Execute
                </span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
