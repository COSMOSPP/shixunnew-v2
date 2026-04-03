import React, { useState } from "react";
import { ChevronRight, Clock, MonitorPlay, FolderKanban, History } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function UserCenterHistory() {
  const [activeTab, setActiveTab] = useState("learning");

  const tabs = [
    { id: "learning", label: "最近学习记录", icon: Clock },
    { id: "browsing", label: "浏览历史", icon: History },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center text-sm text-neutral-caption mb-4">
        <Link to="/user" className="hover:text-primary cursor-pointer transition-colors">首页</Link>
        <ChevronRight className="w-4 h-4 mx-1" />
        <Link to="/user/center" className="hover:text-primary cursor-pointer transition-colors">个人中心</Link>
        <ChevronRight className="w-4 h-4 mx-1" />
        <span className="text-neutral-title font-medium">历史记录</span>
      </div>

      <div className="bg-white rounded-xl border border-neutral-border shadow-sm p-6 min-h-[600px]">
        {/* Tabs */}
        <div className="flex gap-6 border-b border-neutral-border mb-6">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "pb-3 text-[15px] font-medium transition-colors relative flex items-center gap-2",
                activeTab === tab.id 
                  ? "text-primary" 
                  : "text-neutral-body hover:text-neutral-title"
              )}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
              {activeTab === tab.id && (
                <div className="absolute bottom-[-1px] left-0 right-0 h-[2px] bg-primary rounded-t-full" />
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="relative border-l-2 border-neutral-border/50 ml-6 pl-6 space-y-8 pb-8">
          {activeTab === "learning" && (
            <>
              {/* Today */}
              <div className="relative">
                <div className="absolute w-3 h-3 bg-primary rounded-full -left-[31px] top-1.5 ring-4 ring-primary/20" />
                <h3 className="text-base font-bold text-neutral-title mb-4">今天</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 border border-neutral-border rounded-lg hover:bg-neutral-bg transition-colors">
                    <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center shrink-0">
                      <MonitorPlay className="w-6 h-6 text-blue-500" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-neutral-title">Python数据分析与实战</h4>
                      <div className="text-sm text-neutral-body mt-1">学习至 第4章: Pandas数据处理 - 数据清洗</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-primary">学习 45 分钟</div>
                      <div className="text-xs text-neutral-caption mt-1">10:30 - 11:15</div>
                    </div>
                    <Button variant="outline" size="sm" className="ml-4 h-8">继续学习</Button>
                  </div>
                </div>
              </div>

              {/* Yesterday */}
              <div className="relative">
                <div className="absolute w-3 h-3 bg-neutral-border rounded-full -left-[31px] top-1.5" />
                <h3 className="text-base font-bold text-neutral-title mb-4">昨天</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 border border-neutral-border rounded-lg hover:bg-neutral-bg transition-colors">
                    <div className="w-12 h-12 bg-indigo-50 rounded-lg flex items-center justify-center shrink-0">
                      <FolderKanban className="w-6 h-6 text-indigo-500" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-neutral-title">个人博客系统开发 (项目实训)</h4>
                      <div className="text-sm text-neutral-body mt-1">完成任务: 用户认证与鉴权模块设计</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-primary">学习 1.5 小时</div>
                      <div className="text-xs text-neutral-caption mt-1">14:00 - 15:30</div>
                    </div>
                    <Button variant="outline" size="sm" className="ml-4 h-8">进入项目</Button>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === "browsing" && (
            <>
              {/* Today Browsing */}
              <div className="relative">
                <div className="absolute w-3 h-3 bg-primary rounded-full -left-[31px] top-1.5 ring-4 ring-primary/20" />
                <h3 className="text-base font-bold text-neutral-title mb-4">今天</h3>
                <div className="space-y-0 relative before:absolute before:inset-0 before:ml-[31px] before:-translate-x-px md:before:mx-auto md:before:translate-x-0">
                  <div className="relative flex items-center justify-between gap-4 py-3 group">
                    <div className="flex items-center gap-3 w-full">
                      <span className="text-sm text-neutral-caption w-16">11:42</span>
                      <span className="px-2 py-0.5 bg-neutral-bg text-neutral-body text-xs rounded">课程介绍</span>
                      <span className="text-sm text-neutral-title hover:text-primary cursor-pointer transition-colors line-clamp-1">《深度学习基础：神经网络原理与实践》</span>
                    </div>
                  </div>
                  <div className="relative flex items-center justify-between gap-4 py-3 group">
                    <div className="flex items-center gap-3 w-full">
                      <span className="text-sm text-neutral-caption w-16">10:15</span>
                      <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-xs rounded">视频学习</span>
                      <span className="text-sm text-neutral-title hover:text-primary cursor-pointer transition-colors line-clamp-1">Python数据分析与实战 - 环境搭建</span>
                    </div>
                  </div>
                  <div className="relative flex items-center justify-between gap-4 py-3 group">
                    <div className="flex items-center gap-3 w-full">
                      <span className="text-sm text-neutral-caption w-16">09:30</span>
                      <span className="px-2 py-0.5 bg-indigo-50 text-indigo-600 text-xs rounded">项目大厅</span>
                      <span className="text-sm text-neutral-title hover:text-primary cursor-pointer transition-colors line-clamp-1">浏览了多个前端实战项目</span>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
