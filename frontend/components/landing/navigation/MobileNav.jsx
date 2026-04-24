import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import {
  ChevronDown,
  DollarSign,
  Send,
  Brain,
  Award,
  Users,
  GraduationCap,
  HelpCircle,
  ArrowRight,
  Shield,
  Briefcase,
  LayoutDashboard,
  CreditCard,
  LogOut,
  Layout,
} from "lucide-react";

/**
 * Product organized by 3 Spaces (mobile version) - B2C Ecommerce CRM
 */
const PRODUCT_CATEGORIES = [
  {
    title: "Customers",
    icon: Users,
    items: [
      { name: "Customers", href: "/features/contacts" },
      { name: "Segments", href: "/features/contacts" },
      { name: "Analytics", href: "/features/analytics" },
    ],
  },
  {
    title: "Marketing",
    icon: Send,
    items: [
      { name: "Forms", href: "/features/forms" },
      { name: "Email Marketing", href: "/features/email" },
      { name: "Workflows", href: "/features/workflows" },
      { name: "Funnels", href: "/features/funnels" },
      { name: "Reports", href: "/features/reports" },
    ],
  },
  {
    title: "Intelligence",
    icon: Brain,
    items: [
      { name: "Boards", href: "/features/boards", badge: "NEW" },
      { name: "MyWork", href: "/features/tasks" },
      { name: "Connect Your AI", href: "/features/ai-overview" },
      {
        name: "Self-Host",
        href: "/features/self-host",
        badge: "FREE",
      },
      { name: "Open API", href: "/features/integrations" },
      { name: "Security", href: "/features/security" },
    ],
  },
];

/**
 * Use Cases for mobile menu (targeting: Ecommerce founders, DTC brands)
 */
const USE_CASES = [
  {
    name: "Ecommerce Stores",
    href: "/use-cases/ecommerce",
    icon: Users,
  },
  { name: "DTC Brands", href: "/use-cases/dtc", icon: Shield },
  { name: "New Founders", href: "/use-cases/new-founders", icon: Briefcase },
];

/**
 * Partner items for mobile menu
 */
const PARTNER_ITEMS = [
  { name: "Affiliate Program", href: "/affiliate-program", icon: DollarSign },
  { name: "Ambassador Program", href: "/ambassador", icon: Award },
  { name: "Community", href: "/community", icon: Users },
  { name: "Academy", href: "/academy", icon: GraduationCap },
  { name: "Help Center", href: "/help", icon: HelpCircle },
];

/**
 * Accordion section component
 */
