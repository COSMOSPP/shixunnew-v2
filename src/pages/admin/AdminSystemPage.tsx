import React, { useState, useEffect, useRef } from "react";
import { 
  Settings, List, Shield, Key, Cloud, Activity, FileText, Search, 
  Plus, Edit, Trash2, Sliders, Play, TrendingUp, BarChart2, Download, 
  Filter, AlertCircle, Check, RefreshCw, X, ChevronRight, Cpu, 
  AlertTriangle, Server, Database, Terminal, ShieldAlert, Copy, RefreshCcw
} from "lucide-react";
import { cn } from "@/lib/utils";

// --- Data Interfaces ---

interface PlatformTag {
  id: string;
  name: string;
  category: string;
  associations: number;
  creator: string;
}

interface OperationalRole {
  id: string;
  name: string;
  description: string;
  active: boolean;
  functionPermissions: string[]; // List of route codes
  dataPermissions: string; // Radio selection string
  opPermissions: string[]; // "create", "read", "update", "delete"
}

interface CloudPlugin {
  id: string;
  name: string;
  type: string;
  status: "在线" | "离线" | "异常" | "已卸载";
  version: string;
  host: string;
  port: string;
  token: string;
  hasUpdate: boolean;
}

interface SystemLog {
  id: string;
  time: string;
  operator: string;
  type: string;
  target: string;
  ip: string;
  result: "成功" | "失败" | "异常中止" | "已驳回";
  module: string;
  abnormal: boolean;
}

// --- Initial Mock Data ---

const initialTags: PlatformTag[] = [
  { id: "tag-1", name: "LoRA微调", category: "大模型方向", associations: 24, creator: "admin" },
  { id: "tag-2", name: "RAG检索增强", category: "大模型方向", associations: 18, creator: "admin" },
  { id: "tag-3", name: "Transformer", category: "大模型方向", associations: 32, creator: "admin" },
  { id: "tag-4", name: "目标检测 YOLO", category: "CV专业方向", associations: 15, creator: "li_support" },
  { id: "tag-5", name: "图像分割 UNet", category: "CV专业方向", associations: 12, creator: "admin" },
  { id: "tag-6", name: "SQL 注入渗透", category: "安全技术", associations: 8, creator: "zhang_manager" },
  { id: "tag-7", name: "Docker 容器化", category: "基础课程", associations: 45, creator: "admin" },
  { id: "tag-8", name: "Python 零基础", category: "基础课程", associations: 52, creator: "admin" }
];

const initialRoles: OperationalRole[] = [
  { 
    id: "role-1", 
    name: "平台超管", 
    description: "具备系统内全部数据及修改配置控制权", 
    active: true, 
    functionPermissions: ["ai", "security", "public-cloud", "private-cloud", "it", "ip", "audit", "ai-quota", "competitions", "ai-center", "permissions", "system"], 
    dataPermissions: "全部可见", 
    opPermissions: ["create", "read", "update", "delete"] 
  },
  { 
    id: "role-2", 
    name: "运营经理", 
    description: "拥有全局资源调度及各核心数据统计大盘读写权", 
    active: false, 
    functionPermissions: ["ai", "audit", "ai-quota", "competitions", "ai-center", "system"], 
    dataPermissions: "仅限本省/本校租户", 
    opPermissions: ["create", "read", "update"] 
  },
  { 
    id: "role-3", 
    name: "内容运营", 
    description: "专注公共实训题库编辑、课件审核与平台标签调配", 
    active: false, 
    functionPermissions: ["audit", "ai-center", "system"], 
    dataPermissions: "仅限自建资源", 
    opPermissions: ["create", "read", "update"] 
  },
  { 
    id: "role-4", 
    name: "客服支持", 
    description: "负责基础用户资料库检索、团队封禁/解封与工单问题处理", 
    active: false, 
    functionPermissions: ["it", "system"], 
    dataPermissions: "仅限自建资源", 
    opPermissions: ["read", "update"] 
  }
];

const initialPlugins: CloudPlugin[] = [
  { id: "plug-1", name: "Milvus Vector DB", type: "向量数据库", status: "在线", version: "v2.4.1", host: "192.168.10.22", port: "19530", token: "milvus_token_2026", hasUpdate: true },
  { id: "plug-2", name: "DeepSeek API Gateway", type: "大语言模型", status: "离线", version: "v1.2.0", host: "api.deepseek.com", port: "443", token: "ds_sk_82937sdjkas", hasUpdate: false },
  { id: "plug-3", name: "MinIO Cloud Storage", type: "对象存储", status: "异常", version: "v3.0.4", host: "minio-cluster.zhiyun", port: "9000", token: "minio_root_access", hasUpdate: true },
  { id: "plug-4", name: "SendGrid SMTP Mailer", type: "邮件通知", status: "在线", version: "v2.0.0", host: "smtp.sendgrid.net", port: "587", token: "sg_mail_passwd_hash", hasUpdate: false }
];

const initialLogs: SystemLog[] = [
  { id: "log-1", time: "2026-05-27 22:04:12", operator: "admin", type: "配额微调", target: "清华大学计算机系", ip: "192.168.1.102", result: "成功", module: "AI配额", abnormal: false },
  { id: "log-2", time: "2026-05-27 22:02:45", operator: "zhang_manager", type: "封禁队伍", target: "PyTorch狂热粉 (上海交通大学)", ip: "192.168.1.45", result: "成功", module: "竞赛管理", abnormal: false },
  { id: "log-3", time: "2026-05-27 21:50:30", operator: "li_support", type: "插件卸载", target: "DeepSeek API Gateway", ip: "192.168.2.14", result: "异常中止", module: "插件管理", abnormal: true },
  { id: "log-4", time: "2026-05-27 21:40:02", operator: "admin", type: "创建标签", target: "RAG检索增强", ip: "192.168.1.102", result: "成功", module: "系统管理", abnormal: false },
  { id: "log-5", time: "2026-05-27 21:12:15", operator: "wang_content", type: "修改得分", target: "影像切割大师 (复旦大学医学院)", ip: "192.168.1.88", result: "成功", module: "竞赛管理", abnormal: false }
];

// 6 months monitor metrics datasets
const initialTrends: Record<string, number[]> = {
  "CPU使用率": [25, 32, 45, 38, 52, 45],
  "网络延迟(ms)": [180, 150, 120, 135, 110, 120]
};

