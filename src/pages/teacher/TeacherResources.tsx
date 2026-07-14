import React, { useState } from 'react';
import { 
  Search, Plus, X, Sliders, ChevronDown, Check, Info, 
  AlertTriangle, ShieldCheck
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
  tokens: number;
}

interface UserResourceItem {
  id: string;
  name: string;
  phone: string;
  role: '学生' | '教师';
  college: string;
  major: string;
  class: string;
  quotas: QuotaItem;
  allocatedDate: string;
  expiryDate: string;
}

const initialUsers: UserResourceItem[] = [
  {
    id: 'S001',
    name: '张三',
    phone: '18656686967',
    role: '学生',
    college: '计算机学院',
    major: '人工智能',
    class: '人工智能一班',
    quotas: { gpuHours: 2, cpuHours: 2, projects: 3, datasets: 4, practices: 1, aiAssistants: 1, tokens: 4 },
    allocatedDate: '2026-03-01',
    expiryDate: '2026-07-01'
  },
  {
    id: 'S002',
    name: '李四',
    phone: '13656686967',
    role: '学生',
    college: '计算机学院',
    major: '人工智能',
    class: '人工智能一班',
    quotas: { gpuHours: 2, cpuHours: 2, projects: 3, datasets: 4, practices: 1, aiAssistants: 1, tokens: 3 },
    allocatedDate: '2026-03-01',
    expiryDate: '2026-07-01'
  },
  {
    id: 'S003',
    name: '王五',
    phone: '13628399493',
    role: '学生',
    college: '计算机学院',
    major: '数据科学',
    class: '数据科学二班',
    quotas: { gpuHours: 2, cpuHours: 2, projects: 3, datasets: 4, practices: 1, aiAssistants: 1, tokens: 2 },
    allocatedDate: '2026-03-01',
    expiryDate: '2026-07-01'
  },
  {
    id: 'S004',
    name: '刘能',
    phone: '19628399493',
    role: '学生',
    college: '软件学院',
    major: '软件工程',
    class: '软件工程一班',
    quotas: { gpuHours: 2, cpuHours: 2, projects: 3, datasets: 4, practices: 1, aiAssistants: 1, tokens: 1 },
    allocatedDate: '2026-03-01',
    expiryDate: '2026-07-01'
  },
  {
    id: 'S005',
    name: '刘能',
    phone: '19628399493',
    role: '学生',
    college: '软件学院',
    major: '软件工程',
    class: '软件工程一班',
    quotas: { gpuHours: 2, cpuHours: 2, projects: 3, datasets: 4, practices: 1, aiAssistants: 1, tokens: 2 },
    allocatedDate: '2026-03-01',
    expiryDate: '2026-07-01'
  }
];

