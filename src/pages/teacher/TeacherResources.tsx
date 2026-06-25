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
  const [formExpiry, setFormExpiry] = useState('');

  // Bulk configure states
  const [isBulkOpen, setIsBulkOpen] = useState(false);
  const [bulkResourceKey, setBulkResourceKey] = useState<keyof QuotaItem>('gpuHours');
  const [bulkAmount, setBulkAmount] = useState('1');
  const [bulkExpiry, setBulkExpiry] = useState('2026-07-01');

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
    setFormExpiry(user.expiryDate);
    setIsSingleAdjustOpen(true);
  };

  const saveSingleAdjustment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetUser) return;

    setUsers(users.map(u => u.id === targetUser.id ? {
      ...u,
      expiryDate: formExpiry,
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
  const executeBulkAllocation = () => {
    const valueNum = Number(bulkAmount);
    if (isNaN(valueNum) || valueNum <= 0) {
      showToast('请输入有效的增配数量', 'error');
      return;
    }

    const targets = selectedUserIds.length > 0 ? selectedUserIds : filteredUsers.map(u => u.id);
    if (targets.length === 0) {
      showToast('没有可操作的学生账号', 'error');
      return;
    }

    setUsers(users.map(u => {
      if (targets.includes(u.id)) {
        return {
          ...u,
          expiryDate: bulkExpiry,
          quotas: {
            ...u.quotas,
            [bulkResourceKey]: u.quotas[bulkResourceKey] + valueNum
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
              onClick={() => setIsBulkOpen(true)} 
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
            className="bg-white w-full max-w-[560px] h-screen flex flex-col shadow-2xl border-l border-neutral-100 animate-in slide-in-from-right duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer Header */}
            <div className="px-6 py-4 border-b border-neutral-100 flex justify-between items-center bg-neutral-50/50 shrink-0">
              <h2 className="text-[16px] font-bold text-[#262626] flex items-center gap-2">
                <Sliders className="w-5 h-5 text-[#fa541c]" />
                <span>配置学生资源</span>
              </h2>
              <button 
                onClick={() => setIsSingleAdjustOpen(false)}
                className="text-neutral-400 hover:text-[#fa541c] p-1.5 hover:bg-neutral-100 rounded-[4px] transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Drawer Content - Form */}
            <form onSubmit={saveSingleAdjustment} className="flex-1 flex flex-col overflow-hidden">
              <div className="p-6 overflow-y-auto space-y-5 flex-1 bg-white custom-scrollbar">
                
                {/* Student Info Card */}
                <div className="p-4 bg-neutral-50 rounded border border-neutral-200 text-xs grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-neutral-400">学生姓名：</span>
                    <span className="font-semibold text-neutral-800">{targetUser.name}</span>
                  </div>
                  <div>
                    <span className="text-neutral-400">手机号：</span>
                    <span className="font-mono text-neutral-800">{targetUser.phone}</span>
                  </div>
                  <div>
                    <span className="text-neutral-400">归属学院：</span>
                    <span className="text-neutral-800">{targetUser.college}</span>
                  </div>
                  <div>
                    <span className="text-neutral-400">班级：</span>
                    <span className="text-neutral-800">{targetUser.class}</span>
                  </div>
                </div>

                {/* Quotas input grids */}
                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-neutral-500 uppercase tracking-wider">配额资源配置</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[12px] font-bold text-neutral-700 block">GPU卡时</label>
                      <input 
                        type="number"
                        min="0"
                        value={formGpu}
                        onChange={(e) => setFormGpu(Number(e.target.value))}
                        className="w-full px-3 py-2 border border-neutral-300 rounded text-xs outline-none focus:ring-1 focus:ring-[#fa541c] focus:border-[#fa541c] transition-all bg-white text-neutral-800"
                        required
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[12px] font-bold text-neutral-700 block">CPU时长</label>
                      <input 
                        type="number"
                        min="0"
                        value={formCpu}
                        onChange={(e) => setFormCpu(Number(e.target.value))}
                        className="w-full px-3 py-2 border border-neutral-300 rounded text-xs outline-none focus:ring-1 focus:ring-[#fa541c] focus:border-[#fa541c] transition-all bg-white text-neutral-800"
                        required
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[12px] font-bold text-neutral-700 block">项目数</label>
                      <input 
                        type="number"
                        min="0"
                        value={formProjects}
                        onChange={(e) => setFormProjects(Number(e.target.value))}
                        className="w-full px-3 py-2 border border-neutral-300 rounded text-xs outline-none focus:ring-1 focus:ring-[#fa541c] focus:border-[#fa541c] transition-all bg-white text-neutral-800"
                        required
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[12px] font-bold text-neutral-700 block">数据集数</label>
                      <input 
                        type="number"
                        min="0"
                        value={formDatasets}
                        onChange={(e) => setFormDatasets(Number(e.target.value))}
                        className="w-full px-3 py-2 border border-neutral-300 rounded text-xs outline-none focus:ring-1 focus:ring-[#fa541c] focus:border-[#fa541c] transition-all bg-white text-neutral-800"
                        required
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[12px] font-bold text-neutral-700 block">最佳实践数</label>
                      <input 
                        type="number"
                        min="0"
                        value={formPractices}
                        onChange={(e) => setFormPractices(Number(e.target.value))}
                        className="w-full px-3 py-2 border border-neutral-300 rounded text-xs outline-none focus:ring-1 focus:ring-[#fa541c] focus:border-[#fa541c] transition-all bg-white text-neutral-800"
                        required
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[12px] font-bold text-neutral-700 block">智能助手数</label>
                      <input 
                        type="number"
                        min="0"
                        value={formAiAssistants}
                        onChange={(e) => setFormAiAssistants(Number(e.target.value))}
                        className="w-full px-3 py-2 border border-neutral-300 rounded text-xs outline-none focus:ring-1 focus:ring-[#fa541c] focus:border-[#fa541c] transition-all bg-white text-neutral-800"
                        required
                      />
                    </div>
                    <div className="space-y-1.5 col-span-2">
                      <label className="text-[12px] font-bold text-neutral-700 block">token余额</label>
                      <input 
                        type="number"
                        min="0"
                        value={formTokens}
                        onChange={(e) => setFormTokens(Number(e.target.value))}
                        className="w-full px-3 py-2 border border-neutral-300 rounded text-xs outline-none focus:ring-1 focus:ring-[#fa541c] focus:border-[#fa541c] transition-all bg-white text-neutral-800"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Expiry setting */}
                <div className="space-y-1.5">
                  <label className="text-[12px] font-bold text-neutral-700 block">有效期截止日期</label>
                  <input 
                    type="date"
                    value={formExpiry}
                    onChange={(e) => setFormExpiry(e.target.value)}
                    className="w-full px-3 py-2 border border-neutral-300 rounded text-xs outline-none focus:ring-1 focus:ring-[#fa541c] focus:border-[#fa541c] transition-all bg-white text-neutral-800"
                    required
                  />
                </div>
              </div>

              {/* Drawer Footer */}
              <div className="px-6 py-4 border-t border-neutral-100 bg-neutral-50 flex items-center justify-end gap-3 shrink-0">
                <Button 
                  type="button" 
                  onClick={() => setIsSingleAdjustOpen(false)} 
                  variant="outline" 
                  className="border-neutral-200 text-neutral-600 font-medium h-9 px-4 rounded-[4px] text-xs bg-white hover:bg-neutral-50"
                >
                  取消
                </Button>
                <Button 
                  type="submit" 
                  className="bg-[#fa541c] hover:bg-[#e84a15] text-white font-bold h-9 px-5 rounded-[4px] shadow-sm text-xs cursor-pointer border-0"
                >
                  确认配置
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 批量增配 Modal */}
      {isBulkOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[2px] animate-fade-in">
          <div className="bg-white rounded shadow-2xl w-full max-w-[500px] overflow-hidden border border-neutral-100 flex flex-col animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="px-6 py-4 border-b border-neutral-100 flex justify-between items-center bg-neutral-50/50 shrink-0">
              <h2 className="text-[16px] font-bold text-[#262626] flex items-center gap-2">
                <Plus className="w-5 h-5 text-[#fa541c]" />
                <span>批量增配资源</span>
              </h2>
              <button 
                onClick={() => setIsBulkOpen(false)}
                className="text-neutral-400 hover:text-[#fa541c] p-1.5 hover:bg-neutral-100 rounded-[4px] transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-4">
              {/* Info banner */}
              <div className="p-3 bg-[#fff2e8] border border-[#ffbb96] rounded text-xs text-[#fa541c] leading-relaxed">
                已选中 <strong>{selectedUserIds.length > 0 ? selectedUserIds.length : filteredUsers.length}</strong> 位学生的账号。
                {selectedUserIds.length === 0 && " (当前未勾选学生，默认对列表内所有学生生效)"}
              </div>

              {/* Resource key */}
              <div className="space-y-1.5">
                <label className="text-[12px] font-bold text-neutral-700 block">选择追加的资源类型</label>
                <select 
                  value={bulkResourceKey}
                  onChange={(e) => setBulkResourceKey(e.target.value as any)}
                  className="w-full px-3 py-2 border border-neutral-300 rounded text-xs outline-none focus:ring-1 focus:ring-[#fa541c] focus:border-[#fa541c] transition-all bg-white text-neutral-800"
                >
                  <option value="gpuHours">GPU卡时</option>
                  <option value="cpuHours">CPU时长</option>
                  <option value="projects">项目数</option>
                  <option value="datasets">数据集数</option>
                  <option value="practices">最佳实践数</option>
                  <option value="aiAssistants">智能助手数</option>
                  <option value="tokens">token余额</option>
                </select>
              </div>

              {/* Amount */}
              <div className="space-y-1.5">
                <label className="text-[12px] font-bold text-neutral-700 block">输入追加资源数量</label>
                <input 
                  type="number" 
                  min="1"
                  value={bulkAmount}
                  onChange={(e) => setBulkAmount(e.target.value)}
                  placeholder="请输入要追加的具体额度数值"
                  className="w-full px-3 py-2 border border-neutral-300 rounded text-xs outline-none focus:ring-1 focus:ring-[#fa541c] focus:border-[#fa541c] transition-all bg-white text-neutral-800" 
                />
              </div>

              {/* Expiry */}
              <div className="space-y-1.5">
                <label className="text-[12px] font-bold text-neutral-700 block">有效期截止日期</label>
                <input 
                  type="date" 
                  value={bulkExpiry}
                  onChange={(e) => setBulkExpiry(e.target.value)}
                  className="w-full px-3 py-2 border border-neutral-300 rounded text-xs outline-none focus:ring-1 focus:ring-[#fa541c] focus:border-[#fa541c] transition-all bg-white text-neutral-800" 
                />
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-neutral-100 bg-neutral-50 flex items-center justify-end gap-3 shrink-0">
              <Button 
                onClick={() => setIsBulkOpen(false)} 
                variant="outline" 
                className="border-neutral-200 text-neutral-600 font-medium h-9 px-4 rounded-[4px] text-xs bg-white hover:bg-neutral-50"
              >
                取消
              </Button>
              <Button 
                onClick={executeBulkAllocation}
                className="bg-[#fa541c] hover:bg-[#e84a15] text-white font-bold h-9 px-5 rounded-[4px] shadow-sm text-xs cursor-pointer border-0"
              >
                确认并立即增配
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
