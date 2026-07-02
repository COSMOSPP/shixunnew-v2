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
  Calendar,
  MapPin,
  RefreshCw
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
      examName: "2026年春季网络安全基础认证考试",
      sessionName: "第一场 (A卷)",
      examRoom: "网络安全实验室-302",
      sessionStatus: "进行中",
      status: "进行中",
      startTime: "2026-07-02 09:00",
      endTime: "2026-07-02 11:30",
      candidateStatus: "未交卷",
      attempts: 0,
      maxAttempts: 9,
      type: "认证考试",
      duration: "120分钟",
      score: null,
      totalScore: 100,
      passScore: 60,
      icon: Award,
      color: "text-purple-500 bg-purple-50"
    },
    {
      title: "Python 编程进阶阶段测试",
      examName: "Python 编程进阶阶段测试",
      sessionName: "期中机考",
      examRoom: "软件工程实训室-501",
      sessionStatus: "未开始",
      status: "未开始",
      startTime: "2026-07-05 14:00",
      endTime: "2026-07-05 15:30",
      candidateStatus: "未登录",
      attempts: 0,
      maxAttempts: 1,
      type: "阶段考试",
      duration: "90分钟",
      score: null,
      totalScore: 100,
      passScore: 60,
      icon: Calendar,
      color: "text-blue-500 bg-blue-50"
    },
    {
      title: "Linux 常用命令随堂小测",
      examName: "Linux 常用命令随堂小测",
      sessionName: "第三次周测",
      examRoom: "线上考场 (防作弊模式)",
      sessionStatus: "已结束",
      status: "已结束",
      startTime: "2026-06-25 10:00",
      endTime: "2026-06-25 10:45",
      candidateStatus: "已交卷",
      attempts: 1,
      maxAttempts: 1,
      type: "随堂测验",
      duration: "30分钟",
      score: 95,
      totalScore: 100,
      passScore: 60,
      icon: FileText,
      color: "text-emerald-500 bg-emerald-50"
    },
    {
      title: "云计算架构设计师认证 (初级)",
      examName: "云计算架构设计师认证 (初级)",
      sessionName: "第一批次",
      examRoom: "云计算实训中心-204",
      sessionStatus: "已结束",
      status: "已结束",
      startTime: "2026-06-20 14:00",
      endTime: "2026-06-20 16:30",
      candidateStatus: "已交卷",
      attempts: 1,
      maxAttempts: 3,
      type: "认证考试",
      duration: "150分钟",
      score: 88,
      totalScore: 100,
      passScore: 70,
      icon: Award,
      color: "text-purple-500 bg-purple-50"
    },
    {
      title: "前端开发基础随堂测验",
      examName: "前端开发基础随堂测验",
      sessionName: "HTML/CSS阶段考",
      examRoom: "移动开发实训室-403",
      sessionStatus: "已结束",
      status: "已结束",
      startTime: "2026-06-15 10:00",
      endTime: "2026-06-15 10:45",
      candidateStatus: "已交卷",
      attempts: 2,
      maxAttempts: 5,
      type: "随堂测验",
      duration: "45分钟",
      score: 92,
      totalScore: 100,
      passScore: 60,
      icon: FileText,
      color: "text-emerald-500 bg-emerald-50"
    },
    {
      title: "数据库原理与应用阶段测试",
      examName: "数据库原理与应用阶段测试",
      sessionName: "SQL专题考核",
      examRoom: "数据科学中心-102",
      sessionStatus: "已结束",
      status: "已结束",
      startTime: "2026-06-10 14:00",
      endTime: "2026-06-10 16:00",
      candidateStatus: "已交卷",
      attempts: 1,
      maxAttempts: 2,
      type: "阶段考试",
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
                      {/* 考试名称 and Badges */}
                      <div className="flex flex-wrap items-center gap-3 mb-3">
                        <h3 className="text-[16px] font-bold text-neutral-title truncate group-hover:text-[#fa541c] transition-colors max-w-md">
                          {exam.examName}
                        </h3>
                        
                        {/* 场次状态 */}
                        {exam.sessionStatus === "未开始" && (
                          <span className="inline-block px-2.5 py-0.5 rounded-[4px] bg-blue-50 text-blue-600 border border-blue-200 text-[12px] font-medium flex-shrink-0">
                            场次：未开始
                          </span>
                        )}
                        {exam.sessionStatus === "进行中" && (
                          <span className="inline-block px-2.5 py-0.5 rounded-[4px] bg-green-50 text-green-600 border border-green-200 text-[12px] font-medium flex-shrink-0 animate-pulse">
                            场次：进行中
                          </span>
                        )}
                        {exam.sessionStatus === "已结束" && (
                          <span className="inline-block px-2.5 py-0.5 rounded-[4px] bg-gray-50 text-gray-500 border border-gray-200 text-[12px] font-medium flex-shrink-0">
                            场次：已结束
                          </span>
                        )}

                        {/* 考生状态 */}
                        {exam.candidateStatus === "未登录" && (
                          <span className="inline-block px-2.5 py-0.5 rounded-[4px] bg-neutral-100 text-neutral-500 border border-neutral-200 text-[12px] font-medium flex-shrink-0">
                            考生：未登录
                          </span>
                        )}
                        {exam.candidateStatus === "未交卷" && (
                          <span className="inline-block px-2.5 py-0.5 rounded-[4px] bg-amber-50 text-amber-600 border border-amber-200 text-[12px] font-medium flex-shrink-0">
                            考生：未交卷
                          </span>
                        )}
                        {exam.candidateStatus === "已交卷" && (
                          <span className="inline-block px-2.5 py-0.5 rounded-[4px] bg-emerald-50 text-emerald-600 border border-emerald-200 text-[12px] font-medium flex-shrink-0">
                            考生：已交卷
                          </span>
                        )}
                      </div>
                      
                      {/* Grid info: 场次名称, 考场, 考试次数 */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-y-2 gap-x-6 text-[13px] text-neutral-body mb-2.5">
                        <div className="flex items-center gap-1.5">
                          <FileText className="w-4 h-4 text-neutral-caption shrink-0" />
                          <span className="truncate">场次名称：{exam.sessionName}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-4 h-4 text-neutral-caption shrink-0" />
                          <span className="truncate">考场：{exam.examRoom}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <RefreshCw className="w-4 h-4 text-neutral-caption shrink-0" />
                          <span>考试次数：<strong className="text-neutral-title font-semibold">{exam.attempts}</strong>/{exam.maxAttempts}</span>
                        </div>
                      </div>

                      {/* Time details */}
                      <div className="flex flex-wrap items-center gap-x-6 gap-y-1 text-[13px] text-neutral-body">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-4 h-4 text-neutral-caption shrink-0" />
                          <span>开始时间：{exam.startTime}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-4 h-4 text-neutral-caption shrink-0" />
                          <span>结束时间：{exam.endTime}</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Buttons module */}
                    <div className="flex flex-col gap-2.5 flex-shrink-0 min-w-[110px]" onClick={(e) => e.stopPropagation()}>
                      <Button 
                        onClick={() => {
                          setSelectedExam(exam);
                          setIsTakingExam(true);
                        }}
                        disabled={exam.sessionStatus === "已结束" || exam.candidateStatus === "已交卷" || exam.attempts >= exam.maxAttempts}
                        className={cn(
                          "w-full h-9 text-[13px] rounded-[6px] transition-all gap-1.5 font-medium flex items-center justify-center",
                          (exam.sessionStatus === "已结束" || exam.candidateStatus === "已交卷" || exam.attempts >= exam.maxAttempts)
                            ? "bg-neutral-100 border border-neutral-200 text-neutral-400 cursor-not-allowed opacity-60"
                            : "bg-[#fa541c] hover:bg-[#ff7a45] text-white shadow-sm"
                        )}
                      >
                        <PlayCircle className="w-4 h-4" />
                        开始考试
                      </Button>
                      
                      <Button 
                        variant="outline"
                        onClick={() => {
                          setSelectedExam(exam);
                          setIsViewingResult(true);
                        }}
                        disabled={exam.candidateStatus !== "已交卷" && exam.sessionStatus !== "已结束"}
                        className={cn(
                          "w-full h-9 text-[13px] rounded-[6px] transition-all gap-1.5 font-medium flex items-center justify-center",
                          (exam.candidateStatus !== "已交卷" && exam.sessionStatus !== "已结束")
                            ? "bg-neutral-50 border border-neutral-200 text-neutral-300 cursor-not-allowed"
                            : "border-neutral-border text-neutral-body hover:text-[#fa541c] hover:border-[#fa541c]"
                        )}
                      >
                        <FileText className="w-4 h-4" />
                        查看试卷
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-end p-4 gap-4 mt-8">
              <span className="text-[13px] text-neutral-500">共 75 条</span>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="h-7 w-7 p-0 rounded-[4px]" disabled>&lt;</Button>
                <Button variant="outline" size="sm" className="h-7 w-7 p-0 rounded-[4px] bg-[#fa541c] text-white border-[#fa541c]">1</Button>
                <Button variant="outline" size="sm" className="h-7 w-7 p-0 rounded-[4px]">2</Button>
                <Button variant="outline" size="sm" className="h-7 w-7 p-0 rounded-[4px]">3</Button>
                <span className="px-1 text-neutral-caption text-[13px]">...</span>
                <Button variant="outline" size="sm" className="h-7 w-7 p-0 rounded-[4px]">&gt;</Button>
              </div>
              <div className="relative bg-white rounded-[6px]">
                <select className="appearance-none text-[13px] border border-neutral-200 hover:border-[#fa541c]/60 focus:border-[#fa541c] rounded-[6px] pl-3 pr-8 py-1 focus:outline-none text-neutral-600 bg-white cursor-pointer h-7 transition-colors min-w-[95px] shadow-sm">
                  <option className="bg-white">10 条/页</option>
                  <option className="bg-white">20 条/页</option>
                  <option className="bg-white">50 条/页</option>
                </select>
                <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-400">
                  <ChevronDown className="w-3 h-3" />
                </div>
              </div>
            </div>
        </div>
    </div>
  );
}