const AccordionSection = ({ title, icon: Icon, items, onItemClick }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-800/50 last:border-b-0">
      <button
        className="flex items-center justify-between w-full py-4 text-left"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-3">
          {Icon && <Icon className="w-5 h-5 text-gray-400" />}
          <span className="text-base font-medium text-white">{title}</span>
        </div>
        <ChevronDown
          className={cn(
            "w-5 h-5 text-gray-400 transition-transform duration-200",
            isOpen && "rotate-180",
          )}
        />
      </button>

      {/* PERFORMANCE: Using CSS Grid for collapse animation instead of height */}
      <motion.div
        initial={false}
        animate={{
          gridTemplateRows: isOpen ? "1fr" : "0fr",
          opacity: isOpen ? 1 : 0,
        }}
        transition={{ duration: 0.2 }}
        className="grid"
      >
        <div className="overflow-hidden">
          <div className="pb-4 pl-8 space-y-1">
            {items.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className="flex items-center gap-2 py-2 text-gray-400 hover:text-white transition-colors"
                onClick={onItemClick}
              >
                <span>{item.name}</span>
                {item.badge && (
                  <span
                    className={cn(
                      "px-1.5 py-0.5 text-[10px] font-bold rounded uppercase",
                      item.badge === "NEW" && "bg-green-500/20 text-green-400",
                      item.badge === "SOON" && "bg-blue-500/20 text-blue-400",
                      item.badge === "PRO" && "bg-yellow-500/20 text-yellow-400",
                      item.badge === "MVP" && "bg-[#f2ff00]/20 text-[#f2ff00]",
                      item.badge === "FREE" && "bg-teal-500/20 text-teal-400",
                    )}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

/**
 * MobileNav - Mobile navigation drawer
 */
const MobileNav = ({ isOpen, onClose, affiliateRef }) => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState(null);

  // Auth state for detecting logged-in users
  const { user, loading: authLoading, signOut } = useAuth();

  const handleGetStarted = () => {
    onClose();
    if (affiliateRef) {
      navigate(`/signup?ref=${affiliateRef}`);
    } else {
      navigate("/signup");
    }
  };

  const handleSignIn = () => {
    onClose();
    navigate("/signin");
  };

  const handleLinkClick = () => {
    onClose();
  };

  const handleGoToDashboard = () => {
    onClose();
    navigate("/app/home");
  };

  const handleGoToBilling = () => {
    onClose();
    navigate("/app/settings/billing");
  };

  const handleLogout = async () => {
    onClose();
    await signOut();
    navigate("/");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className={cn(
              "fixed top-0 right-0 bottom-0 w-full max-w-sm z-50 lg:hidden",
              "bg-gradient-to-br from-[#1E1B24] via-[#0F0510] to-[#0A030B]",
              "border-l border-[#0F0510]/50",
              "shadow-2xl",
              "overflow-y-auto",
            )}
          >
            {/* Header */}
            <div className="sticky top-0 bg-inherit border-b border-gray-800/50 px-6 py-4">
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-white">Menu</span>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-white/5 transition-colors"
                >
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="px-6 py-4">
              {/* Product Section */}
              <div className="mb-6">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                  Product
                </p>
                {PRODUCT_CATEGORIES.map((category) => (
                  <AccordionSection
                    key={category.title}
                    title={category.title}
                    icon={category.icon}
                    items={category.items}
                    onItemClick={handleLinkClick}
                  />
                ))}
              </div>

              {/* Use Cases Section */}
              <div className="mb-6">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                  Use Cases
                </p>
                {USE_CASES.map((item) => {
                  const ItemIcon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      to={item.href}
                      className="flex items-center gap-3 py-3 border-b border-gray-800/50 last:border-b-0"
                      onClick={handleLinkClick}
                    >
                      <ItemIcon className="w-5 h-5 text-gray-400" />
                      <span className="text-base font-medium text-white">
                        {item.name}
                      </span>
                    </Link>
                  );
                })}
              </div>

              {/* Partner Section */}
              <div className="mb-6">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                  Partner
                </p>
                {PARTNER_ITEMS.map((item) => {
                  const ItemIcon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      to={item.href}
                      className="flex items-center gap-3 py-3 border-b border-gray-800/50 last:border-b-0"
                      onClick={handleLinkClick}
                    >
                      <ItemIcon className="w-5 h-5 text-gray-400" />
                      <span className="text-base font-medium text-white">
                        {item.name}
                      </span>
                    </Link>
                  );
                })}
              </div>

              {/* Other Links */}
              <div className="mb-6">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                  Company
                </p>
                <div className="space-y-1">
                  {[
                    { name: "Pricing", href: "/pricing" },
                    { name: "About", href: "/about" },
                    { name: "Contact", href: "/contact" },
                  ].map((link) => (
                    <Link
                      key={link.href}
                      to={link.href}
                      className="block py-3 text-base font-medium text-white border-b border-gray-800/50 last:border-b-0"
                      onClick={handleLinkClick}
                    >
                      {link.name}
                    </Link>
                  ))}
                </div>
              </div>

              {/* CTA Buttons - Auth Aware */}
              <div className="space-y-3 pt-4 border-t border-[#0F0510]/50">
                {!authLoading && (
                  <>
                    {user ? (
                      // AUTHENTICATED: Show Dashboard + Billing + Logout
                      <>
                        <Button
                          className={cn(
                            "w-full bg-gradient-to-br from-[#E92C92] to-[#C81E78]",
                            "hover:from-[#C81E78] hover:to-[#E92C92]",
                            "text-white font-medium",
                            "shadow-[0_0_25px_rgba(233,44,146,0.5)]",
                            "hover:shadow-[0_0_35px_rgba(233,44,146,0.7)]",
                            "border border-[#F472B6]/20 rounded-full",
                          )}
                          onClick={handleGoToDashboard}
                        >
                          <LayoutDashboard className="w-4 h-4 mr-2" />
                          Go to Dashboard
                        </Button>
                        <Button
                          className="w-full border border-white/20 bg-white/5 text-white hover:bg-white/10 hover:border-white/30 backdrop-blur-sm transition-all duration-200 font-medium"
                          onClick={handleGoToBilling}
                        >
                          <CreditCard className="w-4 h-4 mr-2" />
                          Billing & Subscription
                        </Button>
                        <Button
                          variant="ghost"
                          className="w-full text-red-400 hover:text-red-300 hover:bg-red-500/10"
                          onClick={handleLogout}
                        >
                          <LogOut className="w-4 h-4 mr-2" />
                          Sign Out
                        </Button>
                      </>
                    ) : (
                      // NOT AUTHENTICATED: Show Get Started + Sign In
                      <>
                        <Button
                          className={cn(
                            "w-full bg-gradient-to-br from-[#E92C92] to-[#C81E78]",
                            "hover:from-[#C81E78] hover:to-[#E92C92]",
                            "text-white font-medium",
                            "shadow-[0_0_25px_rgba(233,44,146,0.5)]",
                            "hover:shadow-[0_0_35px_rgba(233,44,146,0.7)]",
                            "border border-[#F472B6]/20 rounded-full",
                          )}
                          onClick={handleGetStarted}
                        >
                          {affiliateRef
                            ? "Try 30 days FREE"
                            : "Get Started Free"}
                        </Button>
                        <Button
                          className="w-full border border-white/20 bg-white/5 text-white hover:bg-white/10 hover:border-white/30 backdrop-blur-sm transition-all duration-200 font-medium"
                          onClick={handleSignIn}
                        >
                          Sign In
                        </Button>
                      </>
                    )}
                  </>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MobileNav;
