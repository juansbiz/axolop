import { useState, useEffect, useCallback, useRef } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Search, Command, ChevronLeft, Settings, Building2 } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { useAuth } from "@/context/AuthContext";
import { useBrand } from "@/hooks/useBrand";
import SimplifiedSidebar from "./SimplifiedSidebar";
import BrandSelector from "./BrandSelector";
import UserProfileMenu from "./UserProfileMenu";

export default function MainLayout() {
  const location = useLocation();
  const { theme } = useTheme();
  const { user } = useAuth();
  const { brand, brands, setBrand } = useBrand();

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isSidebarHovered, setIsSidebarHovered] = useState(false);
  const [isToggleHovered, setIsToggleHovered] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const previousPathnameRef = useRef(location.pathname);

  const handleSidebarToggle = useCallback(() => {
    setIsSidebarCollapsed((prev) => !prev);
  }, []);

  const handleSidebarMouseEnter = useCallback(() => {
    setIsSidebarHovered(true);
  }, []);

  const handleSidebarMouseLeave = useCallback(() => {
    setIsSidebarHovered(false);
  }, []);

  const handleToggleHoverEnter = useCallback(() => {
    setIsToggleHovered(true);
  }, []);

  const handleToggleHoverLeave = useCallback(() => {
    setIsToggleHovered(false);
  }, []);

  const toggleButtonLeft = isSidebarCollapsed ? "28px" : "252px";
  
  const toggleOpacity = isSidebarCollapsed || isSidebarHovered || isToggleHovered ? 1 : 0;

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsSearchOpen(true);
      }
      if ((e.metaKey || e.ctrlKey) && e.key === "\\") {
        e.preventDefault();
        handleSidebarToggle();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleSidebarToggle]);

  return (
    <div
      className="flex h-screen w-full overflow-hidden"
      style={{ background: "linear-gradient(180deg, #0a0a0a 0%, #1a1a1a 50%, #0a0a0a 100%)" }}
    >
      {/* Sidebar */}
      <SimplifiedSidebar
        isSidebarCollapsed={isSidebarCollapsed}
        onMouseEnter={handleSidebarMouseEnter}
        onMouseLeave={handleSidebarMouseLeave}
      />

      {/* Sidebar Toggle Button */}
      <button
        onClick={handleSidebarToggle}
        onMouseEnter={handleToggleHoverEnter}
        onMouseLeave={handleToggleHoverLeave}
        className="fixed z-[60] w-6 h-6 flex items-center justify-center bg-gray-600/40 backdrop-blur-sm rounded-full shadow-lg text-gray-400 hover:text-white hover:bg-gray-500/60 cursor-pointer active:scale-95"
        style={{
          top: "45%",
          transform: "translateY(-50%)",
          left: toggleButtonLeft,
          opacity: toggleOpacity,
          transition: "left 400ms cubic-bezier(0.4, 0, 0.2, 1), opacity 400ms ease-out",
        }}
        title={isSidebarCollapsed ? "Expand sidebar (⌘\\)" : "Collapse sidebar (⌘\\)"}
      >
        <ChevronLeft
          className="h-3.5 w-3.5"
          style={{
            transform: isSidebarCollapsed ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 400ms cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        />
      </button>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 relative">
        {/* Header */}
        <header
          className="h-10 w-full backdrop-blur-xl sticky top-0 z-50 flex items-center justify-between px-6 shadow-2xl"
          style={{
            background: "linear-gradient(90deg, #0a0a0a 0%, #1a1a1a 30%, #101010 50%, #1a1a1a 70%, #0a0a0a 100%)",
          }}
        >
          {/* Search Bar */}
          <div className="flex-1 flex justify-center px-4">
            <div className="w-full max-w-2xl">
              <button
                onClick={() => setIsSearchOpen(true)}
                className="group w-full flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-200"
              >
                <Search className="h-3.5 w-3.5 text-gray-400 group-hover:text-white transition-colors" />
                <span className="text-xs text-gray-400 group-hover:text-gray-300 transition-colors truncate">
                  Search...
                </span>
                <div className="ml-auto flex items-center gap-0.5 text-[10px] text-gray-500 bg-white/5 px-1.5 py-0.5 rounded border border-white/10 flex-shrink-0">
                  <Command className="h-2.5 w-2.5" />
                  <span>K</span>
                </div>
              </button>
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            {/* Settings */}
            <button className="p-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-colors">
              <Settings className="h-5 w-5" />
            </button>

            {/* Brand Selector */}
            <BrandSelector />

            {/* User Profile */}
            <UserProfileMenu
              trigger={
                user?.user_metadata?.avatar_url || user?.user_metadata?.picture ? (
                  <button className="h-8 w-8 rounded-full overflow-hidden ring-2 ring-white/10 hover:ring-white/30 transition-all cursor-pointer">
                    <img
                      src={user.user_metadata.avatar_url || user.user_metadata.picture}
                      alt="User avatar"
                      className="h-full w-full object-cover"
                    />
                  </button>
                ) : (
                  <button className="h-8 w-8 rounded-full bg-yellow-500 flex items-center justify-center text-white font-bold text-xs ring-2 ring-white/10 hover:ring-white/30 transition-all cursor-pointer">
                    {user?.user_metadata?.full_name
                      ?.split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase() ||
                      user?.email?.substring(0, 2).toUpperCase() ||
                      "U"}
                  </button>
                )
              }
              userName={user?.user_metadata?.full_name || "User"}
              userEmail={user?.email || "user@axolop.com"}
            />
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto bg-white rounded-tl-2xl shadow-[0_0_15px_rgba(0,0,0,0.5)]">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
