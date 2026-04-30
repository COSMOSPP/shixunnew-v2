import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { buttonVariants } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { ZhiYunLogo } from "@/components/icons/ZhiYunLogo";

export default function PublicLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleScrollTo = (id: string) => {
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }
  };
  return (
    <div className="min-h-screen flex flex-col bg-neutral-surface">
      {/* Navbar */}
      <header className="sticky top-0 z-50 w-full border-b border-neutral-border bg-neutral-surface/80 backdrop-blur-md">
        <div className="container mx-auto max-w-[1200px] flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2">
              <ZhiYunLogo className="w-8 h-8 text-primary" />
              <span className="text-[18px] font-medium text-neutral-title">
                智云实训平台
              </span>
            </Link>
            <nav className="hidden md:flex items-center gap-6 text-[14px]">
              <Link to="/" className="text-primary font-medium">首页</Link>
              <button onClick={() => handleScrollTo("featured-courses")} className="text-neutral-body hover:text-primary transition-colors cursor-pointer">精选课程</button>
              <button onClick={() => handleScrollTo("best-practices")} className="text-neutral-body hover:text-primary transition-colors cursor-pointer">最佳实践</button>
              <div className="group relative cursor-pointer text-neutral-body hover:text-primary transition-colors h-16 flex items-center">
                <span className="flex items-center gap-1">
                  实训场景 <ChevronDown className="w-4 h-4" />
                </span>
                <div className="absolute top-full left-0 hidden group-hover:block">
                  <div className="w-48 rounded-[6px] border border-neutral-border bg-neutral-surface p-2 shadow-sm">
                    <Link to="/user" onClick={() => localStorage.removeItem('isLoggedIn')} className="block px-3 py-2 hover:bg-neutral-bg rounded-[4px] text-neutral-title transition-colors">人工智能</Link>
                    <Link to="/login" className="block px-3 py-2 hover:bg-neutral-bg rounded-[4px] text-neutral-title transition-colors">安全运维</Link>
                    <Link to="/login" className="block px-3 py-2 hover:bg-neutral-bg rounded-[4px] text-neutral-title transition-colors">私有云</Link>
                    <Link to="/login" className="block px-3 py-2 hover:bg-neutral-bg rounded-[4px] text-neutral-title transition-colors">公有云</Link>
                  </div>
                </div>
              </div>
              <div className="group relative cursor-pointer text-neutral-body hover:text-primary transition-colors h-16 flex items-center">
                <span className="flex items-center gap-1">
                  竞赛 <ChevronDown className="w-4 h-4" />
                </span>
                <div className="absolute top-full left-0 hidden group-hover:block">
                  <div className="w-48 rounded-[6px] border border-neutral-border bg-neutral-surface p-2 shadow-sm">
                    <Link to="/competition/ai" className="block px-3 py-2 hover:bg-neutral-bg rounded-[4px] text-neutral-title transition-colors">实战竞赛</Link>
                    <Link to="/competition/cloud" className="block px-3 py-2 hover:bg-neutral-bg rounded-[4px] text-neutral-title transition-colors">挑战竞赛</Link>
                  </div>
                </div>
              </div>
            </nav>
          </div>
          <div className="flex items-center gap-2 h-16">
            <Link 
              to="/admin" 
              className={cn(buttonVariants({ variant: "ghost" }), "text-neutral-body hover:text-primary")}
            >
              运营端
            </Link>
            <div className="group relative cursor-pointer h-16 flex items-center">
              <div
                className={cn(buttonVariants({ variant: "default" }), "bg-primary hover:bg-primary-hover text-white flex items-center gap-1")}
              >
                登录 / 注册 <ChevronDown className="w-4 h-4" />
              </div>
              <div className="absolute top-full right-0 hidden group-hover:block pt-2">
                <div className="w-32 rounded-[6px] border border-neutral-border bg-neutral-surface p-2 shadow-sm">
                  <Link to="/login/user" className="block px-3 py-2 hover:bg-neutral-bg rounded-[4px] text-neutral-title transition-colors text-center">用户版</Link>
                  <Link to="/login/teacher" className="block px-3 py-2 hover:bg-neutral-bg rounded-[4px] text-neutral-title transition-colors text-center">教师版</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="mt-auto py-6 border-t border-neutral-border bg-white text-center text-[13px] text-neutral-caption flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
        <Link to="#" className="hover:text-neutral-title transition-colors">关于我们</Link>
        <span>|</span>
        <Link to="#" className="hover:text-neutral-title transition-colors">帮助中心</Link>
        <span>|</span>
        <Link to="#" className="hover:text-neutral-title transition-colors">隐私政策</Link>
        <span>|</span>
        <Link to="#" className="hover:text-neutral-title transition-colors">服务条款</Link>
        <span>|</span>
        <span>©2025 智云实训2.0</span>
        <span>|</span>
        <span>京ICP备12345678号</span>
      </footer>
    </div>
  );
}
