import React from "react";
import { cn } from "@/lib/utils";

/**
 * StylizedButton - Metallic chrome button with gradient and animations
 * Extracted from Landing.jsx hero section for reusability across the app
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Button content
 * @param {Function} props.onClick - Click handler
 * @param {string} props.className - Additional classes for button wrapper
 * @param {'sm'|'md'|'lg'} props.size - Button size (default: 'lg')
 * @param {string} props.type - Button type attribute (default: 'button')
 */
export const StylizedButton = ({
  children,
  onClick,
  className = "",
  size = "lg",
  type = "button",
  ...props
}) => {
  // Size configurations
  const sizeClasses = {
    sm: "px-6 py-3 text-base",
    md: "px-8 py-4 text-lg",
    lg: "px-10 py-5 text-lg",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={cn("relative group", className)}
      {...props}
    >
      {/* Metallic Button Body */}
      <div
        className={cn(
          "relative overflow-hidden rounded-full leading-none flex items-center transition transform group-hover:-translate-y-1 active:translate-y-0 active:scale-95",
          sizeClasses[size]
        )}
        style={{
          background:
            "linear-gradient(180deg, #ff85c8 0%, #E92C92 30%, #c41e78 70%, #ff69b4 100%)",
          boxShadow:
            "inset 0 2px 4px rgba(255,255,255,0.6), inset 0 -2px 4px rgba(0,0,0,0.2), 0 10px 40px rgba(233,44,146,0.5), 0 2px 8px rgba(0,0,0,0.3)",
          border: "1px solid rgba(255,255,255,0.3)",
        }}
      >
        {/* Chrome Text */}
        <span
          className="relative z-10 font-black tracking-wide"
          style={{
            backgroundImage:
              "linear-gradient(to bottom, #ffffff 0%, #ffffff 40%, #ffd6eb 70%, #ffb8dc 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            filter: "drop-shadow(0px 1px 2px rgba(0,0,0,0.3))",
          }}
        >
          {children}
        </span>

        {/* Top metallic shine band */}
        <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/40 via-white/10 to-transparent rounded-t-full pointer-events-none"></div>

        {/* Animated diagonal sheen */}
        <div className="absolute top-0 -left-[100%] w-[60%] h-full bg-gradient-to-r from-transparent via-white/50 to-transparent skew-x-12 group-hover:left-[200%] transition-all duration-1000 ease-out"></div>
      </div>
    </button>
  );
};

export default StylizedButton;
