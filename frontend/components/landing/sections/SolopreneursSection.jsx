import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import {
  Users,
  Calendar,
  Mail,
  FileText,
  CheckSquare,
  ArrowRight,
  Sparkles,
  Zap,
} from "lucide-react";

/**
 * Key features for Ecommerce Founders
 */
const SOLOPRENEUR_FEATURES = [
  {
    title: "Customer Management",
    description:
      "Track all your customers in one place. Own your data forever.",
    icon: Users,
    color: "pink",
  },
  {
    title: "Pipeline",
    description: "Visual tracking from prospect to repeat customer.",
    icon: Calendar,
    color: "pink",
  },
  {
    title: "Email Marketing",
    description:
      "Campaigns and automations without the expensive subscriptions.",
    icon: Mail,
    color: "pink",
  },
  {
    title: "Form Builder",
    description: "Lead capture and intake forms. No coding required.",
    icon: FileText,
    color: "pink",
  },
  {
    title: "Task Boards",
    description: "Keep your business organized with visual boards.",
    icon: CheckSquare,
    color: "pink",
  },
  {
    title: "Connect Your AI",
    description: "Use ChatGPT, Claude, or any LLM. Not locked into their AI.",
    icon: Zap,
    color: "pink",
  },
];

/**
 * SolopreneursSection - Dedicated section for ecommerce founders
 */
const SolopreneursSection = ({ className }) => {
  return (
    <section
      className={cn("relative py-20 md:py-28 overflow-hidden", className)}
      style={{ background: "#0F0510" }}
    >
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-16">
          {/* Badge */}
          <div className="inline-block mb-6">
            <div className="px-4 py-2 rounded-full bg-[#E92C92]/40 border border-[#E92C92]/60">
              <span className="text-sm font-semibold text-white uppercase tracking-wider">
                For Ecommerce Founders
              </span>
            </div>
          </div>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            Everything You Need to Run Your Store
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Stop drowning in subscriptions. One platform for
            customers, email, scheduling, and automation.
          </p>
        </div>

        {/* All-in-One Platform Callout - Prominent */}
        <div className="max-w-3xl mx-auto mb-12">
          <div
            className={cn(
              "relative p-8 rounded-3xl",
              "bg-gradient-to-br from-[#E92C92]/40 to-[#C81E78]/30",
              "border-2 border-[#E92C92]/60",
              "shadow-[0_0_60px_-15px_rgba(233,44,146,0.4)]",
            )}
          >
            {/* Glow effect */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-[#E92C92]/20 to-transparent pointer-events-none" />

            <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
              {/* Icon */}
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#E92C92] to-[#C81E78] flex items-center justify-center flex-shrink-0 shadow-lg shadow-[#E92C92]/40">
                <Sparkles className="w-10 h-10 text-white" />
              </div>

              {/* Content */}
              <div className="text-center md:text-left flex-1">
                <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                  <h3 className="text-2xl font-bold text-white">
                    Run Your Entire Business
                  </h3>
                  <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-[#E92C92] text-white uppercase">
                    Replaces 8+ Tools
                  </span>
                </div>
                <p className="text-gray-300 mb-4">
                  Save $208/month by replacing Calendly, ConvertKit, Notion,
                  Typeform, and more. One simple platform for everything.
                </p>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm">
                  <span className="flex items-center gap-1 text-gray-300">
                    <Users className="w-4 h-4" /> Client management
                  </span>
                  <span className="flex items-center gap-1 text-gray-300">
                    <Zap className="w-4 h-4" /> Full automation
                  </span>
                  <span className="flex items-center gap-1 text-gray-300">
                    <Calendar className="w-4 h-4" /> Smart scheduling
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {SOLOPRENEUR_FEATURES.map((feature, index) => {
            const FeatureIcon = feature.icon;
            const iconBgColor =
              feature.color === "blue"
                ? "bg-[#1fb5b9]/20"
                : feature.color === "yellow"
                  ? "bg-[#d4a00a]/20"
                  : "bg-[#E92C92]/30";
            const iconColor =
              feature.color === "blue"
                ? "text-[#1fb5b9]"
                : feature.color === "yellow"
                  ? "text-[#f5c518]"
                  : "text-white";
            const borderHover =
              feature.color === "blue"
                ? "hover:border-[#1fb5b9]/30"
                : feature.color === "yellow"
                  ? "hover:border-[#d4a00a]/30"
                  : "hover:border-white/20";

            return (
              <div
                key={feature.title}
                className={cn(
                  "group relative p-6 rounded-2xl",
                  "backdrop-blur-sm bg-white/5 border border-white/10",
                  "hover:bg-white/10",
                  borderHover,
                  "transition-all duration-300",
                )}
              >
                {/* Icon */}
                <div
                  className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform",
                    iconBgColor,
                  )}
                >
                  <FeatureIcon className={cn("w-6 h-6", iconColor)} />
                </div>

                {/* Content */}
                <h3 className="text-lg font-semibold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-400">{feature.description}</p>
              </div>
            );
          })}
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto mb-12">
          <div className="text-center p-4 rounded-xl bg-white/5 border border-white/10">
            <p className="text-2xl font-bold text-[#1fb5b9]">15hrs</p>
            <p className="text-xs text-gray-400">Saved weekly</p>
          </div>
          <div className="text-center p-4 rounded-xl bg-white/5 border border-white/10">
            <p className="text-2xl font-bold text-[#f5c518]">$208</p>
            <p className="text-xs text-gray-400">Monthly savings</p>
          </div>
          <div className="text-center p-4 rounded-xl bg-white/5 border border-white/10">
            <p className="text-2xl font-bold text-white">30%</p>
            <p className="text-xs text-gray-400">More clients</p>
          </div>
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/signup" className="relative group">
            <div
              className="relative overflow-hidden px-8 py-4 rounded-full leading-none flex items-center transition transform group-hover:-translate-y-1 active:translate-y-0 active:scale-95"
              style={{
                background:
                  "linear-gradient(180deg, #ff85c8 0%, #E92C92 30%, #c41e78 70%, #ff69b4 100%)",
                boxShadow:
                  "inset 0 2px 4px rgba(255,255,255,0.6), inset 0 -2px 4px rgba(0,0,0,0.2), 0 10px 40px rgba(233,44,146,0.5), 0 2px 8px rgba(0,0,0,0.3)",
                border: "1px solid rgba(255,255,255,0.3)",
              }}
            >
              <span
                className="relative z-10 font-bold tracking-wide text-base"
                style={{
                  backgroundImage:
                    "linear-gradient(to bottom, #ffffff 0%, #ffffff 40%, #ffd6eb 70%, #ffb8dc 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  filter: "drop-shadow(0px 1px 2px rgba(0,0,0,0.3))",
                }}
              >
                Start for Free
              </span>
              <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/40 via-white/10 to-transparent rounded-t-full pointer-events-none" />
              <div className="absolute top-0 -left-[100%] w-[60%] h-full bg-gradient-to-r from-transparent via-white/50 to-transparent skew-x-12 group-hover:left-[200%] transition-all duration-1000 ease-out"></div>
            </div>
          </Link>

          <Link
            to="/use-cases/solopreneurs"
            className="inline-flex items-center gap-2 px-6 py-3 text-white hover:text-white/80 transition-colors font-medium border border-white/30 rounded-full hover:bg-white/10"
          >
            <span>See How It Works</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default SolopreneursSection;
