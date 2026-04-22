import { lazy, Suspense } from "react";
import { NavigationBar } from "@/components/landing/navigation";
import FeatureShowcaseSection from "@/components/landing/sections/FeatureShowcaseSection";
import PricingComparisonSection from "@/components/landing/sections/PricingComparisonSection";
import WallOfLoveSection from "@/components/landing/sections/WallOfLoveSection";
import FooterSection from "@/components/landing/sections/FooterSection";
import UseCaseSection from "@/components/landing/sections/UseCaseSection";
import SpacesSection from "@/components/landing/sections/SpacesSection";
import SolopreneursSection from "@/components/landing/sections/SolopreneursSection";
import FOSSSection from "@/components/landing/sections/FOSSSection";
import FreeTrialTimeline from "@/components/landing/sections/FreeTrialTimeline";
import VideoTestimonialsGrid from "@/components/landing/sections/VideoTestimonialsGrid";
import SEO from "@/components/SEO";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

function HeroSection() {
  const handleGetStarted = () => {
    window.location.href = "/signup";
  };

  return (
    <section
      className="pt-28 pb-4 px-4 sm:px-6 lg:px-8 relative"
      style={{ overflowX: "clip" }}
    >
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center" style={{ overflow: "hidden" }}>
          <h1
            className="font-black mb-6 leading-[1.05] tracking-tighter"
            style={{
              fontSize: "clamp(40px, 8vw, 90px)",
              overflow: "hidden",
            }}
          >
            <span
              style={{
                backgroundImage:
                  "linear-gradient(to bottom, #ffffff 20%, #cbd5e1 60%, #64748b 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                filter:
                  "drop-shadow(0px 0px 10px rgba(255, 255, 255, 0.3)) drop-shadow(0px 2px 4px rgba(0,0,0,0.5))",
              }}
            >
              Launch your Ecom brand
              <br />
              with an Open Source CRM
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-gray-400 mb-8 max-w-4xl mx-auto font-normal">
            The backbone of your store. Replace Klaviyo, Omnisend, and Mailchimp 
            with one flat-price platform. Own your data forever, save money every month, 
            and scale without limits. Start free.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-4">
            <button onClick={handleGetStarted} className="relative group">
              <div
                className="relative overflow-hidden px-10 py-5 rounded-full leading-none flex items-center transition transform group-hover:-translate-y-1 active:translate-y-0 active:scale-95"
                style={{
                  background:
                    "linear-gradient(180deg, #ff85c8 0%, #E92C92 30%, #c41e78 70%, #ff69b4 100%)",
                  boxShadow:
                    "inset 0 2px 4px rgba(255,255,255,0.6), inset 0 -2px 4px rgba(0,0,0,0.2), 0 10px 40px rgba(233,44,146,0.5), 0 2px 8px rgba(0,0,0,0.3)",
                  border: "1px solid rgba(255,255,255,0.3)",
                }}
              >
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
                  Start your brand for free
                </span>
                <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/40 via-white/10 to-transparent rounded-t-full pointer-events-none"></div>
                <div className="absolute top-0 -left-[100%] w-[60%] h-full bg-gradient-to-r from-transparent via-white/50 to-transparent skew-x-12 group-hover:left-[200%] transition-all duration-1000 ease-out"></div>
              </div>
            </button>

            <button className="group relative">
              <div className="absolute -inset-1 bg-white/20 rounded-full blur-lg opacity-0 group-hover:opacity-50 transition duration-500"></div>
              <div
                className="relative overflow-hidden px-10 py-5 rounded-full leading-none flex items-center gap-3 transition transform group-hover:-translate-y-1 active:scale-95"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(255,255,255,0.95) 0%, rgba(240,240,245,0.9) 50%, rgba(220,220,230,0.85) 100%)",
                  boxShadow:
                    "inset 0 2px 4px rgba(255,255,255,1), inset 0 -2px 4px rgba(0,0,0,0.05), 0 8px 32px rgba(0,0,0,0.2), 0 2px 8px rgba(0,0,0,0.1)",
                  border: "1px solid rgba(255,255,255,0.8)",
                }}
              >
                <svg
                  className="w-5 h-5 relative z-10"
                  viewBox="0 0 24 24"
                  style={{ fill: "url(#playGradient)" }}
                >
                  <defs>
                    <linearGradient
                      id="playGradient"
                      x1="0%"
                      y1="0%"
                      x2="0%"
                      y2="100%"
                    >
                      <stop offset="0%" stopColor="#333" />
                      <stop offset="50%" stopColor="#111" />
                      <stop offset="100%" stopColor="#444" />
                    </linearGradient>
                  </defs>
                  <path d="M8 5v14l11-7z" />
                </svg>
                <span
                  className="font-black tracking-wide text-lg relative z-10"
                  style={{
                    backgroundImage:
                      "linear-gradient(to bottom, #1a1a1a 0%, #333 50%, #555 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  See how it works
                </span>
                <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/60 to-transparent rounded-t-full pointer-events-none"></div>
                <div className="absolute top-0 -left-[100%] w-[60%] h-full bg-gradient-to-r from-transparent via-white/70 to-transparent skew-x-12 group-hover:left-[200%] transition-all duration-1000 ease-out"></div>
              </div>
            </button>
          </div>

          <div className="flex items-center justify-center gap-3 text-xs font-bold text-gray-500 uppercase tracking-widest opacity-80">
            <span>Free forever</span>
            <span className="text-[#E92C92]">•</span>
            <span>Self-host or cloud</span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Landing() {
  return (
    <>
      <SEO 
        title="Axolop - The All-in-One Platform for Modern Brands"
        description="Grow your brand with Axolop. The all-in-one platform for e-commerce, marketing, and customer management."
      />
      <div className="min-h-screen bg-[#0F0510]">
        <NavigationBar />
        
        <main>
          <HeroSection />
          
          {/* App Demo Video/Screenshot */}
          <section className="relative w-full pt-8 pb-10 px-4">
            <div className="relative w-full max-w-6xl mx-auto">
              <div className="absolute -inset-4 bg-gradient-to-r from-[#0F0510]/20 via-[#0F0510]/20 to-[#0F0510]/20 rounded-3xl blur-2xl"></div>
              <div className="absolute -inset-[2px] bg-gradient-to-br from-pink-400/30 via-purple-400/20 to-cyan-400/30 rounded-2xl opacity-60"></div>
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-gray-800/50 bg-[#0a0f1a]">
                <div className="relative w-full" style={{ aspectRatio: "16/9" }}>
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#1a1a2e] to-[#0F0510]">
                    <div className="text-center">
                      <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-[#E92C92]/20 flex items-center justify-center">
                        <svg className="w-10 h-10 text-[#E92C92]" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z"/>
                        </svg>
                      </div>
                      <p className="text-gray-400 text-sm">App Demo Video Placeholder</p>
                      <p className="text-gray-600 text-xs mt-1">Replace with actual demo screenshot/video</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
          
          <FeatureShowcaseSection />
          <SpacesSection />
          <UseCaseSection />
          <SolopreneursSection />
          <FOSSSection />
          <FreeTrialTimeline />
          <PricingComparisonSection />
          
          <Suspense fallback={<div className="h-96 bg-gray-900" />}>
            <VideoTestimonialsGrid />
          </Suspense>
          
          <Suspense fallback={<div className="h-64 bg-gray-900" />}>
            <WallOfLoveSection />
          </Suspense>
          
          <FooterSection />
        </main>
      </div>
    </>
  );
}
