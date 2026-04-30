import { Link, Outlet, useLocation } from "react-router-dom";
import { GraduationCap, User, LayoutDashboard, FileQuestion, FileText, Database } from "lucide-react";
import { cn } from "@/lib/utils";

export default function TeacherLayout() {
  const location = useLocation();
  
  const navItems = [
    { name: "首页", path: "/teacher", icon: LayoutDashboard },
    { name: "试题管理", path: "/teacher/questions", icon: FileQuestion },
    { name: "试卷管理", path: "/teacher/papers", icon: FileText },
    { name: "资源分配", path: "/teacher/resources", icon: Database },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#f5f6f8]">
      {/* Dark Header */}
      <header className="h-14 bg-[#1f1f1f] text-white flex items-center justify-between px-4 flex-shrink-0 z-50">
        <div className="flex items-center gap-6 h-full">
          <Link to="/" className="flex items-center gap-2 mr-4">
            <div className="w-6 h-6 bg-[#fa541c] rounded-[4px] flex items-center justify-center text-white font-bold text-xs">
              翼
            </div>
            <span className="text-[16px] font-medium tracking-wide">
              智云实训平台(教师端)
            </span>
          </Link>
          
          {/* Top Navigation */}
          <nav className="hidden md:flex items-center h-full gap-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path || (item.path !== '/teacher' && location.pathname.startsWith(item.path));
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "h-full flex items-center gap-2 px-3 text-[14px] font-medium transition-colors relative",
                    isActive ? "text-white bg-white/10" : "text-gray-300 hover:text-white hover:bg-white/10"
                  )}
                >
                  {isActive && (
                    <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#fa541c]" />
                  )}
                  <item.icon className="w-4 h-4" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 cursor-pointer hover:bg-white/10 px-3 py-1.5 rounded-md transition-colors">
            <div className="w-7 h-7 bg-[#fa541c] rounded-full flex items-center justify-center text-white">
              <User className="w-4 h-4" />
            </div>
            <span className="text-sm font-medium text-gray-200">张老师</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 min-h-0">
        <main className="flex-1 overflow-auto p-6 bg-[#f5f6f8]">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
