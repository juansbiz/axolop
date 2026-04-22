/**
 * AuroraBackground Component
 *
 * Provides consistent background styling across all pages:
 * - variant="full": Complete 3-layer aurora effect for hero sections
 * - variant="base": Solid #0F0510 background for content sections
 */

export function AuroraBackground({ variant = "base", className = "", children }) {
  if (variant === "full") {
    return (
      <div className={`relative ${className}`}>
        {/* Aurora Effect - 3-layer system */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {/* Main Reddish/Pink Streak */}
          <div
            className="absolute top-[10%] left-0 w-[100%] h-[600px] blur-[100px] mix-blend-screen opacity-80 pointer-events-none"
            style={{
              background:
                "linear-gradient(to right, transparent, rgba(190, 18, 60, 0.2), transparent)",
              transform: "rotate(-12deg)",
            }}
          />

          {/* Second Bright Streak (Intersection) */}
          <div
            className="absolute top-[20%] right-0 w-[100%] h-[400px] blur-[80px] mix-blend-screen opacity-60"
            style={{
              background:
                "linear-gradient(to left, transparent, rgba(219, 39, 119, 0.3), transparent)",
              transform: "rotate(6deg)",
            }}
          />

          {/* Deep Vignette to keep edges dark */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(circle at center, transparent 0%, #0F0510 80%)",
            }}
          />
        </div>

        {/* Content */}
        <div className="relative z-10">
          {children}
        </div>
      </div>
    );
  }

  // variant="base" - just provides solid background (relies on parent's #0F0510)
  return (
    <div className={className}>
      {children}
    </div>
  );
}
