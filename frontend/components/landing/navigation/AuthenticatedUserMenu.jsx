/**
 * AuthenticatedUserMenu Component
 *
 * Premium dropdown menu for authenticated users on landing/public pages.
 * Shows user avatar, quick navigation links, and logout option.
 *
 * Design: Luxurious glassmorphism with brand colors (#101010, #7b1c14)
 */

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Settings,
  CreditCard,
  HelpCircle,
  LogOut,
  ChevronDown,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";

/**
 * Get user initials from name or email
 */
const getInitials = (user) => {
  if (!user) return "?";

  const fullName = user.user_metadata?.full_name || user.email;
  if (!fullName) return "?";

  // If it's an email, use first letter
  if (fullName.includes("@")) {
    return fullName.charAt(0).toUpperCase();
  }

  // Get first letters of first and last name
  const parts = fullName.split(" ").filter(Boolean);
  if (parts.length >= 2) {
    return (
      parts[0].charAt(0) + parts[parts.length - 1].charAt(0)
    ).toUpperCase();
  }
  return parts[0]?.charAt(0).toUpperCase() || "?";
};

/**
 * Get display name (first name or email prefix)
 */
const getDisplayName = (user) => {
  if (!user) return "User";

  const fullName = user.user_metadata?.full_name;
  if (fullName) {
    return fullName.split(" ")[0]; // First name only
  }

  // Fallback to email prefix
  const email = user.email;
  if (email) {
    return email.split("@")[0];
  }

  return "User";
};

/**
 * User Avatar Component
 */
const UserAvatar = ({ user, size = "md" }) => {
  const avatarUrl = user?.user_metadata?.avatar_url;
  const initials = getInitials(user);

  const sizeClasses = {
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-12 h-12 text-base",
  };

  if (avatarUrl) {
    return (
      <img
        src={avatarUrl}
        alt="User avatar"
        className={cn(
          sizeClasses[size],
          "rounded-full object-cover ring-2 ring-white/20"
        )}
      />
    );
  }

  // Initials fallback with brand gradient
  return (
    <div
      className={cn(
        sizeClasses[size],
        "rounded-full flex items-center justify-center font-bold text-white ring-2 ring-white/20"
      )}
      style={{
        background: "linear-gradient(135deg, #7b1c14 0%, #0F0510 100%)",
      }}
    >
      {initials}
    </div>
  );
};

/**
 * Menu Item Component
 */
const MenuItem = ({ icon: Icon, label, onClick, danger = false }) => (
  <button
    onClick={onClick}
    className={cn(
      "w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-colors",
      danger
        ? "text-red-400 hover:bg-red-500/10"
        : "text-gray-300 hover:bg-white/5 hover:text-white"
    )}
  >
    <Icon className="w-4 h-4" />
    {label}
  </button>
);

/**
 * AuthenticatedUserMenu - Main Component
 */
