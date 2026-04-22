import * as React from "react";
import { motion } from "framer-motion";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

// Export variants for use in other components
export const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3F0D28]/20 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 ease-out",
  {
    variants: {
      variant: {
        default:
          "btn-premium-red text-white hover:scale-[1.01] active:scale-[0.99] font-semibold tracking-tight",
        secondary:
          "bg-gray-50 shadow-sm text-neutral-700 hover:bg-gray-100 hover:shadow-md hover:scale-[1.01] active:scale-[0.99] font-medium",
        success:
          "bg-gradient-to-r from-[#30d158] to-[#2bbf4d] text-white shadow-lg hover:shadow-xl hover:scale-[1.01] active:scale-[0.99] font-semibold tracking-tight",
        destructive:
          "btn-premium-red text-white hover:scale-[1.01] active:scale-[0.99] font-semibold",
        accent:
          "btn-premium-red text-white hover:scale-[1.01] active:scale-[0.99] font-semibold tracking-tight",
        "accent-subtle":
          "bg-[#3F0D28]/15 text-[#3F0D28] hover:bg-[#3F0D28]/25 hover:scale-[1.01] active:scale-[0.99]",
        "accent-gradient":
          "bg-gradient-to-r from-[#140516] via-[#3F0D28] to-[#140516] text-white hover:shadow-2xl hover:scale-[1.01] active:scale-[0.99] font-semibold tracking-tight",
        blue: "bg-gradient-to-r from-[#3F0D28] to-[#5C1741] text-white shadow-lg hover:shadow-xl hover:scale-[1.01] active:scale-[0.99] font-semibold",
        outline:
          "bg-gray-50 shadow-sm hover:bg-gray-100 hover:shadow-md hover:scale-[1.01] active:scale-[0.99] font-medium",
        ghost:
          "hover:bg-neutral-100 hover:text-neutral-900 hover:scale-[1.01] active:scale-[0.99] transition-all duration-200",
        link: "text-[#3F0D28] underline-offset-4 hover:underline transition-all duration-200",
        "metallic-plum":
          "btn-metallic-plum text-white hover:scale-[1.01] active:scale-[0.99] font-semibold tracking-tight",
        "metallic-white":
          "btn-metallic-white text-[#3F0D28] hover:scale-[1.01] active:scale-[0.99] font-semibold tracking-tight",
      },
      size: {
        default: "h-10 px-6 py-3 rounded-lg text-base",
        // WCAG: Touch targets must be at least 44px (h-11) for accessibility
        sm: "h-11 min-h-[44px] px-4 py-2 rounded-lg text-sm",
        lg: "h-12 px-8 py-4 rounded-lg text-lg",
        // WCAG: Icon buttons also need 44px minimum touch target
        icon: "h-11 w-11 min-h-[44px] min-w-[44px] rounded-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

const Button = React.forwardRef(
  ({ className, variant, size, animated = true, disabled, ...props }, ref) => {
    const ButtonComponent = animated ? motion.button : "button";
    const animationProps = animated
      ? {
          whileHover: { scale: disabled ? 1 : 1.02 },
          whileTap: { scale: disabled ? 1 : 0.98 },
          transition: {
            type: "spring",
            stiffness: 400,
            damping: 17,
            // Faster transitions for better responsiveness
            duration: 0.15,
          },
        }
      : {};

    return (
      <ButtonComponent
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled}
        {...animationProps}
        {...props}
      />
    );
  },
);

Button.displayName = "Button";

export { Button };
