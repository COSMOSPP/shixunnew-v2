import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Search, 
  ChevronRight, 
  ChevronDown, 
  ChevronLeft,
  FileText,
  Clock,
  Award,
  PlayCircle,
  CheckCircle2,
  Calendar
} from "lucide-react";
import { cn } from "@/lib/utils";
import ExamDetail from "@/components/ExamDetail";
import ExamSession from "@/components/ExamSession";
import ExamResult from "@/components/ExamResult";

export default function UserExams() {
  const [selectedExam, setSelectedExam] = useState<any>(null);
  const [isTakingExam, setIsTakingExam] = useState(false);
  const [isViewingResult, setIsViewingResult] = useState(false);
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

  if (isViewingResult && selectedExam) {
    return <ExamResult exam={selectedExam} onBack={() => { setIsViewingResult(false); setSelectedExam(null); }} />;
  }

  if (isTakingExam && selectedExam) {
    return <ExamSession exam={selectedExam} onBack={() => setIsTakingExam(false)} onSubmit={() => { setIsTakingExam(false); setIsViewingResult(true); }} />;
  }

  if (selectedExam) {
    return <ExamDetail exam={selectedExam} onBack={() => setSelectedExam(null)} onStart={() => setIsTakingExam(true)} onViewResult={() => setIsViewingResult(true)} />;
  }

  return (
    <div className="flex flex-col bg-[#f5f6f8] relative">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-neutral-title">我的考试</h1>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 mb-8">
        <div className="flex items-start gap-4">
          <span className="text-[14px] text-neutral-body font-medium whitespace-nowrap mt-1.5">考试标签</span>
          <div className="flex flex-wrap gap-2">
            {["全部", "随堂测验", "阶段考试", "认证考试"].map((tag, i) => (
              <button 
                key={i}
                className={cn(
                  "px-4 py-1.5 rounded-full text-[13px] transition-colors",
                  i === 0 ? "bg-[#fa541c] text-white" : "bg-white border border-neutral-border text-neutral-body hover:text-[#fa541c] hover:border-[#fa541c]"
                )}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-start gap-4">
          <span className="text-[14px] text-neutral-body font-medium whitespace-nowrap mt-1.5">考试状态</span>
          <div className="flex flex-wrap gap-2">
            {["全部", "未开始", "进行中", "已结束"].map((tag, i) => (
              <button 
                key={i}
                className={cn(
                  "px-4 py-1.5 rounded-full text-[13px] transition-colors",
                  i === 0 ? "bg-[#fa541c] text-white" : "bg-white border border-neutral-border text-neutral-body hover:text-[#fa541c] hover:border-[#fa541c]"
                )}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs & Search */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center bg-white rounded-full p-1 border border-neutral-border">
          <button className="px-6 py-1.5 rounded-full text-[14px] font-medium bg-[#f5f6f8] text-neutral-title">
            最新
          </button>
          <button className="px-6 py-1.5 rounded-full text-[14px] font-medium text-neutral-body hover:text-neutral-title">
            最热
          </button>
        </div>
        
        <div className="relative w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-caption" />
          <Input 
            placeholder="输入考试名称搜索" 
            className="pl-9 h-10 text-[14px] rounded-full border-neutral-border bg-white focus-visible:ring-[#fa541c]" 
          />
        </div>
      </div>

      {/* Main Content Area */}
        <div className="flex-1 pr-2 pb-4">
            <div className="space-y-4">
              {exams.map((exam, i) => {
                const Icon = exam.icon;
                return (
                  <div key={i} onClick={() => setSelectedExam(exam)} className="bg-white rounded-[12px] border border-neutral-border shadow-sm hover:shadow-md transition-all p-5 flex items-center gap-6 group cursor-pointer">
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
                      {exam.status === "已结束" ? null : exam.status === "进行中" ? (
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

            {/* Load More / Pagination */}
            <div className="mt-8 flex items-center justify-between">
              <div className="flex items-center gap-1">
                <button className="w-8 h-8 flex items-center justify-center rounded-[4px] border border-neutral-border text-neutral-caption hover:text-[#fa541c] hover:border-[#fa541c] transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button className="w-8 h-8 flex items-center justify-center rounded-[4px] bg-[#fa541c] text-white font-medium">1</button>
                <button className="w-8 h-8 flex items-center justify-center rounded-[4px] border border-neutral-border text-neutral-body hover:text-[#fa541c] hover:border-[#fa541c] transition-colors">2</button>
                <button className="w-8 h-8 flex items-center justify-center rounded-[4px] border border-neutral-border text-neutral-body hover:text-[#fa541c] hover:border-[#fa541c] transition-colors">3</button>
                <span className="px-2 text-neutral-caption">...</span>
                <button className="w-8 h-8 flex items-center justify-center rounded-[4px] border border-neutral-border text-neutral-body hover:text-[#fa541c] hover:border-[#fa541c] transition-colors">8</button>
                <button className="w-8 h-8 flex items-center justify-center rounded-[4px] border border-neutral-border text-neutral-body hover:text-[#fa541c] hover:border-[#fa541c] transition-colors">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
              
              <div className="flex items-center gap-4 text-[13px] text-neutral-body">
                <div className="flex items-center gap-2">
                  <span>每页</span>
                  <button className="flex items-center gap-1 px-2 py-1 border border-neutral-border rounded-[4px] hover:border-[#fa541c] transition-colors">
                    10 <ChevronDown className="w-3 h-3" />
                  </button>
                  <span>条</span>
                </div>
                <span>共 75 个考试</span>
              </div>
            </div>
        </div>
    </div>
  );
}
