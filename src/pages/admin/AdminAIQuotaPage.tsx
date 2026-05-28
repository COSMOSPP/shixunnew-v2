import React, { useState } from "react";
import { 
  Sliders, Users, Activity, TrendingUp, Cpu, Server, CheckCircle, 
  AlertTriangle, Search, Plus, Edit, Trash2, Shield, Calendar, X,
  FileText, Play, BarChart2, Download, Filter, AlertCircle, Settings, Check, 
  RefreshCw, Key, Database, ChevronRight, HelpCircle
} from "lucide-react";
import { cn } from "@/lib/utils";

// --- Data Types ---

interface TenantQuota {
  id: string;
  name: string;
  status: "充足" | "警告" | "耗尽" | "封禁隔离";
  usedTokens: number; // in Millions (M)
  allocatedTokens: number; // in Millions (M)
  isolation: "严格独占" | "共享算力";
  billing: "包年包月" | "按量付费";
  concurrency: number; // QPS Limit
  lastUpdated: string;
}

interface QuotaTemplate {
  id: string;
  name: string;
  tokens: number; // in Millions
  concurrency: number; // QPS
  gpu: string;
  billing: string;
  color: string;
  desc: string;
}

// --- Initial Mock Databases ---

const initialTenants: TenantQuota[] = [
  { id: "tenant-1", name: "清华大学计算机系", status: "警告", usedTokens: 132.5, allocatedTokens: 150.0, isolation: "严格独占", billing: "包年包月", concurrency: 100, lastUpdated: "刚刚" },
  { id: "tenant-2", name: "北京大学信息学院", status: "警告", usedTokens: 102.0, allocatedTokens: 120.0, isolation: "严格独占", billing: "包年包月", concurrency: 80, lastUpdated: "5分钟前" },
  { id: "tenant-3", name: "复旦大学软件学院", status: "充足", usedTokens: 65.4, allocatedTokens: 100.0, isolation: "共享算力", billing: "包年包月", concurrency: 50, lastUpdated: "1小时前" },
  { id: "tenant-4", name: "百度智能云研发部", status: "充足", usedTokens: 25.2, allocatedTokens: 80.0, isolation: "严格独占", billing: "按量付费", concurrency: 120, lastUpdated: "今天" },
  { id: "tenant-5", name: "西安交通大学AI实验班", status: "充足", usedTokens: 17.4, allocatedTokens: 50.0, isolation: "共享算力", billing: "按量付费", concurrency: 30, lastUpdated: "昨天" },
  { id: "tenant-6", name: "南京大学智能科学系", status: "耗尽", usedTokens: 40.0, allocatedTokens: 40.0, isolation: "共享算力", billing: "包年包月", concurrency: 40, lastUpdated: "2天前" },
  { id: "tenant-7", name: "哈尔滨工业大学计算学部", status: "封禁隔离", usedTokens: 5.5, allocatedTokens: 60.0, isolation: "共享算力", billing: "包年包月", concurrency: 0, lastUpdated: "3天前" }
];

const initialTemplates: QuotaTemplate[] = [
  { id: "tpl-1", name: "极速入门免费包", tokens: 10, concurrency: 10, gpu: "共享算力池", billing: "包月免费", color: "border-neutral-200 text-neutral-600 bg-neutral-50/55", desc: "主要用于高校新生入学实训、简单AI对话调试。限额10M Tokens/月，支持基础的QPS并发限制。" },
  { id: "tpl-2", name: "高校学术标准版", tokens: 100, concurrency: 50, gpu: "优先调度GPU队列", billing: "包年包月", color: "border-emerald-200 text-emerald-600 bg-emerald-50/40", desc: "适用于常规AI大纲教学、小规模NLP及视觉实训项目。提供100M Tokens配额，支持50并发QPS并发限制。" },
  { id: "tpl-3", name: "高校科研卓越版", tokens: 300, concurrency: 100, gpu: "独占高性能算力组", billing: "包年包月", color: "border-blue-200 text-blue-600 bg-blue-50/40", desc: "面向高阶大模型微调、RAG重排检索优化、大课题组科研实验。300M大容量额度，支持极速100QPS吞吐能力。" },
  { id: "tpl-4", name: "企业级高并发包", tokens: 500, concurrency: 200, gpu: "多区域高可用保障组", billing: "独立按量付费", color: "border-[#ffbb96] text-[#fa541c] bg-[#fff2e8]/45", desc: "针对外部大厂或企业联合实训平台。拥有500M极高Token配额，支持高达200QPS的顶级吞吐响应能力。" }
];

// 6 months trend historical datasets (Dec to May)
const initialTrends: Record<string, number[]> = {
  "全部租户": [120, 150, 180, 220, 290, 388],
  "清华大学计算机系": [40, 55, 68, 85, 110, 132.5],
  "北京大学信息学院": [30, 42, 50, 68, 88, 102],
  "复旦大学软件学院": [20, 28, 35, 42, 55, 65.4],
  "百度智能云研发部": [5, 8, 12, 18, 22, 25.2],
  "西安交通大学AI实验班": [2, 4, 8, 12, 15, 17.4]
};

