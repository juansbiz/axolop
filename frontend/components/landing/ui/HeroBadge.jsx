import { Zap } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * HeroBadge - Consistent free trial badge for all landing sub-pages
 * Displays a prominent badge highlighting the 14-day free trial offer
 */
const HeroBadge = ({
  text = "Try any plan free for 14 days",
  icon: Icon = Zap,
  className
}) => {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 px-4 py-2 rounded-full",
        "bg-[#f2ff00]/20 border border-[#f2ff00]/30",
        "mb-6",
        className
      )}
    >
      {Icon && <Icon className="w-4 h-4 text-[#f2ff00]" />}
      <span className="text-sm font-medium text-[#f2ff00]">
        {text}
      </span>
    </div>
  );
};

export default HeroBadge;
