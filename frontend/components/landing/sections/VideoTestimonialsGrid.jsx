import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { TestimonialCard } from "../ui/TestimonialCard";

/**
 * VideoTestimonialsGrid - Grid of customer testimonials with video and text
 */
const VideoTestimonialsGrid = ({ className }) => {
  // Hardcoded English video testimonials
  const VIDEO_TESTIMONIALS = [
    {
      id: 1,
      name: "Sarah Chen",
      title: "Founder",
      company: "Ecom Brand",
      quote:
        "Axolop helped us escape Klaviyo's pricing. We saved over $500/month and own our customer data forever.",
      thumbnail: null,
      platform: "youtube",
      avatar: null,
    },
    {
      id: 2,
      name: "Michael Rodriguez",
      title: "Store Owner",
      company: "DTC Brand",
      quote:
        "Finally a CRM that doesn't charge more as you grow. Self-hosted and free forever. Game changer.",
      thumbnail: null,
      platform: "youtube",
      avatar: null,
    },
    {
      id: 3,
      name: "Emily Watson",
      title: "Founder",
      company: "New Ecom Store",
      quote:
        "Started for free, scaled to $10K/mo, still paying $0. This is exactly what new founders need.",
      thumbnail: null,
      platform: "youtube",
      avatar: null,
    },
  ];

  const TEXT_TESTIMONIALS = [
    {
      id: 4,
      name: "James Park",
      title: "Store Owner",
      company: "Park Ecom",
      quote:
        "Switched from Klaviyo and saved $600/month. Never looking back.",
      rating: 5,
      avatar: null,
    },
    {
      id: 5,
      name: "Lisa Thompson",
      title: "DTC Founder",
      company: "Elevate Brand",
      quote:
        "Self-hosted for free. Connect my own AI. This is what CRM should be.",
      rating: 5,
      avatar: null,
    },
    {
      id: 6,
      name: "David Kim",
      title: "New Founder",
      company: "KimCo Store",
      quote:
        "Started for free, now at $15K/mo. Axolop grows with me. Best decision.",
      rating: 5,
      avatar: null,
    },
  ];
  return (
    <section
      className={cn("relative py-20 md:py-28 overflow-hidden", className)}
      style={{ background: "#0F0510" }}
    >
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            Hear From Our Customers
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Ecommerce founders share their experience breaking free from vendor lock-in
            with Axolop
          </p>
        </div>

        {/* Video testimonials row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {VIDEO_TESTIMONIALS.map((testimonial) => (
            <div key={testimonial.id}>
              <TestimonialCard
                name={testimonial.name}
                title={testimonial.title}
                company={testimonial.company}
                quote={testimonial.quote}
                videoId={testimonial.videoId}
                thumbnail={testimonial.thumbnail}
                platform={testimonial.platform}
                avatar={testimonial.avatar}
              />
            </div>
          ))}
        </div>

        {/* Text testimonials row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TEXT_TESTIMONIALS.map((testimonial) => (
            <div key={testimonial.id}>
              <TestimonialCard
                name={testimonial.name}
                title={testimonial.title}
                company={testimonial.company}
                quote={testimonial.quote}
                rating={testimonial.rating}
                avatar={testimonial.avatar}
              />
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <a
            href="/about"
            className="inline-flex items-center gap-2 text-[#1fb5b9] hover:text-white transition-colors font-medium"
          >
            <span>Discover Wall of Love</span>
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
};

export default VideoTestimonialsGrid;
