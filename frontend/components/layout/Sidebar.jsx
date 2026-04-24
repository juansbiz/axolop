import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, Plus, Store } from "lucide-react";

const MOCK_BRANDS = [
  { id: 1, name: "My Store", slug: "my-store" },
];

export default function Sidebar({ isSidebarCollapsed, onMouseEnter, onMouseLeave }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isBrandOpen, setIsBrandOpen] = useState(false);
  const currentBrand = MOCK_BRANDS[0];

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
          flex flex-col shadow-2xl z-50
          ${isSidebarCollapsed ? "w-16" : "w-64"}
          ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
        style={{
          background: "linear-gradient(180deg, #0a0a0a 0%, #1a1a1a 30%, #101010 50%, #1a1a1a 70%, #0a0a0a 100%)",
        }}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        {/* Header - Logo */}
        <div className="h-16 flex items-center px-4">
          <Link to="/" className="flex items-center gap-2">
            <img
              src="/axolop-logo.webp"
              alt="Axolop"
              className="h-8 w-8 object-contain"
            />
            {!isSidebarCollapsed && (
              <span className="text-white font-bold text-lg">Axolop</span>
            )}
          </Link>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto py-4 px-3">
          <div className="text-center py-8">
            <p className="text-gray-400 text-sm">
              {isSidebarCollapsed ? "..." : "Coming Soon"}
            </p>
          </div>
        </div>

        {/* Brand Selector */}
        <div className="border-t border-gray-800 p-2">
          <div className="relative">
            <button
              onClick={() => setIsBrandOpen(!isBrandOpen)}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              <div className="w-8 h-8 rounded-lg bg-yellow-500 flex items-center justify-center">
                <Store className="h-4 w-4 text-white" />
              </div>
              {!isSidebarCollapsed && (
                <>
                  <span className="flex-1 text-left text-white text-sm font-medium truncate">
                    {currentBrand?.name || "Select Brand"}
                  </span>
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                </>
              )}
            </button>

            {/* Brand Dropdown */}
            {isBrandOpen && !isSidebarCollapsed && (
              <div className="absolute bottom-full left-0 right-0 mb-1 bg-gray-900 border border-gray-700 rounded-lg shadow-xl overflow-hidden">
                {MOCK_BRANDS.map((brand) => (
                  <button
                    key={brand.id}
                    className="w-full flex items-center gap-2 px-3 py-2 hover:bg-white/10 transition-colors text-left"
                  >
                    <Store className="h-4 w-4 text-gray-400" />
                    <span className="text-white text-sm">{brand.name}</span>
                  </button>
                ))}
                <button className="w-full flex items-center gap-2 px-3 py-2 hover:bg-white/10 transition-colors text-left border-t border-gray-700">
                  <Plus className="h-4 w-4 text-gray-400" />
                  <span className="text-yellow-500 text-sm">Add Brand</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 p-3">
          <Link
            to="/login"
            className="block text-center text-sm text-gray-400 hover:text-white py-2"
          >
            Sign In
          </Link>
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
