import React, { useState, useEffect } from "react";
import { 
  Key, Shield, Users, Layers, Activity, FileText, CheckCircle, AlertTriangle, 
  Clock, Plus, Search, Edit, Trash2, Sliders, Play, TrendingUp, BarChart2, 
  Download, Filter, AlertCircle, Settings, Check, RefreshCw, X, ChevronRight, 
  ChevronDown, Cpu, Database, Terminal, ShieldAlert, Copy, RefreshCcw, FolderOpen,
  Eye, EyeOff, BookOpen, Star, HelpCircle, LayoutGrid, CheckSquare, Square, Save,
  PlusCircle, MailCheck, BellRing, Trophy, Info
} from "lucide-react";
import { cn } from "@/lib/utils";

// --- Interfaces ---

interface MenuNode {
  id: string;
  name: string;
  icon: string;
  sortIndex: number;
  isHidden: boolean;
  parentId?: string;
  children?: MenuNode[];
}

interface OperationalRole {
  id: string;
  name: string;
  description: string;
  menuPermissions: string[]; // List of Menu ID strings
}

interface TenantMenuAuth {
  tenantId: string;
  tenantName: string;
  logo: string;
  allowedMenus: string[]; // List of Menu ID strings
}

interface Quota {
  allocated: number;
  used: number;
}

interface TenantResource {
  id: string;
  name: string;
  logo: string;
  status: "正常" | "禁用" | "到期";
  expireAt: string;
  quotas: {
    courses: Quota;
    projects: Quota;
    practices: Quota;
    datasetsGb: Quota;
    computeHours: Quota;
    tokensM: Quota;
  };
}

// --- Initial Mock Data ---

const initialMenus: MenuNode[] = [
  { id: "ai", name: "人工智能", icon: "Brain", sortIndex: 1, isHidden: false },
  { id: "ai-courses", name: "AI 实训课程", icon: "BookOpen", sortIndex: 1, isHidden: false, parentId: "ai" },
  { id: "ai-experiments", name: "AI 实验沙箱", icon: "Terminal", sortIndex: 2, isHidden: false, parentId: "ai" },
  { id: "ai-capabilities", name: "AI 能力评测", icon: "Activity", sortIndex: 3, isHidden: false, parentId: "ai" },
  
  { id: "security", name: "安全运维", icon: "Shield", sortIndex: 2, isHidden: false },
  { id: "sec-policies", name: "策略配置", icon: "Key", sortIndex: 1, isHidden: false, parentId: "security" },
  { id: "sec-vulns", name: "漏洞扫描", icon: "Search", sortIndex: 2, isHidden: false, parentId: "security" },
  { id: "sec-logs", name: "审计日志", icon: "FileText", sortIndex: 3, isHidden: false, parentId: "security" },
  
  { id: "cloud", name: "云计算管理", icon: "Cloud", sortIndex: 3, isHidden: false },
  { id: "public-cloud", name: "公有云实例", icon: "Server", sortIndex: 1, isHidden: false, parentId: "cloud" },
  { id: "private-cloud", name: "私有云集群", icon: "Database", sortIndex: 2, isHidden: false, parentId: "cloud" },
  
  { id: "system", name: "平台运营", icon: "Settings", sortIndex: 4, isHidden: false },
  { id: "tenants", name: "租户管理", icon: "Users", sortIndex: 1, isHidden: false, parentId: "system" },
  { id: "resources", name: "公共资源管理", icon: "LayoutGrid", sortIndex: 2, isHidden: false, parentId: "system" },
  { id: "permissions", name: "权限管理中心", icon: "Key", sortIndex: 3, isHidden: false, parentId: "system" }
];

const initialRoles: OperationalRole[] = [
  { 
    id: "role-super", 
    name: "平台系统超管", 
    description: "具有系统全局菜单的访问控制及全部云平台资产的读写控制特权。", 
    menuPermissions: ["ai", "ai-courses", "ai-experiments", "ai-capabilities", "security", "sec-policies", "sec-vulns", "sec-logs", "cloud", "public-cloud", "private-cloud", "system", "tenants", "resources", "permissions"]
  },
  { 
    id: "role-manager", 
    name: "运营调度经理", 
    description: "专注高校与企业实训大盘监管，管理租户的配额划分与审核流配置。", 
    menuPermissions: ["ai", "ai-courses", "ai-capabilities", "cloud", "public-cloud", "system", "tenants", "resources"]
  },
  { 
    id: "role-auditor", 
    name: "安全合规审计员", 
    description: "主要针对平台敏感日志进行风控稽查，无虚拟机或算力修改特权。", 
    menuPermissions: ["security", "sec-policies", "sec-logs", "system", "permissions"]
  },
  { 
    id: "role-support", 
    name: "技术支持客服", 
    description: "响应日常资源下载申请，支持课程上架与实验沙箱状态常规检查。", 
    menuPermissions: ["ai", "ai-courses", "ai-experiments", "system", "resources"]
  }
];

const initialTenantAuths: TenantMenuAuth[] = [
  { id: "tenant-001", tenantName: "北京大学信息学院", logo: "🎓", allowedMenus: ["ai", "ai-courses", "ai-experiments", "ai-capabilities", "security", "sec-logs", "cloud", "public-cloud"] },
  { id: "tenant-002", tenantName: "清华大学计算机系", logo: "🏛️", allowedMenus: ["ai", "ai-courses", "ai-experiments", "ai-capabilities", "security", "sec-policies", "sec-vulns", "sec-logs", "cloud", "public-cloud", "private-cloud"] },
  { id: "tenant-003", tenantName: "复旦大学软件学院", logo: "🛡️", allowedMenus: ["ai", "ai-courses", "ai-experiments", "security", "sec-logs"] },
  { id: "tenant-004", tenantName: "哈尔滨工业大学计算学部", logo: "🛸", allowedMenus: ["ai", "ai-courses", "ai-experiments", "security", "sec-policies", "sec-logs", "cloud", "public-cloud", "private-cloud"] },
  { id: "tenant-005", tenantName: "西安交通大学AI实验班", logo: "🤖", allowedMenus: ["ai", "ai-courses", "ai-experiments", "ai-capabilities"] },
  { id: "tenant-006", tenantName: "百度智能云研发部", logo: "☁️", allowedMenus: ["ai", "ai-courses", "ai-experiments", "cloud", "public-cloud", "private-cloud"] }
];

const initialResources: TenantResource[] = [
  {
    id: "tenant-001",
    name: "北京大学信息学院",
    logo: "🎓",
    status: "正常",
    expireAt: "2026-12-31",
    quotas: {
      courses: { allocated: 50, used: 42 },
      projects: { allocated: 200, used: 186 }, // remaining <15% (残り14)
      practices: { allocated: 50, used: 45 }, // remaining 10% (5)
      datasetsGb: { allocated: 2048, used: 1680 },
      computeHours: { allocated: 5000, used: 4350 }, // remaining 13% (650)
      tokensM: { allocated: 500, used: 436.5 } // remaining 12.7% (63.5)
    }
  },
  {
    id: "tenant-002",
    name: "清华大学计算机系",
    logo: "🏛️",
    status: "正常",
    expireAt: "2026-08-15",
    quotas: {
      courses: { allocated: 100, used: 52 },
      projects: { allocated: 300, used: 210 },
      practices: { allocated: 100, used: 62 },
      datasetsGb: { allocated: 4096, used: 2310 },
      computeHours: { allocated: 8000, used: 4200 },
      tokensM: { allocated: 1000, used: 785.4 }
    }
  },
  {
    id: "tenant-003",
    name: "复旦大学软件学院",
    logo: "🛡️",
    status: "正常",
    expireAt: "2026-06-30",
    quotas: {
      courses: { allocated: 30, used: 28 }, // remaining <10% (2)
      projects: { allocated: 150, used: 104 },
      practices: { allocated: 40, used: 22 },
      datasetsGb: { allocated: 1024, used: 940 }, // remaining 8%
      computeHours: { allocated: 3000, used: 2150 },
      tokensM: { allocated: 300, used: 245.2 }
    }
  },
  {
    id: "tenant-004",
    name: "哈尔滨工业大学计算学部",
    logo: "🛸",
    status: "正常",
    expireAt: "2026-09-20",
    quotas: {
      courses: { allocated: 60, used: 58 }, // remaining 3.3%
      projects: { allocated: 250, used: 242 }, // remaining 3.2%
      practices: { allocated: 60, used: 58 },
      datasetsGb: { allocated: 2048, used: 1980 },
      computeHours: { allocated: 4000, used: 3950 }, // remaining 1.25%
      tokensM: { allocated: 600, used: 590.2 } // remaining 1.6%
    }
  },
  {
    id: "tenant-005",
    name: "西安交通大学AI实验班",
    logo: "🤖",
    status: "禁用",
    expireAt: "2026-06-15",
    quotas: {
      courses: { allocated: 20, used: 12 },
      projects: { allocated: 80, used: 75 },
      practices: { allocated: 20, used: 18 },
      datasetsGb: { allocated: 512, used: 480 },
      computeHours: { allocated: 2000, used: 1850 },
      tokensM: { allocated: 200, used: 168.2 }
    }
  },
  {
    id: "tenant-006",
    name: "百度智能云研发部",
    logo: "☁️",
    status: "正常",
    expireAt: "2027-09-01",
    quotas: {
      courses: { allocated: 150, used: 45 },
      projects: { allocated: 500, used: 80 },
      practices: { allocated: 150, used: 15 },
      datasetsGb: { allocated: 8192, used: 1240 },
      computeHours: { allocated: 10000, used: 2400 },
      tokensM: { allocated: 2000, used: 480.5 }
    }
  }
];

// Preset icons for menu management selector
const presetIcons = ["Brain", "Shield", "Cloud", "Server", "Database", "Terminal", "Key", "Activity", "BookOpen", "LayoutGrid", "Settings", "Search", "FileText", "Users"];