export default function AdminSystemPage() {
  const [activeTab, setActiveTab] = useState<"tags" | "roles" | "plugins" | "monitor" | "logs">("tags");

  // --- Reactive Component State Database ---
  const [tags, setTags] = useState<PlatformTag[]>(initialTags);
  const [roles, setRoles] = useState<OperationalRole[]>(initialRoles);
  const [plugins, setPlugins] = useState<CloudPlugin[]>(initialPlugins);
  const [systemLogs, setSystemLogs] = useState<SystemLog[]>(initialLogs);

  // --- Dynamic Toast Notifier ---
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // ==================== TAB 1. 标签体系管理 ====================
  const [selectedTagCategory, setSelectedTagCategory] = useState("大模型方向");
  const [newTagName, setNewTagName] = useState("");
  
  // Tag Merging States
  const [selectedMergeIds, setSelectedMergeIds] = useState<string[]>([]);
  const [targetMergeTagId, setTargetMergeTagId] = useState("");
  const [showMergeModal, setShowMergeModal] = useState(false);

  const handleCreateTag = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTagName.trim()) return;

    // Check if tag already exists in category
    if (tags.some(t => t.name.toLowerCase() === newTagName.trim().toLowerCase() && t.category === selectedTagCategory)) {
      triggerToast(`⚠️ 标签「${newTagName}」在此分类中已存在！`);
      return;
    }

    const newTag: PlatformTag = {
      id: `tag-${Date.now()}`,
      name: newTagName.trim(),
      category: selectedTagCategory,
      associations: 0,
      creator: "admin"
    };

    setTags([...tags, newTag]);
    setNewTagName("");
    triggerToast(`🎉 成功新建平台标签：「${newTag.name}」`);
  };

  const handleOpenMergeDialog = () => {
    if (selectedMergeIds.length < 2) {
      triggerToast("⚠️ 请至少勾选 2 个需要合并的标签！");
      return;
    }
    // Set initial target tag
    setTargetMergeTagId(selectedMergeIds[0]);
    setShowMergeModal(true);
  };

  const handleMergeTags = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetMergeTagId) return;

    const targetTag = tags.find(t => t.id === targetMergeTagId);
    if (!targetTag) return;

    // Calculate sum of associations
    const sumAssociations = tags
      .filter(t => selectedMergeIds.includes(t.id))
      .reduce((acc, t) => acc + t.associations, 0);

    // Update tags: target tag takes all associations, others in merge list are deleted
    setTags(tags.map(t => {
      if (t.id === targetMergeTagId) {
        return { ...t, associations: sumAssociations };
      }
      return t;
    }).filter(t => !selectedMergeIds.includes(t.id) || t.id === targetMergeTagId));

    setSelectedMergeIds([]);
    setShowMergeModal(false);
    triggerToast(`📂 成功将已选标签合并入「${targetTag.name}」，已动态重整关联统计值。`);
  };

  const handleDeleteTag = (id: string, name: string) => {
    if (confirm(`确定要删除该平台标签吗？「${name}」`)) {
      setTags(tags.filter(t => t.id !== id));
      triggerToast(`🗑️ 已彻底删除标签：「${name}」`);
    }
  };

  // ==================== TAB 2. 角色权限管理 ====================
  const [selectedRoleId, setSelectedRoleId] = useState("role-1");
  const activeRole = roles.find(r => r.id === selectedRoleId) || roles[0];
  
  // Replication State
  const [showRoleCloneModal, setShowRoleCloneModal] = useState(false);
  const [cloneRoleName, setCloneRoleName] = useState("");

  const handleCloneRole = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cloneRoleName.trim()) return;

    const newId = `role-${Date.now()}`;
    const newRole: OperationalRole = {
      id: newId,
      name: cloneRoleName.trim(),
      description: `基于 ${activeRole.name} 复制创建的自定义职责角色。`,
      active: false,
      functionPermissions: [...activeRole.functionPermissions],
      dataPermissions: activeRole.dataPermissions,
      opPermissions: [...activeRole.opPermissions]
    };

    setRoles([...roles, newRole]);
    setSelectedRoleId(newId);
    setShowRoleCloneModal(false);
    setCloneRoleName("");
    triggerToast(`👥 成功复制角色！已生成新角色并载入其权限树配置。`);
  };

  // Toggle Function permission inside the checked active role
  const handleToggleFuncPerm = (permCode: string) => {
    setRoles(roles.map(r => {
      if (r.id === selectedRoleId) {
        const hasIt = r.functionPermissions.includes(permCode);
        const nextList = hasIt 
          ? r.functionPermissions.filter(p => p !== permCode)
          : [...r.functionPermissions, permCode];
        return { ...r, functionPermissions: nextList };
      }
      return r;
    }));
  };

  // Toggle Operational CRUD permission inside role
  const handleToggleOpPerm = (opCode: string) => {
    setRoles(roles.map(r => {
      if (r.id === selectedRoleId) {
        const hasIt = r.opPermissions.includes(opCode);
        const nextList = hasIt 
          ? r.opPermissions.filter(o => o !== opCode)
          : [...r.opPermissions, opCode];
        return { ...r, opPermissions: nextList };
      }
      return r;
    }));
  };

  // Toggle Data range inside role
  const handleSetDataPerm = (scope: string) => {
    setRoles(roles.map(r => 
      r.id === selectedRoleId ? { ...r, dataPermissions: scope } : r
    ));
  };

  const handleApplyQuickTemplate = (tplType: "read-only" | "full-write") => {
    setRoles(roles.map(r => {
      if (r.id === selectedRoleId) {
        if (tplType === "read-only") {
          return {
            ...r,
            functionPermissions: ["system"],
            opPermissions: ["read"],
            dataPermissions: "仅限自建资源"
          };
        } else {
          return {
            ...r,
            functionPermissions: ["ai", "security", "public-cloud", "private-cloud", "it", "ip", "audit", "ai-quota", "competitions", "ai-center", "permissions", "system"],
            opPermissions: ["create", "read", "update", "delete"],
            dataPermissions: "全部可见"
          };
        }
      }
      return r;
    }));
    triggerToast(`⚡ 已成功应用预设权限模板，重置了该角色的权限架构！`);
  };

  // ==================== TAB 3. 云平台插件管理 ====================
  const [selectedPlugin, setSelectedPlugin] = useState<CloudPlugin | null>(null);
  
  // Credentials modal form
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [formHost, setFormHost] = useState("");
  const [formPort, setFormPort] = useState("");
  const [formToken, setFormToken] = useState("");

  // Scrolling Log Viewer Terminal States
  const [showLogModal, setShowLogModal] = useState(false);
  const [logLogs, setLogLogs] = useState<string[]>([]);
  const terminalEndRef = useRef<HTMLDivElement | null>(null);

  // Auto scrolling hook
  useEffect(() => {
    if (showLogModal && terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [logLogs, showLogModal]);

  const handleOpenConfig = (p: CloudPlugin) => {
    setSelectedPlugin(p);
    setFormHost(p.host);
    setFormPort(p.port);
    setFormToken(p.token);
    setShowConfigModal(true);
  };

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlugin) return;

    setPlugins(plugins.map(p => 
      p.id === selectedPlugin.id 
        ? { ...p, host: formHost, port: formPort, token: formToken } 
        : p
    ));
    setShowConfigModal(false);
    triggerToast(`💾 成功保存插件「${selectedPlugin.name}」连接参数认证配置！`);
  };

  const handleTogglePluginInstall = (id: string, name: string, currentStatus: CloudPlugin["status"]) => {
    const nextStatus: CloudPlugin["status"] = currentStatus === "已卸载" ? "在线" : "已卸载";
    setPlugins(plugins.map(p => 
      p.id === id ? { ...p, status: nextStatus } : p
    ));
    triggerToast(nextStatus === "已卸载" ? `🔌 已成功停用并物理卸载插件「${name}」` : `⚡ 已重新加载、初始化并挂载启动插件「${name}」`);
  };

  const handleSimulateLogView = (p: CloudPlugin) => {
    setSelectedPlugin(p);
    setLogLogs([]);
    setShowLogModal(true);

    // Dynamic terminal logging mock
    const lines = [
      `[info] 22:15:00 [ZHIYUN_GATEWAY] Initializing connection to plugin host: ${p.host}:${p.port} ...`,
      `[info] 22:15:00 [TLS_HANDSHAKE] Starting client hello TLS/SSL handshake ...`,
      `[info] 22:15:01 [AUTH_VERIFY] Injecting bearer credential token credentials matching SHA256 ...`,
      `[success] 22:15:01 [AUTH_VERIFY] Key signature authenticated correctly by endpoint.`,
      `[info] 22:15:02 [SYNC_METRIC] Fetching engine cluster indicators & catalog structure ...`,
      `[success] 22:15:02 [SYNC_METRIC] Milvus DB status code: 200 OK. Dynamic indexes mapped correctly.`,
      `[info] 22:15:03 [DAEMON_KEEPALIVE] Heartbeat keepalive active. Listening to sockets on port ${p.port} ...`
    ];

    lines.forEach((line, i) => {
      setTimeout(() => {
        setLogLogs(prev => [...prev, line]);
      }, (i + 1) * 300);
    });
  };

  const handleUpdatePluginVersion = (p: CloudPlugin) => {
    triggerToast(`⏳ 正在下载并在隔离沙箱中编译插件最新补丁包...`);
    setPlugins(plugins.map(pl => 
      pl.id === p.id ? { ...pl, version: "v2.5.0", hasUpdate: false, status: "在线" } : pl
    ));
    setTimeout(() => {
      triggerToast(`📥 升级完毕！插件「${p.name}」已平滑重启热升级至最新版本 v2.5.0。`);
    }, 2000);
  };

  // ==================== TAB 4. 平台级监控管理 ====================
  const [alarmCpuThreshold, setAlarmCpuThreshold] = useState(85);
  const [alarmRamThreshold, setAlarmRamThreshold] = useState(90);
  const [selectedMonitorTrend, setSelectedMonitorTrend] = useState("CPU使用率");

  const [activeAlerts, setActiveAlerts] = useState<any[]>([
    { id: "al-1", type: "Memory", level: "中危", content: "微服务容器 Sandbox-04 内存利用率已达 92% 触发临界阈值", time: "5分钟前" },
    { id: "al-2", type: "Network", level: "高危", content: "AI-Gateway 主路由接口网络波动延时大于 500ms", time: "刚刚" }
  ]);

  const handleResolveAlert = (id: string) => {
    setActiveAlerts(activeAlerts.filter(a => a.id !== id));
    triggerToast(`✅ 告警已作人工妥善处理并归档，状态恢复健康。`);
  };

  // ==================== TAB 5. 操作日志查看功能 ====================
  const [logSearchUser, setLogSearchUser] = useState("全部");
  const [logSearchModule, setLogSearchModule] = useState("全部");
  const [selectedLogDetail, setSelectedLogDetail] = useState<SystemLog | null>(null);

  const handleToggleLogAnomaly = (id: string) => {
    setSystemLogs(systemLogs.map(l => 
      l.id === id ? { ...l, abnormal: !l.abnormal } : l
    ));
    const item = systemLogs.find(l => l.id === id);
    if (item) {
      triggerToast(item.abnormal ? `✅ 已解除日志行标记` : `⚠️ 已成功将该行标记为“审计异常操作”`);
    }
  };

  // Multi-dimensional filters logs
  const filteredLogs = systemLogs.filter(l => {
    const matchesUser = logSearchUser === "全部" || l.operator === logSearchUser;
    const matchesModule = logSearchModule === "全部" || l.module === logSearchModule;
    return matchesUser && matchesModule;
  });

  return (
    <div className="flex h-full w-full bg-white overflow-hidden text-neutral-800 font-sans">
      
      {/* Left Navigation Sidebar */}
      <div className="w-[240px] border-r border-neutral-border flex-shrink-0 flex flex-col bg-white h-full select-none">
        {/* Title Header */}
        <div className="p-5 border-b border-neutral-border shrink-0 flex items-center gap-2.5">
          <Settings className="w-5.5 h-5.5 text-[#fa541c]" />
          <div>
            <h2 className="text-sm font-black text-neutral-title leading-tight">系统集成管理</h2>
            <span className="text-[10px] text-neutral-caption font-bold">ZHIYUN CONTROL CENTER</span>
          </div>
        </div>

        {/* Tab Selections */}
        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto custom-scrollbar">
          {[
            { id: "tags", title: "标签体系管理", icon: List },
            { id: "roles", title: "运营角色权限", icon: Key },
            { id: "plugins", title: "云平台插件", icon: Cloud, badge: plugins.filter(p => p.status === "异常").length },
            { id: "monitor", title: "平台级监控", icon: Activity, badge: activeAlerts.length },
            { id: "logs", title: "审计操作日志", icon: FileText }
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={cn(
                  "w-full flex items-center justify-between px-3 py-2.5 rounded-[8px] text-[13px] font-semibold transition-all duration-200 cursor-pointer border-0 bg-transparent text-left",
                  isActive 
                    ? "bg-[#fff2e8] text-[#fa541c] shadow-3xs" 
                    : "text-neutral-body hover:bg-neutral-bg hover:text-neutral-title"
                )}
              >
                <div className="flex items-center gap-3">
                  <tab.icon className="w-4.5 h-4.5 shrink-0" />
                  <span>{tab.title}</span>
                </div>
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold scale-90">
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Right Content Workspace */}
      <div className="flex-1 overflow-auto bg-[#f5f6f8] p-8 flex flex-col min-h-0 custom-scrollbar relative">
        
        {/* Toast Notifier */}
        {toastMessage && (
          <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-neutral-900 text-white px-5 py-3 rounded-lg shadow-lg flex items-center gap-2 border border-neutral-800 text-xs font-bold animate-slide-up">
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* ==================== 1. 标签体系管理 ==================== */}
        {activeTab === "tags" && (
          <div className="space-y-6 flex flex-col flex-1 min-h-0 animate-slide-up">
            <div>
              <h1 className="text-lg font-black text-neutral-title flex items-center gap-2">
                <List className="w-5.5 h-5.5 text-[#fa541c]" />
                <span>平台全局标签体系</span>
              </h1>
              <p className="text-xs text-neutral-caption mt-1">
                统一配置和管理实训平台大模型、安全、微服务、算法等赛道或课程的分类关联标签，支撑平台的个性化算法分发与高级筛选检索。
              </p>
            </div>

            {/* Split Pane view: Categories on left, tags list on right */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 flex-1 min-h-0">
              
              {/* Left Column: Categories Selection List */}
              <div className="lg:col-span-1 bg-white p-5 rounded-xl border border-neutral-border shadow-3xs flex flex-col h-[200px] lg:h-auto select-none shrink-0">
                <span className="text-xs font-bold text-neutral-caption uppercase tracking-wider block mb-3">标签业务方向分类</span>
                <div className="space-y-1.5 flex-1 overflow-y-auto custom-scrollbar">
                  {["大模型方向", "CV专业方向", "安全技术", "基础课程"].map((cat) => {
                    const isActive = selectedTagCategory === cat;
                    return (
                      <button
                        key={cat}
                        onClick={() => { setSelectedTagCategory(cat); setSelectedMergeIds([]); }}
                        className={cn(
                          "w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold cursor-pointer border-0 bg-transparent text-left transition-colors",
                          isActive 
                            ? "bg-[#fff2e8] text-[#fa541c]" 
                            : "text-neutral-body hover:bg-neutral-50 hover:text-neutral-title"
                        )}
                      >
                        <span>{cat}</span>
                        <ChevronRight className="w-3.5 h-3.5 opacity-60" />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Right Column: Tags master grid and actions */}
              <div className="lg:col-span-3 flex flex-col gap-4 min-h-0">
                
                {/* Creation form and Merge Actions */}
                <div className="bg-white p-5 rounded-xl border border-neutral-border shadow-3xs flex flex-col md:flex-row justify-between items-center gap-4 shrink-0 text-xs font-bold select-none">
                  {/* Create tag */}
                  <form onSubmit={handleCreateTag} className="flex gap-2 w-full md:w-auto">
                    <input
                      type="text"
                      required
                      placeholder="输入要创建的新标签名称..."
                      value={newTagName}
                      onChange={(e) => setNewTagName(e.target.value)}
                      className="border border-neutral-200 rounded-lg px-3 py-1.5 focus:outline-none focus:border-[#fa541c] bg-white text-neutral-800 placeholder-neutral-400 font-medium w-48"
                    />
                    <button
                      type="submit"
                      className="bg-[#fa541c] hover:bg-[#e84a15] text-white text-xs font-black px-4 py-1.5 rounded-lg transition-colors cursor-pointer shadow-3xs shrink-0"
                    >
                      创建标签
                    </button>
                  </form>

                  {/* Bulk merger triggers */}
                  <div className="flex items-center gap-3">
                    <span className="text-neutral-caption font-semibold text-[11px]">
                      已选择: <span className="font-mono text-[#fa541c] font-black">{selectedMergeIds.length}</span> 个标签
                    </span>
                    <button
                      onClick={handleOpenMergeDialog}
                      disabled={selectedMergeIds.length < 2}
                      className={cn(
                        "text-xs font-bold px-4 py-1.5 border rounded-lg transition-colors cursor-pointer shadow-3xs",
                        selectedMergeIds.length >= 2 
                          ? "border-[#ffbb96] bg-[#fff2e8] text-[#fa541c] hover:bg-[#ffe8d6]" 
                          : "border-neutral-200 bg-neutral-50 text-neutral-400 cursor-not-allowed"
                      )}
                    >
                      标签合并合并合并
                    </button>
                  </div>
                </div>

                {/* Tags grid */}
                <div className="bg-white rounded-xl border border-neutral-border shadow-3xs overflow-hidden flex-1 flex flex-col min-h-[300px]">
                  <div className="overflow-y-auto p-6 flex-1 custom-scrollbar">
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      {tags.filter(t => t.category === selectedTagCategory).map((tag) => {
                        const isChecked = selectedMergeIds.includes(tag.id);
                        return (
                          <div 
                            key={tag.id}
                            className={cn(
                              "p-4 rounded-xl border transition-all flex justify-between items-start",
                              isChecked 
                                ? "border-[#ffbb96] bg-[#fff2e8]/25" 
                                : "border-neutral-200 bg-neutral-50/50 hover:bg-neutral-50"
                            )}
                          >
                            <div className="flex gap-2.5 items-start">
                              {/* Merge select checkbox */}
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setSelectedMergeIds([...selectedMergeIds, tag.id]);
                                  } else {
                                    setSelectedMergeIds(selectedMergeIds.filter(id => id !== tag.id));
                                  }
                                }}
                                className="mt-1 accent-[#fa541c] w-3.5 h-3.5 cursor-pointer rounded"
                              />
                              <div className="space-y-1 select-none">
                                <span className="font-black text-neutral-title block">{tag.name}</span>
                                <span className="text-[10px] text-neutral-caption font-semibold block">关联资源数: <span className="font-bold text-[#fa541c] font-mono">{tag.associations}</span></span>
                              </div>
                            </div>

                            <button
                              onClick={() => handleDeleteTag(tag.id, tag.name)}
                              className="text-neutral-400 hover:text-red-500 font-bold px-1 transition-colors cursor-pointer"
                              title="删除此标签"
                            >
                              ✕
                            </button>
                          </div>
                        );
                      })}
                    </div>

                  </div>

                  {/* Foot total counts */}
                  <div className="bg-neutral-50 px-6 py-3 border-t border-neutral-100 flex justify-between items-center text-xs font-semibold text-neutral-body shrink-0 select-none">
                    <span>当前分类包含: {tags.filter(t => t.category === selectedTagCategory).length} 个激活标签</span>
                    <span className="text-[10px] text-neutral-caption font-medium">提示：标签合并将删除副标签，并将其所有关联资源计数累加到主标签上。</span>
                  </div>
                </div>

              </div>

            </div>

            {/* --- Tag Merging dialog modal --- */}
            {showMergeModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 backdrop-blur-xs p-4 animate-fade-in">
                <form onSubmit={handleMergeTags} className="w-full max-w-[420px] bg-white rounded-xl shadow-2xl overflow-hidden animate-scale-up flex flex-col text-xs">
                  
                  {/* Header */}
                  <div className="bg-neutral-50 px-6 py-4 border-b border-neutral-border flex items-center justify-between shrink-0">
                    <span className="font-black text-neutral-title text-sm flex items-center gap-1.5">
                      <List className="w-4.5 h-4.5 text-[#fa541c]" />
                      <span>标签体系合并合并合并</span>
                    </span>
                    <button 
                      type="button"
                      onClick={() => setShowMergeModal(false)}
                      className="text-neutral-400 hover:text-neutral-700 cursor-pointer"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Body inputs */}
                  <div className="p-6 space-y-4 text-xs font-semibold text-neutral-body select-none">
                    <div>
                      <span>即将要合并的标签列表：</span>
                      <div className="flex flex-wrap gap-2.5 mt-2">
                        {tags.filter(t => selectedMergeIds.includes(t.id)).map(t => (
                          <span key={t.id} className="px-2.5 py-1 bg-neutral-100 text-neutral-title rounded border border-neutral-200">
                            {t.name}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2 border-t border-neutral-100 pt-3">
                      <label className="font-bold text-neutral-700 block">
                        请选择合并后的目标主标签（其余标签将被注销）：
                      </label>
                      <select
                        value={targetMergeTagId}
                        onChange={(e) => setTargetMergeTagId(e.target.value)}
                        className="w-full border border-neutral-200 rounded-lg px-3 py-2 bg-white text-neutral-800 font-bold"
                      >
                        {tags.filter(t => selectedMergeIds.includes(t.id)).map(t => (
                          <option key={t.id} value={t.id}>{t.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="px-6 py-4 bg-neutral-50 border-t border-neutral-border flex items-center justify-end gap-3 shrink-0">
                    <button
                      type="button"
                      onClick={() => setShowMergeModal(false)}
                      className="bg-white hover:bg-neutral-100 text-neutral-title font-bold px-4 py-2 border border-neutral-border rounded-lg cursor-pointer transition-colors"
                    >
                      取消
                    </button>
                    <button
                      type="submit"
                      className="bg-[#fa541c] hover:bg-[#e84a15] text-white font-bold px-5 py-2 rounded-lg cursor-pointer transition-colors shadow-sm"
                    >
                      确认合并标签
                    </button>
                  </div>

                </form>
              </div>
            )}

          </div>
        )}

        {/* ==================== 2. 运营人员角色配置 ==================== */}
        {activeTab === "roles" && (
          <div className="space-y-6 flex flex-col flex-1 min-h-0 animate-slide-up">
            <div>
              <h1 className="text-lg font-black text-neutral-title flex items-center gap-2">
                <Key className="w-5.5 h-5.5 text-[#fa541c]" />
                <span>平台运营角色与权限体系</span>
              </h1>
              <p className="text-xs text-neutral-caption mt-1">
                创建不同职责的运营或服务角色，分别隔离其功能菜单访问权限、可见的组织数据范围以及精确的增删改查操作指令权。
              </p>
            </div>

            {/* Split pane: Left Roles listing, right permissions checklist details */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 flex-1 min-h-0">
              
              {/* Left Column: Predefined Roles list */}
              <div className="lg:col-span-1 bg-white p-5 rounded-xl border border-neutral-border shadow-3xs flex flex-col h-[280px] lg:h-auto select-none shrink-0 justify-between">
                <div>
                  <span className="text-xs font-bold text-neutral-caption uppercase tracking-wider block mb-3">系统登记运营角色</span>
                  <div className="space-y-2 max-h-[300px] overflow-y-auto custom-scrollbar">
                    {roles.map((r) => {
                      const isActive = selectedRoleId === r.id;
                      return (
                        <button
                          key={r.id}
                          onClick={() => setSelectedRoleId(r.id)}
                          className={cn(
                            "w-full px-3.5 py-3 rounded-xl border transition-all text-left bg-transparent cursor-pointer block",
                            isActive 
                              ? "border-[#fa541c] bg-[#fff2e8]/25 text-[#fa541c]" 
                              : "border-neutral-200 text-neutral-body hover:bg-neutral-50 hover:text-neutral-title"
                          )}
                        >
                          <span className="font-black text-xs block">{r.name}</span>
                          <span className="text-[10px] text-neutral-caption font-medium block mt-1 leading-normal truncate">{r.description}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Clone Role CTA */}
                <button
                  onClick={() => setShowRoleCloneModal(true)}
                  className="w-full text-center text-[#fa541c] hover:text-[#e84a15] text-xs font-bold py-2.5 border border-[#ffbb96]/45 bg-[#fff2e8]/45 hover:bg-[#fff2e8] rounded-lg transition-colors cursor-pointer shrink-0 mt-4 block"
                >
                  复制并生成角色复制并生成角色
                </button>
              </div>

              {/* Right Column: Permission Matrix Checklist */}
              <div className="lg:col-span-3 bg-white p-6 rounded-xl border border-neutral-border shadow-3xs flex flex-col justify-between overflow-y-auto custom-scrollbar">
                
                <div className="space-y-6">
                  {/* Active role title and quick templates loader */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-neutral-100 pb-4 gap-3 shrink-0">
                    <div>
                      <h2 className="text-sm font-black text-neutral-title leading-tight">
                        配置「{activeRole.name}」权限树架构
                      </h2>
                      <span className="text-[10px] text-neutral-caption font-semibold mt-1 block">Description: {activeRole.description}</span>
                    </div>

                    <div className="flex items-center gap-2 text-xs font-bold">
                      <span className="text-neutral-caption">权限模板应用:</span>
                      <button
                        onClick={() => handleApplyQuickTemplate("read-only")}
                        className="px-2 py-1 bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 text-neutral-body rounded text-[10.5px] cursor-pointer font-semibold shadow-3xs"
                      >
                        快速只读
                      </button>
                      <button
                        onClick={() => handleApplyQuickTemplate("full-write")}
                        className="px-2 py-1 bg-[#fff2e8] hover:bg-[#ffe8d6] border border-[#ffbb96]/45 text-[#fa541c] rounded text-[10.5px] cursor-pointer font-bold shadow-3xs"
                      >
                        授权平台写
                      </button>
                    </div>
                  </div>

                  {/* 1. Functional menu access checklist */}
                  <div className="space-y-3">
                    <h3 className="text-xs font-bold text-neutral-title border-l-3 border-[#fa541c] pl-2">1. 功能权限 (可访问系统导航菜单访问访问访问)</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 select-none">
                      {[
                        { code: "ai", label: "人工智能" },
                        { code: "security", label: "安全运维" },
                        { code: "public-cloud", label: "公有云" },
                        { code: "private-cloud", label: "私有云" },
                        { code: "it", label: "IT资产" },
                        { code: "ip", label: "IP地址" },
                        { code: "audit", label: "审核中心" },
                        { code: "ai-quota", label: "AI配额" },
                        { code: "competitions", label: "竞赛管理" },
                        { code: "ai-center", label: "AI能力中心" },
                        { code: "permissions", label: "权限管理" },
                        { code: "system", label: "系统管理" }
                      ].map((item) => {
                        const isChecked = activeRole.functionPermissions.includes(item.code);
                        return (
                          <label key={item.code} className={cn(
                            "flex items-center gap-2.5 p-2 rounded-lg border text-xs cursor-pointer transition-colors font-medium",
                            isChecked ? "border-[#ffbb96] bg-[#fff2e8]/10 text-neutral-title font-bold" : "border-neutral-200 text-neutral-caption"
                          )}>
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => handleToggleFuncPerm(item.code)}
                              className="accent-[#fa541c] cursor-pointer w-3.5 h-3.5"
                            />
                            <span>{item.label}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  {/* 2. Data scope radio list */}
                  <div className="space-y-3 pt-4 border-t border-neutral-100">
                    <h3 className="text-xs font-bold text-neutral-title border-l-3 border-[#fa541c] pl-2">2. 数据权限 (可见的数据资源可见可见范围)</h3>
                    <div className="flex flex-wrap gap-5 select-none font-medium">
                      {[
                        "全部可见",
                        "仅限本省/本校租户",
                        "仅限自建资源"
                      ].map((scope) => {
                        const isChecked = activeRole.dataPermissions === scope;
                        return (
                          <label key={scope} className="flex items-center gap-2 text-xs text-neutral-body cursor-pointer">
                            <input
                              type="radio"
                              name="dataScope"
                              checked={isChecked}
                              onChange={() => handleSetDataPerm(scope)}
                              className="accent-[#fa541c] cursor-pointer w-3.5 h-3.5"
                            />
                            <span>{scope}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  {/* 3. Operational CRUD checkboxes */}
                  <div className="space-y-3 pt-4 border-t border-neutral-100">
                    <h3 className="text-xs font-bold text-neutral-title border-l-3 border-[#fa541c] pl-2">3. 操作权限 (对关联数据的CRUD操作限制指令)</h3>
                    <div className="flex flex-wrap gap-5 select-none font-semibold">
                      {[
                        { code: "create", label: "新建 (Create / Upload)" },
                        { code: "read", label: "读取查询 (Read / View)" },
                        { code: "update", label: "更新调整 (Update / Change)" },
                        { code: "delete", label: "物理删除 (Delete / Clean)" }
                      ].map((op) => {
                        const isChecked = activeRole.opPermissions.includes(op.code);
                        return (
                          <label key={op.code} className="flex items-center gap-2 text-xs text-neutral-body cursor-pointer">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => handleToggleOpPerm(op.code)}
                              className="accent-[#fa541c] cursor-pointer w-3.5 h-3.5"
                            />
                            <span>{op.label}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>

                </div>

                <div className="border-t border-neutral-100 pt-4 mt-6 flex justify-between items-center shrink-0">
                  <span className="text-[10px] text-neutral-caption font-medium">提示：任何自定义角色都将继承对应高校或企业租户的安全白名单范围。</span>
                  <button
                    onClick={() => triggerToast(`💾 成功保存运营角色「${activeRole.name}」的全新权限矩阵结构！`)}
                    className="bg-[#fa541c] hover:bg-[#e84a15] text-white text-xs font-bold px-6 py-2 rounded-lg transition-colors cursor-pointer shadow-3xs"
                  >
                    保存角色权限树
                  </button>
                </div>

              </div>

            </div>

            {/* --- Clone Role Dialog Modal --- */}
            {showRoleCloneModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 backdrop-blur-xs p-4 animate-fade-in">
                <form onSubmit={handleCloneRole} className="w-full max-w-[400px] bg-white rounded-xl shadow-2xl overflow-hidden animate-scale-up flex flex-col text-xs">
                  
                  {/* Header */}
                  <div className="bg-neutral-50 px-6 py-4 border-b border-neutral-border flex items-center justify-between shrink-0">
                    <span className="font-black text-neutral-title text-sm flex items-center gap-1.5">
                      <Copy className="w-4.5 h-4.5 text-[#fa541c]" />
                      <span>复制新建运营角色</span>
                    </span>
                    <button 
                      type="button"
                      onClick={() => setShowRoleCloneModal(false)}
                      className="text-neutral-400 hover:text-neutral-700 cursor-pointer"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Body inputs */}
                  <div className="p-6 space-y-4">
                    <div className="text-xs space-y-1.5">
                      <div><strong>当前克隆来源父类角色:</strong> <span className="font-bold text-neutral-title">{activeRole.name}</span></div>
                      <p className="text-[10px] text-neutral-caption leading-relaxed font-semibold">
                        复制后，系统将自动加载该父级角色的所有功能、数据及读写操作控制权限到全新角色模板上。
                      </p>
                    </div>

                    <div className="space-y-2 border-t border-neutral-100 pt-3">
                      <label className="font-bold text-neutral-700 block">请输入新角色名称：</label>
                      <input
                        type="text"
                        required
                        value={cloneRoleName}
                        onChange={(e) => setCloneRoleName(e.target.value)}
                        placeholder="如: 助理内容运营 / 客服三线专家"
                        className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#fa541c] bg-white text-neutral-800"
                      />
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="px-6 py-4 bg-neutral-50 border-t border-neutral-border flex items-center justify-end gap-3 shrink-0">
                    <button
                      type="button"
                      onClick={() => setShowRoleCloneModal(false)}
                      className="bg-white hover:bg-neutral-100 text-neutral-title font-bold px-4 py-2 border border-neutral-border rounded-lg cursor-pointer transition-colors"
                    >
                      取消
                    </button>
                    <button
                      type="submit"
                      className="bg-[#fa541c] hover:bg-[#e84a15] text-white font-bold px-5 py-2 rounded-lg cursor-pointer transition-colors shadow-sm"
                    >
                      复制并生成角色
                    </button>
                  </div>

                </form>
              </div>
            )}

          </div>
        )}

        {/* ==================== 3. 管理端云平台插件管理 ==================== */}
        {activeTab === "plugins" && (
          <div className="space-y-6 flex flex-col flex-1 min-h-0 animate-slide-up">
            <div>
              <h1 className="text-lg font-black text-neutral-title flex items-center gap-2">
                <Cloud className="w-5.5 h-5.5 text-[#fa541c]" />
                <span>对接外部云服务插件管理</span>
              </h1>
              <p className="text-xs text-neutral-caption mt-1">
                监控和配置实训平台挂载的外部高性能向量数据库、大模型API调用端点、对象存储服务或通知组件，支持参数认证调优及动态日志查看。
              </p>
            </div>

            {/* Plugin card grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1 overflow-y-auto custom-scrollbar pr-1">
              {plugins.map((p) => (
                <div key={p.id} className="bg-white rounded-xl border border-neutral-border shadow-3xs p-6 flex flex-col justify-between relative overflow-hidden transition-all duration-200 hover:shadow-xs">
                  
                  {/* Status Indicator Bar top */}
                  <div className={cn(
                    "absolute top-0 left-0 w-full h-1",
                    p.status === "在线" ? "bg-emerald-500" :
                    p.status === "离线" ? "bg-amber-500" :
                    p.status === "异常" ? "bg-red-500" : "bg-neutral-300"
                  )} />

                  <div className="space-y-4">
                    {/* Plugin Header info */}
                    <div className="flex justify-between items-start text-xs font-bold select-none">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-black text-neutral-title text-sm block">{p.name}</span>
                          <span className="text-[10px] text-neutral-caption font-mono">v{p.version}</span>
                        </div>
                        <span className="text-[10px] text-neutral-caption block font-semibold mt-1">种类: {p.type}</span>
                      </div>

                      {/* Status Tag */}
                      <span className={cn(
                        "px-2 py-0.5 rounded-[4px] text-[9.5px] font-black border uppercase tracking-wider font-sans shrink-0 scale-90",
                        p.status === "在线" ? "bg-emerald-50 border-emerald-200 text-emerald-600" :
                        p.status === "离线" ? "bg-amber-50 border-amber-200 text-amber-600" :
                        p.status === "异常" ? "bg-red-50 border-red-200 text-red-600" : "bg-neutral-50 border-neutral-200 text-neutral-400"
                      )}>
                        {p.status}
                      </span>
                    </div>

                    {/* Technical details parameters snippet */}
                    <div className="bg-neutral-50/50 p-4 rounded-lg border border-neutral-100/60 grid grid-cols-2 gap-4 text-xs text-neutral-body">
                      <div>
                        <strong className="text-[10px] text-neutral-caption block">服务连接地址 Host:</strong>
                        <span className="font-mono text-[11px] block mt-0.5 font-bold truncate" title={p.host}>{p.host}</span>
                      </div>
                      <div>
                        <strong className="text-[10px] text-neutral-caption block">网关端口 Port:</strong>
                        <span className="font-mono text-[11px] block mt-0.5 font-bold">{p.port}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions templates triggers */}
                  <div className="pt-4 mt-5 border-t border-neutral-100 flex flex-wrap items-center justify-between gap-3 shrink-0 text-xs font-bold">
                    
                    {/* Status updater updates */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleTogglePluginInstall(p.id, p.name, p.status)}
                        className={cn(
                          "px-2.5 py-1.5 border rounded-lg cursor-pointer transition-colors shadow-3xs",
                          p.status === "已卸载" 
                            ? "border-emerald-200 bg-emerald-50 text-emerald-500 hover:bg-emerald-100" 
                            : "border-red-200 bg-red-50 text-red-500 hover:bg-red-100"
                        )}
                      >
                        {p.status === "已卸载" ? "安装/激活" : "卸载插件"}
                      </button>
                      
                      {p.status !== "已卸载" && (
                        <button
                          onClick={() => handleOpenConfig(p)}
                          className="px-2.5 py-1.5 border border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-title rounded-lg cursor-pointer transition-colors shadow-3xs"
                        >
                          连接配置
                        </button>
                      )}
                    </div>

                    <div className="flex gap-2">
                      {p.status !== "已卸载" && (
                        <button
                          onClick={() => handleSimulateLogView(p)}
                          className="px-2.5 py-1.5 text-neutral-body hover:text-neutral-title hover:bg-neutral-100 rounded-lg cursor-pointer transition-colors flex items-center gap-1 border border-neutral-200 bg-white shadow-3xs"
                        >
                          <Terminal className="w-3.5 h-3.5" />
                          <span>查看日志</span>
                        </button>
                      )}

                      {/* Version update */}
                      {p.hasUpdate && p.status !== "已卸载" && (
                        <button
                          onClick={() => handleUpdatePluginVersion(p)}
                          className="bg-[#fff2e8] hover:bg-[#ffe8d6] text-[#fa541c] px-2.5 py-1.5 border border-[#ffbb96]/45 rounded-lg cursor-pointer transition-all flex items-center gap-1 shadow-3xs animate-pulse"
                        >
                          <RefreshCw className="w-3 h-3" />
                          <span>有新版本更新</span>
                        </button>
                      )}
                    </div>

                  </div>

                </div>
              ))}
            </div>

            {/* --- Plugin Connection Configuration Modal --- */}
            {showConfigModal && selectedPlugin && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 backdrop-blur-xs p-4 animate-fade-in">
                <form onSubmit={handleSaveConfig} className="w-full max-w-[450px] bg-white rounded-xl shadow-2xl overflow-hidden animate-scale-up flex flex-col text-xs">
                  
                  {/* Header */}
                  <div className="bg-neutral-50 px-6 py-4 border-b border-neutral-border flex items-center justify-between shrink-0">
                    <span className="font-black text-neutral-title text-sm flex items-center gap-1.5">
                      <Settings className="w-4.5 h-4.5 text-[#fa541c]" />
                      <span>配置「{selectedPlugin.name}」连接参数</span>
                    </span>
                    <button 
                      type="button"
                      onClick={() => setShowConfigModal(false)}
                      className="text-neutral-400 hover:text-neutral-700 cursor-pointer"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Body inputs */}
                  <div className="p-6 space-y-4">
                    
                    <div className="grid grid-cols-3 gap-4">
                      <div className="col-span-2 space-y-1.5">
                        <label className="font-bold text-neutral-700 block">服务主机 Host/Endpoint：</label>
                        <input
                          type="text"
                          required
                          value={formHost}
                          onChange={(e) => setFormHost(e.target.value)}
                          className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-xs font-mono font-bold text-neutral-title bg-white"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="font-bold text-neutral-700 block">连接端口 Port：</label>
                        <input
                          type="text"
                          required
                          value={formPort}
                          onChange={(e) => setFormPort(e.target.value)}
                          className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-xs font-mono font-bold text-neutral-title bg-white text-center"
                        />
                      </div>
                    </div>

                    {/* Token Key */}
                    <div className="space-y-1.5">
                      <label className="font-bold text-neutral-700 block flex items-center gap-1">
                        <Key className="w-3.5 h-3.5 text-[#fa541c]" />
                        <span>连接身份凭证 Token / API Key：</span>
                      </label>
                      <input
                        type="password"
                        required
                        value={formToken}
                        onChange={(e) => setFormToken(e.target.value)}
                        className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-xs font-mono bg-white"
                      />
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="px-6 py-4 bg-neutral-50 border-t border-neutral-border flex items-center justify-end gap-3 shrink-0">
                    <button
                      type="button"
                      onClick={() => setShowConfigModal(false)}
                      className="bg-white hover:bg-neutral-100 text-neutral-title font-bold px-4 py-2 border border-neutral-border rounded-lg cursor-pointer transition-colors"
                    >
                      取消
                    </button>
                    <button
                      type="submit"
                      className="bg-[#fa541c] hover:bg-[#e84a15] text-white font-bold px-5 py-2 rounded-lg cursor-pointer transition-colors shadow-sm"
                    >
                      保存并建立握手
                    </button>
                  </div>

                </form>
              </div>
            )}

            {/* --- Plugin live Terminal log modal --- */}
            {showLogModal && selectedPlugin && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 backdrop-blur-xs p-4 animate-fade-in">
                <div className="w-full max-w-[580px] bg-neutral-900 rounded-xl shadow-2xl overflow-hidden animate-scale-up flex flex-col text-xs border border-neutral-800">
                  
                  {/* Header */}
                  <div className="bg-neutral-950 px-6 py-4 border-b border-neutral-800 flex items-center justify-between shrink-0">
                    <span className="font-bold text-neutral-200 text-sm flex items-center gap-2">
                      <Terminal className="w-4.5 h-4.5 text-[#fa541c]" />
                      <span>「{selectedPlugin.name}」网关连接实时通道日志</span>
                    </span>
                    <button 
                      onClick={() => setShowLogModal(false)}
                      className="text-neutral-400 hover:text-neutral-200 cursor-pointer bg-transparent border-0 font-bold"
                    >
                      ✕
                    </button>
                  </div>

                  {/* Terminal shell */}
                  <div className="p-6 bg-neutral-950 font-mono text-[11px] leading-relaxed text-emerald-400 h-64 overflow-y-auto custom-scrollbar flex flex-col gap-1.5">
                    {logLogs.length === 0 ? (
                      <div className="h-full flex items-center justify-center text-neutral-600 select-none">
                        <span>正在握手建立隧道...</span>
                      </div>
                    ) : (
                      logLogs.map((log, i) => (
                        <div key={i} className={cn(
                          log.startsWith("[success]") ? "text-emerald-400" : "text-neutral-300"
                        )}>
                          {log}
                        </div>
                      ))
                    )}
                    <div ref={terminalEndRef} />
                  </div>

                  {/* Footer */}
                  <div className="px-6 py-4 bg-neutral-900 border-t border-neutral-800 flex items-center justify-between shrink-0">
                    <span className="text-[10px] text-neutral-500 font-mono">DAEMON CLIENT ACTIVE</span>
                    <button 
                      onClick={() => handleSimulateLogView(selectedPlugin)}
                      className="text-neutral-300 hover:text-white font-bold bg-transparent border border-neutral-700 hover:border-neutral-500 px-4 py-1.5 rounded cursor-pointer transition-colors text-[10.5px] font-mono flex items-center gap-1.5 shadow-3xs"
                    >
                      <RefreshCcw className="w-3 h-3" />
                      <span>RETRY CONNECTION HANDSHAKE</span>
                    </button>
                  </div>

                </div>
              </div>
            )}

          </div>
        )}

        {/* ==================== 4. 管理端平台级监控管理 ==================== */}
        {activeTab === "monitor" && (
          <div className="space-y-6 flex flex-col flex-1 min-h-0 animate-slide-up">
            
            {/* Header + alarm thresholds config input */}
            <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 shrink-0 border-b border-neutral-200 pb-4">
              <div>
                <h1 className="text-lg font-black text-neutral-title flex items-center gap-2">
                  <Activity className="w-5.5 h-5.5 text-[#fa541c]" />
                  <span>平台微服务级系统监控</span>
                </h1>
                <p className="text-xs text-neutral-caption mt-1">
                  实时监控大语言模型算力沙箱、API核心网关、鉴权中心的宿主机利用率参数，并执行高危告警阈值配置与告警排除。
                </p>
              </div>

              {/* Threshold limits settings */}
              <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-neutral-body">
                <div className="flex items-center gap-1.5 bg-white p-2 rounded-lg border border-neutral-200 shadow-3xs">
                  <span>CPU 告警阀值:</span>
                  <input
                    type="number"
                    min={50}
                    max={98}
                    value={alarmCpuThreshold}
                    onChange={(e) => {
                      setAlarmCpuThreshold(parseInt(e.target.value) || 85);
                      triggerToast(`🔄 CPU 告警阈值已更新为 ${e.target.value}%`);
                    }}
                    className="w-12 text-center border-0 border-b border-neutral-300 focus:outline-none focus:border-[#fa541c] font-mono"
                  />
                  <span>%</span>
                </div>

                <div className="flex items-center gap-1.5 bg-white p-2 rounded-lg border border-neutral-200 shadow-3xs">
                  <span>内存 告警阀值:</span>
                  <input
                    type="number"
                    min={50}
                    max={98}
                    value={alarmRamThreshold}
                    onChange={(e) => {
                      setAlarmRamThreshold(parseInt(e.target.value) || 90);
                      triggerToast(`🔄 内存 告警阈值已更新为 ${e.target.value}%`);
                    }}
                    className="w-12 text-center border-0 border-b border-neutral-300 focus:outline-none focus:border-[#fa541c] font-mono"
                  />
                  <span>%</span>
                </div>
              </div>
            </div>

            {/* Dials & Gauges Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-5 shrink-0">
              {[
                { title: "宿主机 CPU 利用率", value: "45 %", pct: 45, alert: false, color: "text-emerald-500" },
                { title: "物理内存 利用率", value: "68 %", pct: 68, alert: false, color: "text-blue-500" },
                { title: "系统固态磁盘 占用率", value: "52 %", pct: 52, alert: false, color: "text-purple-500" },
                { title: "网络下行吞吐率", value: "12.4 MB/s", pct: 85, alert: true, color: "text-amber-500" }
              ].map((card, idx) => (
                <div key={idx} className="bg-white p-5 rounded-xl border border-neutral-border shadow-3xs flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <span className="text-[11px] font-bold text-neutral-caption uppercase tracking-wider">{card.title}</span>
                    {card.alert && (
                      <span className="bg-amber-500 text-white text-[8px] px-1 py-0.5 rounded font-black scale-90">高并发波动</span>
                    )}
                  </div>
                  <div className="my-3">
                    <span className={cn("text-2.5xl font-black font-mono", card.color)}>{card.value}</span>
                  </div>
                  
                  {/* Gauge indicator progress line */}
                  <div className="w-full bg-neutral-100 h-1.5 rounded-full overflow-hidden">
                    <div className={cn(
                      "h-full rounded-full transition-all duration-300",
                      card.pct > alarmCpuThreshold ? "bg-red-500" :
                      card.pct > 70 ? "bg-amber-500" : "bg-emerald-500"
                    )} style={{ width: `${card.pct}%` }}></div>
                  </div>
                </div>
              ))}
            </div>

            {/* Historical charts & Service Health cards */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
              
              {/* Trends analysis line chart (Col span 2) */}
              <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-neutral-border shadow-3xs flex flex-col justify-between h-[360px] lg:h-auto">
                <div className="flex items-center justify-between border-b border-neutral-100 pb-3 mb-4 shrink-0">
                  <span className="text-xs font-bold text-neutral-title flex items-center gap-1.5">
                    <TrendingUp className="w-4 h-4 text-[#fa541c]" />
                    <span>历史监控指标运行趋势走势分析</span>
                  </span>
                  
                  <div className="flex items-center gap-2 text-xs font-bold">
                    <span className="text-neutral-caption">查看指标:</span>
                    <select
                      value={selectedMonitorTrend}
                      onChange={(e) => setSelectedMonitorTrend(e.target.value)}
                      className="border border-neutral-200 rounded px-2 py-0.5 bg-white text-[11px] font-semibold focus:outline-none"
                    >
                      <option value="CPU使用率">CPU使用率走势</option>
                      <option value="网络延迟(ms)">网络通信延迟走势</option>
                    </select>
                  </div>
                </div>

                {/* SVG Area graph line */}
                <div className="flex-1 flex flex-col justify-between py-6 min-h-0">
                  <div className="w-full h-36 relative bg-neutral-50/50 rounded-lg border border-neutral-100 p-2">
                    <svg className="w-full h-full" viewBox="0 0 500 120" preserveAspectRatio="none">
                      <line x1="0" y1="20" x2="500" y2="20" stroke="#f1f5f9" strokeWidth="1" />
                      <line x1="0" y1="60" x2="500" y2="60" stroke="#f1f5f9" strokeWidth="1" />
                      <line x1="0" y1="100" x2="500" y2="100" stroke="#f1f5f9" strokeWidth="1" />

                      <polygon
                        points={`
                          0,120 
                          0,${120 - (initialTrends[selectedMonitorTrend][0] / (selectedMonitorTrend === "CPU使用率" ? 100 : 200)) * 90} 
                          100,${120 - (initialTrends[selectedMonitorTrend][1] / (selectedMonitorTrend === "CPU使用率" ? 100 : 200)) * 90} 
                          200,${120 - (initialTrends[selectedMonitorTrend][2] / (selectedMonitorTrend === "CPU使用率" ? 100 : 200)) * 90} 
                          300,${120 - (initialTrends[selectedMonitorTrend][3] / (selectedMonitorTrend === "CPU使用率" ? 100 : 200)) * 90} 
                          400,${120 - (initialTrends[selectedMonitorTrend][4] / (selectedMonitorTrend === "CPU使用率" ? 100 : 200)) * 90} 
                          500,${120 - (initialTrends[selectedMonitorTrend][5] / (selectedMonitorTrend === "CPU使用率" ? 100 : 200)) * 90} 
                          500,120
                        `}
                        fill="url(#areaGrad)"
                      />

                      <polyline
                        fill="none"
                        stroke="#fa541c"
                        strokeWidth="2.5"
                        points={`
                          0,${120 - (initialTrends[selectedMonitorTrend][0] / (selectedMonitorTrend === "CPU使用率" ? 100 : 200)) * 90} 
                          100,${120 - (initialTrends[selectedMonitorTrend][1] / (selectedMonitorTrend === "CPU使用率" ? 100 : 200)) * 90} 
                          200,${120 - (initialTrends[selectedMonitorTrend][2] / (selectedMonitorTrend === "CPU使用率" ? 100 : 200)) * 90} 
                          300,${120 - (initialTrends[selectedMonitorTrend][3] / (selectedMonitorTrend === "CPU使用率" ? 100 : 200)) * 90} 
                          400,${120 - (initialTrends[selectedMonitorTrend][4] / (selectedMonitorTrend === "CPU使用率" ? 100 : 200)) * 90} 
                          500,${120 - (initialTrends[selectedMonitorTrend][5] / (selectedMonitorTrend === "CPU使用率" ? 100 : 200)) * 90}
                        `}
                      />

                      {initialTrends[selectedMonitorTrend].map((val, i) => (
                        <circle
                          key={i}
                          cx={i * 100}
                          cy={120 - (val / (selectedMonitorTrend === "CPU使用率" ? 100 : 200)) * 90}
                          r="4"
                          fill="white"
                          stroke="#fa541c"
                          strokeWidth="2"
                        />
                      ))}
                    </svg>

                    {initialTrends[selectedMonitorTrend].map((val, i) => (
                      <span
                        key={i}
                        className="absolute text-[8.5px] font-black font-mono text-[#fa541c] bg-white border border-[#ffbb96]/45 px-1 py-0.5 rounded shadow-3xs"
                        style={{
                          left: `${i * 20}%`,
                          bottom: `${(val / (selectedMonitorTrend === "CPU使用率" ? 100 : 200)) * 60 + 10}%`,
                          transform: "translateX(-50%)"
                        }}
                      >
                        {val}{selectedMonitorTrend === "CPU使用率" ? "%" : "ms"}
                      </span>
                    ))}
                  </div>

                  <div className="flex justify-between px-3 text-[10px] text-neutral-caption font-bold">
                    <span>12月</span>
                    <span>1月</span>
                    <span>2月</span>
                    <span>3月</span>
                    <span>4月</span>
                    <span>5月 (当前)</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-neutral-100 flex justify-between items-center shrink-0">
                  <span className="text-[10px] text-neutral-caption font-medium">监控基于 5s 动态拉取健康指标刷新。</span>
                  <button 
                    onClick={() => handleSimulateExport(`Zhiyun_Metrics_History_${selectedMonitorTrend}`)}
                    className="bg-[#fa541c] hover:bg-[#e84a15] text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 shadow-3xs font-sans"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>导出历史趋势报表</span>
                  </button>
                </div>
              </div>

              {/* Service Health Alerts log cards (Col span 1) */}
              <div className="bg-white p-6 rounded-xl border border-neutral-border shadow-3xs flex flex-col justify-between h-[360px] lg:h-auto">
                <div className="flex items-center justify-between border-b border-neutral-100 pb-3 mb-4 shrink-0">
                  <span className="text-xs font-bold text-neutral-title flex items-center gap-1.5">
                    <ShieldAlert className="w-4.5 h-4.5 text-[#fa541c]" />
                    <span>活动中触发警报日志</span>
                  </span>
                  {activeAlerts.length > 0 && (
                    <span className="bg-red-500 text-white text-[9px] px-1.5 py-0.5 rounded font-black scale-90 animate-bounce">{activeAlerts.length}</span>
                  )}
                </div>

                {/* Alarm cards lists */}
                <div className="flex-1 overflow-y-auto space-y-3.5 custom-scrollbar pr-1">
                  {activeAlerts.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center text-neutral-400 gap-2 p-4 select-none">
                      <CheckCircle className="w-8 h-8 text-emerald-400 animate-pulse" />
                      <span className="text-xs">当前系统一切微服务模块运转正常，无任何高风险告警项！</span>
                    </div>
                  ) : (
                    activeAlerts.map((al) => (
                      <div key={al.id} className="p-3 bg-neutral-50 rounded-xl border border-neutral-200/50 space-y-2.5 text-xs">
                        <div className="flex justify-between items-center font-bold">
                          <span className={cn(
                            "px-2 py-0.5 rounded text-[8.5px] font-black border uppercase tracking-wider",
                            al.level === "高危" ? "bg-red-50 border-red-200 text-red-600" : "bg-amber-50 border-amber-200 text-amber-600"
                          )}>{al.level}</span>
                          <span className="text-[10px] text-neutral-caption font-semibold font-mono">{al.time}</span>
                        </div>
                        <p className="text-[11px] font-semibold text-neutral-body leading-normal">{al.content}</p>
                        <button
                          onClick={() => handleResolveAlert(al.id)}
                          className="w-full text-center text-neutral-title border border-neutral-200 bg-white hover:bg-neutral-50 px-2.5 py-1 rounded transition-colors cursor-pointer block font-bold text-[10.5px] shadow-3xs"
                        >
                          标记此警报为“已排查处理”
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ==================== 5. 系统操作日志 ==================== */}
        {activeTab === "logs" && (
          <div className="space-y-6 flex flex-col flex-1 min-h-0 animate-slide-up">
            
            {/* Header */}
            <div className="flex justify-between items-start shrink-0">
              <div>
                <h1 className="text-lg font-black text-neutral-title flex items-center gap-2">
                  <FileText className="w-5.5 h-5.5 text-[#fa541c]" />
                  <span>管理端全量行为审计日志</span>
                </h1>
                <p className="text-xs text-neutral-caption mt-1">
                  安全追踪及审计管理端所有操作人的API执行日志与网络IP请求。支持高风险行为异常标记与导出。
                </p>
              </div>
              
              <button 
                onClick={() => handleSimulateExport("管理端全局行为操作日志")}
                className="bg-[#fa541c] hover:bg-[#e84a15] text-white text-xs font-bold px-4 py-2.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 shadow-3xs"
              >
                <Download className="w-4 h-4 font-black" />
                <span>生成并导出安全审计报告</span>
              </button>
            </div>

            {/* Filter toolbar */}
            <div className="flex flex-col md:flex-row gap-4 shrink-0 justify-between items-center select-none font-bold">
              
              {/* Dropdown Filters */}
              <div className="flex items-center gap-3.5 w-full md:w-auto">
                
                {/* 1. User */}
                <div className="flex items-center gap-2 text-xs text-neutral-body">
                  <span>操作人:</span>
                  <select 
                    value={logSearchUser}
                    onChange={(e) => setLogSearchUser(e.target.value)}
                    className="border border-neutral-200 rounded-lg px-2.5 py-1 bg-white focus:outline-none focus:border-[#fa541c]"
                  >
                    <option value="全部">全部用户</option>
                    <option value="admin">admin (平台超管)</option>
                    <option value="zhang_manager">zhang_manager</option>
                    <option value="li_support">li_support</option>
                    <option value="wang_content">wang_content</option>
                  </select>
                </div>

                {/* 2. Module */}
                <div className="flex items-center gap-2 text-xs text-neutral-body">
                  <span>审计业务模块:</span>
                  <select 
                    value={logSearchModule}
                    onChange={(e) => setLogSearchModule(e.target.value)}
                    className="border border-neutral-200 rounded-lg px-2.5 py-1 bg-white focus:outline-none focus:border-[#fa541c]"
                  >
                    <option value="全部">所有模块</option>
                    <option value="AI配额">AI配额</option>
                    <option value="竞赛管理">竞赛管理</option>
                    <option value="插件管理">插件管理</option>
                    <option value="系统管理">系统管理</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Logs table container */}
            <div className="bg-white rounded-xl border border-neutral-border shadow-3xs overflow-hidden flex-1 flex flex-col min-h-[300px]">
              <div className="overflow-x-auto flex-1 custom-scrollbar">
                <table className="w-full text-left border-collapse min-w-[850px]">
                  <thead>
                    <tr className="bg-neutral-50/50 border-b border-neutral-100 text-[11.5px] text-neutral-600 font-bold uppercase select-none">
                      <th className="px-6 py-4 w-28">操作状态</th>
                      <th className="px-6 py-4">触发时间</th>
                      <th className="px-6 py-4">安全操作人</th>
                      <th className="px-6 py-4">动作指令类型</th>
                      <th className="px-6 py-4">指令目标操作对象</th>
                      <th className="px-6 py-4">客户端 IP 地址</th>
                      <th className="px-6 py-4">执行结果</th>
                      <th className="px-6 py-4 text-center">异常监控</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100 text-xs font-sans">
                    {filteredLogs.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="px-6 py-12 text-center text-neutral-400">
                          <AlertCircle className="w-8 h-8 text-neutral-300 mx-auto mb-2" />
                          <span>没有检索到与当前业务过滤条件匹配的操作日志。</span>
                        </td>
                      </tr>
                    ) : (
                      filteredLogs.map((l) => (
                        <tr 
                          key={l.id} 
                          className={cn(
                            "hover:bg-neutral-50/30 transition-colors",
                            l.abnormal && "bg-red-50/20 text-red-700"
                          )}
                        >
                          
                          {/* Abnormal stripe flag indicator */}
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-1.5 font-bold">
                              {l.abnormal ? (
                                <span className="bg-red-100 text-red-600 text-[9px] font-black px-1.5 py-0.5 rounded flex items-center gap-0.5 shrink-0 scale-90 border border-red-200">
                                  <AlertTriangle className="w-2.5 h-2.5 shrink-0" />
                                  <span>异常标记</span>
                                </span>
                              ) : (
                                <span className="bg-neutral-100 text-neutral-500 text-[9px] font-black px-1.5 py-0.5 rounded uppercase shrink-0 scale-90 border border-neutral-200">安全合规</span>
                              )}
                            </div>
                          </td>

                          {/* Time */}
                          <td className="px-6 py-4 font-mono font-semibold text-neutral-caption">{l.time}</td>
                          
                          {/* Operator */}
                          <td className="px-6 py-4 font-bold text-neutral-title">{l.operator}</td>
                          
                          {/* Type */}
                          <td className="px-6 py-4 font-bold text-neutral-body">{l.type}</td>
                          
                          {/* Target */}
                          <td className="px-6 py-4 font-medium text-neutral-body max-w-[200px] truncate" title={l.target}>{l.target}</td>
                          
                          {/* IP */}
                          <td className="px-6 py-4 font-mono font-semibold text-neutral-caption">{l.ip}</td>
                          
                          {/* Result */}
                          <td className="px-6 py-4 font-semibold">
                            <button
                              onClick={() => setSelectedLogDetail(l)}
                              className={cn(
                                "hover:underline font-bold bg-transparent border-0 cursor-pointer text-xs",
                                l.result === "成功" ? "text-emerald-600" : "text-red-500"
                              )}
                              title="点击查看详细JSON审计"
                            >
                              {l.result} (JSON详情)
                            </button>
                          </td>

                          {/* Anomaly flag control */}
                          <td className="px-6 py-4 text-center">
                            <button
                              onClick={() => handleToggleLogAnomaly(l.id)}
                              className={cn(
                                "text-[10px] font-bold px-2 py-0.5 border rounded cursor-pointer transition-colors shadow-3xs",
                                l.abnormal 
                                  ? "border-emerald-200 bg-emerald-50 text-emerald-500 hover:bg-emerald-100" 
                                  : "border-red-150 bg-red-50/45 text-red-500 hover:bg-red-50"
                              )}
                            >
                              {l.abnormal ? "解除标记" : "标记异常"}
                            </button>
                          </td>

                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Bottom footer total */}
              <div className="bg-neutral-50 px-6 py-3 border-t border-neutral-100 flex justify-between items-center text-xs font-semibold text-neutral-body shrink-0 select-none">
                <span>总共登记审计日志: {filteredLogs.length} 条</span>
                <span className="text-[10px] text-neutral-caption font-medium">提示：任何平台标记为[异常状态]的操作指令，均将自动提报安全审计部。</span>
              </div>
            </div>

            {/* --- Log details JSON Viewer modal dialog --- */}
            {selectedLogDetail && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 backdrop-blur-xs p-4 animate-fade-in">
                <div className="w-full max-w-[500px] bg-white rounded-xl shadow-2xl overflow-hidden animate-scale-up flex flex-col text-xs">
                  
                  {/* Header */}
                  <div className="bg-neutral-50 px-6 py-4 border-b border-neutral-border flex items-center justify-between shrink-0">
                    <span className="font-black text-neutral-title text-sm flex items-center gap-1.5">
                      <FileText className="w-4.5 h-4.5 text-[#fa541c]" />
                      <span>查看操作审计 JSON 传输报文</span>
                    </span>
                    <button 
                      onClick={() => setSelectedLogDetail(null)}
                      className="text-neutral-400 hover:text-neutral-700 cursor-pointer"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* JSON view */}
                  <div className="p-6 space-y-4 max-h-[380px] overflow-y-auto custom-scrollbar select-text">
                    <div className="space-y-1">
                      <div><strong>操作人:</strong> {selectedLogDetail.operator} (IP: {selectedLogDetail.ip})</div>
                      <div><strong>指令目标:</strong> {selectedLogDetail.target} ({selectedLogDetail.module})</div>
                      <div><strong>请求时间:</strong> {selectedLogDetail.time}</div>
                    </div>

                    <div className="border-t border-neutral-100 pt-3 space-y-2">
                      <span className="font-bold text-neutral-700 block">HTTP API 传输报文 (Payload Schema)：</span>
                      <pre className="bg-neutral-900 text-emerald-400 p-4 rounded-lg font-mono text-[10px] leading-relaxed max-h-52 overflow-auto custom-scrollbar select-text">
{`{
  "api_endpoint": "/api/v2/system/${selectedLogDetail.module.toLowerCase()}/execute",
  "method": "POST",
  "operator_username": "${selectedLogDetail.operator}",
  "operator_role": "Platform_Administrator",
  "client_ip_address": "${selectedLogDetail.ip}",
  "target_metadata": {
    "name": "${selectedLogDetail.target}",
    "scope_isolation": "Strict_Isolation_Policy"
  },
  "action_dispatched": "${selectedLogDetail.type}",
  "transaction_result": "${selectedLogDetail.result}",
  "status_code": ${selectedLogDetail.result === "成功" ? 200 : 500},
  "user_agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"
}`}
                      </pre>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="px-6 py-4 bg-neutral-50 border-t border-neutral-border flex items-center justify-end gap-3 shrink-0 select-none">
                    <button
                      type="button"
                      onClick={() => setSelectedLogDetail(null)}
                      className="bg-[#fa541c] hover:bg-[#e84a15] text-white font-bold px-6 py-2 rounded-lg cursor-pointer transition-colors shadow-sm"
                    >
                      确认并关闭
                    </button>
                  </div>

                </div>
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
}
