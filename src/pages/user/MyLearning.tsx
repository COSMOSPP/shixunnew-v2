import React, { useState } from "react";
import { Link } from "react-router-dom";
import ExamResult from "@/components/ExamResult";
import { 
  ChevronRight, MonitorPlay, FolderKanban, Database, Plus, Play, Download, Search,
  BookOpen, Clock, Bot, TrendingUp, Calendar as CalendarIcon, Target, Flame, Trash2, ArrowRight, ChevronLeft, Sparkles,
  Award
} from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Cell } from "recharts";
import { cn } from "@/lib/utils";

export default function MyLearning() {
  const [activeTab, setActiveTab] = useState<'learning' | 'duration' | 'ai-path' | 'scores'>('learning');
  const [isViewingExamResult, setIsViewingExamResult] = useState(false);
  const [selectedExamForResult, setSelectedExamForResult] = useState<any>(null);
  const [scoresSubTab, setScoresSubTab] = useState<'exam' | 'homework'>('exam');
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 2000);
  };

  const [trendRange, setTrendRange] = useState<'week' | 'month'>('week');

  const monthData = React.useMemo(() => Array.from({ length: 30 }).map((_, i) => {
    const val = 2 + Math.sin(i / 3) * 1.5 + Math.random() * 1.5;
    return { name: `4/${i + 1}`, hours: Number(val.toFixed(1)) };
  }), []);

  if (isViewingExamResult && selectedExamForResult) {
    return (
      <ExamResult 
        exam={selectedExamForResult} 
        onBack={() => {
          setIsViewingExamResult(false);
          setSelectedExamForResult(null);
        }} 
      />
    );
  }

  const renderLearningTab = () => (
    <div className="space-y-8 animation-fade-in">
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-neutral-900 flex items-center gap-2">
            <MonitorPlay className="w-5 h-5 text-[#fa541c]" />
            最近学习的课程
          </h2>
          <button className="text-sm text-neutral-500 hover:text-[#fa541c] flex items-center transition-colors">
            进入全部课程 <ChevronRight className="w-4 h-4 ml-0.5" />
          </button>
        </div>
        
        <div className="border border-neutral-200 rounded-2xl shadow-sm hover:border-orange-200 transition-colors bg-white">
          <div className="p-6 flex flex-col md:flex-row items-center gap-6">
            <div className="w-48 h-32 bg-orange-50 rounded-xl flex items-center justify-center shrink-0 object-cover overflow-hidden relative group">
              <MonitorPlay className="w-10 h-10 text-orange-200" />
              <div className="absolute inset-0 bg-black/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all cursor-pointer backdrop-blur-[2px]">
                <Play className="w-10 h-10 text-white opacity-90" />
              </div>
            </div>
            <div className="flex-1 space-y-4 w-full">
              <div>
                <h3 className="text-lg font-bold text-neutral-900">Python高级数据处理与可视化</h3>
                <p className="text-sm text-neutral-500 mt-1">正在学习：第4章 复杂数据清洗与异常处理 - 小节 4.2</p>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-500">课程总进度</span>
                  <span className="text-[#fa541c] font-bold">65%</span>
                </div>
                <div className="w-full h-2 bg-neutral-100 rounded-full overflow-hidden">
                  <div className="h-full bg-[#fa541c] rounded-full transition-all" style={{ width: '65%' }} />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button className="bg-[#fa541c] hover:bg-[#e84a15] text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors">
                  继续学习
                </button>
                <button className="bg-white border border-neutral-200 hover:bg-neutral-50 text-neutral-600 px-6 py-2 rounded-lg text-sm font-medium transition-colors">
                  查看课程详情
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between mt-8">
          <h2 className="text-lg font-bold text-neutral-900 flex items-center gap-2">
            <FolderKanban className="w-5 h-5 text-indigo-500" />
            我的工作台
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="border border-neutral-200 rounded-2xl shadow-sm flex flex-col h-[400px] bg-white">
            <div className="p-4 border-b border-neutral-100 flex items-center justify-between shrink-0">
              <span className="text-base font-bold text-neutral-900">项目 (2)</span>
            </div>
            <div className="p-4 flex-1 overflow-y-auto space-y-4 custom-scrollbar">
              {[1, 2].map((i) => (
                <div key={i} className="flex gap-4 p-4 border border-neutral-100 rounded-xl hover:border-indigo-200 transition-colors bg-neutral-50/50">
                  <div className="w-16 h-16 bg-indigo-50 rounded-xl border border-indigo-100 flex items-center justify-center shrink-0">
                    <FolderKanban className="w-6 h-6 text-indigo-300" />
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col justify-between space-y-2">
                    <div>
                      <h4 className="font-bold text-neutral-900 truncate text-[14px]">电商用户行为预测</h4>
                      <p className="text-xs text-neutral-500 line-clamp-1 mt-0.5">使用深度学习模型预测用户购买转化率的实战开发项目。</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 bg-white border border-neutral-200 text-neutral-500 text-[10px] rounded-md">分类模型</span>
                      <button className="text-xs text-indigo-600 hover:text-indigo-700 font-medium">开始开发</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="border border-neutral-200 rounded-2xl shadow-sm flex flex-col h-[400px] bg-white">
            <div className="p-4 border-b border-neutral-100 flex items-center justify-between shrink-0">
              <span className="text-base font-bold text-neutral-900">数据集 (3)</span>
            </div>
            <div className="p-4 flex-1 overflow-y-auto space-y-4 custom-scrollbar">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex gap-4 p-4 border border-neutral-100 rounded-xl hover:border-blue-200 transition-colors bg-neutral-50/50">
                  <div className="w-16 h-16 bg-blue-50 rounded-xl border border-blue-100 flex items-center justify-center shrink-0">
                    <Database className="w-6 h-6 text-blue-300" />
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col justify-between space-y-2">
                    <div>
                      <h4 className="font-bold text-neutral-900 truncate text-[14px]">淘宝用户行为日志 2025</h4>
                      <p className="text-xs text-neutral-500 line-clamp-1 mt-0.5">包含数百万用户浏览、加购、购买数据的结构化特征表。</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-neutral-400">更新于昨天</span>
                      <button className="text-xs text-blue-600 hover:text-blue-700 font-medium">查看详情</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );

  const renderDurationTab = () => {
    const weekData = [
      { name: '05-01', hours: 2.5 },
      { name: '05-02', hours: 4.0 },
      { name: '05-03', hours: 3.2 },
      { name: '05-04', hours: 5.1 },
      { name: '05-05', hours: 2.8 },
      { name: '05-06', hours: 4.5 },
      { name: '05-07', hours: 3.5 },
    ];

    const calendarDays = [];
    for (let i = 0; i < 5; i++) calendarDays.push(null);
    for (let i = 1; i <= 31; i++) {
      let status = 'future';
      if (i < 10) status = 'missed';
      if (i === 11 || i === 12) status = 'makeup';
      if (i >= 13 && i <= 31) status = 'done';
      if (i === 13) status = 'today-done';
      if (i === 14) status = 'tomorrow';
      calendarDays.push({ date: i, status });
    }

    return (
      <div className="flex gap-6 h-full animation-fade-in items-start overflow-hidden">
        {/* Left Column */}
        <div className="flex-1 flex flex-col gap-6 overflow-y-auto custom-scrollbar pr-2 h-full pb-6">
          {/* Overview Cards */}
          <div className="grid grid-cols-4 gap-4 shrink-0">
            <div className="bg-white border border-neutral-200 rounded-2xl p-5 shadow-sm hover:border-orange-200 transition-colors">
              <div className="text-[13px] font-bold text-neutral-500 mb-2 flex items-center justify-between">
                今日学习 <Clock className="w-4 h-4 text-orange-400" />
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black text-neutral-900 tracking-tight">2.5</span>
                <span className="text-xs text-neutral-500 font-medium">小时</span>
              </div>
            </div>
            <div className="bg-white border border-neutral-200 rounded-2xl p-5 shadow-sm hover:border-orange-200 transition-colors">
              <div className="text-[13px] font-bold text-neutral-500 mb-2 flex items-center justify-between">
                本周学习 <CalendarIcon className="w-4 h-4 text-orange-400" />
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black text-neutral-900 tracking-tight">12.8</span>
                <span className="text-xs text-neutral-500 font-medium">小时</span>
              </div>
            </div>
            <div className="bg-white border border-neutral-200 rounded-2xl p-5 shadow-sm hover:border-orange-200 transition-colors">
              <div className="text-[13px] font-bold text-neutral-500 mb-2 flex items-center justify-between">
                本月学习 <TrendingUp className="w-4 h-4 text-orange-400" />
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black text-neutral-900 tracking-tight">45.2</span>
                <span className="text-xs text-neutral-500 font-medium">小时</span>
              </div>
            </div>
            <div className="bg-gradient-to-br from-[#fa541c] to-[#ff7a45] rounded-2xl p-5 shadow-md shadow-orange-500/20 text-white relative overflow-hidden group">
              <div className="absolute right-0 bottom-0 opacity-10 group-hover:scale-110 group-hover:-rotate-6 transition-transform duration-500">
                <Clock className="w-24 h-24 -mr-4 -mb-4" />
              </div>
              <div className="text-[13px] font-bold text-orange-100 mb-2 relative z-10 flex items-center justify-between">
                累计学习时长
              </div>
              <div className="flex items-baseline gap-1 relative z-10 mt-1">
                <span className="text-3xl font-black tracking-tight">328</span>
                <span className="text-xs text-orange-100 font-medium">小时</span>
              </div>
            </div>
          </div>

          {/* Trend Chart */}
          <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-sm shrink-0 flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-base font-bold text-neutral-900">学习趋势</h3>
              <div className="flex bg-neutral-100 p-1 rounded-lg">
                <button 
                  onClick={() => setTrendRange('week')}
                  className={cn("px-4 py-1.5 text-[13px] font-bold rounded-md transition-all", trendRange === 'week' ? "bg-white text-[#fa541c] shadow-sm" : "text-neutral-500 hover:text-neutral-700")}
                >
                  近一周
                </button>
                <button 
                  onClick={() => setTrendRange('month')}
                  className={cn("px-4 py-1.5 text-[13px] font-bold rounded-md transition-all", trendRange === 'month' ? "bg-white text-[#fa541c] shadow-sm" : "text-neutral-500 hover:text-neutral-700")}
                >
                  近一月
                </button>
              </div>
            </div>
            
            <div className="h-[280px] w-full">
              {trendRange === 'week' ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weekData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#888' }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#888' }} />
                    <RechartsTooltip 
                      cursor={{ fill: '#fff2e8' }}
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', fontSize: '13px', fontWeight: 'bold' }}
                      itemStyle={{ color: '#fa541c' }}
                    />
                    <Bar dataKey="hours" name="学习时长(小时)" radius={[6, 6, 0, 0]} maxBarSize={40}>
                      {weekData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={index === weekData.length - 1 ? '#fa541c' : '#ffc0a9'} className="transition-all duration-300 hover:opacity-80" />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#888' }} dy={10} minTickGap={20} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#888' }} />
                    <RechartsTooltip 
                      cursor={{ stroke: '#fa541c', strokeWidth: 1, strokeDasharray: '4 4' }}
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', fontSize: '13px', fontWeight: 'bold' }}
                      itemStyle={{ color: '#fa541c' }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="hours" 
                      name="学习时长(小时)" 
                      stroke="#fa541c" 
                      strokeWidth={3}
                      dot={false}
                      activeDot={{ r: 6, fill: '#fa541c', stroke: '#fff', strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* Reminders & Streak - Rich Glassmorphism Design */}
          <div className="grid grid-cols-2 gap-4 shrink-0">
            <div className="relative overflow-hidden rounded-2xl p-6 shadow-sm border border-orange-100/60 bg-gradient-to-br from-white/90 to-orange-50/50 backdrop-blur-xl flex items-center gap-6 hover:shadow-md transition-all group">
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-gradient-to-br from-orange-300/30 to-transparent rounded-full blur-2xl"></div>
              <div className="w-16 h-16 bg-gradient-to-br from-orange-100 to-white rounded-2xl flex items-center justify-center shrink-0 shadow-inner border border-white relative z-10">
                <Target className="w-8 h-8 text-[#fa541c]" />
              </div>
              <div className="flex-1 relative z-10">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-[16px] font-extrabold text-neutral-800 tracking-wide">每日学习目标</h4>
                  <div className="flex items-baseline gap-1 bg-white/60 px-2 py-1 rounded-lg border border-white shadow-sm">
                    <span className="text-[14px] font-black text-[#fa541c]">2.5</span>
                    <span className="text-[12px] text-neutral-500 font-bold">/ 3.0h</span>
                  </div>
                </div>
                <div className="w-full bg-orange-100/50 rounded-full h-2.5 mb-2.5 shadow-inner overflow-hidden border border-orange-200/30">
                  <div className="bg-gradient-to-r from-orange-400 to-[#fa541c] h-full rounded-full transition-all duration-1000 relative" style={{ width: '83%' }}>
                    <div className="absolute inset-0 bg-white/20 w-full h-full animate-pulse"></div>
                  </div>
                </div>
                <span className="text-[11px] text-orange-600 font-bold flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" /> 还差半小时，继续加油！
                </span>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-2xl p-6 shadow-sm border border-red-100/60 bg-gradient-to-br from-white/90 to-red-50/50 backdrop-blur-xl flex items-center gap-6 hover:shadow-md transition-all group">
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-gradient-to-br from-red-300/30 to-transparent rounded-full blur-2xl"></div>
              <div className="w-16 h-16 bg-gradient-to-br from-red-100 to-white rounded-2xl flex items-center justify-center shrink-0 shadow-inner border border-white relative z-10">
                <Flame className="w-8 h-8 text-red-500" />
              </div>
              <div className="flex-1 relative z-10">
                <h4 className="text-[16px] font-extrabold text-neutral-800 mb-1 tracking-wide">连续学习打卡</h4>
                <div className="flex items-end gap-2 mb-2">
                  <span className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-br from-red-500 to-orange-600 leading-none drop-shadow-sm">12</span>
                  <span className="text-sm text-red-800/60 font-bold mb-1">天</span>
                </div>
                <div className="flex items-center gap-1.5 bg-white/50 w-max px-2.5 py-1.5 rounded-md border border-white shadow-sm">
                  <TrendingUp className="w-3.5 h-3.5 text-red-500" />
                  <span className="text-[11px] text-red-600 font-bold">超过了 85% 的同学，保持势头！</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar - Calendar */}
        <div className="w-[340px] shrink-0 bg-white rounded-2xl shadow-sm border border-neutral-200 h-full flex flex-col overflow-hidden">
          <div className="bg-gradient-to-br from-orange-50/60 to-white p-5 flex flex-col items-center flex-1 overflow-y-auto custom-scrollbar">
            <div className="w-full flex items-center justify-between mb-8">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-[#fa541c]">
                  <CalendarIcon className="w-4 h-4" />
                </div>
                <span className="font-bold text-[17px] text-neutral-900 tracking-wide">打卡日历</span>
              </div>
              <div className="flex items-center bg-[#fa541c] text-white rounded-full px-1.5 py-1.5 shadow-md shadow-orange-500/20">
                <button className="p-0.5 hover:bg-white/20 rounded-full transition-colors"><ChevronLeft className="w-4 h-4" /></button>
                <span className="text-[12px] font-bold px-2 tracking-wider">2026年05月</span>
                <button className="p-0.5 hover:bg-white/20 rounded-full transition-colors"><ChevronRight className="w-4 h-4" /></button>
              </div>
            </div>

            <div className="w-full grid grid-cols-7 gap-y-5 gap-x-2 text-center pb-4">
              {['日', '一', '二', '三', '四', '五', '六'].map(d => (
                <div key={d} className="text-[12px] font-bold text-neutral-500 mb-2">{d}</div>
              ))}
              
              {calendarDays.map((day, i) => {
                if (!day) return <div key={`empty-${i}`} />;
                
                return (
                  <div key={i} className="flex flex-col items-center gap-2">
                    {day.status === 'done' || day.status === 'today-done' || day.status === 'tomorrow' ? (
                      <div className={cn(
                        "w-9 h-9 rounded-[10px] flex flex-col items-center justify-center relative cursor-pointer hover:scale-105 transition-transform",
                        day.status === 'today-done' 
                          ? "bg-white border-2 border-[#fa541c] shadow-sm" 
                          : "bg-[#fff8eb] border border-[#ffe0ad]"
                      )}>
                        <span className="text-[10px] font-black text-orange-500 leading-none mt-1">+3</span>
                        <div className="w-[14px] h-[14px] rounded-full bg-[#ffd43b] flex items-center justify-center mt-0.5 shadow-sm">
                          <div className="w-2 h-2 rounded-full border-[1.5px] border-orange-500/80"></div>
                        </div>
                      </div>
                    ) : day.status === 'missed' ? (
                      <div className="w-9 h-9 rounded-[10px] flex flex-col items-center justify-center bg-[#f4f5f7] border border-neutral-200 cursor-pointer hover:bg-neutral-200 transition-colors">
                        <span className="text-[9px] text-neutral-400 font-bold scale-90">未打卡</span>
                      </div>
                    ) : day.status === 'makeup' ? (
                      <div className="w-9 h-9 rounded-[10px] flex flex-col items-center justify-center bg-orange-50 border border-orange-200 cursor-pointer hover:bg-orange-100 transition-colors">
                        <span className="text-[9px] text-[#fa541c] font-bold scale-90">补卡</span>
                      </div>
                    ) : null}
                    
                    <span className={cn(
                      "text-[10px] font-bold",
                      day.status === 'today-done' ? "text-[#fa541c]" : "text-neutral-400"
                    )}>
                      {day.status === 'today-done' ? '今天' : day.status === 'tomorrow' ? '明天' : day.date}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderAIPathTab = () => {
    const paths = [
      { id: 1, title: 'AI数据分析师成长路线', progress: 45, currentCourse: 'Pandas进阶数据清洗', totalCourses: 12, completedCourses: 5 },
      { id: 2, title: '大语言模型微调实战', progress: 80, currentCourse: 'RLHF原理与实践', totalCourses: 8, completedCourses: 6 },
      { id: 3, title: '计算机视觉工程师', progress: 15, currentCourse: 'CNN网络结构解析', totalCourses: 15, completedCourses: 2 },
    ];

    return (
      <div className="space-y-6 animation-fade-in">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-bold text-neutral-900">AI学习路径记录</h2>
          <button className="text-sm text-neutral-400 hover:text-red-500 flex items-center transition-colors">
            <Trash2 className="w-4 h-4 mr-1" /> 清除历史记录
          </button>
        </div>

        <div className="grid gap-4">
          {paths.map(path => (
            <div key={path.id} className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-sm hover:border-orange-200 transition-colors flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="flex items-start gap-4 flex-1 w-full">
                <div className="w-14 h-14 bg-orange-50 rounded-2xl flex items-center justify-center shrink-0 border border-orange-100">
                  <Bot className="w-7 h-7 text-[#fa541c]" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-[16px] font-bold text-neutral-900">{path.title}</h3>
                    <span className="px-2 py-0.5 bg-neutral-100 text-neutral-500 text-[11px] rounded-md font-medium">
                      {path.completedCourses} / {path.totalCourses} 课程
                    </span>
                  </div>
                  <p className="text-[13px] text-neutral-500 mb-3">当前学习: <span className="text-neutral-700 font-medium">{path.currentCourse}</span></p>
                  
                  <div className="flex items-center gap-4">
                    <div className="flex-1 h-2 bg-neutral-100 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-orange-400 to-[#fa541c] rounded-full" style={{ width: `${path.progress}%` }} />
                    </div>
                    <span className="text-[13px] font-bold text-[#fa541c] w-10">{path.progress}%</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-3 w-full md:w-auto mt-4 md:mt-0">
                <button className="flex-1 md:flex-none bg-white border border-neutral-200 hover:bg-neutral-50 text-neutral-600 px-5 py-2.5 rounded-xl text-sm font-medium transition-colors">
                  查看详情
                </button>
                <button className="flex-1 md:flex-none bg-[#fa541c] hover:bg-[#e84a15] text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-md shadow-orange-500/20 transition-all flex items-center justify-center gap-1.5">
                  <Play className="w-4 h-4 fill-white" /> 继续学习
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderScoresTab = () => {
    const mockExams = [
      { name: 'Python高级数据处理与可视化期末考', time: '2026-05-04 10:00', score: 95 },
      { name: '电商用户行为预测实战考评', time: '2026-04-28 14:00', score: 88 },
      { name: '机器学习基础期中测试', time: '2026-04-15 09:00', score: 55 },
    ];

    const mockHomeworks = [
      { name: 'Pandas高级清洗与过滤作业', time: '2026-05-05 18:20', score: 92, status: '合格', feedback: '数据清洗逻辑非常清晰，Lambda 函数应用得很好！', canRedo: false },
      { name: 'Matplotlib 数据流可视化设计', time: '2026-05-02 14:30', score: 45, status: '打回重做', feedback: '图表未添加图例且X轴标签重叠。作业不合格，已被打回，请按要求修改后重做。', canRedo: true },
      { name: '基础线性回归模型搭建', time: '2026-04-20 11:15', score: 80, status: '合格', feedback: '基础指标计算正确，Loss 收敛正常。', canRedo: false },
      { name: '神经网络前向传播手写实现', time: '2026-05-06 09:40', score: null, status: '待批改', feedback: '暂无评语，请等待老师批阅。', canRedo: false }
    ];

    return (
      <div className="space-y-6 animation-fade-in text-left">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-neutral-900 flex items-center gap-2">
            <Award className="w-5 h-5 text-[#fa541c]" />
            学习成绩与作业看板
          </h2>
        </div>

        {/* Optimized Sub Tabs Switcher with Bottom Underline styling */}
        <div className="border-b border-neutral-200 flex gap-6 select-none mb-6">
          {[
            { key: 'exam', name: '考试成绩' },
            { key: 'homework', name: '作业成绩' }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setScoresSubTab(tab.key as any)}
              className={cn(
                "pb-2.5 text-[14px] font-bold transition-all relative whitespace-nowrap cursor-pointer -mb-[1px] border-b-2 bg-transparent border-t-0 border-x-0 outline-none",
                scoresSubTab === tab.key 
                  ? "text-[#fa541c] border-[#fa541c]" 
                  : "text-neutral-500 hover:text-[#fa541c] border-transparent"
              )}
            >
              {tab.name}
            </button>
          ))}
        </div>

        {scoresSubTab === 'exam' ? (
          <div className="border border-neutral-200 rounded-[12px] overflow-hidden bg-white shadow-sm">
            <table className="w-full text-left border-collapse text-xs select-none">
              <thead>
                <tr className="bg-neutral-50 border-b border-neutral-200 text-neutral-600 font-semibold text-[13px]">
                  <th className="p-4 w-2/5">考试名称</th>
                  <th className="p-4 w-1/4">考试时间</th>
                  <th className="p-4 w-1/5 text-center">考卷得分</th>
                  <th className="p-4 text-center w-3/20">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 text-[13px] text-neutral-700">
                {mockExams.map((exam, index) => (
                  <tr key={index} className="hover:bg-neutral-50/50 transition-colors">
                    <td className="p-4 font-bold text-neutral-900">{exam.name}</td>
                    <td className="p-4 text-neutral-500 font-mono">{exam.time}</td>
                    <td className={cn(
                      "p-4 text-center font-extrabold font-mono text-[15px]",
                      exam.score >= 60 ? "text-[#fa541c]" : "text-red-500"
                    )}>
                      {exam.score} 分
                    </td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => {
                          setSelectedExamForResult({
                            title: exam.name,
                            score: exam.score,
                            startTime: exam.time,
                            attempts: 1
                          });
                          setIsViewingExamResult(true);
                        }}
                        className="text-[#fa541c] hover:text-[#e84a15] hover:underline font-bold cursor-pointer bg-transparent border-0"
                      >
                        预览
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="border border-neutral-200 rounded-[12px] overflow-hidden bg-white shadow-sm">
            <table className="w-full text-left border-collapse text-xs select-none">
              <thead>
                <tr className="bg-neutral-50 border-b border-neutral-200 text-neutral-600 font-semibold text-[13px]">
                  <th className="p-4 w-1/4">作业名称</th>
                  <th className="p-4 w-[15%]">提交时间</th>
                  <th className="p-4 w-[10%] text-center">批阅得分</th>
                  <th className="p-4 w-[15%] text-center">作业状态</th>
                  <th className="p-4 w-1/4">老师评语</th>
                  <th className="p-4 text-center w-[10%]">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 text-[13px] text-neutral-700">
                {mockHomeworks.map((hw, index) => (
                  <tr key={index} className="hover:bg-neutral-50/50 transition-colors">
                    <td className="p-4 font-bold text-neutral-900">{hw.name}</td>
                    <td className="p-4 text-neutral-500 font-mono">{hw.time}</td>
                    <td className="p-4 text-center font-extrabold font-mono text-[14px]">
                      {hw.score !== null ? (
                        <span className={hw.score >= 60 ? "text-[#fa541c]" : "text-red-500"}>
                          {hw.score} <span className="text-[11px] font-normal text-neutral-400">分</span>
                        </span>
                      ) : (
                        <span className="text-neutral-400 font-normal">--</span>
                      )}
                    </td>
                    <td className="p-4 text-center">
                      {hw.status === '合格' && (
                        <span className="px-2 py-0.5 rounded text-[11px] font-bold inline-block border text-emerald-600 bg-emerald-50 border-emerald-100">
                          合格
                        </span>
                      )}
                      {hw.status === '待批改' && (
                        <span className="px-2 py-0.5 rounded text-[11px] font-bold inline-block border text-neutral-500 bg-neutral-50 border-neutral-200">
                          待批改
                        </span>
                      )}
                      {hw.status === '打回重做' && (
                        <span className="px-2 py-0.5 rounded text-[11px] font-bold inline-block border text-red-600 bg-red-50 border-red-200">
                          打回重做
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-neutral-500 leading-relaxed text-[12px]">
                      {hw.feedback}
                    </td>
                    <td className="p-4 text-center">
                      {hw.canRedo ? (
                        <button
                          onClick={() => showToast('正在进入作业重做环境，请按要求提交作业')}
                          className="bg-[#fa541c] hover:bg-[#e84a15] text-white px-3 py-1 rounded text-xs font-bold transition-colors cursor-pointer border-0"
                        >
                          去重做
                        </button>
                      ) : hw.score !== null ? (
                        <button 
                          onClick={() => {
                            setSelectedExamForResult({
                              title: hw.name,
                              score: hw.score,
                              startTime: hw.time,
                              attempts: 1
                            });
                            setIsViewingExamResult(true);
                          }}
                          className="text-[#fa541c] hover:text-[#e84a15] hover:underline font-semibold cursor-pointer bg-transparent border-0"
                        >
                          预览
                        </button>
                      ) : (
                        <span className="text-neutral-300">--</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex h-full w-full bg-white overflow-hidden shadow-sm font-sans relative">
      {/* Left Sidebar */}
      <div className="w-[200px] border-r border-neutral-200 flex-shrink-0 flex flex-col bg-white">
        <div className="p-5 border-b border-neutral-200">
          <h2 className="text-lg font-semibold text-neutral-900">学习中心</h2>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          <button 
            onClick={() => setActiveTab('learning')}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2.5 rounded-[8px] text-[14px] font-medium transition-colors text-left",
              activeTab === 'learning' 
                ? "bg-[#fff2e8] text-[#fa541c]" 
                : "text-neutral-500 hover:bg-neutral-50 hover:text-neutral-900"
            )}
          >
            <BookOpen className="w-5 h-5" />
            我的学习
          </button>
          
          <button 
            onClick={() => setActiveTab('duration')}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2.5 rounded-[8px] text-[14px] font-medium transition-colors text-left",
              activeTab === 'duration' 
                ? "bg-[#fff2e8] text-[#fa541c]" 
                : "text-neutral-500 hover:bg-neutral-50 hover:text-neutral-900"
            )}
          >
            <Clock className="w-5 h-5" />
            学习时长
          </button>

          <button 
            onClick={() => setActiveTab('ai-path')}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2.5 rounded-[8px] text-[14px] font-medium transition-colors text-left",
              activeTab === 'ai-path' 
                ? "bg-[#fff2e8] text-[#fa541c]" 
                : "text-neutral-500 hover:bg-neutral-50 hover:text-neutral-900"
            )}
          >
            <Bot className="w-5 h-5" />
            AI学习路径记录
          </button>

          <button 
            onClick={() => setActiveTab('scores')}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2.5 rounded-[8px] text-[14px] font-medium transition-colors text-left",
              activeTab === 'scores' 
                ? "bg-[#fff2e8] text-[#fa541c]" 
                : "text-neutral-500 hover:bg-neutral-50 hover:text-neutral-900"
            )}
          >
            <Award className="w-5 h-5" />
            查看成绩
          </button>
        </nav>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-auto bg-[#f5f6f8] p-6">
        <div className="flex items-center text-sm text-neutral-500 mb-6 shrink-0">
          <Link to="/user" className="hover:text-[#fa541c] transition-colors">首页</Link>
          <ChevronRight className="w-4 h-4 mx-1" />
          <span className="text-neutral-900 font-bold">
            {activeTab === 'scores' ? '查看成绩' : '我的学习'}
          </span>
        </div>
        
        {activeTab === 'learning' && renderLearningTab()}
        {activeTab === 'duration' && renderDurationTab()}
        {activeTab === 'ai-path' && renderAIPathTab()}
        {activeTab === 'scores' && renderScoresTab()}
      </div>

      {/* Toast alert notification */}
      {toastMsg && (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 z-[300] animate-in slide-in-from-top-4 fade-in duration-300">
          <div className="bg-white px-6 py-3 rounded-lg shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-neutral-100 flex items-center gap-2">
            <Award className="w-5 h-5 text-[#fa541c] shrink-0" />
            <span className="text-sm font-bold text-neutral-800">{toastMsg}</span>
          </div>
        </div>
      )}
    </div>
  );
}
