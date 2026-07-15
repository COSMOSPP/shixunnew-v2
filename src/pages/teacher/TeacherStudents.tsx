import React, { useState } from 'react';
import { Search, ChevronDown, UserPlus, FileText, Download, Users, User, Plus, Shield, Check, X, ShieldCheck, Trash2, Edit3, Lock, Cpu, Eye, FileSpreadsheet, RotateCcw, AlertTriangle, HelpCircle, Activity, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface UserItem {
  id: string;
  name: string;
  phone: string;
  email: string;
  role: '学生' | '教师' | '管理员';
  status: '正常' | '禁用';
  lastLogin: string;
  duration: number; // in hours
  quota: number; // in AI tokens/million
  regDate: string;
}

export default function TeacherStudents() {
  const [activeTab, setActiveTab] = useState<'student' | 'teacher'>('student');
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  
  // Search & Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | '学生' | '教师' | '管理员'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | '正常' | '禁用'>('all');
  const [dateFilter, setDateFilter] = useState<'all' | 'week' | 'month' | 'year'>('all');

  // Single User Quota adjustments
  const [isQuotaOpen, setIsQuotaOpen] = useState(false);
  const [quotaUser, setQuotaUser] = useState<UserItem | null>(null);
  const [singleQuotaValue, setSingleQuotaValue] = useState(300);

  // Master Users Mock Data
  const [users, setUsers] = useState<UserItem[]>([
    { id: '2026744501', name: '王小明', phone: '13800138001', email: 'wang.xm@zhiyun.edu', role: '学生', status: '正常', lastLogin: '2026-05-26 09:12', duration: 85, quota: 350, regDate: '2025-09-01' },
    { id: '2026744502', name: '李华', phone: '13800138002', email: 'li.hua@zhiyun.edu', role: '学生', status: '正常', lastLogin: '2026-05-25 18:30', duration: 120, quota: 500, regDate: '2025-09-01' },
    { id: '2026744503', name: '张伟', phone: '13800138003', email: 'zhang.wei@zhiyun.edu', role: '学生', status: '禁用', lastLogin: '2026-05-20 14:02', duration: 42, quota: 200, regDate: '2025-09-05' },
    { id: '2026744504', name: '陈芳', phone: '13800138004', email: 'chen.fang@zhiyun.edu', role: '学生', status: '正常', lastLogin: '2026-05-26 10:05', duration: 150, quota: 600, regDate: '2025-09-01' },
    { id: '2026744505', name: '刘洋', phone: '13800138005', email: 'liu.yang@zhiyun.edu', role: '学生', status: '禁用', lastLogin: '2026-05-18 10:11', duration: 12, quota: 50, regDate: '2025-09-12' },
    { id: 'T1001', name: '张老师', phone: '13900139001', email: 'zhang.t@zhiyun.edu', role: '教师', status: '正常', lastLogin: '2026-05-26 10:44', duration: 320, quota: 1500, regDate: '2023-09-01' },
    { id: 'T1002', name: '李讲师', phone: '13900139002', email: 'li.t@zhiyun.edu', role: '教师', status: '正常', lastLogin: '2026-05-26 07:15', duration: 180, quota: 1000, regDate: '2024-03-15' },
    { id: 'TA3001', name: '王助教', phone: '13700137001', email: 'wang.ta@zhiyun.edu', role: '教师', status: '正常', lastLogin: '2026-05-25 15:45', duration: 94, quota: 800, regDate: '2025-09-10' },
    { id: 'TA3002', name: '李助教', phone: '13700137002', email: 'li.ta@zhiyun.edu', role: '教师', status: '禁用', lastLogin: '2026-05-10 11:20', duration: 45, quota: 400, regDate: '2025-09-10' },
    { id: 'A0001', name: '系统管理员', phone: '13600136001', email: 'admin@zhiyun.edu', role: '管理员', status: '正常', lastLogin: '2026-05-24 16:32', duration: 980, quota: 9999, regDate: '2022-01-01' }
  ]);

  // UI Dialog States
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [isEditUserOpen, setIsEditUserOpen] = useState(false);
  const [isDetailUserOpen, setIsDetailUserOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isBulkActionOpen, setIsBulkActionOpen] = useState(false);
  
  // Active/Target items
  const [selectedUser, setSelectedUser] = useState<UserItem | null>(null);
  const [editingUser, setEditingUser] = useState<UserItem | null>(null);
  const [bulkActionType, setBulkActionType] = useState<'status_enable' | 'status_disable' | 'reset_pwd' | 'adjust_quota' | 'adjust_role' | null>(null);
  const [bulkQuotaValue, setBulkQuotaValue] = useState(500);
  const [bulkRoleValue, setBulkRoleValue] = useState<'学生' | '教师' | '管理员'>('学生');

  // Operation Logs for safety mechanism (simulating rollbacks)
  const [operationLogs, setOperationLogs] = useState<any[]>([
    { id: 'L001', time: '2026-05-26 09:20', type: '批量启用账号', targets: '2026744503, 2026744505', detail: '成功恢复2个账号正常状态', reversible: true, status: '已生效' }
  ]);

  // Import Simulator States
  const [importStep, setImportStep] = useState<1 | 2 | 3 | 4>(1);
  const [importFile, setImportFile] = useState<File | null>(null);
  const [importErrors, setImportErrors] = useState<any[]>([]);
  const [importSuccessCount, setImportSuccessCount] = useState(0);

  // Export Select Fields
  const [exportFields, setExportFields] = useState({
    name: true, phone: true, email: true, role: true, status: true, duration: true, quota: true, regDate: false
  });

  // Global Toast
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Filters mapping
  const filteredUsers = users.filter(u => {
    // Tab filtering (student/teacher)
    if (activeTab === 'student' && u.role !== '学生') return false;
    if (activeTab === 'teacher' && u.role === '学生') return false;

    // Search filters (merge name and phone into a single search query)
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      const matchName = u.name.toLowerCase().includes(term);
      const matchPhone = u.phone.includes(term);
      if (!matchName && !matchPhone) return false;
    }

    // Status filter
    if (statusFilter !== 'all' && u.status !== statusFilter) return false;

    // Date filter
    if (dateFilter !== 'all') {
      const now = new Date();
      const reg = new Date(u.regDate);
      const diffTime = Math.abs(now.getTime() - reg.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      if (dateFilter === 'week' && diffDays > 7) return false;
      if (dateFilter === 'month' && diffDays > 30) return false;
      if (dateFilter === 'year' && diffDays > 365) return false;
    }

    return true;
  });

  // Multi select utilities
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

  // CRUD Actions
  const handleSaveAddUser = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const name = fd.get('name') as string;
    const phone = fd.get('phone') as string;
    const email = fd.get('email') as string;
    const role = fd.get('role') as '学生' | '教师' | '管理员';
    const quota = Number(fd.get('quota') || 100);

    if (!name || !phone || !email) {
      showToast('所有必填字段均不可留空', 'error');
      return;
    }

    const newUser: UserItem = {
      id: role === '学生' ? '20267' + Math.floor(10000 + Math.random() * 90000) : 'T' + Math.floor(2000 + Math.random() * 8000),
      name, phone, email, role,
      status: '正常',
      lastLogin: '-',
      duration: 0,
      quota,
      regDate: new Date().toISOString().split('T')[0]
    };

    setUsers([newUser, ...users]);
    setIsAddUserOpen(false);
    showToast(`成功新增${role}：${name}`);
  };

  const handleSaveEditUser = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingUser) return;

    const fd = new FormData(e.currentTarget);
    const name = fd.get('name') as string;
    const phone = fd.get('phone') as string;
    const email = fd.get('email') as string;
    const role = fd.get('role') as '学生' | '教师' | '管理员';
    const quota = Number(fd.get('quota') || 100);
    const status = fd.get('status') as '正常' | '禁用';

    setUsers(users.map(u => u.id === editingUser.id ? {
      ...u, name, phone, email, role, quota, status
    } : u));

    setIsEditUserOpen(false);
    setEditingUser(null);
    showToast('用户信息更新成功！');
  };

  const handleToggleSingleStatus = (id: string, currentStatus: '正常' | '禁用') => {
    const nextStatus = currentStatus === '正常' ? '禁用' : '正常';
    setUsers(users.map(u => u.id === id ? { ...u, status: nextStatus } : u));
    showToast(`账号已成功${nextStatus === '正常' ? '启用' : '禁用'}`);
  };

  const handleDeleteSingleUser = (id: string, name: string) => {
    if (confirm(`确定彻底删除用户“${name}”吗？此操作不可逆！`)) {
      setUsers(users.filter(u => u.id !== id));
      setSelectedUserIds(selectedUserIds.filter(uid => uid !== id));
      showToast(`用户“${name}”已被安全注销`);
    }
  };

  const handleSaveSingleQuota = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!quotaUser) return;
    setUsers(users.map(u => u.id === quotaUser.id ? { ...u, quota: singleQuotaValue } : u));
    setIsQuotaOpen(false);
    setQuotaUser(null);
    showToast(`成功调整用户“${quotaUser.name}”的算力配额为 ${singleQuotaValue}M`);
  };

  // Bulk Operations Simulation
  const handleExecuteBulkAction = () => {
    if (selectedUserIds.length === 0 || !bulkActionType) return;
    
    let detail = '';
    const updatedUsers = users.map(u => {
      if (selectedUserIds.includes(u.id)) {
        if (bulkActionType === 'status_enable') return { ...u, status: '正常' as const };
        if (bulkActionType === 'status_disable') return { ...u, status: '禁用' as const };
        if (bulkActionType === 'adjust_quota') return { ...u, quota: bulkQuotaValue };
        if (bulkActionType === 'adjust_role') return { ...u, role: bulkRoleValue };
      }
      return u;
    });

    if (bulkActionType === 'status_enable') detail = '批量启用账号正常访问权限';
    if (bulkActionType === 'status_disable') detail = '批量强制冻结与拦截账号访问';
    if (bulkActionType === 'reset_pwd') detail = '重置登录初始密码为 123456';
    if (bulkActionType === 'adjust_quota') detail = `调整算力Token配额为 ${bulkQuotaValue}M`;
    if (bulkActionType === 'adjust_role') detail = `将权限角色批量变更为 [${bulkRoleValue}]`;

    // Log the event
    const newLog = {
      id: 'L' + Math.floor(100 + Math.random() * 900),
      time: new Date().toLocaleString('zh-CN', { hour12: false }).replace(/-/g, '/'),
      type: detail,
      targets: selectedUserIds.join(', '),
      detail: `成功对 ${selectedUserIds.length} 个账号执行操作`,
      reversible: bulkActionType !== 'reset_pwd', // Password reset cannot be undone in this simulation
      status: '已生效',
      // Backup for rollback
      backup: users.filter(u => selectedUserIds.includes(u.id))
    };

    setUsers(updatedUsers);
    setOperationLogs([newLog, ...operationLogs]);
    setIsBulkActionOpen(false);
    setSelectedUserIds([]);
    showToast(`批量操作成功！已同步记录至日志`);
  };

  const handleRollbackLog = (logId: string) => {
    const targetLog = operationLogs.find(l => l.id === logId);
    if (!targetLog || !targetLog.backup) return;

    // Restore backups
    const backups: UserItem[] = targetLog.backup;
    setUsers(users.map(u => {
      const backupItem = backups.find(b => b.id === u.id);
      return backupItem ? backupItem : u;
    }));

    setOperationLogs(operationLogs.map(l => l.id === logId ? { ...l, status: '已撤销', reversible: false } : l));
    showToast('批量操作已成功回滚撤销，数据已恢复原状');
  };

  // Import flow simulator
  const handleStartImportVerification = () => {
    if (!importFile) return;
    setImportStep(2); // Validating step
    
    setTimeout(() => {
      // Create random errors
      const errors = [];
      let successCount = 0;
      if (importFile.name.includes('error')) {
        errors.push({ line: 3, field: '邮箱', value: 'liuhua.edu', error: '邮箱格式不符合规范' });
        errors.push({ line: 5, field: '手机号', value: '13800138', error: '手机号位数不足11位' });
        errors.push({ line: 8, field: '姓名', value: '', error: '姓名必填项缺失' });
        successCount = 5;
      } else {
        successCount = 8;
      }

      setImportErrors(errors);
      setImportSuccessCount(successCount);
      setImportStep(3); // Result step
    }, 1500);
  };

  const handleConfirmImportData = () => {
    // Simulating writing imported entries to user list
    const importedUsers: UserItem[] = [];
    for (let i = 0; i < importSuccessCount; i++) {
      importedUsers.push({
        id: '20268' + Math.floor(10000 + Math.random() * 90000),
        name: `导入考生_${i+1}`,
        phone: `135${Math.floor(10000000 + Math.random() * 90000000)}`,
        email: `import.user_${i+1}@zhiyun.edu`,
        role: '学生',
        status: '正常',
        lastLogin: '-',
        duration: 0,
        quota: 300,
        regDate: new Date().toISOString().split('T')[0]
      });
    }

    setUsers([...importedUsers, ...users]);
    setImportStep(4); // Success step
    showToast(`增量导入成功！追加了 ${importSuccessCount} 名选课考生`);
  };

  // Export Flow
  const handleTriggerExport = () => {
    showToast('筛选用户数据已汇聚，正在生成 Excel 包...');
    setTimeout(() => {
      setIsExportOpen(false);
      showToast('Excel 文件生成完毕，已触发自动下载！');
    }, 1500);
  };

  return (
    <div className="space-y-6 pb-12 relative">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[200] flex items-center gap-2 px-5 py-2.5 bg-white border border-neutral-200 rounded-xl shadow-xl animate-in slide-in-from-top-4">
          {toast.type === 'success' ? (
            <ShieldCheck className="w-5 h-5 text-emerald-500" />
          ) : (
            <AlertTriangle className="w-5 h-5 text-red-500" />
          )}
          <span className="text-sm font-bold text-neutral-800">{toast.message}</span>
        </div>
      )}

      {/* Header and Master Operations */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-4 gap-4">
        <div className="flex items-end gap-4">
          <h1 className="text-xl font-bold text-neutral-900">用户管理</h1>
          <p className="text-sm text-neutral-500 mb-0.5">支持完整学生/教师账号管理、算力配额调整与 Excel 双向导入导出</p>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="flex border-b border-neutral-200 mt-2">
        <button
          onClick={() => { setActiveTab('student'); setSelectedUserIds([]); }}
          className={cn(
            "flex items-center gap-2 px-5 pb-3 text-sm font-bold border-b-2 transition-all",
            activeTab === 'student'
              ? "text-[#fa541c] border-[#fa541c]"
              : "text-neutral-500 border-transparent hover:text-neutral-800"
          )}
        >
          <User className="w-4 h-4" />
          学生账号库 ({users.filter(u => u.role === '学生').length}人)
        </button>
        <button
          onClick={() => { setActiveTab('teacher'); setSelectedUserIds([]); }}
          className={cn(
            "flex items-center gap-2 px-5 pb-3 text-sm font-bold border-b-2 transition-all",
            activeTab === 'teacher'
              ? "text-[#fa541c] border-[#fa541c]"
              : "text-neutral-500 border-transparent hover:text-neutral-800"
          )}
        >
          <Users className="w-4 h-4" />
          教师与协作团队 ({users.filter(u => u.role !== '学生').length}人)
        </button>
      </div>

      {/* Main List Table (Question management flat card style) */}
      <div className="bg-white rounded border border-neutral-200 overflow-hidden">
        {/* Search and Filters Toolbar (Inside card container, matching TeacherQuestions) */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 px-6 py-4 border-b border-neutral-200/50">
          
          {/* Left side: Merged search, status, and date filters */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Merged search input */}
            <div className="relative w-72">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input 
                type="text" 
                placeholder="搜索姓名、手机号..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-4 py-2 w-full bg-white border border-neutral-200 rounded-full text-sm focus:outline-none focus:border-[#fa541c] focus:ring-1 focus:ring-[#fa541c] text-neutral-800 transition-all placeholder:text-neutral-400"
              />
            </div>

            {/* Status Filter */}
            <div className="relative w-36">
              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="w-full text-xs border border-neutral-200 rounded-lg pl-3 pr-8 py-2 focus:outline-none focus:border-[#fa541c] appearance-none bg-white text-neutral-700 font-bold"
              >
                <option value="all">所有状态</option>
                <option value="正常">正常正常</option>
                <option value="禁用">禁用账号</option>
              </select>
              <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
            </div>

            {/* Date Filter */}
            <div className="relative w-36">
              <select 
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value as any)}
                className="w-full text-xs border border-neutral-200 rounded-lg pl-3 pr-8 py-2 focus:outline-none focus:border-[#fa541c] appearance-none bg-white text-neutral-700 font-bold"
              >
                <option value="all">注册时间</option>
                <option value="week">本周注册</option>
                <option value="month">本月注册</option>
                <option value="year">本学期注册</option>
              </select>
              <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
            </div>
          </div>

          {/* Right side: Bulk Action Indicator & Action Buttons */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto md:justify-end">
            {/* Bulk action selection - Shows only when checkboxes are ticked */}
            {selectedUserIds.length > 0 && (
              <div className="flex items-center gap-2 bg-orange-50 px-3 py-1.5 rounded-lg border border-orange-200 animate-slide-up">
                <span className="text-xs font-bold text-orange-700">已选中 {selectedUserIds.length} 个账号</span>
                <div className="w-px h-4 bg-orange-200"></div>
                <select
                  onChange={(e) => {
                    const action = e.target.value as any;
                    if(action) {
                      setBulkActionType(action);
                      setIsBulkActionOpen(true);
                      e.target.value = '';
                    }
                  }}
                  className="text-xs font-bold bg-transparent text-[#fa541c] focus:outline-none cursor-pointer"
                >
                  <option value="">-- 选择批量操作 --</option>
                  <option value="status_enable">批量启用账号</option>
                  <option value="status_disable">批量禁用账号</option>
                  <option value="reset_pwd">批量重置密码</option>
                  <option value="adjust_quota">批量调整AI配额</option>
                  <option value="adjust_role">批量变更角色</option>
                </select>
              </div>
            )}

            <Button 
              onClick={() => setIsImportOpen(true)}
              variant="outline" 
              className="flex items-center gap-1.5 h-9 bg-white border-neutral-200 text-neutral-600 rounded-[4px] shadow-sm hover:text-[#fa541c] hover:border-[#fa541c] text-xs font-medium px-3.5 cursor-pointer transition-colors"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" /> 批量导入
            </Button>
            <Button 
              onClick={() => setIsExportOpen(true)}
              variant="outline" 
              className="flex items-center gap-1.5 h-9 bg-white border-neutral-200 text-neutral-600 rounded-[4px] shadow-sm hover:text-[#fa541c] hover:border-[#fa541c] text-xs font-medium px-3.5 cursor-pointer transition-colors"
            >
              <Download className="w-3.5 h-3.5" /> 批量导出
            </Button>
            <Button 
              onClick={() => setIsAddUserOpen(true)}
              className="bg-[#fa541c] hover:bg-[#e84a15] text-white flex items-center gap-1.5 shadow-sm h-9 rounded-[4px] text-xs font-semibold cursor-pointer border-0 px-3.5 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" /> 新建用户
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="border-b border-neutral-200 bg-neutral-50/50 text-[13px] text-neutral-600 font-semibold select-none">
                <th className="pl-6 pr-3 py-3.5 font-medium w-12 text-left">
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
                <th className="px-3 py-3.5 font-medium text-left">基本信息</th>
                <th className="px-3 py-3.5 font-medium text-left">手机号</th>
                <th className="px-3 py-3.5 font-medium text-left">邮箱</th>
                <th className="px-3 py-3.5 font-medium text-left">角色类型</th>
                <th className="px-3 py-3.5 font-medium text-left">状态</th>
                <th className="px-3 py-3.5 font-medium text-left">最后登录时间</th>
                <th className="px-3 py-3.5 font-medium text-left">综合学习时长</th>
                <th className="pl-3 pr-6 py-3.5 font-medium text-left">操作入口</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map(u => (
                  <tr key={u.id} className="border-b border-neutral-100 hover:bg-neutral-50/30 transition-colors group text-[13px]">
                    <td className="pl-6 pr-3 py-3 text-left">
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
                    <td className="px-3 py-3 text-left">
                      <div className="font-bold text-neutral-800 flex items-center gap-1.5">
                        {u.name}
                        {u.quota > 1000 && <span className="px-1.5 py-0.5 bg-purple-50 border border-purple-200 text-purple-600 rounded text-[9px] font-bold">高配额</span>}
                      </div>
                      <div className="text-[11px] text-neutral-400 font-mono mt-0.5">{u.id}</div>
                    </td>
                    <td className="px-3 py-3 text-left text-neutral-700 font-mono font-medium">{u.phone}</td>
                    <td className="px-3 py-3 text-left text-neutral-600 font-medium">{u.email}</td>
                    <td className="px-3 py-3 text-left text-neutral-800">
                      <span className="flex items-center gap-1">
                        <Shield className="w-3.5 h-3.5 text-neutral-400" />
                        {u.role}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-left">
                      <span className={cn(
                        "px-2 py-0.5 text-[11px] font-bold rounded border",
                        u.status === '正常' ? "bg-green-50 text-green-600 border-green-200" : "bg-neutral-50 text-neutral-500 border-neutral-200"
                      )}>
                        {u.status}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-left text-neutral-500 font-mono">{u.lastLogin}</td>
                    <td className="px-3 py-3 text-left text-neutral-700 font-bold font-mono">{u.duration} 小时</td>
                    <td className="pl-3 pr-6 py-3 text-left">
                      <div className="flex items-center justify-start gap-3">
                        <button 
                          onClick={() => { setSelectedUser(u); setIsDetailUserOpen(true); }}
                          className="text-[#fa541c] hover:text-[#e84a15] font-bold text-xs transition-colors cursor-pointer bg-transparent border-0 p-0"
                        >
                          查看
                        </button>
                        <button 
                          onClick={() => { setEditingUser(u); setIsEditUserOpen(true); }}
                          className="text-[#fa541c] hover:text-[#e84a15] font-bold text-xs transition-colors cursor-pointer bg-transparent border-0 p-0"
                        >
                          编辑
                        </button>
                        <button 
                          onClick={() => { setQuotaUser(u); setSingleQuotaValue(u.quota); setIsQuotaOpen(true); }}
                          className="text-[#fa541c] hover:text-[#e84a15] font-bold text-xs transition-colors cursor-pointer bg-transparent border-0 p-0"
                        >
                          调整配额
                        </button>
                        <button 
                          onClick={() => handleToggleSingleStatus(u.id, u.status)}
                          className="text-[#fa541c] hover:text-[#e84a15] font-bold text-xs transition-colors cursor-pointer bg-transparent border-0 p-0"
                        >
                          {u.status === '正常' ? '禁用' : '启用'}
                        </button>
                        <button 
                          onClick={() => handleDeleteSingleUser(u.id, u.name)}
                          className="text-[#fa541c] hover:text-[#e84a15] font-bold text-xs transition-colors cursor-pointer bg-transparent border-0 p-0"
                        >
                          删除
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={9} className="p-12 text-center text-neutral-400">暂无符合筛选条件的用户数据</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer/Pagination for active Tab - styled exactly like TeacherQuestions */}
        <div className="flex items-center justify-end p-4 border-t border-neutral-100 gap-4 mt-2">
          <span className="text-[13px] text-neutral-500">
            共 {filteredUsers.length} 条
          </span>
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



      {/* Modal 1: Add User Modal */}
      {isAddUserOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in">
          <form onSubmit={handleSaveAddUser} className="bg-white rounded-2xl shadow-xl w-full max-w-[500px] overflow-hidden border border-neutral-200 flex flex-col">
            <div className="p-5 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/50">
              <h2 className="text-[15px] font-black text-neutral-900 flex items-center gap-2">
                <Plus className="w-5 h-5 text-[#fa541c]" /> 新建用户账号
              </h2>
              <button type="button" onClick={() => setIsAddUserOpen(false)} className="text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 p-1.5 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-[12px] font-bold text-neutral-800 block">姓名 <span className="text-[#fa541c]">*</span></label>
                <input name="name" type="text" placeholder="输入用户真实姓名" required className="w-full border border-neutral-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-[#fa541c]" />
              </div>
              <div className="space-y-1">
                <label className="text-[12px] font-bold text-neutral-800 block">手机号 <span className="text-[#fa541c]">*</span></label>
                <input name="phone" type="tel" placeholder="输入11位手机号" required className="w-full border border-neutral-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-[#fa541c]" />
              </div>
              <div className="space-y-1">
                <label className="text-[12px] font-bold text-neutral-800 block">电子邮箱 <span className="text-[#fa541c]">*</span></label>
                <input name="email" type="email" placeholder="例如 format@zhiyun.edu" required className="w-full border border-neutral-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-[#fa541c]" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[12px] font-bold text-neutral-800 block">角色权限</label>
                  <select name="role" defaultValue="学生" className="w-full border border-neutral-200 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-[#fa541c] bg-white font-bold text-neutral-700">
                    <option value="学生">学生选课账号</option>
                    <option value="教师">协作授课教师</option>
                    <option value="管理员">平台管理员</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[12px] font-bold text-neutral-800 block">AI 算力配额 (M)</label>
                  <input name="quota" type="number" defaultValue="300" placeholder="大语言模型额度" className="w-full border border-neutral-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-[#fa541c]" />
                </div>
              </div>
            </div>

            <div className="p-5 border-t border-neutral-100 bg-neutral-50/20 flex items-center justify-end gap-3">
              <Button type="button" onClick={() => setIsAddUserOpen(false)} variant="outline" className="border-neutral-200 text-neutral-600 font-bold h-9 px-5 rounded-xl text-xs">
                取消
              </Button>
              <Button type="submit" className="bg-[#fa541c] hover:bg-[#e84a15] text-white font-bold h-9 px-6 rounded-xl shadow-md shadow-orange-500/10 text-xs">
                确认创建
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Modal 2: Edit User Modal */}
      {isEditUserOpen && editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in">
          <form onSubmit={handleSaveEditUser} className="bg-white rounded-2xl shadow-xl w-full max-w-[500px] overflow-hidden border border-neutral-200 flex flex-col">
            <div className="p-5 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/50">
              <h2 className="text-[15px] font-black text-neutral-900 flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-[#fa541c]" /> 编辑用户基本信息
              </h2>
              <button type="button" onClick={() => { setIsEditUserOpen(false); setEditingUser(null); }} className="text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 p-1.5 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-[12px] font-bold text-neutral-800 block">姓名</label>
                <input name="name" type="text" defaultValue={editingUser.name} required className="w-full border border-neutral-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-[#fa541c]" />
              </div>
              <div className="space-y-1">
                <label className="text-[12px] font-bold text-neutral-800 block">手机号</label>
                <input name="phone" type="tel" defaultValue={editingUser.phone} required className="w-full border border-neutral-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-[#fa541c]" />
              </div>
              <div className="space-y-1">
                <label className="text-[12px] font-bold text-neutral-800 block">电子邮箱</label>
                <input name="email" type="email" defaultValue={editingUser.email} required className="w-full border border-neutral-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-[#fa541c]" />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1 col-span-2">
                  <label className="text-[12px] font-bold text-neutral-800 block">角色权限</label>
                  <select name="role" defaultValue={editingUser.role} className="w-full border border-neutral-200 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-[#fa541c] bg-white font-bold text-neutral-700">
                    <option value="学生">学生选课账号</option>
                    <option value="教师">协作授课教师</option>
                    <option value="管理员">平台管理员</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[12px] font-bold text-neutral-800 block">账号状态</label>
                  <select name="status" defaultValue={editingUser.status} className="w-full border border-neutral-200 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-[#fa541c] bg-white font-bold text-neutral-700">
                    <option value="正常">正常正常</option>
                    <option value="禁用">禁用冻结</option>
                  </select>
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[12px] font-bold text-neutral-800 block">AI 算力配额 (M)</label>
                <input name="quota" type="number" defaultValue={editingUser.quota} className="w-full border border-neutral-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-[#fa541c]" />
              </div>
            </div>

            <div className="p-5 border-t border-neutral-100 bg-neutral-50/20 flex items-center justify-end gap-3">
              <Button type="button" onClick={() => { setIsEditUserOpen(false); setEditingUser(null); }} variant="outline" className="border-neutral-200 text-neutral-600 font-bold h-9 px-5 rounded-xl text-xs">
                取消
              </Button>
              <Button type="submit" className="bg-[#fa541c] hover:bg-[#e84a15] text-white font-bold h-9 px-6 rounded-xl shadow-md shadow-orange-500/10 text-xs">
                更新保存
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Modal 3: View Details Modal */}
      {isDetailUserOpen && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-[550px] overflow-hidden border border-neutral-200 flex flex-col">
            <div className="p-5 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/50">
              <h2 className="text-[15px] font-black text-neutral-900 flex items-center gap-2">
                <Eye className="w-5 h-5 text-indigo-500" /> 用户完整详情面板
              </h2>
              <button onClick={() => { setIsDetailUserOpen(false); setSelectedUser(null); }} className="text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 p-1.5 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Profile Card Header */}
              <div className="flex items-center gap-4 bg-neutral-50 p-4 rounded-xl border border-neutral-200/50">
                <div className="w-14 h-14 rounded-full bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600 font-bold text-xl shadow-sm">
                  {selectedUser.name.charAt(0)}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[16px] font-black text-neutral-900">{selectedUser.name}</span>
                    <span className={cn(
                      "px-2 py-0.5 text-[10px] font-bold rounded",
                      selectedUser.status === '正常' ? "bg-green-50 text-green-600 border border-green-200" : "bg-neutral-50 text-neutral-500 border border-neutral-200"
                    )}>
                      账号{selectedUser.status}
                    </span>
                  </div>
                  <div className="text-xs text-neutral-400 font-mono">系统识别号: {selectedUser.id}</div>
                </div>
              </div>

              {/* Detail fields */}
              <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-xs border-b border-neutral-100 pb-5">
                <div>
                  <span className="text-neutral-400 block mb-1">手机号码</span>
                  <span className="text-neutral-800 font-bold font-mono">{selectedUser.phone}</span>
                </div>
                <div>
                  <span className="text-neutral-400 block mb-1">电子邮箱</span>
                  <span className="text-neutral-800 font-bold">{selectedUser.email}</span>
                </div>
                <div>
                  <span className="text-neutral-400 block mb-1">角色类型</span>
                  <span className="text-neutral-800 font-bold flex items-center gap-1">
                    <Shield className="w-3.5 h-3.5 text-[#fa541c]" /> {selectedUser.role}
                  </span>
                </div>
                <div>
                  <span className="text-neutral-400 block mb-1">注册加入时间</span>
                  <span className="text-neutral-800 font-bold font-mono">{selectedUser.regDate}</span>
                </div>
                <div>
                  <span className="text-neutral-400 block mb-1">大语言模型AI配额</span>
                  <span className="text-neutral-800 font-bold flex items-center gap-1">
                    <Cpu className="w-3.5 h-3.5 text-purple-500" /> {selectedUser.quota} M
                  </span>
                </div>
                <div>
                  <span className="text-neutral-400 block mb-1">最后登录系统时间</span>
                  <span className="text-neutral-800 font-bold font-mono">{selectedUser.lastLogin}</span>
                </div>
              </div>

              {/* Simulation Charts/Stats */}
              <div className="space-y-2.5">
                <h4 className="font-bold text-neutral-800 text-xs">综合学习与实验学时统计</h4>
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200/50 text-center">
                    <span className="text-[10px] text-neutral-400 block">累计总时长</span>
                    <strong className="text-base font-black text-neutral-800 mt-1 block">{selectedUser.duration}h</strong>
                  </div>
                  <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200/50 text-center">
                    <span className="text-[10px] text-neutral-400 block">本周在线频次</span>
                    <strong className="text-base font-black text-[#fa541c] mt-1 block">8 次</strong>
                  </div>
                  <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200/50 text-center">
                    <span className="text-[10px] text-neutral-400 block">实训课件覆盖率</span>
                    <strong className="text-base font-black text-green-600 mt-1 block">92.5%</strong>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-5 border-t border-neutral-100 bg-neutral-50/10 flex items-center justify-end">
              <Button onClick={() => { setIsDetailUserOpen(false); setSelectedUser(null); }} className="bg-[#fa541c] hover:bg-[#e84a15] text-white font-bold h-9 px-6 rounded-xl text-xs">
                关闭看板
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 4: Bulk Action Confirmation Dialog (Safety double confirmation) */}
      {isBulkActionOpen && bulkActionType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-[480px] overflow-hidden border border-neutral-200 flex flex-col">
            <div className="p-5 border-b border-neutral-100 bg-orange-50/30 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-[#fa541c]" />
              <h2 className="text-[15px] font-black text-neutral-900">批量敏感操作二次确认安全校验</h2>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="p-3.5 bg-neutral-50 rounded-xl border border-neutral-200/80 text-xs text-neutral-600 space-y-2 leading-relaxed">
                <span>您当前已选中了 <strong className="text-[#fa541c] font-black">{selectedUserIds.length}</strong> 个用户账号。</span>
                <span className="block">正在准备执行操作：
                  <strong className="text-neutral-800 bg-neutral-200 px-2 py-0.5 rounded ml-1 font-bold">
                    {bulkActionType === 'status_enable' && '批量恢复启用正常权限'}
                    {bulkActionType === 'status_disable' && '批量封禁冻结账号（禁用）'}
                    {bulkActionType === 'reset_pwd' && '重置登录初始密码'}
                    {bulkActionType === 'adjust_quota' && '调整大模型AI Token额度'}
                    {bulkActionType === 'adjust_role' && '变更权限角色'}
                  </strong>
                </span>
              </div>

              {/* Parameters setting based on action type */}
              {bulkActionType === 'adjust_quota' && (
                <div className="space-y-1.5 p-3.5 bg-purple-50/30 border border-purple-200 rounded-xl">
                  <label className="text-[12px] font-bold text-neutral-700 block">统一配额设定值 (M)</label>
                  <input 
                    type="number" 
                    value={bulkQuotaValue}
                    onChange={(e) => setBulkQuotaValue(Number(e.target.value))}
                    className="w-full border border-neutral-200 rounded-xl px-4 py-2.5 text-xs bg-white focus:outline-none" 
                  />
                  <span className="text-[10px] text-neutral-400 mt-1 block">配额单位为M（兆 Token/Token），代表大模型最大使用资源边界</span>
                </div>
              )}

              {bulkActionType === 'adjust_role' && (
                <div className="space-y-1.5 p-3.5 bg-blue-50/30 border border-blue-200 rounded-xl">
                  <label className="text-[12px] font-bold text-neutral-700 block">选择目标合并角色</label>
                  <select 
                    value={bulkRoleValue}
                    onChange={(e) => setBulkRoleValue(e.target.value as any)}
                    className="w-full border border-neutral-200 rounded-xl px-3 py-2.5 text-xs focus:outline-none bg-white font-bold text-neutral-700"
                  >
                    <option value="学生">学生选课账号</option>
                    <option value="教师">协同授课教师</option>
                  </select>
                </div>
              )}

              {bulkActionType === 'reset_pwd' && (
                <div className="p-3.5 bg-red-50/30 border border-red-200 text-red-600 rounded-xl text-[11px] leading-relaxed flex items-start gap-2">
                  <Lock className="w-4 h-4 shrink-0 mt-0.5" />
                  <span><strong>安全警告：</strong> 重置密码操作为不可回滚项。操作成功后，这 {selectedUserIds.length} 个账号的登录密码将全数被重置为标准默认密码 `123456`，请确认！</span>
                </div>
              )}
            </div>

            <div className="p-5 border-t border-neutral-100 bg-neutral-50/30 flex items-center justify-end gap-3">
              <Button onClick={() => { setIsBulkActionOpen(false); setBulkActionType(null); }} variant="outline" className="border-neutral-200 text-neutral-600 font-bold h-9 px-5 rounded-xl text-xs">
                取消执行
              </Button>
              <Button 
                onClick={handleExecuteBulkAction}
                className="bg-[#fa541c] hover:bg-[#e84a15] text-white font-bold h-9 px-6 rounded-xl shadow-md shadow-orange-500/10 text-xs"
              >
                确认并立即执行
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 5: Excel Import Dialog */}
      {isImportOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-[560px] overflow-hidden border border-neutral-200 flex flex-col">
            <div className="p-5 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/50">
              <h2 className="text-[15px] font-black text-neutral-900 flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-green-600" /> Excel 标准模板批量导入
              </h2>
              <button 
                onClick={() => { setIsImportOpen(false); setImportStep(1); setImportFile(null); setImportErrors([]); }} 
                className="text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 p-1.5 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 flex-1 overflow-y-auto">
              
              {/* Stepper Progress bar */}
              <div className="flex items-center justify-between mb-8 text-xs font-bold text-neutral-400 relative">
                <div className="absolute top-1/2 left-4 right-4 h-0.5 bg-neutral-100 -translate-y-1/2 z-0"></div>
                
                <div className={cn("z-10 bg-white px-3 flex items-center gap-1.5", importStep >= 1 ? "text-[#fa541c]" : "")}>
                  <span className={cn("w-5 h-5 rounded-full flex items-center justify-center border-2 text-[10px]", importStep >= 1 ? "border-[#fa541c] bg-[#fff2e8]" : "border-neutral-300")}>1</span>
                  下载/选择模板
                </div>
                
                <div className={cn("z-10 bg-white px-3 flex items-center gap-1.5", importStep >= 2 ? "text-[#fa541c]" : "")}>
                  <span className={cn("w-5 h-5 rounded-full flex items-center justify-center border-2 text-[10px]", importStep >= 2 ? "border-[#fa541c] bg-[#fff2e8]" : "border-neutral-300")}>2</span>
                  数据校验
                </div>

                <div className={cn("z-10 bg-white px-3 flex items-center gap-1.5", importStep >= 3 ? "text-[#fa541c]" : "")}>
                  <span className={cn("w-5 h-5 rounded-full flex items-center justify-center border-2 text-[10px]", importStep >= 3 ? "border-[#fa541c] bg-[#fff2e8]" : "border-neutral-300")}>3</span>
                  校验反馈
                </div>

                <div className={cn("z-10 bg-white px-3 flex items-center gap-1.5", importStep >= 4 ? "text-green-600" : "")}>
                  <span className={cn("w-5 h-5 rounded-full flex items-center justify-center border-2 text-[10px]", importStep >= 4 ? "border-green-600 bg-green-50" : "border-neutral-300")}>4</span>
                  导入成功
                </div>
              </div>

              {/* Step 1: Upload Panel */}
              {importStep === 1 && (
                <div className="space-y-5">
                  <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200/60 flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-neutral-800">标准用户信息 Excel 录入模板</h4>
                      <p className="text-[10px] text-neutral-400 mt-0.5">包含姓名、手机号、邮箱、角色（教师/学生/管理员）的标准规范表格</p>
                    </div>
                    <Button 
                      variant="outline" 
                      onClick={() => showToast('标准 Excel 导入模板下载成功！')}
                      className="border-neutral-200 text-neutral-600 rounded-xl h-8 text-[11px] font-bold px-3.5 bg-white cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5 mr-1" /> 点击下载模板
                    </Button>
                  </div>

                  <div className="border-2 border-dashed border-neutral-200 rounded-xl p-8 text-center bg-neutral-50/30 hover:bg-neutral-50 transition-colors relative">
                    <input 
                      type="file" 
                      accept=".xls,.xlsx"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          setImportFile(e.target.files[0]);
                        }
                      }}
                      className="absolute inset-0 opacity-0 cursor-pointer" 
                    />
                    <FileSpreadsheet className="w-10 h-10 text-green-600 mx-auto opacity-70 mb-3" />
                    <h5 className="text-xs font-bold text-neutral-800">拖拽文件至此 或 点击上传标准 Excel 表</h5>
                    <p className="text-[10px] text-neutral-400 mt-1">支持扩展名为 .xls 或 .xlsx 的电子表格文档</p>
                    
                    {importFile && (
                      <div className="mt-4 p-2 bg-[#fff2e8] border border-[#ffbb96] text-[#fa541c] text-xs font-bold rounded-lg w-fit mx-auto flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5" /> 已选中: {importFile.name} ({Math.round(importFile.size / 1024)} KB)
                      </div>
                    )}
                  </div>
                  
                  {/* Test Data Hint buttons (to simulate validation features) */}
                  <div className="p-3 bg-blue-50/50 border border-blue-200 text-blue-800 text-[11px] rounded-xl leading-relaxed">
                    <strong>💡 交互演示提示：</strong>
                    <span className="block mt-1">1. 上传一个标准文件名（非“error”字样）的文件，可点击下一步体验<strong>“一键全部导入成功”</strong>流程。</span>
                    <span className="block mt-1">2. 上传一个文件名包含<strong>“error”</strong>字样的文件，可点击下一步体验<strong>“数据格式校验报错与修正流程”</strong>。</span>
                  </div>
                </div>
              )}

              {/* Step 2: Validating */}
              {importStep === 2 && (
                <div className="p-12 text-center space-y-4">
                  <div className="w-12 h-12 rounded-full border-4 border-[#fa541c] border-t-transparent animate-spin mx-auto"></div>
                  <h4 className="text-xs font-bold text-neutral-800">AI 算力引擎正在进行格式与合规性校验...</h4>
                  <p className="text-[10px] text-neutral-400">正在检索教育局统一认证邮箱真实度、防多设备绑定查重以及手机号位数规范...</p>
                </div>
              )}

              {/* Step 3: Verification Feedback Result */}
              {importStep === 3 && (
                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-neutral-800">校验分析报告明细：</h4>
                    <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      通过数据：{importSuccessCount} 条
                    </span>
                  </div>

                  {importErrors.length > 0 ? (
                    <div className="space-y-3">
                      {/* Alert banner */}
                      <div className="p-3 bg-red-50 text-red-700 border border-red-200 rounded-xl text-[11px] flex items-start gap-2 leading-relaxed">
                        <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                        <div>
                          <strong>校验报警：</strong> 检测到有 <strong className="font-black">{importErrors.length}</strong> 条错误异常格式数据，已为您拦截。您可以选择“剔除错误并强行导入合法数据”，或在原始表格修正后重新导入。
                        </div>
                      </div>

                      {/* Error data list */}
                      <div className="border border-neutral-200 rounded-xl overflow-hidden max-h-48 overflow-y-auto">
                        <table className="w-full text-left text-[11px] border-collapse">
                          <thead>
                            <tr className="bg-neutral-50 border-b border-neutral-200 font-bold text-neutral-600">
                              <th className="p-2.5 text-center w-12">表格行</th>
                              <th className="p-2.5">违规字段</th>
                              <th className="p-2.5">填报异常原值</th>
                              <th className="p-2.5">校验拦截原因</th>
                            </tr>
                          </thead>
                          <tbody>
                            {importErrors.map((err, idx) => (
                              <tr key={idx} className="border-b border-neutral-100 hover:bg-neutral-50 text-neutral-700">
                                <td className="p-2.5 text-center font-mono font-bold text-neutral-400">{err.line}</td>
                                <td className="p-2.5 font-bold text-neutral-800">{err.field}</td>
                                <td className="p-2.5 font-mono text-red-500">{err.value || '(空)'}</td>
                                <td className="p-2.5 font-medium text-red-600">{err.error}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ) : (
                    <div className="p-8 text-center bg-emerald-50/30 border border-emerald-200 rounded-xl space-y-2.5">
                      <ShieldCheck className="w-10 h-10 text-emerald-500 mx-auto" />
                      <h5 className="text-xs font-bold text-emerald-800">校验通过！Excel 格式与信息查重 100% 合格</h5>
                      <p className="text-[10px] text-neutral-400">已成功拦截全部潜在空列，即将为系统增量追加 {importSuccessCount} 条学生数据</p>
                    </div>
                  )}
                </div>
              )}

              {/* Step 4: Success confirmation */}
              {importStep === 4 && (
                <div className="p-8 text-center space-y-4">
                  <div className="w-12 h-12 bg-green-50 border border-green-200 text-green-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
                    <Check className="w-6 h-6" strokeWidth={3} />
                  </div>
                  <h4 className="text-sm font-black text-neutral-800">Excel 批量增量导入全部完成！</h4>
                  <p className="text-xs text-neutral-500 max-w-sm mx-auto leading-relaxed">
                    成功增量添加了 <strong className="text-green-600 font-black">{importSuccessCount}</strong> 名学生账号。对应 AI 实训额度均已初始化完毕，可立刻用于分配实验与期中/期末考试考卷！
                  </p>
                </div>
              )}

            </div>

            {/* Footer Buttons for Import flow step-by-step navigation */}
            <div className="p-5 border-t border-neutral-100 bg-neutral-50/20 flex items-center justify-end gap-3">
              {importStep === 1 && (
                <>
                  <Button onClick={() => setIsImportOpen(false)} variant="outline" className="border-neutral-200 text-neutral-600 font-bold h-9 px-5 rounded-xl text-xs">
                    取消
                  </Button>
                  <Button 
                    onClick={handleStartImportVerification}
                    disabled={!importFile}
                    className="bg-[#fa541c] hover:bg-[#e84a15] text-white font-bold h-9 px-6 rounded-xl shadow-md shadow-orange-500/10 text-xs cursor-pointer"
                  >
                    校验并进入下一步
                  </Button>
                </>
              )}

              {importStep === 3 && (
                <>
                  <Button 
                    onClick={() => { setImportStep(1); setImportFile(null); setImportErrors([]); }} 
                    variant="outline" 
                    className="border-neutral-200 text-[#fa541c] hover:bg-orange-50/40 rounded-xl h-9 text-xs font-bold px-4 cursor-pointer"
                  >
                    修正数据后重新导入
                  </Button>
                  <Button 
                    onClick={handleConfirmImportData}
                    className="bg-[#fa541c] hover:bg-[#e84a15] text-white font-bold h-9 px-6 rounded-xl shadow-md shadow-orange-500/10 text-xs cursor-pointer"
                  >
                    确认将合法数据导入库
                  </Button>
                </>
              )}

              {importStep === 4 && (
                <Button 
                  onClick={() => { setIsImportOpen(false); setImportStep(1); setImportFile(null); setImportErrors([]); }} 
                  className="bg-[#fa541c] hover:bg-[#e84a15] text-white font-bold h-9 px-8 rounded-xl shadow-sm text-xs cursor-pointer"
                >
                  完成退出
                </Button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal 6: Export Fields Selector Modal */}
      {isExportOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-[480px] overflow-hidden border border-neutral-200 flex flex-col">
            <div className="p-5 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/50">
              <h2 className="text-[15px] font-black text-neutral-900 flex items-center gap-2">
                <Download className="w-5 h-5 text-[#fa541c]" /> 批量导出筛选用户数据
              </h2>
              <button onClick={() => setIsExportOpen(false)} className="text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 p-1.5 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="p-3.5 bg-neutral-50 rounded-xl border border-neutral-200/80 text-xs text-neutral-600 space-y-1 leading-relaxed">
                <span>根据您当前的左侧检索过滤器：</span>
                <span className="block font-bold text-neutral-800">
                  角色筛选: [{activeTab === 'student' ? '学生' : '教师与团队'}] · 当前过滤器下匹配条目: {filteredUsers.length} 条记录
                </span>
              </div>

              {/* Field checklist */}
              <div className="space-y-3">
                <label className="text-[12px] font-bold text-neutral-800 block">选择需要导出的 Excel 表数据列：</label>
                <div className="grid grid-cols-2 gap-3 p-4 border border-neutral-200 rounded-xl">
                  {Object.keys(exportFields).map((field) => {
                    const labelMap: any = {
                      name: '真实姓名', phone: '手机号码', email: '电子邮箱', role: '权限角色', status: '账号状态', duration: '累计学时', quota: 'AI 算力配额', regDate: '账号注册时间'
                    };
                    const isChecked = (exportFields as any)[field];
                    return (
                      <label key={field} className="flex items-center gap-2 text-xs font-bold text-neutral-700 cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={isChecked}
                          onChange={(e) => setExportFields({ ...exportFields, [field]: e.target.checked })}
                          className="w-4 h-4 rounded border-neutral-300 text-[#fa541c] focus:ring-[#fa541c]" 
                        />
                        {labelMap[field]}
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* File format selector */}
              <div className="space-y-1">
                <label className="text-[12px] font-bold text-neutral-800 block">选择导出电子表格格式</label>
                <select className="w-full border border-neutral-200 rounded-xl px-3 py-2.5 text-xs focus:outline-none bg-white font-bold text-neutral-700">
                  <option value="xlsx">标准微软格式 (.xlsx)</option>
                  <option value="csv">逗号分隔符兼容格式 (.csv)</option>
                </select>
              </div>
            </div>

            <div className="p-5 border-t border-neutral-100 bg-neutral-50/20 flex items-center justify-end gap-3">
              <Button onClick={() => setIsExportOpen(false)} variant="outline" className="border-neutral-200 text-neutral-600 font-bold h-9 px-5 rounded-xl text-xs">
                取消
              </Button>
              <Button 
                onClick={handleTriggerExport}
                className="bg-[#fa541c] hover:bg-[#e84a15] text-white font-bold h-9 px-6 rounded-xl shadow-md shadow-orange-500/10 text-xs"
              >
                生成并开始下载
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 7: Adjust Quota Modal */}
      {isQuotaOpen && quotaUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in">
          <form onSubmit={handleSaveSingleQuota} className="bg-white rounded-2xl shadow-xl w-full max-w-[420px] overflow-hidden border border-neutral-200 flex flex-col animate-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/50">
              <h2 className="text-[15px] font-black text-neutral-900 flex items-center gap-2">
                <Cpu className="w-5 h-5 text-[#fa541c]" /> 调整用户算力配额
              </h2>
              <button type="button" onClick={() => { setIsQuotaOpen(false); setQuotaUser(null); }} className="text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 p-1.5 rounded-full transition-colors cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="p-3.5 bg-neutral-50 rounded-xl border border-neutral-200/50 text-xs text-neutral-600 space-y-1">
                <div>用户姓名：<strong className="text-neutral-800">{quotaUser.name}</strong></div>
                <div>当前配额：<strong className="text-neutral-800">{quotaUser.quota} M</strong></div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[12px] font-bold text-[#fa541c] block">新算力配额值 (M)</label>
                <input 
                  type="number" 
                  value={singleQuotaValue}
                  onChange={(e) => setSingleQuotaValue(Number(e.target.value))}
                  className="w-full border border-neutral-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-[#fa541c] text-neutral-800" 
                />
                <span className="text-[10px] text-neutral-400 mt-1 block">配额单位为M（兆 Token），代表大模型最大使用资源边界</span>
              </div>
            </div>

            <div className="p-5 border-t border-neutral-100 bg-neutral-50/20 flex items-center justify-end gap-3">
              <Button type="button" onClick={() => { setIsQuotaOpen(false); setQuotaUser(null); }} variant="outline" className="border-neutral-200 text-neutral-600 font-bold h-9 px-5 rounded-xl text-xs">
                取消
              </Button>
              <Button type="submit" className="bg-[#fa541c] hover:bg-[#e84a15] text-white font-bold h-9 px-6 rounded-xl shadow-md shadow-orange-500/10 text-xs">
                确认调整
              </Button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}
