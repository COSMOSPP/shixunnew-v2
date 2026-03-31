import React from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  Book, 
  MonitorPlay, 
  FileText, 
  Trophy, 
  Swords, 
  Cloud, 
  Code,
  Menu,
  ChevronDown,
  FolderOpen,
  Search,
  Maximize,
  User as UserIcon,
  LayoutDashboard,
  Users,
  Database,
  FolderKanban,
  Brain,
  Shield,
  Server,
  Laptop,
  Network,
  Key,
  Settings,
  Bell,
  Star
} from "lucide-react";

interface NavItem {
  title: string;
  icon: React.ElementType;
  href?: string;
  children?: { title: string; href: string }[];
}

interface DashboardLayoutProps {
  type: "user" | "admin";
}

export default function DashboardLayout({ type }: DashboardLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    localStorage.removeItem('isLoggedIn');
    navigate('/login/user');
  };

  const userItems: NavItem[] = [
    { title: "首页", icon: LayoutDashboard, href: "/user" },
    { title: "最佳实践", icon: Star, href: "/user/practices" },
    { title: "课程", icon: Book, href: "/user/courses" },
    { title: "项目", icon: FolderKanban, href: "/user/projects" },
    { title: "考试", icon: FileText, href: "/user/exams" },
    { title: "数据集", icon: Database, href: "/user/datasets" },
    { 
      title: "AI能力中心", 
      icon: Brain, 
      children: [
        { title: "AI助手", href: "/user/ai/assistant" },
        { title: "数字员工", href: "/user/ai/agents" },
        { title: "技能仓库", href: "/user/ai/skills" },
      ]
    },
  ];

  const adminItems: NavItem[] = [
    { title: "人工智能", icon: Brain, href: "/admin/ai" },
    { title: "安全运维", icon: Shield, href: "/admin/security" },
    { title: "公有云", icon: Cloud, href: "/admin/public-cloud" },
    { title: "私有云", icon: Server, href: "/admin/private-cloud" },
    { title: "IT", icon: Laptop, href: "/admin/it" },
    { title: "IP", icon: Network, href: "/admin/ip" },
    { title: "权限管理", icon: Key, href: "/admin/permissions" },
    { title: "系统管理", icon: Settings, href: "/admin/system" },
  ];

  const items = type === "user" ? userItems : adminItems;

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
              {type === "admin" ? "翼实训平台" : "翼实训平台(人工智能)"}
            </span>
          </Link>
          
          {/* Top Navigation */}
          <nav className="hidden md:flex items-center h-full gap-1">
            {items.map((item) => {
              if (item.children) {
                return (
                  <div key={item.title} className="h-full flex items-center relative group cursor-pointer px-3 hover:bg-white/10 transition-colors">
                    <div className="flex items-center gap-2 text-[14px] font-medium text-gray-300 group-hover:text-white transition-colors">
                      <item.icon className="w-4 h-4" />
                      {item.title}
                      <ChevronDown className="w-4 h-4" />
                    </div>
                    <div className="absolute top-full left-0 hidden group-hover:block pt-1 min-w-[160px]">
                      <div className="rounded-[6px] border border-neutral-border bg-white p-2 shadow-lg">
                        {item.children.map(child => (
                          <Link key={child.href} to={child.href} className="block px-3 py-2 hover:bg-[#fff2e8] hover:text-[#fa541c] rounded-[4px] text-[14px] text-neutral-title transition-colors">
                            {child.title}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              }

              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.href}
                  to={item.href!}
                  className={cn(
                    "h-full flex items-center gap-2 px-3 text-[14px] font-medium transition-colors relative",
                    isActive ? "text-white bg-white/10" : "text-gray-300 hover:text-white hover:bg-white/10"
                  )}
                >
                  {isActive && (
                    <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#fa541c]" />
                  )}
                  <item.icon className="w-4 h-4" />
                  {item.title}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-5 text-gray-300">
          {isLoggedIn ? (
            <>
              <button className="relative hover:text-white transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <div className="relative group h-full flex items-center">
                <button className="flex items-center gap-2 hover:text-white transition-colors h-14 px-2">
                  <div className="flex items-center justify-center w-7 h-7 rounded-full bg-gray-700">
                    <UserIcon className="w-4 h-4" />
                  </div>
                  <ChevronDown className="w-4 h-4" />
                </button>
                <div className="absolute top-full right-0 hidden group-hover:block pt-1 min-w-[140px]">
                  <div className="rounded-[6px] border border-neutral-border bg-white p-2 shadow-lg">
                    <Link to="/user/center" className="block px-3 py-2 hover:bg-[#fff2e8] hover:text-[#fa541c] rounded-[4px] text-[14px] text-neutral-title transition-colors">个人中心</Link>
                    <Link to="/user/projects" className="block px-3 py-2 hover:bg-[#fff2e8] hover:text-[#fa541c] rounded-[4px] text-[14px] text-neutral-title transition-colors">我的项目</Link>
                    <Link to="/user/exams" className="block px-3 py-2 hover:bg-[#fff2e8] hover:text-[#fa541c] rounded-[4px] text-[14px] text-neutral-title transition-colors">我的考试</Link>
                    <div className="h-[1px] bg-neutral-border my-1" />
                    <button onClick={handleLogout} className="w-full text-left block px-3 py-2 hover:bg-[#fff2e8] hover:text-[#fa541c] rounded-[4px] text-[14px] text-neutral-title transition-colors">退出登录</button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/login/user" className="text-[14px] hover:text-white transition-colors">登录</Link>
              <Link to="/login/user" className="text-[14px] bg-[#fa541c] hover:bg-[#ff7a45] text-white px-4 py-1.5 rounded-full transition-colors">注册</Link>
            </div>
          )}
        </div>
      </header>

      {/* Main Body */}
      <div className="flex flex-1 min-h-0">
        {/* Main Content Area */}
        <main className={cn("flex-1 overflow-auto bg-[#f5f6f8]", location.pathname === "/user" ? "p-0" : "p-6")}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
