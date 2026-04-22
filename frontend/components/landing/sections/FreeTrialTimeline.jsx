import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';
import {
  Unlock,
  Bell,
  Star,
  Check,
} from 'lucide-react';

/**
 * Icon mapping for timeline steps
 */
const iconMap = {
  'teal': Unlock,
  'amber': Bell,
  'red': Star,
};

const colorStyles = {
  teal: {
    bg: 'bg-[#14787b]',
    ring: 'ring-[#14787b]/30',
    text: 'text-[#1fb5b9]',
  },
  amber: {
    bg: 'bg-amber-500',
    ring: 'ring-amber-500/30',
    text: 'text-amber-400',
  },
  red: {
    bg: 'bg-[#E92C92]',
    ring: 'ring-[#E92C92]/30',
    text: 'text-white',
  },
};

/**
 * FreeTrialTimeline - Visual timeline showing trial journey
 */
const FreeTrialTimeline = ({ className }) => {
  // Hardcoded English timeline steps
  const TIMELINE_STEPS = [
    {
      day: "Today",
      title: "Sign up in 2 minutes",
      description: "Start for free. Access the software, 20+ templates, and all features instantly.",
      color: "teal",
      icon: Unlock,
    },
    {
      day: "Day 7",
      title: "We send you a reminder",
      description: "Check your progress and explore features you might have missed. Stay in control.",
      color: "amber",
      icon: Bell,
    },
    {
      day: "Day 14",
      title: "Your subscription starts",
      description: "Continue with full access, or cancel anytime. No strings attached.",
      color: "red",
      icon: Star,
    }
  ];

  const trustIndicators = [
    "Start for free",
    "Free forever option",
    "Cancel anytime"
  ];

  return (
    <section
      className={cn(
        'relative py-20 md:py-28 overflow-hidden',
        className
      )}
      style={{ background: '#0F0510' }}
    >
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            Your Free Trial, Made Easy
          </h2>
          <p className="text-lg text-gray-400 max-w-xl mx-auto">
            Try Axolop risk-free for 14 days. Get full access to all features, including 20+ templates. No commitment, cancel anytime.
          </p>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-[#14787b] via-amber-500 to-[#E92C92] hidden md:block" />

          {/* Timeline steps */}
          <div className="space-y-12 md:space-y-0">
            {TIMELINE_STEPS.map((step, index) => {
              const StepIcon = step.icon;
              const styles = colorStyles[step.color];
              const isLeft = index % 2 === 0;

              return (
                <div
                  key={step.day}
                  className={cn(
                    'relative md:flex md:items-center md:justify-center',
                    'md:min-h-[140px]'
                  )}
                >
                  {/* Connector dot */}
                  <div
                    className={cn(
                      'hidden md:flex absolute left-1/2 -translate-x-1/2',
                      'w-12 h-12 rounded-full items-center justify-center',
                      styles.bg,
                      'ring-4',
                      styles.ring,
                      'z-10'
                    )}
                  >
                    <StepIcon className="w-6 h-6 text-white" />
                  </div>

                  {/* Content card */}
                  <div
                    className={cn(
                      'md:w-[calc(50%-40px)]',
                      isLeft ? 'md:mr-auto md:pr-8 md:text-right' : 'md:ml-auto md:pl-8 md:text-left'
                    )}
                  >
                    <div
                      className={cn(
                        'p-6 rounded-2xl',
                        'backdrop-blur-sm bg-white/5',
                        'border border-gray-800/50',
                        'hover:border-gray-700/50 transition-colors'
                      )}
                    >
                      {/* Mobile icon */}
                      <div
                        className={cn(
                          'md:hidden w-10 h-10 rounded-xl flex items-center justify-center mb-4',
                          styles.bg
                        )}
                      >
                        <StepIcon className="w-5 h-5 text-white" />
                      </div>

                      {/* Day badge */}
                      <span
                        className={cn(
                          'inline-block px-3 py-1 rounded-full text-xs font-semibold mb-3',
                          'bg-white/5',
                          styles.text
                        )}
                      >
                        {step.day}
                      </span>

                      {/* Title */}
                      <h3 className="text-xl font-bold text-white mb-2">
                        {step.title}
                      </h3>

                      {/* Description */}
                      <p className="text-gray-400 text-sm">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <Link to="/signup">
            {/* Metallic Button Body */}
            <div
              className="relative overflow-hidden px-8 py-4 rounded-full inline-flex items-center"
              style={{
                background: 'linear-gradient(180deg, #ff85c8 0%, #E92C92 30%, #c41e78 70%, #ff69b4 100%)',
                boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.6), inset 0 -2px 4px rgba(0,0,0,0.2), 0 2px 8px rgba(0,0,0,0.3)',
                border: '1px solid rgba(255,255,255,0.3)',
              }}
            >
              {/* Chrome Text */}
              <span
                className="relative z-10 font-black tracking-wide text-lg"
                style={{
                  backgroundImage: 'linear-gradient(to bottom, #ffffff 0%, #ffffff 40%, #ffd6eb 70%, #ffb8dc 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  filter: 'drop-shadow(0px 1px 2px rgba(0,0,0,0.3))',
                }}
              >
                Start my 14-day free trial
              </span>

              {/* Top metallic shine band */}
              <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/40 via-white/10 to-transparent rounded-t-full pointer-events-none"></div>
            </div>
          </Link>

          {/* Trust indicators */}
          <div className="flex flex-wrap items-center justify-center gap-6 mt-6 text-sm text-gray-400">
            {trustIndicators.map((indicator, index) => (
              <div key={index} className="flex items-center gap-2">
                <Check className="w-4 h-4 text-[#1fb5b9]" />
                <span>{indicator}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FreeTrialTimeline;
