import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight, Award, Trophy, Medal, Download, Share2, Settings, Star, Zap, Flame, Calendar } from "lucide-react";
import { Link } from "react-router-dom";

export default function UserCenterCertificates() {
  return (
    <div className="space-y-6">
      <div className="flex items-center text-sm text-neutral-caption mb-4">
        <Link to="/user" className="hover:text-primary cursor-pointer transition-colors">首页</Link>
        <ChevronRight className="w-4 h-4 mx-1" />
        <Link to="/user/center" className="hover:text-primary cursor-pointer transition-colors">个人中心</Link>
        <ChevronRight className="w-4 h-4 mx-1" />
        <span className="text-neutral-title font-medium">证书徽章</span>
      </div>

      {/* 我的证书 */}
      <Card className="border-neutral-border shadow-sm">
        <CardHeader className="pb-2 border-b border-neutral-border">
          <CardTitle className="text-base font-bold text-neutral-title flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-500" />
            我的证书
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* 证书 1 */}
            <div className="p-5 border border-neutral-border rounded-[8px] hover:border-primary/30 transition-colors bg-neutral-bg/30">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 bg-blue-50 rounded-[8px] flex items-center justify-center border border-blue-100 shrink-0">
                  <Award className="w-6 h-6 text-blue-500" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-neutral-title">AI应用能力证书</h3>
                  <div className="text-sm text-neutral-body mt-2 space-y-1">
                    <p>颁发时间：2025-03</p>
                    <p>认证编号：AI2025-001</p>
                  </div>
                </div>
              </div>
              <div className="flex gap-3 mt-4 pt-4 border-t border-neutral-border">
                <Button variant="outline" size="sm" className="flex-1 text-primary border-primary/20 hover:bg-primary/5">
                  <Download className="w-4 h-4 mr-2" /> 下载
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  <Share2 className="w-4 h-4 mr-2" /> 分享
                </Button>
              </div>
            </div>

            {/* 证书 2 */}
            <div className="p-5 border border-neutral-border rounded-[8px] hover:border-primary/30 transition-colors bg-neutral-bg/30">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 bg-amber-50 rounded-[8px] flex items-center justify-center border border-amber-100 shrink-0">
                  <Medal className="w-6 h-6 text-amber-500" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-neutral-title">算法设计竞赛证书</h3>
                  <div className="text-sm text-neutral-body mt-2 space-y-1">
                    <p>颁发时间：2024-12</p>
                    <p>排名：第3名</p>
                  </div>
                </div>
              </div>
              <div className="flex gap-3 mt-4 pt-4 border-t border-neutral-border">
                <Button variant="outline" size="sm" className="flex-1 text-primary border-primary/20 hover:bg-primary/5">
                  <Download className="w-4 h-4 mr-2" /> 下载
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  <Share2 className="w-4 h-4 mr-2" /> 分享
                </Button>
              </div>
            </div>
          </div>
          <div className="flex justify-end">
            <Button variant="ghost" size="sm" className="text-neutral-caption hover:text-primary">
              查看全部证书 <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 我的成就徽章 */}
      <Card className="border-neutral-border shadow-sm">
        <CardHeader className="pb-2 border-b border-neutral-border">
          <CardTitle className="text-base font-bold text-neutral-title flex items-center gap-2">
            <Medal className="w-5 h-5 text-blue-500" />
            我的成就徽章
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex flex-wrap gap-6 mb-8">
            {[
              { name: "专家", icon: "🥇", color: "bg-amber-100 border-amber-200 text-amber-700" },
              { name: "达人", icon: "🥈", color: "bg-slate-100 border-slate-200 text-slate-700" },
              { name: "新星", icon: "🥉", color: "bg-orange-100 border-orange-200 text-orange-700" },
              { name: "10连击", icon: "⭐", color: "bg-yellow-100 border-yellow-200 text-yellow-700" },
              { name: "早起鸟", icon: "🌅", color: "bg-blue-100 border-blue-200 text-blue-700" },
              { name: "全勤", icon: "🔥", color: "bg-red-100 border-red-200 text-red-700" },
            ].map((badge, i) => (
              <div key={i} className="flex flex-col items-center gap-2">
                <div className={`w-16 h-16 rounded-full border-2 flex items-center justify-center text-3xl shadow-sm ${badge.color}`}>
                  {badge.icon}
                </div>
                <span className="text-sm font-medium text-neutral-title">{badge.name}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between border-t border-neutral-border pt-4">
            <div className="text-sm text-neutral-body">
              已获得：<span className="font-bold text-primary text-lg">7</span> / 50 个徽章
            </div>
            <Button variant="ghost" size="sm" className="text-neutral-caption hover:text-primary">
              查看全部徽章 <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 徽章墙 */}
      <Card className="border-neutral-border shadow-sm">
        <CardHeader className="pb-2 border-b border-neutral-border">
          <CardTitle className="text-base font-bold text-neutral-title flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-500" />
            徽章墙
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="relative border-l-2 border-neutral-border ml-4 pl-8 space-y-8 mb-8">
            {/* 2025 */}
            <div className="relative">
              <div className="absolute -left-[41px] top-0 w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold border-4 border-white shadow-sm">
                25
              </div>
              <h3 className="text-lg font-bold text-neutral-title mb-4">2025年</h3>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-3 p-3 bg-neutral-bg rounded-[8px] border border-neutral-border">
                  <div className="w-10 h-10 rounded-full bg-slate-100 border-2 border-slate-200 flex items-center justify-center text-xl">🥈</div>
                  <div>
                    <div className="text-sm font-bold text-neutral-title">数据分析达人</div>
                    <div className="text-xs text-neutral-caption">2025-01</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-neutral-bg rounded-[8px] border border-neutral-border">
                  <div className="w-10 h-10 rounded-full bg-orange-100 border-2 border-orange-200 flex items-center justify-center text-xl">🥉</div>
                  <div>
                    <div className="text-sm font-bold text-neutral-title">算法新星</div>
                    <div className="text-xs text-neutral-caption">2025-02</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-neutral-bg rounded-[8px] border border-neutral-border">
                  <div className="w-10 h-10 rounded-full bg-yellow-100 border-2 border-yellow-200 flex items-center justify-center text-xl">⭐</div>
                  <div>
                    <div className="text-sm font-bold text-neutral-title">10连击完成</div>
                    <div className="text-xs text-neutral-caption">2025-03</div>
                  </div>
                </div>
              </div>
            </div>

            {/* 2024 */}
            <div className="relative">
              <div className="absolute -left-[41px] top-0 w-6 h-6 rounded-full bg-neutral-caption text-white flex items-center justify-center text-xs font-bold border-4 border-white shadow-sm">
                24
              </div>
              <h3 className="text-lg font-bold text-neutral-title mb-4">2024年</h3>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-3 p-3 bg-neutral-bg rounded-[8px] border border-neutral-border">
                  <div className="w-10 h-10 rounded-full bg-amber-100 border-2 border-amber-200 flex items-center justify-center text-xl">🥇</div>
                  <div>
                    <div className="text-sm font-bold text-neutral-title">Python编程专家</div>
                    <div className="text-xs text-neutral-caption">2024-12</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-3 border-t border-neutral-border pt-6">
            <Button variant="outline" className="text-primary border-primary/20 hover:bg-primary/5">
              <Settings className="w-4 h-4 mr-2" /> 自定义徽章墙
            </Button>
            <Button variant="outline">
              <Share2 className="w-4 h-4 mr-2" /> 分享
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
