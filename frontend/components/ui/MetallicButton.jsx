import { forwardRef, memo } from "react";
import { cn } from "@/lib/utils";

/**
 * MetallicButton - Premium metallic chrome button component
 *
 * Provides consistent metallic styling across the application with two variants:
 * - primary: Pink metallic chrome (default)
 * - secondary: White/glass metallic
 *
 * @example
 * <MetallicButton variant="primary" onClick={handleClick}>
 *   Click Me
 * </MetallicButton>
 */
const MetallicButton = memo(
  forwardRef(
    (
      {
        children,
        variant = "primary",
        size = "md",
        className,
        disabled = false,
        ...props
      },
      ref
    ) => {
    // Size configurations
    const sizeClasses = {
      sm: "px-4 py-2 text-sm",
      md: "px-6 py-2.5 text-base",
      lg: "px-10 py-5 text-lg",
    };

    // Variant styles (inline for metallic effects)
    const variantStyles = {
      primary: {
        background:
          "linear-gradient(180deg, #ff85c8 0%, #E92C92 30%, #c41e78 70%, #ff69b4 100%)",
        boxShadow:
          "inset 0 2px 4px rgba(255,255,255,0.6), inset 0 -2px 4px rgba(0,0,0,0.2), 0 10px 40px rgba(233,44,146,0.5), 0 2px 8px rgba(0,0,0,0.3)",
        border: "1px solid rgba(255,255,255,0.3)",
        textGradient:
          "linear-gradient(to bottom, #ffffff 0%, #ffffff 40%, #ffd6eb 70%, #ffb8dc 100%)",
      },
      secondary: {
        background:
          "linear-gradient(180deg, rgba(255,255,255,0.95) 0%, rgba(240,240,245,0.9) 50%, rgba(220,220,230,0.85) 100%)",
        boxShadow:
          "inset 0 2px 4px rgba(255,255,255,1), inset 0 -2px 4px rgba(0,0,0,0.05), 0 8px 32px rgba(0,0,0,0.2), 0 2px 8px rgba(0,0,0,0.1)",
        border: "1px solid rgba(255,255,255,0.8)",
        textGradient:
          "linear-gradient(to bottom, #1a1a1a 0%, #333 50%, #555 100%)",
      },
    };

    const currentVariant = variantStyles[variant];

    return (
      <button
        ref={ref}
        disabled={disabled}
        className={cn(
          "relative group overflow-hidden rounded-full leading-none flex items-center justify-center",
          "transition transform hover:-translate-y-1 active:translate-y-0 active:scale-95",
          "disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none",
          sizeClasses[size],
          className
        )}
        style={{
          background: currentVariant.background,
          boxShadow: currentVariant.boxShadow,
          border: currentVariant.border,
        }}
        {...props}
      >
        {/* Chrome Text */}
        <span
          className="relative z-10 font-black tracking-wide"
          style={{
            backgroundImage: currentVariant.textGradient,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            filter: "drop-shadow(0px 1px 2px rgba(0,0,0,0.3))",
          }}
        >
          {children}
        </span>

        {/* Top metallic shine band */}
        <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/40 via-white/10 to-transparent rounded-t-full pointer-events-none" />

        {/* Animated diagonal sheen */}
        <div className="absolute top-0 -left-[100%] w-[60%] h-full bg-gradient-to-r from-transparent via-white/50 to-transparent skew-x-12 group-hover:left-[200%] transition-all duration-1000 ease-out" />
      </button>
    );
    }
  )
);

MetallicButton.displayName = "MetallicButton";

export default MetallicButton;
