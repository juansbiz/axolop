/**
 * Context Menu Sub-Menu Component
 *
 * Nested menu support with intelligent positioning (right by default, left if no space).
 * Supports keyboard navigation, hover delays, 3 levels of nesting, dark mode, and accessibility.
 */

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { MENU_ANIMATION } from './ContextMenuConstants';

export function ContextMenuSubMenu({
  item,
  position,
  onClose,
  level = 1,
  maxLevel = 3,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [submenuPosition, setSubmenuPosition] = useState({ x: 0, y: 0 });
  const [alignLeft, setAlignLeft] = useState(false);
  const submenuRef = useRef(null);
  const triggerRef = useRef(null);
  const hoverTimeoutRef = useRef(null);

  // Calculate submenu position
  const calculatePosition = useCallback(() => {
    if (!triggerRef.current || !submenuRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const submenuRect = submenuRef.current.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // Default: Open to the right
    let x = triggerRect.right + 4;
    let y = triggerRect.top;

    // Check if submenu goes off-screen to the right
    if (x + submenuRect.width > viewportWidth - 8) {
      x = triggerRect.left - submenuRect.width - 4;
      setAlignLeft(true);
    } else {
      setAlignLeft(false);
    }

    // Adjust vertical position if needed
    if (y + submenuRect.height > viewportHeight - 8) {
      y = viewportHeight - submenuRect.height - 8;
    }
    if (y < 8) {
      y = 8;
    }

    setSubmenuPosition({ x, y });
  }, []);

  // Hover to open (200ms delay)
  const handleMouseEnter = useCallback(() => {
    hoverTimeoutRef.current = setTimeout(() => {
      setIsOpen(true);
    }, 200);
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    setIsOpen(false);
  }, []);

  // Keyboard navigation
  const handleKeyDown = useCallback((event) => {
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      setIsOpen(true);
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      setIsOpen(false);
    }
  }, []);

  // Calculate position when opened
  useEffect(() => {
    if (isOpen) {
      calculatePosition();
    }
  }, [isOpen, calculatePosition]);

  // Cleanup timeout
  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

  const Icon = item.icon;
  const hasSubmenu = item.submenuItems && item.submenuItems.length > 0;

  // Prevent infinite nesting
  if (level >= maxLevel) {
    console.warn(`Max submenu level (${maxLevel}) reached`);
    return null;
  }

  return (
    <div
      ref={triggerRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="relative"
    >
      {/* Submenu Trigger */}
      <button
        role="menuitem"
        aria-haspopup="true"
        aria-expanded={isOpen}
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        onKeyDown={handleKeyDown}
        className={cn(
          "w-full px-3 py-2 text-left text-sm font-medium",
          "flex items-center gap-3 transition-all duration-150",
          "text-gray-700 hover:bg-gray-50/80 hover:text-gray-900",
          "dark:text-gray-200 dark:hover:bg-[#101010]/15 dark:hover:text-white",
          "focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-inset",
          "active:scale-[0.98]"
        )}
      >
        {Icon && <Icon className="h-4 w-4 flex-shrink-0" />}
        <span className="flex-1 truncate">{item.label}</span>
        {item.badge && (
          <span className={cn(
            "px-2 py-0.5 text-xs font-medium rounded-full",
            item.badgeVariant === 'success' && "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
            item.badgeVariant === 'warning' && "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
            item.badgeVariant === 'error' && "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
            item.badgeVariant === 'info' && "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
            !item.badgeVariant && "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
          )}>
            {item.badge}
          </span>
        )}
        <ChevronRight className="h-4 w-4 text-gray-400 dark:text-gray-500" />
      </button>

      {/* Submenu Content */}
      <AnimatePresence>
        {isOpen && hasSubmenu && (
          <motion.div
            ref={submenuRef}
            role="menu"
            aria-label={`${item.label} submenu`}
            initial={MENU_ANIMATION.initial}
            animate={MENU_ANIMATION.animate}
            exit={MENU_ANIMATION.exit}
            transition={MENU_ANIMATION.transition}
            className={cn(
              "fixed z-[10000]",
              "min-w-[220px] max-w-[320px]",
              // Light mode
              "bg-white/95 backdrop-blur-xl",
              "border border-gray-200/60",
              "rounded-lg overflow-hidden",
              "shadow-2xl shadow-gray-900/10",
              // Dark mode
              "dark:bg-[#0a0a0a]/92 dark:backdrop-blur-2xl",
              "dark:border-[#101010]/30",
              "dark:shadow-[0_10px_40px_rgba(0,0,0,0.4),0_0_40px_rgba(63,13,40,0.15)]"
            )}
            style={{
              left: submenuPosition.x,
              top: submenuPosition.y,
            }}
          >
            <div className="py-1">
              {item.submenuItems.map((subItem, index) => {
                // Divider
                if (subItem.type === 'divider') {
                  return (
                    <div
                      key={`divider-${index}`}
                      role="separator"
                      className="my-1 h-px bg-gray-200/60 dark:bg-gray-700/30 mx-2"
                    />
                  );
                }

                // Header
                if (subItem.type === 'header') {
                  return (
                    <div
                      key={`header-${index}`}
                      role="presentation"
                      className="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                    >
                      {subItem.label}
                    </div>
                  );
                }

                // Nested submenu
                if (subItem.type === 'submenu' && subItem.submenuItems) {
                  return (
                    <ContextMenuSubMenu
                      key={subItem.key || index}
                      item={subItem}
                      position={submenuPosition}
                      onClose={onClose}
                      level={level + 1}
                      maxLevel={maxLevel}
                    />
                  );
                }

                // Regular menu item
                const SubIcon = subItem.icon;
                const isDisabled = subItem.disabled;
                const isDestructive = subItem.variant === 'destructive';

                return (
                  <button
                    key={subItem.key || index}
                    role="menuitem"
                    onClick={(e) => {
                      e.stopPropagation();
                      subItem.action?.(subItem);
                      onClose?.();
                    }}
                    disabled={isDisabled}
                    aria-disabled={isDisabled || undefined}
                    className={cn(
                      "w-full px-3 py-2 text-left text-sm font-medium",
                      "flex items-center gap-3 transition-all duration-150",
                      "focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-inset",
                      "text-gray-700 hover:bg-gray-50/80 hover:text-gray-900",
                      "dark:text-gray-200 dark:hover:bg-[#101010]/15 dark:hover:text-white",
                      isDisabled && "text-gray-400 dark:text-gray-600 cursor-not-allowed opacity-50",
                      isDestructive && !isDisabled && "text-red-600 hover:bg-red-50/80 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-900/20 dark:hover:text-red-300",
                      "active:scale-[0.98]"
                    )}
                  >
                    {SubIcon && (
                      <SubIcon className={cn(
                        "h-4 w-4 flex-shrink-0",
                        isDisabled && "text-gray-400 dark:text-gray-600",
                        isDestructive && !isDisabled && "text-red-500 dark:text-red-400"
                      )} />
                    )}
                    <span className="flex-1 truncate">{subItem.label}</span>
                    {subItem.shortcut && (
                      <span className="text-xs text-gray-400 dark:text-gray-500 font-mono">
                        {subItem.shortcut}
                      </span>
                    )}
                    {subItem.badge && (
                      <span className={cn(
                        "px-2 py-0.5 text-xs font-medium rounded-full",
                        subItem.badgeVariant === 'success' && "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
                        subItem.badgeVariant === 'warning' && "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
                        subItem.badgeVariant === 'error' && "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
                        subItem.badgeVariant === 'info' && "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
                        !subItem.badgeVariant && "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                      )}>
                        {subItem.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default ContextMenuSubMenu;
