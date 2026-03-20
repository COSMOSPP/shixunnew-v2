import React from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { BookOpen, FlaskConical, Trophy, LayoutDashboard } from "lucide-react";

export default function AdminAILayout() {
  const location = useLocation();
  
  const menuItems = [
    { title: "概览", icon: LayoutDashboard, href: "/admin/ai" },
    { title: "课程管理", icon: BookOpen, href: "/admin/ai/courses" },
    { title: "实验管理", icon: FlaskConical, href: "/admin/ai/experiments" },
    { title: "竞赛管理", icon: Trophy, href: "/admin/ai/competitions" },
  ];

  return (
    <div className="flex h-full w-full">
      {/* Left Sidebar */}
      <div className="w-[180px] bg-white border-r border-neutral-border flex-shrink-0 flex flex-col h-full">
        <div className="p-5 border-b border-neutral-border">
          <h2 className="text-lg font-semibold text-neutral-title">人工智能管理</h2>
        </div>
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-[8px] text-[14px] font-medium transition-colors",
                  isActive 
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
      <div className="flex-1 overflow-auto bg-[#f5f6f8] p-4">
        <Outlet />
      </div>
    </div>
  );
}
