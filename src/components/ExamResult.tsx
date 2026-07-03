import React, { useState } from 'react';
import { ChevronLeft, CheckCircle2, XCircle, Award, BarChart2, Clock, Target, Hash, ShieldCheck, Zap, AlertTriangle, PlayCircle, LineChart, FileText, Bot, PenTool, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ExamResultProps {
  exam: any;
  onBack: () => void;
}

export default function ExamResult({ exam, onBack }: ExamResultProps) {
  const attemptRows = Array.from({ length: Math.max(1, exam.attempts || 1) }).map((_, idx) => ({
    attemptNumber: idx + 1,
    types: "单选题、多选题、判断题、填空题、简答题、实训题",
    time: exam.startTime ? `${exam.startTime.split(' ')[0]} 11:${15 + idx}:32` : "2026-07-02 11:15:32",
  }));

  return (
    <div className="flex flex-col h-full bg-[#f5f6f8] relative w-[100vw] left-1/2 -translate-x-1/2 -mt-6">
      <div className="bg-gradient-to-r from-[#ea5b22] to-[#fd8d44] pt-8 pb-36 px-14 relative overflow-hidden shrink-0">
        {/* Background Decorative Patterns */}
        <div className="absolute inset-0 z-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }}></div>
        
        {/* Left Ruler Graphic */}
        <div className="absolute left-[-5%] top-[10%] opacity-[0.15] pointer-events-none transform -rotate-[15deg]">
            <svg width="500" height="200" viewBox="0 0 500 200" fill="none">
               <path d="M0,100 L500,100" stroke="white" strokeWidth="3" />
               {Array.from({length: 26}).map((_, i) => (
                  <path key={`ruler-tick-${i}`} d={`M${i * 20},100 L${i * 20}, ${i % 5 === 0 ? 60 : 80}`} stroke="white" strokeWidth="2.5" />
               ))}
               {Array.from({length: 6}).map((_, i) => (
                  <text key={`ruler-num-${i}`} x={i * 100} y="40" fill="white" fontSize="24" fontFamily="monospace" fontWeight="bold" textAnchor="middle">{i + 7}</text>
               ))}
            </svg>
        </div>

        {/* Right Protractor Graphic */}
        <div className="absolute right-[5%] bottom-[-15%] opacity-[0.15] pointer-events-none transform rotate-[20deg]">
            <svg width="300" height="300" viewBox="0 0 300 300" fill="none">
               <path d="M50,150 A100,100 0 0,1 250,150 Z" stroke="white" strokeWidth="4" fill="transparent" />
               <path d="M70,150 A80,80 0 0,1 230,150" stroke="white" strokeWidth="2" fill="transparent" strokeDasharray="6 6" />
               <path d="M140,150 A10,10 0 0,1 160,150 Z" stroke="white" strokeWidth="3" fill="transparent" />
               <path d="M150,150 L150,50" stroke="white" strokeWidth="2" />
               <path d="M150,150 L79.3,79.3" stroke="white" strokeWidth="2" />
               <path d="M150,150 L220.7,79.3" stroke="white" strokeWidth="2" />
               {Array.from({length: 19}).map((_, i) => {
                  const angle = (i * 10) * (Math.PI / 180);
                  const x1 = 150 - 100 * Math.cos(angle);
                  const y1 = 150 - 100 * Math.sin(angle);
                  const x2 = 150 - 90 * Math.cos(angle);
                  const y2 = 150 - 90 * Math.sin(angle);
                  return <path key={`prot-tick-${i}`} d={`M${x1},${y1} L${x2},${y2}`} stroke="white" strokeWidth={i % 9 === 0 ? "4" : "2"} />
               })}
            </svg>
        </div>

        {/* Right Paper Plane Graphic */}
        <div className="absolute right-[15%] top-[15%] opacity-20 pointer-events-none animate-[bounce_6s_ease-in-out_infinite]">
           <svg width="80" height="80" viewBox="0 0 24 24" fill="white">
               <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
           </svg>
           <svg width="60" height="30" viewBox="0 0 60 30" fill="none" className="absolute top-[80%] right-[80%] stroke-white stroke-2 opacity-50" style={{strokeDasharray: '4 4'}}>
               <path d="M60,0 C40,15 20,30 0,30" />
           </svg>
        </div>

        {/* Dynamic Abstract Waves */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none z-0">
          <svg className="relative block w-[calc(100%+1.3px)] h-[80px]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" fill="#f5f6f8"></path>
          </svg>
        </div>

        <div className="max-w-6xl mx-auto flex items-start gap-8 relative z-10">
           <div className="flex-1">
             <div className="flex items-center text-[13px] text-white/90 mb-6 font-medium">
                <button onClick={onBack} className="hover:text-white flex items-center gap-1 transition-colors bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-full backdrop-blur-sm">
                  <ChevronLeft className="w-4 h-4" /> 返回我的考试
                </button>
             </div>
             
             <h1 className="text-4xl font-extrabold text-white mb-3 tracking-tight">{exam.title} - 提交历史</h1>
             <p className="text-white/90 text-[15px] mb-4 flex items-center gap-2 font-medium">
               <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
               报告基于 AI 双盲评卷模型与自动化判分系统生成，客观公正。
             </p>
           </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto w-full -mt-24 relative z-20 pb-12">
        <div className="bg-white rounded-xl border border-neutral-200/80 shadow-md p-6 flex flex-col gap-6">
          <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
            <h2 className="text-[16px] font-bold text-neutral-900">答卷提交记录</h2>
            <span className="text-[12px] text-neutral-500 font-medium">共提交 {attemptRows.length} 次</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse whitespace-nowrap">
              <thead>
                <tr className="border-b border-neutral-border/50 bg-neutral-50/50 text-[13px] text-neutral-600">
                  <th className="pl-6 pr-3 py-3.5 font-medium text-left">提交次数</th>
                  <th className="px-3 py-3.5 font-medium text-left">题型</th>
                  <th className="px-3 py-3.5 font-medium text-left">提交时间</th>
                  <th className="pl-3 pr-6 py-3.5 font-medium text-right">操作</th>
                </tr>
              </thead>
              <tbody>
                {attemptRows.map((row, idx) => (
                  <tr 
                    key={row.attemptNumber} 
                    className={cn(
                      "border-b border-neutral-100 hover:bg-neutral-50/30 transition-colors group text-[13px]",
                      idx === attemptRows.length - 1 && "border-b-0"
                    )}
                  >
                    <td className="pl-6 pr-3 py-3 text-left">
                      <div className="text-neutral-800 font-medium">第 {row.attemptNumber} 次提交</div>
                    </td>
                    <td className="px-3 py-3 text-neutral-600">
                      <div>{row.types}</div>
                    </td>
                    <td className="px-3 py-3 text-neutral-600 font-mono">
                      <div>{row.time}</div>
                    </td>
                    <td className="pl-3 pr-6 py-3 text-right">
                      <button 
                        type="button"
                        onClick={() => alert(`正在加载第 ${row.attemptNumber} 次提交的答卷预览...`)}
                        className="text-[#fa541c] hover:text-[#e84a15] transition-colors cursor-pointer bg-transparent border-0 p-0 text-xs font-semibold whitespace-nowrap"
                      >
                        预览
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
