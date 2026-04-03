import React, { useState } from "react";
import { ChevronRight, Shield, Check, ChevronRight as ChevronRightIcon, Laptop, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function UserCenterSecurity() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    navigate('/login/user');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center text-sm text-neutral-caption">
          <Link to="/user" className="hover:text-primary cursor-pointer transition-colors">首页</Link>
          <ChevronRight className="w-4 h-4 mx-1" />
          <Link to="/user/center" className="hover:text-primary cursor-pointer transition-colors">个人中心</Link>
          <ChevronRight className="w-4 h-4 mx-1" />
          <span className="text-neutral-title font-medium">账号安全</span>
        </div>
        <Button variant="outline" size="sm" onClick={handleLogout} className="text-semantic-error border-semantic-error/20 hover:bg-semantic-error/10 hover:text-semantic-error">
          <LogOut className="w-4 h-4 mr-2" />
          退出当前账号
        </Button>
      </div>

      <Card className="border-neutral-border shadow-sm">
        <CardHeader className="pb-2 border-b border-neutral-border">
          <CardTitle className="text-base font-bold text-neutral-title flex items-center gap-2">
            <Shield className="w-5 h-5 text-semantic-warning" />
            账号安全设置
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-8">
          {/* Password */}
          <div className="flex items-center justify-between pb-6 border-b border-neutral-border/50">
            <div className="flex items-start gap-6">
              <div className="w-24 text-sm font-medium text-neutral-title">登录密码</div>
              <div>
                <div className="text-sm text-neutral-body">安全性高的密码可使账号更安全。建议设置同时包含字母、数字和符号的复杂密码。</div>
                <div className="text-xs text-neutral-caption mt-1">当前密码强度：<span className="text-semantic-success font-medium">高</span></div>
              </div>
            </div>
            <Button variant="outline" size="sm">修改密码</Button>
          </div>

          {/* Email Bind */}
          <div className="flex items-center justify-between pb-6 border-b border-neutral-border/50">
            <div className="flex items-start gap-6">
              <div className="w-24 text-sm font-medium text-neutral-title">绑定邮箱</div>
              <div>
                <div className="text-sm text-neutral-body flex items-center gap-2">
                  已绑定：<span className="font-medium text-neutral-title">zhangsan@example.com</span>
                  <div className="flex items-center gap-1 text-[10px] text-semantic-success bg-semantic-success/10 px-1.5 py-0.5 rounded-[4px]">
                    <Check className="w-3 h-3" /> 验证通过
                  </div>
                </div>
                <div className="text-xs text-neutral-caption mt-1">您可使用此邮箱登录账号及找回密码。</div>
              </div>
            </div>
            <Button variant="outline" size="sm">更换邮箱</Button>
          </div>

          {/* Phone Bind */}
          <div className="flex items-center justify-between pb-6 border-b border-neutral-border/50">
            <div className="flex items-start gap-6">
              <div className="w-24 text-sm font-medium text-neutral-title">绑定手机</div>
              <div>
                <div className="text-sm text-neutral-body flex items-center gap-2">
                  已绑定：<span className="font-medium text-neutral-title">138****8888</span>
                  <div className="flex items-center gap-1 text-[10px] text-semantic-success bg-semantic-success/10 px-1.5 py-0.5 rounded-[4px]">
                    <Check className="w-3 h-3" /> 已验证
                  </div>
                </div>
                <div className="text-xs text-neutral-caption mt-1">绑定手机后可使用手机短信验证码登录。</div>
              </div>
            </div>
            <Button variant="outline" size="sm">更换手机</Button>
          </div>

          {/* Social Bind */}
          <div className="flex items-center justify-between pb-6">
            <div className="flex items-start gap-6">
              <div className="w-24 text-sm font-medium text-neutral-title">第三方账号</div>
              <div className="space-y-4">
                <div className="text-xs text-neutral-caption">绑定第三方平台账号后，可直接使用该账号快捷登录。</div>
                <div className="flex items-center gap-8">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#07C160] flex items-center justify-center text-white text-xs font-bold">微信</div>
                    <div className="text-sm">
                      <span className="text-neutral-body mr-2">未绑定</span>
                      <button className="text-primary hover:text-primary-hover text-sm">绑定</button>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#12B7F5] flex items-center justify-center text-white text-xs font-bold">QQ</div>
                    <div className="text-sm">
                      <span className="text-neutral-title mr-2">已绑定</span>
                      <button className="text-neutral-caption hover:text-neutral-title text-sm">解绑</button>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#24292E] flex items-center justify-center text-white text-xs font-bold">Git</div>
                    <div className="text-sm">
                      <span className="text-neutral-body mr-2">未绑定</span>
                      <button className="text-primary hover:text-primary-hover text-sm">绑定</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-neutral-border shadow-sm">
        <CardHeader className="pb-2 border-b border-neutral-border">
          <CardTitle className="text-base font-bold text-neutral-title flex items-center gap-2">
            <Laptop className="w-5 h-5 text-blue-500" />
            登录历史
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="border border-neutral-border rounded-[8px] overflow-hidden">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-neutral-caption bg-neutral-bg border-b border-neutral-border">
                <tr>
                  <th className="px-6 py-3 font-medium">登录时间</th>
                  <th className="px-6 py-3 font-medium">IP地址</th>
                  <th className="px-6 py-3 font-medium">登录设备与状态</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-neutral-border last:border-0 hover:bg-neutral-bg/50 transition-colors">
                  <td className="px-6 py-3">
                    <div className="text-neutral-title">2026-04-03 10:30:15</div>
                  </td>
                  <td className="px-6 py-3 text-neutral-body">192.168.1.115 (本省)</td>
                  <td className="px-6 py-3">
                    <div className="flex items-center justify-between">
                      <div className="text-neutral-title">Chrome (macOS)</div>
                      <span className="text-semantic-success text-xs bg-semantic-success/10 px-2 py-0.5 rounded-[4px]">登录成功</span>
                    </div>
                  </td>
                </tr>
                <tr className="border-b border-neutral-border last:border-0 hover:bg-neutral-bg/50 transition-colors">
                  <td className="px-6 py-3">
                    <div className="text-neutral-title">2026-04-02 09:12:33</div>
                  </td>
                  <td className="px-6 py-3 text-neutral-body">192.168.1.115 (本省)</td>
                  <td className="px-6 py-3">
                    <div className="flex items-center justify-between">
                      <div className="text-neutral-title">Safari (iOS)</div>
                      <span className="text-semantic-success text-xs bg-semantic-success/10 px-2 py-0.5 rounded-[4px]">登录成功</span>
                    </div>
                  </td>
                </tr>
                <tr className="border-b border-neutral-border last:border-0 hover:bg-neutral-bg/50 transition-colors">
                  <td className="px-6 py-3">
                    <div className="text-neutral-title">2026-04-01 22:45:10</div>
                  </td>
                  <td className="px-6 py-3 text-neutral-body">203.119.5.3 (异地登录)</td>
                  <td className="px-6 py-3">
                    <div className="flex items-center justify-between">
                      <div className="text-neutral-title">Firefox (Windows)</div>
                      <span className="text-semantic-error text-xs bg-semantic-error/10 px-2 py-0.5 rounded-[4px]">密码错误</span>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="mt-4 flex justify-center">
            <Button variant="ghost" size="sm" className="text-neutral-caption hover:text-primary flex items-center justify-center">
              查看全部历史 <ChevronRightIcon className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
