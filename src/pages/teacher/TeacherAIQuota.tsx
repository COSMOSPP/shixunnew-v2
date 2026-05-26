import React, { useState } from 'react';
import { 
  Cpu, Search, ChevronDown, Plus, Play, Pause, Trash2, Edit3, CheckCircle2, 
  AlertTriangle, X, Settings, Database, Share2, Eye, Receipt, Calendar, 
  TrendingUp, Users, FileText, Send, Info, Award, Check, RotateCcw, HelpCircle, ShieldAlert, Sliders
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// --- Interface Types ---
interface UserTokenItem {
  id: string;
  name: string;
  role: '学生' | '教师';
  college: string;
  major: string;
  quota: number; // in Millions
  used: number; // in Millions
  status: '正常' | '接近上限' | '已耗尽';
}

interface CapabilityLimitItem {
  id: string;
  name: string;
  desc: string;
  status: 'active' | 'inactive';
  dailyLimit: number; // in M tokens
  singleLimit: number; // in K tokens
  concurrencyLimit: number; // requests
  weeklyLimit: number; // in M tokens
}

interface TempRequestItem {
  id: string;
  applicant: string;
  role: '学生' | '教师';
  reason: string;
  amount: number; // in M tokens
  currentQuota: number;
  historyApps: number; // count
  status: '待审批' | '已通过' | '已拒绝';
  time: string;
}

interface PresetsHistoryItem {
  id: string;
  time: string;
  operator: string;
  teacherDefault: number;
  studentDefault: number;
  scope: string;
  effectiveTime: string;
}

export default function TeacherAIQuota() {
  const [activeTab, setActiveTab] = useState<'monitor' | 'allocate' | 'limits' | 'approvals' | 'presets'>('monitor');
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | '学生' | '教师'>('all');
  
  // Single adjustment modal states
  const [isSingleOpen, setIsSingleOpen] = useState(false);
  const [targetUser, setTargetUser] = useState<UserTokenItem | null>(null);
  const [singleQuotaVal, setSingleQuotaVal] = useState(300);

  // AI Capability modal states
  const [isLimitOpen, setIsLimitOpen] = useState(false);
  const [targetCap, setTargetCap] = useState<CapabilityLimitItem | null>(null);
  const [formDaily, setFormDaily] = useState(10);
  const [formWeekly, setFormWeekly] = useState(50);
  const [formSingle, setFormSingle] = useState(100);
  const [formConcurrency, setFormConcurrency] = useState(10);

  // Approval modal states
  const [isApproveOpen, setIsApproveOpen] = useState(false);
  const [targetRequest, setTargetRequest] = useState<TempRequestItem | null>(null);
  const [adjustApproveVal, setAdjustApproveVal] = useState(50);

  // Bulk presets settings states
  const [teacherDefault, setTeacherDefault] = useState(1000);
  const [studentDefault, setStudentDefault] = useState(300);
  const [presetScope, setPresetScope] = useState<'all' | 'new_only'>('new_only');
  const [presetEffective, setPresetEffective] = useState<'now' | 'next_month'>('now');

  // Toast Notification
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'warning' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' | 'warning' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // --- Mock Database ---
  const [users, setUsers] = useState<UserTokenItem[]>([
    { id: '2026744501', name: '王小明', role: '学生', college: '计算机学院', major: '人工智能', quota: 350, used: 120, status: '正常' },
    { id: '2026744502', name: '李华', role: '学生', college: '计算机学院', major: '人工智能', class: '1班', quota: 200, used: 185, status: '接近上限' } as any,
    { id: '2026744503', name: '张伟', role: '学生', college: '计算机学院', major: '数据科学', quota: 500, used: 495, status: '已耗尽' },
    { id: '2026744504', name: '陈芳', role: '学生', college: '软件学院', major: '软件工程', quota: 300, used: 85, status: '正常' },
    { id: '2026744505', name: '刘洋', role: '学生', college: '软件学院', major: '软件工程', quota: 300, used: 298, status: '已耗尽' },
    { id: 'T1001', name: '张旭东 教授', role: '教师', college: '计算机学院', major: '教师团队', quota: 5000, used: 1200, status: '正常' },
    { id: 'T1002', name: '李瑞 讲师', role: '教师', college: '软件学院', major: '教师团队', quota: 2500, used: 2420, status: '接近上限' }
  ]);

  const [capabilities, setCapabilities] = useState<CapabilityLimitItem[]>([
    { id: 'cap-chat', name: '大模型交互问答 (Chat Assistants)', desc: '支持 GPT-4/Claude 类多维课件答疑和自由交互学习', status: 'active', dailyLimit: 20, weeklyLimit: 100, singleLimit: 128, concurrencyLimit: 15 },
    { id: 'cap-code', name: '智能编程辅助 (Code Copilot)', desc: 'IDE 中的智能代码补全、错误纠正和架构分析接口', status: 'active', dailyLimit: 10, weeklyLimit: 50, singleLimit: 64, concurrencyLimit: 10 },
    { id: 'cap-image', name: '多模态图像生成 (DALL-E/Midjourney)', desc: '支持实训课件所需的插图绘制与创意多模态微调', status: 'active', dailyLimit: 5, weeklyLimit: 25, singleLimit: 32, concurrencyLimit: 5 },
    { id: 'cap-analyst', name: '高级数据智能分析 (Data Analyst)', desc: '支持 CSV/Excel 复杂数据报表自动清洗与科学作图', status: 'active', dailyLimit: 15, weeklyLimit: 80, singleLimit: 96, concurrencyLimit: 8 }
  ]);

  const [tempRequests, setTempRequests] = useState<TempRequestItem[]>([
    { id: 'REQ-1092', applicant: '李华', role: '学生', reason: '中期科研项目大模型评估任务需要追加 100M tokens 算力支持', amount: 100, currentQuota: 200, historyApps: 1, status: '待审批', time: '2026-05-26 14:02' },
    { id: 'REQ-1088', applicant: '张伟', role: '学生', reason: '由于前期数据清洗产生意外耗用，需要临时扩充 50M tokens 完成本周实验', amount: 50, currentQuota: 500, historyApps: 2, status: '已通过', time: '2026-05-25 09:30' },
    { id: 'REQ-1082', applicant: '刘洋', role: '学生', reason: '个人测试算力额度溢出，需要追加 150M tokens', amount: 150, currentQuota: 300, historyApps: 3, status: '已拒绝', time: '2026-05-24 16:15' }
  ]);

  const [presetsHistory, setPresetsHistory] = useState<PresetsHistoryItem[]>([
    { id: 'HIST-803', time: '2026-05-20 10:12', operator: '校级管理员', teacherDefault: 5000, studentDefault: 300, scope: '仅新用户', effectiveTime: '立即生效' },
    { id: 'HIST-801', time: '2026-05-01 08:00', operator: '张旭东 教授', teacherDefault: 2500, studentDefault: 200, scope: '所有现有用户', effectiveTime: '次月生效' }
  ]);

  // Overall Global Token Statistics
  const globalTokenUsage = {
    allocated: 12000, // Millions
    used: 4898,
    totalLimit: 15000,
    warnCount: 3,
    pendingApps: tempRequests.filter(r => r.status === '待审批').length
  };

  const getPercent = (used: number, total: number) => {
    return Math.round((used / total) * 100);
  };

  // --- Filtering Logic ---
  const filteredUsers = users.filter(u => {
    if (roleFilter !== 'all' && u.role !== roleFilter) return false;
    
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchName = u.name.toLowerCase().includes(q);
      const matchId = u.id.toLowerCase().includes(q);
      const matchCollege = u.college.toLowerCase().includes(q);
      if (!matchName && !matchId && !matchCollege) return false;
    }
    return true;
  });

  // --- Save Single adjustment ---
  const handleSaveSingleQuota = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetUser) return;

    setUsers(users.map(u => {
      if (u.id === targetUser.id) {
        let nextStatus: '正常' | '接近上限' | '已耗尽' = '正常';
        const rate = getPercent(u.used, singleQuotaVal);
        if (rate >= 100) nextStatus = '已耗尽';
        else if (rate >= 80) nextStatus = '接近上限';

        return { ...u, quota: singleQuotaVal, status: nextStatus };
      }
      return u;
    }));

    setIsSingleOpen(false);
    showToast(`成功调整“${targetUser.name}”的 Token 算力配额为 ${singleQuotaVal}M !`);
  };

  // --- Save AI Capability Configuration ---
  const handleSaveCapLimits = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetCap) return;

    setCapabilities(capabilities.map(c => c.id === targetCap.id ? {
      ...c,
      dailyLimit: formDaily,
      weeklyLimit: formWeekly,
      singleLimit: formSingle,
      concurrencyLimit: formConcurrency
    } : c));

    setIsLimitOpen(false);
    showToast(`成功应用模型“${targetCap.name}”的各项能力限制规则！`);
  };

  // --- Save Approval ---
  const handleApproveAction = (status: '已通过' | '已拒绝', adjustVal?: number) => {
    if (!targetRequest) return;

    const finalAmount = adjustVal !== undefined ? adjustVal : targetRequest.amount;

    // Update tempRequests
    setTempRequests(tempRequests.map(r => r.id === targetRequest.id ? {
      ...r,
      status,
      amount: finalAmount
    } : r));

    // If approved, update target user's quota immediately (有效期7天，临时配额生效)
    if (status === '已通过') {
      setUsers(users.map(u => {
        if (u.name === targetRequest.applicant) {
          const nextQuota = u.quota + finalAmount;
          let nextStatus: '正常' | '接近上限' | '已耗尽' = '正常';
          const rate = getPercent(u.used, nextQuota);
          if (rate >= 100) nextStatus = '已耗尽';
          else if (rate >= 80) nextStatus = '接近上限';

          return { ...u, quota: nextQuota, status: nextStatus };
        }
        return u;
      }));
      showToast(`审批已通过！已为“${targetRequest.applicant}”临时追加 ${finalAmount}M Token配额，即时生效`);
    } else {
      showToast(`已驳回“${targetRequest.applicant}”的临时配额增补申请`, 'warning');
    }

    setIsApproveOpen(false);
  };

  // --- Save Default presets ---
  const handleApplyDefaultPresets = (e: React.FormEvent) => {
    e.preventDefault();

    const scopeLabel = presetScope === 'all' ? '所有现有用户' : '仅新用户';
    const timeLabel = presetEffective === 'now' ? '立即生效' : '次月生效';

    // Insert history
    const newHist: PresetsHistoryItem = {
      id: 'HIST-' + Math.floor(800 + Math.random() * 200),
      time: new Date().toLocaleString('zh-CN', { hour12: false }).replace(/\//g, '-'),
      operator: '张旭东 教授',
      teacherDefault,
      studentDefault,
      scope: scopeLabel,
      effectiveTime: timeLabel
    };

    setPresetsHistory([newHist, ...presetsHistory]);

    // Apply to all existing users if selected and effective immediately
    if (presetScope === 'all' && presetEffective === 'now') {
      setUsers(users.map(u => {
        const nextQuota = u.role === '学生' ? studentDefault : teacherDefault;
        let nextStatus: '正常' | '接近上限' | '已耗尽' = '正常';
        const rate = getPercent(u.used, nextQuota);
        if (rate >= 100) nextStatus = '已耗尽';
        else if (rate >= 80) nextStatus = '接近上限';

        return { ...u, quota: nextQuota, status: nextStatus };
      }));
      showToast(`批量配置已立即应用到所有现有用户：教师默认 ${teacherDefault}M，学生默认 ${studentDefault}M`);
    } else {
      showToast(`批量默认配额配置已成功保存！应用范围：${scopeLabel}，生效时间：${timeLabel}`);
    }
  };

  return (
    <div className="space-y-6 pb-12 relative animate-fade-in">
      
      {/* Page Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-neutral-900 flex items-center gap-2">
            <div className="w-1.5 h-6 bg-[#fa541c] rounded-full"></div>
            AI配额管理
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            租户管理员可对师生进行Token细粒度分配，精细配置各类AI能力的并发和调用上限，审批临时增配申请并监控大盘用量
          </p>
        </div>
      </div>

      {/* Navigation tabs */}
      <div className="flex border-b border-neutral-200 mt-2">
        <button
          onClick={() => { setActiveTab('monitor'); }}
          className={cn(
            "flex items-center gap-2 px-5 pb-3 text-sm font-bold border-b-2 transition-all",
            activeTab === 'monitor' ? "text-[#fa541c] border-[#fa541c]" : "text-neutral-500 border-transparent hover:text-neutral-800"
          )}
        >
          <Sliders className="w-4 h-4" />
          Token 用量监控
        </button>
        <button
          onClick={() => { setActiveTab('allocate'); }}
          className={cn(
            "flex items-center gap-2 px-5 pb-3 text-sm font-bold border-b-2 transition-all",
            activeTab === 'allocate' ? "text-[#fa541c] border-[#fa541c]" : "text-neutral-500 border-transparent hover:text-neutral-800"
          )}
        >
          <Users className="w-4 h-4" />
          Token 配额分配库 ({users.length}人)
        </button>
        <button
          onClick={() => { setActiveTab('limits'); }}
          className={cn(
            "flex items-center gap-2 px-5 pb-3 text-sm font-bold border-b-2 transition-all",
            activeTab === 'limits' ? "text-[#fa541c] border-[#fa541c]" : "text-neutral-500 border-transparent hover:text-neutral-800"
          )}
        >
          <Cpu className="w-4 h-4" />
          AI能力限制配置 ({capabilities.length}项)
        </button>
        <button
          onClick={() => { setActiveTab('approvals'); }}
          className={cn(
            "flex items-center gap-2 px-5 pb-3 text-sm font-bold border-b-2 transition-all relative",
            activeTab === 'approvals' ? "text-[#fa541c] border-[#fa541c]" : "text-neutral-500 border-transparent hover:text-neutral-800"
          )}
        >
          <Receipt className="w-4 h-4" />
          临时配额审批柜
          {globalTokenUsage.pendingApps > 0 && (
            <span className="absolute top-0.5 right-0.5 px-1.5 py-0.5 text-[9px] font-black bg-red-500 text-white rounded-full leading-none">
              {globalTokenUsage.pendingApps}
            </span>
          )}
        </button>
        <button
          onClick={() => { setActiveTab('presets'); }}
          className={cn(
            "flex items-center gap-2 px-5 pb-3 text-sm font-bold border-b-2 transition-all",
            activeTab === 'presets' ? "text-[#fa541c] border-[#fa541c]" : "text-neutral-500 border-transparent hover:text-neutral-800"
          )}
        >
          <Settings className="w-4 h-4" />
          批量默认额度预设
        </button>
      </div>

      {/* Tab Content 1: Token 用量用量监控 */}
      {activeTab === 'monitor' && (
        <div className="space-y-6">
          
          {/* Top Info Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            
            <div className="bg-white p-5 rounded-2xl border border-neutral-200/60 shadow-sm flex items-center justify-between group hover:border-[#fa541c]/40 transition-all">
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-neutral-400 block uppercase tracking-wider">租户 Token 已用总量</span>
                <strong className="text-2xl font-black text-neutral-800 block tracking-tight">{globalTokenUsage.used} M</strong>
                <span className="text-[10px] text-neutral-400 block">租户上限: {globalTokenUsage.totalLimit} M</span>
              </div>
              <div className="p-3 bg-neutral-50 rounded-2xl text-neutral-400 group-hover:bg-[#fff2e8] group-hover:text-[#fa541c] transition-all">
                <Database className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-neutral-200/60 shadow-sm flex items-center justify-between group hover:border-[#fa541c]/40 transition-all">
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-neutral-400 block uppercase tracking-wider">总分配 Token</span>
                <strong className="text-2xl font-black text-neutral-800 block tracking-tight">{globalTokenUsage.allocated} M</strong>
                <span className="text-[10px] text-neutral-400 block">已分配占比: {getPercent(globalTokenUsage.allocated, globalTokenUsage.totalLimit)}%</span>
              </div>
              <div className="p-3 bg-neutral-50 rounded-2xl text-neutral-400 group-hover:bg-[#fff2e8] group-hover:text-[#fa541c] transition-all">
                <Sliders className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-neutral-200/60 shadow-sm flex items-center justify-between group hover:border-[#fa541c]/40 transition-all">
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-neutral-400 block uppercase tracking-wider">接近上限/耗尽预警数</span>
                <strong className="text-2xl font-black text-red-600 block tracking-tight">{globalTokenUsage.warnCount} 人</strong>
                <span className="text-[10px] text-red-500 font-bold block flex items-center gap-1">
                  <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div> 亟需调整或追加额度
                </span>
              </div>
              <div className="p-3 bg-neutral-50 rounded-2xl text-neutral-400 group-hover:bg-red-50 group-hover:text-red-600 transition-all">
                <ShieldAlert className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-neutral-200/60 shadow-sm flex items-center justify-between group hover:border-[#fa541c]/40 transition-all">
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-neutral-400 block uppercase tracking-wider">待审批临时申请</span>
                <strong className="text-2xl font-black text-[#fa541c] block tracking-tight">{globalTokenUsage.pendingApps} 笔</strong>
                <span className="text-[10px] text-neutral-400 block">有效期7天，即审即用</span>
              </div>
              <div className="p-3 bg-neutral-50 rounded-2xl text-neutral-400 group-hover:bg-[#fff2e8] group-hover:text-[#fa541c] transition-all">
                <Receipt className="w-6 h-6" />
              </div>
            </div>

          </div>

          {/* Warning notice and graphs grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            
            {/* Fluctuation trend graph using SVG */}
            <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-neutral-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
                <div className="space-y-1">
                  <h3 className="font-bold text-neutral-800 text-[14px] flex items-center gap-1.5">
                    <TrendingUp className="w-4 h-4 text-[#fa541c]" />
                    租户大模型 Token 用量趋势分析
                  </h3>
                  <p className="text-[10px] text-neutral-400">最近几周学生实验和教学活动导致的API Token调用量走势</p>
                </div>
              </div>

              <div className="relative pt-4">
                <svg viewBox="0 0 600 180" className="w-full h-36 overflow-visible">
                  <defs>
                    <linearGradient id="area-grad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#fa541c" stopOpacity="0.2" />
                      <stop offset="100%" stopColor="#fa541c" stopOpacity="0.0" />
                    </linearGradient>
                    <linearGradient id="peak-grad" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#fa541c" />
                      <stop offset="100%" stopColor="#f5222d" />
                    </linearGradient>
                  </defs>
                  <line x1="0" y1="30" x2="600" y2="30" stroke="#f3f4f6" strokeDasharray="3,3" />
                  <line x1="0" y1="70" x2="600" y2="70" stroke="#f3f4f6" strokeDasharray="3,3" />
                  <line x1="0" y1="110" x2="600" y2="110" stroke="#f3f4f6" strokeDasharray="3,3" />
                  <line x1="0" y1="150" x2="600" y2="150" stroke="#eaeaea" />

                  {/* Beautiful Smooth Bezier Area */}
                  <path d="M 50 150 L 50 120 C 100 100, 100 85, 150 85 C 200 85, 200 115, 250 115 C 300 115, 300 60, 350 60 C 400 60, 400 95, 450 95 C 500 95, 500 40, 550 40 L 550 150 Z" fill="url(#area-grad)" />
                  
                  {/* Beautiful Smooth Bezier Stroke */}
                  <path d="M 50 120 C 100 100, 100 85, 150 85 C 200 85, 200 115, 250 115 C 300 115, 300 60, 350 60 C 400 60, 400 95, 450 95 C 500 95, 500 40, 550 40" fill="none" stroke="#fa541c" strokeWidth="3" strokeLinecap="round" />
                  
                  {/* Data Point Circles */}
                  <circle cx="150" cy="85" r="4.5" fill="#fa541c" stroke="#fff" strokeWidth="1.5" />
                  <circle cx="350" cy="60" r="4.5" fill="#fa541c" stroke="#fff" strokeWidth="1.5" />
                  
                  {/* Pulsing Warning Radar Circle using SVG standard animations */}
                  <circle cx="550" cy="40" r="4.5" fill="#fa541c" stroke="#fff" strokeWidth="1.5">
                    <animate attributeName="r" values="4.5;12;4.5" dur="2s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="1;0;1" dur="2s" repeatCount="indefinite" />
                  </circle>
                  <circle cx="550" cy="40" r="4.5" fill="#fa541c" stroke="#fff" strokeWidth="1.5" />

                  {/* SVG Native Floating Tooltips/Labels (100% vector precise and responsive!) */}
                  <g transform="translate(150, 50)">
                    <rect x="-26" y="-12" width="52" height="18" rx="5" fill="#fff" stroke="#fa541c" strokeWidth="1" />
                    <text x="0" y="0" fill="#fa541c" fontSize="9" fontWeight="bold" textAnchor="middle" dy="0.3em">350M</text>
                  </g>

                  <g transform="translate(350, 25)">
                    <rect x="-26" y="-12" width="52" height="18" rx="5" fill="#fff" stroke="#fa541c" strokeWidth="1" />
                    <text x="0" y="0" fill="#fa541c" fontSize="9" fontWeight="bold" textAnchor="middle" dy="0.3em">480M</text>
                  </g>

                  <g transform="translate(550, 5)">
                    <rect x="-70" y="-13" width="70" height="20" rx="5" fill="url(#peak-grad)" stroke="#fff" strokeWidth="1" />
                    <text x="-35" y="0" fill="#fff" fontSize="9" fontWeight="black" textAnchor="middle" dy="0.3em">峰值: 680M</text>
                  </g>

                  <text x="50" y="168" fill="#888" fontSize="10" textAnchor="middle">W1</text>
                  <text x="150" y="168" fill="#888" fontSize="10" textAnchor="middle">W2</text>
                  <text x="250" y="168" fill="#888" fontSize="10" textAnchor="middle">W3</text>
                  <text x="350" y="168" fill="#888" fontSize="10" textAnchor="middle">W4</text>
                  <text x="450" y="168" fill="#888" fontSize="10" textAnchor="middle">W5</text>
                  <text x="550" y="168" fill="#888" fontSize="10" textAnchor="end">W6 (本周)</text>
                </svg>
              </div>
            </div>

            {/* Top Consumer list */}
            <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-sm space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
                <h3 className="font-bold text-neutral-800 text-[14px] flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-amber-500" />
                  Token 消耗大户 TOP 5
                </h3>
                <span className="text-[10px] text-neutral-400">学生/教师</span>
              </div>

              <div className="space-y-3.5 text-xs text-neutral-600">
                <div className="flex items-center justify-between font-medium">
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded bg-red-100 text-red-600 font-bold text-[9px] flex items-center justify-center">1</span>
                    <strong className="text-neutral-800">张旭东 教授 (教师)</strong>
                  </div>
                  <span className="font-mono text-neutral-700 font-black">1200.0M Tokens</span>
                </div>

                <div className="flex items-center justify-between font-medium">
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded bg-orange-100 text-orange-600 font-bold text-[9px] flex items-center justify-center">2</span>
                    <strong className="text-neutral-800">张伟 (学生)</strong>
                  </div>
                  <span className="font-mono text-red-600 font-black">495.0M Tokens (99%)</span>
                </div>

                <div className="flex items-center justify-between font-medium">
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded bg-amber-100 text-amber-600 font-bold text-[9px] flex items-center justify-center">3</span>
                    <strong className="text-neutral-800">王小明 (学生)</strong>
                  </div>
                  <span className="font-mono text-neutral-500 font-bold">120.0M Tokens</span>
                </div>

                <div className="flex items-center justify-between font-medium">
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded bg-neutral-100 text-neutral-500 font-bold text-[9px] flex items-center justify-center">4</span>
                    <strong className="text-neutral-800">刘洋 (学生)</strong>
                  </div>
                  <span className="font-mono text-red-600 font-black">298.0M Tokens (99%)</span>
                </div>

                <div className="flex items-center justify-between font-medium">
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded bg-neutral-100 text-neutral-500 font-bold text-[9px] flex items-center justify-center">5</span>
                    <strong className="text-neutral-800">李瑞 讲师 (教师)</strong>
                  </div>
                  <span className="font-mono text-amber-600 font-bold">2420.0M Tokens (96.8%)</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Tab Content 2: Token 配额分配分配库 */}
      {activeTab === 'allocate' && (
        <div className="space-y-4">
          
          {/* Searching and filtering toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-4 py-1 bg-transparent w-full">
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative w-full sm:w-64">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input 
                  type="text" 
                  placeholder="搜索学号、姓名、学院..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-3 py-2 text-xs border border-neutral-200 rounded-lg focus:outline-none focus:border-[#fa541c] w-full bg-white transition-all text-neutral-700"
                />
              </div>

              <div className="relative w-full sm:w-36">
                <select 
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value as any)}
                  className="w-full text-xs border border-neutral-200 rounded-lg pl-3 pr-8 py-2 focus:outline-none bg-white text-neutral-700 font-bold appearance-none cursor-pointer"
                >
                  <option value="all">所有角色类型</option>
                  <option value="学生">学生选课账号</option>
                  <option value="教师">协同协作教师</option>
                </select>
                <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Allocation Grid Table */}
          <div className="bg-white rounded overflow-hidden shadow-sm border border-neutral-200/50">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse whitespace-nowrap">
                <thead>
                  <tr className="border-b border-neutral-100 bg-neutral-50/50 text-[13px] text-neutral-600">
                    <th className="p-4 pl-5">基本资料</th>
                    <th className="p-4">角色类型</th>
                    <th className="p-4">所属学院/专业</th>
                    <th className="p-4 text-right">已分配 Token</th>
                    <th className="p-4 text-right">已使用 Token</th>
                    <th className="p-4 text-right">用量占比</th>
                    <th className="p-4">配额预警状态</th>
                    <th className="p-4 text-left">操作入口</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map(u => {
                    const usePercent = getPercent(u.used, u.quota);
                    return (
                      <tr key={u.id} className="border-b border-neutral-100 hover:bg-neutral-50/30 transition-colors group text-[13px] text-neutral-700">
                        <td className="p-4 pl-5">
                          <div className="font-bold text-neutral-800">{u.name}</div>
                          <div className="text-[11px] text-neutral-400 font-mono mt-0.5">{u.id}</div>
                        </td>
                        <td className="p-4">{u.role}</td>
                        <td className="p-4 text-neutral-500">{u.college} / {u.major}</td>
                        <td className="p-4 text-right font-mono font-bold text-neutral-800">{u.quota}M</td>
                        <td className="p-4 text-right font-mono font-bold text-neutral-800">{u.used}M</td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <div className="w-20 h-2 bg-neutral-100 rounded-full overflow-hidden shrink-0">
                              <div 
                                className={cn(
                                  "h-full rounded-full",
                                  usePercent >= 100 ? "bg-red-500" :
                                  usePercent >= 80 ? "bg-amber-500" : "bg-emerald-500"
                                )}
                                style={{ width: `${Math.min(usePercent, 100)}%` }}
                              ></div>
                            </div>
                            <span className="text-[11px] font-mono font-bold text-neutral-600">{usePercent}%</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className={cn(
                            "px-2 py-0.5 text-[11px] font-black rounded border",
                            u.status === '正常' ? "bg-green-50 text-green-600 border-green-200" :
                            u.status === '接近上限' ? "bg-amber-50 text-amber-600 border-amber-200" : "bg-red-50 text-red-600 border-red-200"
                          )}>
                            {u.status === '正常' ? '额度充足' : u.status === '接近上限' ? '用量预警' : '配额耗尽'}
                          </span>
                        </td>
                        <td className="p-4 text-left">
                          <button 
                            onClick={() => { setTargetUser(u); setSingleQuotaVal(u.quota); setIsSingleOpen(true); }}
                            className="text-[#fa541c] hover:text-[#e84a15] font-bold text-xs transition-colors cursor-pointer"
                          >
                            微调配额
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination footer */}
            <div className="flex items-center justify-end p-4 border-t border-neutral-100 gap-4 mt-2">
              <span className="text-[13px] text-neutral-500 font-bold">共 {filteredUsers.length} 条</span>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="h-7 w-7 p-0 rounded-sm" disabled>&lt;</Button>
                <Button variant="outline" size="sm" className="h-7 w-7 p-0 rounded-sm bg-[#fa541c] text-white border-[#fa541c]">1</Button>
                <Button variant="outline" size="sm" className="h-7 w-7 p-0 rounded-sm" disabled>&gt;</Button>
              </div>
              <select className="text-[13px] border border-neutral-200 rounded-sm px-2 py-1 focus:outline-none focus:border-[#fa541c] text-neutral-600 font-medium">
                <option>10 条/页</option>
                <option>20 条/页</option>
                <option>50 条/页</option>
              </select>
            </div>
          </div>

        </div>
      )}

      {/* Tab Content 3: AI能力限制限制配置 */}
      {activeTab === 'limits' && (
        <div className="space-y-6">
          <div className="p-4 bg-orange-50/20 border border-orange-200 rounded-xl text-xs text-neutral-600 leading-relaxed flex items-start gap-1.5">
            <Info className="w-4 h-4 text-[#fa541c] shrink-0 mt-0.5" />
            <span>
              <strong>安全与并发管理：</strong> 管理员可对特定大模型调用能力（每日上限、每周上限、单次调用上限和并发数）配置访问约束规则。该规则即时应用于本租户下全体师生角色。
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {capabilities.map((cap) => (
              <div key={cap.id} className="bg-white rounded-2xl p-5 border border-neutral-200 shadow-sm flex flex-col justify-between hover:border-[#fa541c]/30 hover:shadow-md transition-all">
                <div className="space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
                    <h3 className="font-bold text-neutral-800 text-[14px] flex items-center gap-2">
                      <div className="w-1.5 h-4.5 bg-[#fa541c] rounded-full"></div>
                      {cap.name}
                    </h3>
                    <span className="px-2 py-0.5 bg-green-50 text-green-600 border border-green-200 rounded-md text-[10px] font-black uppercase tracking-wider">生效中</span>
                  </div>
                  <p className="text-xs text-neutral-400 leading-relaxed">{cap.desc}</p>
                  
                  {/* Limitations metrics grid */}
                  <div className="grid grid-cols-2 gap-y-3 gap-x-4 pt-2 text-xs text-neutral-600">
                    <div>
                      <span className="text-neutral-400 block mb-0.5">每日消耗上限</span>
                      <strong className="text-neutral-800 font-bold font-mono">{cap.dailyLimit}M Tokens</strong>
                    </div>
                    <div>
                      <span className="text-neutral-400 block mb-0.5">每周累计上限</span>
                      <strong className="text-neutral-800 font-bold font-mono">{cap.weeklyLimit}M Tokens</strong>
                    </div>
                    <div>
                      <span className="text-neutral-400 block mb-0.5">单次最大请求</span>
                      <strong className="text-neutral-800 font-bold font-mono">{cap.singleLimit}K Tokens</strong>
                    </div>
                    <div>
                      <span className="text-neutral-400 block mb-0.5">租户最高并发数</span>
                      <strong className="text-neutral-800 font-bold font-mono">{cap.concurrencyLimit} 次/秒</strong>
                    </div>
                  </div>
                </div>

                <div className="pt-5 flex items-center justify-end border-t border-neutral-100 mt-4">
                  <button 
                    onClick={() => {
                      setTargetCap(cap);
                      setFormDaily(cap.dailyLimit);
                      setFormWeekly(cap.weeklyLimit);
                      setFormSingle(cap.singleLimit);
                      setFormConcurrency(cap.concurrencyLimit);
                      setIsLimitOpen(true);
                    }}
                    className="flex items-center gap-1.5 text-xs font-black text-[#fa541c] hover:text-[#e84a15] border border-orange-200 bg-white hover:bg-orange-50/20 px-3 py-1.5 rounded-lg shadow-sm transition-colors cursor-pointer"
                  >
                    <Settings className="w-3.5 h-3.5" /> 限制参数设定
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* Tab Content 4: 临时配额审批审批柜 */}
      {activeTab === 'approvals' && (
        <div className="space-y-4">
          <div className="p-4 bg-orange-50/20 border border-orange-200 rounded-xl text-xs text-neutral-600 leading-relaxed flex items-start gap-1.5">
            <Info className="w-4 h-4 text-[#fa541c] shrink-0 mt-0.5" />
            <span>
              <strong>审批机制说明：</strong> 学生与任课教师因科研实验、重大任务或结课考试产生额度溢出时可在线发起追加。审批同意后配额<strong>即时生效，有效期统一设定为7天，超期自动扣回</strong>。
            </span>
          </div>

          <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden divide-y divide-neutral-100">
            {tempRequests.map((req) => (
              <div key={req.id} className="p-5 hover:bg-neutral-50/40 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-5">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2.5 text-xs">
                    <span className="px-2 py-0.5 bg-neutral-100 text-neutral-600 border border-neutral-200 rounded font-bold text-[10px]">{req.id}</span>
                    <span className="text-neutral-400 font-mono">{req.time}</span>
                    <span className="font-bold text-neutral-700">申请人: {req.applicant} ({req.role})</span>
                    <span className="text-neutral-300">|</span>
                    <span className="text-neutral-500">当前配额: {req.currentQuota}M</span>
                    <span className="text-neutral-300">|</span>
                    <span className="text-neutral-500">历史申请: {req.historyApps}次</span>
                  </div>
                  <p className="text-xs font-bold text-neutral-800 leading-relaxed">{req.reason}</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-[11px] text-neutral-400">申请追补 Token 量：</span>
                    <strong className="text-sm font-black text-[#fa541c] font-mono">+{req.amount}M</strong>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0 self-end md:self-center">
                  {req.status === '待审批' ? (
                    <>
                      <button 
                        onClick={() => { setTargetRequest(req); setAdjustApproveVal(req.amount); setIsApproveOpen(true); }}
                        className="text-xs font-black text-white bg-[#fa541c] hover:bg-[#e84a15] px-4 py-2 rounded-lg shadow-sm cursor-pointer transition-colors"
                      >
                        介入审批
                      </button>
                      <button 
                        onClick={() => { setTargetRequest(req); handleApproveAction('已拒绝'); }}
                        className="text-xs font-black text-neutral-600 hover:text-neutral-800 border border-neutral-200 bg-white px-4 py-2 rounded-lg transition-colors cursor-pointer"
                      >
                        驳回
                      </button>
                    </>
                  ) : (
                    <span className={cn(
                      "text-xs font-bold px-3 py-1 rounded-lg border",
                      req.status === '已通过' ? "text-green-600 bg-green-50 border-green-200" : "text-neutral-400 bg-neutral-50 border-neutral-200"
                    )}>
                      {req.status}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* Tab Content 5: 批量默认额度预设 */}
      {activeTab === 'presets' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          
          {/* Preset settings form card */}
          <div className="lg:col-span-1 bg-white p-5 rounded-2xl border border-neutral-200 shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-neutral-100">
              <Settings className="w-4.5 h-4.5 text-[#fa541c]" />
              <h3 className="font-bold text-neutral-800 text-[14px]">一键批量全局额度预设</h3>
            </div>

            <form onSubmit={handleApplyDefaultPresets} className="space-y-4 text-xs">
              
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-neutral-700 block">新教师/协同教师默认分配配额 (M)</label>
                <input 
                  type="number" 
                  value={teacherDefault}
                  onChange={(e) => setTeacherDefault(Number(e.target.value))}
                  className="w-full border border-neutral-200 rounded-xl px-4 py-2.5 text-xs text-neutral-800 focus:outline-none" 
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-neutral-700 block">新学生默认分配配额 (M)</label>
                <input 
                  type="number" 
                  value={studentDefault}
                  onChange={(e) => setStudentDefault(Number(e.target.value))}
                  className="w-full border border-neutral-200 rounded-xl px-4 py-2.5 text-xs text-neutral-800 focus:outline-none" 
                />
              </div>

              {/* Preset scope */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-neutral-700 block">应用覆盖范围</span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setPresetScope('new_only')}
                    className={cn(
                      "py-2 rounded-lg border text-center font-bold transition-all cursor-pointer",
                      presetScope === 'new_only' ? "bg-orange-50 border-[#fa541c] text-[#fa541c]" : "border-neutral-200 text-neutral-600 bg-white"
                    )}
                  >
                    仅新入驻用户
                  </button>
                  <button
                    type="button"
                    onClick={() => setPresetScope('all')}
                    className={cn(
                      "py-2 rounded-lg border text-center font-bold transition-all cursor-pointer",
                      presetScope === 'all' ? "bg-orange-50 border-[#fa541c] text-[#fa541c]" : "border-neutral-200 text-neutral-600 bg-white"
                    )}
                  >
                    所有现有及新用户
                  </button>
                </div>
              </div>

              {/* Effective time selection */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-neutral-700 block">策略生效时间</span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setPresetEffective('now')}
                    className={cn(
                      "py-2 rounded-lg border text-center font-bold transition-all cursor-pointer",
                      presetEffective === 'now' ? "bg-orange-50 border-[#fa541c] text-[#fa541c]" : "border-neutral-200 text-neutral-600 bg-white"
                    )}
                  >
                    立即生效
                  </button>
                  <button
                    type="button"
                    onClick={() => setPresetEffective('next_month')}
                    className={cn(
                      "py-2 rounded-lg border text-center font-bold transition-all cursor-pointer",
                      presetEffective === 'next_month' ? "bg-orange-50 border-[#fa541c] text-[#fa541c]" : "border-neutral-200 text-neutral-600 bg-white"
                    )}
                  >
                    次月结算日生效
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <Button 
                  type="submit"
                  className="bg-[#fa541c] hover:bg-[#e84a15] text-white w-full h-9 rounded-xl text-xs font-bold shadow-md shadow-orange-500/10"
                >
                  确认应用全局默认分配规则
                </Button>
              </div>

            </form>
          </div>

          {/* Log change history list */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden flex flex-col">
            <div className="p-4 border-b border-neutral-100 bg-neutral-50/30 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-neutral-500" />
                <h3 className="font-bold text-neutral-800 text-[13px]">批量配额全局变更历史日志</h3>
              </div>
              <span className="text-[10px] text-neutral-400 font-bold">全局审计归档</span>
            </div>

            <div className="divide-y divide-neutral-100 text-xs">
              {presetsHistory.map((hist) => (
                <div key={hist.id} className="p-4 hover:bg-neutral-50/50 transition-colors space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-[10px]">
                      <span className="px-1.5 py-0.5 bg-neutral-100 border border-neutral-200 rounded text-neutral-500 font-mono font-bold">{hist.id}</span>
                      <span className="text-neutral-400 font-mono">{hist.time}</span>
                      <span className="font-bold text-neutral-700">操作人: {hist.operator}</span>
                    </div>
                    <span className="text-[10px] font-black text-green-600 bg-green-50 px-2 py-0.5 border border-green-200 rounded-md">
                      {hist.effectiveTime}
                    </span>
                  </div>
                  <p className="font-bold text-neutral-800">
                    默认配额设定：教师 <span className="font-mono text-[#fa541c]">{hist.teacherDefault}M</span> · 学生 <span className="font-mono text-[#fa541c]">{hist.studentDefault}M</span>
                  </p>
                  <div className="text-[10px] text-neutral-500">
                    应用覆盖范围：<strong className="text-neutral-700">{hist.scope}</strong>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* Modal 1: Single Quota adjustment Dialog */}
      {isSingleOpen && targetUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in">
          <form onSubmit={handleSaveSingleQuota} className="bg-white rounded-2xl shadow-xl w-full max-w-[420px] overflow-hidden border border-neutral-200 flex flex-col animate-in zoom-in-95 duration-150">
            
            <div className="p-5 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/50">
              <h2 className="text-[15px] font-black text-neutral-900 flex items-center gap-2">
                <Sliders className="w-5 h-5 text-[#fa541c]" /> 微调用户算力配额
              </h2>
              <button 
                type="button" 
                onClick={() => { setIsSingleOpen(false); setTargetUser(null); }} 
                className="text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 p-1.5 rounded-full transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="p-3.5 bg-neutral-50 rounded-xl border border-neutral-200/50 text-xs text-neutral-600 space-y-1">
                <div>用户姓名：<strong className="text-neutral-800">{targetUser.name}</strong> <span className="text-neutral-400 font-mono">({targetUser.role})</span></div>
                <div>当前额度：<strong className="text-neutral-800 font-mono">{targetUser.quota} M</strong></div>
                <div>已用额度：<strong className="text-neutral-800 font-mono">{targetUser.used} M</strong></div>
              </div>
              
              <div className="space-y-1.5">
                <label className="text-[12px] font-bold text-neutral-700 block">新 Token 算力配额值 (M)</label>
                <input 
                  type="number" 
                  value={singleQuotaVal}
                  onChange={(e) => setSingleQuotaVal(Number(e.target.value))}
                  className="w-full border border-neutral-200 rounded-xl px-4 py-2.5 text-xs text-neutral-800 focus:outline-none focus:border-[#fa541c]" 
                />
                <span className="text-[10px] text-neutral-400 mt-1 block">配额单位为 M (百万 Token)，大模型实际运行消耗将由此配额库中核扣。</span>
              </div>
            </div>

            <div className="p-5 border-t border-neutral-100 bg-neutral-50/20 flex items-center justify-end gap-3">
              <Button 
                type="button" 
                onClick={() => { setIsSingleOpen(false); setTargetUser(null); }} 
                variant="outline" 
                className="border-neutral-200 text-neutral-600 font-bold h-9 px-5 rounded-lg text-xs"
              >
                取消
              </Button>
              <Button 
                type="submit" 
                className="bg-[#fa541c] hover:bg-[#e84a15] text-white font-bold h-9 px-6 rounded-lg shadow-md shadow-orange-500/10 text-xs"
              >
                确认微调
              </Button>
            </div>

          </form>
        </div>
      )}

      {/* Modal 2: AI Capability Limitations adjustment Dialog */}
      {isLimitOpen && targetCap && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in">
          <form onSubmit={handleSaveCapLimits} className="bg-white rounded-2xl shadow-xl w-full max-w-[480px] overflow-hidden border border-neutral-200 flex flex-col animate-in zoom-in-95 duration-150">
            
            <div className="p-5 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/50">
              <h2 className="text-[15px] font-black text-neutral-900 flex items-center gap-2">
                <Cpu className="w-5 h-5 text-[#fa541c]" /> {targetCap.name} 限制微调
              </h2>
              <button 
                type="button" 
                onClick={() => { setIsLimitOpen(false); setTargetCap(null); }} 
                className="text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 p-1.5 rounded-full transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs text-neutral-600">
              
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-neutral-700 block">每日大模型消耗上限 (M Tokens)</label>
                <input 
                  type="number" 
                  value={formDaily}
                  onChange={(e) => setFormDaily(Number(e.target.value))}
                  className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-xs text-neutral-800 focus:outline-none" 
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-neutral-700 block">每周累计上限 (M Tokens)</label>
                <input 
                  type="number" 
                  value={formWeekly}
                  onChange={(e) => setFormWeekly(Number(e.target.value))}
                  className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-xs text-neutral-800 focus:outline-none" 
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-neutral-700 block">单次调用最大请求 (K Tokens)</label>
                <input 
                  type="number" 
                  value={formSingle}
                  onChange={(e) => setFormSingle(Number(e.target.value))}
                  className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-xs text-neutral-800 focus:outline-none" 
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-neutral-700 block">单租户瞬时并发上限 (次/秒)</label>
                <input 
                  type="number" 
                  value={formConcurrency}
                  onChange={(e) => setFormConcurrency(Number(e.target.value))}
                  className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-xs text-neutral-800 focus:outline-none" 
                />
              </div>

            </div>

            <div className="p-5 border-t border-neutral-100 bg-neutral-50/20 flex items-center justify-end gap-3">
              <Button 
                type="button" 
                onClick={() => { setIsLimitOpen(false); setTargetCap(null); }} 
                variant="outline" 
                className="border-neutral-200 text-neutral-600 font-bold h-9 px-5 rounded-lg text-xs"
              >
                取消
              </Button>
              <Button 
                type="submit" 
                className="bg-[#fa541c] hover:bg-[#e84a15] text-white font-bold h-9 px-6 rounded-lg shadow-md shadow-orange-500/10 text-xs"
              >
                应用限制参数
              </Button>
            </div>

          </form>
        </div>
      )}

      {/* Modal 3: Temporary Quota Approval Dialog */}
      {isApproveOpen && targetRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-[460px] overflow-hidden border border-neutral-200 flex flex-col animate-in zoom-in-95 duration-150">
            
            <div className="p-5 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/50">
              <h2 className="text-[15px] font-black text-neutral-900 flex items-center gap-2">
                <Receipt className="w-5 h-5 text-[#fa541c]" /> 临时配额增补审批台
              </h2>
              <button 
                type="button" 
                onClick={() => { setIsApproveOpen(false); setTargetRequest(null); }} 
                className="text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 p-1.5 rounded-full transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              
              {/* Application Details */}
              <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200/60 text-xs text-neutral-600 space-y-2 leading-relaxed">
                <div>申请人姓名：<strong className="text-neutral-800">{targetRequest.applicant} ({targetRequest.role})</strong></div>
                <div>申请临时Token数：<strong className="text-[#fa541c] font-black font-mono">+{targetRequest.amount}M Tokens</strong></div>
                <div>申请真实理由：<span className="text-neutral-700 italic">“{targetRequest.reason}”</span></div>
                <div className="pt-1.5 border-t border-neutral-200 flex items-center justify-between text-[11px]">
                  <span>当前正式配额: {targetRequest.currentQuota}M</span>
                  <span>往期累计申请: {targetRequest.historyApps}次</span>
                </div>
              </div>

              {/* Adjust approve amount value */}
              <div className="space-y-1.5">
                <label className="text-[12px] font-bold text-neutral-700 block">审批决定同意追加额度 (M)</label>
                <input 
                  type="number" 
                  value={adjustApproveVal}
                  onChange={(e) => setAdjustApproveVal(Number(e.target.value))}
                  className="w-full border border-neutral-200 rounded-xl px-4 py-2.5 text-xs text-neutral-800 focus:outline-none focus:border-[#fa541c]" 
                />
                <span className="text-[10px] text-neutral-400 mt-1 block">可直接在此修改调整同意追加的额度大小，随后立即划拨即时生效（有效期7天）。</span>
              </div>

            </div>

            {/* Actions Footer */}
            <div className="p-5 border-t border-neutral-100 bg-neutral-50/20 flex items-center justify-end gap-2.5">
              <Button 
                onClick={() => handleApproveAction('已拒绝')}
                variant="outline" 
                className="border-neutral-200 text-red-600 hover:bg-red-50 hover:border-red-300 font-bold h-9 px-4 rounded-lg text-xs"
              >
                拒绝申请
              </Button>
              <Button 
                onClick={() => handleApproveAction('已通过', adjustApproveVal)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-9 px-5 rounded-lg shadow-md shadow-emerald-500/10 text-xs"
              >
                同意并即时增发
              </Button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
