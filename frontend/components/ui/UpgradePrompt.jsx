import { Lock, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "./button";
import { Link } from "react-router-dom";

/**
 * UpgradePrompt - Shows an upgrade message when a feature is restricted
 * Used for Sales tier users trying to access Build+ features
 */
export default function UpgradePrompt({
  featureName = "This feature",
  description = "Upgrade your plan to unlock this feature.",
  requiredTier = "Build",
  variant = "inline", // "inline" | "fullpage" | "modal"
  className = "",
  onClose,
}) {
  if (variant === "fullpage") {
    return (
      <div className={`flex-1 flex items-center justify-center bg-gray-50 p-6 ${className}`}>
        <div className="max-w-md mx-auto text-center">
          <div className="mx-auto h-16 w-16 rounded-full bg-gradient-to-br from-[#E92C92]/10 to-[#C81E78]/10 flex items-center justify-center mb-6">
            <Lock className="h-8 w-8 text-[#E92C92]" />
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            {featureName}
          </h2>

          <p className="text-gray-600 mb-6">{description}</p>

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#E92C92]/10 text-[#E92C92] font-semibold mb-8">
            <Sparkles className="h-4 w-4" />
            <span>Available in {requiredTier} tier and above</span>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/pricing">
              <Button
                size="lg"
                className="bg-gradient-to-r from-[#E92C92] to-[#C81E78] hover:from-[#d4267f] hover:to-[#5C1741] text-white gap-2"
              >
                <ArrowRight className="h-4 w-4" />
                Upgrade to {requiredTier}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Inline variant (default)
  return (
    <div className={`bg-gradient-to-r from-[#E92C92]/5 to-[#C81E78]/5 border border-[#E92C92]/20 rounded-lg p-4 ${className}`}>
      <div className="flex items-start gap-3">
        <div className="h-10 w-10 rounded-lg bg-[#E92C92]/10 flex items-center justify-center flex-shrink-0">
          <Lock className="h-5 w-5 text-[#E92C92]" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 mb-1">{featureName}</h3>
          <p className="text-sm text-gray-600 mb-3">{description}</p>
          <Link to="/pricing">
            <Button
              size="sm"
              className="bg-[#E92C92] hover:bg-[#d4267f] text-white gap-2"
            >
              <ArrowRight className="h-3 w-3" />
              Upgrade to {requiredTier}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

/**
 * UpgradeBanner - A dismissable banner for upgrade prompts
 */
export function UpgradeBanner({
  featureName,
  description,
  requiredTier = "Build",
  onDismiss,
  className = "",
}) {
  return (
    <div className={`bg-gradient-to-r from-[#E92C92] to-[#C81E78] text-white px-4 py-3 ${className}`}>
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <Sparkles className="h-5 w-5" />
          <span className="font-medium">
            {featureName} is available in {requiredTier} tier.
          </span>
          <span className="text-white/80">{description}</span>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/pricing">
            <Button
              size="sm"
              variant="secondary"
              className="bg-white text-[#E92C92] hover:bg-gray-100 gap-2"
            >
              <ArrowRight className="h-3 w-3" />
              Upgrade Now
            </Button>
          </Link>
          {onDismiss && (
            <button
              onClick={onDismiss}
              className="text-white/60 hover:text-white"
            >
              &times;
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
