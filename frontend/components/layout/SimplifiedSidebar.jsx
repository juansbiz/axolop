import { useState, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  Home, 
  ChevronDown, 
  Plus, 
  Building2,
  Settings,
  Users,
  BarChart3,
  Mail,
  FileText,
  Workflow,
  Target,
  CheckSquare,
  Lock,
  DollarSign,
  TrendingUp,
  Heart
} from "lucide-react";
import { useBrand } from "@/hooks/useBrand";

const MOCK_BRANDS = [
  { id: 1, name: "My Store", slug: "my-store", logo_url: null },
];

export default function SimplifiedSidebar({ isSidebarCollapsed, onMouseEnter, onMouseLeave }) {
  const location = useLocation();
  const { brand, brands, setBrand } = useBrand();
  const [isBrandOpen, setIsBrandOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSpace, setActiveSpace] = useState('retention');
  const [showPlusMenu, setShowPlusMenu] = useState(false);

  const currentBrand = brand || MOCK_BRANDS[0];
  const brandList = brands?.length > 0 ? brands : MOCK_BRANDS;
  const brandCount = brandList.length;

  const spaces = [
    { id: 'acquisition', icon: DollarSign, label: 'Acquisition' },
    { id: 'retention', icon: Mail, label: 'Retention' },
    { id: 'projects', icon: CheckSquare, label: 'Projects' },
  ];

  const handleSpaceSwitch = (spaceId) => {
    setActiveSpace(spaceId);
  };

  const navigationItems = {
    retention: [
      { name: 'Dashboard', href: "/app/dashboard", icon: Home, primary: true },
      { name: 'Customers', href: "/app/customers", icon: Users, primary: true },
      { name: 'Orders', href: "/app/orders", icon: FileText, primary: true },
    ],
    acquisition: [
      { name: 'Analytics', href: "/app/analytics", icon: BarChart3, primary: true },
      { name: 'Campaigns', href: "/app/campaigns", icon: Mail, primary: true },
    ],
    tools: [
      { name: 'Automations', href: "#", icon: Workflow, locked: true },
      { name: 'Forms', href: "#", icon: FileText, locked: true },
      { name: 'SMS', href: "#", icon: Target, locked: true },
    ],
  };

  const spaceLabels = {
    retention: 'Main',
    acquisition: 'Growth',
    tools: 'Tools',
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-lg"
      >
        <span className="text-gray-700">{isMobileMenuOpen ? "✕" : "☰"}</span>
      </button>

      {/* Sidebar */}
      <div
        className={`
          fixed lg:relative h-screen backdrop-blur-xl
          flex flex-col shadow-2xl z-[60]
          ${isSidebarCollapsed ? "w-10" : "w-64"}
          ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
        style={{
          background: "linear-gradient(180deg, #0a0a0a 0%, #1a1a1a 30%, #101010 50%, #1a1a1a 70%, #0a0a0a 100%)",
          transition: "width 400ms cubic-bezier(0.4, 0, 0.2, 1)",
          willChange: "width",
          transform: "translateZ(0)",
          backfaceVisibility: "hidden",
        }}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        {/* Header - Logo */}
        <div className="h-16 bg-transparent flex items-center px-4 rounded-br-2xl -mt-[14px] flex-shrink-0 overflow-visible">
          <Link to="/" className="flex items-center gap-2 whitespace-nowrap">
            <img
              src="/axolop-logo.webp"
              alt="Axolop"
              className="h-8 w-8 object-contain flex-shrink-0"
            />
            <span className="text-white font-bold text-lg">Axolop</span>
          </Link>
        </div>

        {/* Content wrapper - fades out when collapsed */}
        <div
          className="flex-1 flex flex-col overflow-hidden"
          style={{
            opacity: isSidebarCollapsed ? 0 : 1,
            pointerEvents: isSidebarCollapsed ? "none" : "auto",
            transition: "opacity 400ms cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        >
          {/* Navigation */}
          <div className="flex-1 overflow-y-auto py-4 px-3">
            {Object.entries(navigationItems).map(([space, items]) => (
              <div key={space} className="mb-6">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-3">
                  {spaceLabels[space]}
                </h3>
                <div className="space-y-1">
                  {items.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.href;
                    
                    if (item.locked) {
                      return (
                        <div
                          key={item.name}
                          className="relative group flex items-center gap-3 px-3 py-2 rounded-lg cursor-not-allowed text-gray-500 opacity-60"
                        >
                          <Icon className="h-5 w-5 flex-shrink-0" />
                          <span className="text-sm font-medium">{item.name}</span>
                          <Lock className="ml-auto h-3.5 w-3.5" />
                        </div>
                      );
                    }

                    return (
                      <Link
                        key={item.name}
                        to={item.href}
                        className={`
                          flex items-center gap-3 px-3 py-2 rounded-lg transition-colors
                          ${isActive 
                            ? "bg-yellow-500/20 text-yellow-400" 
                            : "text-gray-400 hover:text-white hover:bg-white/10"
                          }
                        `}
                      >
                        <Icon className="h-5 w-5 flex-shrink-0" />
                        <span className="text-sm font-medium">{item.name}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Brand Selector at Bottom */}
          <div className="border-t border-white/10 px-2 py-1.5 -ml-1">
            {/* Label */}
            <div className="text-xs text-gray-400 uppercase tracking-wide mb-1 px-2 flex items-center justify-between">
              <span>Brands</span>
              <span className="text-xs font-bold text-gray-300">
                {brandCount}
              </span>
            </div>
            
            <div className="relative">
              <div className="flex items-center gap-2">
                {/* Brand Button */}
                <button
                  onClick={() => setIsBrandOpen(!isBrandOpen)}
                  className="flex items-center justify-between cursor-pointer rounded-lg transition-all duration-300 ease-out overflow-hidden bg-gradient-to-r from-[#1a1a1a]/80 via-[#101010]/80 to-[#1a1a1a]/80 hover:from-[#101010]/90 hover:via-[#101010]/90 hover:to-[#101010]/90 hover:border-[#101010]/50 flex-1 shadow-lg hover:shadow-xl hover:shadow-[#101010]/20 backdrop-blur-sm"
                >
                  <div className="flex items-center flex-1 px-2 py-1.5">
                    {currentBrand?.logo_url ? (
                      <img
                        src={currentBrand.logo_url}
                        alt={currentBrand.name}
                        className="h-5 w-5 rounded mr-2 object-cover ring-1 ring-white/20"
                      />
                    ) : (
                      <div className="p-1 rounded mr-2 bg-gradient-to-br from-[#101010] to-[#101010] shadow-inner">
                        <Building2 className="h-4 w-4 text-white" />
                      </div>
                    )}
                    <span className="text-xs font-bold text-white truncate">
                      {currentBrand?.name || "Select Brand"}
                    </span>
                    <ChevronDown className="h-3.5 w-3.5 ml-auto text-gray-200" />
                  </div>
                </button>

                {/* Add Brand Button */}
                <button
                  onClick={() => setShowPlusMenu(!showPlusMenu)}
                  className="p-2 rounded-lg transition-all duration-300 flex items-center justify-center bg-gradient-to-br from-[#101010] to-[#101010] hover:from-[#101010] hover:to-[#101010] text-white shadow-lg hover:shadow-xl hover:shadow-[#101010]/30"
                >
                  <Plus className="h-4 w-4 stroke-[2.5]" />
                </button>
              </div>

              {/* Add Brand Dropdown */}
              {showPlusMenu && (
                <div className="absolute bottom-full left-0 right-0 mb-2 w-48 rounded-lg border border-gray-200 bg-white shadow-2xl overflow-hidden z-50">
                  <button
                    onClick={() => {
                      setShowPlusMenu(false);
                      setIsBrandOpen(true);
                    }}
                    className="w-full px-4 py-2.5 text-left text-sm text-gray-900 hover:bg-gray-100 transition-all duration-200 flex items-center gap-3"
                  >
                    <div className="p-1.5 rounded-lg bg-gradient-to-br from-[#101010] to-[#101010] shadow-sm">
                      <Plus className="h-4 w-4 text-white" />
                    </div>
                    <span className="font-medium">Add New Brand</span>
                  </button>
                </div>
              )}

              {/* Brand Dropdown */}
              {isBrandOpen && (
                <div className="absolute bottom-full left-0 right-0 mb-2 w-full max-h-48 overflow-y-auto bg-white border border-gray-200 rounded-lg shadow-xl overflow-hidden z-40">
                  {brandList.map((b) => (
                    <button
                      key={b.id}
                      onClick={() => {
                        setBrand(b);
                        setIsBrandOpen(false);
                      }}
                      className={`
                        w-full flex items-center gap-2 px-3 py-2 hover:bg-gray-50 transition-colors text-left
                        ${b.id === currentBrand?.id ? "bg-yellow-50" : ""}
                      `}
                    >
                      {b.logo_url ? (
                        <img
                          src={b.logo_url}
                          alt={b.name}
                          className="h-5 w-5 rounded object-cover"
                        />
                      ) : (
                        <div className="h-5 w-5 rounded bg-gray-100 flex items-center justify-center">
                          <Building2 className="h-3 w-3 text-gray-400" />
                        </div>
                      )}
                      <span className="text-sm text-gray-900 truncate">{b.name}</span>
                    </button>
                  ))}
                  <button className="w-full flex items-center gap-2 px-3 py-2 hover:bg-gray-50 transition-colors text-left border-t border-gray-100">
                    <Plus className="h-4 w-4 text-[#f2ff00]" />
                    <span className="text-sm text-[#f2ff00] font-medium">Add Brand</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Spaces Switcher */}
          <div className="border-t border-white/10 px-4 py-3">
            <div className="flex items-center justify-between">
              {spaces.map((space) => {
                const Icon = space.icon;
                const isActive = activeSpace === space.id;
                return (
                  <button
                    key={space.id}
                    onClick={() => handleSpaceSwitch(space.id)}
                    className="relative p-2 rounded-lg transition-colors duration-150"
                    title={space.label}
                  >
                    <div
                      className="transition-all duration-150"
                      style={{
                        transform: isActive ? 'scale(1.05)' : 'scale(1)',
                        opacity: isActive ? 1 : 0.4,
                      }}
                    >
                      <Icon
                        className="h-4 w-4"
                        style={{
                          color: isActive ? '#ffffff' : '#6B7280',
                        }}
                      />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
}
