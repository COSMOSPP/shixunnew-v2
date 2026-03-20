import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Settings, LogOut, Edit, ChevronRight, BookOpen, FolderKanban, Award, Star, Clock, Trophy, FileText, LayoutDashboard } from "lucide-react";
import { Link } from "react-router-dom";

export default function UserCenterOverview() {
  return (
    <div className="space-y-6">
      <div className="flex items-center text-sm text-neutral-caption mb-4">
        <Link to="/user" className="hover:text-primary cursor-pointer transition-colors">首页</Link>
        <ChevronRight className="w-4 h-4 mx-1" />
        <span className="text-neutral-title font-medium">个人中心</span>
      </div>

      {/* Profile Summary */}
      <Card className="border-neutral-border shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-full bg-neutral-bg border-2 border-primary/20 flex items-center justify-center overflow-hidden shrink-0">
              <User className="w-10 h-10 text-neutral-caption" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-2">
                <h2 className="text-2xl font-bold text-neutral-title">张三</h2>
                <span className="px-2.5 py-1 bg-primary/10 text-primary text-xs font-medium rounded-[4px]">学生</span>
                <span className="text-sm text-neutral-body">计算机科学与技术学院</span>
                <span className="text-sm text-neutral-body">2021级</span>
              </div>
              <div className="flex items-center gap-3 mt-4">
                <Button variant="outline" size="sm" className="text-primary border-primary/20 hover:bg-primary/5" asChild>
                  <Link to="/user/center/profile">
                    <Edit className="w-4 h-4 mr-2" />
                    编辑资料
                  </Link>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <Link to="/user/center/profile">
                    <Settings className="w-4 h-4 mr-2" />
                    设置
                  </Link>
                </Button>
                <Button variant="outline" size="sm" className="text-semantic-error border-semantic-error/20 hover:bg-semantic-error/10 hover:text-semantic-error">
                  <LogOut className="w-4 h-4 mr-2" />
                  退出登录
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Learning Dashboard */}
        <div className="space-y-6">
          <Card className="border-neutral-border shadow-sm h-full">
            <CardHeader className="pb-2 border-b border-neutral-border">
              <CardTitle className="text-base font-bold text-neutral-title flex items-center gap-2">
                <LayoutDashboard className="w-5 h-5 text-primary" />
                学习仪表盘
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="p-4 bg-neutral-bg rounded-[8px] border border-neutral-border flex items-center justify-between">
                <div>
                  <div className="text-sm text-neutral-body mb-1">学习时长</div>
                  <div className="text-2xl font-bold text-neutral-title">125<span className="text-sm font-normal text-neutral-caption ml-1">小时</span></div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-neutral-caption mb-1">本月</div>
                  <div className="text-lg font-medium text-primary">32小时</div>
                </div>
              </div>
              <div className="p-4 bg-neutral-bg rounded-[8px] border border-neutral-border flex items-center justify-between">
                <div>
                  <div className="text-sm text-neutral-body mb-1">完成课程</div>
                  <div className="text-2xl font-bold text-neutral-title">12<span className="text-sm font-normal text-neutral-caption ml-1">门</span></div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-neutral-caption mb-1">完成率</div>
                  <div className="text-lg font-medium text-semantic-success">65%</div>
                </div>
              </div>
              <div className="p-4 bg-neutral-bg rounded-[8px] border border-neutral-border flex items-center justify-between">
                <div>
                  <div className="text-sm text-neutral-body mb-1">完成项目</div>
                  <div className="text-2xl font-bold text-neutral-title">8<span className="text-sm font-normal text-neutral-caption ml-1">个</span></div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-neutral-caption mb-1">进行中</div>
                  <div className="text-lg font-medium text-semantic-warning">3个</div>
                </div>
              </div>
              <Button variant="ghost" className="w-full text-neutral-caption hover:text-primary mt-2" asChild>
                <Link to="/user/center/learning">
                  查看详细统计 <ChevronRight className="w-4 h-4 ml-1" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Achievements & Certificates */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-neutral-border shadow-sm">
            <CardHeader className="pb-2 border-b border-neutral-border flex flex-row items-center justify-between">
              <CardTitle className="text-base font-bold text-neutral-title flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-500" />
                我的成就
              </CardTitle>
              <Link to="/user/center/certificates" className="text-sm text-neutral-caption hover:text-primary flex items-center">
                查看全部成就 <ChevronRight className="w-4 h-4 ml-1" />
              </Link>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex flex-wrap gap-4">
                {[
                  { name: "Python编程专家", icon: "🥇", color: "bg-amber-100 text-amber-700 border-amber-200" },
                  { name: "数据分析达人", icon: "🥈", color: "bg-slate-100 text-slate-700 border-slate-200" },
                  { name: "算法新星", icon: "🥉", color: "bg-orange-100 text-orange-700 border-orange-200" },
                  { name: "10连击完成", icon: "⭐", color: "bg-yellow-100 text-yellow-700 border-yellow-200" },
                  { name: "早起鸟", icon: "🌅", color: "bg-blue-100 text-blue-700 border-blue-200" },
                ].map((badge, i) => (
                  <div key={i} className={`flex items-center gap-2 px-3 py-2 rounded-[8px] border ${badge.color}`}>
                    <span className="text-lg">{badge.icon}</span>
                    <span className="text-sm font-medium">{badge.name}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-neutral-border shadow-sm">
            <CardHeader className="pb-2 border-b border-neutral-border flex flex-row items-center justify-between">
              <CardTitle className="text-base font-bold text-neutral-title flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-500" />
                我的证书
              </CardTitle>
              <Link to="/user/center/certificates" className="text-sm text-neutral-caption hover:text-primary flex items-center">
                查看全部证书 <ChevronRight className="w-4 h-4 ml-1" />
              </Link>
            </CardHeader>
            <CardContent className="p-6">
              <div className="p-4 border border-neutral-border rounded-[8px] flex items-center justify-between hover:border-primary/30 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-50 rounded-[8px] flex items-center justify-center border border-blue-100">
                    <Award className="w-6 h-6 text-blue-500" />
                  </div>
                  <div>
                    <h4 className="font-medium text-neutral-title">AI应用能力证书</h4>
                    <p className="text-sm text-neutral-caption mt-1">2025年3月 颁发</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">下载</Button>
                  <Button variant="outline" size="sm">分享</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-neutral-border shadow-sm">
          <CardHeader className="pb-2 border-b border-neutral-border flex flex-row items-center justify-between">
            <CardTitle className="text-base font-bold text-neutral-title flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-emerald-500" />
              我的学习
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="text-sm font-medium text-neutral-title mb-3">进行中课程</div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-neutral-body">Python入门</span>
                <span className="text-xs text-primary bg-primary/10 px-2 py-0.5 rounded-[4px]">80%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-neutral-body">机器学习实战</span>
                <span className="text-xs text-primary bg-primary/10 px-2 py-0.5 rounded-[4px]">45%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-neutral-body">深度学习进阶</span>
                <span className="text-xs text-primary bg-primary/10 px-2 py-0.5 rounded-[4px]">10%</span>
              </div>
            </div>
            <Button variant="ghost" className="w-full text-neutral-caption hover:text-primary mt-4" asChild>
              <Link to="/user/courses">
                查看全部课程 <ChevronRight className="w-4 h-4 ml-1" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="border-neutral-border shadow-sm">
          <CardHeader className="pb-2 border-b border-neutral-border flex flex-row items-center justify-between">
            <CardTitle className="text-base font-bold text-neutral-title flex items-center gap-2">
              <FolderKanban className="w-5 h-5 text-indigo-500" />
              我的项目
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="text-sm font-medium text-neutral-title mb-3">进行中项目</div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-neutral-body">图像分类项目</span>
                <span className="text-xs text-semantic-warning bg-semantic-warning/10 px-2 py-0.5 rounded-[4px]">开发中</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-neutral-body">NLP应用项目</span>
                <span className="text-xs text-semantic-warning bg-semantic-warning/10 px-2 py-0.5 rounded-[4px]">测试中</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-neutral-body">数据分析项目</span>
                <span className="text-xs text-semantic-warning bg-semantic-warning/10 px-2 py-0.5 rounded-[4px]">规划中</span>
              </div>
            </div>
            <Button variant="ghost" className="w-full text-neutral-caption hover:text-primary mt-4" asChild>
              <Link to="/user/center/projects">
                查看全部项目 <ChevronRight className="w-4 h-4 ml-1" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="border-neutral-border shadow-sm">
          <CardHeader className="pb-2 border-b border-neutral-border flex flex-row items-center justify-between">
            <CardTitle className="text-base font-bold text-neutral-title flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-500" />
              最佳实践
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="text-sm font-medium text-neutral-title mb-3">我发布的</div>
            <div className="flex items-center justify-center py-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-neutral-title mb-1">3<span className="text-sm font-normal text-neutral-caption ml-1">个</span></div>
                <div className="text-sm text-neutral-body">总使用量 1.2K</div>
              </div>
            </div>
            <Button variant="ghost" className="w-full text-neutral-caption hover:text-primary mt-4" asChild>
              <Link to="/user/center/projects">
                管理 <ChevronRight className="w-4 h-4 ml-1" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