export default function TeacherResources() {
  const [users, setUsers] = useState<UserResourceItem[]>(initialUsers);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [isSingleAdjustOpen, setIsSingleAdjustOpen] = useState(false);
  const [targetUser, setTargetUser] = useState<UserResourceItem | null>(null);

  // Form states for single-user config
  const [formGpu, setFormGpu] = useState(0);
  const [formCpu, setFormCpu] = useState(0);
  const [formProjects, setFormProjects] = useState(0);
  const [formDatasets, setFormDatasets] = useState(0);
  const [formPractices, setFormPractices] = useState(0);
  const [formAiAssistants, setFormAiAssistants] = useState(0);
  const [formTokens, setFormTokens] = useState(0);

  // Bulk configure states
  const [isBulkOpen, setIsBulkOpen] = useState(false);
  const [bulkGpu, setBulkGpu] = useState(2);
  const [bulkCpu, setBulkCpu] = useState(2);
  const [bulkProjects, setBulkProjects] = useState(3);
  const [bulkDatasets, setBulkDatasets] = useState(4);
  const [bulkAiAssistants, setBulkAiAssistants] = useState(1);
  const [bulkTokens, setBulkTokens] = useState(4);

  // Toast state
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Filter list by name or phone
  const filteredUsers = users.filter(u => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return u.name.toLowerCase().includes(q) || u.phone.includes(q);
  });

  // Table selection
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

  // Configure single user resource
  const triggerSingleAdjust = (user: UserResourceItem) => {
    setTargetUser(user);
    setFormGpu(user.quotas.gpuHours);
    setFormCpu(user.quotas.cpuHours);
    setFormProjects(user.quotas.projects);
    setFormDatasets(user.quotas.datasets);
    setFormPractices(user.quotas.practices);
    setFormAiAssistants(user.quotas.aiAssistants);
    setFormTokens(user.quotas.tokens);
    setIsSingleAdjustOpen(true);
  };

  const saveSingleAdjustment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetUser) return;

    setUsers(users.map(u => u.id === targetUser.id ? {
      ...u,
      quotas: {
        gpuHours: formGpu,
        cpuHours: formCpu,
        projects: formProjects,
        datasets: formDatasets,
        practices: formPractices,
        aiAssistants: formAiAssistants,
        tokens: formTokens
      }
    } : u));

    setIsSingleAdjustOpen(false);
    showToast(`成功更新 ${targetUser.name} 的资源配置！`);
  };

  // Execute bulk adjustment
  const executeBulkAllocation = (e: React.FormEvent) => {
    e.preventDefault();
    const targets = selectedUserIds.length > 0 ? selectedUserIds : filteredUsers.map(u => u.id);
    if (targets.length === 0) {
      showToast('没有可操作的学生账号', 'error');
      return;
    }

    setUsers(users.map(u => {
      if (targets.includes(u.id)) {
        return {
          ...u,
          quotas: {
            ...u.quotas,
            gpuHours: u.quotas.gpuHours + bulkGpu,
            cpuHours: u.quotas.cpuHours + bulkCpu,
            projects: u.quotas.projects + bulkProjects,
            datasets: u.quotas.datasets + bulkDatasets,
            aiAssistants: u.quotas.aiAssistants + bulkAiAssistants,
            tokens: u.quotas.tokens + bulkTokens
          }
        };
      }
      return u;
    }));

    setIsBulkOpen(false);
    setSelectedUserIds([]);
    showToast(`已成功为这 ${targets.length} 名学生批量增配资源！`);
  };

  return (
    <div className="space-y-4">
      {/* Toast Alert */}
      {toast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[200] flex items-center gap-2 px-5 py-2.5 bg-white border border-neutral-200 rounded shadow-xl animate-fade-in">
          {toast.type === 'success' ? (
            <ShieldCheck className="w-5 h-5 text-emerald-500" />
          ) : (
            <AlertTriangle className="w-5 h-5 text-red-500" />
          )}
          <span className="text-sm font-bold text-neutral-800">{toast.message}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-4 gap-4">
        <div className="flex items-end gap-4">
          <h1 className="text-xl font-bold text-neutral-900">资源分配</h1>
          <p className="text-sm text-neutral-500 mb-0.5">查看及配置学生的算力与配额资源（包含GPU卡时、CPU时长、项目数、数据集数、智能助手等）</p>
        </div>
      </div>

      {/* Main Table and Toolbar unified module */}
      <div className="bg-white rounded border border-neutral-border overflow-hidden">
        {/* Toolbar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 px-6 py-4 border-b border-neutral-border/50 bg-white">
          <div className="flex items-center gap-3">
            <div className="relative w-72">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                placeholder="请输入"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2 w-full bg-white border border-neutral-border rounded-full text-sm focus:outline-none focus:border-[#fa541c] focus:ring-1 focus:ring-[#fa541c] text-neutral-800 transition-all placeholder:text-neutral-400"
              />
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto md:justify-end">
            <Button 
              onClick={() => {
                setBulkGpu(2);
                setBulkCpu(2);
                setBulkProjects(3);
                setBulkDatasets(4);
                setBulkAiAssistants(1);
                setBulkTokens(4);
                setIsBulkOpen(true);
              }} 
              className="bg-[#fa541c] hover:bg-[#e84a15] text-white flex items-center gap-1 shadow-sm h-9 px-4 rounded-[4px] text-xs font-semibold cursor-pointer border-0"
            >
              批量增配
            </Button>
          </div>
        </div>

        {/* Table content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="border-b border-neutral-border/50 bg-[#fafafa] text-[13px] text-neutral-600 font-bold select-none">
                <th className="pl-6 pr-3 py-3.5 font-medium w-12 text-left">
                  <button 
                    type="button"
                    onClick={() => toggleSelectAll(selectedUserIds.length !== filteredUsers.length || filteredUsers.length === 0)}
                    className={cn(
                      "w-4 h-4 rounded border flex items-center justify-center transition-all cursor-pointer",
                      selectedUserIds.length === filteredUsers.length && filteredUsers.length > 0
                        ? "bg-[#fa541c] border-[#fa541c] text-white"
                        : "border-neutral-300 hover:border-[#fa541c] bg-white"
                    )}
                  >
                    {selectedUserIds.length === filteredUsers.length && filteredUsers.length > 0 && <span className="text-[10px] font-bold">✓</span>}
                  </button>
                </th>
                <th className="px-3 py-3.5 font-medium text-left">学生姓名</th>
                <th className="px-3 py-3.5 font-medium text-left">手机号</th>
                <th className="px-3 py-3.5 font-medium text-left">GPU卡时</th>
                <th className="px-3 py-3.5 font-medium text-left">CPU时长</th>
                <th className="px-3 py-3.5 font-medium text-left">项目数</th>
                <th className="px-3 py-3.5 font-medium text-left">数据集数</th>
                <th className="px-3 py-3.5 font-medium text-left">最佳实践数</th>
                <th className="px-3 py-3.5 font-medium text-left">智能助手数</th>
                <th className="px-3 py-3.5 font-medium text-left">token余额</th>
                <th className="pl-3 pr-6 py-3.5 font-medium text-left">操作</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((u, index) => (
                <tr key={u.id} className={cn("border-b border-neutral-100 hover:bg-neutral-50/30 transition-colors group text-[13px]", index === filteredUsers.length - 1 && "border-b-0")}>
                  <td className="pl-6 pr-3 py-3 text-left">
                    <button 
                      type="button"
                      onClick={() => toggleSelect(u.id)}
                      className={cn(
                        "w-4 h-4 rounded border flex items-center justify-center transition-all cursor-pointer",
                        selectedUserIds.includes(u.id)
                          ? "bg-[#fa541c] border-[#fa541c] text-white"
                          : "border-neutral-300 hover:border-[#fa541c] bg-white"
                      )}
                    >
                      {selectedUserIds.includes(u.id) && <span className="text-[10px] font-bold">✓</span>}
                    </button>
                  </td>
                  <td className="px-3 py-3 text-neutral-800 font-semibold">{u.name}</td>
                  <td className="px-3 py-3 text-neutral-600 font-mono">{u.phone}</td>
                  <td className="px-3 py-3 text-neutral-800 font-mono">{u.quotas.gpuHours}</td>
                  <td className="px-3 py-3 text-neutral-800 font-mono">{u.quotas.cpuHours}</td>
                  <td className="px-3 py-3 text-neutral-800 font-mono">{u.quotas.projects}</td>
                  <td className="px-3 py-3 text-neutral-800 font-mono">{u.quotas.datasets}</td>
                  <td className="px-3 py-3 text-neutral-800 font-mono">{u.quotas.practices}</td>
                  <td className="px-3 py-3 text-neutral-800 font-mono">{u.quotas.aiAssistants}</td>
                  <td className="px-3 py-3 text-neutral-800 font-mono">{u.quotas.tokens}</td>
                  <td className="pl-3 pr-6 py-3">
                    <button 
                      onClick={() => triggerSingleAdjust(u)}
                      className="text-[#fa541c] hover:text-[#e84a15] font-semibold text-xs transition-colors cursor-pointer border-0 bg-transparent"
                    >
                      配置
                    </button>
                  </td>
                </tr>
              ))}
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={11} className="py-12 text-center text-neutral-400">暂无符合筛选条件的数据</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Table footer with pagination */}
        <div className="flex items-center justify-end p-4 border-t border-neutral-100 gap-4 mt-2 bg-white">
          <span className="text-[13px] text-neutral-500">共 {filteredUsers.length} 条</span>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="h-7 w-7 p-0 rounded-sm" disabled>&lt;</Button>
            <Button variant="outline" size="sm" className="h-7 w-7 p-0 rounded-sm bg-[#fa541c] text-white border-[#fa541c]">1</Button>
            <Button variant="outline" size="sm" className="h-7 w-7 p-0 rounded-sm" disabled>&gt;</Button>
          </div>
          <select className="text-[13px] border border-neutral-200 rounded-sm px-2 py-1 focus:outline-none focus:border-[#fa541c] text-neutral-600 font-medium bg-white">
            <option>10 条/页</option>
            <option>20 条/页</option>
            <option>50 条/页</option>
          </select>
        </div>
      </div>

      {/* 配置 Drawer (从界面右侧滑出) */}
      {isSingleAdjustOpen && targetUser && (
        <div 
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-[2px] flex justify-end animate-fade-in"
          onClick={() => setIsSingleAdjustOpen(false)}
        >
          <div 
            className="bg-white w-full max-w-[660px] h-screen flex flex-col shadow-2xl border-l border-neutral-100 animate-in slide-in-from-right duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer Header */}
            <div className="px-6 py-4 border-b border-neutral-100 flex justify-between items-center bg-neutral-50/50 shrink-0 text-left">
              <h2 className="text-[16px] font-bold text-[#262626] flex items-center gap-2">
                <Sliders className="w-5 h-5 text-[#fa541c]" />
                <span>配置学生资源</span>
              </h2>
              <button 
                onClick={() => setIsSingleAdjustOpen(false)}
                className="text-neutral-400 hover:text-[#fa541c] p-1.5 hover:bg-neutral-100 rounded-[4px] transition-colors cursor-pointer border-0 bg-transparent"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Drawer Content - Form */}
            <form onSubmit={saveSingleAdjustment} className="flex-1 flex flex-col overflow-hidden text-left">
              <div className="p-6 overflow-y-auto space-y-5 flex-1 bg-white custom-scrollbar">
                {/* GPU卡时 */}
                <div className="grid grid-cols-[100px_1fr] items-center gap-4">
                  <label className="text-[13px] font-bold text-[#262626] text-right">
                    GPU卡时 <span className="text-[#fa541c]">*</span>
                  </label>
                  <input 
                    type="number"
                    min="0"
                    value={formGpu}
                    onChange={(e) => setFormGpu(Number(e.target.value))}
                    className="w-full border border-neutral-200 rounded-[4px] px-3.5 py-2 text-xs focus:outline-none focus:border-[#fa541c] focus:ring-1 focus:ring-[#fa541c] transition-all placeholder:text-neutral-400 text-neutral-800 bg-white"
                    required
                  />
                </div>

                {/* CPU时长 */}
                <div className="grid grid-cols-[100px_1fr] items-center gap-4">
                  <label className="text-[13px] font-bold text-[#262626] text-right">
                    CPU时长 <span className="text-[#fa541c]">*</span>
                  </label>
                  <input 
                    type="number"
                    min="0"
                    value={formCpu}
                    onChange={(e) => setFormCpu(Number(e.target.value))}
                    className="w-full border border-neutral-200 rounded-[4px] px-3.5 py-2 text-xs focus:outline-none focus:border-[#fa541c] focus:ring-1 focus:ring-[#fa541c] transition-all placeholder:text-neutral-400 text-neutral-800 bg-white"
                    required
                  />
                </div>

                {/* 项目数 */}
                <div className="grid grid-cols-[100px_1fr] items-center gap-4">
                  <label className="text-[13px] font-bold text-[#262626] text-right">
                    项目数 <span className="text-[#fa541c]">*</span>
                  </label>
                  <input 
                    type="number"
                    min="0"
                    value={formProjects}
                    onChange={(e) => setFormProjects(Number(e.target.value))}
                    className="w-full border border-neutral-200 rounded-[4px] px-3.5 py-2 text-xs focus:outline-none focus:border-[#fa541c] focus:ring-1 focus:ring-[#fa541c] transition-all placeholder:text-neutral-400 text-neutral-800 bg-white"
                    required
                  />
                </div>

                {/* 数据集数 */}
                <div className="grid grid-cols-[100px_1fr] items-center gap-4">
                  <label className="text-[13px] font-bold text-[#262626] text-right">
                    数据集数 <span className="text-[#fa541c]">*</span>
                  </label>
                  <input 
                    type="number"
                    min="0"
                    value={formDatasets}
                    onChange={(e) => setFormDatasets(Number(e.target.value))}
                    className="w-full border border-neutral-200 rounded-[4px] px-3.5 py-2 text-xs focus:outline-none focus:border-[#fa541c] focus:ring-1 focus:ring-[#fa541c] transition-all placeholder:text-neutral-400 text-neutral-800 bg-white"
                    required
                  />
                </div>

                {/* 智能助手数 */}
                <div className="grid grid-cols-[100px_1fr] items-center gap-4">
                  <label className="text-[13px] font-bold text-[#262626] text-right">
                    智能助手数 <span className="text-[#fa541c]">*</span>
                  </label>
                  <input 
                    type="number"
                    min="0"
                    value={formAiAssistants}
                    onChange={(e) => setFormAiAssistants(Number(e.target.value))}
                    className="w-full border border-neutral-200 rounded-[4px] px-3.5 py-2 text-xs focus:outline-none focus:border-[#fa541c] focus:ring-1 focus:ring-[#fa541c] transition-all placeholder:text-neutral-400 text-neutral-800 bg-white"
                    required
                  />
                </div>

                {/* token余额 */}
                <div className="grid grid-cols-[100px_1fr] items-center gap-4">
                  <label className="text-[13px] font-bold text-[#262626] text-right">
                    token余额 <span className="text-[#fa541c]">*</span>
                  </label>
                  <input 
                    type="number"
                    min="0"
                    value={formTokens}
                    onChange={(e) => setFormTokens(Number(e.target.value))}
                    className="w-full border border-neutral-200 rounded-[4px] px-3.5 py-2 text-xs focus:outline-none focus:border-[#fa541c] focus:ring-1 focus:ring-[#fa541c] transition-all placeholder:text-neutral-400 text-neutral-800 bg-white"
                    required
                  />
                </div>
              </div>

              {/* Drawer Footer */}
              <div className="px-6 py-4 border-t border-neutral-100 bg-neutral-50/50 flex items-center justify-end gap-3 shrink-0">
                <Button 
                  type="button" 
                  onClick={() => setIsSingleAdjustOpen(false)} 
                  variant="outline" 
                  className="border-neutral-200 text-neutral-600 font-semibold h-9 px-6 rounded-[4px] text-[13px] bg-white hover:bg-neutral-50 transition-colors"
                >
                  取消
                </Button>
                <Button 
                  type="submit" 
                  className="bg-[#fa541c] hover:bg-[#e84a15] text-white font-bold h-9 px-6 rounded-[4px] shadow-sm text-[13px] cursor-pointer border-0 transition-colors"
                >
                  确认配置
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 批量增配 Drawer (从界面右侧滑出) */}
      {isBulkOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-[2px] flex justify-end animate-fade-in text-left"
          onClick={() => setIsBulkOpen(false)}
        >
          <div 
            className="bg-white w-full max-w-[660px] h-screen flex flex-col shadow-2xl border-l border-neutral-100 animate-in slide-in-from-right duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="px-6 py-4 border-b border-neutral-100 flex justify-between items-center bg-neutral-50/50 shrink-0">
              <h2 className="text-[16px] font-bold text-[#262626] flex items-center gap-2">
                <Plus className="w-5 h-5 text-[#fa541c]" />
                <span>批量增配资源</span>
              </h2>
              <button 
                onClick={() => setIsBulkOpen(false)}
                className="text-neutral-400 hover:text-[#fa541c] p-1.5 hover:bg-neutral-100 rounded-[4px] transition-colors cursor-pointer border-0 bg-transparent"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <form onSubmit={executeBulkAllocation} className="flex-1 flex flex-col overflow-hidden text-left">
              <div className="p-6 overflow-y-auto space-y-5 flex-1 bg-white custom-scrollbar">
                {/* GPU卡时 */}
                <div className="grid grid-cols-[100px_1fr] items-center gap-4">
                  <label className="text-[13px] font-bold text-[#262626] text-right">
                    GPU卡时 <span className="text-[#fa541c]">*</span>
                  </label>
                  <input 
                    type="number"
                    min="0"
                    value={bulkGpu}
                    onChange={(e) => setBulkGpu(Number(e.target.value))}
                    className="w-full border border-neutral-200 rounded-[4px] px-3.5 py-2 text-xs focus:outline-none focus:border-[#fa541c] focus:ring-1 focus:ring-[#fa541c] transition-all placeholder:text-neutral-400 text-neutral-800 bg-white"
                    required
                  />
                </div>

                {/* CPU时长 */}
                <div className="grid grid-cols-[100px_1fr] items-center gap-4">
                  <label className="text-[13px] font-bold text-[#262626] text-right">
                    CPU时长 <span className="text-[#fa541c]">*</span>
                  </label>
                  <input 
                    type="number"
                    min="0"
                    value={bulkCpu}
                    onChange={(e) => setBulkCpu(Number(e.target.value))}
                    className="w-full border border-neutral-200 rounded-[4px] px-3.5 py-2 text-xs focus:outline-none focus:border-[#fa541c] focus:ring-1 focus:ring-[#fa541c] transition-all placeholder:text-neutral-400 text-neutral-800 bg-white"
                    required
                  />
                </div>

                {/* 项目数 */}
                <div className="grid grid-cols-[100px_1fr] items-center gap-4">
                  <label className="text-[13px] font-bold text-[#262626] text-right">
                    项目数 <span className="text-[#fa541c]">*</span>
                  </label>
                  <input 
                    type="number"
                    min="0"
                    value={bulkProjects}
                    onChange={(e) => setBulkProjects(Number(e.target.value))}
                    className="w-full border border-neutral-200 rounded-[4px] px-3.5 py-2 text-xs focus:outline-none focus:border-[#fa541c] focus:ring-1 focus:ring-[#fa541c] transition-all placeholder:text-neutral-400 text-neutral-800 bg-white"
                    required
                  />
                </div>

                {/* 数据集数 */}
                <div className="grid grid-cols-[100px_1fr] items-center gap-4">
                  <label className="text-[13px] font-bold text-[#262626] text-right">
                    数据集数 <span className="text-[#fa541c]">*</span>
                  </label>
                  <input 
                    type="number"
                    min="0"
                    value={bulkDatasets}
                    onChange={(e) => setBulkDatasets(Number(e.target.value))}
                    className="w-full border border-neutral-200 rounded-[4px] px-3.5 py-2 text-xs focus:outline-none focus:border-[#fa541c] focus:ring-1 focus:ring-[#fa541c] transition-all placeholder:text-neutral-400 text-neutral-800 bg-white"
                    required
                  />
                </div>

                {/* 智能助手数 */}
                <div className="grid grid-cols-[100px_1fr] items-center gap-4">
                  <label className="text-[13px] font-bold text-[#262626] text-right">
                    智能助手数 <span className="text-[#fa541c]">*</span>
                  </label>
                  <input 
                    type="number"
                    min="0"
                    value={bulkAiAssistants}
                    onChange={(e) => setBulkAiAssistants(Number(e.target.value))}
                    className="w-full border border-neutral-200 rounded-[4px] px-3.5 py-2 text-xs focus:outline-none focus:border-[#fa541c] focus:ring-1 focus:ring-[#fa541c] transition-all placeholder:text-neutral-400 text-neutral-800 bg-white"
                    required
                  />
                </div>

                {/* token余额 */}
                <div className="grid grid-cols-[100px_1fr] items-center gap-4">
                  <label className="text-[13px] font-bold text-[#262626] text-right">
                    token余额 <span className="text-[#fa541c]">*</span>
                  </label>
                  <input 
                    type="number"
                    min="0"
                    value={bulkTokens}
                    onChange={(e) => setBulkTokens(Number(e.target.value))}
                    className="w-full border border-neutral-200 rounded-[4px] px-3.5 py-2 text-xs focus:outline-none focus:border-[#fa541c] focus:ring-1 focus:ring-[#fa541c] transition-all placeholder:text-neutral-400 text-neutral-800 bg-white"
                    required
                  />
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 py-4 border-t border-neutral-100 bg-neutral-50/50 flex items-center justify-end gap-3 shrink-0">
                <Button 
                  type="button"
                  onClick={() => setIsBulkOpen(false)} 
                  variant="outline" 
                  className="border-neutral-200 text-neutral-600 font-semibold h-9 px-6 rounded-[4px] text-[13px] bg-white hover:bg-neutral-50 transition-colors"
                >
                  取消
                </Button>
                <Button 
                  type="submit"
                  className="bg-[#fa541c] hover:bg-[#e84a15] text-white font-bold h-9 px-6 rounded-[4px] shadow-sm text-[13px] cursor-pointer border-0 transition-colors"
                >
                  确认并立即增配
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
