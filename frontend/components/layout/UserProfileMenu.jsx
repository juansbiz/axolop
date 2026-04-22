import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  User, 
  Settings, 
  CreditCard, 
  LogOut, 
  HelpCircle,
  ChevronDown 
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function UserProfileMenu({ trigger, userName, userEmail }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const { signOut } = useAuth();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const menuItems = [
    { icon: User, label: "Profile", action: () => navigate("/app/profile") },
    { icon: Settings, label: "Settings", action: () => navigate("/app/settings") },
    { icon: CreditCard, label: "Billing", action: () => navigate("/app/billing") },
    { icon: HelpCircle, label: "Help & Support", action: () => {} },
  ];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2"
      >
        {trigger}
        <ChevronDown className="h-4 w-4 text-gray-400" />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-xl overflow-hidden z-50">
          <div className="px-4 py-3 border-b border-gray-100">
            <p className="text-sm font-medium text-gray-900">{userName}</p>
            <p className="text-xs text-gray-500 truncate">{userEmail}</p>
          </div>

          <div className="py-2">
            {menuItems.map((item, index) => (
              <button
                key={index}
                onClick={() => {
                  item.action();
                  setIsOpen(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition-colors text-left"
              >
                <item.icon className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-700">{item.label}</span>
              </button>
            ))}
          </div>

          <div className="border-t border-gray-100 py-2">
            <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition-colors text-left"
            >
              <LogOut className="h-4 w-4 text-red-500" />
              <span className="text-sm text-red-600">Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
