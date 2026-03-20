import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { User, Shield, Upload, Check, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function UserCenterProfile() {
  return (
    <div className="space-y-6">
      <div className="flex items-center text-sm text-neutral-caption mb-4">
        <Link to="/user" className="hover:text-primary cursor-pointer transition-colors">首页</Link>
        <ChevronRight className="w-4 h-4 mx-1" />
        <Link to="/user/center" className="hover:text-primary cursor-pointer transition-colors">个人中心</Link>
        <ChevronRight className="w-4 h-4 mx-1" />
        <span className="text-neutral-title font-medium">个人资料</span>
      </div>

      {/* 基本资料 */}
      <Card className="border-neutral-border shadow-sm">
        <CardHeader className="pb-2 border-b border-neutral-border">
          <CardTitle className="text-base font-bold text-neutral-title flex items-center gap-2">
            <User className="w-5 h-5 text-primary" />
            基本资料
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-8">
          {/* Avatar */}
          <div className="flex items-start gap-6">
            <div className="w-24 text-sm font-medium text-neutral-title pt-2">头像：</div>
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 rounded-full bg-neutral-bg border-2 border-primary/20 flex items-center justify-center overflow-hidden shrink-0">
                <User className="w-10 h-10 text-neutral-caption" />
              </div>
              <div>
                <Button variant="outline" size="sm" className="mb-2">
                  <Upload className="w-4 h-4 mr-2" />
                  上传头像
                </Button>
                <p className="text-xs text-neutral-caption">点击更换头像<br/>(支持JPG, PNG, 最大2MB)</p>
              </div>
            </div>
          </div>

          {/* Nickname */}
          <div className="flex items-start gap-6">
            <div className="w-24 text-sm font-medium text-neutral-title pt-2">昵称：</div>
            <div className="flex-1 max-w-md">
              <Input defaultValue="张三" className="mb-2" />
              <p className="text-xs text-neutral-caption">2-20个字符，支持中英文、数字、下划线</p>
            </div>
          </div>

          {/* Bio */}
          <div className="flex items-start gap-6">
            <div className="w-24 text-sm font-medium text-neutral-title pt-2">个人简介：</div>
            <div className="flex-1 max-w-2xl">
              <Textarea 
                defaultValue="我是一名计算机科学专业的学生，对人工智能领域充满热情，希望能在这里学习到更多前沿技术。" 
                className="h-24 mb-2 resize-none" 
              />
              <p className="text-xs text-neutral-caption">(支持Markdown, 最多500字)</p>
            </div>
          </div>

          {/* Contact */}
          <div className="flex items-start gap-6">
            <div className="w-24 text-sm font-medium text-neutral-title pt-2">联系方式：</div>
            <div className="flex-1 space-y-4 max-w-md">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="text-sm text-neutral-body w-16">邮箱：</span>
                  <span className="text-sm font-medium text-neutral-title">zhangsan@example.com</span>
                </div>
                <Button variant="outline" size="sm" className="h-7 text-xs">验证</Button>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="text-sm text-neutral-body w-16">手机号：</span>
                  <span className="text-sm font-medium text-neutral-title">138****8888</span>
                </div>
                <Button variant="outline" size="sm" className="h-7 text-xs">绑定</Button>
              </div>
            </div>
          </div>

          {/* Organization */}
          <div className="flex items-start gap-6">
            <div className="w-24 text-sm font-medium text-neutral-title pt-2">所属机构：</div>
            <div className="flex-1 space-y-3">
              <div className="flex items-center gap-4">
                <span className="text-sm text-neutral-body w-16">学校：</span>
                <span className="text-sm font-medium text-neutral-title">XX大学</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm text-neutral-body w-16">院系：</span>
                <span className="text-sm font-medium text-neutral-title">计算机科学与技术学院</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm text-neutral-body w-16">专业：</span>
                <span className="text-sm font-medium text-neutral-title">计算机科学与技术</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm text-neutral-body w-16">年级：</span>
                <span className="text-sm font-medium text-neutral-title">2021级</span>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-4 border-t border-neutral-border">
            <Button variant="outline">取消</Button>
            <Button className="bg-primary hover:bg-primary-hover text-white">保存</Button>
          </div>
        </CardContent>
      </Card>

      {/* 账号安全 */}
      <Card className="border-neutral-border shadow-sm">
        <CardHeader className="pb-2 border-b border-neutral-border">
          <CardTitle className="text-base font-bold text-neutral-title flex items-center gap-2">
            <Shield className="w-5 h-5 text-semantic-warning" />
            账号安全
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-8">
          {/* Password */}
          <div className="flex items-center justify-between">
            <div className="flex items-start gap-6">
              <div className="w-24 text-sm font-medium text-neutral-title">密码：</div>
              <div>
                <div className="text-sm font-medium text-neutral-title">********</div>
                <div className="text-xs text-neutral-caption mt-1">上次修改：30天前</div>
              </div>
            </div>
            <Button variant="outline" size="sm">修改密码</Button>
          </div>

          {/* Bindings */}
          <div className="flex items-start gap-6">
            <div className="w-24 text-sm font-medium text-neutral-title">绑定管理：</div>
            <div className="flex-1 space-y-4 max-w-md">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="text-sm text-neutral-body w-16">手机号：</span>
                  <span className="text-sm font-medium text-neutral-title">138****8888</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-semantic-success">
                  <Check className="w-4 h-4" /> 已绑定
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="text-sm text-neutral-body w-16">邮箱：</span>
                  <span className="text-sm font-medium text-neutral-title">zhangsan@example.com</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-semantic-success">
                  <Check className="w-4 h-4" /> 已绑定
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="text-sm text-neutral-body w-16">第三方：</span>
                  <div className="flex gap-3">
                    <span className="text-sm text-neutral-title">微信</span>
                    <span className="text-sm text-neutral-title">QQ</span>
                    <span className="text-sm text-neutral-title">GitHub</span>
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="h-7 text-xs text-primary hover:text-primary-hover hover:bg-primary/5">绑定 <ChevronRight className="w-3 h-3 ml-1" /></Button>
              </div>
            </div>
          </div>

          {/* Login History */}
          <div className="flex items-start gap-6">
            <div className="w-24 text-sm font-medium text-neutral-title pt-2">登录历史：</div>
            <div className="flex-1">
              <div className="border border-neutral-border rounded-[8px] overflow-hidden">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-neutral-caption uppercase bg-neutral-bg border-b border-neutral-border">
                    <tr>
                      <th className="px-4 py-2 font-medium">时间</th>
                      <th className="px-4 py-2 font-medium">IP地址</th>
                      <th className="px-4 py-2 font-medium">设备</th>
                      <th className="px-4 py-2 font-medium">状态</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-neutral-border last:border-0 hover:bg-neutral-bg/50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="text-neutral-title">2025-03-18</div>
                        <div className="text-xs text-neutral-caption">14:23:15</div>
                      </td>
                      <td className="px-4 py-3 text-neutral-body">192.168.1.1</td>
                      <td className="px-4 py-3">
                        <div className="text-neutral-title">Chrome</div>
                        <div className="text-xs text-neutral-caption">Windows</div>
                      </td>
                      <td className="px-4 py-3 text-semantic-success">成功</td>
                    </tr>
                    <tr className="border-b border-neutral-border last:border-0 hover:bg-neutral-bg/50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="text-neutral-title">2025-03-17</div>
                        <div className="text-xs text-neutral-caption">09:12:33</div>
                      </td>
                      <td className="px-4 py-3 text-neutral-body">192.168.1.2</td>
                      <td className="px-4 py-3">
                        <div className="text-neutral-title">Safari</div>
                        <div className="text-xs text-neutral-caption">macOS</div>
                      </td>
                      <td className="px-4 py-3 text-semantic-success">成功</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="mt-3 flex justify-end">
                <Button variant="ghost" size="sm" className="text-neutral-caption hover:text-primary">
                  查看全部 <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
