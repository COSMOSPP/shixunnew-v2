import React from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { User, BookOpen, Clock, Shield, Star, Bell, LayoutDashboard } from "lucide-react";

export default function UserCenterLayout() {
  const location = useLocation();

  const menuItems = [
    { title: "个人资料", icon: User, href: "/user/center/profile" },
    { title: "学习数据", icon: BookOpen, href: "/user/center/learning" },
    { title: "我的收藏", icon: Star, href: "/user/center/favorites" },
    { title: "历史记录", icon: Clock, href: "/user/center/history" },
    { title: "账号安全", icon: Shield, href: "/user/center/security" },
    { title: "消息中心", icon: Bell, href: "/user/center/messages" },
  ];

  return (
    <div className="flex h-full w-full bg-white overflow-hidden shadow-sm">
      {/* Left Sidebar */}
      <div className="w-[200px] border-r border-neutral-border flex-shrink-0 flex flex-col bg-white">
        <div className="p-5 border-b border-neutral-border">
          <h2 className="text-lg font-semibold text-neutral-title">个人中心</h2>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {menuItems.map((item) => {
            const isExact = location.pathname === item.href;
            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-[8px] text-[14px] font-medium transition-colors",
                  isExact 
                    ? "bg-[#fff2e8] text-[#fa541c]" 
                    : "text-neutral-body hover:bg-neutral-bg hover:text-neutral-title"
                )}
              >
                <item.icon className="w-5 h-5" />
                {item.title}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto bg-[#f5f6f8] p-6">
        <Outlet />
      </div>
    </div>
  );
}
