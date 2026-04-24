import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { ArrowRight, Server, Database, Lock, Sparkles } from "lucide-react";

const FOSSSection = () => {
  const benefits = [
    {
      icon: Server,
      title: "Self-host anywhere",
      description: "Deploy on Docker, Railway, or your own server. Your infrastructure, your rules.",
    },
    {
      icon: Database,
      title: "Own your data",
      description: "Your customer data stays yours. Export anytime, no lock-in, ever.",
    },
    {
      icon: Lock,
      title: "No vendor lock-in",
      description: "Open source means you're never trapped. Leave anytime, take your data with you.",
    },
  ];

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-[#0F0510] relative overflow-hidden">
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section Header - Plane style */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
            Stay in control.
            <br />
            <span className="text-gray-400">And compliant.</span>
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Stop renting your CRM. Own your data, your AI, and your future.
          </p>
        </div>

        {/* Benefits - Clean columns like Plane */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {benefits.map((benefit, i) => (
            <div
              key={i}
              className="text-center"
            >
              <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mx-auto mb-4">
                <benefit.icon className="h-6 w-6 text-[#f2ff00]" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                {benefit.title}
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>

        {/* Cost Comparison - The Smart Choice */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <h3 className="text-xl font-semibold text-white mb-2">
              The smart choice for modern ecommerce
            </h3>
            <p className="text-gray-400 text-sm">
              Here's what you're currently paying vs. what Axolop costs.
            </p>
          </div>

          {/* Comparison Grid */}
          <div className="grid md:grid-cols-2 gap-px bg-white/10 rounded-2xl overflow-hidden">
            {/* Left: What You're Paying */}
            <div className="p-8 bg-[#0F0510]">
              <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-6">
                What you're paying now
              </h4>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Klaviyo</span>
                  <span className="text-white font-medium">$60-700/mo</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Triple Whale</span>
                  <span className="text-white font-medium">$97-497/mo</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Hyros</span>
                  <span className="text-white font-medium">$197-997/mo</span>
                </div>
                <div className="h-px bg-white/10 my-4" />
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Total</span>
                  <span className="text-white font-bold">$354-2,194/mo</span>
                </div>
              </div>
            </div>

            {/* Right: What Axolop Costs */}
            <div className="p-8 bg-[#0a0415]">
              <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-6">
                What Axolop costs
              </h4>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Self-host</span>
                  <span className="text-white font-medium">FREE</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Cloud</span>
                  <span className="text-white font-medium">$39-79/mo</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Per-seat</span>
                  <span className="text-white font-medium">$0</span>
                </div>
                <div className="h-px bg-white/10 my-4" />
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Total</span>
                  <span className="text-white font-bold">$0-79/mo</span>
                </div>
              </div>
            </div>
          </div>

          {/* Savings Highlight */}
          <div className="mt-6 text-center p-6 bg-white/5 rounded-2xl border border-white/5">
            <div className="text-3xl sm:text-4xl font-bold text-[#f2ff00] mb-2">
              Save $354-2,115/mo
            </div>
            <div className="text-gray-400">
              = $4,200-25,000/year
            </div>
          </div>

          {/* Future Proofing Note */}
          <div className="mt-6 flex items-center justify-center gap-2 text-gray-500">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm">
              Plus: Your data stays yours. Your AI stays yours. In the future, that'll matter.
            </span>
          </div>
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
            Free forever (self-host) or $39/mo cloud
          </p>
        </div>
      </div>
    </section>
  );
};

export default FOSSSection;
