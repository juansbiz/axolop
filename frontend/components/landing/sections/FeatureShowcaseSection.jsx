import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import {
  Mail,
  TrendingUp,
  LayoutGrid,
  ArrowRight,
  Sparkles,
  Users,
  Target,
  Workflow,
  Brain,
  Network,
  Server,
} from "lucide-react";

const colorStyles = {
  red: {
    gradient: "from-[#E92C92] to-[#5B1046]",
    iconBg: "bg-[#E92C92]/30",
    iconText: "text-gray-300",
    glow: "group-hover:shadow-[0_0_60px_rgba(233,44,146,0.3)]",
    border: "group-hover:border-[#E92C92]/40",
  },
  teal: {
    gradient: "from-[#E92C92] to-[#C81E78]",
    iconBg: "bg-[#E92C92]/30",
    iconText: "text-[#E92C92]",
    glow: "group-hover:shadow-[0_0_60px_rgba(233,44,146,0.3)]",
    border: "group-hover:border-[#E92C92]/40",
  },
  amber: {
    gradient: "from-amber-500 to-yellow-500",
    iconBg: "bg-amber-500/30",
    iconText: "text-amber-400",
    glow: "group-hover:shadow-[0_0_60px_rgba(245,166,35,0.3)]",
    border: "group-hover:border-amber-500/40",
  },
  blue: {
    gradient: "from-blue-500 to-cyan-500",
    iconBg: "bg-blue-500/30",
    iconText: "text-blue-400",
    glow: "group-hover:shadow-[0_0_60px_rgba(59,130,246,0.3)]",
    border: "group-hover:border-blue-500/40",
  },
  purple: {
    gradient: "from-purple-500 to-pink-500",
    iconBg: "bg-purple-500/30",
    iconText: "text-purple-400",
    glow: "group-hover:shadow-[0_0_60px_rgba(168,85,247,0.3)]",
    border: "group-hover:border-purple-500/40",
  },
};

/**
 * OptimizedFeatureCard - Individual Space card
 */
