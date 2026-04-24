import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useRightClick } from "@/hooks/useRightClick";
import { useLongPress } from "@/hooks/useLongPress";
import { getGenericSelectorMenu } from "@/config/contextMenuConfigs/selectorMenus";
import {
  DollarSign,
  Send,
  Headset,
  Brain,
  Workflow,
  ChevronDown,
  Users,
  BarChart3,
  PieChart,
  Mail,
  FileText,
  Zap,
  Ticket,
  BookOpen,
  Globe,
  Sparkles,
  GitBranch,
  ListOrdered,
  Bell,
  ArrowRight,
  Shield,
  Briefcase,
  Funnel,
  Calendar,
  Layout,
  Network,
  BarChart as BarChartIcon,
  Link as LinkIcon,
  Smartphone,
  MessageSquare,
} from "lucide-react";

/**
 * Product organized by Spaces (how the app actually works)
 * Each Space replaces multiple expensive tools
 */
const PRODUCT_CATEGORIES = {
  customers: {
    title: "Customers Space",
    subtitle: "Complete CRM for Ecommerce",
    icon: Users,
    color: "red",
    items: [
      {
        name: "Customers",
        description: "Customer database and segments",
        href: "/features/contacts",
        icon: Users,
      },
      {
        name: "Audience Segments",
        description: "Segment by behavior and purchase history",
        href: "/features/contacts",
        icon: Users,
      },
      {
        name: "Analytics",
        description: "Revenue and customer insights",
        href: "/features/analytics",
        icon: BarChart3,
      },
    ],
  },
  marketing: {
    title: "Marketing Space",
    subtitle: "Email Marketing & Automation",
    icon: Send,
    color: "teal",
    items: [
      {
        name: "Forms",
        description: "Typeform alternative",
        href: "/features/forms",
        icon: FileText,
      },
      {
        name: "Email Marketing",
        description: "Klaviyo alternative",
        href: "/features/email",
        icon: Mail,
      },
      {
        name: "Workflows",
        description: "Visual automation",
        href: "/features/workflows",
        icon: Workflow,
      },
      {
        name: "Funnels",
        description: "Mobile-first funnel builder",
        href: "/features/funnels",
        icon: Funnel,
      },
      {
        name: "Reports",
        description: "Campaign analytics",
        href: "/features/reports",
        icon: BarChartIcon,
      },
      {
        name: "Sequences",
        description: "Email sequences",
        href: "/features/sequences",
        icon: ListOrdered,
      },
      {
        name: "Triggers",
        description: "Event-based actions",
        href: "/features/triggers",
        icon: Bell,
      },
    ],
  },
  intelligence: {
    title: "Intelligence Space",
    subtitle: "AI & Task Management",
    icon: Brain,
    color: "yellow",
    items: [
      {
        name: "Boards",
        description: "Monday.com alternative",
        href: "/features/boards",
        icon: Layout,
        badge: "NEW",
      },
      {
        name: "MyWork",
        description: "Personal task management",
        href: "/features/tasks",
        icon: ListOrdered,
      },
      {
        name: "Connect Your AI",
        description: "Use ChatGPT, Claude, or any LLM",
        href: "/features/ai-overview",
        icon: Sparkles,
      },
      {
        name: "Self-Host",
        description: "Docker, Railway, Koyeb deployment",
        href: "/features/self-host",
        icon: Network,
        badge: "FREE",
      },
      {
        name: "Open API",
        description: "Build whatever you need",
        href: "/features/integrations",
        icon: LinkIcon,
      },
      {
        name: "Mobile App",
        description: "Full-featured mobile access",
        href: "/features/mobile",
        icon: Smartphone,
        badge: "SOON",
      },
      {
        name: "Security",
        description: "Enterprise-grade security",
        href: "/features/security",
        icon: Shield,
      },
    ],
  },
};

const colorStyles = {
  red: {
    iconBg: "bg-[#f2ff00]/20",
    iconText: "text-gray-300",
    hoverBg: "hover:bg-[#f2ff00]/10",
    gradientFrom: "from-[#f2ff00]",
    gradientTo: "to-[#0F0510]",
  },
  teal: {
    iconBg: "bg-[#14787b]/20",
    iconText: "text-[#1fb5b9]",
    hoverBg: "hover:bg-[#14787b]/10",
    gradientFrom: "from-[#14787b]",
    gradientTo: "to-[#1fb5b9]",
  },
  yellow: {
    iconBg: "bg-yellow-500/20",
    iconText: "text-yellow-400",
    hoverBg: "hover:bg-yellow-500/10",
    gradientFrom: "from-yellow-500",
    gradientTo: "to-pink-500",
  },
};

/**
 * ProductDropdown - Full-width mega menu (Perspective.co style)
 */
