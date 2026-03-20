import React from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { User, BookOpen, FolderKanban, Award, LayoutDashboard } from "lucide-react";

export default function UserCenterLayout() {
  const location = useLocation();

  const menuItems = [
    { title: "概览", icon: LayoutDashboard, href: "/user/center" },
    { title: "个人资料", icon: User, href: "/user/center/profile" },
    { title: "学习数据", icon: BookOpen, href: "/user/center/learning" },
    { title: "我的项目", icon: FolderKanban, href: "/user/center/projects" },
    { title: "证书徽章", icon: Award, href: "/user/center/certificates" },
  ];

  return (
    <div className="flex bg-white rounded-[16px] border border-neutral-border overflow-hidden min-h-[calc(100vh-8rem)] shadow-sm">
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
