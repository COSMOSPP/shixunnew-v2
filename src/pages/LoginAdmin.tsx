import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User, Lock } from "lucide-react";
import { ZhiYunLogo } from "@/components/icons/ZhiYunLogo";
import adminImg from "../admin.jpg";

export default function LoginAdmin() {
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('isLoggedIn', 'true');
    navigate("/admin"); // Redirects to operations dashboard
  };

  return (
    <div className="min-h-screen flex bg-neutral-bg">
      {/* Left Side - 2/5 */}
      <div className="hidden lg:flex w-2/5 relative overflow-hidden bg-white">
        <img 
          src={adminImg} 
          alt="Admin Login Background" 
          className="absolute inset-0 w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 mb-16 hover:opacity-90 transition-opacity absolute top-8 left-8 z-20 text-white drop-shadow-md">
          <ZhiYunLogo className="w-12 h-12 text-white drop-shadow-md" strokeWidth={2} />
          <span className="text-[24px] font-bold tracking-widest">
            智云实训平台
          </span>
        </Link>
      </div>

      {/* Right Side - 3/5 */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-[400px] bg-white rounded-[8px] shadow-lg border border-neutral-border p-8">
          <div className="flex flex-col items-center mb-8">
            <div className="w-12 h-12 bg-[#fa541c] rounded-[6px] flex items-center justify-center text-white font-bold text-xl mb-4">
              管
            </div>
            <h1 className="text-[24px] font-medium text-neutral-title">运营端登录</h1>
            <p className="text-[14px] text-neutral-caption mt-2">欢迎回来，请登录您的管理员账号</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-neutral-caption" />
                </div>
                <Input 
                  type="text" 
                  placeholder="请输入管理员账号/邮箱/手机号" 
                  className="pl-10 h-10"
                  required
                />
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-neutral-caption" />
                </div>
                <Input 
                  type="password" 
                  placeholder="请输入密码" 
                  className="pl-10 h-10"
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-[14px]">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="rounded border-neutral-border text-[#fa541c] focus:ring-[#fa541c]" />
                <span className="text-neutral-body">自动登录</span>
              </label>
              <a href="#" className="text-[#fa541c] hover:underline">忘记密码？</a>
            </div>

            <Button type="submit" className="w-full h-10 bg-[#fa541c] hover:bg-[#ff7a45] text-white">
              登 录
            </Button>
          </form>

          <div className="mt-6 text-center text-[14px] text-neutral-body">
            还没有管理员权限？ <span className="text-[#fa541c] font-medium cursor-help" title="请联系超级管理员在系统管理模块中分配运营角色">联系系统管理员</span>
          </div>
        </div>
      </div>
    </div>
  );
}