export default function AdminPermissionsPage() {
  const [activeTab, setActiveTab] = useState<"menu" | "quota" | "trends">("menu");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // --- Dynamic Databases ---
  const [menuItems, setMenuItems] = useState<MenuNode[]>(initialMenus);
  const [roles, setRoles] = useState<OperationalRole[]>(initialRoles);
  const [tenantAuths, setTenantAuths] = useState<TenantMenuAuth[]>(initialTenantAuths);
  const [resources, setResources] = useState<TenantResource[]>(initialResources);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // ==========================================
  // PART 1: 基于RBAC的菜单权限管理 STATES
  // ==========================================
  
  // Tab 1 subdivisions: Menu Nodes tree management, Role list mapping, Tenant menu alloc
  const [menuSubTab, setMenuSubTab] = useState<"tree" | "roles" | "tenants">("tree");
  const [expandedParents, setExpandedParents] = useState<string[]>(["ai", "security", "cloud", "system"]);

  // 1.1 Menu Tree Node Add / Edit Modals
  const [showNodeModal, setShowNodeModal] = useState(false);
  const [nodeModalMode, setNodeModalMode] = useState<"add" | "edit">("add");
  const [selectedParentId, setSelectedParentId] = useState<string | undefined>(undefined);
  const [editingNodeId, setEditingNodeId] = useState<string | null>(null);
  
  // Node fields
  const [nodeName, setNodeName] = useState("");
  const [nodeIcon, setNodeIcon] = useState("Brain");
  const [nodeSortIndex, setNodeSortIndex] = useState(1);
  const [nodeIsHidden, setNodeIsHidden] = useState(false);

  // 1.2 Role Config States
  const [selectedRoleId, setSelectedRoleId] = useState("role-super");
  const [showRoleCreateModal, setShowRoleCreateModal] = useState(false);
  const [newRoleName, setNewRoleName] = useState("");
  const [newRoleDesc, setNewRoleDesc] = useState("");

  // 1.3 Tenant Available Menus States
  const [selectedTenantId, setSelectedTenantId] = useState("tenant-001");

  // ==========================================
  // PART 2: 租户资源分配中心 STATES
  // ==========================================
  const [quotaSearch, setQuotaSearch] = useState("");
  const [selectedBulkIds, setSelectedBulkIds] = useState<string[]>([]);
  const [showBulkModal, setShowBulkModal] = useState(false);

  // Bulk allocating form fields
  const [bulkResourceType, setBulkResourceType] = useState<"courses" | "projects" | "practices" | "datasetsGb" | "computeHours" | "tokensM">("computeHours");
  const [bulkAllocType, setBulkAllocType] = useState<"add" | "sub" | "set">("add");
  const [bulkAllocVal, setBulkAllocVal] = useState(500);

  // Single tenant adjusting drawer
  const [showAdjustDrawer, setShowAdjustDrawer] = useState(false);
  const [adjustingTenant, setAdjustingTenant] = useState<TenantResource | null>(null);

  // Adjusting fields
  const [adjustCourses, setAdjustCourses] = useState(50);
  const [adjustProjects, setAdjustProjects] = useState(200);
  const [adjustPractices, setAdjustPractices] = useState(50);
  const [adjustDatasets, setAdjustDatasets] = useState(2048);
  const [adjustCompute, setAdjustCompute] = useState(5000);
  const [adjustTokens, setAdjustTokens] = useState(500);

  // Expiration date
  const [adjustExpireDate, setAdjustExpireDate] = useState("2026-12-31");

  // ==========================================
  // PART 3: 趋势分析 STATES
  // ==========================================
  const [selectedTrendType, setSelectedTrendType] = useState<"tokens" | "gpu">("tokens");
  const [trendMonthRange, setTrendMonthRange] = useState("6");

  // Historical dynamic mock datasets for trends (Dec to May)
  const trendDatasets = {
    tokens: {
      allocated: [2100, 2500, 3100, 3800, 4200, 4600],
      consumed: [1200, 1550, 1980, 2400, 2980, 3680]
    },
    gpu: {
      allocated: [18000, 22000, 25000, 29000, 32000, 32000],
      consumed: [9000, 11400, 14200, 18500, 21800, 23492]
    }
  };

  // Heartbeat warning statistics
  const lowQuotaWarnings = resources.flatMap(t => {
    const warnings: string[] = [];
    const checkWarn = (allocated: number, used: number, label: string) => {
      const remaining = allocated - used;
      const rate = allocated > 0 ? (remaining / allocated) * 100 : 0;
      if (rate < 15 && t.status === "正常") {
        warnings.push(`🚨 租户「${t.name}」的 ${label}配额 剩余仅 ${rate.toFixed(1)}% (可用仅 ${remaining.toFixed(1)})，已触发低于 15% 红色安全警报！`);
      }
    };
    checkWarn(t.quotas.courses.allocated, t.quotas.courses.used, "课程");
    checkWarn(t.quotas.projects.allocated, t.quotas.projects.used, "项目");
    checkWarn(t.quotas.practices.allocated, t.quotas.practices.used, "最佳实践");
    checkWarn(t.quotas.datasetsGb.allocated, t.quotas.datasetsGb.used, "数据集");
    checkWarn(t.quotas.computeHours.allocated, t.quotas.computeHours.used, "算力时长");
    checkWarn(t.quotas.tokensM.allocated, t.quotas.tokensM.used, "AI Token");
    return warnings;
  });

  // --- Handlers & Logics ---

  const handleOpenAddNode = (parentId?: string) => {
    setNodeModalMode("add");
    setSelectedParentId(parentId);
    setNodeName("");
    setNodeIcon("Brain");
    setNodeSortIndex(menuItems.filter(m => m.parentId === parentId).length + 1);
    setNodeIsHidden(false);
    setShowNodeModal(true);
  };

  const handleOpenEditNode = (node: MenuNode) => {
    setNodeModalMode("edit");
    setEditingNodeId(node.id);
    setSelectedParentId(node.parentId);
    setNodeName(node.name);
    setNodeIcon(node.icon);
    setNodeSortIndex(node.sortIndex);
    setNodeIsHidden(node.isHidden);
    setShowNodeModal(true);
  };

  const handleSaveMenuNode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nodeName.trim()) return;

    if (nodeModalMode === "add") {
      const newId = `menu-${Date.now().toString().slice(-4)}`;
      const newNode: MenuNode = {
        id: newId,
        name: nodeName,
        icon: nodeIcon,
        sortIndex: nodeSortIndex,
        isHidden: nodeIsHidden,
        parentId: selectedParentId
      };
      setMenuItems([...menuItems, newNode]);
      triggerToast(`🎉 成功添加菜单功能节点「${nodeName}」`);
    } else if (nodeModalMode === "edit" && editingNodeId) {
      setMenuItems(menuItems.map(m => 
        m.id === editingNodeId 
          ? { ...m, name: nodeName, icon: nodeIcon, sortIndex: nodeSortIndex, isHidden: nodeIsHidden } 
          : m
      ));
      triggerToast(`💾 成功保存菜单节点更新「${nodeName}」`);
    }
    setShowNodeModal(false);
  };

  const handleDeleteMenuNode = (id: string, name: string) => {
    if (confirm(`⚠️ 确定要物理删除菜单节点吗？「${name}」\n删除该节点将同时清除子级项，且所有角色/租户的关联授权会自动注销。`)) {
      setMenuItems(menuItems.filter(m => m.id !== id && m.parentId !== id));
      triggerToast(`🗑️ 已物理注销并重整菜单节点及子项：「${name}」`);
    }
  };

  // Toggle tree expansion
  const toggleParentExpand = (id: string) => {
    if (expandedParents.includes(id)) {
      setExpandedParents(expandedParents.filter(p => p !== id));
    } else {
      setExpandedParents([...expandedParents, id]);
    }
  };

  // Role permissions checking / toggling
  const handleToggleRolePermission = (roleId: string, menuId: string) => {
    setRoles(roles.map(r => {
      if (r.id === roleId) {
        const isGranted = r.menuPermissions.includes(menuId);
        let nextPerms = [];
        if (isGranted) {
          nextPerms = r.menuPermissions.filter(id => id !== menuId);
        } else {
          nextPerms = [...r.menuPermissions, menuId];
          // Proactively grant parent node if child is selected
          const node = menuItems.find(m => m.id === menuId);
          if (node && node.parentId && !r.menuPermissions.includes(node.parentId)) {
            nextPerms.push(node.parentId);
          }
        }
        return { ...r, menuPermissions: nextPerms };
      }
      return r;
    }));
  };

  const handleCreateRole = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoleName.trim()) return;

    const newId = `role-${Date.now().toString().slice(-4)}`;
    const newRole: OperationalRole = {
      id: newId,
      name: newRoleName,
      description: newRoleDesc || "平台自定义协作角色。",
      menuPermissions: ["ai", "security"] // default simple permissions
    };
    setRoles([...roles, newRole]);
    setSelectedRoleId(newId);
    setShowRoleCreateModal(false);
    setNewRoleName("");
    setNewRoleDesc("");
    triggerToast(`👥 成功建立平台新运营岗位角色：「${newRole.name}」`);
  };

  // Tenant Available Menus Checking
  const handleToggleTenantMenu = (tenantId: string, menuId: string) => {
    setTenantAuths(tenantAuths.map(t => {
      if (t.id === tenantId) {
        const hasIt = t.allowedMenus.includes(menuId);
        let nextMenus = [];
        if (hasIt) {
          nextMenus = t.allowedMenus.filter(id => id !== menuId);
        } else {
          nextMenus = [...t.allowedMenus, menuId];
          // Auto add parent
          const node = menuItems.find(m => m.id === menuId);
          if (node && node.parentId && !t.allowedMenus.includes(node.parentId)) {
            nextMenus.push(node.parentId);
          }
        }
        return { ...t, allowedMenus: nextMenus };
      }
      return t;
    }));
  };

  // Bulk resource allocator
  const handleConfirmBulkAllocation = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedBulkIds.length === 0) return;

    setResources(resources.map(t => {
      if (selectedBulkIds.includes(t.id)) {
        const quota = t.quotas[bulkResourceType];
        let nextAllocated = quota.allocated;
        
        if (bulkAllocType === "add") {
          nextAllocated = quota.allocated + bulkAllocVal;
        } else if (bulkAllocType === "sub") {
          nextAllocated = Math.max(quota.used, quota.allocated - bulkAllocVal);
        } else if (bulkAllocType === "set") {
          nextAllocated = Math.max(quota.used, bulkAllocVal);
        }

        return {
          ...t,
          quotas: {
            ...t.quotas,
            [bulkResourceType]: {
              ...quota,
              allocated: nextAllocated
            }
          }
        };
      }
      return t;
    }));

    setShowBulkModal(false);
    setSelectedBulkIds([]);
    triggerToast(`⚡ 成功批量调配了 ${selectedBulkIds.length} 个租户的配额限额`);
  };

  // Open single tenant adjust drawer
  const handleOpenAdjustDrawer = (tenant: TenantResource) => {
    setAdjustingTenant(tenant);
    setAdjustCourses(tenant.quotas.courses.allocated);
    setAdjustProjects(tenant.quotas.projects.allocated);
    setAdjustPractices(tenant.quotas.practices.allocated);
    setAdjustDatasets(tenant.quotas.datasetsGb.allocated);
    setAdjustCompute(tenant.quotas.computeHours.allocated);
    setAdjustTokens(tenant.quotas.tokensM.allocated);
    setAdjustExpireDate(tenant.expireAt);
    setShowAdjustDrawer(true);
  };

  const handleSaveIndividualAdjustment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adjustingTenant) return;

    setResources(resources.map(t => {
      if (t.id === adjustingTenant.id) {
        return {
          ...t,
          expireAt: adjustExpireDate,
          quotas: {
            courses: { ...t.quotas.courses, allocated: Math.max(t.quotas.courses.used, adjustCourses) },
            projects: { ...t.quotas.projects, allocated: Math.max(t.quotas.projects.used, adjustProjects) },
            practices: { ...t.quotas.practices, allocated: Math.max(t.quotas.practices.used, adjustPractices) },
            datasetsGb: { ...t.quotas.datasetsGb, allocated: Math.max(t.quotas.datasetsGb.used, adjustDatasets) },
            computeHours: { ...t.quotas.computeHours, allocated: Math.max(t.quotas.computeHours.used, adjustCompute) },
            tokensM: { ...t.quotas.tokensM, allocated: Math.max(t.quotas.tokensM.used, adjustTokens) }
          }
        };
      }
      return t;
    }));

    setShowAdjustDrawer(false);
    triggerToast(`💾 成功保存租户「${adjustingTenant.name}」的精细配额调配参数`);
  };

  // Quota download registry
  const handleDownloadQuotaRegistry = () => {
    triggerToast("⏳ 正在整理全租户硬件算力与资源占用总账本...");
    setTimeout(() => {
      const dataStr = JSON.stringify(resources, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', `Zhiyun_Quota_Registry_${new Date().toISOString().split("T")[0]}.json`);
      linkElement.click();
      triggerToast("📥 全租户配额账册下载完毕！已成功保存至本地。");
    }, 1500);
  };

  // --- Real-time computations ---
  const activeRole = roles.find(r => r.id === selectedRoleId) || roles[0];
  const activeTenantAuth = tenantAuths.find(t => t.id === selectedTenantId) || tenantAuths[0];

  const rootMenus = menuItems.filter(m => !m.parentId).sort((a, b) => a.sortIndex - b.sortIndex);
  const getSubMenus = (parentId: string) => menuItems.filter(m => m.parentId === parentId).sort((a, b) => a.sortIndex - b.sortIndex);

  const filteredResources = resources.filter(t => 
    t.name.toLowerCase().includes(quotaSearch.toLowerCase()) ||
    t.id.toLowerCase().includes(quotaSearch.toLowerCase())
  );

  return (
    <div className="flex-1 bg-[#f5f6f8] flex flex-col min-h-0 text-neutral-800 font-sans p-6 space-y-6">
      
      {/* Toast Alert Banner */}
      {toastMessage && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] bg-neutral-900 text-white px-5 py-3.5 rounded-xl shadow-xl flex items-center gap-3.5 border border-neutral-800 text-xs font-bold animate-slide-up select-none">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
        <div>
          <h1 className="text-xl font-black text-neutral-title flex items-center gap-2.5">
            <Key className="w-6 h-6 text-[#fa541c]" />
            <span>运营控制台 - 权限与租户资源分配中心</span>
          </h1>
          <p className="text-xs text-neutral-caption mt-1">
            动态治理平台精细化 RBAC 菜单结构，为不同运营角色划分路由，隔离租户级功能，并在管理端对高校、企业租户精密调配六大实训资源配额。
          </p>
        </div>

        <span className="text-[10px] text-neutral-caption font-semibold pr-3 hidden sm:inline bg-white px-3 py-1.5 border border-neutral-200 rounded-lg shadow-3xs">
          🔒 RBAC 租户网关物理盾: 激活中
        </span>
      </div>

      {/* Main Tab Controls */}
      <div className="bg-white rounded-xl border border-neutral-border shadow-3xs p-1 select-none shrink-0 flex items-center justify-between">
        <div className="flex items-center gap-1">
          {[
            { id: "menu", title: "基于RBAC的菜单与特权分配", icon: Layers },
            { id: "quota", title: "租户资源分配大盘中心", icon: Sliders, badge: lowQuotaWarnings.length },
            { id: "trends", title: "六大核心资源用量走势图", icon: TrendingUp }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                "px-4 py-2 rounded-lg text-xs font-black transition-all cursor-pointer flex items-center gap-2 border-0",
                activeTab === tab.id 
                  ? "bg-[#fff2e8] text-[#fa541c]" 
                  : "text-neutral-body hover:bg-neutral-50 hover:text-neutral-title"
              )}
            >
              <tab.icon className="w-4 h-4 shrink-0" />
              <span>{tab.title}</span>
              {tab.badge !== undefined && tab.badge > 0 && (
                <span className="text-[9px] font-mono font-black px-1.5 py-0.5 rounded-full scale-90 bg-rose-500 text-white animate-pulse">
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* =======================================================================
          TAB 1: 基于RBAC的菜单与特权分配 
          ======================================================================= */}
      {activeTab === "menu" && (
        <div className="flex flex-col flex-1 min-h-0 space-y-4 animate-slide-up">
          
          {/* Sub Navigation */}
          <div className="flex gap-4 border-b border-neutral-200/50 pb-1 select-none shrink-0 text-xs font-bold">
            {[
              { id: "tree", title: "系统菜单功能树精细管理" },
              { id: "roles", title: "运营管理角色绑定菜单" },
              { id: "tenants", title: "高校租户特权订阅管理" }
            ].map(sub => (
              <button
                key={sub.id}
                onClick={() => setMenuSubTab(sub.id as any)}
                className={cn(
                  "pb-2 border-b-2 px-1 cursor-pointer transition-colors",
                  menuSubTab === sub.id ? "border-[#fa541c] text-[#fa541c] font-black" : "border-transparent text-neutral-caption hover:text-[#fa541c]"
                )}
              >
                {sub.title}
              </button>
            ))}
          </div>

          {/* Sub-tab 1.1: SYSTEM MENU TREE NODES */}
          {menuSubTab === "tree" && (
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 flex-1 min-h-0">
              
              {/* Info panel */}
              <div className="lg:col-span-1 bg-white p-5 rounded-xl border border-neutral-border shadow-3xs flex flex-col justify-between h-[180px] lg:h-auto shrink-0 select-none">
                <div className="space-y-2 leading-relaxed">
                  <span className="text-xs font-black text-[#fa541c] uppercase tracking-wider block">系统树形目录节点定义</span>
                  <p className="text-[11px] text-neutral-body">
                    实训平台中所有可见的一级主模块和底层的二级按钮、链接等节点全在此树中定义。
                  </p>
                  <p className="text-[10px] text-neutral-caption leading-normal font-semibold pt-1">
                    排序权重影响左侧或顶部导航的物理呈现顺序，隐藏配置则对指定子系统进行热拔插控制。
                  </p>
                </div>

                <button
                  onClick={() => handleOpenAddNode(undefined)}
                  className="w-full text-center text-white bg-[#fa541c] hover:bg-[#e84a15] text-xs font-black py-2 rounded-lg transition-colors cursor-pointer block shadow-3xs"
                >
                  + 新增顶级大模块
                </button>
              </div>

              {/* Editable Tree List */}
              <div className="lg:col-span-3 bg-white p-6 rounded-xl border border-neutral-border shadow-3xs overflow-y-auto custom-scrollbar flex flex-col min-h-[300px]">
                <div className="space-y-3.5 flex-1 pr-1">
                  
                  {rootMenus.map(parent => {
                    const children = getSubMenus(parent.id);
                    const isExpanded = expandedParents.includes(parent.id);
                    return (
                      <div key={parent.id} className="border border-neutral-100 rounded-xl overflow-hidden bg-neutral-50/20">
                        {/* Parent Node Header */}
                        <div className="flex items-center justify-between p-4 bg-neutral-50/50">
                          <div className="flex items-center gap-2">
                            <button 
                              onClick={() => toggleParentExpand(parent.id)}
                              className="p-0.5 rounded hover:bg-neutral-200 cursor-pointer text-neutral-500"
                            >
                              {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                            </button>
                            <span className="text-lg leading-none select-none">💻</span>
                            <span className="font-black text-neutral-title text-sm">{parent.name}</span>
                            <span className="text-[10px] text-neutral-caption font-mono font-bold">({parent.id})</span>
                            <span className="text-[9.5px] font-mono font-bold text-neutral-caption border px-1 rounded">
                              排序: {parent.sortIndex}
                            </span>
                            {parent.isHidden && (
                              <span className="bg-rose-100 border border-rose-200 text-rose-600 text-[8.5px] font-black px-1.5 py-0.2 rounded uppercase shrink-0 scale-90">已隐藏</span>
                            )}
                          </div>

                          <div className="flex items-center gap-2 text-xs font-bold text-neutral-body">
                            <button
                              onClick={() => handleOpenAddNode(parent.id)}
                              className="text-emerald-600 hover:text-emerald-800 flex items-center cursor-pointer"
                            >
                              + 新增二级菜单
                            </button>
                            <span className="text-neutral-300">|</span>
                            <button
                              onClick={() => handleOpenEditNode(parent)}
                              className="text-blue-500 hover:text-blue-700 flex items-center cursor-pointer"
                            >
                              编辑
                            </button>
                            <span className="text-neutral-300">|</span>
                            <button
                              onClick={() => handleDeleteMenuNode(parent.id, parent.name)}
                              className="text-red-500 hover:text-red-700 flex items-center cursor-pointer"
                            >
                              删除
                            </button>
                          </div>
                        </div>

                        {/* Child Nodes List */}
                        {isExpanded && (
                          <div className="divide-y divide-neutral-100/50 bg-white border-t border-neutral-100/80">
                            {children.length === 0 ? (
                              <div className="p-3 text-center text-neutral-400 font-semibold italic text-[11px]">
                                暂无绑定任何下属二级二级菜单节点。
                              </div>
                            ) : (
                              children.map(child => (
                                <div key={child.id} className="flex items-center justify-between p-3.5 pl-10 hover:bg-neutral-50/20 transition-colors">
                                  <div className="flex items-center gap-2">
                                    <ChevronRight className="w-3.5 h-3.5 text-neutral-300" />
                                    <span className="text-base select-none">✓</span>
                                    <span className="font-bold text-neutral-body">{child.name}</span>
                                    <span className="text-[10px] text-neutral-caption font-mono">({child.id})</span>
                                    <span className="text-[9px] font-mono text-neutral-caption border px-1 rounded bg-neutral-50">
                                      权重: {child.sortIndex}
                                    </span>
                                    {child.isHidden && (
                                      <span className="bg-rose-50 border border-rose-200 text-rose-500 text-[8px] font-bold px-1.5 rounded uppercase scale-90">隐藏</span>
                                    )}
                                  </div>

                                  <div className="flex items-center gap-2 text-xs font-bold text-neutral-body">
                                    <button
                                      onClick={() => handleOpenEditNode(child)}
                                      className="text-blue-500 hover:text-blue-700 cursor-pointer"
                                    >
                                      编辑
                                    </button>
                                    <span className="text-neutral-300">|</span>
                                    <button
                                      onClick={() => handleDeleteMenuNode(child.id, child.name)}
                                      className="text-red-500 hover:text-red-700 cursor-pointer"
                                    >
                                      删除
                                    </button>
                                  </div>
                                </div>
                              ))
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}

                </div>
              </div>

            </div>
          )}

          {/* Sub-tab 1.2: OPERATIONAL ROLES CONFIG */}
          {menuSubTab === "roles" && (
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 flex-1 min-h-0">
              
              {/* Left sidebar listing roles */}
              <div className="lg:col-span-1 bg-white p-5 rounded-xl border border-neutral-border shadow-3xs flex flex-col h-[280px] lg:h-auto select-none shrink-0 justify-between">
                <div>
                  <span className="text-xs font-bold text-neutral-caption uppercase tracking-wider block mb-3">系统登记运营人员岗位</span>
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

                <button
                  onClick={() => setShowRoleCreateModal(true)}
                  className="w-full text-center text-[#fa541c] hover:text-[#e84a15] text-xs font-bold py-2 border border-[#ffbb96]/45 bg-[#fff2e8]/45 hover:bg-[#fff2e8] rounded-lg transition-colors cursor-pointer shrink-0 mt-4 block"
                >
                  + 新增平台运营角色
                </button>
              </div>

              {/* Right panel configuring permissions */}
              <div className="lg:col-span-3 bg-white p-6 rounded-xl border border-neutral-border shadow-3xs flex flex-col justify-between overflow-y-auto custom-scrollbar">
                <div className="space-y-6 flex-1 pr-1">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-neutral-100 pb-3 gap-2 select-none">
                    <div>
                      <h2 className="text-sm font-black text-neutral-title">
                        配置「{activeRole.name}」授权菜单树
                      </h2>
                      <p className="text-[10.5px] text-neutral-caption font-semibold mt-1">岗位简介: {activeRole.description}</p>
                    </div>
                    <button
                      onClick={() => triggerToast(`💾 已物理同步并热更新「${activeRole.name}」在全系统的动态菜单缓存`)}
                      className="bg-[#fa541c] hover:bg-[#e84a15] text-white text-xs font-bold px-4 py-1.5 rounded-lg flex items-center gap-1.5 cursor-pointer shadow-3xs shrink-0"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>保存角色授权</span>
                    </button>
                  </div>

                  {/* Matrix Checklists */}
                  <div className="space-y-4">
                    {rootMenus.map(parent => {
                      const children = getSubMenus(parent.id);
                      const isParentChecked = activeRole.menuPermissions.includes(parent.id);
                      
                      return (
                        <div key={parent.id} className="p-4 rounded-xl border border-neutral-100 bg-neutral-50/10 space-y-3">
                          
                          {/* Parent checkbox */}
                          <button
                            onClick={() => handleToggleRolePermission(activeRole.id, parent.id)}
                            className="flex items-center gap-2.5 text-xs font-black text-neutral-title cursor-pointer bg-transparent border-0"
                          >
                            {isParentChecked ? (
                              <CheckSquare className="w-4.5 h-4.5 text-[#fa541c] shrink-0" />
                            ) : (
                              <Square className="w-4.5 h-4.5 text-neutral-300 shrink-0" />
                            )}
                            <span className="text-base select-none">💻</span>
                            <span>{parent.name} 大模块</span>
                          </button>

                          {/* Sub children grid */}
                          {children.length > 0 && (
                            <div className="pl-6 grid grid-cols-1 sm:grid-cols-3 gap-2.5 border-t border-neutral-100/50 pt-2.5">
                              {children.map(child => {
                                const isChildChecked = activeRole.menuPermissions.includes(child.id);
                                return (
                                  <button
                                    key={child.id}
                                    onClick={() => handleToggleRolePermission(activeRole.id, child.id)}
                                    className="flex items-center gap-2 text-[11px] font-bold text-neutral-body hover:text-neutral-title text-left bg-transparent border-0 cursor-pointer"
                                  >
                                    {isChildChecked ? (
                                      <CheckSquare className="w-4 h-4 text-[#fa541c] shrink-0" />
                                    ) : (
                                      <Square className="w-4 h-4 text-neutral-300 shrink-0" />
                                    )}
                                    <span>{child.name}</span>
                                  </button>
                                );
                              })}
                            </div>
                          )}

                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="mt-4 pt-3.5 border-t border-neutral-100 text-[10px] text-neutral-caption font-semibold leading-relaxed select-none shrink-0">
                  💡 RBAC 权限变更将自动广播到该角色下属的运营管理员的当前会话，登录态无需退出即时重构渲染左侧导航。
                </div>
              </div>

            </div>
          )}

          {/* Sub-tab 1.3: TENANTS FUNCTIONAL MENU PERMISSIONS */}
          {menuSubTab === "tenants" && (
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 flex-1 min-h-0">
              
              {/* Left sidebar listing tenants */}
              <div className="lg:col-span-1 bg-white p-5 rounded-xl border border-neutral-border shadow-3xs flex flex-col h-[280px] lg:h-auto select-none shrink-0">
                <span className="text-xs font-bold text-neutral-caption uppercase tracking-wider block mb-3">入驻的高校及企业租户名录</span>
                <div className="space-y-1.5 overflow-y-auto custom-scrollbar pr-1">
                  {tenantAuths.map((t) => {
                    const isActive = selectedTenantId === t.id;
                    return (
                      <button
                        key={t.id}
                        onClick={() => setSelectedTenantId(t.id)}
                        className={cn(
                          "w-full px-3 py-2.5 rounded-lg border transition-all text-left bg-transparent cursor-pointer flex items-center gap-2",
                          isActive 
                            ? "border-[#fa541c] bg-[#fff2e8]/25 text-[#fa541c] font-black" 
                            : "border-neutral-200 text-neutral-body hover:bg-neutral-50"
                        )}
                      >
                        <span className="text-base leading-none select-none">{t.logo}</span>
                        <span className="text-xs truncate block flex-1">{t.tenantName}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Right matrix configuring allowed menus for the tenant */}
              <div className="lg:col-span-3 bg-white p-6 rounded-xl border border-neutral-border shadow-3xs flex flex-col justify-between overflow-y-auto custom-scrollbar">
                <div className="space-y-6 flex-1 pr-1">
                  <div className="flex justify-between items-center border-b border-neutral-100 pb-3 select-none">
                    <div>
                      <h2 className="text-sm font-black text-neutral-title">
                        为租户「{activeTenantAuth.tenantName}」授权可用功能模块
                      </h2>
                      <p className="text-[10.5px] text-neutral-caption font-semibold mt-1">
                        设置此实训租户包含哪些可用菜单权限，超出订阅的功能节点对该租户下属所有人均不可见。
                      </p>
                    </div>
                    <button
                      onClick={() => triggerToast(`🛡️ 成功将功能可用菜单同步授权至租户「${activeTenantAuth.tenantName}」`)}
                      className="bg-[#fa541c] hover:bg-[#e84a15] text-white text-xs font-bold px-4 py-1.5 rounded-lg flex items-center gap-1.5 cursor-pointer shadow-3xs shrink-0"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>保存租户订阅</span>
                    </button>
                  </div>

                  <div className="space-y-4">
                    {rootMenus.map(parent => {
                      const children = getSubMenus(parent.id);
                      const isParentChecked = activeTenantAuth.allowedMenus.includes(parent.id);
                      
                      return (
                        <div key={parent.id} className="p-4 rounded-xl border border-neutral-100 bg-neutral-50/10 space-y-3">
                          
                          <button
                            onClick={() => handleToggleTenantMenu(activeTenantAuth.id, parent.id)}
                            className="flex items-center gap-2.5 text-xs font-black text-neutral-title cursor-pointer bg-transparent border-0"
                          >
                            {isParentChecked ? (
                              <CheckSquare className="w-4.5 h-4.5 text-[#fa541c] shrink-0" />
                            ) : (
                              <Square className="w-4.5 h-4.5 text-neutral-300 shrink-0" />
                            )}
                            <span className="text-base select-none">💻</span>
                            <span>允许访问 {parent.name} 大模块</span>
                          </button>

                          {children.length > 0 && (
                            <div className="pl-6 grid grid-cols-1 sm:grid-cols-3 gap-2.5 border-t border-neutral-100/50 pt-2.5">
                              {children.map(child => {
                                const isChildChecked = activeTenantAuth.allowedMenus.includes(child.id);
                                return (
                                  <button
                                    key={child.id}
                                    onClick={() => handleToggleTenantMenu(activeTenantAuth.id, child.id)}
                                    className="flex items-center gap-2 text-[11px] font-bold text-neutral-body hover:text-neutral-title text-left bg-transparent border-0 cursor-pointer"
                                  >
                                    {isChildChecked ? (
                                      <CheckSquare className="w-4 h-4 text-[#fa541c] shrink-0" />
                                    ) : (
                                      <Square className="w-4 h-4 text-neutral-300 shrink-0" />
                                    )}
                                    <span>{child.name}</span>
                                  </button>
                                );
                              })}
                            </div>
                          )}

                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="mt-4 pt-3.5 border-t border-neutral-100 text-[10px] text-neutral-caption font-semibold select-none shrink-0">
                  ⚙️ 租户权限属于底层物理授权。被租户限制的模块，即使该租户的教务管理员将对应权限分配给其下属老师/学生，对方也绝对无法查看和调用。
                </div>
              </div>

            </div>
          )}

        </div>
      )}

      {/* =======================================================================
          TAB 2: 租户资源分配大盘中心 
          ======================================================================= */}
      {activeTab === "quota" && (
        <div className="flex flex-col flex-1 min-h-0 space-y-4 animate-slide-up">
          
          {/* Header alerts cards if any remaining <15% */}
          {lowQuotaWarnings.length > 0 && (
            <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 space-y-2 select-none shrink-0">
              <span className="text-rose-700 font-black text-xs flex items-center gap-1.5">
                <ShieldAlert className="w-4.5 h-4.5 text-rose-500 animate-swing" />
                <span>算力资源吃紧过载红色预警 ({lowQuotaWarnings.length} 个警告发出)</span>
              </span>
              <div className="max-h-[80px] overflow-y-auto space-y-1 text-[10.5px] font-semibold text-rose-600 custom-scrollbar pr-1">
                {lowQuotaWarnings.map((warn, i) => (
                  <p key={i} className="leading-normal">{warn}</p>
                ))}
              </div>
            </div>
          )}

          {/* Filtering Toolbar controls */}
          <div className="bg-white p-4 rounded-xl border border-neutral-border shadow-3xs flex flex-col md:flex-row gap-4 items-center justify-between select-none shrink-0">
            {/* Search */}
            <div className="relative w-full md:w-[280px]">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-neutral-400" />
              <input
                type="text"
                placeholder="搜索要调配资源的租户名称..."
                value={quotaSearch}
                onChange={(e) => setQuotaSearch(e.target.value)}
                className="w-full border border-neutral-200 rounded-lg pl-9 pr-4 py-1.5 text-xs focus:outline-none focus:border-[#fa541c] bg-white text-neutral-800 font-medium placeholder-neutral-400"
              />
            </div>

            {/* Batch allocate trigger */}
            <div className="flex items-center gap-3">
              <span className="text-neutral-caption font-semibold text-xs">
                已选中: <span className="font-mono text-[#fa541c] font-black">{selectedBulkIds.length}</span> 个高校/企业租户
              </span>
              
              <button
                onClick={() => {
                  if (selectedBulkIds.length === 0) {
                    alert("请至少勾选名录表中的 1 个租户以进行批量划拨配额！");
                    return;
                  }
                  setBulkAllocVal(500);
                  setShowBulkModal(true);
                }}
                disabled={selectedBulkIds.length === 0}
                className={cn(
                  "text-xs font-bold px-4 py-1.8 border rounded-lg transition-colors cursor-pointer shadow-3xs flex items-center gap-1",
                  selectedBulkIds.length > 0 
                    ? "border-[#ffbb96] bg-[#fff2e8] text-[#fa541c] hover:bg-[#ffe8d6]" 
                    : "border-neutral-200 bg-neutral-50 text-neutral-400 cursor-not-allowed"
                )}
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>批量调配资源</span>
              </button>
            </div>
          </div>

          {/* Master overview table */}
          <div className="bg-white rounded-xl border border-neutral-border shadow-3xs overflow-hidden flex-1 flex flex-col min-h-[300px]">
            <div className="overflow-x-auto flex-1 custom-scrollbar">
              <table className="w-full text-left border-collapse min-w-[1300px]">
                <thead>
                  <tr className="bg-neutral-50/50 border-b border-neutral-100 text-[11px] text-neutral-600 font-black uppercase tracking-wider select-none">
                    <th className="px-6 py-4 text-center w-[60px]">
                      {/* Check all */}
                      <input
                        type="checkbox"
                        checked={selectedBulkIds.length === filteredResources.length && filteredResources.length > 0}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedBulkIds(filteredResources.map(t => t.id));
                          } else {
                            setSelectedBulkIds([]);
                          }
                        }}
                        className="accent-[#fa541c] w-3.5 h-3.5 cursor-pointer rounded"
                      />
                    </th>
                    <th className="px-6 py-4">实训机构单位</th>
                    <th className="px-6 py-4">课程配额 (已用/总数/剩余)</th>
                    <th className="px-6 py-4">项目配额 (已用/总数/剩余)</th>
                    <th className="px-6 py-4">实践案例 (已用/总数/剩余)</th>
                    <th className="px-6 py-4">数据集容量 (已用/总数/剩余)</th>
                    <th className="px-6 py-4">算力卡时 (已用/总数/剩余)</th>
                    <th className="px-6 py-4">AI Token (已用/总数/剩余)</th>
                    <th className="px-6 py-4 text-center">状态调整</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 text-xs font-sans">
                  {filteredResources.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="px-6 py-16 text-center text-neutral-400 font-semibold select-none">
                        <AlertCircle className="w-9 h-9 text-neutral-300 mx-auto mb-2" />
                        <span>未检索到匹配的租户资源分配数据。</span>
                      </td>
                    </tr>
                  ) : (
                    filteredResources.map((t) => {
                      const isRowChecked = selectedBulkIds.includes(t.id);
                      
                      // Quota calculations helper
                      const renderQuotaCol = (allocated: number, used: number, unit = "") => {
                        const remaining = allocated - used;
                        const rate = allocated > 0 ? (remaining / allocated) * 100 : 0;
                        const isDanger = rate < 15 && t.status === "正常";
                        
                        return (
                          <div className="space-y-1">
                            <div className="flex justify-between items-center font-bold">
                              <span className="font-mono text-neutral-title">{used}/{allocated}{unit}</span>
                              <span className={cn(
                                "font-mono scale-90",
                                isDanger ? "text-red-600 font-black animate-pulse bg-red-50 border border-red-200/50 px-1 rounded" : "text-neutral-caption"
                              )}>
                                {remaining.toFixed(0)}剩
                              </span>
                            </div>
                            {/* tiny progress bar */}
                            <div className="w-full bg-neutral-100 h-1.5 rounded-full overflow-hidden">
                              <div 
                                className={cn(
                                  "h-full rounded-full transition-all",
                                  isDanger ? "bg-red-500" : "bg-[#fa541c]"
                                )} 
                                style={{ width: `${Math.min((used / allocated) * 100, 100)}%` }}
                              />
                            </div>
                          </div>
                        );
                      };

                      return (
                        <tr key={t.id} className={cn(
                          "hover:bg-neutral-50/15 transition-colors",
                          isRowChecked ? "bg-[#fff2e8]/10" : ""
                        )}>
                          
                          {/* Row select checkbox */}
                          <td className="px-6 py-4 text-center">
                            <input
                              type="checkbox"
                              checked={isRowChecked}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedBulkIds([...selectedBulkIds, t.id]);
                                } else {
                                  setSelectedBulkIds(selectedBulkIds.filter(id => id !== t.id));
                                }
                              }}
                              className="accent-[#fa541c] w-3.5 h-3.5 cursor-pointer rounded"
                            />
                          </td>

                          {/* Unit Name */}
                          <td className="px-6 py-4">
                            <div className="flex gap-2.5 items-center max-w-[180px]">
                              <span className="text-base select-none">{t.logo}</span>
                              <div>
                                <span className="font-black text-neutral-title block truncate" title={t.name}>{t.name}</span>
                                <span className="text-[10px] text-neutral-caption font-mono block mt-0.5">Exp: {t.expireAt}</span>
                              </div>
                            </div>
                          </td>

                          {/* 6 Quotas */}
                          <td className="px-6 py-4">{renderQuotaCol(t.quotas.courses.allocated, t.quotas.courses.used, "门")}</td>
                          <td className="px-6 py-4">{renderQuotaCol(t.quotas.projects.allocated, t.quotas.projects.used, "个")}</td>
                          <td className="px-6 py-4">{renderQuotaCol(t.quotas.practices.allocated, t.quotas.practices.used, "例")}</td>
                          <td className="px-6 py-4">{renderQuotaCol(t.quotas.datasetsGb.allocated, t.quotas.datasetsGb.used, "GB")}</td>
                          <td className="px-6 py-4">{renderQuotaCol(t.quotas.computeHours.allocated, t.quotas.computeHours.used, "h")}</td>
                          <td className="px-6 py-4">{renderQuotaCol(t.quotas.tokensM.allocated, t.quotas.tokensM.used, "M")}</td>

                          {/* Actions adjustment */}
                          <td className="px-6 py-4 text-center">
                            <button
                              onClick={() => handleOpenAdjustDrawer(t)}
                              className="text-[#fa541c] hover:text-[#e84a15] font-black flex items-center justify-center gap-1.5 cursor-pointer"
                              title="单独精确修改此租户配额参数"
                            >
                              <Sliders className="w-3.5 h-3.5" />
                              <span>配额微调</span>
                            </button>
                          </td>

                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Quota Total footer */}
            <div className="bg-neutral-50 px-6 py-3.5 border-t border-neutral-100 flex justify-between items-center text-xs font-semibold text-neutral-body shrink-0 select-none">
              <span>共治理租户资源: {resources.length} 家实训高校/企业</span>
              <button
                onClick={handleDownloadQuotaRegistry}
                className="text-neutral-body hover:text-neutral-title font-bold border border-neutral-200 bg-white px-3.5 py-1.5 rounded-lg cursor-pointer transition-colors shadow-3xs flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5 text-neutral-400" />
                <span>导出全租户配额账簿</span>
              </button>
            </div>

          </div>

        </div>
      )}

      {/* =======================================================================
          TAB 3: 六大核心资源用量走势图 
          ======================================================================= */}
      {activeTab === "trends" && (
        <div className="flex flex-col flex-1 min-h-0 space-y-6 animate-slide-up">
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 shrink-0">
            
            {/* SVG Usage Trends Graph (Col span 2) */}
            <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-neutral-border shadow-3xs flex flex-col justify-between h-[360px]">
              
              <div className="flex justify-between items-center border-b border-neutral-100 pb-3 select-none">
                <span className="text-xs font-black text-neutral-title flex items-center gap-2">
                  <Activity className="w-4 h-4 text-[#fa541c]" />
                  <span>平台租户大模型 API Token 消耗量与分配容量对比走势</span>
                </span>

                <div className="flex items-center gap-2 text-[11px] font-bold">
                  <span className="text-neutral-caption">查看用量详情:</span>
                  <select
                    value={selectedTrendType}
                    onChange={(e) => setSelectedTrendType(e.target.value as any)}
                    className="border border-neutral-200 rounded px-2 py-0.5 bg-white font-semibold focus:outline-none focus:border-[#fa541c] text-[11px]"
                  >
                    <option value="tokens">大模型 Token 消费走势</option>
                    <option value="gpu">GPU 高性能算力时长走势</option>
                  </select>
                </div>
              </div>

              {/* Render dynamic line area graphs based on state selected */}
              <div className="flex-1 flex flex-col justify-between py-6 min-h-0 select-none">
                
                <div className="w-full h-40 bg-neutral-50/50 border border-neutral-100 rounded-xl relative p-1.5">
                  
                  {/* Inline SVG Chart */}
                  <svg className="w-full h-full" viewBox="0 0 500 120" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="allocatedGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#fa541c" stopOpacity="0.12" />
                        <stop offset="100%" stopColor="#fa541c" stopOpacity="0.0" />
                      </linearGradient>
                      <linearGradient id="consumedGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#22c55e" stopOpacity="0.12" />
                        <stop offset="100%" stopColor="#22c55e" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>

                    {/* Guidelines */}
                    <line x1="0" y1="24" x2="500" y2="24" stroke="#f1f5f9" strokeWidth="0.8" />
                    <line x1="0" y1="60" x2="500" y2="60" stroke="#f1f5f9" strokeWidth="0.8" />
                    <line x1="0" y1="96" x2="500" y2="96" stroke="#f1f5f9" strokeWidth="0.8" />

                    {/* Polyfill area: Allocated */}
                    <polygon
                      points={`
                        0,120 
                        0,${120 - (trendDatasets[selectedTrendType].allocated[0] / (selectedTrendType === "tokens" ? 5000 : 35000)) * 90} 
                        100,${120 - (trendDatasets[selectedTrendType].allocated[1] / (selectedTrendType === "tokens" ? 5000 : 35000)) * 90} 
                        200,${120 - (trendDatasets[selectedTrendType].allocated[2] / (selectedTrendType === "tokens" ? 5000 : 35000)) * 90} 
                        300,${120 - (trendDatasets[selectedTrendType].allocated[3] / (selectedTrendType === "tokens" ? 5000 : 35000)) * 90} 
                        400,${120 - (trendDatasets[selectedTrendType].allocated[4] / (selectedTrendType === "tokens" ? 5000 : 35000)) * 90} 
                        500,${120 - (trendDatasets[selectedTrendType].allocated[5] / (selectedTrendType === "tokens" ? 5000 : 35000)) * 90} 
                        500,120
                      `}
                      fill="url(#allocatedGrad)"
                    />

                    {/* Polyfill area: Consumed */}
                    <polygon
                      points={`
                        0,120 
                        0,${120 - (trendDatasets[selectedTrendType].consumed[0] / (selectedTrendType === "tokens" ? 5000 : 35000)) * 90} 
                        100,${120 - (trendDatasets[selectedTrendType].consumed[1] / (selectedTrendType === "tokens" ? 5000 : 35000)) * 90} 
                        200,${120 - (trendDatasets[selectedTrendType].consumed[2] / (selectedTrendType === "tokens" ? 5000 : 35000)) * 90} 
                        300,${120 - (trendDatasets[selectedTrendType].consumed[3] / (selectedTrendType === "tokens" ? 5000 : 35000)) * 90} 
                        400,${120 - (trendDatasets[selectedTrendType].consumed[4] / (selectedTrendType === "tokens" ? 5000 : 35000)) * 90} 
                        500,${120 - (trendDatasets[selectedTrendType].consumed[5] / (selectedTrendType === "tokens" ? 5000 : 35000)) * 90} 
                        500,120
                      `}
                      fill="url(#consumedGrad)"
                    />

                    {/* Line: Allocated */}
                    <polyline
                      fill="none"
                      stroke="#fa541c"
                      strokeWidth="2.5"
                      points={`
                        0,${120 - (trendDatasets[selectedTrendType].allocated[0] / (selectedTrendType === "tokens" ? 5000 : 35000)) * 90} 
                        100,${120 - (trendDatasets[selectedTrendType].allocated[1] / (selectedTrendType === "tokens" ? 5000 : 35000)) * 90} 
                        200,${120 - (trendDatasets[selectedTrendType].allocated[2] / (selectedTrendType === "tokens" ? 5000 : 35000)) * 90} 
                        300,${120 - (trendDatasets[selectedTrendType].allocated[3] / (selectedTrendType === "tokens" ? 5000 : 35000)) * 90} 
                        400,${120 - (trendDatasets[selectedTrendType].allocated[4] / (selectedTrendType === "tokens" ? 5000 : 35000)) * 90} 
                        500,${120 - (trendDatasets[selectedTrendType].allocated[5] / (selectedTrendType === "tokens" ? 5000 : 35000)) * 90}
                      `}
                    />

                    {/* Line: Consumed */}
                    <polyline
                      fill="none"
                      stroke="#22c55e"
                      strokeWidth="2.5"
                      points={`
                        0,${120 - (trendDatasets[selectedTrendType].consumed[0] / (selectedTrendType === "tokens" ? 5000 : 35000)) * 90} 
                        100,${120 - (trendDatasets[selectedTrendType].consumed[1] / (selectedTrendType === "tokens" ? 5000 : 35000)) * 90} 
                        200,${120 - (trendDatasets[selectedTrendType].consumed[2] / (selectedTrendType === "tokens" ? 5000 : 35000)) * 90} 
                        300,${120 - (trendDatasets[selectedTrendType].consumed[3] / (selectedTrendType === "tokens" ? 5000 : 35000)) * 90} 
                        400,${120 - (trendDatasets[selectedTrendType].consumed[4] / (selectedTrendType === "tokens" ? 5000 : 35000)) * 90} 
                        500,${120 - (trendDatasets[selectedTrendType].consumed[5] / (selectedTrendType === "tokens" ? 5000 : 35000)) * 90}
                      `}
                    />

                  </svg>

                  {/* Float numbers on points */}
                  {trendDatasets[selectedTrendType].consumed.map((val, idx) => (
                    <span
                      key={idx}
                      className="absolute text-[8px] font-black font-mono text-emerald-600 bg-white border border-emerald-200 px-1 py-0.2 rounded shadow-3xs"
                      style={{
                        left: `${idx * 20}%`,
                        bottom: `${(val / (selectedTrendType === "tokens" ? 5000 : 35000)) * 60 + 6}%`,
                        transform: "translateX(-50%)"
                      }}
                    >
                      {val}{selectedTrendType === "tokens" ? "M" : "h"}
                    </span>
                  ))}

                </div>

                <div className="flex justify-between px-3 text-[10px] text-neutral-caption font-bold">
                  <span>12月</span>
                  <span>1月</span>
                  <span>2月</span>
                  <span>3月</span>
                  <span>4月</span>
                  <span className="text-[#fa541c] font-black">5月 (当前)</span>
                </div>
              </div>

              {/* Legend keys */}
              <div className="pt-3 border-t border-neutral-100 flex items-center justify-between text-[11px] font-bold select-none shrink-0">
                <div className="flex gap-4">
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 bg-[#fa541c] rounded-xs" />
                    <span className="text-neutral-body">平台总已分配配额上限</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 bg-[#22c55e] rounded-xs" />
                    <span className="text-neutral-body">租户实际消耗统计值</span>
                  </div>
                </div>
                <span className="text-[10px] text-neutral-caption font-semibold">数据每小时滚动累计汇总结算。</span>
              </div>

            </div>

            {/* Circular Gauge overview indicators (Col 1) */}
            <div className="bg-white p-6 rounded-xl border border-neutral-border shadow-3xs flex flex-col justify-between h-[360px]">
              
              <div className="flex justify-between items-center border-b border-neutral-100 pb-3 select-none shrink-0">
                <span className="text-xs font-black text-neutral-title flex items-center gap-1.5">
                  <BarChart2 className="w-4 h-4 text-[#fa541c]" />
                  <span>算力时长消耗排行 (Top 3 租户)</span>
                </span>
                <span className="text-[10px] text-neutral-caption font-bold">按 GPU 累计卡时</span>
              </div>

              {/* Progress bars of rank */}
              <div className="flex-1 overflow-y-auto space-y-4 py-4 pr-1 custom-scrollbar">
                {[
                  { name: "北京大学信息学院", logo: "🎓", used: 4350, max: 5000, color: "bg-[#fa541c]" },
                  { name: "清华大学计算机系", logo: "🏛️", used: 4200, max: 8000, color: "bg-emerald-500" },
                  { name: "复旦大学软件学院", logo: "🛡️", used: 2150, max: 3000, color: "bg-blue-500" }
                ].map((t, idx) => {
                  const rate = (t.used / t.max) * 100;
                  return (
                    <div key={idx} className="space-y-1.5 text-xs">
                      <div className="flex justify-between items-center font-bold text-neutral-body">
                        <div className="flex items-center gap-1.5 truncate max-w-[160px]">
                          <span className="text-base">{t.logo}</span>
                          <span className="truncate">{t.name}</span>
                        </div>
                        <span className="font-mono text-neutral-title">{t.used}h / {t.max}h</span>
                      </div>
                      <div className="w-full bg-neutral-100 h-1.5 rounded-full overflow-hidden">
                        <div className={cn("h-full rounded-full transition-all", t.color)} style={{ width: `${rate}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-4 pt-3.5 border-t border-neutral-100 text-[10px] text-neutral-caption font-semibold leading-relaxed select-none shrink-0">
                💡 管理员可在“租户资源分配中心”直接为高负载院校增加硬件卡时配额，以确保实训课程正常推进。
              </div>

            </div>

          </div>

        </div>
      )}

      {/* =======================================================================
          MODALS, DRAWERS & DIALOGS (RBAC HIGH FIDELITY)
          ======================================================================= */}
      
      {/* 1. MENU TREE NODE ADD / EDIT MODAL */}
      {showNodeModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/45 backdrop-blur-3xs p-4 animate-fade-in text-xs font-sans select-none">
          <form onSubmit={handleSaveMenuNode} className="w-full max-w-[420px] bg-white rounded-2xl shadow-2xl overflow-hidden animate-scale-up flex flex-col">
            
            {/* Header */}
            <div className="bg-neutral-50 px-6 py-4 border-b border-neutral-border flex items-center justify-between shrink-0">
              <span className="font-black text-neutral-title text-sm flex items-center gap-1.5">
                <PlusCircle className="w-4.5 h-4.5 text-[#fa541c]" />
                <span>{nodeModalMode === "add" ? "新增系统功能/二级菜单节点" : "编辑菜单树节点配置"}</span>
              </span>
              <button 
                type="button"
                onClick={() => setShowNodeModal(false)}
                className="text-neutral-400 hover:text-neutral-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-4 text-neutral-body font-semibold">
              
              {/* Parent display if child */}
              {selectedParentId && (
                <div className="p-3 bg-neutral-50 border border-neutral-200 rounded-lg text-[10.5px]">
                  <span className="text-neutral-caption block">所属顶级大模块 Parent ID:</span>
                  <span className="font-black text-neutral-title block mt-0.5">
                    {menuItems.find(m => m.id === selectedParentId)?.name} ({selectedParentId})
                  </span>
                </div>
              )}

              {/* Name */}
              <div className="space-y-1.5">
                <label className="font-bold text-neutral-700 block">
                  <span className="text-red-500 font-black mr-0.5">*</span> 菜单节点名称：
                </label>
                <input
                  type="text"
                  required
                  value={nodeName}
                  onChange={(e) => setNodeName(e.target.value)}
                  placeholder="例如: 算力用量审计"
                  className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#fa541c] bg-white text-neutral-800 font-bold"
                />
              </div>

              {/* Preset Icon Selector */}
              <div className="space-y-1.5">
                <label className="font-bold text-neutral-700 block">
                  选择展示图标 (Lucide库选型)：
                </label>
                <select
                  value={nodeIcon}
                  onChange={(e) => setNodeIcon(e.target.value)}
                  className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#fa541c] bg-white font-bold"
                >
                  {presetIcons.map(iconName => (
                    <option key={iconName} value={iconName}>{iconName}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Sort Index */}
                <div className="space-y-1.5">
                  <label className="font-bold text-neutral-700 block">排序权重权重 (Sort Index)：</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={nodeSortIndex}
                    onChange={(e) => setNodeSortIndex(parseInt(e.target.value))}
                    className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#fa541c] bg-white font-mono font-bold text-neutral-title"
                  />
                </div>

                {/* Hidden status toggle */}
                <div className="space-y-1.5">
                  <label className="font-bold text-neutral-700 block">隐藏/显示模式设定：</label>
                  <select
                    value={nodeIsHidden ? "hidden" : "show"}
                    onChange={(e) => setNodeIsHidden(e.target.value === "hidden")}
                    className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#fa541c] bg-white font-bold text-neutral-title"
                  >
                    <option value="show">正常在导航显示</option>
                    <option value="hidden">暂时隐藏此功能</option>
                  </select>
                </div>
              </div>

            </div>

            {/* Actions */}
            <div className="px-6 py-4 bg-neutral-50 border-t border-neutral-border flex items-center justify-end gap-3 shrink-0">
              <button
                type="button"
                onClick={() => setShowNodeModal(false)}
                className="bg-white hover:bg-neutral-100 text-neutral-body font-bold px-4 py-2 border border-neutral-border rounded-lg cursor-pointer transition-colors"
              >
                放弃返回
              </button>
              <button
                type="submit"
                className="bg-[#fa541c] hover:bg-[#e84a15] text-white font-bold px-5 py-2 rounded-lg cursor-pointer transition-colors shadow-sm"
              >
                保存生效
              </button>
            </div>

          </form>
        </div>
      )}

      {/* 2. OPERATIONAL ROLE CREATING MODAL */}
      {showRoleCreateModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/45 backdrop-blur-3xs p-4 animate-fade-in text-xs font-sans select-none">
          <form onSubmit={handleCreateRole} className="w-full max-w-[420px] bg-white rounded-2xl shadow-2xl overflow-hidden animate-scale-up flex flex-col">
            
            {/* Header */}
            <div className="bg-neutral-50 px-6 py-4 border-b border-neutral-border flex items-center justify-between shrink-0">
              <span className="font-black text-neutral-title text-sm flex items-center gap-1.5">
                <PlusCircle className="w-4.5 h-4.5 text-[#fa541c]" />
                <span>新增系统运营岗位角色</span>
              </span>
              <button 
                type="button"
                onClick={() => setShowRoleCreateModal(false)}
                className="text-neutral-400 hover:text-neutral-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-4 text-neutral-body font-semibold">
              
              {/* Role Name */}
              <div className="space-y-1.5">
                <label className="font-bold text-neutral-700 block">
                  <span className="text-red-500 font-black mr-0.5">*</span> 角色名称（中文岗位称呼）：
                </label>
                <input
                  type="text"
                  required
                  value={newRoleName}
                  onChange={(e) => setNewRoleName(e.target.value)}
                  placeholder="例如: 财务对账出纳"
                  className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#fa541c] bg-white text-neutral-800 font-bold"
                />
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="font-bold text-neutral-700 block">说明该岗位的具体业务范围职责：</label>
                <textarea
                  value={newRoleDesc}
                  onChange={(e) => setNewRoleDesc(e.target.value)}
                  placeholder="说明该岗位负责的事项..."
                  rows={3}
                  className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#fa541c] bg-white text-neutral-800 font-medium placeholder-neutral-400"
                />
              </div>

              <div className="p-3.5 bg-[#fff2e8]/30 border border-[#ffbb96]/20 rounded-lg text-[10px] text-neutral-caption font-semibold leading-relaxed">
                ℹ️ 默认情况下，新开通的角色将自动被授予“人工智能”及“系统安全”的基本读菜单，您可在角色建立后通过菜单树重新绑定精细特权。
              </div>

            </div>

            {/* Actions */}
            <div className="px-6 py-4 bg-neutral-50 border-t border-neutral-border flex items-center justify-end gap-3 shrink-0">
              <button
                type="button"
                onClick={() => setShowRoleCreateModal(false)}
                className="bg-white hover:bg-neutral-100 text-neutral-body font-bold px-4 py-2 border border-neutral-border rounded-lg cursor-pointer transition-colors"
              >
                取消返回
              </button>
              <button
                type="submit"
                className="bg-[#fa541c] hover:bg-[#e84a15] text-white font-bold px-5 py-2 rounded-lg cursor-pointer transition-colors shadow-sm"
              >
                确认建立新岗位
              </button>
            </div>

          </form>
        </div>
      )}

      {/* 3. BATCH TENANT RESOURCES ALLOCATION MODAL (批量资源划拨分配) */}
      {showBulkModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/45 backdrop-blur-3xs p-4 animate-fade-in text-xs font-sans select-none">
          <form onSubmit={handleConfirmBulkAllocation} className="w-full max-w-[440px] bg-white rounded-2xl shadow-2xl overflow-hidden animate-scale-up flex flex-col">
            
            {/* Header */}
            <div className="bg-[#fff2e8] px-6 py-4 border-b border-[#ffbb96]/45 flex items-center gap-2 text-[#fa541c] shrink-0">
              <Sliders className="w-5 h-5 text-[#fa541c]" />
              <span className="font-black text-sm">批量调配已选机构实训资源配额</span>
            </div>

            {/* Body */}
            <div className="p-6 space-y-4 text-neutral-body font-semibold">
              
              <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200/50 space-y-1.5 leading-relaxed font-semibold">
                <span className="text-neutral-caption block text-[10.5px]">当前待调配的高校/企业租户名录：</span>
                <div className="flex flex-wrap gap-1.5">
                  {resources.filter(t => selectedBulkIds.includes(t.id)).map(t => (
                    <span key={t.id} className="px-2 py-0.5 bg-white border border-neutral-200 text-neutral-title rounded text-[10.5px]">
                      {t.name}
                    </span>
                  ))}
                </div>
              </div>

              {/* Resource Type */}
              <div className="space-y-1.5">
                <label className="font-bold text-neutral-700 block">选择需要调整的资源限额种类：</label>
                <select
                  value={bulkResourceType}
                  onChange={(e) => setBulkResourceType(e.target.value as any)}
                  className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#fa541c] bg-white font-bold text-neutral-title"
                >
                  <option value="courses">课程数量配额 (门)</option>
                  <option value="projects">项目数量配额 (个)</option>
                  <option value="practices">最佳实践数量配额 (例)</option>
                  <option value="datasetsGb">共享数据集配额 (GB)</option>
                  <option value="computeHours">GPU 算力使用时长配额 (卡时)</option>
                  <option value="tokensM">大模型 API Token配额 (百万Tokens)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Alloc Type */}
                <div className="space-y-1.5">
                  <label className="font-bold text-neutral-700 block">选择批量执行策略：</label>
                  <select
                    value={bulkAllocType}
                    onChange={(e) => setBulkAllocType(e.target.value as any)}
                    className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#fa541c] bg-white font-bold text-neutral-title"
                  >
                    <option value="add">在原有基础上增加 (+)</option>
                    <option value="sub">在原有基础上核减 (-)</option>
                    <option value="set">将限额直接设定为固定值 (=)</option>
                  </select>
                </div>

                {/* Adjust Value */}
                <div className="space-y-1.5">
                  <label className="font-bold text-neutral-700 block">设定调整数数值 (配额)：</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={bulkAllocVal}
                    onChange={(e) => setBulkAllocVal(parseInt(e.target.value))}
                    className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#fa541c] bg-white font-mono font-bold text-neutral-title"
                  />
                </div>
              </div>

              <span className="text-[10px] text-neutral-caption font-semibold leading-relaxed block border-t border-neutral-100 pt-2.5">
                💡 批量核减或直接设为固定值时，系统会自动与该租户“已消耗额度”比对。如果设定值低于其已用量，将平滑限制至当前已用量以防止异常负数溢出。
              </span>

            </div>

            {/* Actions */}
            <div className="px-6 py-4 bg-neutral-50 border-t border-neutral-border flex items-center justify-end gap-3 shrink-0">
              <button
                type="button"
                onClick={() => setShowBulkModal(false)}
                className="bg-white hover:bg-neutral-100 text-neutral-body font-bold px-4 py-2 border border-neutral-border rounded-lg cursor-pointer transition-colors"
              >
                放弃取消
              </button>
              <button
                type="submit"
                className="bg-[#fa541c] hover:bg-[#e84a15] text-white font-bold px-5 py-2 rounded-lg cursor-pointer transition-colors shadow-sm"
              >
                确认批量划拨配额
              </button>
            </div>

          </form>
        </div>
      )}

      {/* 4. SINGLE TENANT RESOURCE ADJUST DRAWER (单租户滑块及配额精微编辑抽屉) */}
      {showAdjustDrawer && adjustingTenant && (
        <div className="fixed inset-0 z-[150] overflow-hidden flex justify-end bg-black/35 backdrop-blur-3xs animate-fade-in select-none">
          <div className="flex-1" onClick={() => setShowAdjustDrawer(false)}></div>
          
          <div className="w-full max-w-[500px] bg-white h-full shadow-2xl flex flex-col justify-between animate-slide-left text-xs font-sans">
            
            {/* Drawer Header */}
            <div className="p-6 border-b border-neutral-border flex items-center justify-between shrink-0 bg-neutral-50/50">
              <div className="flex items-center gap-2.5">
                <span className="text-xl leading-none">{adjustingTenant.logo}</span>
                <div>
                  <h2 className="text-base font-black text-neutral-title">配额调整: {adjustingTenant.name}</h2>
                  <span className="text-[10px] font-mono text-neutral-caption font-bold block mt-0.5">Unique Identifier: {adjustingTenant.id}</span>
                </div>
              </div>
              <button 
                onClick={() => setShowAdjustDrawer(false)}
                className="p-1 rounded-full text-neutral-400 hover:bg-neutral-200 hover:text-neutral-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Body Scroll Container */}
            <form onSubmit={handleSaveIndividualAdjustment} className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar text-neutral-body font-semibold">
              
              <div className="p-3 bg-[#fff2e8]/30 border border-[#ffbb96]/20 rounded-lg text-[10px] leading-relaxed">
                <span className="text-[#fa541c] font-black block">🔐 资源弹性防穿透锁保护中:</span>
                平台禁止将配额上限调整至该租户当前的已用消耗量以下。下方已对滑块的最小值进行了强制计算锁定。
              </div>

              {/* Resource sliders list */}
              <div className="space-y-5">
                {[
                  { label: "课程最大开通配额", current: adjustCourses, setCurrent: setAdjustCourses, used: adjustingTenant.quotas.courses.used, maxVal: 300, step: 5, unit: "门" },
                  { label: "项目数量配额", current: adjustProjects, setCurrent: setAdjustProjects, used: adjustingTenant.quotas.projects.used, maxVal: 1000, step: 20, unit: "个" },
                  { label: "最佳实践案例分配", current: adjustPractices, setCurrent: setAdjustPractices, used: adjustingTenant.quotas.practices.used, maxVal: 500, step: 5, unit: "例" },
                  { label: "共享数据集存储配额", current: adjustDatasets, setCurrent: setAdjustDatasets, used: adjustingTenant.quotas.datasetsGb.used, maxVal: 16384, step: 128, unit: "GB" },
                  { label: "GPU/CPU 算力卡时限额", current: adjustCompute, setCurrent: setAdjustCompute, used: adjustingTenant.quotas.computeHours.used, maxVal: 30000, step: 500, unit: "h" },
                  { label: "大模型 API Token配额", current: adjustTokens, setCurrent: setAdjustTokens, used: adjustingTenant.quotas.tokensM.used, maxVal: 5000, step: 100, unit: "M" }
                ].map((slider, idx) => (
                  <div key={idx} className="p-3.5 bg-neutral-50 rounded-xl border border-neutral-100 space-y-3.5 select-none">
                    <div className="flex justify-between items-center font-bold">
                      <span className="text-neutral-title text-[11.5px]">{slider.label}</span>
                      <span className="font-mono text-[10px] text-[#fa541c] bg-white border border-[#ffbb96]/45 px-1.5 py-0.5 rounded shadow-3xs">
                        已用 {slider.used} / 分配 {slider.current} {slider.unit}
                      </span>
                    </div>

                    <div className="flex items-center gap-4">
                      {/* slider */}
                      <input
                        type="range"
                        min={slider.used}
                        max={slider.maxVal}
                        step={slider.step}
                        value={slider.current}
                        onChange={(e) => slider.setCurrent(parseInt(e.target.value))}
                        className="flex-1 accent-[#fa541c] h-1 bg-neutral-200 rounded-lg cursor-pointer"
                      />
                      {/* numeric */}
                      <input
                        type="number"
                        min={slider.used}
                        max={slider.maxVal}
                        value={slider.current}
                        onChange={(e) => slider.setCurrent(Math.max(slider.used, parseInt(e.target.value) || slider.used))}
                        className="w-20 border border-neutral-200 rounded px-2 py-0.5 text-center font-mono focus:outline-none focus:border-[#fa541c] font-bold text-neutral-title bg-white"
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Expire date adjustment */}
              <div className="space-y-1.5 border-t border-neutral-100 pt-5">
                <label className="font-bold text-neutral-700 block">租户服务合约终止有效到期日：</label>
                <input
                  type="date"
                  required
                  value={adjustExpireDate}
                  onChange={(e) => setAdjustExpireDate(e.target.value)}
                  className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#fa541c] bg-white font-mono font-bold text-neutral-title"
                />
              </div>

            </form>

            {/* Actions */}
            <div className="p-6 bg-neutral-50 border-t border-neutral-border flex gap-3 shrink-0 select-none">
              <button
                type="submit"
                onClick={handleSaveIndividualAdjustment}
                className="bg-[#fa541c] hover:bg-[#e84a15] text-white font-bold px-4 py-2.5 rounded-lg flex-1 cursor-pointer transition-colors shadow-3xs text-center"
              >
                保存配额变更
              </button>
              <button
                type="button"
                onClick={() => setShowAdjustDrawer(false)}
                className="bg-white hover:bg-neutral-100 text-neutral-body font-bold border border-neutral-200 px-4 py-2.5 rounded-lg flex-1 cursor-pointer transition-colors text-center shadow-3xs"
              >
                放弃返回
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
