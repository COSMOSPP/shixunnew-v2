import React from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { BookOpen, Cpu, Star, FolderKanban, Database } from "lucide-react";

export default function AdminAILayout() {
  const location = useLocation();
  
  const menuItems = [
    { title: "课程管理", icon: BookOpen, href: "/admin/ai/courses" },
    { title: "项目管理", icon: FolderKanban, href: "/admin/ai/projects" },
    { title: "数据集管理", icon: Database, href: "/admin/ai/datasets" },
    { title: "最佳实践库管理", icon: Star, href: "/admin/ai/practices" },
    { title: "ai能力管理", icon: Cpu, href: "/admin/ai/capabilities" },
  ];

  return (
    <div className="flex h-full w-full bg-white overflow-hidden shadow-sm">
      {/* Left Sidebar */}
      <div className="w-[200px] border-r border-neutral-border flex-shrink-0 flex flex-col bg-white">
        <div className="p-5 border-b border-neutral-border">
          <h2 className="text-lg font-semibold text-neutral-title">人工智能管理</h2>
        </div>
        <nav className="flex-1 p-4 space-y-1">
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
      <div className="flex-1 overflow-auto bg-[#f5f6f8] p-6">
        <Outlet />
      </div>
    </div>
  );
}