export default function AdminAIQuotaPage() {
  const [activeTab, setActiveTab] = useState<"overview" | "tenants" | "templates">("overview");

  // --- Dynamic Databases ---
  const [tenants, setTenants] = useState<TenantQuota[]>(initialTenants);
  const [templates, setTemplates] = useState<QuotaTemplate[]>(initialTemplates);

  // --- Filter and Search States ---
  const [tenantSearch, setTenantSearch] = useState("");
  const [tenantStatusFilter, setTenantStatusFilter] = useState("全部");

  // --- Trends Dropdown Selector ---
  const [selectedTrendTenant, setSelectedTrendTenant] = useState("全部租户");

  // --- Create / Edit Drawer Sheet ---
  const [showDrawer, setShowDrawer] = useState(false);
  const [drawerMode, setDrawerMode] = useState<"create" | "edit">("create");
  const [editingTenantId, setEditingTenantId] = useState<string | null>(null);

  // Form States
  const [formName, setFormName] = useState("");
  const [formTokens, setFormTokens] = useState(100);
  const [formConcurrency, setFormConcurrency] = useState(50);
  const [formIsolation, setFormIsolation] = useState<"严格独占" | "共享算力">("共享算力");
  const [formBilling, setFormBilling] = useState<"包年包月" | "按量付费">("包年包月");

  // Template Modal Creator
  const [showTplModal, setShowTplModal] = useState(false);
  const [tplName, setTplName] = useState("");
  const [tplTokens, setTplTokens] = useState(150);
  const [tplConcurrency, setTplConcurrency] = useState(60);
  const [tplGpu, setTplGpu] = useState("共享算力池");
  const [tplDesc, setTplDesc] = useState("");

  // Toast / Download state
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  // --- Calculations ---
  const platformTotalAllocated = tenants.reduce((acc, t) => acc + (t.status === "封禁隔离" ? 0 : t.allocatedTokens), 0);
  const platformTotalConsumed = tenants.reduce((acc, t) => acc + t.usedTokens, 0);
  const avgUsageRate = platformTotalAllocated > 0 ? (platformTotalConsumed / platformTotalAllocated) * 100 : 0;
  const activeTenantsCount = tenants.filter(t => t.status !== "封禁隔离" && t.usedTokens > 0).length;

  // --- Handlers ---

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const handleOpenCreateDrawer = () => {
    setDrawerMode("create");
    setEditingTenantId(null);
    setFormName("");
    setFormTokens(100);
    setFormConcurrency(50);
    setFormIsolation("共享算力");
    setFormBilling("包年包月");
    setShowDrawer(true);
  };

  const handleOpenEditDrawer = (tenant: TenantQuota) => {
    setDrawerMode("edit");
    setEditingTenantId(tenant.id);
    setFormName(tenant.name);
    setFormTokens(tenant.allocatedTokens);
    setFormConcurrency(tenant.concurrency);
    setFormIsolation(tenant.isolation);
    setFormBilling(tenant.billing);
    setShowDrawer(true);
  };

  const handleSaveTenant = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    if (drawerMode === "create") {
      const newId = `tenant-${Date.now()}`;
      
      const newTenant: TenantQuota = {
        id: newId,
        name: formName,
        status: "充足",
        usedTokens: 0.0,
        allocatedTokens: formTokens,
        isolation: formIsolation,
        billing: formBilling,
        concurrency: formConcurrency,
        lastUpdated: "刚刚"
      };

      setTenants([newTenant, ...tenants]);
      triggerToast(`🎉 成功开通租户算力配额：「${formName}」`);
    } else if (drawerMode === "edit" && editingTenantId) {
      setTenants(tenants.map(t => {
        if (t.id === editingTenantId) {
          const usedPct = (t.usedTokens / formTokens) * 100;
          let nextStatus: TenantQuota["status"] = "充足";
          if (t.status === "封禁隔离") {
            nextStatus = "封禁隔离";
          } else if (usedPct >= 100) {
            nextStatus = "耗尽";
          } else if (usedPct >= 80) {
            nextStatus = "警告";
          }

          return {
            ...t,
            name: formName,
            allocatedTokens: formTokens,
            concurrency: formConcurrency,
            isolation: formIsolation,
            billing: formBilling,
            status: nextStatus,
            lastUpdated: "刚刚微调"
          };
        }
        return t;
      }));
      triggerToast(`💾 成功保存更新租户配额参数：「${formName}」`);
    }
    setShowDrawer(false);
  };

  const handleToggleIsolationBan = (id: string, name: string, currentStatus: TenantQuota["status"]) => {
    const nextStatus: TenantQuota["status"] = currentStatus === "封禁隔离" ? "充足" : "封禁隔离";
    
    setTenants(tenants.map(t => {
      if (t.id === id) {
        if (nextStatus === "充足") {
          const usedPct = (t.usedTokens / t.allocatedTokens) * 100;
          const normalStatus: TenantQuota["status"] = usedPct >= 100 ? "耗尽" : usedPct >= 80 ? "警告" : "充足";
          return { ...t, status: normalStatus, concurrency: 50 }; // restore default
        } else {
          return { ...t, status: "封禁隔离", concurrency: 0 };
        }
      }
      return t;
    }));

    triggerToast(nextStatus === "封禁隔离" ? `🚫 已封禁隔离租户「${name}」，其 Token 密钥已失效` : `✅ 已解除隔离，重新激活租户「${name}」的算力网关`);
  };

  // Preset Template loader
  const handleApplyTemplate = (tpl: QuotaTemplate) => {
    setFormTokens(tpl.tokens);
    setFormConcurrency(tpl.concurrency);
    setFormIsolation(tpl.gpu === "独占高性能算力组" ? "严格独占" : "共享算力");
    setFormBilling(tpl.billing === "独立按量付费" ? "按量付费" : "包年包月");
    triggerToast(`⚡ 已成功应用「${tpl.name}」参数预设到当前表单！`);
  };

  // Create Template form handler
  const handleCreateTemplate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tplName.trim()) return;

    const newTpl: QuotaTemplate = {
      id: `tpl-${Date.now()}`,
      name: tplName,
      tokens: tplTokens,
      concurrency: tplConcurrency,
      gpu: tplGpu,
      billing: "包年包月",
      color: "border-[#ffbb96] text-[#fa541c] bg-[#fff2e8]/45",
      desc: tplDesc || `自定义模板配额配置，包含 ${tplTokens}M Tokens limit, ${tplConcurrency} QPS限制。`
    };

    setTemplates([...templates, newTpl]);
    setShowTplModal(false);
    setTplName("");
    setTplDesc("");
    triggerToast(`🎉 成功新建配额分配模板：「${tplName}」`);
  };

  // Simulate usage report downloader
  const handleSimulateExport = (filename: string) => {
    setIsExporting(true);
    triggerToast(`⏳ 正在对平台进行多维度 Token 消费溯源打包...`);
    setTimeout(() => {
      setIsExporting(false);
      triggerToast(`📥 打包完毕！「${filename}_用量审计表.xlsx」已下载至本地。`);
    }, 2000);
  };

  // Filters computed list
  const filteredTenants = tenants.filter(t => {
    const matchesSearch = t.name.toLowerCase().includes(tenantSearch.toLowerCase());
    const matchesStatus = tenantStatusFilter === "全部" || t.status === tenantStatusFilter;
    return matchesSearch && matchesStatus;
  });

  // Ranking calculation sorted descending by usedTokens
  const rankedTenants = [...tenants].sort((a, b) => b.usedTokens - a.usedTokens);

  // SVG Area Trends computations
  const activeTrendData = initialTrends[selectedTrendTenant] || initialTrends["全部租户"];
  const maxTrendVal = Math.max(...activeTrendData);

  return (
    <div className="flex h-full w-full bg-white overflow-hidden text-neutral-800 font-sans">
      
      {/* Left Navigation Sidebar */}
      <div className="w-[240px] border-r border-neutral-border flex-shrink-0 flex flex-col bg-white h-full select-none">
        {/* Title Header */}
        <div className="p-5 border-b border-neutral-border shrink-0 flex items-center gap-2.5">
          <Cpu className="w-5.5 h-5.5 text-[#fa541c]" />
          <div>
            <h2 className="text-sm font-black text-neutral-title leading-tight">AI 配额控制台</h2>
            <span className="text-[10px] text-neutral-caption font-bold">ZHIYUN QUOTA & TOKEN ENGINE</span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto custom-scrollbar">
          {[
            { id: "overview", title: "平台用量监控", icon: TrendingUp },
            { id: "tenants", title: "租户配额分配", icon: Users, badge: tenants.filter(t => t.status === "警告" || t.status === "耗尽").length },
            { id: "templates", title: "配额划分模板", icon: Sliders }
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
        
        {/* Toast Notification Alert */}
        {toastMessage && (
          <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-neutral-900 text-white px-5 py-3 rounded-lg shadow-lg flex items-center gap-2 border border-neutral-800 text-xs font-bold animate-slide-up">
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* ==================== 1. 平台用量监控 ==================== */}
        {activeTab === "overview" && (
          <div className="space-y-6 flex flex-col flex-1 min-h-0 animate-slide-up">
            <div>
              <h1 className="text-lg font-black text-neutral-title flex items-center gap-2">
                <TrendingUp className="w-5.5 h-5.5 text-[#fa541c]" />
                <span>平台 Token 用量监控大盘</span>
              </h1>
              <p className="text-xs text-neutral-caption mt-1">
                监控实训平台总额度承载、各租户 Token 排行消费大户，并溯源六个月来的总体变化趋势与使用负荷率。
              </p>
            </div>

            {/* Platform KPI Scorecard */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-5 shrink-0">
              {[
                { title: "平台总已分配配额", value: `${platformTotalAllocated.toFixed(1)} M`, sub: "基于各租户分配上限总和", color: "text-[#fa541c]" },
                { title: "平台累计总消耗量", value: `${platformTotalConsumed.toFixed(1)} M`, sub: "本月大模型 API 调用量", color: "text-emerald-500" },
                { title: "平台平均使用负载率", value: `${avgUsageRate.toFixed(1)} %`, sub: "处于合理负荷配额安全区间", color: "text-blue-500" },
                { title: "本月 Token 活跃租户", value: `${activeTenantsCount} 个`, sub: "占登记总租户的 85%", color: "text-purple-500" }
              ].map((card, idx) => (
                <div key={idx} className="bg-white p-5 rounded-xl border border-neutral-border shadow-3xs flex flex-col justify-between">
                  <span className="text-[11px] font-bold text-neutral-caption uppercase tracking-wider">{card.title}</span>
                  <div className="my-3">
                    <span className={cn("text-2.5xl font-black font-mono", card.color)}>{card.value}</span>
                  </div>
                  <span className="text-[10px] font-semibold text-neutral-body">{card.sub}</span>
                </div>
              ))}
            </div>

            {/* Split layout: Trends and Ranking list */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
              
              {/* Trends Graph Selector Card (Left Col span 2) */}
              <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-neutral-border shadow-3xs flex flex-col justify-between h-[420px] lg:h-auto">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-neutral-100 pb-3 gap-2 shrink-0">
                  <span className="text-xs font-bold text-neutral-title flex items-center gap-1.5">
                    <Activity className="w-4 h-4 text-[#fa541c]" />
                    <span>Token 消耗量走势变化趋势图 (六个月)</span>
                  </span>
                  
                  {/* Select trend tenant */}
                  <div className="flex items-center gap-2 text-[11px] font-bold">
                    <span className="text-neutral-caption">查看用量详情:</span>
                    <select
                      value={selectedTrendTenant}
                      onChange={(e) => setSelectedTrendTenant(e.target.value)}
                      className="border border-neutral-200 rounded px-2 py-0.5 bg-white focus:outline-none focus:border-[#fa541c] text-[11px] font-semibold"
                    >
                      <option value="全部租户">平台总用量走势</option>
                      {tenants.map(t => (
                        <option key={t.id} value={t.name}>{t.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* SVG Area Line Chart Mockup */}
                <div className="flex-1 flex flex-col justify-between py-6 min-h-0 select-none">
                  {/* SVG Area graph representation */}
                  <div className="w-full h-44 relative bg-neutral-50/45 rounded-lg border border-neutral-100 p-2">
                    <svg className="w-full h-full" viewBox="0 0 500 150" preserveAspectRatio="none">
                      <defs>
                        <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#fa541c" stopOpacity="0.25" />
                          <stop offset="100%" stopColor="#fa541c" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>

                      {/* Grid Horizontal Guidelines */}
                      <line x1="0" y1="30" x2="500" y2="30" stroke="#f1f5f9" strokeWidth="1" />
                      <line x1="0" y1="75" x2="500" y2="75" stroke="#f1f5f9" strokeWidth="1" />
                      <line x1="0" y1="120" x2="500" y2="120" stroke="#f1f5f9" strokeWidth="1" />

                      {/* Area polygon */}
                      <polygon
                        points={`
                          0,150 
                          0,${150 - (activeTrendData[0] / maxTrendVal) * 110} 
                          100,${150 - (activeTrendData[1] / maxTrendVal) * 110} 
                          200,${150 - (activeTrendData[2] / maxTrendVal) * 110} 
                          300,${150 - (activeTrendData[3] / maxTrendVal) * 110} 
                          400,${150 - (activeTrendData[4] / maxTrendVal) * 110} 
                          500,${150 - (activeTrendData[5] / maxTrendVal) * 110} 
                          500,150
                        `}
                        fill="url(#areaGrad)"
                      />

                      {/* Smooth line */}
                      <polyline
                        fill="none"
                        stroke="#fa541c"
                        strokeWidth="2"
                        points={`
                          0,${150 - (activeTrendData[0] / maxTrendVal) * 110} 
                          100,${150 - (activeTrendData[1] / maxTrendVal) * 110} 
                          200,${150 - (activeTrendData[2] / maxTrendVal) * 110} 
                          300,${150 - (activeTrendData[3] / maxTrendVal) * 110} 
                          400,${150 - (activeTrendData[4] / maxTrendVal) * 110} 
                          500,${150 - (activeTrendData[5] / maxTrendVal) * 110}
                        `}
                      />

                      {/* Interactive dots */}
                      {activeTrendData.map((val, i) => (
                        <circle
                          key={i}
                          cx={i * 100}
                          cy={150 - (val / maxTrendVal) * 110}
                          r="4.5"
                          fill="white"
                          stroke="#fa541c"
                          strokeWidth="2.5"
                        />
                      ))}
                    </svg>

                    {/* Numeric Tooltips floating over points */}
                    {activeTrendData.map((val, i) => (
                      <span
                        key={i}
                        className="absolute text-[8.5px] font-black font-mono text-[#fa541c] bg-white border border-[#ffbb96]/45 px-1 py-0.5 rounded shadow-3xs"
                        style={{
                          left: `${i * 20}%`,
                          bottom: `${(val / maxTrendVal) * 73 + 8}%`,
                          transform: "translateX(-50%)"
                        }}
                      >
                        {val.toFixed(1)}M
                      </span>
                    ))}
                  </div>

                  {/* Horizontal months index */}
                  <div className="flex justify-between px-3 text-[10px] text-neutral-caption font-bold">
                    <span>12月</span>
                    <span>1月</span>
                    <span>2月</span>
                    <span>3月</span>
                    <span>4月</span>
                    <span>5月 (当前)</span>
                  </div>
                </div>

                {/* Footer exporter */}
                <div className="pt-4 border-t border-neutral-100 flex justify-between items-center shrink-0">
                  <span className="text-[10px] text-neutral-caption font-semibold">配额严格隔离机制保护中，禁止跨租户非法调用接口。</span>
                  <button 
                    onClick={() => handleSimulateExport(`Zhiyun_AI_Token_Report_${selectedTrendTenant}`)}
                    className="bg-[#fa541c] hover:bg-[#e84a15] text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 shadow-3xs"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>导出该子表用量审计数据</span>
                  </button>
                </div>
              </div>

              {/* Ranking Lists (Right Col) */}
              <div className="bg-white p-6 rounded-xl border border-neutral-border shadow-3xs flex flex-col justify-between h-[420px] lg:h-auto">
                <div className="flex items-center justify-between border-b border-neutral-100 pb-3 mb-4 shrink-0">
                  <span className="text-xs font-bold text-neutral-title flex items-center gap-1.5">
                    <BarChart2 className="w-4 h-4 text-[#fa541c]" />
                    <span>各租户 Token 消耗排行榜</span>
                  </span>
                  <span className="text-[10px] text-neutral-caption font-bold">本月消费大户</span>
                </div>

                {/* Vertical scroll ranked meter bars */}
                <div className="flex-1 overflow-y-auto space-y-3.5 custom-scrollbar pr-1">
                  {rankedTenants.map((t, idx) => {
                    const usageRate = (t.usedTokens / t.allocatedTokens) * 100;
                    return (
                      <div key={t.id} className="space-y-1 text-xs">
                        <div className="flex justify-between items-center font-bold text-neutral-body">
                          <div className="flex items-center gap-1.5 truncate max-w-[150px]">
                            <span className={cn(
                              "w-4.5 h-4.5 inline-flex items-center justify-center rounded-full text-[9px] font-black",
                              idx === 0 ? "bg-amber-100 text-amber-600" :
                              idx === 1 ? "bg-slate-100 text-slate-600" : "bg-neutral-100 text-neutral-500"
                            )}>
                              {idx + 1}
                            </span>
                            <span title={t.name} className="truncate">{t.name}</span>
                          </div>
                          <span className="font-mono text-neutral-title">{t.usedTokens}M / {t.allocatedTokens}M</span>
                        </div>
                        {/* Progress meter */}
                        <div className="w-full bg-neutral-100 h-1.5 rounded-full overflow-hidden">
                          <div 
                            className={cn(
                              "h-full rounded-full transition-all duration-300",
                              t.status === "封禁隔离" ? "bg-neutral-400" :
                              usageRate >= 100 ? "bg-red-500" :
                              usageRate >= 80 ? "bg-[#fa541c]" : "bg-emerald-500"
                            )} 
                            style={{ width: `${Math.min(usageRate, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <button 
                  onClick={() => setActiveTab("tenants")}
                  className="w-full text-center text-[#fa541c] hover:text-[#e84a15] text-xs font-bold py-2 border border-[#ffbb96]/45 bg-[#fff2e8]/45 hover:bg-[#fff2e8] rounded-lg transition-colors cursor-pointer shrink-0 mt-4 block"
                >
                  去管理租户配额分配 ➔
                </button>
              </div>

            </div>
          </div>
        )}

        {/* ==================== 2. 租户配额管理 ==================== */}
        {activeTab === "tenants" && (
          <div className="space-y-6 flex flex-col flex-1 min-h-0 animate-slide-up">
            
            {/* Header section */}
            <div className="flex justify-between items-start shrink-0">
              <div>
                <h1 className="text-lg font-black text-neutral-title flex items-center gap-2">
                  <Users className="w-5.5 h-5.5 text-[#fa541c]" />
                  <span>租户 AI Token 配额分配名册</span>
                </h1>
                <p className="text-xs text-neutral-caption mt-1">
                  平台超级管理员在此开通新租户，或者针对已有高校/企业租户微调月度 Token 资源，以及隔离封禁异常并发账户。
                </p>
              </div>
              <button 
                onClick={handleOpenCreateDrawer}
                className="bg-[#fa541c] hover:bg-[#e84a15] text-white text-xs font-bold px-4 py-2.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 shadow-3xs"
              >
                <Plus className="w-4 h-4 font-black" />
                <span>分配新租户算力配额</span>
              </button>
            </div>

            {/* Filter toolbar */}
            <div className="flex flex-col md:flex-row gap-4 shrink-0 justify-between items-center">
              {/* Search bar */}
              <div className="relative w-full md:w-[280px]">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-neutral-400" />
                <input
                  type="text"
                  placeholder="检索租户单位名称..."
                  value={tenantSearch}
                  onChange={(e) => setTenantSearch(e.target.value)}
                  className="w-full border border-neutral-200 rounded-lg pl-9 pr-4 py-1.5 text-xs focus:outline-none focus:border-[#fa541c] bg-white text-neutral-800 font-medium placeholder-neutral-400"
                />
              </div>

              {/* Status filter selection */}
              <div className="flex items-center gap-2 text-xs font-bold text-neutral-body w-full md:w-auto justify-end">
                <span>配额负荷状态:</span>
                <select 
                  value={tenantStatusFilter}
                  onChange={(e) => setTenantStatusFilter(e.target.value)}
                  className="border border-neutral-200 rounded-lg px-2 py-1 bg-white focus:outline-none focus:border-[#fa541c]"
                >
                  <option value="全部">全部状态</option>
                  <option value="充足">额度充足</option>
                  <option value="警告">额度警告 (&gt;80%)</option>
                  <option value="耗尽">额度已耗尽</option>
                  <option value="封禁隔离">封禁隔离中</option>
                </select>
              </div>
            </div>

            {/* Master Table view */}
            <div className="bg-white rounded-xl border border-neutral-border shadow-3xs overflow-hidden flex-1 flex flex-col min-h-[300px]">
              <div className="overflow-x-auto flex-1 custom-scrollbar">
                <table className="w-full text-left border-collapse min-w-[900px]">
                  <thead>
                    <tr className="bg-neutral-50/50 border-b border-neutral-100 text-[11.5px] text-neutral-600 font-bold uppercase select-none">
                      <th className="px-6 py-4">租户机构名称</th>
                      <th className="px-6 py-4">用量进度 (已消耗 / 总配额)</th>
                      <th className="px-6 py-4">配额使用率</th>
                      <th className="px-6 py-4">并发限制 (QPS)</th>
                      <th className="px-6 py-4">安全隔离级别</th>
                      <th className="px-6 py-4">计费模式</th>
                      <th className="px-6 py-4">最后更新</th>
                      <th className="px-6 py-4 text-center">算力调配</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100 text-xs font-sans">
                    {filteredTenants.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="px-6 py-12 text-center text-neutral-400">
                          <AlertCircle className="w-8 h-8 text-neutral-300 mx-auto mb-2" />
                          <span>没有找到对应分配策略的租户名录记录。</span>
                        </td>
                      </tr>
                    ) : (
                      filteredTenants.map((t) => {
                        const usagePct = (t.usedTokens / t.allocatedTokens) * 100;
                        return (
                          <tr key={t.id} className="hover:bg-neutral-50/30 transition-colors">
                            {/* Name and lock status tag */}
                            <td className="px-6 py-4 max-w-[200px]">
                              <div className="flex items-center gap-2">
                                <span className="font-black text-neutral-title block truncate" title={t.name}>{t.name}</span>
                                {t.status === "封禁隔离" && (
                                  <span className="bg-red-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded uppercase shrink-0 scale-90">封禁</span>
                                )}
                              </div>
                            </td>
                            
                            {/* Usage meter */}
                            <td className="px-6 py-4">
                              <div className="space-y-1.5 max-w-[180px]">
                                <span className="font-mono text-neutral-body block font-bold">
                                  {t.usedTokens.toFixed(1)} M / {t.allocatedTokens.toFixed(1)} M Tokens
                                </span>
                                <div className="w-full bg-neutral-100 h-1.5 rounded-full overflow-hidden">
                                  <div 
                                    className={cn(
                                      "h-full rounded-full transition-all duration-300",
                                      t.status === "封禁隔离" ? "bg-neutral-400" :
                                      usagePct >= 100 ? "bg-red-500" :
                                      usagePct >= 80 ? "bg-[#fa541c]" : "bg-emerald-500"
                                    )} 
                                    style={{ width: `${Math.min(usagePct, 100)}%` }}
                                  ></div>
                                </div>
                              </div>
                            </td>

                            {/* Percentage Rate tag */}
                            <td className="px-6 py-4">
                              <span className={cn(
                                "px-2.5 py-0.5 rounded-[4px] text-[10.5px] font-black border uppercase tracking-wider font-mono",
                                t.status === "封禁隔离" ? "bg-neutral-50 border-neutral-200 text-neutral-500" :
                                usagePct >= 100 ? "bg-red-50 border-red-200 text-red-600 animate-pulse" :
                                usagePct >= 80 ? "bg-orange-50 border-orange-200 text-[#fa541c]" : "bg-emerald-50 border-emerald-200 text-emerald-600"
                              )}>
                                {usagePct.toFixed(1)}%
                              </span>
                            </td>

                            {/* Concurrency limit */}
                            <td className="px-6 py-4 font-mono font-bold text-neutral-body">
                              {t.concurrency === 0 ? "-" : `${t.concurrency} QPS`}
                            </td>

                            {/* Safety Isolation policy */}
                            <td className="px-6 py-4 font-semibold text-neutral-body">
                              <span className={cn(
                                "inline-flex items-center gap-1 text-[11px]",
                                t.isolation === "严格独占" ? "text-blue-600" : "text-neutral-500"
                              )}>
                                <Shield className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                                <span>{t.isolation}</span>
                              </span>
                            </td>

                            {/* Billing */}
                            <td className="px-6 py-4 font-medium text-neutral-caption">
                              {t.billing}
                            </td>

                            {/* Last updated */}
                            <td className="px-6 py-4 font-mono text-[10px] text-neutral-caption font-semibold">
                              {t.lastUpdated}
                            </td>

                            {/* Actions panel */}
                            <td className="px-6 py-4 text-center">
                              <div className="flex items-center justify-center gap-3">
                                <button
                                  onClick={() => handleOpenEditDrawer(t)}
                                  className="text-[#fa541c] hover:text-[#e84a15] font-bold flex items-center gap-1 cursor-pointer"
                                  title="单独修改算力分配"
                                >
                                  <Sliders className="w-3.5 h-3.5" />
                                  <span>配额调整</span>
                                </button>
                                <button
                                  onClick={() => handleToggleIsolationBan(t.id, t.name, t.status)}
                                  className={cn(
                                    "font-bold flex items-center gap-1 cursor-pointer text-xs",
                                    t.status === "封禁隔离" ? "text-emerald-600 hover:text-emerald-800" : "text-red-500 hover:text-red-700"
                                  )}
                                  title={t.status === "封禁隔离" ? "解除封禁激活网关" : "封禁租户隔离Token"}
                                >
                                  {t.status === "封禁隔离" ? "解除封禁" : "隔离封禁"}
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

              {/* Bottom total counts */}
              <div className="bg-neutral-50 px-6 py-3 border-t border-neutral-100 flex justify-between items-center text-xs font-semibold text-neutral-body shrink-0 select-none">
                <span>总共登记 AI 算力租户: {tenants.length} 家</span>
                <button
                  onClick={() => handleSimulateExport("租户月度Token分配总报表")}
                  className="text-[#fa541c] hover:text-[#e84a15] font-bold flex items-center gap-1.5 cursor-pointer bg-white px-3 py-1 border border-neutral-200 rounded-lg shadow-3xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>导出租户配额名册</span>
                </button>
              </div>

            </div>

            {/* --- Sliding Drawer for Custom Allocation & Adjustment (ZhiYun Premium) --- */}
            {showDrawer && (
              <div className="fixed inset-0 z-50 overflow-hidden flex justify-end bg-black/35 backdrop-blur-xs animate-fade-in">
                
                {/* Click outside backdrop close handler */}
                <div className="flex-1" onClick={() => setShowDrawer(false)}></div>

                {/* Main Form container sliding in */}
                <div className="w-full max-w-[500px] bg-white h-full shadow-2xl flex flex-col justify-between animate-slide-left">
                  
                  {/* Drawer Header */}
                  <div className="p-6 border-b border-neutral-border flex items-center justify-between shrink-0 bg-neutral-50">
                    <div className="flex items-center gap-2">
                      <Cpu className="w-5.5 h-5.5 text-[#fa541c]" />
                      <h2 className="text-base font-black text-neutral-title">
                        {drawerMode === "create" ? "开通分配租户 AI 算力额度" : "单独微调租户配额参数"}
                      </h2>
                    </div>
                    <button 
                      onClick={() => setShowDrawer(false)}
                      className="p-1 rounded-full text-neutral-400 hover:bg-neutral-200 hover:text-neutral-700 cursor-pointer"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Drawer Body Scroll Container */}
                  <form onSubmit={handleSaveTenant} className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar text-xs">
                    
                    {/* Header isolation notice */}
                    <div className="p-4 bg-[#fff2e8] border border-[#ffbb96]/45 rounded-lg space-y-1 font-medium leading-relaxed">
                      <span className="text-[#fa541c] font-black block">🔐 平台配额严格隔离机制保护中:</span>
                      <p className="text-[10.5px] text-neutral-body">
                        配额额度在此为严格独占策略。任何租户的增加/减少均只能向平台超级总备用池中申请扩展，严禁任意在两个高校租户之间进行跨租户拼凑划拨。
                      </p>
                    </div>

                    {/* Section 1: Tenant base */}
                    <div className="space-y-4">
                      <h3 className="font-black text-neutral-title text-sm border-l-3 border-[#fa541c] pl-2">1. 租户信息及开通类别</h3>
                      
                      {/* Tenant Name */}
                      <div className="space-y-1.5">
                        <label className="font-bold text-neutral-700 block">
                          <span className="text-red-500 font-black mr-0.5">*</span> 租户单位机构名称：
                        </label>
                        <input
                          type="text"
                          required
                          value={formName}
                          onChange={(e) => setFormName(e.target.value)}
                          placeholder="例如: 浙江大学软件学院"
                          className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#fa541c] bg-white text-neutral-800 placeholder-neutral-400 font-medium"
                        />
                      </div>

                      {/* Apply preset templates dropdown */}
                      <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200/50 space-y-2">
                        <label className="font-bold text-neutral-title block flex items-center gap-1">
                          <Sliders className="w-3.5 h-3.5 text-[#fa541c]" />
                          <span>一键匹配加载配额配置模板：</span>
                        </label>
                        <div className="flex flex-wrap gap-2.5">
                          {templates.slice(0, 4).map((tpl) => (
                            <button
                              key={tpl.id}
                              type="button"
                              onClick={() => handleApplyTemplate(tpl)}
                              className="px-2.5 py-1 bg-white hover:bg-neutral-100 text-neutral-title border border-neutral-200 rounded text-[10.5px] font-semibold transition-colors cursor-pointer shadow-3xs"
                            >
                              {tpl.name.replace("包", "").replace("版", "")}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Section 2: Quota params */}
                    <div className="space-y-4 pt-4 border-t border-neutral-100">
                      <h3 className="font-black text-neutral-title text-sm border-l-3 border-[#fa541c] pl-2">2. Token配额与QPS并发微调</h3>
                      
                      {/* Allocated Token Sliders */}
                      <div className="space-y-2.5">
                        <div className="flex justify-between font-bold text-neutral-700">
                          <span>月度 AI Token 配额上限：</span>
                          <span className="font-mono text-[#fa541c] text-sm font-black">{formTokens} M Tokens</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <input
                            type="range"
                            min={10}
                            max={1000}
                            step={10}
                            value={formTokens}
                            onChange={(e) => setFormTokens(parseInt(e.target.value) || 10)}
                            className="flex-1 accent-[#fa541c] cursor-pointer"
                          />
                          <input
                            type="number"
                            min={10}
                            max={1000}
                            value={formTokens}
                            onChange={(e) => setFormTokens(parseInt(e.target.value) || 10)}
                            className="w-20 border border-neutral-200 rounded px-2 py-1 text-center font-mono font-bold bg-neutral-50 text-neutral-800"
                          />
                        </div>
                      </div>

                      {/* Concurrency QPS */}
                      <div className="space-y-2.5">
                        <div className="flex justify-between font-bold text-neutral-700">
                          <span>租户最大请求吞吐并发并发并发并发并发并发并发并发并发上限：</span>
                          <span className="font-mono text-[#fa541c] text-sm font-black">{formConcurrency} QPS</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <input
                            type="range"
                            min={5}
                            max={500}
                            step={5}
                            value={formConcurrency}
                            onChange={(e) => setFormConcurrency(parseInt(e.target.value) || 5)}
                            className="flex-1 accent-[#fa541c] cursor-pointer"
                          />
                          <input
                            type="number"
                            min={5}
                            max={500}
                            value={formConcurrency}
                            onChange={(e) => setFormConcurrency(parseInt(e.target.value) || 5)}
                            className="w-20 border border-neutral-200 rounded px-2 py-1 text-center font-mono font-bold bg-neutral-50 text-neutral-800"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Section 3: Isolation settings */}
                    <div className="space-y-4 pt-4 border-t border-neutral-100">
                      <h3 className="font-black text-neutral-title text-sm border-l-3 border-[#fa541c] pl-2">3. 安全独占策略与结算形式</h3>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="font-bold text-neutral-700 block">GPU 算力隔离策略：</label>
                          <select
                            value={formIsolation}
                            onChange={(e) => setFormIsolation(e.target.value as any)}
                            className="w-full border border-neutral-200 rounded-lg px-3 py-2 bg-white text-neutral-800 font-medium"
                          >
                            <option value="共享算力">共享算力 (多租户共池)</option>
                            <option value="严格独占">严格独占 (物理显卡独占)</option>
                          </select>
                        </div>

                        <div className="space-y-1.5">
                          <label className="font-bold text-neutral-700 block">租户计费模式：</label>
                          <select
                            value={formBilling}
                            onChange={(e) => setFormBilling(e.target.value as any)}
                            className="w-full border border-neutral-200 rounded-lg px-3 py-2 bg-white text-neutral-800 font-medium"
                          >
                            <option value="包年包月">包年包月 (合约套餐)</option>
                            <option value="按量付费">按量付费 (即时充值扣减)</option>
                          </select>
                        </div>
                      </div>
                    </div>

                  </form>

                  {/* Drawer Footer Actions */}
                  <div className="p-6 border-t border-neutral-border bg-neutral-50 flex items-center justify-end gap-3 shrink-0">
                    <button
                      type="button"
                      onClick={() => setShowDrawer(false)}
                      className="bg-white hover:bg-neutral-100 text-neutral-title font-bold px-4 py-2 border border-neutral-border rounded-lg cursor-pointer transition-colors shadow-3xs"
                    >
                      取消
                    </button>
                    <button
                      type="submit"
                      onClick={handleSaveTenant}
                      className="bg-[#fa541c] hover:bg-[#e84a15] text-white font-bold px-6 py-2 rounded-lg cursor-pointer transition-colors shadow-sm"
                    >
                      {drawerMode === "create" ? "开通并激活配额" : "保存微调值"}
                    </button>
                  </div>

                </div>
              </div>
            )}

          </div>
        )}

        {/* ==================== 3. 配额划分模板 ==================== */}
        {activeTab === "templates" && (
          <div className="space-y-6 flex flex-col flex-1 min-h-0 animate-slide-up">
            
            {/* Header */}
            <div className="flex justify-between items-start shrink-0">
              <div>
                <h1 className="text-lg font-black text-neutral-title flex items-center gap-2">
                  <Sliders className="w-5.5 h-5.5 text-[#fa541c]" />
                  <span>AI 配额分配划分模板</span>
                </h1>
                <p className="text-xs text-neutral-caption mt-1">
                  预先定义标准的月度算力划分套餐包。在为新入驻院校或企业分配算力时，可进行一键模板应用，减少繁杂的手工设定时间。
                </p>
              </div>
              <button 
                onClick={() => setShowTplModal(true)}
                className="bg-[#fa541c] hover:bg-[#e84a15] text-white text-xs font-bold px-4 py-2.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 shadow-3xs"
              >
                <Plus className="w-4 h-4 font-black" />
                <span>新建分配模板</span>
              </button>
            </div>

            {/* Template Card Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1 overflow-y-auto custom-scrollbar pr-1">
              {templates.map((tpl) => (
                <div key={tpl.id} className="bg-white rounded-xl border border-neutral-border shadow-3xs p-6 flex flex-col justify-between relative overflow-hidden transition-all duration-200 hover:shadow-xs">
                  
                  {/* Color strip background top */}
                  <div className="absolute top-0 left-0 w-full h-1 bg-neutral-200" />
                  
                  <div className="space-y-4">
                    {/* Header name */}
                    <div className="flex justify-between items-start text-xs">
                      <div>
                        <span className="font-black text-neutral-title text-sm block">{tpl.name}</span>
                        <span className="text-[10px] text-neutral-caption block font-semibold mt-0.5">Template ID: {tpl.id}</span>
                      </div>
                      
                      {/* Visual colored tag */}
                      <span className={cn(
                        "px-2 py-0.5 rounded-[4px] text-[9.5px] font-black border uppercase tracking-wider font-sans shrink-0 scale-90",
                        tpl.color
                      )}>
                        {tpl.billing}
                      </span>
                    </div>

                    {/* Desc */}
                    <p className="text-neutral-body leading-relaxed text-[11px] font-semibold">{tpl.desc}</p>

                    {/* Metric specs */}
                    <div className="bg-neutral-50/50 p-4 rounded-lg text-xs grid grid-cols-3 gap-4 border border-neutral-100/60 text-neutral-body">
                      <div>
                        <span className="text-[10px] text-neutral-caption block font-bold">Token分配额:</span>
                        <span className="font-mono text-sm font-black text-[#fa541c] mt-0.5 block">{tpl.tokens} M</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-neutral-caption block font-bold">最大并发并发:</span>
                        <span className="font-mono text-sm font-black text-neutral-title mt-0.5 block">{tpl.concurrency} QPS</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-neutral-caption block font-bold">GPU调度算力:</span>
                        <span className="font-semibold text-neutral-title text-[11px] mt-1.5 block truncate" title={tpl.gpu}>{tpl.gpu}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions template */}
                  <div className="pt-5 mt-5 border-t border-neutral-100 flex justify-end gap-3.5 shrink-0 text-xs font-bold">
                    <button
                      onClick={() => {
                        // Bulk apply mockup
                        triggerToast(`👥 已选择模板「${tpl.name}」，已批量应用于新入学租户配置队列。`);
                      }}
                      className="text-neutral-caption hover:text-neutral-title transition-colors cursor-pointer bg-white px-3 py-1.5 border border-neutral-200 rounded-lg shadow-3xs"
                    >
                      批量应用此模板
                    </button>
                    <button
                      onClick={() => {
                        // Delete template mockup
                        if (confirm(`确定要删除此配额模板吗？「${tpl.name}」`)) {
                          setTemplates(templates.filter(t => t.id !== tpl.id));
                          triggerToast(`🗑️ 已成功废弃配额模板：「${tpl.name}」`);
                        }
                      }}
                      className="text-red-500 hover:text-red-700 transition-colors cursor-pointer bg-red-50/50 hover:bg-red-50 px-3 py-1.5 border border-red-200 rounded-lg shadow-3xs"
                    >
                      删除模板
                    </button>
                  </div>

                </div>
              ))}
            </div>

            {/* --- Template Creator Modal Dialog --- */}
            {showTplModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 backdrop-blur-xs p-4 animate-fade-in">
                <form onSubmit={handleCreateTemplate} className="w-full max-w-[480px] bg-white rounded-xl shadow-2xl overflow-hidden animate-scale-up flex flex-col text-xs">
                  
                  {/* Header */}
                  <div className="bg-neutral-50 px-6 py-4 border-b border-neutral-border flex items-center justify-between shrink-0">
                    <span className="font-black text-neutral-title text-sm flex items-center gap-1.5">
                      <Sliders className="w-4.5 h-4.5 text-[#fa541c]" />
                      <span>新增配额分配模板</span>
                    </span>
                    <button 
                      type="button"
                      onClick={() => setShowTplModal(false)}
                      className="text-neutral-400 hover:text-neutral-700 cursor-pointer"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Body Inputs scrollable */}
                  <div className="p-6 space-y-4 overflow-y-auto max-h-[400px] custom-scrollbar">
                    
                    {/* Name */}
                    <div className="space-y-1.5">
                      <label className="font-bold text-neutral-700 block">模板名称配置：</label>
                      <input
                        type="text"
                        required
                        value={tplName}
                        onChange={(e) => setTplName(e.target.value)}
                        placeholder="例如: 高校大模型科研增强模板"
                        className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#fa541c] bg-white text-neutral-800"
                      />
                    </div>

                    {/* Numeric tokens & concurrency limits */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="font-bold text-neutral-700 block font-mono">Token额度上限(M)：</label>
                        <input
                          type="number"
                          required
                          min={1}
                          max={5000}
                          value={tplTokens}
                          onChange={(e) => setTplTokens(parseInt(e.target.value) || 100)}
                          className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-xs bg-white text-neutral-800 font-mono font-bold"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="font-bold text-neutral-700 block font-mono">并发上限限制(QPS)：</label>
                        <input
                          type="number"
                          required
                          min={1}
                          max={1000}
                          value={tplConcurrency}
                          onChange={(e) => setTplConcurrency(parseInt(e.target.value) || 50)}
                          className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-xs bg-white text-neutral-800 font-mono font-bold"
                        />
                      </div>
                    </div>

                    {/* GPU Allocation type */}
                    <div className="space-y-1.5">
                      <label className="font-bold text-neutral-700 block">显存算力隔离策略级别：</label>
                      <select
                        value={tplGpu}
                        onChange={(e) => setTplGpu(e.target.value)}
                        className="w-full border border-neutral-200 rounded-lg px-3 py-2 bg-white text-neutral-800 font-medium animate-none"
                      >
                        <option value="共享算力池">共享算力池 (多租户物理拼凑共用)</option>
                        <option value="独占高性能算力组">独占高性能算力组 (物理块安全硬隔离组)</option>
                      </select>
                    </div>

                    {/* Desc */}
                    <div className="space-y-1.5">
                      <label className="font-bold text-neutral-700 block">配额模板主旨描述：</label>
                      <textarea
                        rows={3}
                        value={tplDesc}
                        onChange={(e) => setTplDesc(e.target.value)}
                        placeholder="描述该模板对应的适用高校阶段或商业合约场景，帮助以后分配配额快速参考..."
                        className="w-full border border-neutral-200 rounded-lg p-2 focus:outline-none focus:border-[#fa541c] bg-white text-neutral-800 placeholder-neutral-400 font-semibold leading-relaxed resize-none"
                      />
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="px-6 py-4 bg-neutral-50 border-t border-neutral-border flex items-center justify-end gap-3 shrink-0">
                    <button
                      type="button"
                      onClick={() => setShowTplModal(false)}
                      className="bg-white hover:bg-neutral-100 text-neutral-title font-bold px-4 py-2 border border-neutral-border rounded-lg cursor-pointer transition-colors shadow-3xs"
                    >
                      取消
                    </button>
                    <button
                      type="submit"
                      className="bg-[#fa541c] hover:bg-[#e84a15] text-white font-bold px-5 py-2 rounded-lg cursor-pointer transition-colors shadow-sm"
                    >
                      确认发布模板
                    </button>
                  </div>

                </form>
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
}
