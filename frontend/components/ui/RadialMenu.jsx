/**
 * Radial Quick Action Ring
 *
 * Hold Ctrl+Right-Click to open a radial pie menu centered on cursor
 * with top 5 actions in a circle. Muscle memory builds fast -
 * each position is fixed by action category.
 *
 * Positions (fixed by category):
 * - Top (0deg): Primary action (View/Edit)
 * - Right (72deg): Communication (Email/Call)
 * - Bottom-right (144deg): Organization (Move/Assign)
 * - Bottom-left (216deg): Destructive (Delete/Archive)
 * - Left (288deg): Quick create (Add Task/Note)
 */

import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, Mail, ArrowRight, Trash2, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  getSlicePosition,
  getSlicePath,
  POSITION_CATEGORIES,
} from '@/utils/radialMenuPositions';

// Default actions per category
const DEFAULT_ICONS = [Eye, Mail, ArrowRight, Trash2, Plus];
const DEFAULT_LABELS = ['View', 'Email', 'Move', 'Delete', 'Create'];

export default function RadialMenu({
  isOpen,
  position,
  hoveredSlice,
  actions = [],
  entityName = '',
  onAction,
}) {
  // Fill with defaults if not enough actions
  const items = Array.from({ length: 5 }, (_, i) => {
    const action = actions[i];
    return {
      icon: action?.icon || DEFAULT_ICONS[i],
      label: action?.label || DEFAULT_LABELS[i],
      action: action?.action || null,
      category: POSITION_CATEGORIES[i],
      isDestructive: i === 3,
    };
  });

  if (!isOpen) return null;

  const OUTER_RADIUS = 100;
  const INNER_RADIUS = 30;
  const SIZE = OUTER_RADIUS * 2 + 40; // Extra padding
  const CENTER = SIZE / 2;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Dark backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.1 }}
            className="fixed inset-0 z-[10002] bg-black/60"
            style={{ pointerEvents: 'none' }}
          />

          {/* Radial Menu */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            className="fixed z-[10003]"
            style={{
              left: position.x - CENTER,
              top: position.y - CENTER,
              width: SIZE,
              height: SIZE,
              pointerEvents: 'none',
            }}
          >
            <svg
              width={SIZE}
              height={SIZE}
              viewBox={`${-CENTER} ${-CENTER} ${SIZE} ${SIZE}`}
              className="overflow-visible"
            >
              {/* Pie slices */}
              {items.map((item, i) => {
                const isHovered = hoveredSlice === i;
                const path = getSlicePath(i, INNER_RADIUS, OUTER_RADIUS);
                const iconPos = getSlicePosition(i, 65);

                return (
                  <g key={i}>
                    {/* Slice background */}
                    <motion.path
                      d={path}
                      fill={
                        isHovered
                          ? item.isDestructive
                            ? 'rgba(239, 68, 68, 0.3)'
                            : 'rgba(63, 13, 40, 0.4)'
                          : 'rgba(15, 15, 15, 0.85)'
                      }
                      stroke={
                        isHovered
                          ? item.isDestructive
                            ? 'rgba(239, 68, 68, 0.6)'
                            : 'rgba(91, 16, 70, 0.8)'
                          : 'rgba(63, 13, 40, 0.3)'
                      }
                      strokeWidth={1.5}
                      animate={{
                        scale: isHovered ? 1.08 : 1,
                      }}
                      transition={{ duration: 0.15 }}
                      style={{ transformOrigin: '0 0' }}
                    />

                    {/* Icon */}
                    <foreignObject
                      x={iconPos.x - 12}
                      y={iconPos.y - 12}
                      width={24}
                      height={24}
                    >
                      <div className="w-full h-full flex items-center justify-center">
                        <item.icon className={cn(
                          "w-5 h-5 transition-all",
                          isHovered
                            ? item.isDestructive
                              ? "text-red-400 scale-110"
                              : "text-white scale-110"
                            : "text-gray-300"
                        )} />
                      </div>
                    </foreignObject>

                    {/* Label (only on hover) */}
                    {isHovered && (
                      <foreignObject
                        x={iconPos.x - 40}
                        y={iconPos.y + 14}
                        width={80}
                        height={20}
                      >
                        <div className="text-center">
                          <span className={cn(
                            "text-[10px] font-bold uppercase tracking-wider",
                            item.isDestructive ? "text-red-400" : "text-white"
                          )}>
                            {item.label}
                          </span>
                        </div>
                      </foreignObject>
                    )}
                  </g>
                );
              })}

              {/* Center circle with entity name */}
              <circle
                cx={0}
                cy={0}
                r={INNER_RADIUS - 2}
                fill="rgba(10, 10, 10, 0.95)"
                stroke="rgba(63, 13, 40, 0.4)"
                strokeWidth={1}
              />
              <foreignObject
                x={-INNER_RADIUS + 4}
                y={-INNER_RADIUS + 4}
                width={(INNER_RADIUS - 4) * 2}
                height={(INNER_RADIUS - 4) * 2}
              >
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-[8px] text-gray-400 text-center leading-tight truncate px-1">
                    {entityName || 'Quick'}
                  </span>
                </div>
              </foreignObject>
            </svg>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}
