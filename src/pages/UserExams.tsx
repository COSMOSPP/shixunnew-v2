import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Search, 
  ChevronRight, 
  ChevronDown, 
  ChevronLeft,
  Filter,
  FileText,
  Clock,
  Award,
  PlayCircle,
  CheckCircle2,
  Calendar
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function UserExams() {
  const exams = [
    {
      title: "2026年春季网络安全基础认证考试",
      type: "认证考试",
      status: "未开始",
      startTime: "2026-04-15 14:00",
      duration: "120分钟",
      score: null,
      totalScore: 100,
      passScore: 60,
      icon: Award,
      color: "text-purple-500 bg-purple-50"
    },
    {
      title: "Python 编程进阶阶段测试",
      type: "阶段考试",
      status: "进行中",
      startTime: "2026-03-16 09:00",
      duration: "90分钟",
      score: null,
      totalScore: 100,
      passScore: 60,
      icon: Calendar,
      color: "text-blue-500 bg-blue-50"
    },
    {
      title: "Linux 常用命令随堂小测",
      type: "随堂测验",
      status: "已结束",
      startTime: "2026-03-10 10:00",
      duration: "30分钟",
      score: 95,
      totalScore: 100,
      passScore: 60,
      icon: FileText,
      color: "text-emerald-500 bg-emerald-50"
    },
    {
      title: "云计算架构设计师认证 (初级)",
      type: "认证考试",
      status: "已结束",
      startTime: "2026-02-20 14:00",
      duration: "150分钟",
      score: 88,
      totalScore: 100,
      passScore: 70,
      icon: Award,
      color: "text-purple-500 bg-purple-50"
    },
    {
      title: "前端开发基础随堂测验",
      type: "随堂测验",
      status: "已结束",
      startTime: "2026-02-15 10:00",
      duration: "45分钟",
      score: 92,
      totalScore: 100,
      passScore: 60,
      icon: FileText,
      color: "text-emerald-500 bg-emerald-50"
    },
    {
      title: "数据库原理与应用阶段测试",
      type: "阶段考试",
      status: "已结束",
      startTime: "2026-01-25 14:00",
      duration: "120分钟",
      score: 78,
      totalScore: 100,
      passScore: 60,
      icon: Calendar,
      color: "text-blue-500 bg-blue-50"
    }
  ];

  return (
    <div className="flex flex-col h-full bg-[#f5f6f8]">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-[14px] text-neutral-body mb-4">
        <Link to="/user" className="hover:text-[#fa541c] transition-colors">首页</Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-neutral-body">学习中心</span>
        <ChevronRight className="w-4 h-4" />
        <span className="text-neutral-title font-medium">我的考试</span>
      </div>

      {/* Search Bar */}
      <div className="mb-4 flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-caption" />
          <Input 
            placeholder="搜索考试..." 
            className="pl-10 h-10 text-[14px] rounded-[6px] border-neutral-border bg-white focus-visible:ring-[#fa541c]" 
          />
        </div>
        <Button className="h-10 px-6 bg-[#fa541c] hover:bg-[#ff7a45] text-white rounded-[6px] text-[14px]">
          搜索
        </Button>
      </div>

      {/* Filter Bar */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <span className="text-[14px] font-medium text-neutral-title flex items-center gap-1">
            <Filter className="w-4 h-4" /> 筛选:
          </span>
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-1 text-[14px] text-neutral-body hover:text-[#fa541c] transition-colors">
              考试状态 <ChevronDown className="w-4 h-4" />
            </button>
            <button className="flex items-center gap-1 text-[14px] text-neutral-body hover:text-[#fa541c] transition-colors">
              时间范围 <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        </div>
        <button className="text-[14px] text-neutral-caption hover:text-[#fa541c] transition-colors">
          清除筛选
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-1 gap-6 min-h-0">
        {/* Exams List */}
        <div className="flex-1 flex flex-col min-h-0">
          <div className="flex-1 overflow-y-auto pr-2 pb-4">
            <div className="space-y-4">
              {exams.map((exam, i) => {
                const Icon = exam.icon;
                return (
                  <div key={i} className="bg-white rounded-[8px] border border-neutral-border shadow-sm hover:shadow-md transition-all p-5 flex items-center gap-6 group">
                    <div className={cn("w-14 h-14 rounded-[12px] flex items-center justify-center flex-shrink-0", exam.color)}>
                      <Icon className="w-7 h-7" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-[16px] font-bold text-neutral-title truncate group-hover:text-[#fa541c] transition-colors">
                          {exam.title}
                        </h3>
                        <span className="inline-block px-2 py-0.5 rounded-[4px] bg-neutral-bg text-neutral-body text-[12px] flex-shrink-0">
                          {exam.type}
                        </span>
                        {exam.status === "未开始" && (
                          <span className="inline-block px-2 py-0.5 rounded-[4px] bg-blue-50 text-blue-600 border border-blue-200 text-[12px] flex-shrink-0">
                            未开始
                          </span>
                        )}
                        {exam.status === "进行中" && (
                          <span className="inline-block px-2 py-0.5 rounded-[4px] bg-green-50 text-green-600 border border-green-200 text-[12px] flex-shrink-0">
                            进行中
                          </span>
                        )}
                        {exam.status === "已结束" && (
                          <span className="inline-block px-2 py-0.5 rounded-[4px] bg-gray-50 text-gray-600 border border-gray-200 text-[12px] flex-shrink-0">
                            已结束
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-6 text-[13px] text-neutral-body">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-4 h-4 text-neutral-caption" />
                          <span>开始时间：{exam.startTime}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-4 h-4 text-neutral-caption" />
                          <span>时长：{exam.duration}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <FileText className="w-4 h-4 text-neutral-caption" />
                          <span>总分：{exam.totalScore}分 (及格：{exam.passScore}分)</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-end gap-3 flex-shrink-0 min-w-[120px]">
                      {exam.status === "已结束" ? (
                        <div className="text-center">
                          <div className="text-[24px] font-bold text-[#fa541c] leading-none mb-1">
                            {exam.score}
                          </div>
                          <div className="text-[12px] text-neutral-caption">最终得分</div>
                        </div>
                      ) : exam.status === "进行中" ? (
                        <Button className="w-full h-9 text-[13px] rounded-[6px] bg-[#fa541c] hover:bg-[#ff7a45] text-white gap-1.5">
                          <PlayCircle className="w-4 h-4" />
                          继续考试
                        </Button>
                      ) : (
                        <Button className="w-full h-9 text-[13px] rounded-[6px] bg-[#fa541c] hover:bg-[#ff7a45] text-white gap-1.5">
                          <PlayCircle className="w-4 h-4" />
                          开始考试
                        </Button>
                      )}
                      
                      {exam.status === "已结束" && (
                        <Button variant="outline" className="w-full h-8 text-[12px] rounded-[6px] border-neutral-border text-neutral-body hover:text-[#fa541c] hover:border-[#fa541c]">
                          查看解析
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination */}
            <div className="mt-8 flex items-center justify-between border-t border-neutral-border pt-6 pb-2">
              <div className="flex items-center gap-1">
                <button className="w-8 h-8 flex items-center justify-center rounded-[6px] border border-neutral-border text-neutral-caption hover:border-[#fa541c] hover:text-[#fa541c] transition-colors disabled:opacity-50 disabled:hover:border-neutral-border disabled:hover:text-neutral-caption" disabled>
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button className="w-8 h-8 flex items-center justify-center rounded-[6px] bg-[#fa541c] text-white font-medium text-[14px]">
                  1
                </button>
                <button className="w-8 h-8 flex items-center justify-center rounded-[6px] border border-neutral-border text-neutral-body hover:border-[#fa541c] hover:text-[#fa541c] transition-colors text-[14px]">
                  2
                </button>
                <button className="w-8 h-8 flex items-center justify-center rounded-[6px] border border-neutral-border text-neutral-body hover:border-[#fa541c] hover:text-[#fa541c] transition-colors text-[14px]">
                  3
                </button>
                <span className="w-8 h-8 flex items-center justify-center text-neutral-caption">...</span>
                <button className="w-8 h-8 flex items-center justify-center rounded-[6px] border border-neutral-border text-neutral-body hover:border-[#fa541c] hover:text-[#fa541c] transition-colors text-[14px]">
                  8
                </button>
                <button className="w-8 h-8 flex items-center justify-center rounded-[6px] border border-neutral-border text-neutral-body hover:border-[#fa541c] hover:text-[#fa541c] transition-colors">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
              
              <div className="flex items-center gap-4 text-[13px] text-neutral-body">
                <div className="flex items-center gap-2">
                  <span>每页</span>
                  <button className="flex items-center gap-1 px-2 py-1 border border-neutral-border rounded-[4px] hover:border-[#fa541c] transition-colors">
                    10 <ChevronDown className="w-3 h-3" />
                  </button>
                  <span>个</span>
                </div>
                <span>共 75 个考试</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