const OptimizedFeatureCard = ({ feature, FeatureIcon, styles }) => {
  return (
    <div>
      <Link
        to={feature.href}
        className={cn(
          "group block h-full p-8 rounded-3xl",
          "bg-white/5",
          "border border-gray-800/50",
          "transition-all duration-300",
          styles.glow,
          styles.border,
          "will-change-transform"
        )}
      >
        {/* Badge */}
        <div className="flex items-center gap-2 mb-4">
          <span
            className={cn(
              "px-3 py-1 rounded-full text-xs font-semibold",
              styles.iconBg,
              styles.iconText
            )}
          >
            {feature.badge}
          </span>
        </div>

        {/* Icon */}
        <div
          className={cn(
            "w-14 h-14 rounded-2xl flex items-center justify-center mb-6",
            styles.iconBg,
            "transition-transform duration-300"
          )}
        >
          <FeatureIcon className={cn("w-7 h-7", styles.iconText)} />
        </div>

        {/* Title & Subtitle */}
        <h3 className="text-2xl font-bold text-white mb-2">{feature.title}</h3>
        <p className="text-gray-400 mb-6 leading-relaxed text-sm">
          {feature.subtitle}
        </p>

        {/* Hero Feature Callout */}
        {feature.heroFeature && (
          <div
            className={cn(
              "p-4 rounded-xl mb-6 border",
              styles.iconBg,
              "border-gray-700/50"
            )}
          >
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className={cn("w-4 h-4", styles.iconText)} />
              <span className={cn("text-sm font-semibold", styles.iconText)}>
                {feature.heroFeature.title}
              </span>
            </div>
            <ul className="space-y-1.5">
              {feature.heroFeature.benefits.map((benefit, i) => (
                <li
                  key={i}
                  className="text-xs text-gray-400 flex items-start gap-2"
                >
                  <span className="text-gray-400 mt-0.5">•</span>
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Features list */}
        <ul className="space-y-3 mb-6">
          {feature.features.map((item, i) => (
            <li key={i} className="flex items-start gap-3">
              <div
                className={cn(
                  "w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5",
                  styles.iconBg
                )}
              >
                <svg
                  className={cn("w-3 h-3", styles.iconText)}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <span className="text-gray-300 text-sm">{item}</span>
            </li>
          ))}
        </ul>

        {/* Comparison Badge */}
        {feature.replaces && (
          <div className="mb-4 p-3 bg-gray-900/50 border border-gray-700/30 rounded-lg">
            <p className="text-xs text-gray-400 mb-1">Replaces</p>
            <p className="text-xs text-gray-300 mb-2">{feature.replaces}</p>
            <p className={cn("text-sm font-bold", styles.iconText)}>
              Save {feature.savings}
            </p>
          </div>
        )}

        {/* Learn more */}
        <div className="flex items-center gap-2 text-sm font-medium">
          <span
            className={cn(
              "bg-gradient-to-r bg-clip-text text-transparent",
              "px-0.5 py-0.5 inline-block",
              styles.gradient
            )}
            style={{
              WebkitBoxDecorationBreak: "clone",
              boxDecorationBreak: "clone",
            }}
          >
            Explore {feature.badge}
          </span>
          <ArrowRight
            className={cn(
              "w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-200",
              styles.iconText
            )}
          />
        </div>
      </Link>
    </div>
  );
};

/**
 * FeatureShowcaseSection - Feature cards section
 * Uses intersection observer for better scroll performance
 */
const FeatureShowcaseSection = ({ className }) => {
  // 3 Spaces that replace expensive tools - B2C Ecommerce CRM
  const FEATURES = [
    {
      id: "email-marketing",
      title: "Email Marketing That Saves You Money",
      subtitle:
        "Replace Klaviyo and Omnisend with one platform. Drag-drop builder, automation, and own your data.",
      icon: Mail,
      color: "red",
      heroFeature: {
        title: "Drag-Drop Email Builder",
        benefits: [
          "Beautiful templates for ecommerce",
          "Visual automation workflows",
          "HTML editor for developers",
          "Personalization & dynamic content",
        ],
      },
      features: [
        "Campaign management",
        "Email sequences & automation",
        "A/B testing & analytics",
        "List segmentation & tags",
      ],
      replaces: "Klaviyo ($60-700/mo), Omnisend ($60-300/mo)",
      savings: "Save $60-700/month",
      href: "/features/email",
    },
    {
      id: "customers-space",
      badge: "Customers",
      title: "Customer Database & Segments",
      subtitle:
        "Know your customers. Segment by behavior. Grow repeat purchases.",
      icon: Users,
      color: "teal",
      heroFeature: {
        title: "Customer Segments",
        benefits: [
          "Segment by purchase history",
          "Target by behavior",
          "Personalized campaigns",
          "Understand customer LTV",
        ],
      },
      features: [
        "Customer database with custom fields",
        "Audience segmentation",
        "Customer analytics",
        "Import from Shopify, WooCommerce",
      ],
      replaces: "HubSpot ($50-500/mo), Excel ($0)",
      savings: "Save $50-500/month",
      href: "/features/contacts",
    },
    {
      id: "marketing-space",
      badge: "Marketing",
      title: "Forms, Funnels & Automation",
      subtitle:
        "Capture customers, build pages, and automate your marketing without the expensive tools.",
      icon: Target,
      color: "amber",
      heroFeature: {
        title: "Mobile-First Funnels",
        benefits: [
          "Convert-focused templates",
          "A/B testing built-in",
          "Analytics dashboard",
          "Email marketing integration",
        ],
      },
      features: [
        "Forms with conditional logic",
        "Landing page builder",
        "Workflow automation",
        "Campaign analytics",
      ],
      replaces: "ClickFunnels ($100-300/mo), Typeform ($25-70/mo)",
      savings: "Save $100-300/month",
      href: "/features/funnels",
    },
    {
      id: "intelligence-space",
      badge: "Intelligence",
      title: "Boards, AI & Self-Host",
      subtitle:
        "Task management, connect your own AI, or self-host for total control.",
      icon: Brain,
      color: "purple",
      heroFeature: {
        title: "Connect Your Own AI",
        benefits: [
          "Use ChatGPT, Claude, or any LLM",
          "No vendor lock-in on AI",
          "Build your own workflows",
          "Full API access",
        ],
      },
      features: [
        "Kanban boards for tasks",
        "Self-host on Docker/Railway",
        "Open API for developers",
        "Data export anytime",
      ],
      replaces: "Monday.com ($50-150/mo), Notion ($10-50/mo)",
      savings: "Save $50-150/month",
      href: "/features/boards",
    },
  ];

  return (
    <section
      className={cn(
        "relative pt-16 pb-20 md:pt-20 md:pb-28 overflow-hidden",
        className
      )}
      style={{ background: "#0F0510" }}
    >
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-16">
          <p className="text-[#E92C92] font-semibold mb-3 tracking-wide uppercase text-sm">
            3 Powerful Spaces
          </p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            Three Areas That Replace 10+ Tools
          </h2>
          <p className="text-lg text-gray-400 max-w-3xl mx-auto">
            Customers, Marketing, and Intelligence—each Space is a complete platform that
            replaces multiple expensive tools. Save $1,967/month.
          </p>
        </div>

        {/* 3 Spaces grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((feature, index) => {
            const FeatureIcon = feature.icon;
            const styles = colorStyles[feature.color];

            return (
              <OptimizedFeatureCard
                key={feature.id}
                feature={feature}
                FeatureIcon={FeatureIcon}
                styles={styles}
                index={index}
              />
            );
          })}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <Link to="/signup">
            {/* Metallic Button Body */}
            <div
              className="relative overflow-hidden px-8 py-4 rounded-full inline-flex items-center gap-2"
              style={{
                background:
                  "linear-gradient(180deg, #ff85c8 0%, #E92C92 30%, #c41e78 70%, #ff69b4 100%)",
                boxShadow:
                  "inset 0 2px 4px rgba(255,255,255,0.6), inset 0 -2px 4px rgba(0,0,0,0.2), 0 2px 8px rgba(0,0,0,0.3)",
                border: "1px solid rgba(255,255,255,0.3)",
              }}
            >
              {/* Chrome Text */}
              <span
                className="relative z-10 font-black tracking-wide text-lg"
                style={{
                  backgroundImage:
                    "linear-gradient(to bottom, #ffffff 0%, #ffffff 40%, #ffd6eb 70%, #ffb8dc 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  filter: "drop-shadow(0px 1px 2px rgba(0,0,0,0.3))",
                }}
              >
                Experience New Age CRM
              </span>
              <ArrowRight
                className="w-5 h-5 relative z-10"
                style={{
                  color: "#ffffff",
                  filter: "drop-shadow(0px 1px 2px rgba(0,0,0,0.3))",
                }}
              />

              {/* Top metallic shine band */}
              <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/40 via-white/10 to-transparent rounded-t-full pointer-events-none"></div>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeatureShowcaseSection;
