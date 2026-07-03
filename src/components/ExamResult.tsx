import React, { useState } from 'react';
import { ChevronLeft, CheckCircle2, XCircle, Award, BarChart2, Clock, Target, Hash, ShieldCheck, Zap, AlertTriangle, PlayCircle, LineChart, FileText, Bot, PenTool, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ExamResultProps {
  exam: any;
  onBack: () => void;
}

export default function ExamResult({ exam, onBack }: ExamResultProps) {
  const [activeTab, setActiveTab] = useState('overview'); // overview, detail, practical

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
             
             <h1 className="text-4xl font-extrabold text-white mb-3 tracking-tight">{exam.title} - 成绩报告</h1>
             <p className="text-white/90 text-[15px] mb-4 flex items-center gap-2 font-medium">
               <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
               报告基于 AI 双盲评卷模型与自动化判分系统生成，客观公正。
             </p>
           </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto w-full -mt-24 relative z-20 pb-12">
        <div className="bg-white rounded-[24px] shadow-lg p-8 flex flex-col gap-8">
           
           {/* Top Stats Cards mapping to image structure */}
           <div className="grid grid-cols-4 gap-6">
              <div className="bg-[#fff7ed] rounded-[16px] p-6 flex flex-col justify-center relative overflow-hidden">
                <div className="absolute right-[-10px] bottom-[-10px] opacity-[0.05]"><Target className="w-32 h-32 text-[#fa541c]" /></div>
                <div className="text-[14px] text-neutral-body flex items-center gap-1.5 font-bold mb-2"><Target className="w-4 h-4 text-[#fa541c]" /> 最终得分</div>
                <div className="text-[40px] font-black text-[#fa541c] leading-none tracking-tight">95<span className="text-[18px] text-[#fa541c]/60 ml-1 font-bold">/ 100</span></div>
                <div className="text-[12px] text-[#fa541c] mt-2 bg-[#fa541c]/10 px-2.5 py-0.5 rounded-md font-bold inline-block w-fit">已达及格线 (60分)</div>
              </div>
              
              <div className="bg-[#f5f8ff] rounded-[16px] p-6 flex flex-col justify-center relative overflow-hidden">
                <div className="absolute right-[-10px] bottom-[-10px] opacity-[0.05]"><CheckCircle2 className="w-32 h-32 text-blue-600" /></div>
                <div className="text-[14px] text-neutral-body flex items-center gap-1.5 font-bold mb-2"><CheckCircle2 className="w-4 h-4 text-blue-600" /> 综合正确率</div>
                <div className="text-[34px] font-bold text-neutral-title leading-tight">92.5%</div>
              </div>
              
              <div className="bg-[#f5f8ff] rounded-[16px] p-6 flex flex-col justify-center relative overflow-hidden">
                <div className="absolute right-[-10px] bottom-[-10px] opacity-[0.05]"><Award className="w-32 h-32 text-indigo-600" /></div>
                <div className="text-[14px] text-neutral-body flex items-center gap-1.5 font-bold mb-2"><Award className="w-4 h-4 text-indigo-600" /> 击败参考人数</div>
                <div className="text-[34px] font-bold text-neutral-title leading-tight">88%</div>
                <div className="text-[13px] text-neutral-body mt-2 font-medium">班级排行: 5 / 42</div>
              </div>

              <div className="bg-[#f5f8ff] rounded-[16px] p-6 flex flex-col justify-center relative overflow-hidden">
                <div className="absolute right-[-10px] bottom-[-10px] opacity-[0.05]"><Clock className="w-32 h-32 text-purple-600" /></div>
                <div className="text-[14px] text-neutral-body flex items-center gap-1.5 font-bold mb-2"><Clock className="w-4 h-4 text-purple-600" /> 用时统计</div>
                <div className="text-[34px] font-bold text-neutral-title leading-tight">45:12</div>
                <div className="text-[13px] text-neutral-body mt-2 font-medium">总时长: 120 分钟</div>
              </div>
           </div>

           {/* Horizontal Tabs mapping to image structure */}
           <div className="flex border-b border-neutral-100 gap-8 px-2">
             {[
              { id: 'overview', label: '成绩统计增强' },
              { id: 'ai-auto', label: 'AI自动判分' },
              { id: 'ai-assist', label: 'AI辅助判分' },
              { id: 'mistakes', label: '错题汇总' },
             ].map(tab => (
               <button
                 key={tab.id}
                 onClick={() => setActiveTab(tab.id)}
                 className={cn(
                   "pb-4 text-[15px] font-bold transition-all relative",
                   activeTab === tab.id ? "text-[#fa541c]" : "text-neutral-body hover:text-neutral-title"
                 )}
               >
                 {tab.label}
                 {activeTab === tab.id && (
                   <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#fa541c] rounded-t-full"></div>
                 )}
               </button>
             ))}
           </div>

           {/* Content Box */}
           <div className="flex flex-col gap-6 -mt-2">
            {activeTab === 'overview' && (
              <>
                <div className="bg-[#fafafa] rounded-[16px] border border-neutral-100 p-8">
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="font-bold text-[16px] text-neutral-title flex items-center gap-2">
                       <LineChart className="w-5 h-5 text-[#fa541c]" /> 多维度成绩统计分析
                    </h3>
                    <div className="flex gap-3">
                       <Button variant="outline" className="h-8 text-[13px] border-[#fa541c] text-[#fa541c] hover:bg-[#fff2e8]"><FileText className="w-3.5 h-3.5 mr-1" /> 下载成绩单</Button>
                       <Button className="h-8 text-[13px] bg-[#fa541c] hover:bg-[#e84a15] text-white"><BarChart2 className="w-3.5 h-3.5 mr-1" /> 生成成绩报告</Button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-5 gap-4 mb-8">
                    {[
                      { label: "平均分", value: "78.5" },
                      { label: "最高分", value: "98" },
                      { label: "及格率", value: "85%" },
                      { label: "优秀率", value: "32%" },
                      { label: "整体排名", value: "12/45", change: "↑3" }
                    ].map((stat, i) => (
                      <div key={i} className="bg-white p-4 rounded-[12px] border border-neutral-200 text-center shadow-sm">
                        <div className="text-[13px] text-neutral-caption mb-1">{stat.label}</div>
                        <div className="text-[24px] font-bold text-neutral-title">
                          {stat.value}
                          {stat.change && <span className="text-[12px] text-green-500 ml-1 font-medium">{stat.change}</span>}
                        </div>
                      </div>
                    ))}
                  </div>

                  <h3 className="font-bold text-[16px] text-neutral-title flex items-center gap-2 mb-6">
                     <BarChart2 className="w-5 h-5 text-[#fa541c]" /> 成绩分布与表现
                  </h3>
                  <div className="grid grid-cols-2 gap-8">
                     <div className="space-y-4">
                       {[
                         { name: '基础理论 (单选/多选)', score: '45 / 50', pct: 90 },
                         { name: '代码实操验证', score: '30 / 30', pct: 100 },
                         { name: '主观论述 (AI辅助)', score: '20 / 20', pct: 100 },
                       ].map((t, i) => (
                         <div key={i}>
                           <div className="flex justify-between text-[13px] mb-1">
                              <span className="font-bold text-neutral-title">{t.name}</span>
                              <span className="font-mono text-neutral-caption">{t.score} 分</span>
                           </div>
                           <div className="w-full h-2 bg-neutral-100 rounded-full overflow-hidden">
                              <div className={cn("h-full", t.pct === 100 ? "bg-green-500" : "bg-[#fa541c]")} style={{ width: `${t.pct}%` }}></div>
                           </div>
                         </div>
                       ))}
                     </div>
                     <div className="bg-white rounded-[12px] p-6 border border-neutral-200 flex items-center justify-center relative shadow-sm">
                        <div className="w-48 h-48 rounded-full border-4 border-[#fff2e8] border-t-[#fa541c] border-r-[#fa541c] animate-[spin_3s_linear_infinite]"></div>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                           <ShieldCheck className="w-10 h-10 text-green-500 mb-2" />
                           <span className="font-bold text-neutral-title">综合评价: 优秀</span>
                        </div>
                     </div>
                  </div>
                </div>
              </>
            )}

            {activeTab === 'ai-auto' && (
              <div className="flex flex-col gap-6">
                <div className="bg-[#fafafa] rounded-[16px] border border-neutral-100 p-8">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-[16px] text-neutral-title flex items-center gap-2">
                       <Bot className="w-5 h-5 text-[#fa541c]" /> 客观题自动判分 (标准答案匹配)
                    </h3>
                    <span className="text-[12px] bg-green-100 text-green-700 px-2.5 py-1 rounded-md font-medium border border-green-200">提交即判分，实时反馈</span>
                  </div>
                  <div className="border border-neutral-200 rounded-[8px] overflow-hidden">
                     <table className="w-full text-left border-collapse text-[13px]">
                       <thead className="bg-[#f5f6f8] text-neutral-caption font-bold border-b border-neutral-200">
                         <tr>
                           <th className="p-3 w-16 text-center">题号</th>
                           <th className="p-3">题目类型</th>
                           <th className="p-3">您的答案</th>
                           <th className="p-3">标准答案</th>
                           <th className="p-3 w-20 text-center">结果</th>
                         </tr>
                       </thead>
                       <tbody className="divide-y divide-neutral-100 bg-white text-neutral-body">
                          {[1, 2, 3].map((num) => (
                             <tr key={num} className="hover:bg-neutral-50 transition-colors">
                               <td className="p-3 text-center font-mono font-bold">{num}</td>
                               <td className="p-3 text-neutral-title font-bold">单项选择题</td>
                               <td className="p-3 text-green-600 font-bold">C. list</td>
                               <td className="p-3">C. list</td>
                               <td className="p-3 flex justify-center"><CheckCircle2 className="w-4 h-4 text-green-500" /></td>
                             </tr>
                          ))}
                       </tbody>
                     </table>
                  </div>
                </div>

                <div className="bg-[#fafafa] rounded-[16px] border border-neutral-100 p-8">
                  <h3 className="font-bold text-[16px] text-neutral-title flex items-center gap-2 mb-6">
                     <Zap className="w-5 h-5 text-[#fa541c]" /> 编程与实操题判分 (代码执行验证脚本)
                  </h3>
                  
                  <div className="mb-6">
                    <div className="font-bold text-[15px] mb-3 text-neutral-title">代码题：合并两个有序数组</div>
                    <div className="p-5 bg-white border border-neutral-200 rounded-[8px] shadow-sm">
                       <div className="flex items-center justify-between mb-4 border-b border-neutral-100 pb-3">
                          <span className="text-[13px] font-bold text-neutral-body">执行测试用例比对输出结果：满分 (10/10)</span>
                          <div className="flex gap-2 text-[12px]">
                            <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full border border-green-200">时空复杂度达标</span>
                            <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full border border-blue-200">测试用例全通过</span>
                          </div>
                       </div>
                       <p className="text-[13px] text-neutral-caption leading-relaxed">
                         <strong className="text-neutral-title">解析说明：</strong>双指针算法非常出色地在 O(N+M) 的时间复杂度内完成了归并操作，没有触发任何边界溢出，满足了本考点的所有要求，脚本引擎判定满分。
                       </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'ai-assist' && (
              <div className="bg-[#fafafa] rounded-[16px] border border-neutral-100 p-8">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-bold text-[16px] text-neutral-title flex items-center gap-2">
                     <PenTool className="w-5 h-5 text-[#fa541c]" /> 主观题/论述题 AI 辅助评分
                  </h3>
                  <span className="text-[12px] bg-blue-100 text-blue-700 px-2.5 py-1 rounded-md font-medium border border-blue-200">基于大模型 NLP 能力</span>
                </div>
                
                <div className="p-6 bg-white border border-neutral-200 rounded-[12px] shadow-sm mb-6">
                   <div className="flex justify-between items-start mb-4">
                     <div>
                       <span className="inline-block px-2 py-0.5 bg-neutral-100 text-neutral-title text-[12px] rounded font-bold mb-2">论述题</span>
                       <h4 className="text-[15px] font-bold text-neutral-title">请简述微服务架构的主要优势及可能带来的挑战。</h4>
                     </div>
                     <div className="text-right">
                       <div className="text-[20px] font-bold text-[#fa541c]">15 <span className="text-[14px] text-neutral-400">/ 20</span></div>
                       <div className="text-[12px] text-orange-500 font-medium bg-orange-50 px-2 py-0.5 rounded border border-orange-100 mt-1">教师待复核</div>
                     </div>
                   </div>

                   <div className="mb-4">
                     <div className="text-[13px] font-bold text-neutral-500 mb-1">您的作答：</div>
                     <div className="text-[14px] text-neutral-body leading-relaxed bg-[#f9f9f9] p-4 rounded-md border border-neutral-100">
                       微服务架构的主要优势是解耦，每个服务可以独立部署和扩展，团队可以独立开发。带来的挑战是系统复杂度增加，服务间通信成本变高，以及分布式事务处理比较困难。
                     </div>
                   </div>

                   <div className="border-t border-neutral-100 pt-4 mt-4">
                     <div className="text-[14px] font-bold text-neutral-title mb-3 flex items-center gap-2">
                       <Bot className="w-4 h-4 text-[#fa541c]" /> AI 评分建议与分析
                     </div>
                     <div className="grid grid-cols-2 gap-4 mb-4">
                       <div className="flex items-center gap-2 text-[13px]">
                         <CheckCircle2 className="w-4 h-4 text-green-500" />
                         <span className="text-neutral-body">答案完整性: <strong className="text-neutral-title">良好</strong></span>
                       </div>
                       <div className="flex items-center gap-2 text-[13px]">
                         <CheckCircle2 className="w-4 h-4 text-green-500" />
                         <span className="text-neutral-body">逻辑性评估: <strong className="text-neutral-title">清晰</strong></span>
                       </div>
                       <div className="flex items-center gap-2 text-[13px] col-span-2">
                         <XCircle className="w-4 h-4 text-orange-500" />
                         <span className="text-neutral-body">关键词覆盖度: <strong className="text-neutral-title">75% (自动标记常见错误/遗漏：容错性、监控)</strong></span>
                       </div>
                     </div>
                     <div className="text-[13px] text-neutral-caption bg-[#fff2e8] p-4 rounded border border-[#ffd8bf] leading-relaxed">
                        <strong className="text-[#fa541c]">AI 评分理由：</strong> 答案基本涵盖了微服务独立部署、解耦等核心优势，也指出了通信成本和分布式事务等主要挑战。对比标准优秀答案，缺少了对“技术栈多样性”优势以及“服务监控与日志追踪”挑战的描述。建议得分 15 分。
                     </div>
                   </div>
                </div>
              </div>
            )}

            {activeTab === 'mistakes' && (
              <div className="bg-[#fafafa] rounded-[16px] border border-neutral-100 p-8">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-bold text-[16px] text-neutral-title flex items-center gap-2">
                     <BookOpen className="w-5 h-5 text-[#fa541c]" /> 错题本自动收集
                  </h3>
                  <div className="flex gap-2">
                     <span className="text-[12px] bg-neutral-100 text-neutral-700 px-2.5 py-1 rounded-md border border-neutral-200 cursor-pointer hover:bg-neutral-200">按错误类型</span>
                     <span className="text-[12px] bg-[#fa541c] text-white px-2.5 py-1 rounded-md cursor-pointer hover:bg-[#e84a15]">按知识点分类</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-8">
                   <div className="bg-white p-4 rounded-[8px] border border-neutral-200 shadow-sm flex justify-between items-center">
                      <div>
                        <div className="text-[12px] text-neutral-caption mb-1">本次产生错题</div>
                        <div className="text-[20px] font-bold text-neutral-title">1 道</div>
                      </div>
                      <AlertTriangle className="w-8 h-8 text-orange-400 opacity-20" />
                   </div>
                   <div className="bg-white p-4 rounded-[8px] border border-neutral-200 shadow-sm flex justify-between items-center">
                      <div>
                        <div className="text-[12px] text-neutral-caption mb-1">薄弱知识点</div>
                        <div className="text-[15px] font-bold text-[#fa541c] mt-1">数据清洗 (Pandas)</div>
                      </div>
                      <Target className="w-8 h-8 text-red-400 opacity-20" />
                   </div>
                   <div className="bg-white p-4 rounded-[8px] border border-neutral-200 shadow-sm flex items-center justify-center cursor-pointer hover:bg-neutral-50 transition-colors">
                      <div className="font-bold text-[#fa541c] flex items-center gap-2">
                         <PlayCircle className="w-4 h-4" /> 错题重做强化
                      </div>
                   </div>
                </div>

                <div className="space-y-4">
                   <div className="p-5 rounded-[12px] bg-white border border-red-100 shadow-sm flex gap-4 items-start relative overflow-hidden">
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-400"></div>
                      <span className="w-8 h-8 flex items-center justify-center bg-red-50 text-red-500 font-bold rounded shadow-sm shrink-0 text-[13px]">错</span>
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-2">
                          <p className="text-[14px] font-bold text-neutral-title">多选题：在 Pandas 中如何对缺失值进行填充？</p>
                          <span className="text-[12px] text-neutral-400 bg-neutral-100 px-2 py-0.5 rounded border border-neutral-200">来源：随堂测验</span>
                        </div>
                        <div className="text-[13px] text-neutral-body space-y-1 mb-3">
                           <div><span className="text-red-500 font-medium">您的答案:</span> A. dropna() , B. fillna()</div>
                           <div><span className="text-green-600 font-medium">正确答案:</span> B. fillna() , C. interpolate()</div>
                        </div>
                        <div className="text-[13px] text-neutral-600 p-3 bg-[#fafafa] rounded border border-neutral-200">
                           <strong className="text-neutral-title">解析说明:</strong> dropna() 是删除缺失值，不是填充。fillna() 可以填充指定值，interpolate() 可以进行插值填充。<span className="text-[#fa541c] font-medium ml-2">关联知识点：【数据预处理】</span>
                        </div>
                      </div>
                   </div>
                </div>
              </div>
            )}
         </div>
       </div>
     </div>
   </div>
  );
}
