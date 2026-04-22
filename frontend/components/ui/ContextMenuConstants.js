/**
 * Context Menu Design System Constants
 *
 * CRITICAL: These constants ensure EVERY menu in Axolop CRM looks and feels identical.
 * Never deviate from these values unless updating the entire design system.
 */

import { Keyboard, MessageCircle, HelpCircle, RotateCcw } from 'lucide-react';

// ============================================================================
// ANIMATION SYSTEM (Apple-inspired)
// ============================================================================

export const MENU_ANIMATION = {
  // Entrance animation
  initial: {
    opacity: 0,
    scale: 0.95,
    y: -8
  },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: -8
  },
  transition: {
    type: "spring",
    stiffness: 400,
    damping: 25,
    mass: 0.5,
    duration: 0.2
  }
};

// Menu item hover (consistent across all items)
export const ITEM_HOVER = {
  backgroundColor: "rgba(0, 122, 255, 0.08)",
  transition: { duration: 0.1, ease: "easeOut" }
};

// Destructive item hover (consistent for delete actions)
export const DESTRUCTIVE_HOVER = {
  backgroundColor: "rgba(255, 59, 48, 0.08)",
  color: "#FF3B30",
  transition: { duration: 0.1, ease: "easeOut" }
};

// ============================================================================
// VISUAL DESIGN SYSTEM
// ============================================================================

export const MENU_DESIGN = {
  // Container
  container: {
    minWidth: "220px",
    maxWidth: "320px",
    background: "rgba(255, 255, 255, 0.95)",
    backdropFilter: "blur(20px) saturate(180%)",
    border: "1px solid rgba(0, 0, 0, 0.08)",
    borderRadius: "12px",
    boxShadow: "0 10px 40px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.08)",
    padding: "6px",
  },

  // Menu Items
  item: {
    height: "36px",
    padding: "0 12px",
    borderRadius: "6px",
    fontSize: "14px",
    fontWeight: "500",
    gap: "12px",
    iconSize: "16px",
  },

  // Dividers
  divider: {
    height: "1px",
    margin: "6px 8px",
    background: "rgba(0, 0, 0, 0.08)",
  },

  // Headers
  header: {
    height: "28px",
    padding: "0 12px",
    fontSize: "11px",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    color: "rgba(0, 0, 0, 0.5)",
  },

  // Badges
  badge: {
    padding: "2px 6px",
    fontSize: "11px",
    fontWeight: "600",
    borderRadius: "4px",
  },

  // Keyboard Shortcuts
  shortcut: {
    fontSize: "12px",
    fontFamily: "SF Mono, Menlo, monospace",
    color: "rgba(0, 0, 0, 0.4)",
  }
};

// Dark mode design tokens
export const MENU_DESIGN_DARK = {
  container: {
    background: "rgba(10, 10, 10, 0.92)",
    backdropFilter: "blur(24px) saturate(200%)",
    border: "1px solid rgba(63, 13, 40, 0.3)",
    boxShadow: "0 10px 40px rgba(0, 0, 0, 0.4), 0 0 40px rgba(63, 13, 40, 0.15)",
  },
  item: {
    color: "rgba(229, 231, 235, 1)",
    hoverBackground: "rgba(63, 13, 40, 0.15)",
  },
  divider: {
    background: "rgba(75, 85, 99, 0.3)",
  },
  header: {
    color: "rgba(156, 163, 175, 1)",
  },
  search: {
    background: "rgba(31, 41, 55, 1)",
    border: "rgba(55, 65, 81, 1)",
    color: "rgba(229, 231, 235, 1)",
  },
};

// ============================================================================
// MENU SIZE GUIDELINES
// ============================================================================

