import { Outlet, Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

export interface AdminMenuItem {
  title: string;
  icon: LucideIcon;
  href: string;
}

interface AdminSectionLayoutProps {
  title: string;
  menuItems: AdminMenuItem[];
}

export default function AdminSectionLayout({ title, menuItems }: AdminSectionLayoutProps) {
  const location = useLocation();

  return (
    <div className="flex h-full w-full">
      {/* Left Sidebar */}
      <div className="w-[180px] bg-white border-r border-neutral-border flex-shrink-0 flex flex-col h-full">
        <div className="p-5 border-b border-neutral-border">
          <h2 className="text-lg font-semibold text-neutral-title">{title}</h2>
        </div>
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
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
      <div className="flex-1 overflow-auto bg-[#f5f6f8] p-4">
        <Outlet />
      </div>
    </div>
  );
}
