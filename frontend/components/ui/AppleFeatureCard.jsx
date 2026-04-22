import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { createFeatureCardHover } from "@/lib/apple-animations";
import { useRightClick } from "@/hooks/useRightClick";
import { useLongPress } from "@/hooks/useLongPress";
import { getGenericCardMenu } from "@/config/contextMenuConfigs/cardMenus";

/**
 * AppleFeatureCard - Feature card with subtle hover lift
 */
const AppleFeatureCard = ({
  children,
  className,
  hover = true,
  // Context menu props
  enableContextMenu = true,
  cardTitle = 'Feature',
  onView,
  onShare,
  ...props
}) => {
  const cardRef = useRef(null);

  useEffect(() => {
    if (hover && cardRef.current) {
      const cleanup = createFeatureCardHover(cardRef.current);
      return cleanup;
    }
  }, [hover]);

  // Context menu setup
  const cardConfig = { title: cardTitle, canEdit: false, canShare: true, canDelete: false };

  const { handleContextMenu } = useRightClick({
    items: enableContextMenu
      ? () => getGenericCardMenu(cardConfig, {
          onView: onView ? () => onView() : undefined,
          onShare: onShare ? () => onShare() : undefined,
        })
      : () => [],
  });

  const longPressHandlers = useLongPress({
    onLongPress: (e) => {
      if (!enableContextMenu) return;

      const touch = e.touches?.[0];
      if (touch) {
        handleContextMenu({
          preventDefault: () => {},
          stopPropagation: () => {},
          clientX: touch.clientX,
          clientY: touch.clientY,
        });
      }
    },
    delay: 500,
  });

  return (
    <motion.div
      ref={cardRef}
      className={cn(
        "relative p-6 rounded-2xl",
        "backdrop-blur-sm bg-white/[0.02]",
        "border border-gray-800/30",
        "transition-all duration-300",
        "hover:border-gray-700/50",
        hover && "cursor-pointer",
        className,
      )}
      data-feature-card
      whileHover={hover ? { y: -4 } : {}}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      onContextMenu={enableContextMenu ? handleContextMenu : undefined}
      {...(enableContextMenu ? longPressHandlers : {})}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default AppleFeatureCard;
