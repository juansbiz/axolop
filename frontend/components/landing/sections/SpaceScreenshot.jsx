import { cn } from "@/lib/utils";
import { 
  Users, 
  Mail, 
  Megaphone, 
  ShoppingCart, 
  TrendingUp, 
  BarChart3,
  ArrowRight,
  Plus,
  Search,
  Settings,
  Bell,
  Menu
} from "lucide-react";

const SpaceScreenshot = ({ 
  space = "sales",
  className 
}) => {
  const spaces = {
    sales: {
      title: "Sales",
      color: "#E92C92",
      items: [
        { label: "Orders", value: "24" },
        { label: "Customers", value: "156" },
        { label: "Revenue", value: "$4,280" },
      ],
      listItems: ["Recent Orders", "Products", "Customers"]
    },
    marketing: {
      title: "Marketing", 
      color: "#14787B",
      items: [
        { label: "Campaigns", value: "8" },
        { label: "Sent", value: "12.4K" },
        { label: "Open Rate", value: "42%" },
      ],
      listItems: ["Email Campaigns", "Automations", "Sequences"]
    },
    ad: {
      title: "Ad",
      color: "#F59E0B",
      items: [
        { label: "Active", value: "3" },
        { label: "Spend", value: "$540" },
        { label: "Revenue", value: "$3,240" },
      ],
      listItems: ["Active Campaigns", "Ad Performance", "Create Ad"]
    }
  };

  const config = spaces[space] || spaces.sales;

  return (
    <div 
      className={cn(
        "rounded-xl overflow-hidden border border-white/10 bg-[#0a0410]",
        "shadow-2xl shadow-black/50",
        className
      )}
    >
      {/* Mock Browser/Window Header */}
      <div className="flex items-center gap-2 px-4 py-3 bg-[#0F0510] border-b border-white/5">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500/60" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
          <div className="w-3 h-3 rounded-full bg-green-500/60" />
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="px-4 py-1 rounded-full bg-white/5 text-xs text-gray-400">
            app.axolop.com
          </div>
        </div>
        <div className="flex items-center gap-2 text-gray-500">
          <Bell className="w-4 h-4" />
          <Settings className="w-4 h-4" />
        </div>
      </div>

      {/* Sidebar */}
      <div className="flex">
        <div className="w-16 flex flex-col items-center py-4 bg-[#0a0410] border-r border-white/5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#E92C92] to-[#C81E78] flex items-center justify-center mb-4">
            <span className="text-xs font-bold text-white">A</span>
          </div>
          <div className="space-y-3">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${space === 'sales' ? 'bg-[#E92C92]/20 text-[#E92C92]' : 'text-gray-500'}`}>
              <ShoppingCart className="w-4 h-4" />
            </div>
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${space === 'marketing' ? 'bg-[#14787B]/20 text-[#14787B]' : 'text-gray-500'}`}>
              <Mail className="w-4 h-4" />
            </div>
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${space === 'ad' ? 'bg-[#F59E0B]/20 text-[#F59E0B]' : 'text-gray-500'}`}>
              <Megaphone className="w-4 h-4" />
            </div>
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-500">
              <BarChart3 className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 p-4 bg-[#0F0510]">
          {/* Top Stats Bar */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            {config.items.map((item, i) => (
              <div key={i} className="bg-white/5 rounded-lg p-3">
                <div className="text-xs text-gray-500 mb-1">{item.label}</div>
                <div className="text-lg font-bold text-white">{item.value}</div>
              </div>
            ))}
          </div>

          {/* Content Area */}
          <div className="bg-white/5 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-semibold text-white">{config.title} Overview</h4>
              <button 
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium"
                style={{ backgroundColor: `${config.color}20`, color: config.color }}
              >
                <Plus className="w-3 h-3" />
                Add New
              </button>
            </div>
            
            {/* Mock List */}
            <div className="space-y-2">
              {config.listItems.map((item, i) => (
                <div 
                  key={i}
                  className="flex items-center justify-between p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: `${config.color}20` }}
                    >
                      {space === 'sales' && <ShoppingCart className="w-4 h-4" style={{ color: config.color }} />}
                      {space === 'marketing' && <Mail className="w-4 h-4" style={{ color: config.color }} />}
                      {space === 'ad' && <Megaphone className="w-4 h-4" style={{ color: config.color }} />}
                    </div>
                    <span className="text-sm text-gray-300">{item}</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-600" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpaceScreenshot;
