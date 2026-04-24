import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { ShoppingCart, Users, Rocket, ArrowRight } from "lucide-react";

/**
 * Icon mapping for use cases
 */
const iconMap = {
  "ecommerce-stores": ShoppingCart,
  "dtc-brands": Users,
  "new-founders": Rocket,
};

const colorStyles = {
  red: {
    gradient: "from-[#f2ff00]/20 to-[#f2ff00]/10",
    border: "border-[#f2ff00]/30",
    iconBg: "bg-[#f2ff00]/30",
    iconText: "text-[#f2ff00]",
    badgeBg: "bg-[#f2ff00]/20",
    badgeText: "text-[#f2ff00]",
  },
  teal: {
    gradient: "from-[#14787b]/20 to-[#1fb5b9]/10",
    border: "border-[#14787b]/30",
    iconBg: "bg-[#14787b]/30",
    iconText: "text-[#1fb5b9]",
    badgeBg: "bg-[#14787b]/20",
    badgeText: "text-[#1fb5b9]",
  },
  amber: {
    gradient: "from-amber-500/20 to-yellow-500/10",
    border: "border-amber-500/30",
    iconBg: "bg-amber-500/30",
    iconText: "text-amber-400",
    badgeBg: "bg-amber-500/20",
    badgeText: "text-amber-400",
  },
};

/**
 * OptimizedUseCaseCard - Individual use case card with performance optimizations
 */
const OptimizedUseCaseCard = ({ useCase, UseCaseIcon, styles, labels }) => {
  return (
    <div
      className={cn(
        "group relative p-6 rounded-3xl",
        "backdrop-blur-sm",
        "bg-gradient-to-br",
        styles.gradient,
        "border",
        styles.border,
        "hover:border-opacity-60 transition-all duration-300",
      )}
    >
      {/* Icon & Industry */}
      <div className="flex items-center gap-3 mb-4">
        <div
          className={cn(
            "w-12 h-12 rounded-xl flex items-center justify-center",
            styles.iconBg,
          )}
        >
          <UseCaseIcon className={cn("w-6 h-6", styles.iconText)} />
        </div>
        <h3 className="text-lg font-semibold text-white">{useCase.industry}</h3>
      </div>

      {/* Challenge */}
      <div className="mb-4">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
          {labels.challenge}
        </p>
        <p className="text-gray-400 text-sm">{useCase.challenge}</p>
      </div>

      {/* Solution */}
      <div className="mb-4">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
          {labels.solution}
        </p>
        <p className="text-gray-300 text-sm">{useCase.solution}</p>
      </div>

      {/* Result */}
      <div className={cn("p-4 rounded-xl mb-4", styles.iconBg)}>
        <p className="text-2xl font-bold text-white mb-1">{useCase.result}</p>
        <p className="text-sm text-gray-400">{useCase.resultDetail}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2">
        {useCase.stats.map((stat, i) => (
          <div key={i} className="text-center">
            <p className={cn("text-lg font-bold", styles.iconText)}>
              {stat.value}
            </p>
            <p className="text-xs text-gray-400">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * UseCaseSection - Performance-optimized industry-specific use case demonstrations
 */
const UseCaseSection = ({ className }) => {
  // Hardcoded English use cases
  const USE_CASES = [
    {
      id: "ecommerce-stores",
      industry: "Ecommerce Stores",
      challenge:
        "Pay $60-700/month to Klaviyo/Omnisend but stuck with closed-source limitations",
      solution: "Free open-source CRM with total control over your data and AI",
      result: "Save $500+/month",
      resultDetail: "and own your customer data forever",
      color: "red",
      icon: ShoppingCart,
      stats: [
        {
          value: "$500+",
          label: "Monthly savings",
        },
        {
          value: "100%",
          label: "Data ownership",
        },
        {
          value: "Unlimited",
          label: "Scale",
        },
      ],
    },
    {
      id: "dtc-brands",
      industry: "DTC Brands",
      challenge:
        "Vendor lock-in from expensive CRMs that charge more as you grow",
      solution: "Self-hostable CRM that stays flat priced forever",
      result: "Flat pricing",
      resultDetail: "no matter how big you grow",
      color: "teal",
      icon: Users,
      stats: [
        {
          value: "$0-79",
          label: "Flat monthly fee",
        },
        {
          value: "Self-host",
          label: "Your server",
        },
        {
          value: "Open",
          label: "API access",
        },
      ],
    },
    {
      id: "new-founders",
      industry: "New Founders",
      challenge: "Starting an ecommerce brand and don't know which CRM to pick",
      solution:
        "Start free with Axolop. No monthly fees, own your data, scale forever.",
      result: "Start for free",
      resultDetail: "no strings attached",
      color: "amber",
      icon: Rocket,
      stats: [
        {
          value: "Free",
          label: "Forever",
        },
        {
          value: "Self-host",
          label: "Option",
        },
        {
          value: "Open",
          label: "API",
        },
      ],
    },
  ];

  const labels = { challenge: "Challenge", solution: "Solution" };

  return (
    <section
      className={cn(
        "relative py-20 md:py-28 overflow-hidden",
        "bg-[#0F0510]",
        className,
      )}
    >
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            Results in All Business-Critical Areas
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            See how agencies like yours are transforming their operations and
            boosting their bottom line with Axolop
          </p>
        </div>

        {/* Use cases grid with optimized animations */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {USE_CASES.map((useCase, index) => {
            const UseCaseIcon = useCase.icon;
            const styles = colorStyles[useCase.color];

            return (
              <OptimizedUseCaseCard
                key={useCase.id}
                useCase={useCase}
                UseCaseIcon={UseCaseIcon}
                styles={styles}
                labels={labels}
                index={index}
              />
            );
          })}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <Link
            to="/use-cases/marketing-agencies"
            className="inline-flex items-center gap-2 text-[#1fb5b9] hover:text-white transition-colors font-medium"
          >
            <span>See all use cases</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default UseCaseSection;
