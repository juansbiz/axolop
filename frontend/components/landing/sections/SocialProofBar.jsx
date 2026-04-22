import { cn } from "@/lib/utils";

const LOGO_PLACEHOLDERS = [
  { name: "Shopify", initials: "S" },
  { name: "WooCommerce", initials: "W" },
  { name: "BigCommerce", initials: "B" },
  { name: "Squarespace", initials: "S" },
  { name: "Wix", initials: "W" },
  { name: "Ecwid", initials: "E" },
];

const SocialProofBar = ({ className }) => {
  return (
    <section
      className={cn(
        "py-4 px-4 sm:px-6 lg:px-8 bg-[#0F0510] -mt-4",
        className
      )}
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
            Join 6,000+ ecommerce brands who use Axolop
          </p>
        </div>
        
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16">
          {LOGO_PLACEHOLDERS.map((logo) => (
            <div
              key={logo.name}
              className="flex items-center gap-3 text-gray-500 hover:text-gray-300 transition-colors"
            >
              <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                <span className="text-sm font-bold">{logo.initials}</span>
              </div>
              <span className="text-sm font-medium hidden sm:inline">
                {logo.name}
              </span>
            </div>
          ))}
        </div>
        
        <div className="mt-8 flex items-center justify-center gap-4 text-center">
          <div className="flex -space-x-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="w-8 h-8 rounded-full bg-gradient-to-br from-[#E92C92] to-[#C81E78] border-2 border-[#0F0510] flex items-center justify-center text-xs font-bold text-white"
              >
                {String.fromCharCode(64 + i)}
              </div>
            ))}
          </div>
          <p className="text-sm text-gray-400">
            <span className="text-white font-semibold">5.0/5</span> rating from verified users
          </p>
        </div>
      </div>
    </section>
  );
};

export default SocialProofBar;
