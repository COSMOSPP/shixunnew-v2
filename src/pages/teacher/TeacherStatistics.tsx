import React, { useState } from 'react';
import { BarChart3, TrendingUp, Calendar, Users, Clock, Award, ArrowUpRight, ArrowDownRight, ChevronRight, AlertTriangle, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

export default function TeacherStatistics() {
  const navigate = useNavigate();
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'semester'>('week');

  // 模拟警报学生数据
  const warningStudents = [
    { name: '张伟', course: '深度学习进阶', class: 'DL-2602班', progress: '45%', duration: '4.2h', reason: '学习进度严重落后' },
    { name: '刘洋', course: '深度学习进阶', class: 'DL-2602班', progress: '10%', duration: '0.8h', reason: '连续5天未登录系统' },
    { name: '李强', course: '人工智能基础与实践', class: 'AI-2601班', progress: '35%', duration: '3.5h', reason: '多次作业测试未及格' },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Breadcrumb */}
      <div className="text-sm text-neutral-500 flex items-center gap-1.5">
        <span className="hover:text-[#fa541c] cursor-pointer" onClick={() => navigate('/teacher')}>首页</span>
        <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
        <span className="text-neutral-900">学习数据统计</span>
      </div>

      {/* Header and Filter */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-neutral-900 flex items-center gap-2">
            <div className="w-1.5 h-6 bg-[#fa541c] rounded-full"></div>
            学习数据统计
          </h1>
          <p className="text-sm text-neutral-500 mt-1">
            实时监控平台学生的整体学习时长、作业完成率、学习曲线与预警指标
          </p>
        </div>

        {/* Time Selector */}
        <div className="flex bg-white p-1 rounded-xl border border-neutral-200/80 shadow-sm self-start md:self-center">
          {(['week', 'month', 'semester'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={cn(
                "px-4 py-1.5 text-xs font-bold rounded-lg transition-all",
                timeRange === range
                  ? "bg-[#fa541c] text-white shadow-sm"
                  : "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50"
              )}
            >
              {range === 'week' ? '本周' : range === 'month' ? '本月' : '本学期'}
            </button>
          ))}
        </div>
      </div>

      {/* Summary KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* KPI 1 */}
        <div className="relative overflow-hidden bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl p-6 text-white shadow-md shadow-indigo-500/10 group hover:-translate-y-1 transition-all duration-300">
          <div className="absolute right-0 top-0 w-24 h-24 bg-white/10 rounded-full blur-xl translate-x-4 -translate-y-4 pointer-events-none"></div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-white/80 font-medium">总学习时长</span>
            <div className="w-10 h-10 rounded-xl bg-white/20 border border-white/20 flex items-center justify-center backdrop-blur-md">
              <Clock className="w-5 h-5 text-white" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-black tracking-tight">15,840</span>
            <span className="text-sm font-medium ml-1">小时</span>
          </div>
          <div className="mt-4 pt-4 border-t border-white/15 flex items-center gap-1.5 text-xs text-white/80">
            <span className="flex items-center gap-0.5 bg-white/20 px-1.5 py-0.5 rounded text-white font-bold">
              <ArrowUpRight className="w-3.5 h-3.5" /> 12.4%
            </span>
            <span>较上周持续增长</span>
          </div>
        </div>

        {/* KPI 2 */}
        <div className="relative overflow-hidden bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-6 text-white shadow-md shadow-emerald-500/10 group hover:-translate-y-1 transition-all duration-300">
          <div className="absolute right-0 top-0 w-24 h-24 bg-white/10 rounded-full blur-xl translate-x-4 -translate-y-4 pointer-events-none"></div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-white/80 font-medium">课程平均完成率</span>
            <div className="w-10 h-10 rounded-xl bg-white/20 border border-white/20 flex items-center justify-center backdrop-blur-md">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-black tracking-tight">82.4%</span>
          </div>
          <div className="mt-4 pt-4 border-t border-white/15 flex items-center gap-1.5 text-xs text-white/80">
            <span className="flex items-center gap-0.5 bg-white/20 px-1.5 py-0.5 rounded text-white font-bold">
              <ArrowUpRight className="w-3.5 h-3.5" /> 4.2%
            </span>
            <span>达成教学大纲预期</span>
          </div>
        </div>

        {/* KPI 3 */}
        <div className="relative overflow-hidden bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl p-6 text-white shadow-md shadow-amber-500/10 group hover:-translate-y-1 transition-all duration-300">
          <div className="absolute right-0 top-0 w-24 h-24 bg-white/10 rounded-full blur-xl translate-x-4 -translate-y-4 pointer-events-none"></div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-white/80 font-medium">活跃学生人数</span>
            <div className="w-10 h-10 rounded-xl bg-white/20 border border-white/20 flex items-center justify-center backdrop-blur-md">
              <Users className="w-5 h-5 text-white" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-black tracking-tight">342</span>
            <span className="text-sm font-medium ml-1">人</span>
          </div>
          <div className="mt-4 pt-4 border-t border-white/15 flex items-center gap-1.5 text-xs text-white/80">
            <span className="flex items-center gap-0.5 bg-white/20 px-1.5 py-0.5 rounded text-white font-bold">
              <ArrowUpRight className="w-3.5 h-3.5" /> 8.7%
            </span>
            <span>今日实时活跃 56 人</span>
          </div>
        </div>

        {/* KPI 4 */}
        <div className="relative overflow-hidden bg-gradient-to-br from-rose-500 to-pink-600 rounded-2xl p-6 text-white shadow-md shadow-rose-500/10 group hover:-translate-y-1 transition-all duration-300">
          <div className="absolute right-0 top-0 w-24 h-24 bg-white/10 rounded-full blur-xl translate-x-4 -translate-y-4 pointer-events-none"></div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-white/80 font-medium">综合考核合格率</span>
            <div className="w-10 h-10 rounded-xl bg-white/20 border border-white/20 flex items-center justify-center backdrop-blur-md">
              <Award className="w-5 h-5 text-white" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-black tracking-tight">94.2%</span>
          </div>
          <div className="mt-4 pt-4 border-t border-white/15 flex items-center gap-1.5 text-xs text-white/80">
            <span className="flex items-center gap-0.5 bg-white/20 px-1.5 py-0.5 rounded text-white font-bold">
              <ArrowDownRight className="w-3.5 h-3.5" /> 0.5%
            </span>
            <span>近期考卷难度适中</span>
          </div>
        </div>

      </div>

      {/* Main Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Line Chart Component - SVG based */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-neutral-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-neutral-800 text-[16px]">每日学习活跃度趋势</h3>
              <span className="text-xs text-neutral-400 font-medium flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 block"></span> 学习时长/小时
              </span>
            </div>
            <p className="text-xs text-neutral-500 mb-6">展示本周师生在实训系统上的累计实验和操作时长分布</p>
          </div>
          
          {/* Custom SVG Line Chart */}
          <div className="w-full h-64 relative mt-2">
            <svg viewBox="0 0 700 240" className="w-full h-full">
              {/* Defs for gradients */}
              <defs>
                <linearGradient id="chart-glow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366f1" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#6366f1" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              <line x1="50" y1="30" x2="660" y2="30" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="4 4" />
              <line x1="50" y1="80" x2="660" y2="80" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="4 4" />
              <line x1="50" y1="130" x2="660" y2="130" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="4 4" />
              <line x1="50" y1="180" x2="660" y2="180" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="4 4" />

              {/* Y Axis Labels */}
              <text x="35" y="35" className="text-[11px] fill-neutral-400 font-mono" textAnchor="end">250h</text>
              <text x="35" y="85" className="text-[11px] fill-neutral-400 font-mono" textAnchor="end">150h</text>
              <text x="35" y="135" className="text-[11px] fill-neutral-400 font-mono" textAnchor="end">80h</text>
              <text x="35" y="185" className="text-[11px] fill-neutral-400 font-mono" textAnchor="end">0h</text>

              {/* Area under the line */}
              <path
                d="M 50 180 Q 150 120 250 85 T 450 60 T 550 100 T 660 45 L 660 180 L 50 180 Z"
                fill="url(#chart-glow)"
              />

              {/* Chart Line */}
              <path
                d="M 50 180 Q 150 120 250 85 T 450 60 T 550 100 T 660 45"
                fill="none"
                stroke="#6366f1"
                strokeWidth="3.5"
                strokeLinecap="round"
              />

              {/* Interactive Dots & Shadows */}
              <circle cx="50" cy="180" r="4.5" fill="#ffffff" stroke="#6366f1" strokeWidth="3" />
              <circle cx="150" cy="120" r="4.5" fill="#ffffff" stroke="#6366f1" strokeWidth="3" />
              <circle cx="250" cy="85" r="4.5" fill="#ffffff" stroke="#6366f1" strokeWidth="3" />
              <circle cx="350" cy="70" r="4.5" fill="#ffffff" stroke="#6366f1" strokeWidth="3" />
              <circle cx="450" cy="60" r="4.5" fill="#ffffff" stroke="#6366f1" strokeWidth="3" />
              <circle cx="550" cy="100" r="4.5" fill="#ffffff" stroke="#6366f1" strokeWidth="3" />
              <circle cx="660" cy="45" r="4.5" fill="#ffffff" stroke="#6366f1" strokeWidth="3" />

              {/* Tooltip on Highlighted Day */}
              <rect x="405" y="10" width="90" height="35" rx="6" fill="#1e293b" opacity="0.95" />
              <text x="450" y="24" className="text-[10px] fill-white font-bold" textAnchor="middle">周四: 210小时</text>
              <line x1="450" y1="45" x2="450" y2="60" stroke="#1e293b" strokeWidth="1.5" />

              {/* X Axis line */}
              <line x1="50" y1="180" x2="660" y2="180" stroke="#e2e8f0" strokeWidth="1.5" />

              {/* X Axis Labels */}
              <text x="50" y="208" className="text-[11px] fill-neutral-500 font-bold" textAnchor="middle">周一</text>
              <text x="150" y="208" className="text-[11px] fill-neutral-500 font-bold" textAnchor="middle">周二</text>
              <text x="250" y="208" className="text-[11px] fill-neutral-500 font-bold" textAnchor="middle">周三</text>
              <text x="350" y="208" className="text-[11px] fill-neutral-500 font-bold" textAnchor="middle">周四</text>
              <text x="450" y="208" className="text-[11px] fill-neutral-500 font-bold" textAnchor="middle">周五</text>
              <text x="550" y="208" className="text-[11px] fill-neutral-500 font-bold" textAnchor="middle">周六</text>
              <text x="660" y="208" className="text-[11px] fill-neutral-500 font-bold" textAnchor="middle">周日</text>
            </svg>
          </div>
        </div>

        {/* Grade Distribution Chart - Donut SVG */}
        <div className="bg-white rounded-2xl p-6 border border-neutral-200 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-neutral-800 text-[16px] mb-1">成绩段分布分布</h3>
            <p className="text-xs text-neutral-500">全部课程作业与结业考卷综合评分</p>
          </div>
          
          <div className="flex items-center justify-center my-6 relative">
            <svg width="160" height="160" viewBox="0 0 36 36" className="transform -rotate-90">
              {/* Base grey track */}
              <circle cx="18" cy="18" r="15.915" fill="none" stroke="#f1f5f9" strokeWidth="4.2" />

              {/* Segment A (Green) - 40% */}
              <circle cx="18" cy="18" r="15.915" fill="none" stroke="#10b981" strokeWidth="4.2" 
                strokeDasharray="40 60" strokeDashoffset="0" />

              {/* Segment B (Blue) - 35% */}
              <circle cx="18" cy="18" r="15.915" fill="none" stroke="#3b82f6" strokeWidth="4.2" 
                strokeDasharray="35 65" strokeDashoffset="-40" />

              {/* Segment C (Amber) - 20% */}
              <circle cx="18" cy="18" r="15.915" fill="none" stroke="#f59e0b" strokeWidth="4.2" 
                strokeDasharray="20 80" strokeDashoffset="-75" />

              {/* Segment D (Red) - 5% */}
              <circle cx="18" cy="18" r="15.915" fill="none" stroke="#ef4444" strokeWidth="4.2" 
                strokeDasharray="5 95" strokeDashoffset="-95" />
            </svg>
            
            {/* Center Info Text */}
            <div className="absolute flex flex-col items-center">
              <span className="text-2xl font-black text-neutral-800">82.4</span>
              <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">班级均分</span>
            </div>
          </div>

          {/* Custom Legends */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="flex items-center gap-2 bg-neutral-50 px-2.5 py-1.5 rounded-lg border border-neutral-100">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 flex-shrink-0"></span>
              <span className="text-neutral-500 font-medium">优秀 (A): 40%</span>
            </div>
            <div className="flex items-center gap-2 bg-neutral-50 px-2.5 py-1.5 rounded-lg border border-neutral-100">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500 flex-shrink-0"></span>
              <span className="text-neutral-500 font-medium">良好 (B): 35%</span>
            </div>
            <div className="flex items-center gap-2 bg-neutral-50 px-2.5 py-1.5 rounded-lg border border-neutral-100">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 flex-shrink-0"></span>
              <span className="text-neutral-500 font-medium">中等 (C): 20%</span>
            </div>
            <div className="flex items-center gap-2 bg-neutral-50 px-2.5 py-1.5 rounded-lg border border-neutral-100">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 flex-shrink-0"></span>
              <span className="text-neutral-500 font-medium">不及格 (D): 5%</span>
            </div>
          </div>
        </div>

      </div>

      {/* Bottom Row: Course Progress Breakdown & At-Risk Warnings */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Course Progress Breakdown */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-neutral-200 shadow-sm space-y-5">
          <div>
            <h3 className="font-bold text-neutral-800 text-[16px]">核心课程进度与达标对比</h3>
            <p className="text-xs text-neutral-500 mt-0.5">各个在研课程的授课推进、实验提交和资源使用率指标</p>
          </div>
          
          <div className="space-y-4">
            
            {/* Course 1 */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold text-neutral-700">
                <span>人工智能基础与实践</span>
                <span className="text-[#fa541c]">88% 进度 (超预期)</span>
              </div>
              <div className="w-full h-3 bg-neutral-100 rounded-full overflow-hidden flex">
                <div className="h-full bg-gradient-to-r from-orange-400 to-[#fa541c] rounded-full" style={{ width: '88%' }}></div>
              </div>
              <div className="flex justify-between text-[10px] text-neutral-400">
                <span>实训项目已交率: 92%</span>
                <span>算力资源占用: 62%</span>
              </div>
            </div>

            {/* Course 2 */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold text-neutral-700">
                <span>深度学习进阶</span>
                <span className="text-indigo-500">65% 进度 (符合计划)</span>
              </div>
              <div className="w-full h-3 bg-neutral-100 rounded-full overflow-hidden flex">
                <div className="h-full bg-gradient-to-r from-indigo-400 to-indigo-600 rounded-full" style={{ width: '65%' }}></div>
              </div>
              <div className="flex justify-between text-[10px] text-neutral-400">
                <span>实训项目已交率: 58%</span>
                <span>算力资源占用: 88%</span>
              </div>
            </div>

            {/* Course 3 */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold text-neutral-700">
                <span>Python数据分析</span>
                <span className="text-emerald-500">100% 进度 (已结课)</span>
              </div>
              <div className="w-full h-3 bg-neutral-100 rounded-full overflow-hidden flex">
                <div className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full" style={{ width: '100%' }}></div>
              </div>
              <div className="flex justify-between text-[10px] text-neutral-400">
                <span>实训项目已交率: 99%</span>
                <span>算力资源占用: 0% (已释放)</span>
              </div>
            </div>

          </div>
        </div>

        {/* Learning Warning Panel */}
        <div className="bg-white rounded-2xl p-6 border border-neutral-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-neutral-800 text-[16px] flex items-center gap-1.5">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              学习预警名单
            </h3>
            <span className="px-2 py-0.5 bg-red-50 text-red-600 border border-red-200 rounded text-[11px] font-bold">
              3 名风险学生
            </span>
          </div>
          
          <div className="space-y-3">
            {warningStudents.map((student, idx) => (
              <div key={idx} className="p-3 bg-neutral-50 hover:bg-neutral-100/70 border border-neutral-200/50 rounded-xl transition-colors space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-neutral-800">{student.name}</span>
                  <span className="text-neutral-500 font-mono text-[11px]">{student.class}</span>
                </div>
                <div className="text-[11px] text-neutral-400 truncate">
                  课程：<span className="text-neutral-600 font-medium">{student.course}</span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-neutral-500 bg-white/70 px-2 py-1 rounded border border-neutral-100">
                  <span>当前进度: <strong className="text-red-500 font-bold">{student.progress}</strong></span>
                  <span>在线时长: <strong className="text-neutral-700">{student.duration}</strong></span>
                </div>
                <div className="text-[11px] font-medium text-red-600 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-red-600 rounded-full"></span>
                  原因：{student.reason}
                </div>
              </div>
            ))}
          </div>

          <Button 
            onClick={() => navigate('/teacher/students')} 
            className="w-full bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 text-neutral-700 h-9 font-bold text-xs rounded-xl shadow-sm mt-1"
          >
            进入用户管理跟进辅导
          </Button>
        </div>

      </div>
      
    </div>
  );
}
