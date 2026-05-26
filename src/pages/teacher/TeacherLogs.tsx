import React, { useState } from 'react';
import { 
  FileText, Search, ChevronDown, Calendar, Download, Eye, X, 
  Info, Check, Clock, User, Settings, Database, BookOpen, FolderKanban,
  CheckCircle2, XCircle, AlertTriangle, RefreshCw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// --- Interface Types ---
interface LogItem {
  id: string;
  time: string;
  operator: string;
  operatorId: string;
  type: '课程管理' | '考试管理' | '资源管理' | '用户管理';
  action: string;
  target: string;
  result: '成功' | '失败';
  ip: string;
  userAgent: string;
  payload: string; // JSON or detailed text
}

export default function TeacherLogs() {
  const [activeTab, setActiveTab] = useState<'teacher' | 'student'>('teacher');
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'全部' | '课程管理' | '考试管理' | '资源管理' | '用户管理'>('全部');
  const [operatorSearch, setOperatorSearch] = useState('');
  const [timeRange, setTimeRange] = useState<'all' | 'today' | '3days' | '7days'>('all');

  // Export Progress Modal
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [exportFormat, setExportFormat] = useState<'Excel' | 'CSV'>('Excel');

  // Log Detail Modal
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedLog, setSelectedLog] = useState<LogItem | null>(null);

  // Toast Notification
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // --- Mock Databases ---

  // 1. Teacher-side Logs
  const [teacherLogs, setTeacherLogs] = useState<LogItem[]>([
    { id: 'TX-LOG-8001', time: '2026-05-26 14:30:12', operator: '张旭东 教授', operatorId: 'T1001', type: '课程管理', action: '课程公开上架申请', target: '深度学习进阶课程系统', result: '成功', ip: '192.168.1.105', userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Chrome/120.0.0.0', payload: '{"courseId": 204, "action": "request_public", "visibility": "tenant_public", "resources": {"gpu": 600, "cpu": 1200}}' },
    { id: 'TX-LOG-8002', time: '2026-05-26 11:20:05', operator: '王立强 讲师', operatorId: 'T1003', type: '用户管理', action: '批量调整配额', target: '人工智能1班 (共32人)', result: '成功', ip: '192.168.1.112', userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Edge/120.0.0.0', payload: '{"targetGroup": "class_ai_1", "studentCount": 32, "adjustAmount": "+100M", "resourceType": "LLM_Token"}' },
    { id: 'TX-LOG-8003', time: '2026-05-25 15:45:30', operator: '张旭东 教授', operatorId: 'T1001', type: '资源管理', action: '微调用户算力配额', target: '李华 (2026744502)', result: '成功', ip: '192.168.1.105', userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Chrome/120.0.0.0', payload: '{"studentName": "李华", "studentId": "2026744502", "oldQuota": "200M", "newQuota": "300M", "reason": "中期科研项目追加"}' },
    { id: 'TX-LOG-8004', time: '2026-05-25 09:12:44', operator: '陈明 助教', operatorId: 'T1005', type: '考试管理', action: '开启防作弊实时检测', target: '大模型应用开发期中测验', result: '成功', ip: '192.168.2.45', userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Safari/17.2.1', payload: '{"examId": "EXAM-908", "antiCheatOptions": {"monitorActive": true, "screenLock": true, "multiDeviceDetect": true}}' },
    { id: 'TX-LOG-8005', time: '2026-05-24 16:22:10', operator: '李瑞 讲师', operatorId: 'T1002', type: '课程管理', action: '删除草稿课程', target: 'PyTorch基础与模型实战 (DRAFT-44)', result: '成功', ip: '192.168.1.98', userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Chrome/120.0.0.0', payload: '{"courseDraftId": "DRAFT-44", "name": "PyTorch基础与模型实战", "deletedAt": "2026-05-24T16:22:10"}' },
    { id: 'TX-LOG-8006', time: '2026-05-23 10:05:15', operator: '系统主管理员', operatorId: 'ADMIN-01', type: '资源管理', action: '租户级AI能力上架发布', target: '大模型交互问答 (Chat Assistants)', result: '成功', ip: '127.0.0.1', userAgent: 'Internal Audit Daemon v2.1', payload: '{"capabilityId": "cap-chat", "status": "active", "limits": {"daily": "20M", "weekly": "100M", "concurrency": 15}}' }
  ]);

  // 2. Student-side Logs
  const [studentLogs, setStudentLogs] = useState<LogItem[]>([
    { id: 'ST-LOG-9001', time: '2026-05-26 15:10:45', operator: '李华', operatorId: '2026744502', type: '课程管理', action: '加入选课班级', target: '深度学习进阶课程班', result: '成功', ip: '10.21.45.12', userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0', payload: '{"studentId": "2026744502", "classId": "CLASS-DL-201", "action": "join_class", "source": "invitation_code"}' },
    { id: 'ST-LOG-9002', time: '2026-05-26 14:02:18', operator: '张伟', operatorId: '2026744503', type: '资源管理', action: '提交临时算力追加申请', target: '申请追加 100M Tokens', result: '成功', ip: '10.21.44.89', userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Chrome/120.0.0.0', payload: '{"studentName": "张伟", "amountRequested": 100, "currentQuota": 500, "reason": "大模型中期评估任务算力超限"}' },
    { id: 'ST-LOG-9003', time: '2026-05-25 13:40:02', operator: '刘洋', operatorId: '2026744505', type: '考试管理', action: '提交期中考试试卷', target: '人工智能基础与实训A卷', result: '成功', ip: '10.21.48.201', userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Edge/120.0.0.0', payload: '{"studentId": "2026744505", "examId": "EXAM-908", "durationSeconds": 5400, "tabOutCount": 0, "status": "submitted"}' },
    { id: 'ST-LOG-9004', time: '2026-05-25 10:15:30', operator: '李华', operatorId: '2026744502', type: '资源管理', action: '启动 GPU 算力沙箱 IDE', target: '深度学习多卡分布式实训 IDE', result: '成功', ip: '10.21.45.12', userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0', payload: '{"studentId": "2026744502", "sandboxId": "SB-DL-829", "gpuAllocated": "A100-80G * 1", "status": "running"}' },
    { id: 'ST-LOG-9005', time: '2026-05-24 09:30:15', operator: '王小明', operatorId: '2026744501', type: '用户管理', action: '修改绑定的安全手机号', target: '138****9988', result: '失败', ip: '10.21.43.55', userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_2 like Mac OS X) Chrome/120.0.0.0', payload: '{"studentId": "2026744501", "attemptType": "update_phone", "error": "SMS_VERIFICATION_FAILED", "message": "短信验证码校验失败"}' }
  ]);

  // --- Filter and Search logic ---
  const activeLogsList = activeTab === 'teacher' ? teacherLogs : studentLogs;

  const filteredLogs = activeLogsList.filter(log => {
    // 1. Search Query (matches actions or targets or ID)
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchAction = log.action.toLowerCase().includes(q);
      const matchTarget = log.target.toLowerCase().includes(q);
      const matchId = log.id.toLowerCase().includes(q);
      if (!matchAction && !matchTarget && !matchId) return false;
    }

    // 2. Type Filter
    if (typeFilter !== '全部' && log.type !== typeFilter) return false;

    // 3. Operator Search
    if (operatorSearch) {
      const op = operatorSearch.toLowerCase();
      const matchName = log.operator.toLowerCase().includes(op);
      const matchOpId = log.operatorId.toLowerCase().includes(op);
      if (!matchName && !matchOpId) return false;
    }

    // 4. Time range quick filter
    if (timeRange !== 'all') {
      const logDate = new Date(log.time.split(' ')[0]);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (timeRange === 'today') {
        if (logDate.getTime() !== today.getTime()) return false;
      } else if (timeRange === '3days') {
        const threshold = new Date(today);
        threshold.setDate(threshold.getDate() - 3);
        if (logDate < threshold) return false;
      } else if (timeRange === '7days') {
        const threshold = new Date(today);
        threshold.setDate(threshold.getDate() - 7);
        if (logDate < threshold) return false;
      }
    }

    return true;
  });

  // --- Export Action Simulation ---
  const handleTriggerExport = (format: 'Excel' | 'CSV') => {
    setExportFormat(format);
    setIsExporting(true);
    setExportProgress(10);

    const interval = setInterval(() => {
      setExportProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsExporting(false);
            showToast(`成功导出 ${activeTab === 'teacher' ? '教师端' : '学生端'} 操作日志为 ${format} 文件并下载完成！`);
          }, 500);
          return 100;
        }
        return prev + 15;
      });
    }, 200);
  };

  return (
    <div className="space-y-6 pb-12 relative animate-fade-in text-neutral-800">
      
      {/* Title Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-neutral-900 flex items-center gap-2">
            <div className="w-1.5 h-6 bg-[#fa541c] rounded-full"></div>
            安全审计操作日志
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            租户级核心业务操作审计。记录并追溯平台教师与学生用户在课程、考试、算力资源及用户配额管理上的完整操作链行为。
          </p>
        </div>

        {/* Global Export actions */}
        <div className="flex items-center gap-2">
          <Button 
            onClick={() => handleTriggerExport('Excel')}
            variant="outline" 
            className="border-neutral-200 text-neutral-600 font-bold h-9 px-4 rounded-lg text-xs flex items-center gap-1.5 hover:bg-neutral-50"
          >
            <Download className="w-3.5 h-3.5 text-neutral-500" />
            导出 Excel 格式
          </Button>
          <Button 
            onClick={() => handleTriggerExport('CSV')}
            variant="outline" 
            className="border-neutral-200 text-neutral-600 font-bold h-9 px-4 rounded-lg text-xs flex items-center gap-1.5 hover:bg-neutral-50"
          >
            <Download className="w-3.5 h-3.5 text-neutral-500" />
            导出 CSV 文本
          </Button>
        </div>
      </div>

      {/* Tabs Layout */}
      <div className="flex border-b border-neutral-200 mt-2">
        <button
          onClick={() => { setActiveTab('teacher'); setTypeFilter('全部'); setOperatorSearch(''); setSearchQuery(''); }}
          className={cn(
            "flex items-center gap-2 px-5 pb-3 text-sm font-bold border-b-2 transition-all",
            activeTab === 'teacher' ? "text-[#fa541c] border-[#fa541c]" : "text-neutral-500 border-transparent hover:text-neutral-800"
          )}
        >
          <Settings className="w-4 h-4" />
          教师端操作行为日志
        </button>
        <button
          onClick={() => { setActiveTab('student'); setTypeFilter('全部'); setOperatorSearch(''); setSearchQuery(''); }}
          className={cn(
            "flex items-center gap-2 px-5 pb-3 text-sm font-bold border-b-2 transition-all",
            activeTab === 'student' ? "text-[#fa541c] border-[#fa541c]" : "text-neutral-500 border-transparent hover:text-neutral-800"
          )}
        >
          <User className="w-4 h-4" />
          学生端操作行为日志
        </button>
      </div>

      {/* Advanced Filter Toolbar */}
      <div className="bg-white rounded-2xl border border-neutral-200 p-5 shadow-sm space-y-4">
        <span className="font-bold text-neutral-800 text-[13px] block">高级日志联合筛选条件</span>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          
          {/* Quick Time Range */}
          <div className="space-y-1">
            <span className="text-neutral-400 block font-bold">按时间范围快速筛选</span>
            <div className="relative">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value as any)}
                className="w-full text-xs border border-neutral-200 rounded-lg pl-3 pr-8 py-2 focus:outline-none focus:border-[#fa541c] bg-white text-neutral-700 font-bold appearance-none cursor-pointer"
              >
                <option value="all">全部历史操作日志</option>
                <option value="today">今天发生的日志</option>
                <option value="3days">最近 3 天日志</option>
                <option value="7days">最近 7 天日志</option>
              </select>
              <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
            </div>
          </div>

          {/* Operation Type dropdown */}
          <div className="space-y-1">
            <span className="text-neutral-400 block font-bold">按操作类型维度过滤</span>
            <div className="relative">
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value as any)}
                className="w-full text-xs border border-neutral-200 rounded-lg pl-3 pr-8 py-2 focus:outline-none focus:border-[#fa541c] bg-white text-neutral-700 font-bold appearance-none cursor-pointer"
              >
                <option value="全部">全部类型</option>
                <option value="课程管理">课程管理</option>
                <option value="考试管理">考试管理</option>
                <option value="资源管理">资源管理</option>
                <option value="用户管理">用户管理</option>
              </select>
              <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
            </div>
          </div>

          {/* Operator input */}
          <div className="space-y-1">
            <span className="text-neutral-400 block font-bold">按具体操作人员检索</span>
            <div className="relative">
              <User className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input 
                type="text" 
                placeholder="搜索操作人姓名、ID..."
                value={operatorSearch}
                onChange={(e) => setOperatorSearch(e.target.value)}
                className="pl-9 pr-3 py-1.5 text-xs border border-neutral-200 rounded-lg focus:outline-none focus:border-[#fa541c] w-full bg-white text-neutral-700"
              />
            </div>
          </div>

          {/* Keyword Search */}
          <div className="space-y-1">
            <span className="text-neutral-400 block font-bold">按操作动作与目标搜索</span>
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input 
                type="text" 
                placeholder="搜索日志哈希、行为、对象..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-3 py-1.5 text-xs border border-neutral-200 rounded-lg focus:outline-none focus:border-[#fa541c] w-full bg-white text-neutral-700"
              />
            </div>
          </div>

        </div>
      </div>

      {/* Log list grid table */}
      <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap text-xs text-neutral-700">
            <thead>
              <tr className="border-b border-neutral-100 bg-neutral-50/50 text-neutral-600 font-bold">
                <th className="p-4 pl-5">日志哈希 / 记录时间</th>
                <th className="p-4">操作人 (工号/学号)</th>
                <th className="p-4">操作类型</th>
                <th className="p-4">操作行为</th>
                <th className="p-4">操作对象</th>
                <th className="p-4">操作结果</th>
                <th className="p-4 text-center">操作入口</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.length > 0 ? (
                filteredLogs.map(log => (
                  <tr key={log.id} className="border-b border-neutral-100 hover:bg-neutral-50/30 transition-colors group">
                    <td className="p-4 pl-5">
                      <div className="font-mono font-bold text-neutral-800">{log.id}</div>
                      <div className="text-[10px] text-neutral-400 font-mono mt-0.5">{log.time}</div>
                    </td>
                    <td className="p-4">
                      <div className="font-bold text-neutral-800">{log.operator}</div>
                      <div className="text-[10px] text-neutral-400 font-mono mt-0.5">{log.operatorId}</div>
                    </td>
                    <td className="p-4">
                      <span className={cn(
                        "px-2 py-0.5 rounded font-bold text-[10px] border",
                        log.type === '课程管理' ? 'bg-blue-50 text-blue-600 border-blue-200' :
                        log.type === '考试管理' ? 'bg-violet-50 text-violet-600 border-violet-200' :
                        log.type === '资源管理' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' :
                        'bg-cyan-50 text-cyan-600 border-cyan-200'
                      )}>
                        {log.type}
                      </span>
                    </td>
                    <td className="p-4 text-neutral-800 font-bold">{log.action}</td>
                    <td className="p-4 text-neutral-500 font-medium max-w-[200px] truncate" title={log.target}>{log.target}</td>
                    <td className="p-4">
                      <span className={cn(
                        "px-2 py-0.5 rounded font-bold text-[10px] border inline-flex items-center gap-1",
                        log.result === '成功' ? 'bg-green-50 text-green-600 border-green-200' : 'bg-red-50 text-red-600 border-red-200'
                      )}>
                        {log.result === '成功' ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                        {log.result}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <button 
                        onClick={() => { setSelectedLog(log); setIsDetailOpen(true); }}
                        className="text-[#fa541c] hover:text-[#e84a15] font-bold text-xs inline-flex items-center gap-1 cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        详情
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-neutral-400 text-xs">
                    <Info className="w-6 h-6 mx-auto mb-2 text-neutral-300" />
                    未找到符合该组合筛选条件的操作审计日志
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Custom flat pagination */}
        <div className="flex items-center justify-end p-4 border-t border-neutral-100 gap-4 mt-2">
          <span className="text-neutral-500 font-bold">共 {filteredLogs.length} 条</span>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="h-7 w-7 p-0 rounded-sm text-neutral-400 border-neutral-200" disabled>&lt;</Button>
            <Button variant="outline" size="sm" className="h-7 w-7 p-0 rounded-sm bg-[#fa541c] text-white border-[#fa541c]">1</Button>
            <Button variant="outline" size="sm" className="h-7 w-7 p-0 rounded-sm text-neutral-400 border-neutral-200" disabled>&gt;</Button>
          </div>
        </div>

      </div>

      {/* --- Dialog Modals --- */}

      {/* Modal 1: Export Progress Dialog */}
      {isExporting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in text-xs">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-[360px] p-6 border border-neutral-200 flex flex-col items-center text-center space-y-4 animate-in zoom-in-95 duration-150">
            <RefreshCw className="w-8 h-8 text-[#fa541c] animate-spin" />
            <div className="space-y-1">
              <strong className="text-neutral-800 text-sm block">正在打包导出 {exportFormat} 文件...</strong>
              <span className="text-neutral-400 block text-[10px]">系统正在核对和汇编大盘中所有的操作审计日志数据</span>
            </div>
            
            <div className="w-full bg-neutral-100 h-2 rounded-full overflow-hidden relative">
              <div 
                className="h-full bg-[#fa541c] rounded-full transition-all duration-200" 
                style={{ width: `${exportProgress}%` }}
              ></div>
            </div>
            <span className="font-mono text-neutral-600 font-bold">{exportProgress}%</span>
          </div>
        </div>
      )}

      {/* Modal 2: Log Detail View */}
      {isDetailOpen && selectedLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in text-xs">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-[520px] overflow-hidden border border-neutral-200 flex flex-col animate-in zoom-in-95 duration-150">
            
            <div className="p-5 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/50">
              <h2 className="text-[15px] font-black text-neutral-900 flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#fa541c]" /> 审计日志详细参数面板
              </h2>
              <button 
                onClick={() => { setIsDetailOpen(false); setSelectedLog(null); }} 
                className="text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 p-1.5 rounded-full transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 leading-relaxed">
              
              <div className="grid grid-cols-2 gap-4 border-b border-neutral-100 pb-4">
                <div>
                  <span className="text-neutral-400 block mb-0.5">日志哈希</span>
                  <strong className="text-neutral-800 font-mono font-bold">{selectedLog.id}</strong>
                </div>
                <div>
                  <span className="text-neutral-400 block mb-0.5">记录时间</span>
                  <strong className="text-neutral-800 font-mono">{selectedLog.time}</strong>
                </div>
                <div>
                  <span className="text-neutral-400 block mb-0.5">操作人姓名 (工号/学号)</span>
                  <strong className="text-neutral-800">{selectedLog.operator} <span className="text-neutral-400 font-mono">({selectedLog.operatorId})</span></strong>
                </div>
                <div>
                  <span className="text-neutral-400 block mb-0.5">操作IP地址</span>
                  <strong className="text-neutral-800 font-mono">{selectedLog.ip}</strong>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 border-b border-neutral-100 pb-4">
                <div>
                  <span className="text-neutral-400 block mb-0.5">业务类别</span>
                  <strong className="text-neutral-800">{selectedLog.type}</strong>
                </div>
                <div>
                  <span className="text-neutral-400 block mb-0.5">审计动作</span>
                  <strong className="text-neutral-800">{selectedLog.action}</strong>
                </div>
                <div className="col-span-2">
                  <span className="text-neutral-400 block mb-0.5">审计对象目标</span>
                  <strong className="text-neutral-800">{selectedLog.target}</strong>
                </div>
              </div>

              {/* Browser agent */}
              <div className="border-b border-neutral-100 pb-4">
                <span className="text-neutral-400 block mb-0.5">客户端 User Agent</span>
                <span className="text-neutral-600 block text-[11px] font-mono whitespace-normal">{selectedLog.userAgent}</span>
              </div>

              {/* Action Payload Code Block */}
              <div className="space-y-1">
                <span className="text-neutral-400 block font-bold">完整行为 Payload 报文数据</span>
                <pre className="bg-neutral-900 text-[#fa541c] p-4 rounded-xl font-mono text-[11px] overflow-auto max-h-[160px] whitespace-pre-wrap">
                  {JSON.stringify(JSON.parse(selectedLog.payload), null, 2)}
                </pre>
              </div>

            </div>

            <div className="p-5 border-t border-neutral-100 bg-neutral-50/20 flex items-center justify-end">
              <Button 
                onClick={() => { setIsDetailOpen(false); setSelectedLog(null); }}
                className="bg-[#fa541c] hover:bg-[#e84a15] text-white font-bold h-9 px-6 rounded-lg text-xs"
              >
                确认关闭
              </Button>
            </div>

          </div>
        </div>
      )}

      {/* --- Simple Toast Popup --- */}
      {toast && (
        <div className={cn(
          "fixed bottom-5 right-5 px-4 py-2.5 rounded-xl shadow-lg text-white font-bold text-xs flex items-center gap-2 z-50 animate-bounce bg-emerald-600"
        )}>
          <Check className="w-4 h-4" />
          {toast.message}
        </div>
      )}

    </div>
  );
}
