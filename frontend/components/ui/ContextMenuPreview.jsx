/**
 * Context Menu Preview Component
 *
 * Renders a hover preview card beside a menu item.
 * Shows entity info, pipeline stages, email templates, etc.
 * Positioned like submenus (flip if no space).
 * On mobile: hidden (space constraints).
 */

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import EntityCardPreview from './previews/EntityCardPreview';
import PipelinePreview from './previews/PipelinePreview';
import EmailTemplatePreview from './previews/EmailTemplatePreview';

const PREVIEW_COMPONENTS = {
  'entity-card': EntityCardPreview,
  'pipeline': PipelinePreview,
  'email-template': EmailTemplatePreview,
};

export function ContextMenuPreview({ preview, triggerRef, isVisible }) {
  const previewRef = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  // Calculate position
  useEffect(() => {
    if (!isVisible || !triggerRef?.current || !previewRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const previewRect = previewRef.current.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // Default: right of trigger
    let x = triggerRect.right + 8;
    let y = triggerRect.top;

    // Flip left if no space
    if (x + previewRect.width > viewportWidth - 8) {
      x = triggerRect.left - previewRect.width - 8;
    }

    // Adjust vertical
    if (y + previewRect.height > viewportHeight - 8) {
      y = viewportHeight - previewRect.height - 8;
    }
    if (y < 8) y = 8;

    setPosition({ x, y });
  }, [isVisible, triggerRef]);

  if (!preview || !preview.type) return null;

  const PreviewComponent = PREVIEW_COMPONENTS[preview.type];
  if (!PreviewComponent) return null;

  // Hide on mobile (touch devices)
  const isTouchDevice = 'ontouchstart' in window;
  if (isTouchDevice) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          ref={previewRef}
          initial={{ opacity: 0, scale: 0.95, x: -4 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.15, ease: 'easeOut' }}
          className={cn(
            "fixed z-[10001] pointer-events-none",
            // Light mode
            "bg-white/98 backdrop-blur-xl",
            "border border-gray-200/60",
            "shadow-xl shadow-gray-900/10",
            "rounded-lg overflow-hidden",
            // Dark mode
            "dark:bg-[#0a0a0a]/95 dark:backdrop-blur-2xl",
            "dark:border-[#3F0D28]/20",
            "dark:shadow-[0_8px_30px_rgba(0,0,0,0.3)]"
          )}
          style={{
            left: position.x,
            top: position.y,
          }}
        >
          <PreviewComponent
            data={preview.data}
            targetStage={preview.targetStage}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/**
 * Hook to manage hover preview state with delay
 */
export function useHoverPreview(delay = 300) {
  const [hoveredItem, setHoveredItem] = useState(null);
  const [isPreviewVisible, setIsPreviewVisible] = useState(false);
  const hoverTimeoutRef = useRef(null);
  const itemRef = useRef(null);

  const onItemMouseEnter = useCallback((item, ref) => {
    if (!item?.preview) return;

    itemRef.current = ref;
    hoverTimeoutRef.current = setTimeout(() => {
      setHoveredItem(item);
      setIsPreviewVisible(true);
    }, delay);
  }, [delay]);

  const onItemMouseLeave = useCallback(() => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    setIsPreviewVisible(false);
    setHoveredItem(null);
  }, []);

  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

  return {
    hoveredItem,
    isPreviewVisible,
    itemRef,
    onItemMouseEnter,
    onItemMouseLeave,
  };
}

export default ContextMenuPreview;
