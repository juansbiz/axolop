import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, Settings, User, ChevronDown, Store, LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const MOCK_BRANDS = [
  { id: 1, name: "My Store", slug: "my-store" },
];

export default function Header() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isBrandOpen, setIsBrandOpen] = useState(false);
  const currentBrand = MOCK_BRANDS[0];

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <header className="h-14 bg-white border-b border-gray-200 flex items-center px-4 gap-4 z-40">
      {/* Logo */}
      <Link to="/" className="flex items-center gap-2">
        <img
          src="/axolop-logo.webp"
          alt="Axolop"
          className="h-7 w-7 object-contain"
        />
        <span className="text-gray-900 font-bold text-lg">Axolop</span>
      </Link>

      {/* Search */}
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            className="w-full h-9 pl-9 pr-4 rounded-lg border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:bg-white transition-colors"
          />
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-2">
        {/* Brand Selector in Header */}
        <div className="relative">
          <button
            onClick={() => setIsBrandOpen(!isBrandOpen)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="w-6 h-6 rounded bg-yellow-500 flex items-center justify-center">
              <Store className="h-3.5 w-3.5 text-yellow-500" />
            </div>
            <span className="text-sm font-medium text-gray-700">{currentBrand?.name}</span>
            <ChevronDown className="h-4 w-4 text-gray-400" />
          </button>

          {isBrandOpen && (
            <div className="absolute top-full right-0 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
              {MOCK_BRANDS.map((brand) => (
                <button
                  key={brand.id}
                  className="w-full flex items-center gap-2 px-3 py-2 hover:bg-gray-50 transition-colors text-left"
                >
                  <Store className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-700">{brand.name}</span>
                </button>
              ))}
              <button className="w-full flex items-center gap-2 px-3 py-2 hover:bg-gray-50 transition-colors text-left border-t border-gray-100">
                <span className="text-sm text-yellow-500">+ Add Brand</span>
              </button>
            </div>
          )}
        </div>

        {/* Settings */}
        <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
          <Settings className="h-5 w-5 text-gray-500" />
        </button>

        {/* User Menu */}
        {user ? (
          <div className="relative">
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-yellow-500 flex items-center justify-center">
                <User className="h-4 w-4 text-white" />
              </div>
            </button>

            {isUserMenuOpen && (
              <div className="absolute top-full right-0 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
                <div className="px-3 py-2 border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-900">{user.email}</p>
                </div>
                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center gap-2 px-3 py-2 hover:bg-gray-50 transition-colors text-left"
                >
                  <LogOut className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-700">Sign Out</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link
            to="/login"
            className="px-4 py-2 bg-yellow-500 text-white text-sm font-medium rounded-lg hover:bg-yellow-500 transition-colors"
          >
            Sign In
          </Link>
        )}
      </div>
    </header>
  );
}