const AuthenticatedUserMenu = ({ user }) => {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  const displayName = getDisplayName(user);
  const email = user?.email || "";

  // Helper properties
  const isGodUser = ["axolopcrm@gmail.com", "kate@kateviolet.com"].includes(
    user?.email?.toLowerCase()
  );
  const status = user?.user_metadata?.subscription_status;
  const paymentFailedAt = user?.user_metadata?.payment_failed_at;

  // LOGIC: Is the user effectively active?
  // God Users: YES
  // Active/Trialing: YES
  // Past Due < 7 Days: YES (They can still access billing via settings/dropdown)
  // Suspended (> 7 Days): NO
  // Free/None/Canceled: NO

  let isActive = isGodUser;
  if (!isActive) {
    if (["active", "trialing"].includes(status)) {
      isActive = true;
    } else if (status === "past_due") {
      // Check for < 7 days
      let daysPastDue = 0;
      if (paymentFailedAt) {
        const failedDate = new Date(paymentFailedAt);
        const now = new Date();
        daysPastDue = Math.floor((now - failedDate) / (1000 * 60 * 60 * 24));
      }
      if (daysPastDue <= 7) {
        isActive = true; // Still allow access to settings/billing
      }
    }
  }

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close menu on escape key
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  const handleSignOut = async () => {
    setIsOpen(false);
    await signOut();
    navigate("/");
  };

  return (
    <div className="flex items-center gap-3">
      {/* 
        ACTION BUTTON 
        Active -> "Try Axolop today" (Goes to App)
        Inactive -> "Subscribe" (Goes to Pricing)
      */}
      <button
        onClick={() => navigate(isActive ? "/app/home" : "/select-plan")}
        className="relative group"
      >
        <div
          className="relative overflow-hidden px-5 py-2 rounded-full leading-none flex items-center gap-2 transition transform group-hover:-translate-y-0.5 active:scale-95"
          style={{
            background:
              "linear-gradient(180deg, #f2ff00 0%, #f2ff00 30%, #f2ff00 70%, #f2ff00 100%)",
            boxShadow:
              "inset 0 2px 3px rgba(255,255,255,0.5), inset 0 -2px 3px rgba(0,0,0,0.15), 0 6px 20px rgba(233,44,146,0.4), 0 2px 6px rgba(0,0,0,0.2)",
            border: "1px solid rgba(255,255,255,0.3)",
          }}
        >
          {isActive ? (
            <LayoutDashboard className="w-4 h-4 text-white/90" />
          ) : (
            <CreditCard className="w-4 h-4 text-white/90" />
          )}
          <span
            className="relative z-10 text-xs font-bold uppercase tracking-wider"
            style={{
              backgroundImage:
                "linear-gradient(to bottom, #ffffff 0%, #ffffff 40%, #ffd6eb 70%, #ffb8dc 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            {isActive ? "Dashboard" : "Subscribe Now"}
          </span>

          {/* Top metallic shine */}
          <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/40 via-white/10 to-transparent rounded-t-full pointer-events-none" />
          {/* Animated sheen */}
          <div className="absolute top-0 -left-[100%] w-[60%] h-full bg-gradient-to-r from-transparent via-white/50 to-transparent skew-x-12 group-hover:left-[200%] transition-all duration-700 ease-out" />
        </div>
      </button>

      {/* 
        USER CONTROLS
        Active -> Dropdown Menu
        Inactive -> Simple "Sign Out" button (No dropdown)
      */}
      {isActive ? (
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={cn(
              "flex items-center gap-2 p-1.5 rounded-full transition-all",
              "hover:bg-white/5",
              isOpen && "bg-white/5"
            )}
          >
            <UserAvatar user={user} size="sm" />
            <ChevronDown
              className={cn(
                "w-4 h-4 text-gray-400 transition-transform duration-200",
                isOpen && "rotate-180"
              )}
            />
          </button>

          {/* Dropdown Menu */}
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                transition={{ duration: 0.15, ease: "easeOut" }}
                className="absolute right-0 top-full mt-2 w-64 rounded-xl overflow-hidden shadow-2xl z-50"
                style={{
                  background: "rgba(16, 16, 16, 0.95)",
                  backdropFilter: "blur(20px)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                }}
              >
                {/* User Info Header */}
                <div className="px-4 py-3 border-b border-white/10">
                  <div className="flex items-center gap-3">
                    <UserAvatar user={user} size="md" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-white truncate">
                        {displayName}
                      </p>
                      <p className="text-xs text-gray-400 truncate">{email}</p>
                    </div>
                  </div>
                </div>

                {/* Menu Items */}
                <div className="py-2">
                  <MenuItem
                    icon={LayoutDashboard}
                    label="Go to Dashboard"
                    onClick={() => {
                      setIsOpen(false);
                      navigate("/app/home");
                    }}
                  />
                  <MenuItem
                    icon={Settings}
                    label="Settings"
                    onClick={() => {
                      setIsOpen(false);
                      navigate("/app/settings");
                    }}
                  />
                  <MenuItem
                    icon={CreditCard}
                    label="Billing & Subscription"
                    onClick={() => {
                      setIsOpen(false);
                      navigate("/app/settings/billing");
                    }}
                  />
                  <MenuItem
                    icon={HelpCircle}
                    label="Help Center"
                    onClick={() => {
                      setIsOpen(false);
                      window.open("https://help.axolop.com", "_blank");
                    }}
                  />
                </div>

                {/* Sign Out */}
                <div className="py-2 border-t border-white/10">
                  <MenuItem
                    icon={LogOut}
                    label="Sign Out"
                    onClick={handleSignOut}
                    danger
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ) : (
        /* INACTIVE USERS: No dropdown, just Sign Out */
        <button
          onClick={handleSignOut}
          className="flex items-center gap-2 px-3 py-2 rounded-full text-xs font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
        >
          <LogOut className="w-3 h-3" />
          Sign Out
        </button>
      )}
    </div>
  );
};

export default AuthenticatedUserMenu;
