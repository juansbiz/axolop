import { useRef, useEffect, useCallback, memo } from "react";
import { Sparkles, Star } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Context Menu Content Component
 * Renders the actual menu content without positioning logic
 * Used by ContextMenuProvider
 * Supports dark mode, accessibility roles, smart actions, personalization
 */
export default memo(function ContextMenuContent({
  items = [],
  onClose,
  menuClassName = "",
}) {
  const menuRef = useRef(null);
  const previousFocusRef = useRef(null);

  // Save and restore focus
  useEffect(() => {
    previousFocusRef.current = document.activeElement;
    return () => {
      if (previousFocusRef.current && previousFocusRef.current.focus) {
        previousFocusRef.current.focus();
      }
    };
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        onClose?.();
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        onClose?.();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [onClose]);

  // Handle keyboard navigation
  const handleKeyDown = useCallback((event) => {
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
          currentIndex === 0 ? focusableElements.length - 1 : currentIndex - 1;
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
  }, []);

  const handleAction = useCallback(
    (action, item, event) => {
      event?.stopPropagation();
      action?.(item);
      onClose?.();
    },
    [onClose],
  );

  return (
    <div
      ref={menuRef}
      role="menu"
      aria-label="Context menu"
      tabIndex={-1}
      className={cn(
        // Base styles
        "min-w-[180px] max-w-[300px]",
        // Light mode
        "bg-white/95 backdrop-blur-xl shadow-md/50",
        "shadow-2xl shadow-gray-900/10",
        "rounded-lg overflow-hidden",
        // Dark mode
        "dark:bg-[#0a0a0a]/92 dark:backdrop-blur-2xl",
        "dark:border dark:border-[#3F0D28]/30",
        "dark:shadow-[0_10px_40px_rgba(0,0,0,0.4),0_0_40px_rgba(63,13,40,0.15)]",
        // Smooth animations
        "animate-in fade-in slide-in-from-top-2 duration-200 ease-out",
        // Custom styles
        menuClassName,
      )}
      onKeyDown={handleKeyDown}
    >
      <div className="py-1">
        {items.map((item, index) => {
          if (item.type === "divider") {
            return (
              <div
                key={`divider-${index}`}
                role="separator"
                className="my-1 h-px bg-gray-200/60 dark:bg-gray-700/30 mx-2"
              />
            );
          }

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

          const Icon = item.icon;
          const isDestructive = item.variant === "destructive";
          const isDisabled = item.disabled;
          const isSmartAction = item.isSmartAction;
          const isPersonalized = item.isPersonalized;

          return (
            <button
              key={item.key || index}
              role="menuitem"
              onClick={(e) => handleAction(item.action, item, e)}
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
        })}
      </div>
    </div>
  );
});