const ProductDropdown = ({
  className,
  enableContextMenu = true,
  onRefresh,
  onManage,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  // Context menu integration
  const contextMenuItems = enableContextMenu
    ? getGenericSelectorMenu({ type: "productDropdown", onRefresh, onManage })
    : null;

  const handleContextMenu = useRightClick(contextMenuItems);
  const handleLongPress = useLongPress(contextMenuItems);

  // 3 Spaces for B2C Ecommerce CRM
  const allSpaces = [
    { ...PRODUCT_CATEGORIES.customers, key: "customers" },
    { ...PRODUCT_CATEGORIES.marketing, key: "marketing" },
    { ...PRODUCT_CATEGORIES.intelligence, key: "intelligence" },
  ];

  return (
    <div
      className={cn("relative", className)}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      {/* Trigger */}
      <button
        {...handleContextMenu}
        {...handleLongPress}
        className={cn(
          "flex items-center gap-1 px-3 py-2 rounded-lg",
          "text-gray-300 hover:text-white",
          "transition-colors duration-200",
          isOpen && "text-white",
        )}
      >
        <span className="text-base font-medium">Product</span>
        <ChevronDown
          className={cn(
            "w-4 h-4 transition-transform duration-200",
            isOpen && "rotate-180",
          )}
        />
      </button>

      {/* Full-width Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            style={{
              background: "#0F0510",
            }}
            className={cn(
              "fixed top-16 left-0 right-0",
              "w-full",
              "backdrop-blur-xl",
              "shadow-[0_20px_50px_-12px_rgba(0,0,0,0.8)]",
              "z-50",
            )}
          >
            <div className="max-w-7xl mx-auto px-8 py-8">
              <div className="grid grid-cols-12 gap-6">
                {/* 3 Spaces - Compact layout */}
                {allSpaces.map((space) => {
                  const SpaceIcon = space.icon;
                  const styles = colorStyles[space.color];

                  return (
                    <div key={space.key} className="col-span-2">
                      {/* Space Header */}
                      <div className="mb-4">
                        <div
                          className={cn(
                            "inline-flex items-center gap-2 px-3 py-1.5 rounded-lg",
                            styles.iconBg,
                          )}
                        >
                          <SpaceIcon
                            className={cn("w-4 h-4", styles.iconText)}
                          />
                          <span
                            className={cn(
                              "text-xs font-bold uppercase tracking-wide",
                              styles.iconText,
                            )}
                          >
                            {space.title}
                          </span>
                        </div>
                        <p className="text-xs text-gray-400 mt-2">
                          {space.subtitle}
                        </p>
                      </div>

                      {/* Features List */}
                      <div className="space-y-1">
                        {space.items.map((item) => {
                          const ItemIcon = item.icon;
                          return (
                            <Link
                              key={item.href}
                              to={item.href}
                              className="flex items-start gap-2 p-2 -mx-2 rounded-lg hover:bg-white/5 transition-colors group"
                            >
                              <ItemIcon className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5 group-hover:text-white transition-colors" />
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <p className="text-sm font-medium text-white truncate">
                                    {item.name}
                                  </p>
                                  {item.badge && (
                                    <span
                                      className={cn(
                                        "px-1.5 py-0.5 text-[10px] font-bold rounded uppercase",
                                        item.badge === "NEW" &&
                                          "bg-green-500/20 text-green-400",
                                        item.badge === "SOON" &&
                                          "bg-blue-500/20 text-blue-400",
                                        item.badge === "PRO" &&
                                          "bg-yellow-500/20 text-yellow-500",
                                      )}
                                    >
                                      {item.badge}
                                    </span>
                                  )}
                                </div>
                                <p className="text-xs text-gray-400 truncate">
                                  {item.description}
                                </p>
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}

                {/* Use Cases Column (targeting: Ecommerce Stores, DTC Brands, New Founders) */}
                <div className="col-span-4">
                  <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
                    Use Cases
                  </h3>
                  <div className="space-y-3">
                    {[
                      {
                        name: "Ecommerce Stores",
                        desc: "Replace Klaviyo & expensive CRMs",
                        href: "/use-cases/ecommerce",
                        icon: Users,
                      },
                      {
                        name: "DTC Brands",
                        desc: "Own your data, flat pricing",
                        href: "/use-cases/dtc",
                        icon: Shield,
                      },
                      {
                        name: "New Founders",
                        desc: "Start free, scale forever",
                        href: "/use-cases/new-founders",
                        icon: Briefcase,
                      },
                    ].map((useCase) => {
                      const Icon = useCase.icon;
                      return (
                        <Link
                          key={useCase.href}
                          to={useCase.href}
                          className="flex items-start gap-3 p-2 -mx-2 rounded-lg hover:bg-white/5 transition-colors group"
                        >
                          <div className="w-8 h-8 rounded-lg bg-gray-800 flex items-center justify-center flex-shrink-0 group-hover:bg-gray-700 transition-colors">
                            <Icon className="w-4 h-4 text-gray-400" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-white">
                              {useCase.name}
                            </p>
                            <p className="text-xs text-gray-400">
                              {useCase.desc}
                            </p>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProductDropdown;
