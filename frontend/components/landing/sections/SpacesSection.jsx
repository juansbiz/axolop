import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { 
  ShoppingCart, 
  Mail, 
  Megaphone, 
  ArrowRight,
  TrendingUp,
  BarChart3,
  Zap,
  ExternalLink
} from "lucide-react";
import SpaceScreenshot from "./SpaceScreenshot";

const SpacesSection = ({ className }) => {
  const spaces = [
    {
      id: "sales",
      badge: "Sales",
      title: "Sales",
      description: "Track orders, manage products, and sync with your store. All your sales data in one place.",
      icon: ShoppingCart,
      color: "#f2ff00",
      features: [
        "Product catalog sync",
        "Order tracking",
        "Customer profiles",
        "Ad attribution tracking"
      ],
      replaces: "Triple Whale, Wiser, Bold",
      savings: "$97-497/mo",
      href: "/features/contacts"
    },
    {
      id: "marketing",
      badge: "Marketing", 
      title: "Marketing",
      description: "Email marketing, SMS, and automation that rivals Klaviyo at a fraction of the cost.",
      icon: Mail,
      color: "#14787B",
      features: [
        "Drag-drop email builder",
        "Marketing automation",
        "SMS campaigns",
        "List segmentation"
      ],
      replaces: "Klaviyo, Omnisend, Sendinblue",
      savings: "$60-700/mo",
      href: "/features/email"
    },
    {
      id: "ad",
      badge: "Ad",
      title: "Ad",
      description: "AI-powered ad creation and tracking. See what's working and optimize your spend.",
      icon: Megaphone,
      color: "#F59E0B",
      features: [
        "AI UGC ad generation",
        "Ad performance tracking",
        "Product-to-ad linking",
        "Revenue attribution"
      ],
      replaces: "Hyros, Triple Whale",
      savings: "$197-997/mo",
      href: "/features/boards"
    }
  ];

  return (
    <section
      className={cn(
        "py-20 md:py-28 overflow-hidden",
        className
      )}
      style={{ background: "#0F0510" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-16">
          <p className="text-[#f2ff00] font-semibold mb-3 tracking-wide uppercase text-sm">
            Three Powerful Spaces
          </p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            Everything You Need to Run Your Store
          </h2>
          <p className="text-lg text-gray-400 max-w-3xl mx-auto">
            Sales, Marketing, and Ad management — all in one free, open-source platform. 
            Replace 10+ tools and save thousands per month.
          </p>
        </div>

        {/* Spaces - Like Plane's 4 Products */}
        <div className="space-y-20">
          {spaces.map((space, index) => {
            const Icon = space.icon;
            const isEven = index % 2 === 1;
            
            return (
              <div 
                key={space.id}
                className={cn(
                  "grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center",
                  isEven && "lg:flex-row-reverse"
                )}
              >
                {/* Text Content */}
                <div className={cn(isEven && "lg:order-2")}>
                  <div 
                    className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-4"
                    style={{ 
                      backgroundColor: `${space.color}20`, 
                      color: space.color 
                    }}
                  >
                    {space.badge}
                  </div>
                  
                  <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
                    {space.title}
                  </h3>
                  
                  <p className="text-gray-400 mb-6">
                    {space.description}
                  </p>

                  {/* Features */}
                  <ul className="space-y-3 mb-8">
                    {space.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-3 text-gray-300">
                        <div 
                          className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                          style={{ backgroundColor: `${space.color}20` }}
                        >
                          <svg className="w-3 h-3" style={{ color: space.color }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        {feature}
                      </li>
                    ))}
                  </ul>

                  {/* Savings Badge */}
                  <div className="flex items-center gap-4">
                    <div className="px-4 py-2 rounded-lg bg-white/5 border border-white/10">
                      <p className="text-xs text-gray-400 mb-0.5">Replaces</p>
                      <p className="text-sm font-medium text-gray-300">{space.replaces}</p>
                    </div>
                    <div 
                      className="px-4 py-2 rounded-lg border"
                      style={{ 
                        backgroundColor: `${space.color}10`,
                        borderColor: `${space.color}30`
                      }}
                    >
                      <p className="text-xs text-gray-400 mb-0.5">Save</p>
                      <p className="text-sm font-bold" style={{ color: space.color }}>
                        {space.savings}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Screenshot */}
                <div className={cn(isEven && "lg:order-1")}>
                  <SpaceScreenshot space={space.id} />
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <Link to="/signup">
            <div
              className="relative overflow-hidden px-8 py-4 rounded-full inline-flex items-center gap-2"
              style={{
                background: "linear-gradient(180deg, #f2ff00 0%, #f2ff00 30%, #f2ff00 70%, #f2ff00 100%)",
                boxShadow: "inset 0 2px 4px rgba(255,255,255,0.6), inset 0 -2px 4px rgba(0,0,0,0.2), 0 2px 8px rgba(0,0,0,0.3)",
                border: "1px solid rgba(255,255,255,0.3)",
              }}
            >
              <span
                className="relative z-10 font-black tracking-wide text-lg text-white"
              >
                Start for free
              </span>
              <ArrowRight className="w-5 h-5 text-white relative z-10" />
              <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/40 via-white/10 to-transparent rounded-t-full pointer-events-none"></div>
            </div>
          </Link>
          <p className="mt-4 text-sm text-gray-500">
            Self-host free or cloud from $39/mo
          </p>
        </div>
      </div>
    </section>
  );
};

export default SpacesSection;
