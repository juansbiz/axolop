import { createContext, useContext, useState, useCallback, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import ContextMenuContent from "./ContextMenuContent";
import { createMenuItem, createDivider, createHeader, createSmartHeader } from "./ContextMenu";
import { UNIVERSAL_MENU_ITEMS, withUniversalItems } from './ContextMenuConstants';
import { useInAppBehaviors } from '@/hooks/useInAppBehaviors';
import { useSmartActions } from '@/hooks/useSmartActions';
import { useMenuFrequency } from '@/hooks/useMenuFrequency';
import { useContextMenuHistory } from '@/hooks/useContextMenuHistory';
import { showUndoToast } from './UndoToast';
import { recordMenuClick } from '@/utils/menuReorderEngine';
import ActionTimeline from './ActionTimeline';
import ContextSpotlight from './ContextSpotlight';
import RadialMenu from './RadialMenu';
import { useRadialMenu } from '@/hooks/useRadialMenu';
import {
  Eye,
  Edit,
  Target,
  User,
  Mail,
  Phone,
  CheckSquare,
  Copy,
  Archive,
  Trash2,
  DollarSign,
  FileText,
  RefreshCw,
  Download,
  Share,
  Play,
  ArrowRight,
} from "lucide-react";

const ContextMenuContext = createContext(null);

/**
 * Global Context Menu Provider
 * Manages context menus across the entire application
 * Integrates: smart actions, frequency reordering, action history, undo toasts
 * Also suppresses browser default behaviors for in-app feel
 */
export function ContextMenuProvider({ children }) {
  const [activeMenu, setActiveMenu] = useState(null);
  const [isTimelineOpen, setIsTimelineOpen] = useState(false);
  const { recordAction } = useContextMenuHistory();
  const radialMenu = useRadialMenu();

  // Suppress all browser default behaviors (right-click menu, drag, etc.)
  useInAppBehaviors();

  // Listen for radial menu events from useInAppBehaviors
  useEffect(() => {
    const handleRadialOpen = (e) => {
      const { x, y } = e.detail;
      radialMenu.open(x, y);
    };

    document.addEventListener('radial-menu-open', handleRadialOpen);
    return () => document.removeEventListener('radial-menu-open', handleRadialOpen);
  }, [radialMenu.open]);

  // Cmd+Shift+Z to toggle Action Timeline
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === 'z') {
        e.preventDefault();
        setIsTimelineOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const showContextMenu = useCallback((config) => {
    // Validate config to prevent crashes
    if (!config || !config.items) {
      console.warn('[ContextMenuProvider] Invalid config:', config);
      return;
    }

    setActiveMenu({
      id: Date.now() + Math.random(),
      ...config,
    });
  }, []);

  const hideContextMenu = useCallback(() => {
    setActiveMenu(null);
  }, []);

  // Wrap action execution with history tracking + undo toast + frequency tracking
  const handleActionWithTracking = useCallback((originalAction, item, entityData) => {
    // Track frequency
    if (item?.key && entityData?.entityType) {
      recordMenuClick(entityData.entityType, item.key);
    }

    // Record in action history
    if (item?.label && item?.key !== 'shortcuts' && item?.key !== 'feedback' && item?.key !== 'help' && item?.key !== 'reset-menu-order') {
      const actionId = recordAction({
        entityType: entityData?.entityType || 'unknown',
        entityName: entityData?.name || entityData?.title || 'Item',
        actionLabel: item.label,
        icon: item.icon,
        undoFn: item.undoFn || null,
      });

      // Show undo toast for state-changing actions (not view/edit)
      if (item.undoFn && item.key !== 'view' && item.key !== 'edit') {
        showUndoToast(
          `${item.label} completed`,
          item.undoFn
        );
      }
    }

    // Execute the original action
    originalAction?.(item);
  }, [recordAction]);

  const contextValue = {
    showContextMenu,
    hideContextMenu,
    isActive: !!activeMenu,
    handleActionWithTracking,
    openTimeline: () => setIsTimelineOpen(true),
  };

  const menuContent = activeMenu
    ? createPortal(
        <div
          style={{
            position: "fixed",
            left: activeMenu.position?.x || 0,
            top: activeMenu.position?.y || 0,
            zIndex: 9999,
          }}
        >
          <ContextMenuContent
            items={activeMenu.items}
            onClose={hideContextMenu}
            menuClassName={activeMenu.menuClassName}
          />
        </div>,
        document.body,
      )
    : null;

  return (
    <ContextMenuContext.Provider value={contextValue}>
      {children}
      {menuContent}

      {/* Action Timeline - slide-in panel (Cmd+Shift+Z) */}
      <ActionTimeline
        isOpen={isTimelineOpen}
        onClose={() => setIsTimelineOpen(false)}
      />

      {/* Context Spotlight - "/" command palette */}
      <ContextSpotlight />

      {/* Radial Quick Action Ring - Ctrl+Right-Click */}
      <RadialMenu
        isOpen={radialMenu.isOpen}
        position={radialMenu.position}
        hoveredSlice={radialMenu.hoveredSlice}
        entityName={radialMenu.entityData?.name || ''}
        actions={radialMenu.entityData?.actions || []}
        onAction={(action) => {
          action?.action?.();
          radialMenu.close();
        }}
      />
    </ContextMenuContext.Provider>
  );
}

/**
 * Hook to use context menu functionality
 */
export function useContextMenu() {
  const context = useContext(ContextMenuContext);

  if (!context) {
    throw new Error("useContextMenu must be used within ContextMenuProvider");
  }

  return context;
}

/**
 * Higher-order component to add context menu to any element
 */
export function withContextMenu(Component, menuConfig) {
  return function ContextMenuWrapper(props) {
    const { showContextMenu } = useContextMenu();

    const handleContextMenu = useCallback(
      (event, data) => {
        event.preventDefault();

        const items =
          typeof menuConfig === "function"
            ? menuConfig(data, props)
            : menuConfig;

        showContextMenu({
          items,
          position: { x: event.clientX, y: event.clientY },
          data,
          ...props,
        });
      },
      [showContextMenu, props],
    );

    return (
      <div onContextMenu={handleContextMenu}>
        <Component {...props} />
      </div>
    );
  };
}

/**
 * Pre-built menu configurations for common CRM actions
 */
export const CRMMenuConfigs = {
  // Lead-specific context menu
  lead: (
    lead,
    {
      onEdit,
      onDelete,
      onDuplicate,
      onArchive,
      onConvert,
      onEmail,
      onCall,
      onAddTask,
    },
  ) => withUniversalItems([
    createHeader("Lead Actions"),
    createMenuItem({
      key: "view",
      label: "View Details",
      icon: Eye,
      action: () => onEdit?.(lead),
    }),
    createMenuItem({
      key: "edit",
      label: "Edit Lead",
      icon: Edit,
      action: () => onEdit?.(lead),
      shortcut: "E",
    }),
    createDivider(),
    createMenuItem({
      key: "convert",
      label: "Convert to Opportunity",
      description: "Create opportunity from this lead",
      icon: Target,
      action: () => onConvert?.(lead),
      badge: "Pro",
      badgeVariant: "info",
    }),
    createMenuItem({
      key: "contact",
      label: "Create Contact",
      description: "Add as contact",
      icon: User,
      action: () => onConvert?.(lead, "contact"),
    }),
    createDivider(),
    createMenuItem({
      key: "email",
      label: "Send Email",
      icon: Mail,
      action: () => onEmail?.(lead),
      shortcut: "M",
    }),
    createMenuItem({
      key: "call",
      label: "Log Call",
      icon: Phone,
      action: () => onCall?.(lead),
    }),
    createMenuItem({
      key: "task",
      label: "Add Task",
      icon: CheckSquare,
      action: () => onAddTask?.(lead),
    }),
    createDivider(),
    createMenuItem({
      key: "duplicate",
      label: "Duplicate Lead",
      icon: Copy,
      action: () => onDuplicate?.(lead),
    }),
    createMenuItem({
      key: "archive",
      label: "Archive Lead",
      icon: Archive,
      action: () => onArchive?.(lead),
    }),
    createDivider(),
    createMenuItem({
      key: "delete",
      label: "Delete Lead",
      description: "This action cannot be undone",
      icon: Trash2,
      action: () => onDelete?.(lead),
      variant: "destructive",
      shortcut: "⌘⌫",
    }),
  ]),

  // Contact-specific context menu
  contact: (
    contact,
    { onEdit, onDelete, onDuplicate, onEmail, onCall, onAddTask, onViewDeals },
  ) => withUniversalItems([
    createHeader("Contact Actions"),
    createMenuItem({
      key: "view",
      label: "View Details",
      icon: Eye,
      action: () => onEdit?.(contact),
    }),
    createMenuItem({
      key: "edit",
      label: "Edit Contact",
      icon: Edit,
      action: () => onEdit?.(contact),
      shortcut: "E",
    }),
    createDivider(),
    createMenuItem({
      key: "deals",
      label: "View Deals",
      description: `See all deals for ${contact.first_name}`,
      icon: DollarSign,
      action: () => onViewDeals?.(contact),
      badge: contact.deal_count || "0",
    }),
    createDivider(),
    createMenuItem({
      key: "email",
      label: "Send Email",
      icon: Mail,
      action: () => onEmail?.(contact),
      shortcut: "M",
    }),
    createMenuItem({
      key: "call",
      label: "Log Call",
      icon: Phone,
      action: () => onCall?.(contact),
    }),
    createMenuItem({
      key: "task",
      label: "Add Task",
      icon: CheckSquare,
      action: () => onAddTask?.(contact),
    }),
    createDivider(),
    createMenuItem({
      key: "duplicate",
      label: "Duplicate Contact",
      icon: Copy,
      action: () => onDuplicate?.(contact),
    }),
    createDivider(),
    createMenuItem({
      key: "delete",
      label: "Delete Contact",
      description: "This action cannot be undone",
      icon: Trash2,
      action: () => onDelete?.(contact),
      variant: "destructive",
      shortcut: "⌘⌫",
    }),
  ]),

  // Deal/Opportunity-specific context menu
  deal: (
    deal,
    { onEdit, onDelete, onDuplicate, onMoveStage, onViewActivities, onAddNote },
  ) => withUniversalItems([
    createHeader("Deal Actions"),
    createMenuItem({
      key: "view",
      label: "View Details",
      icon: Eye,
      action: () => onEdit?.(deal),
    }),
    createMenuItem({
      key: "edit",
      label: "Edit Deal",
      icon: Edit,
      action: () => onEdit?.(deal),
      shortcut: "E",
    }),
    createDivider(),
    createMenuItem({
      key: "move-stage",
      label: "Move to Stage",
      description: "Change deal stage",
      icon: ArrowRight,
      action: () => onMoveStage?.(deal),
    }),
    createMenuItem({
      key: "activities",
      label: "View Activities",
      description: "See all activities and notes",
      icon: FileText,
      action: () => onViewActivities?.(deal),
    }),
    createMenuItem({
      key: "add-note",
      label: "Add Note",
      icon: FileText,
      action: () => onAddNote?.(deal),
      shortcut: "N",
    }),
    createDivider(),
    createMenuItem({
      key: "duplicate",
      label: "Duplicate Deal",
      icon: Copy,
      action: () => onDuplicate?.(deal),
    }),
    createDivider(),
    createMenuItem({
      key: "delete",
      label: "Delete Deal",
      description: "This action cannot be undone",
      icon: Trash2,
      action: () => onDelete?.(deal),
      variant: "destructive",
      shortcut: "⌘⌫",
    }),
  ]),

  // Dashboard widget context menu
  widget: (widget, { onEdit, onDuplicate, onRemove, onExport, onRefresh }) => withUniversalItems([
    createHeader("Widget Actions"),
    createMenuItem({
      key: "edit",
      label: "Edit Widget",
      icon: Edit,
      action: () => onEdit?.(widget),
      shortcut: "E",
    }),
    createMenuItem({
      key: "refresh",
      label: "Refresh Data",
      icon: RefreshCw,
      action: () => onRefresh?.(widget),
      shortcut: "R",
    }),
    createMenuItem({
      key: "export",
      label: "Export Data",
      icon: Download,
      action: () => onExport?.(widget),
    }),
    createDivider(),
    createMenuItem({
      key: "duplicate",
      label: "Duplicate Widget",
      icon: Copy,
      action: () => onDuplicate?.(widget),
    }),
    createMenuItem({
      key: "remove",
      label: "Remove Widget",
      description: "Remove from dashboard",
      icon: Trash2,
      action: () => onRemove?.(widget),
      variant: "destructive",
    }),
  ]),

  // Form-specific context menu
  form: (
    form,
    { onEdit, onDelete, onDuplicate, onPreview, onShare, onViewSubmissions },
  ) => withUniversalItems([
    createHeader("Form Actions"),
    createMenuItem({
      key: "edit",
      label: "Edit Form",
      icon: Edit,
      action: () => onEdit?.(form),
      shortcut: "E",
    }),
    createMenuItem({
      key: "preview",
      label: "Preview Form",
      icon: Eye,
      action: () => onPreview?.(form),
      shortcut: "P",
    }),
    createMenuItem({
      key: "share",
      label: "Share Form",
      icon: Share,
      action: () => onShare?.(form),
      shortcut: "S",
    }),
    createDivider(),
    createMenuItem({
      key: "submissions",
      label: "View Submissions",
      description: `See ${form.submission_count || 0} submissions`,
      icon: FileText,
      action: () => onViewSubmissions?.(form),
      badge: form.submission_count || "0",
    }),
    createDivider(),
    createMenuItem({
      key: "duplicate",
      label: "Duplicate Form",
      icon: Copy,
      action: () => onDuplicate?.(form),
    }),
    createDivider(),
    createMenuItem({
      key: "delete",
      label: "Delete Form",
      description: "This action cannot be undone",
      icon: Trash2,
      action: () => onDelete?.(form),
      variant: "destructive",
      shortcut: "⌘⌫",
    }),
  ]),
};

// Re-export helper functions for convenience
export { createMenuItem, createDivider, createHeader, createSmartHeader };

export default ContextMenuProvider;
