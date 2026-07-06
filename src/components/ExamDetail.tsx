import React, { useState, useEffect } from 'react';
import { ChevronLeft, Info, Clock, Calendar, CheckSquare, AlertCircle, FileText, CheckCircle2, History, PlayCircle, BarChart2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ExamDetailProps {
  exam: any;
  onBack: () => void;
  onStart: () => void;
  onViewResult: () => void;
}

export default function ExamDetail({ exam, onBack, onStart, onViewResult }: ExamDetailProps) {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    if (exam.status !== "未开始") return;
    
    const calculateTimeLeft = () => {
      const targetDate = new Date(exam.startTime.replace(/-/g, "/"));
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();
      
      if (difference <= 0) {
        return "考试已开始";
      }
      
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / 1000 / 60) % 60);
      const seconds = Math.floor((difference / 1000) % 60);
      
      let result = "";
      if (days > 0) result += `${days}天 `;
      result += `${hours.toString().padStart(2, '0')}小时 `;
      result += `${minutes.toString().padStart(2, '0')}分 `;
      result += `${seconds.toString().padStart(2, '0')}秒`;
      
      return result;
    };

    setTimeLeft(calculateTimeLeft());
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [exam.startTime, exam.status]);

  return (
    <div className="flex flex-col h-full bg-[#f5f6f8] relative w-[100vw] left-1/2 -translate-x-1/2 -mt-6">
      {/* Detail Header Wrapper */}
      <div className="bg-white border-b border-neutral-border pt-8 pb-6 px-14 relative">
        <div className="max-w-6xl mx-auto flex gap-8 items-start relative z-10">
          <div className="flex-1">
             <div className="flex items-center text-[13px] text-neutral-caption mb-6">
                <button onClick={onBack} className="hover:text-[#fa541c] flex items-center gap-1">
                  <ChevronLeft className="w-4 h-4" /> 返回我的考试
                </button>
                <span className="mx-2">/</span>
                <span className="text-neutral-title font-medium">{exam.title}</span>
             </div>
             <div>
                <div className={`flex items-center gap-3 ${exam.status === "未开始" ? "mb-6" : "mb-3"}`}>
                   <h1 className="text-2xl font-bold text-neutral-title">{exam.title}</h1>
                   <span className="px-2 py-1 bg-[#fa541c]/10 text-[#fa541c] text-[12px] font-bold rounded">{exam.type}</span>
                   {exam.status === "已结束" && <span className="px-2 py-1 bg-gray-50 text-gray-600 border border-gray-200 text-[12px] rounded">已结束</span>}
                </div>
                {exam.status !== "未开始" && (
                   <p className="text-[14px] text-neutral-body mb-6 max-w-3xl leading-relaxed">
                      本次考试为综合能力水平测验，依据大纲标准严格出题，旨在全面评估学员的专业知识掌握情况及实践应用能力。请准备好良好的网络环境并遵守考场纪律。
                   </p>
                )}

                <div className="flex flex-wrap items-center gap-6 mb-8 text-[14px]">
                   <div className="flex items-center gap-2 text-neutral-body">
                      <Clock className="w-4 h-4 text-neutral-caption" />
                      时长限制: <span className="font-bold text-neutral-title">{exam.duration}</span>
                   </div>
                   <div className="flex items-center gap-2 text-neutral-body">
                      <Calendar className="w-4 h-4 text-neutral-caption" />
                      考试时间: <span className="font-bold text-neutral-title">{exam.startTime}</span>
                   </div>
                   {exam.status !== "未开始" && (
                     <>
                       <div className="flex items-center gap-2 text-neutral-body">
                          <CheckSquare className="w-4 h-4 text-neutral-caption" />
                          题目总数: <span className="font-bold text-neutral-title">50 题</span>
                       </div>
                       <div className="flex items-center gap-2 text-neutral-body">
                          <FileText className="w-4 h-4 text-neutral-caption" />
                          及格线: <span className="font-bold text-[#fa541c]">{exam.passScore} 分</span> / {exam.totalScore} 分
                       </div>
                     </>
                   )}
                </div>

                <div className="flex items-center gap-4">
                  {exam.status === "未开始" ? (
                     <Button disabled className="h-11 px-8 rounded-[8px] bg-neutral-200 text-neutral-400 font-bold">
                        考试未开始
                     </Button>
                  ) : (exam.status === "进行中" || exam.attempts < exam.maxAttempts) ? (
                      <Button 
                        onClick={onStart} 
                        disabled={exam.attempts >= exam.maxAttempts}
                        className={`h-11 px-8 rounded-[8px] font-bold shadow-md ${
                          exam.attempts >= exam.maxAttempts
                            ? "bg-neutral-200 text-neutral-400 cursor-not-allowed"
                            : "bg-[#fa541c] hover:bg-[#d4380d] text-white"
                        }`}
                      >
                         <PlayCircle className="w-5 h-5 mr-2" />
                         {exam.attempts >= exam.maxAttempts ? "考试次数已达上限" : "开始考试"}
                      </Button>
                  ) : (
                     <>
                       <Button onClick={onViewResult} className="h-11 px-8 rounded-[8px] bg-white border border-[#fa541c] text-[#fa541c] hover:bg-[#fff2e8] font-bold">
                          <BarChart2 className="w-5 h-5 mr-2" /> 查看成绩
                       </Button>
                       <Button variant="outline" className="h-11 px-8 rounded-[8px] border-neutral-300">
                          查看答案与解析
                       </Button>
                     </>
                  )}
                </div>
             </div>
          </div>
          
          {/* Status large visual block */}
          {exam.status === "未开始" ? (
            <div className="w-72 bg-[#fafafa] border border-neutral-border rounded-[12px] p-6 shrink-0 shadow-sm">
               <div className="mb-4 flex items-center gap-2 border-b border-neutral-border pb-3">
                  <Clock className="w-5 h-5 text-[#fa541c]" />
                  <h3 className="font-bold text-neutral-title">距离考试开始还剩</h3>
               </div>
               <div className="flex flex-col items-center justify-center py-4 bg-white rounded-lg border border-neutral-border">
                  <span className="text-[17px] font-bold text-[#fa541c] tracking-wider font-mono">
                     {timeLeft || "计算中..."}
                  </span>
               </div>
               <div className="mt-4 text-[12px] text-neutral-caption text-center">
                  考试开始前请耐心等待，并保持网络畅通
               </div>
            </div>
          ) : (
            <div className="w-72 bg-[#fafafa] border border-neutral-border rounded-[12px] p-6 shrink-0 shadow-sm">
               <div className="mb-4 flex items-center gap-2 border-b border-neutral-border pb-3">
                  <History className="w-5 h-5 text-neutral-title" />
                  <h3 className="font-bold text-neutral-title">提交记录</h3>
               </div>
               {(exam.maxAttempts > 1 && exam.attempts > 0) ? (
                 <div className="space-y-4 text-[13px]">
                    <div className="flex justify-between items-center bg-white p-3 rounded border border-neutral-border shadow-sm">
                       <div className="text-neutral-caption">已提交次数</div>
                       <div className="font-bold text-neutral-title">{exam.attempts} 次</div>
                    </div>
                    <div className="flex justify-between items-center bg-white p-3 rounded border border-neutral-border shadow-sm">
                       <div className="text-neutral-caption">剩余作答机会</div>
                       <div className="font-bold text-[#fa541c]">{Math.max(0, exam.maxAttempts - exam.attempts)} 次</div>
                    </div>
                 </div>
               ) : exam.status === "已结束" ? (
                 <div className="space-y-4">
                    <div className="flex justify-between items-center bg-white p-3 rounded border border-green-100 shadow-sm">
                       <div className="text-[13px] text-neutral-caption">您的最终得分</div>
                       <div className="text-[20px] font-bold text-green-600">{exam.score} 分</div>
                    </div>
                    <div className="text-[13px] text-neutral-body flex items-start gap-2">
                       <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5" />
                       <div>
                         <div>通过本次考试</div>
                         <div className="text-[12px] text-neutral-caption mt-1">提交时间: 2026-03-10 10:28:45</div>
                       </div>
                    </div>
                 </div>
               ) : (
                 <div className="text-center py-4 text-[13px] text-neutral-caption">
                    暂无提交记录，您还有 <span className="font-bold text-[#fa541c]">{exam.maxAttempts}</span> 次作答机会。
                 </div>
               )}
            </div>
          )}
        </div>
      </div>

      <div className="max-w-6xl mx-auto w-full py-8 text-neutral-title">
        <h2 className="text-[18px] font-bold mb-6 flex items-center gap-2">
           <AlertCircle className="w-5 h-5 text-[#fa541c]" /> 考试规则与须知
        </h2>
        <div className="bg-white border border-neutral-border rounded-[12px] shadow-sm p-8 space-y-6">
           <div>
             <h3 className="font-bold text-[15px] mb-2 border-l-4 border-[#fa541c] pl-3">1. 考试纪律与作答时间</h3>
             <p className="text-[14px] text-neutral-body leading-relaxed pl-4">
               一旦点击开始考试或继续考试，倒计时将无法暂停。如遇断网等突发情况，系统具有自动保存功能，请在时长允许范围内重新刷新页面即可恢复作答。考试页面严禁切屏，切屏超过 3 次将会强制收卷。
             </p>
           </div>
           <div>
             <h3 className="font-bold text-[15px] mb-2 border-l-4 border-[#fa541c] pl-3">2. 成绩规则与客观题</h3>
             <p className="text-[14px] text-neutral-body leading-relaxed pl-4">
               客观题（选择题、判断题）交卷后由系统自动判分，主观题和实操题可能需要导师复审。最终成绩取系统展示的综合平切或最高分（若包含多场次管理机制）。
             </p>
           </div>
           <div>
             <h3 className="font-bold text-[15px] mb-2 border-l-4 border-[#fa541c] pl-3">3. 多场次管理细则</h3>
             <p className="text-[14px] text-neutral-body leading-relaxed pl-4">
               对于“多场次”展示类型的考试，您可以根据自身时间选择某一场次参加。报名后不可随意退赛，开考后无论您是否点击开始系统都会开始倒计时。
             </p>
           </div>
        </div>
      </div>
    </div>
  );
}
