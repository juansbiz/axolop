import { cn } from "@/lib/utils";
import { TestimonialCardCompact } from "../ui/TestimonialCard";

/**
 * WallOfLoveSection - Masonry grid of short testimonials
 */
const WallOfLoveSection = ({ className }) => {
  // Hardcoded English testimonials - B2C Ecommerce focused
  const WALL_OF_LOVE_ITEMS = [
    {
      id: 1,
      name: "Alex Turner",
      title: "Store Owner",
      quote:
        "Replaced Klaviyo and saved $600/month. The email builder is incredible.",
    },
    {
      id: 2,
      name: "Jessica Lee",
      title: "DTC Founder",
      quote: "Setup took 10 minutes. We were running email campaigns the same day.",
    },
    {
      id: 3,
      name: "Mark Johnson",
      title: "Ecom Founder",
      quote: "Best decision for my store. Own my data forever.",
    },
    {
      id: 4,
      name: "Rachel Green",
      title: "Brand Owner",
      quote: "Finally unified customer data from Shopify in one place.",
    },
    {
      id: 5,
      name: "Chris Martinez",
      title: "Shopify Seller",
      quote:
        "Saved $1,500/month vs Klaviyo + HubSpot. Self-hosted is the way.",
    },
    {
      id: 6,
      name: "Amanda White",
      title: "Growth Lead",
      quote:
        "The automation workflows for ecommerce are incredibly powerful.",
    },
    {
      id: 7,
      name: "Tom Baker",
      title: "Brand Founder",
      quote: "Product launches got 3x more orders with the email sequences.",
    },
    {
      id: 8,
      name: "Nina Patel",
      title: "Store Founder",
      quote: "Replaced 5 tools with one. My stack is finally simple.",
    },
    {
      id: 9,
      name: "Daniel Wright",
      title: "Tech Founder",
      quote: "Finally a CRM with a modern tech stack. The API is a dream.",
    },
    {
      id: 10,
      name: "Sophie Chen",
      title: "DTC CMO",
      quote:
        "Form builder rivals Typeform. Email automation rivals Klaviyo.",
    },
    {
      id: 11,
      name: "Ryan Cooper",
      title: "Ecom Owner",
      quote: "Our team uses it daily. Setup was incredibly fast.",
    },
    {
      id: 12,
      name: "Laura Kim",
      title: "Brand Manager",
      quote:
        "Customer segments work perfectly with our WooCommerce store.",
    },
  ];

  // Split into columns for masonry effect
  const columns = [
    WALL_OF_LOVE_ITEMS.filter((_, i) => i % 3 === 0),
    WALL_OF_LOVE_ITEMS.filter((_, i) => i % 3 === 1),
    WALL_OF_LOVE_ITEMS.filter((_, i) => i % 3 === 2),
  ];

  return (
    <section
      className={cn("relative py-20 md:py-28 overflow-hidden", className)}
      style={{ background: "#0F0510" }}
    >
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            The Axolop Effect
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto">
            Real results from real ecommerce founders using Axolop
          </p>
        </div>

        {/* Masonry grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {columns.map((column, colIndex) => (
            <div key={colIndex} className="space-y-4">
              {column.map((item) => (
                <div key={item.id}>
                  <TestimonialCardCompact
                    name={item.name}
                    title={item.title}
                    quote={item.quote}
                    avatar={item.avatar}
                  />
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Load more / See all */}
        <div className="text-center mt-12">
          <button>
            {/* Metallic Button Body */}
            <div
              className="relative overflow-hidden px-6 py-3 rounded-full inline-flex items-center"
              style={{
                background:
                  "linear-gradient(180deg, #f2ff00 0%, #f2ff00 30%, #f2ff00 70%, #f2ff00 100%)",
                boxShadow:
                  "inset 0 2px 4px rgba(255,255,255,0.6), inset 0 -2px 4px rgba(0,0,0,0.2), 0 2px 8px rgba(0,0,0,0.3)",
                border: "1px solid rgba(255,255,255,0.3)",
              }}
            >
              {/* Chrome Text */}
              <span
                className="relative z-10 font-black tracking-wide text-base"
                style={{
                  backgroundImage:
                    "linear-gradient(to bottom, #ffffff 0%, #ffffff 40%, #ffd6eb 70%, #ffb8dc 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  filter: "drop-shadow(0px 1px 2px rgba(0,0,0,0.3))",
                }}
              >
                See More Reviews
              </span>

              {/* Top metallic shine band */}
              <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/40 via-white/10 to-transparent rounded-t-full pointer-events-none"></div>
            </div>
          </button>
        </div>
      </div>
    </section>
  );
};

export default WallOfLoveSection;
