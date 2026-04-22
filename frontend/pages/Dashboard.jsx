import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Users, 
  ShoppingCart, 
  DollarSign, 
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Mail,
  FileText,
  MessageSquare,
  Activity,
  Plus,
  MoreHorizontal
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useBrand } from "@/hooks/useBrand";

const stats = [
  { label: "Total Customers", value: "1,234", change: "+12%", positive: true, icon: Users },
  { label: "Orders", value: "567", change: "+8%", positive: true, icon: ShoppingCart },
  { label: "Revenue", value: "$12,450", change: "+23%", positive: true, icon: DollarSign },
  { label: "Growth", value: "18%", change: "+5%", positive: true, icon: TrendingUp },
];

const recentOrders = [
  { id: 1, customer: "John D.", amount: "$125.00", status: "completed", date: "2 min ago" },
  { id: 2, customer: "Sarah M.", amount: "$89.00", status: "pending", date: "15 min ago" },
  { id: 3, customer: "Mike R.", amount: "$245.00", status: "completed", date: "1 hour ago" },
  { id: 4, customer: "Emily K.", amount: "$67.50", status: "processing", date: "2 hours ago" },
];

const quickActions = [
  { label: "New Order", icon: Plus, color: "bg-purple-600" },
  { label: "Add Customer", icon: Users, color: "bg-blue-600" },
  { label: "Send Email", icon: Mail, color: "bg-green-600" },
  { label: "Create Report", icon: FileText, color: "bg-orange-600" },
];

export default function Home() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { brand } = useBrand();

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back{user?.user_metadata?.full_name ? `, ${user.user_metadata.full_name.split(' ')[0]}` : ''}
        </h1>
        <p className="text-gray-600 mt-1">
          Here's what's happening with {brand?.name || "your store"} today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <stat.icon className="h-5 w-5 text-purple-600" />
              </div>
              <span className={`text-sm font-medium ${stat.positive ? 'text-green-600' : 'text-red-600'}`}>
                {stat.change}
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {quickActions.map((action, index) => (
            <button
              key={index}
              className="flex items-center gap-3 p-4 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:border-purple-200 transition-all group"
            >
              <div className={`p-2 rounded-lg ${action.color} group-hover:scale-110 transition-transform`}>
                <action.icon className="h-4 w-4 text-white" />
              </div>
              <span className="text-sm font-medium text-gray-700">{action.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between p-5 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
            <button className="text-sm text-purple-600 hover:text-purple-700 font-medium">
              View All
            </button>
          </div>
          <div className="divide-y divide-gray-100">
            {recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                    <span className="text-sm font-medium text-gray-600">
                      {order.customer.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{order.customer}</p>
                    <p className="text-sm text-gray-500">{order.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">{order.amount}</p>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    order.status === 'completed' ? 'bg-green-100 text-green-700' :
                    order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-blue-100 text-blue-700'
                  }`}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Activity Feed */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between p-5 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">Activity</h2>
            <button className="p-1 hover:bg-gray-100 rounded">
              <MoreHorizontal className="h-5 w-5 text-gray-400" />
            </button>
          </div>
          <div className="p-4 space-y-4">
            {[
              { icon: Users, text: "New customer registered", time: "5 min ago", color: "bg-blue-500" },
              { icon: ShoppingCart, text: "Order #1234 completed", time: "12 min ago", color: "bg-green-500" },
              { icon: Mail, text: "Email campaign sent", time: "1 hour ago", color: "bg-purple-500" },
              { icon: Activity, text: "New lead from website", time: "2 hours ago", color: "bg-orange-500" },
            ].map((activity, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className={`p-2 rounded-full ${activity.color} flex-shrink-0`}>
                  <activity.icon className="h-3 w-3 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900">{activity.text}</p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Charts Section - Placeholder */}
      <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-100 p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Sales Overview</h2>
          <div className="flex gap-2">
            {['7D', '30D', '90D', '1Y'].map((period) => (
              <button
                key={period}
                className={`px-3 py-1 text-sm rounded-lg ${
                  period === '30D' 
                    ? 'bg-purple-600 text-white' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {period}
              </button>
            ))}
          </div>
        </div>
        <div className="h-48 flex items-end justify-between gap-2">
          {[35, 45, 30, 55, 70, 65, 80, 75, 90, 85, 95, 100].map((height, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-2">
              <div 
                className="w-full bg-purple-200 rounded-t hover:bg-purple-300 transition-colors"
                style={{ height: `${height}%` }}
              />
              <span className="text-xs text-gray-400">
                {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i]}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