export const MENU_SIZE_GUIDELINES = {
  // Rows (table/kanban cards)
  row: {
    min: 5,
    ideal: { min: 8, max: 12 },
    max: 15,
  },

  // Column Headers
  columnHeader: {
    min: 4,
    ideal: { min: 6, max: 10 },
    max: 12,
  },

  // Cells
  cell: {
    min: 3,
    ideal: { min: 4, max: 6 },
    max: 8,
  },

  // Blank Spaces
  blankSpace: {
    min: 3,
    ideal: { min: 5, max: 8 },
    max: 10,
  },

  // Sidebar Items
  sidebarItem: {
    min: 3,
    ideal: { min: 4, max: 6 },
    max: 8,
  }
};

// ============================================================================
// ITEM PRIORITY SYSTEM
// ============================================================================

export const ITEM_PRIORITY = {
  SMART_ACTION: -1, // AI-suggested actions (above everything)
  CRITICAL: 0,      // Always show (Edit, View, Delete)
  HIGH: 1,          // Show if data available (Email, Call)
  MEDIUM: 2,        // Show if relevant context (Convert, Archive)
  LOW: 3,           // Show if space available (Duplicate, Export)
  UNIVERSAL: 99,    // Always show at bottom (Shortcuts, Feedback, Help)
};

// ============================================================================
// UNIVERSAL MENU ITEMS (Always at bottom)
// ============================================================================

/**
 * These 3 items appear at the BOTTOM of EVERY menu in the entire app.
 * Always in this order, always with a separator above them.
 */
export const UNIVERSAL_MENU_ITEMS = [
  { type: 'divider' },
  {
    key: 'shortcuts',
    label: 'Keyboard Shortcuts',
    icon: Keyboard,
    shortcut: '⌘/',
    description: 'View all keyboard shortcuts',
    action: () => {
      // TODO: Open shortcuts modal
      console.log('Open shortcuts modal');
    },
    variant: 'default',
    priority: ITEM_PRIORITY.UNIVERSAL,
  },
  {
    key: 'feedback',
    label: 'Send Feedback',
    icon: MessageCircle,
    description: 'Help us improve Axolop',
    action: () => {
      // TODO: Open feedback modal
      console.log('Open feedback modal');
    },
    variant: 'default',
    priority: ITEM_PRIORITY.UNIVERSAL,
  },
  {
    key: 'help',
    label: 'Help & Support',
    icon: HelpCircle,
    shortcut: '?',
    description: 'Get help with this feature',
    action: (context) => {
      // TODO: Open contextual help
      console.log('Open contextual help:', context);
    },
    variant: 'default',
    priority: ITEM_PRIORITY.UNIVERSAL,
  },
  {
    key: 'reset-menu-order',
    label: 'Reset Menu Order',
    icon: RotateCcw,
    description: 'Clear personalized ordering',
    action: () => {
      try {
        localStorage.removeItem('axolop_menu_frequency');
        console.log('Menu order reset');
      } catch {}
    },
    variant: 'default',
    priority: ITEM_PRIORITY.UNIVERSAL,
  }
];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Optimize menu items by priority and max count
 */
export function optimizeMenuItems(items, maxItems = 12) {
  // Filter out universal items (they're added separately)
  const nonUniversal = items.filter(item =>
    item.priority !== ITEM_PRIORITY.UNIVERSAL && item.type !== 'divider'
  );

  // Sort by priority
  const sorted = nonUniversal.sort((a, b) =>
    (a.priority || ITEM_PRIORITY.MEDIUM) - (b.priority || ITEM_PRIORITY.MEDIUM)
  );

  // Keep critical + high priority items
  const critical = sorted.filter(item => (item.priority || 2) <= ITEM_PRIORITY.HIGH);

  // Add medium/low until max reached (reserve 3 for universal)
  const remaining = maxItems - critical.length - 3;
  const additional = sorted.slice(critical.length, critical.length + remaining);

  return [...critical, ...additional];
}

/**
 * Append universal items to menu
 */
export function withUniversalItems(items) {
  return [...items, ...UNIVERSAL_MENU_ITEMS];
}
