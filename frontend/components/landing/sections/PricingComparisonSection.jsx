import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { Check, X, ArrowRight } from "lucide-react";

const comparison = [
  {
    feature: "Self-host option",
    axolop: true,
    others: [false, false, false],
  },
  {
    feature: "Open API",
    axolop: true,
    others: ["Limited", "Limited", "Expensive"],
  },
  {
    feature: "Connect your own AI",
    axolop: true,
    others: [false, false, false],
  },
  {
    feature: "Own your data",
    axolop: true,
    others: [false, false, false],
  },
  {
    feature: "Flat pricing",
    axolop: true,
    others: [false, false, false],
  },
  {
    feature: "No per-seat pricing",
    axolop: true,
    others: [true, true, false],
  },
  {
    feature: "Free forever option",
    axolop: true,
    others: [false, "Limited", false],
  },
];

const PricingComparisonSection = () => {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-[#0F0510] relative overflow-hidden">
      <div className="max-w-5xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Compare the options.
            <br />
            <span className="text-gray-400">Pick the winner.</span>
          </h2>
          <p className="text-lg text-gray-400 max-w-xl mx-auto">
            See why thousands of founders switched from expensive tools to Axolop.
          </p>
        </div>

        {/* Comparison Cards */}
        <div className="grid md:grid-cols-4 gap-4 mb-12">
          {/* Header Row */}
          <div className="p-4">
            <div className="text-sm font-medium text-gray-500 uppercase tracking-wide">Feature</div>
          </div>
          <div className="p-4 text-center">
            <div className="text-[#f2ff00] font-bold text-lg">Axolop</div>
            <div className="text-gray-500 text-xs">Free - $79/mo</div>
          </div>
          <div className="p-4 text-center">
            <div className="text-white font-semibold">Klaviyo</div>
            <div className="text-gray-500 text-xs">$60-700+/mo</div>
          </div>
          <div className="p-4 text-center">
            <div className="text-white font-semibold">Shopify</div>
            <div className="text-gray-500 text-xs">$29+/mo</div>
          </div>

          {/* Data Rows */}
          {comparison.map((row, i) => (
            <div key={i} className={cn(
              "contents",
              i % 2 === 0 ? "bg-white/[0.02]" : ""
            )}>
              <div className="p-4 flex items-center">
                <span className="text-gray-300 text-sm">{row.feature}</span>
              </div>
              <div className="p-4 flex items-center justify-center">
                {row.axolop ? (
                  <div className="w-6 h-6 rounded-full bg-[#f2ff00]/20 flex items-center justify-center">
                    <Check className="h-4 w-4 text-[#f2ff00]" />
                  </div>
                ) : (
                  <X className="h-4 w-4 text-gray-600" />
                )}
              </div>
              <div className="p-4 flex items-center justify-center">
                {typeof row.others[0] === "boolean" ? (
                  row.others[0] ? (
                    <Check className="h-4 w-4 text-gray-500" />
                  ) : (
                    <X className="h-4 w-4 text-gray-600" />
                  )
                ) : (
                  <span className="text-xs text-gray-500">{row.others[0]}</span>
                )}
              </div>
              <div className="p-4 flex items-center justify-center">
                {typeof row.others[2] === "boolean" ? (
                  row.others[2] ? (
                    <Check className="h-4 w-4 text-gray-500" />
                  ) : (
                    <X className="h-4 w-4 text-gray-600" />
                  )
                ) : (
                  <span className="text-xs text-gray-500">{row.others[2]}</span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* CTA - Metallic button style */}
        <div className="text-center">
          <Link to="/signup">
            <div
              className="relative overflow-hidden px-10 py-5 rounded-full inline-flex items-center gap-3 cursor-pointer"
              style={{
                background: "linear-gradient(180deg, #f2ff00 0%, #f2ff00 30%, #f2ff00 70%, #f2ff00 100%)",
                boxShadow: "inset 0 2px 4px rgba(255,255,255,0.6), inset 0 -2px 4px rgba(0,0,0,0.2), 0 4px 12px rgba(233,44,146,0.4)",
                border: "1px solid rgba(255,255,255,0.3)",
              }}
            >
              <span className="relative z-10 font-black tracking-wide text-lg text-white">
                Start for free
              </span>
              <ArrowRight className="w-5 h-5 text-white relative z-10" />
              <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/40 via-white/10 to-transparent rounded-t-full pointer-events-none"></div>
            </div>
          </Link>
          <p className="mt-4 text-sm text-gray-500">
            Join thousands who switched to open source
          </p>
        </div>
      </div>
    </section>
  );
};

export default PricingComparisonSection;
