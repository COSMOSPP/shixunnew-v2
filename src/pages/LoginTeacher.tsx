import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User, Lock, GraduationCap } from "lucide-react";
import { ZhiYunLogo } from "@/components/icons/ZhiYunLogo";

export default function LoginTeacher() {
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/teacher"); // Redirect to teacher dashboard
  };

  return (
    <div className="min-h-screen flex bg-neutral-bg">
      {/* Left Side - 2/5 */}
      <div className="hidden lg:flex w-2/5 bg-[#fa541c] relative overflow-hidden flex-col items-center justify-center text-white p-12">
        {/* Logo */}
        <Link to="/" className="absolute top-8 left-8 z-20 flex items-center gap-3 hover:opacity-90 transition-opacity">
          <ZhiYunLogo className="w-10 h-10 text-white" />
          <span className="text-[24px] font-bold text-white tracking-widest">
            智云实训平台
          </span>
        </Link>

        <div className="absolute inset-0 opacity-10 bg-[url('https://image.pollinations.ai/prompt/A%20cartoon%20hand-drawn%20illustration%20of%20a%20middle-aged%20male%20teacher%20with%20glasses%20grading%20exam%20papers%20at%20a%20computer,%20looking%20approving%20and%20praising,%20flat%20color,%20anime%20style?width=800&height=1200&nologo=true')] bg-cover bg-center mix-blend-overlay"></div>
        <div className="relative z-10 text-center mt-16">
          <h2 className="text-4xl font-bold mb-6 tracking-wider">悉心培育，静待花开</h2>
          <p className="text-lg opacity-90 mb-12 tracking-wide">认真批改每一份试卷，见证学生的成长</p>
          {/* Illustration */}
          <div className="w-80 h-80 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/20 shadow-2xl overflow-hidden mx-auto">
            <img 
              src="https://image.pollinations.ai/prompt/A%20cartoon%20hand-drawn%20illustration%20of%20a%20middle-aged%20male%20teacher%20with%20glasses%20grading%20exam%20papers%20at%20a%20computer,%20looking%20approving%20and%20praising,%20flat%20color,%20anime%20style?width=400&height=400&nologo=true" 
              alt="一位带着眼镜的中年男老师,在电脑前批改学生试卷,脸上带着对学生的认可和表扬的神态" 
              className="w-full h-full object-cover opacity-95 hover:scale-105 transition-transform duration-700"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      </div>

      {/* Right Side - 3/5 */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-[400px] bg-white rounded-[8px] shadow-lg border border-neutral-border p-8">
          <div className="flex flex-col items-center mb-8">
            <div className="w-12 h-12 bg-[#fa541c] rounded-[6px] flex items-center justify-center text-white font-bold text-xl mb-4">
              实
            </div>
            <h1 className="text-[24px] font-medium text-neutral-title">教师登录</h1>
            <p className="text-[14px] text-neutral-caption mt-2">欢迎回来，请登录您的教师账号</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-neutral-caption" />
                </div>
                <Input 
                  type="text" 
                  placeholder="请输入教工号/邮箱/手机号" 
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
            还没有账号？ <Link to="/login/teacher" className="text-[#fa541c] hover:underline">联系管理员注册</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
