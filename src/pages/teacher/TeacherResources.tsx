import React, { useState } from 'react';
import { 
  Search, ChevronDown, Plus, Cpu, Activity, AlertTriangle, ShieldCheck, 
  RotateCcw, Sliders, Server, Database, FileSpreadsheet, Eye, X, Check, 
  TrendingUp, BarChart3, Clock, HelpCircle, Users, FileText, Send, Info, Award
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface QuotaItem {
  gpuHours: number;
  cpuHours: number;
  projects: number;
  datasets: number;
  practices: number;
  aiAssistants: number;
  tokens: number; // in Millions
}

interface UserResourceItem {
  id: string;
  name: string;
  role: '学生' | '教师';
  college: string;
  major: string;
  class: string;
  progress: number; // 0-100%
  status: '正常' | '预警' | '耗尽';
  quotas: QuotaItem;
  allocatedDate: string;
  expiryDate: string;
}

interface TemplateItem {
  id: string;
  name: string;
  desc: string;
  quotas: QuotaItem;
}

export default function TeacherResources() {
  const [activeTab, setActiveTab] = useState<'monitor' | 'student' | 'teacher' | 'logs'>('monitor');
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  
  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [progressFilter, setProgressFilter] = useState<'all' | 'delayed' | 'normal' | 'high'>('all');
  const [quotaStatusFilter, setQuotaStatusFilter] = useState<'all' | 'normal' | 'warn' | 'depleted'>('all');

  // Interactive Warning Settings
  const [warnThreshold, setWarnThreshold] = useState(80);
  const [warnMethods, setWarnMethods] = useState({ system: true, email: true, sms: false });
  const [warnTarget, setWarnTarget] = useState('任课主讲老师');

  // Dialog States
  const [isSingleAdjustOpen, setIsSingleAdjustOpen] = useState(false);
  const [targetUser, setTargetUser] = useState<UserResourceItem | null>(null);
  const [adjustType, setAdjustType] = useState<'add' | 'recycle'>('add');
  const [selectedTemplate, setSelectedTemplate] = useState<string>('custom');

  // Bulk Allocation Dialog States
  const [isBulkOpen, setIsBulkOpen] = useState(false);
  const [bulkResourceKey, setBulkResourceKey] = useState<keyof QuotaItem>('gpuHours');
  const [bulkAmount, setBulkAmount] = useState('10');
  const [bulkExpiry, setBulkExpiry] = useState('2026-07-01');

  // Toast Notification State
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'warning' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' | 'warning' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Mock Pre-defined Quota Templates
  const quotaTemplates: TemplateItem[] = [
    {
      id: 'tpl-basic',
      name: '基础实训模版',
      desc: '适合初级课程，轻量GPU分配',
      quotas: { gpuHours: 10, cpuHours: 30, projects: 5, datasets: 3, practices: 10, aiAssistants: 5, tokens: 100 }
    },
    {
      id: 'tpl-advance',
      name: '深度学习进阶模版',
      desc: '适合大模型微调，中量算力支持',
      quotas: { gpuHours: 50, cpuHours: 150, projects: 12, datasets: 8, practices: 20, aiAssistants: 15, tokens: 500 }
    },
    {
      id: 'tpl-grad',
      name: '毕业设计与科研模版',
      desc: '极高算力模版，支持海量Token',
      quotas: { gpuHours: 150, cpuHours: 500, projects: 30, datasets: 25, practices: 50, aiAssistants: 50, tokens: 2000 }
    }
  ];

  // Mock Users Resource Assignment Data
  const [users, setUsers] = useState<UserResourceItem[]>([
    { 
      id: '2026744501', name: '王小明', role: '学生', college: '计算机学院', major: '人工智能', class: '1班', progress: 85, status: '正常',
      quotas: { gpuHours: 42, cpuHours: 120, projects: 8, datasets: 4, practices: 15, aiAssistants: 8, tokens: 350 },
      allocatedDate: '2026-03-01', expiryDate: '2026-07-01'
    },
    { 
      id: '2026744502', name: '李华', role: '学生', college: '计算机学院', major: '人工智能', class: '1班', progress: 42, status: '正常',
      quotas: { gpuHours: 8, cpuHours: 40, projects: 3, datasets: 2, practices: 8, aiAssistants: 4, tokens: 95 },
      allocatedDate: '2026-03-01', expiryDate: '2026-07-01'
    },
    { 
      id: '2026744503', name: '张伟', role: '学生', college: '计算机学院', major: '数据科学', class: '2班', progress: 28, status: '预警',
      quotas: { gpuHours: 48, cpuHours: 145, projects: 9, datasets: 5, practices: 18, aiAssistants: 14, tokens: 490 }, // token threshold exceeded
      allocatedDate: '2026-03-05', expiryDate: '2026-07-01'
    },
    { 
      id: '2026744504', name: '陈芳', role: '学生', college: '软件学院', major: '软件工程', class: '1班', progress: 94, status: '正常',
      quotas: { gpuHours: 25, cpuHours: 90, projects: 6, datasets: 3, practices: 12, aiAssistants: 10, tokens: 280 },
      allocatedDate: '2026-03-01', expiryDate: '2026-07-01'
    },
    { 
      id: '2026744505', name: '刘洋', role: '学生', college: '软件学院', major: '软件工程', class: '1班', progress: 12, status: '耗尽',
      quotas: { gpuHours: 50, cpuHours: 150, projects: 12, datasets: 8, practices: 20, aiAssistants: 15, tokens: 500 }, // GPU exhausted
      allocatedDate: '2026-03-01', expiryDate: '2026-07-01'
    },
    { 
      id: 'T1001', name: '张旭东 教授', role: '教师', college: '计算机学院', major: '教师团队', class: '人工智能系', progress: 100, status: '正常',
      quotas: { gpuHours: 350, cpuHours: 1200, projects: 50, datasets: 30, practices: 100, aiAssistants: 80, tokens: 5000 },
      allocatedDate: '2026-01-01', expiryDate: '2026-12-31'
    },
    { 
      id: 'T1002', name: '李瑞 讲师', role: '教师', college: '软件学院', major: '教师团队', class: '软件工程系', progress: 100, status: '正常',
      quotas: { gpuHours: 180, cpuHours: 600, projects: 25, datasets: 15, practices: 50, aiAssistants: 40, tokens: 2500 },
      allocatedDate: '2026-01-01', expiryDate: '2026-12-31'
    }
  ]);

  // Allocation Forms Inputs States
  const [formGpu, setFormGpu] = useState(10);
  const [formCpu, setFormCpu] = useState(30);
  const [formProjects, setFormProjects] = useState(5);
  const [formDatasets, setFormDatasets] = useState(3);
  const [formPractices, setFormPractices] = useState(10);
  const [formAiAssistants, setFormAiAssistants] = useState(5);
  const [formTokens, setFormTokens] = useState(100);
  const [formExpiry, setFormExpiry] = useState('2026-07-01');

  // Mock Allocation Audit Logs for rollback simulation
  const [auditLogs, setAuditLogs] = useState<any[]>([
    { id: 'LOG-9843', time: '2026-05-26 10:12', operator: '张旭东 教授', targetType: '批量追加', targets: '张伟, 刘洋', detail: '追加 GPU卡时 +10h，大模型Token +100M', reversible: true, status: '已生效', backup: [] }
  ]);

  // Overall Global Quota Allocation Indicators
  const globalResourceUsage = {
    gpu: { used: 3120, total: 5000, label: 'GPU 显卡时' },
    cpu: { used: 7600, total: 10000, label: 'CPU 处理器时长' },
    projects: { used: 195, total: 300, label: '项目额度' },
    datasets: { used: 84, total: 120, label: '数据集配额' },
    practices: { used: 260, total: 400, label: '最佳实践卡槽' },
    aiAssistants: { used: 175, total: 300, label: '智能助手席位' },
    tokens: { used: 382.5, total: 500, label: '大语言模型Tokens' }, // Millions
  };

  // Helper calculations for use percentages
  const getPercent = (used: number, total: number) => {
    return Math.round((used / total) * 100);
  };

  // Filter lists based on states
  const filteredUsers = users.filter(u => {
    // Tab filtering (student or teacher)
    if (activeTab === 'student' && u.role !== '学生') return false;
    if (activeTab === 'teacher' && u.role !== '教师') return false;

    // Search query check (name, id, class)
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchName = u.name.toLowerCase().includes(q);
      const matchId = u.id.toLowerCase().includes(q);
      const matchClass = u.class.toLowerCase().includes(q);
      if (!matchName && !matchId && !matchClass) return false;
    }

    // Learning Progress Filter (specifically for students)
    if (activeTab === 'student' && progressFilter !== 'all') {
      if (progressFilter === 'delayed' && u.progress >= 30) return false;
      if (progressFilter === 'normal' && (u.progress < 30 || u.progress > 85)) return false;
      if (progressFilter === 'high' && u.progress <= 85) return false;
    }

    // Quota Limit Warning Status Check
    if (quotaStatusFilter !== 'all') {
      if (quotaStatusFilter === 'warn' && u.status !== '预警') return false;
      if (quotaStatusFilter === 'depleted' && u.status !== '耗尽') return false;
      if (quotaStatusFilter === 'normal' && u.status !== '正常') return false;
    }

    return true;
  });

  // Table selection utilities
  const toggleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedUserIds(filteredUsers.map(u => u.id));
    } else {
      setSelectedUserIds([]);
    }
  };

  const toggleSelect = (id: string) => {
    if (selectedUserIds.includes(id)) {
      setSelectedUserIds(selectedUserIds.filter(uid => uid !== id));
    } else {
      setSelectedUserIds([...selectedUserIds, id]);
    }
  };

  // Open single adjust dialog with pre-filled inputs
  const triggerSingleAdjust = (user: UserResourceItem, type: 'add' | 'recycle') => {
    setTargetUser(user);
    setAdjustType(type);
    setSelectedTemplate('custom');
    
    // Fill state
    setFormGpu(user.quotas.gpuHours);
    setFormCpu(user.quotas.cpuHours);
    setFormProjects(user.quotas.projects);
    setFormDatasets(user.quotas.datasets);
    setFormPractices(user.quotas.practices);
    setFormAiAssistants(user.quotas.aiAssistants);
    setFormTokens(user.quotas.tokens);
    setFormExpiry(user.expiryDate);
    
    setIsSingleAdjustOpen(true);
  };

  // Load selected template values
  const applyTemplateValues = (templateId: string) => {
    setSelectedTemplate(templateId);
    if (templateId === 'custom') return;
    
    const tpl = quotaTemplates.find(t => t.id === templateId);
    if (!tpl) return;

    setFormGpu(tpl.quotas.gpuHours);
    setFormCpu(tpl.quotas.cpuHours);
    setFormProjects(tpl.quotas.projects);
    setFormDatasets(tpl.quotas.datasets);
    setFormPractices(tpl.quotas.practices);
    setFormAiAssistants(tpl.quotas.aiAssistants);
    setFormTokens(tpl.quotas.tokens);
  };

  // Save single adjustments (Add or Recycle)
  const saveSingleAdjustment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetUser) return;

    const nextQuotas: QuotaItem = {
      gpuHours: formGpu,
      cpuHours: formCpu,
      projects: formProjects,
      datasets: formDatasets,
      practices: formPractices,
      aiAssistants: formAiAssistants,
      tokens: formTokens
    };

    // Calculate changes for logs
    const changes: string[] = [];
    const keys: (keyof QuotaItem)[] = ['gpuHours', 'cpuHours', 'projects', 'datasets', 'practices', 'aiAssistants', 'tokens'];
    const labelMap: Record<string, string> = {
      gpuHours: 'GPU卡时', cpuHours: 'CPU时长', projects: '项目额度', datasets: '数据集额度',
      practices: '最佳实践', aiAssistants: '智能助手', tokens: 'Token额度'
    };

    keys.forEach(k => {
      const diff = nextQuotas[k] - targetUser.quotas[k];
      if (diff !== 0) {
        changes.push(`${labelMap[k]} ${diff > 0 ? '+' : ''}${diff}`);
      }
    });

    const isThresholdExceeded = nextQuotas.tokens > 450 || nextQuotas.gpuHours > 120;

    setUsers(users.map(u => u.id === targetUser.id ? {
      ...u,
      quotas: nextQuotas,
      expiryDate: formExpiry,
      status: isThresholdExceeded ? '预警' : '正常'
    } : u));

    // Audit Log
    const newLog = {
      id: 'LOG-' + Math.floor(1000 + Math.random() * 9000),
      time: new Date().toLocaleString('zh-CN', { hour12: false }).replace(/\//g, '-'),
      operator: '张旭东 教授',
      targetType: '单用户调整',
      targets: targetUser.name,
      detail: `对 ${targetUser.name} 进行配额变更：${changes.join(', ') || '更新有效期'}`,
      reversible: true,
      status: '已生效',
      backup: [JSON.parse(JSON.stringify(targetUser))] // deep copy
    };

    setAuditLogs([newLog, ...auditLogs]);
    setIsSingleAdjustOpen(false);
    showToast(`成功更新 ${targetUser.name} 的算力资源配额与策略！`);
  };

  // Execute Bulk allocation for checked students
  const executeBulkAllocation = () => {
    if (selectedUserIds.length === 0) {
      showToast('请先勾选需要批量分配的学生', 'error');
      return;
    }

    const valueNum = Number(bulkAmount);
    if (isNaN(valueNum) || valueNum <= 0) {
      showToast('请输入有效的增配数量', 'error');
      return;
    }

    const backupUsers = users.filter(u => selectedUserIds.includes(u.id));

    // Update targets
    const updatedUsers = users.map(u => {
      if (selectedUserIds.includes(u.id)) {
        const currentQuota = u.quotas[bulkResourceKey];
        const nextQuota = currentQuota + valueNum;
        const nextQuotas = { ...u.quotas, [bulkResourceKey]: nextQuota };
        
        // Status checks
        let nextStatus: '正常' | '预警' | '耗尽' = u.status;
        if (bulkResourceKey === 'gpuHours' && nextQuota > 120) nextStatus = '预警';
        if (bulkResourceKey === 'tokens' && nextQuota > 450) nextStatus = '预警';

        return {
          ...u,
          quotas: nextQuotas,
          expiryDate: bulkExpiry,
          status: nextStatus
        };
      }
      return u;
    });

    const resourceLabels: Record<string, string> = {
      gpuHours: 'GPU显卡时长 (小时)', cpuHours: 'CPU时长 (小时)', projects: '项目卡数', datasets: '数据集额度 (个)',
      practices: '最佳实践席位', aiAssistants: '智能助手席位', tokens: 'AI Token配额 (M)'
    };

    // Audit Log
    const newLog = {
      id: 'LOG-' + Math.floor(1000 + Math.random() * 9000),
      time: new Date().toLocaleString('zh-CN', { hour12: false }).replace(/\//g, '-'),
      operator: '张旭东 教授',
      targetType: '批量追加',
      targets: backupUsers.map(u => u.name).join(', '),
      detail: `批量增配 [${resourceLabels[bulkResourceKey]}] +${valueNum}，重设有效期至 ${bulkExpiry}`,
      reversible: true,
      status: '已生效',
      backup: JSON.parse(JSON.stringify(backupUsers))
    };

    setUsers(updatedUsers);
    setAuditLogs([newLog, ...auditLogs]);
    setIsBulkOpen(false);
    setSelectedUserIds([]);
    showToast(`成功对已选的 ${backupUsers.length} 位学生批量追补配额！`);
  };

  // Rollback Action Simulator
  const handleRollbackLog = (logId: string) => {
    const log = auditLogs.find(l => l.id === logId);
    if (!log || !log.reversible || log.status !== '已生效') return;

    if (log.targetType === '单用户调整') {
      const backupItem = log.backup[0];
      setUsers(users.map(u => u.id === backupItem.id ? backupItem : u));
    } else if (log.targetType === '批量追加') {
      const backups: UserResourceItem[] = log.backup;
      setUsers(users.map(u => {
        const bk = backups.find(b => b.id === u.id);
        return bk ? bk : u;
      }));
    }

    setAuditLogs(auditLogs.map(l => l.id === logId ? { ...l, status: '已回滚', reversible: false } : l));
    showToast('批量操作已成功回滚！租户算力额度已无损复原', 'success');
  };

  return (
    <div className="space-y-6 pb-12 relative animate-fade-in">
      
      {/* Toast Banner */}
      {toast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[200] flex items-center gap-2 px-5 py-2.5 bg-white border border-neutral-200 rounded-xl shadow-xl">
          {toast.type === 'success' && <ShieldCheck className="w-5 h-5 text-emerald-500" />}
          {toast.type === 'error' && <AlertTriangle className="w-5 h-5 text-red-500" />}
          {toast.type === 'warning' && <Info className="w-5 h-5 text-amber-500" />}
          <span className="text-sm font-bold text-neutral-800">{toast.message}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-neutral-900 flex items-center gap-2">
            <div className="w-1.5 h-6 bg-[#fa541c] rounded-full"></div>
            算力与项目资源分配中心
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            实时监控GPU卡时与LLM大语言模型Token水位。通过多级预警机制和快捷模版对学生/协同协作教师进行配额动态分配、秒级追补或自动回收
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <Button 
            onClick={() => setIsBulkOpen(true)}
            className="bg-[#fa541c] hover:bg-[#e84a15] text-white flex items-center gap-1.5 shadow-md shadow-orange-500/10 h-9 rounded-xl text-xs font-bold px-4 cursor-pointer"
          >
            <Plus className="w-4 h-4" /> 批量增配资源
          </Button>
        </div>
      </div>

      {/* Tabs Menu */}
      <div className="flex border-b border-neutral-200 mt-2">
        <button
          onClick={() => { setActiveTab('monitor'); setSelectedUserIds([]); }}
          className={cn(
            "flex items-center gap-2 px-5 pb-3 text-sm font-bold border-b-2 transition-all",
            activeTab === 'monitor' ? "text-[#fa541c] border-[#fa541c]" : "text-neutral-500 border-transparent hover:text-neutral-800"
          )}
        >
          <Sliders className="w-4 h-4" />
          配额实时监控水位 ({Object.keys(globalResourceUsage).length}项)
        </button>
        <button
          onClick={() => { setActiveTab('student'); setSelectedUserIds([]); }}
          className={cn(
            "flex items-center gap-2 px-5 pb-3 text-sm font-bold border-b-2 transition-all",
            activeTab === 'student' ? "text-[#fa541c] border-[#fa541c]" : "text-neutral-500 border-transparent hover:text-neutral-800"
          )}
        >
          <Users className="w-4 h-4" />
          学生配额管理库 ({users.filter(u => u.role === '学生').length}人)
        </button>
        <button
          onClick={() => { setActiveTab('teacher'); setSelectedUserIds([]); }}
          className={cn(
            "flex items-center gap-2 px-5 pb-3 text-sm font-bold border-b-2 transition-all",
            activeTab === 'teacher' ? "text-[#fa541c] border-[#fa541c]" : "text-neutral-500 border-transparent hover:text-neutral-800"
          )}
        >
          <Cpu className="w-4 h-4" />
          协同协作教师配额 ({users.filter(u => u.role === '教师').length}人)
        </button>
        <button
          onClick={() => { setActiveTab('logs'); setSelectedUserIds([]); }}
          className={cn(
            "flex items-center gap-2 px-5 pb-3 text-sm font-bold border-b-2 transition-all",
            activeTab === 'logs' ? "text-[#fa541c] border-[#fa541c]" : "text-neutral-500 border-transparent hover:text-neutral-800"
          )}
        >
          <FileText className="w-4 h-4" />
          增配及回收审计日志 ({auditLogs.length}条)
        </button>
      </div>

      {/* Tab Content 1: 水位实时监控 */}
      {activeTab === 'monitor' && (
        <div className="space-y-6">
          
          {/* Dashboard Gauges grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-7 gap-4">
            {Object.entries(globalResourceUsage).map(([key, item]) => {
              const useRate = getPercent(item.used, item.total);
              const isWarning = useRate >= warnThreshold;
              return (
                <div key={key} className="bg-white p-4 rounded-xl border border-neutral-200/60 shadow-sm flex flex-col items-center justify-between text-center relative group hover:border-[#fa541c]/30 transition-all">
                  <span className="text-[10px] font-bold text-neutral-400 block mb-3 truncate w-full">{item.label}</span>
                  
                  {/* Circle SVG Progress gauge */}
                  <div className="relative w-16 h-16 mb-3">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle cx="32" cy="32" r="26" stroke="#f3f4f6" strokeWidth="4.5" fill="transparent" />
                      <circle 
                        cx="32" 
                        cy="32" 
                        r="26" 
                        stroke={isWarning ? "#ef4444" : "#fa541c"} 
                        strokeWidth="4.5" 
                        fill="transparent" 
                        strokeDasharray={2 * Math.PI * 26}
                        strokeDashoffset={2 * Math.PI * 26 * (1 - useRate / 100)}
                        strokeLinecap="round"
                        className="transition-all duration-500"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className={cn("text-xs font-black", isWarning ? "text-red-600" : "text-neutral-800")}>{useRate}%</span>
                    </div>
                  </div>

                  <div className="space-y-0.5">
                    <span className="text-[10px] text-neutral-500 font-mono block">
                      已配额: {item.used}{key === 'tokens' ? 'M' : ''}
                    </span>
                    <span className="text-[9px] text-neutral-400 block">
                      额度上限: {item.total}{key === 'tokens' ? 'M' : ''}
                    </span>
                  </div>

                  {isWarning && (
                    <div className="absolute top-1.5 right-1.5 flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Warnings Banner and Warning Settings block */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Warning Alert configuration setting */}
            <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-sm space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-neutral-100">
                <Sliders className="w-4.5 h-4.5 text-[#fa541c]" />
                <h3 className="font-bold text-neutral-800 text-[14px]">租户配额全局智能预警设定</h3>
              </div>

              <div className="space-y-4 text-xs">
                
                {/* Threshold Slider input */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between font-bold">
                    <span className="text-neutral-700">实时使用率告警阈值</span>
                    <span className="text-[#fa541c] font-black">{warnThreshold}%</span>
                  </div>
                  <input 
                    type="range" 
                    min="50" 
                    max="95" 
                    value={warnThreshold}
                    onChange={(e) => setWarnThreshold(Number(e.target.value))}
                    className="w-full h-1.5 bg-neutral-100 rounded-lg appearance-none cursor-pointer accent-[#fa541c]" 
                  />
                  <span className="text-[9px] text-neutral-400 block mt-1">资源实际消耗率达到设定边界时，立即触发锁定/自动追加警报</span>
                </div>

                {/* Alert check channels */}
                <div className="space-y-2">
                  <span className="text-neutral-700 font-bold block">告警及通知方式</span>
                  <div className="grid grid-cols-3 gap-2">
                    <label className="flex items-center gap-1.5 p-2 border border-neutral-200 rounded-lg cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={warnMethods.system}
                        onChange={(e) => setWarnMethods({ ...warnMethods, system: e.target.checked })}
                        className="rounded text-[#fa541c] focus:ring-[#fa541c]" 
                      />
                      <span>站内信推送</span>
                    </label>
                    <label className="flex items-center gap-1.5 p-2 border border-neutral-200 rounded-lg cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={warnMethods.email}
                        onChange={(e) => setWarnMethods({ ...warnMethods, email: e.target.checked })}
                        className="rounded text-[#fa541c] focus:ring-[#fa541c]" 
                      />
                      <span>邮件警报</span>
                    </label>
                    <label className="flex items-center gap-1.5 p-2 border border-neutral-200 rounded-lg cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={warnMethods.sms}
                        onChange={(e) => setWarnMethods({ ...warnMethods, sms: e.target.checked })}
                        className="rounded text-[#fa541c] focus:ring-[#fa541c]" 
                      />
                      <span>短信催充</span>
                    </label>
                  </div>
                </div>

                {/* Target notifications select */}
                <div className="space-y-1.5">
                  <span className="text-neutral-700 font-bold block">异常警报通知对象</span>
                  <select 
                    value={warnTarget}
                    onChange={(e) => setWarnTarget(e.target.value)}
                    className="w-full text-xs border border-neutral-200 rounded-lg pl-3 pr-8 py-2 focus:outline-none focus:border-[#fa541c] bg-white text-neutral-700 font-bold"
                  >
                    <option value="任课主讲老师">任课主讲老师 (张旭东 等)</option>
                    <option value="校级系统管理员">校级系统管理员 (Admin)</option>
                    <option value="实训课件协作教师">实训课件协作教师团队</option>
                  </select>
                </div>

                <Button 
                  onClick={() => showToast('智能预警参数保存成功！')}
                  className="bg-[#fa541c] hover:bg-[#e84a15] text-white w-full h-8.5 rounded-lg text-xs font-bold shadow-sm"
                >
                  应用当前预警设定
                </Button>
              </div>
            </div>

            {/* Assignment Fluctuation curves trend using SVG */}
            <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-sm space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
                <h3 className="font-bold text-neutral-800 text-[14px] flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-indigo-500" />
                  配额增配及回收波段走势
                </h3>
                <span className="text-[10px] text-neutral-400 font-mono">周度频率</span>
              </div>

              <div className="pt-2 relative">
                {/* SVG assign trend lines */}
                <svg viewBox="0 0 400 130" className="w-full h-28 overflow-visible">
                  <defs>
                    <linearGradient id="curve-gradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#fa541c" stopOpacity="0.15" />
                      <stop offset="100%" stopColor="#fa541c" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  <line x1="0" y1="20" x2="400" y2="20" stroke="#f3f4f6" strokeDasharray="2,2" />
                  <line x1="0" y1="60" x2="400" y2="60" stroke="#f3f4f6" strokeDasharray="2,2" />
                  <line x1="0" y1="100" x2="400" y2="100" stroke="#f3f4f6" strokeDasharray="2,2" />
                  <line x1="0" y1="120" x2="400" y2="120" stroke="#eaeaea" />

                  <path d="M 10 120 L 10 90 L 80 40 L 160 85 L 240 25 L 320 60 L 390 15 L 390 120 Z" fill="url(#curve-gradient)" />
                  <path d="M 10 90 L 80 40 L 160 85 L 240 25 L 320 60 L 390 15" fill="none" stroke="#fa541c" strokeWidth="2.5" strokeLinecap="round" />
                  
                  <circle cx="80" cy="40" r="3.5" fill="#fa541c" stroke="#fff" strokeWidth="1.2" />
                  <circle cx="240" cy="25" r="3.5" fill="#fa541c" stroke="#fff" strokeWidth="1.2" />
                  <circle cx="390" cy="15" r="3.5" fill="#fa541c" stroke="#fff" strokeWidth="1.2" />

                  <text x="10" y="130" fill="#999" fontSize="8" textAnchor="start">W1</text>
                  <text x="160" y="130" fill="#999" fontSize="8" textAnchor="middle">W3</text>
                  <text x="320" y="130" fill="#999" fontSize="8" textAnchor="middle">W5</text>
                  <text x="390" y="130" fill="#999" fontSize="8" textAnchor="end">W6 (本周)</text>
                </svg>
                <div className="absolute top-1/3 left-1/2 bg-white border border-neutral-100 shadow-sm rounded-lg px-2 py-0.5 text-[8px] font-bold text-neutral-500 pointer-events-none">
                  峰值: 追加 1,200h GPU
                </div>
              </div>
            </div>

            {/* Consumption ranking stats list */}
            <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-sm space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
                <h3 className="font-bold text-neutral-800 text-[14px] flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-amber-500" />
                  租户算力消耗排行大黄榜
                </h3>
                <span className="text-[10px] text-[#fa541c] font-bold">高能耗重点监管</span>
              </div>

              <div className="space-y-2.5 text-xs text-neutral-600">
                <div className="flex items-center justify-between font-medium">
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded bg-red-100 text-red-600 font-bold text-[9px] flex items-center justify-center">1</span>
                    <strong className="text-neutral-800">刘洋 (学生)</strong>
                  </div>
                  <span className="font-mono text-red-600 font-black">GPU卡时已耗尽 (100% 耗竭)</span>
                </div>

                <div className="flex items-center justify-between font-medium">
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded bg-orange-100 text-orange-600 font-bold text-[9px] flex items-center justify-center">2</span>
                    <strong className="text-neutral-800">张伟 (学生)</strong>
                  </div>
                  <span className="font-mono text-amber-600 font-bold">大模型 API Token 已达 98.0%</span>
                </div>

                <div className="flex items-center justify-between font-medium">
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded bg-amber-100 text-amber-600 font-bold text-[9px] flex items-center justify-center">3</span>
                    <strong className="text-neutral-800">李讲师 (协同教师)</strong>
                  </div>
                  <span className="font-mono text-neutral-500">数据集占满 93.3% (14.0/15GB)</span>
                </div>

                <div className="flex items-center justify-between font-medium">
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded bg-neutral-100 text-neutral-500 font-bold text-[9px] flex items-center justify-center">4</span>
                    <strong className="text-neutral-800">陈芳 (学生)</strong>
                  </div>
                  <span className="font-mono text-neutral-500">CPU累计调用 90.0% (90.0h)</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Tab Content 2 & 3: 学生/教师配额管理库 */}
      {(activeTab === 'student' || activeTab === 'teacher') && (
        <div className="space-y-4">
          
          {/* Filtering and Toolbar search controls */}
          <div className="flex flex-wrap items-center justify-between gap-4 py-1 bg-transparent w-full">
            
            {/* Left filters: Search query, progress dropdowns */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative w-full sm:w-64">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input 
                  type="text" 
                  placeholder={activeTab === 'student' ? "搜索学号、姓名、班级..." : "搜索工号、教师姓名..."}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-3 py-2 text-xs border border-neutral-200 rounded-lg focus:outline-none focus:border-[#fa541c] w-full bg-white transition-all text-neutral-700"
                />
              </div>

              {/* Progress Filter dropdown (exclusive to student management) */}
              {activeTab === 'student' && (
                <div className="relative w-full sm:w-36">
                  <select 
                    value={progressFilter}
                    onChange={(e) => setProgressFilter(e.target.value as any)}
                    className="w-full text-xs border border-neutral-200 rounded-lg pl-3 pr-8 py-2 focus:outline-none bg-white text-neutral-700 font-bold appearance-none"
                  >
                    <option value="all">所有学习进度</option>
                    <option value="delayed">进度严重滞后 (&lt;30%)</option>
                    <option value="normal">进度正常 (30%-85%)</option>
                    <option value="high">完成度极高 (&gt;85%)</option>
                  </select>
                  <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
                </div>
              )}

              {/* Exceeded state filter */}
              <div className="relative w-full sm:w-36">
                <select 
                  value={quotaStatusFilter}
                  onChange={(e) => setQuotaStatusFilter(e.target.value as any)}
                  className="w-full text-xs border border-neutral-200 rounded-lg pl-3 pr-8 py-2 focus:outline-none bg-white text-neutral-700 font-bold appearance-none"
                >
                  <option value="all">所有额度状态</option>
                  <option value="normal">配额正常充裕</option>
                  <option value="warn">配额使用预警</option>
                  <option value="depleted">算力配额耗尽</option>
                </select>
                <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
              </div>
            </div>

            {/* Right toolbar controls: Bulk triggers */}
            <div className="flex flex-wrap items-center gap-2.5 ml-auto sm:ml-0">
              {selectedUserIds.length > 0 && (
                <div className="flex items-center gap-2 bg-orange-50 px-3 py-1.5 rounded-lg border border-orange-200 animate-slide-up">
                  <span className="text-xs font-bold text-orange-700">已选中 {selectedUserIds.length} 个账号</span>
                  <div className="w-px h-4 bg-orange-200"></div>
                  <button
                    onClick={() => setIsBulkOpen(true)}
                    className="text-xs font-black text-[#fa541c] hover:text-[#e84a15] transition-colors cursor-pointer"
                  >
                    ⚡ 一键批量增配已选
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Assignment Grid Grid List */}
          <div className="bg-white rounded overflow-hidden shadow-sm border border-neutral-200/50">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse whitespace-nowrap">
                <thead>
                  <tr className="border-b border-neutral-100 bg-neutral-50/50 text-[13px] text-neutral-600">
                    <th className="p-4 w-12 text-center">
                      <button 
                        type="button"
                        onClick={() => toggleSelectAll(selectedUserIds.length !== filteredUsers.length || filteredUsers.length === 0)}
                        className={cn(
                          "w-4 h-4 rounded border flex items-center justify-center transition-all cursor-pointer mx-auto",
                          selectedUserIds.length === filteredUsers.length && filteredUsers.length > 0
                            ? "bg-[#fa541c] border-[#fa541c] text-white"
                            : "border-neutral-300 hover:border-[#fa541c] bg-white"
                        )}
                      >
                        {selectedUserIds.length === filteredUsers.length && filteredUsers.length > 0 && <span className="text-[10px] font-bold">✓</span>}
                      </button>
                    </th>
                    <th className="p-4">基本资料</th>
                    {activeTab === 'student' && <th className="p-4">实训学习进度</th>}
                    <th className="p-4">GPU 显存时</th>
                    <th className="p-4">CPU 处理器</th>
                    <th className="p-4">模型 Token (M)</th>
                    <th className="p-4">卡槽项目/存储</th>
                    <th className="p-4">资源状态</th>
                    <th className="p-4">有效期截止</th>
                    <th className="p-4 text-left">操作入口</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map(u => (
                      <tr key={u.id} className="border-b border-neutral-100 hover:bg-neutral-50/30 transition-colors group text-[13px] text-neutral-700">
                        <td className="p-4 text-center">
                          <button 
                            type="button"
                            onClick={() => toggleSelect(u.id)}
                            className={cn(
                              "w-4 h-4 rounded border flex items-center justify-center transition-all cursor-pointer mx-auto",
                              selectedUserIds.includes(u.id)
                                ? "bg-[#fa541c] border-[#fa541c] text-white"
                                : "border-neutral-300 hover:border-[#fa541c] bg-white"
                            )}
                          >
                            {selectedUserIds.includes(u.id) && <span className="text-[10px] font-bold">✓</span>}
                          </button>
                        </td>
                        <td className="p-4">
                          <div className="font-bold text-neutral-800 flex items-center gap-1.5">
                            {u.name}
                            {u.quotas.gpuHours > 100 && <span className="px-1.5 py-0.5 bg-purple-50 border border-purple-200 text-purple-600 rounded text-[9px] font-black tracking-tight">AI科学家</span>}
                          </div>
                          <div className="text-[11px] text-neutral-400 font-mono mt-0.5">{u.id} · {u.class}</div>
                        </td>
                        {activeTab === 'student' && (
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <div className="w-20 h-2 bg-neutral-100 rounded-full overflow-hidden shrink-0">
                                <div 
                                  className={cn(
                                    "h-full rounded-full",
                                    u.progress < 30 ? "bg-red-500" :
                                    u.progress > 85 ? "bg-emerald-500" : "bg-[#fa541c]"
                                  )}
                                  style={{ width: `${u.progress}%` }}
                                ></div>
                              </div>
                              <span className="text-[11px] font-mono font-bold text-neutral-600">{u.progress}%</span>
                            </div>
                          </td>
                        )}
                        <td className="p-4 font-mono font-bold text-neutral-800">{u.quotas.gpuHours}h</td>
                        <td className="p-4 font-mono font-bold text-neutral-800">{u.quotas.cpuHours}h</td>
                        <td className="p-4 font-mono font-bold text-neutral-800">{u.quotas.tokens}M</td>
                        <td className="p-4">
                          <div className="text-xs text-neutral-700">项目：<strong className="text-neutral-800 font-mono">{u.quotas.projects}</strong> 个</div>
                          <div className="text-[10px] text-neutral-400 font-mono mt-0.5">数据集：{u.quotas.datasets}个 · 助手：{u.quotas.aiAssistants}个</div>
                        </td>
                        <td className="p-4">
                          <span className={cn(
                            "px-2 py-0.5 text-[11px] font-black rounded border",
                            u.status === '正常' ? "bg-green-50 text-green-600 border-green-200" :
                            u.status === '预警' ? "bg-amber-50 text-amber-600 border-amber-200" : "bg-red-50 text-red-600 border-red-200"
                          )}>
                            {u.status === '正常' ? '配额充足' : u.status === '预警' ? '资源紧张' : '卡时已尽'}
                          </span>
                        </td>
                        <td className="p-4 font-mono text-neutral-500 text-xs">{u.expiryDate}</td>
                        <td className="p-4 text-left">
                          <div className="flex items-center justify-start gap-3">
                            <button 
                              onClick={() => triggerSingleAdjust(u, 'add')}
                              className="text-[#fa541c] hover:text-[#e84a15] font-bold text-xs transition-colors cursor-pointer"
                            >
                              增配资源
                            </button>
                            <button 
                              onClick={() => triggerSingleAdjust(u, 'recycle')}
                              className="text-[#fa541c] hover:text-[#e84a15] font-bold text-xs transition-colors cursor-pointer"
                            >
                              回收配额
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={activeTab === 'student' ? 10 : 9} className="p-12 text-center text-neutral-400">暂无符合筛选条件的用户算力分配明细</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination footer */}
            <div className="flex items-center justify-end p-4 border-t border-neutral-100 gap-4 mt-2">
              <span className="text-[13px] text-neutral-500">共 {filteredUsers.length} 条</span>
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

      {/* Tab Content 4: 增配审计日志 */}
      {activeTab === 'logs' && (
        <div className="space-y-4">
          <div className="p-4 bg-orange-50/20 border border-orange-200 rounded-xl text-xs text-neutral-600 leading-relaxed flex items-start gap-1.5">
            <Info className="w-4 h-4 text-[#fa541c] shrink-0 mt-0.5" />
            <span>
              <strong>审计说明：</strong> 此控制台归档记录了知云租户下所有针对学生/协作协同教师的批量追加/单点资源微调行为。所有已成功生效的历史分配项目均支持一键快捷回滚撤销，确保误触操作时能瞬时恢复各受众用户的旧额度。
            </span>
          </div>

          <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden divide-y divide-neutral-100">
            {auditLogs.map((log) => (
              <div key={log.id} className="p-4 hover:bg-neutral-50/40 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="px-2 py-0.5 bg-neutral-100 text-neutral-600 border border-neutral-200 rounded font-bold text-[10px]">{log.targetType}</span>
                    <span className="text-neutral-400 font-mono">{log.time}</span>
                    <span className="font-bold text-neutral-700">· 操作人: {log.operator}</span>
                  </div>
                  <p className="text-xs font-bold text-neutral-800 mt-1">{log.detail}</p>
                  <div className="text-[11px] text-neutral-500 max-w-2xl truncate font-mono">
                    受众账号：{log.targets}
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                  <span className={cn(
                    "text-xs font-bold px-2 py-0.5 rounded border",
                    log.status === '已生效' ? "text-green-600 bg-green-50 border-green-200" : "text-neutral-400 bg-neutral-50 border-neutral-200"
                  )}>
                    {log.status}
                  </span>
                  {log.reversible && log.status === '已生效' && (
                    <button
                      onClick={() => handleRollbackLog(log.id)}
                      className="flex items-center gap-1 text-[11px] font-black text-indigo-600 hover:text-indigo-800 border border-indigo-200 bg-white hover:bg-indigo-50 px-2.5 py-1 rounded-lg shadow-sm transition-all cursor-pointer"
                    >
                      <RotateCcw className="w-3 h-3" />
                      撤销回滚
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal 1: Single adjustments Add/Recycle Quota dialog */}
      {isSingleAdjustOpen && targetUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in">
          <form onSubmit={saveSingleAdjustment} className="bg-white rounded-2xl shadow-xl w-full max-w-[550px] overflow-hidden border border-neutral-200 flex flex-col animate-in zoom-in-95 duration-150">
            
            {/* Header */}
            <div className="p-5 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/50">
              <h2 className="text-[15px] font-black text-neutral-900 flex items-center gap-2">
                <Sliders className="w-5 h-5 text-[#fa541c]" /> 
                单用户配额变更配置面板 ({adjustType === 'add' ? '增加配额' : '回收配额'})
              </h2>
              <button 
                type="button" 
                onClick={() => setIsSingleAdjustOpen(false)} 
                className="text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 p-1.5 rounded-full transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-4 overflow-y-auto max-h-[480px]">
              
              {/* User badge */}
              <div className="p-3 bg-neutral-50 border border-neutral-200 rounded-xl text-xs flex items-center justify-between">
                <div>
                  用户姓名：<strong className="text-neutral-800">{targetUser.name}</strong>
                  <span className="text-neutral-400 font-mono ml-2">({targetUser.id})</span>
                </div>
                <div>
                  归属班级：<strong className="text-neutral-700">{targetUser.class}</strong>
                </div>
              </div>

              {/* Template Quick Selection */}
              {adjustType === 'add' && (
                <div className="space-y-1.5">
                  <label className="text-[12px] font-bold text-neutral-700 block">使用资源配额套包模版快速预设</label>
                  <div className="grid grid-cols-3 gap-2">
                    {quotaTemplates.map((tpl) => (
                      <button
                        key={tpl.id}
                        type="button"
                        onClick={() => applyTemplateValues(tpl.id)}
                        className={cn(
                          "p-2.5 rounded-xl border text-[11px] font-bold text-left cursor-pointer transition-all flex flex-col justify-between h-16",
                          selectedTemplate === tpl.id 
                            ? "bg-orange-50/40 border-[#fa541c] text-[#fa541c]"
                            : "border-neutral-200 text-neutral-600 bg-white hover:border-[#fa541c] hover:text-[#fa541c]"
                        )}
                      >
                        <span className="block truncate font-black">{tpl.name}</span>
                        <span className="block text-[9px] text-neutral-400 font-normal line-clamp-1">{tpl.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Advanced Quotas adjust Grid */}
              <div className="space-y-2">
                <span className="text-[12px] font-bold text-neutral-700 block">自定义各项资费算力配额</span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 border border-neutral-200 rounded-xl bg-neutral-50/30">
                  <div className="space-y-1">
                    <span className="text-[10px] text-neutral-400 font-bold block">GPU卡时 (小时)</span>
                    <input 
                      type="number" 
                      value={formGpu} 
                      onChange={(e) => { setFormGpu(Number(e.target.value)); setSelectedTemplate('custom'); }} 
                      className="w-full border border-neutral-200 rounded-lg px-2.5 py-1.5 text-xs text-neutral-800 bg-white focus:outline-none" 
                    />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] text-neutral-400 font-bold block">CPU时长 (小时)</span>
                    <input 
                      type="number" 
                      value={formCpu} 
                      onChange={(e) => { setFormCpu(Number(e.target.value)); setSelectedTemplate('custom'); }} 
                      className="w-full border border-neutral-200 rounded-lg px-2.5 py-1.5 text-xs text-neutral-800 bg-white focus:outline-none" 
                    />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] text-neutral-400 font-bold block">大模型Token (M)</span>
                    <input 
                      type="number" 
                      value={formTokens} 
                      onChange={(e) => { setFormTokens(Number(e.target.value)); setSelectedTemplate('custom'); }} 
                      className="w-full border border-neutral-200 rounded-lg px-2.5 py-1.5 text-xs text-neutral-800 bg-white focus:outline-none" 
                    />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] text-neutral-400 font-bold block">项目卡数上限 (个)</span>
                    <input 
                      type="number" 
                      value={formProjects} 
                      onChange={(e) => { setFormProjects(Number(e.target.value)); setSelectedTemplate('custom'); }} 
                      className="w-full border border-neutral-200 rounded-lg px-2.5 py-1.5 text-xs text-neutral-800 bg-white focus:outline-none" 
                    />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] text-neutral-400 font-bold block">数据集额度 (个)</span>
                    <input 
                      type="number" 
                      value={formDatasets} 
                      onChange={(e) => { setFormDatasets(Number(e.target.value)); setSelectedTemplate('custom'); }} 
                      className="w-full border border-neutral-200 rounded-lg px-2.5 py-1.5 text-xs text-neutral-800 bg-white focus:outline-none" 
                    />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] text-neutral-400 font-bold block">智能助手席位 (个)</span>
                    <input 
                      type="number" 
                      value={formAiAssistants} 
                      onChange={(e) => { setFormAiAssistants(Number(e.target.value)); setSelectedTemplate('custom'); }} 
                      className="w-full border border-neutral-200 rounded-lg px-2.5 py-1.5 text-xs text-neutral-800 bg-white focus:outline-none" 
                    />
                  </div>
                </div>
              </div>

              {/* Expiry settings with auto recycle checkbox */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[12px] font-bold text-neutral-700 block">配额有效期截止点</label>
                  <input 
                    type="date" 
                    value={formExpiry} 
                    onChange={(e) => setFormExpiry(e.target.value)} 
                    className="w-full border border-neutral-200 rounded-xl px-4 py-2.5 text-xs text-neutral-800 bg-white focus:outline-none focus:border-[#fa541c]" 
                  />
                </div>
                <div className="flex items-center gap-2 pt-5">
                  <label className="flex items-center gap-1.5 text-xs font-bold text-neutral-600 cursor-pointer">
                    <input type="checkbox" defaultChecked className="rounded text-[#fa541c] focus:ring-[#fa541c]" />
                    <span>配额到期后系统自动秒级收回</span>
                  </label>
                </div>
              </div>

            </div>

            {/* Footer */}
            <div className="p-5 border-t border-neutral-100 bg-neutral-50/20 flex items-center justify-end gap-3">
              <Button 
                type="button" 
                onClick={() => setIsSingleAdjustOpen(false)} 
                variant="outline" 
                className="border-neutral-200 text-neutral-600 font-bold h-9 px-5 rounded-lg text-xs"
              >
                取消
              </Button>
              <Button 
                type="submit" 
                className="bg-[#fa541c] hover:bg-[#e84a15] text-white font-bold h-9 px-6 rounded-lg shadow-md shadow-orange-500/10 text-xs"
              >
                确认执行调整
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Modal 2: Bulk Allocation Step Modal dialog */}
      {isBulkOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-[500px] overflow-hidden border border-neutral-200 flex flex-col animate-in zoom-in-95 duration-150">
            
            {/* Header */}
            <div className="p-5 border-b border-neutral-100 bg-orange-50/30 flex items-center gap-2">
              <Sliders className="w-5 h-5 text-[#fa541c]" />
              <h2 className="text-[15px] font-black text-neutral-900">批量增配学生算力资源配额</h2>
            </div>

            {/* Body */}
            <div className="p-6 space-y-4">
              
              {/* Alert notice */}
              <div className="p-3.5 bg-orange-50 border border-orange-200 rounded-xl text-xs text-orange-800 space-y-1.5">
                <span className="font-bold flex items-center gap-1">
                  <Activity className="w-4 h-4" />
                  已选中 {selectedUserIds.length > 0 ? selectedUserIds.length : filteredUsers.filter(u=>u.role==='学生').length} 位学生账号
                </span>
                <p className="text-[10px] leading-relaxed">
                  {selectedUserIds.length > 0 
                    ? '您当前勾选了列表中的特定学生。' 
                    : '未手动勾选时，将默认对当前左侧过滤器筛选出的所有学生批量进行增配操作。'
                  }
                </p>
              </div>

              {/* Resource key selection */}
              <div className="space-y-1.5">
                <label className="text-[12px] font-bold text-neutral-700 block">选择需要追配追加的资源类型</label>
                <select 
                  value={bulkResourceKey}
                  onChange={(e) => setBulkResourceKey(e.target.value as any)}
                  className="w-full text-xs border border-neutral-200 rounded-lg pl-3 pr-8 py-2.5 focus:outline-none bg-white text-neutral-800 font-bold"
                >
                  <option value="gpuHours">GPU 显卡时 (小时)</option>
                  <option value="cpuHours">CPU 时长 (小时)</option>
                  <option value="tokens">大模型 API Token (M)</option>
                  <option value="projects">项目卡数上限 (个)</option>
                  <option value="datasets">数据集数配额 (个)</option>
                </select>
              </div>

              {/* Add amount value */}
              <div className="space-y-1.5">
                <label className="text-[12px] font-bold text-neutral-700 block">输入追加分配资源数量 (数值)</label>
                <input 
                  type="number" 
                  value={bulkAmount}
                  onChange={(e) => setBulkAmount(e.target.value)}
                  placeholder="追加增配的具体数值，例如 10"
                  className="w-full border border-neutral-200 rounded-xl px-4 py-2.5 text-xs text-neutral-800 bg-white focus:outline-none" 
                />
              </div>

              {/* Expire date input */}
              <div className="space-y-1.5">
                <label className="text-[12px] font-bold text-neutral-700 block">设定这批追配资源的有效期截止日期</label>
                <input 
                  type="date" 
                  value={bulkExpiry}
                  onChange={(e) => setBulkExpiry(e.target.value)}
                  className="w-full border border-neutral-200 rounded-xl px-4 py-2.5 text-xs text-neutral-800 bg-white focus:outline-none" 
                />
              </div>

            </div>

            {/* Footer */}
            <div className="p-5 border-t border-neutral-100 bg-neutral-50/30 flex items-center justify-end gap-3">
              <Button 
                onClick={() => setIsBulkOpen(false)} 
                variant="outline" 
                className="border-neutral-200 text-neutral-600 font-bold h-9 px-5 rounded-lg text-xs"
              >
                取消
              </Button>
              <Button 
                onClick={executeBulkAllocation}
                className="bg-[#fa541c] hover:bg-[#e84a15] text-white font-bold h-9 px-6 rounded-lg shadow-md shadow-orange-500/10 text-xs cursor-pointer"
              >
                确认并立即增配分配
              </Button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
