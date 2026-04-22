import { useState, useRef, useEffect, useCallback, memo } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Sparkles, Star } from 'lucide-react';
import { cn } from "@/lib/utils";
import { ContextMenuSearch, NoSearchResults } from './ContextMenuSearch';
import { ContextMenuSubMenu } from './ContextMenuSubMenu';
import { MENU_ANIMATION } from './ContextMenuConstants';

// Check reduced motion preference
const prefersReducedMotion = () =>
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

// Get animation props respecting reduced motion
const getAnimationProps = () => {
  if (prefersReducedMotion()) {
    return {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
      transition: { duration: 0 },
    };
  }
  return MENU_ANIMATION;
};

/**
 * Universal Context Menu Component
 * Apple-inspired design with dark mode support, accessibility, and smart actions
 * Works across all CRM pages with context-aware actions
 */
function ContextMenu({
  children,
  items = [],
  trigger = "right-click",
  disabled = false,
  className = "",
  menuClassName = "",
  onOpen,
  onClose,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [filteredItems, setFilteredItems] = useState(items);
  const menuRef = useRef(null);
  const triggerRef = useRef(null);
  const containerRef = useRef(null);
  const previousFocusRef = useRef(null);

  // Determine if search should be shown (10+ items)
  const showSearch = items.filter(item =>
    item.type !== 'divider' && item.type !== 'header'
  ).length >= 10;

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        closeMenu();
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        closeMenu();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscape);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
        document.removeEventListener("keydown", handleEscape);
      };
    }
  }, [isOpen]);

  // Adjust position if menu goes off-screen
  const adjustPosition = useCallback((x, y) => {
    if (!menuRef.current) return { x, y };

    const menuRect = menuRef.current.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    let adjustedX = x;
    let adjustedY = y;

    if (x + menuRect.width > viewportWidth) {
      adjustedX = viewportWidth - menuRect.width - 8;
    }
    if (adjustedX < 8) adjustedX = 8;

    if (y + menuRect.height > viewportHeight) {
      adjustedY = viewportHeight - menuRect.height - 8;
    }
    if (adjustedY < 8) adjustedY = 8;

    return { x: adjustedX, y: adjustedY };
  }, []);

  const openMenu = useCallback(
    (clientX, clientY) => {
      if (disabled) return;

      // Save focus for restoration on close
      previousFocusRef.current = document.activeElement;

      const adjustedPosition = adjustPosition(clientX, clientY);
      setPosition(adjustedPosition);
      setIsOpen(true);
      onOpen?.();
    },
    [disabled, adjustPosition, onOpen],
  );

  const closeMenu = useCallback(() => {
    setIsOpen(false);
    // Restore previous focus
    if (previousFocusRef.current && previousFocusRef.current.focus) {
      previousFocusRef.current.focus();
      previousFocusRef.current = null;
    }
    onClose?.();
  }, [onClose]);

  const handleContextMenu = useCallback(
    (event) => {
      if (trigger === "right-click") {
        event.preventDefault();
        openMenu(event.clientX, event.clientY);
      }
    },
    [trigger, openMenu],
  );

  const handleClick = useCallback(
    (event) => {
      if (trigger === "click") {
        event.preventDefault();
        openMenu(event.clientX, event.clientY);
      }
    },
    [trigger, openMenu],
  );

  const handleAction = useCallback(
    (action, item) => {
      event?.stopPropagation();
      action?.(item);
      closeMenu();
    },
    [closeMenu],
  );

  // Handle keyboard navigation
  const handleKeyDown = useCallback(
    (event) => {
      if (!isOpen) return;

      const focusableElements = menuRef.current?.querySelectorAll(
        'button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );

      if (!focusableElements?.length) return;

      const currentIndex = Array.from(focusableElements).indexOf(
        document.activeElement,
      );
      let nextIndex = currentIndex;

      switch (event.key) {
        case "ArrowDown":
          event.preventDefault();
          nextIndex = (currentIndex + 1) % focusableElements.length;
          focusableElements[nextIndex]?.focus();
          break;
        case "ArrowUp":
          event.preventDefault();
          nextIndex =
            currentIndex === 0
              ? focusableElements.length - 1
              : currentIndex - 1;
          focusableElements[nextIndex]?.focus();
          break;
        case "Enter":
          event.preventDefault();
          document.activeElement?.click();
          break;
        case "Home":
          event.preventDefault();
          focusableElements[0]?.focus();
          break;
        case "End":
          event.preventDefault();
          focusableElements[focusableElements.length - 1]?.focus();
          break;
      }
    },
    [isOpen],
  );

  const animation = getAnimationProps();

  const menuContent = isOpen
    ? createPortal(
        <AnimatePresence>
          <motion.div
            ref={menuRef}
            initial={animation.initial}
            animate={animation.animate}
            exit={animation.exit}
            transition={animation.transition}
            role="menu"
            aria-label="Context menu"
            tabIndex={-1}
            className={cn(
              // Base styles
              "fixed z-[9999] min-w-[220px] max-w-[320px]",
              // Light mode
              "bg-white/95 backdrop-blur-xl",
              "border border-gray-200/60",
              "shadow-2xl shadow-gray-900/10",
              "rounded-lg overflow-hidden",
              // Dark mode
              "dark:bg-[#0a0a0a]/92 dark:backdrop-blur-2xl",
              "dark:border-[#3F0D28]/30",
              "dark:shadow-[0_10px_40px_rgba(0,0,0,0.4),0_0_40px_rgba(63,13,40,0.15)]",
              // Custom styles
              menuClassName,
            )}
            style={{
              left: position.x,
              top: position.y,
            }}
            onKeyDown={handleKeyDown}
          >
            {/* Search bar for large menus */}
            {showSearch && (
              <ContextMenuSearch
                items={items}
                onFilter={setFilteredItems}
              />
            )}

            {/* Menu items */}
            <div className="py-1">
              {filteredItems.length === 0 ? (
                <NoSearchResults query="" />
              ) : (
                filteredItems.map((item, index) => {
                  // Divider
                  if (item.type === "divider") {
                    return (
                      <div
                        key={`divider-${index}`}
                        role="separator"
                        className="my-1 h-px bg-gray-200/60 dark:bg-gray-700/30 mx-2"
                      />
                    );
                  }

                  // Header
                  if (item.type === "header") {
                    return (
                      <div
                        key={`header-${index}`}
                        role="presentation"
                        className="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                      >
                        {item.label}
                      </div>
                    );
                  }

                  // Smart action header
                  if (item.type === "smart-header") {
                    return (
                      <div
                        key={`smart-header-${index}`}
                        role="presentation"
                        className="px-3 py-1.5 text-xs font-semibold text-purple-600 dark:text-purple-400 uppercase tracking-wider flex items-center gap-1.5"
                      >
                        <Sparkles className="w-3 h-3" />
                        {item.label}
                      </div>
                    );
                  }

                  // Submenu
                  if (item.type === "submenu" && item.submenuItems) {
                    return (
                      <ContextMenuSubMenu
                        key={item.key || index}
                        item={item}
                        position={position}
                        onClose={closeMenu}
                      />
                    );
                  }

                  // Checkbox item
                  if (item.type === "checkbox") {
                    return (
                      <button
                        key={item.key || index}
                        role="menuitemcheckbox"
                        aria-checked={!!item.checked}
                        onClick={(e) => {
                          e.stopPropagation();
                          item.onChange?.(!item.checked);
                        }}
                        disabled={item.disabled}
                        aria-disabled={item.disabled || undefined}
                        className={cn(
                          "w-full px-3 py-2 text-left text-sm font-medium",
                          "flex items-center gap-3 transition-all duration-150",
                          "text-gray-700 hover:bg-gray-50/80 hover:text-gray-900",
                          "dark:text-gray-200 dark:hover:bg-[#3F0D28]/15 dark:hover:text-white",
                          "focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-inset",
                          item.disabled && "text-gray-400 dark:text-gray-600 cursor-not-allowed opacity-50",
                          "active:scale-[0.98]"
                        )}
                      >
                        <motion.div
                          className={cn(
                            "w-4 h-4 rounded border-2 flex items-center justify-center",
                            item.checked ? "bg-blue-500 border-blue-500" : "border-gray-300 dark:border-gray-600"
                          )}
                        >
                          {item.checked && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ type: "spring", stiffness: 500 }}
                            >
                              <Check className="w-3 h-3 text-white" />
                            </motion.div>
                          )}
                        </motion.div>
                        <span className="flex-1">{item.label}</span>
                      </button>
                    );
                  }

                  // Regular menu item
                  const Icon = item.icon;
                  const isDestructive = item.variant === "destructive";
                  const isDisabled = item.disabled;
                  const isSmartAction = item.isSmartAction;
                  const isPersonalized = item.isPersonalized;

                  return (
                    <button
                      key={item.key || index}
                      role="menuitem"
                      onClick={(e) => handleAction(item.action, item)}
                      disabled={isDisabled}
                      aria-disabled={isDisabled || undefined}
                      className={cn(
                        // Base button styles
                        "w-full px-3 py-2 text-left text-sm font-medium",
                        "flex items-center gap-3 transition-all duration-150",
                        "focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-inset",
                        // Default state
                        "text-gray-700 hover:bg-gray-50/80 hover:text-gray-900",
                        // Dark mode
                        "dark:text-gray-200 dark:hover:bg-[#3F0D28]/15 dark:hover:text-white",
                        // Disabled state
                        isDisabled && "text-gray-400 dark:text-gray-600 cursor-not-allowed opacity-50",
                        // Destructive state
                        isDestructive &&
                          !isDisabled &&
                          "text-red-600 hover:bg-red-50/80 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-900/20 dark:hover:text-red-300",
                        // Smart action styling
                        isSmartAction && "border-l-2 border-l-purple-500/60 dark:border-l-purple-400/60",
                        // Active state
                        "active:scale-[0.98]",
                      )}
                    >
                      {/* Smart action sparkle icon */}
                      {isSmartAction && (
                        <Sparkles className="h-3.5 w-3.5 flex-shrink-0 text-purple-500 dark:text-purple-400" />
                      )}
                      {Icon && !isSmartAction && (
                        <Icon
                          className={cn(
                            "h-4 w-4 flex-shrink-0",
                            isDisabled && "text-gray-400 dark:text-gray-600",
                            isDestructive && !isDisabled && "text-red-500 dark:text-red-400",
                          )}
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="truncate">{item.label}</div>
                        {item.description && (
                          <div className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">
                            {item.description}
                          </div>
                        )}
                      </div>
                      {/* Personalization star */}
                      {isPersonalized && (
                        <Star className="h-3 w-3 text-amber-400 fill-amber-400 flex-shrink-0" />
                      )}
                      {/* Smart action AI badge */}
                      {isSmartAction && (
                        <span className="px-1.5 py-0.5 text-[10px] font-bold rounded bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300">
                          AI
                        </span>
                      )}
                      {item.shortcut && (
                        <div className="text-xs text-gray-400 dark:text-gray-500 font-mono">
                          {item.shortcut}
                        </div>
                      )}
                      {item.badge && (
                        <div
                          className={cn(
                            "px-2 py-0.5 text-xs font-medium rounded-full",
                            item.badgeVariant === "success" &&
                              "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
                            item.badgeVariant === "warning" &&
                              "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
                            item.badgeVariant === "error" &&
                              "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
                            item.badgeVariant === "info" &&
                              "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
                            !item.badgeVariant && "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
                          )}
                        >
                          {item.badge}
                        </div>
                      )}
                    </button>
                  );
                })
              )}
            </div>
          </motion.div>
        </AnimatePresence>,
        document.body,
      )
    : null;

  return (
    <div
      ref={containerRef}
      className={cn("relative inline-block", className)}
      onContextMenu={handleContextMenu}
      onClick={handleClick}
    >
      <div ref={triggerRef}>{children}</div>
      {menuContent}
    </div>
  );
}

export default memo(ContextMenu);

// Helper function to create common menu items
export const createMenuItem = (config) => ({
  key: config.key,
  label: config.label,
  description: config.description,
  icon: config.icon,
  action: config.action,
  disabled: config.disabled,
  variant: config.variant,
  shortcut: config.shortcut,
  badge: config.badge,
  badgeVariant: config.badgeVariant,
  preview: config.preview,
  priority: config.priority,
  undoFn: config.undoFn,
  isSmartAction: config.isSmartAction,
  isPersonalized: config.isPersonalized,
});

// Helper function to create divider
export const createDivider = () => ({ type: "divider" });

// Helper function to create header
export const createHeader = (label) => ({ type: "header", label });

// Helper function to create smart action header
export const createSmartHeader = (label = "Suggested for you") => ({ type: "smart-header", label });
