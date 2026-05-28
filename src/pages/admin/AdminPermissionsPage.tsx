import React, { useState } from "react";
import { 
  Key, Shield, Users, Plus, Search, Edit, Trash2, Sliders, CheckCircle, 
  AlertTriangle, Clock, X, ChevronRight, Download, Cpu, Database, 
  TrendingUp, BarChart2, Check, RefreshCw, LayoutGrid, FolderCheck, 
  BookOpen, FolderClosed, Award, Terminal, EyeOff, LayoutDashboard, ChevronDown, 
  ListPlus, Info, CheckSquare, Square, BellRing, Settings, Calendar
} from "lucide-react";
import { cn } from "@/lib/utils";

// --- Interfaces ---

interface MenuNode {
  id: string;
  title: string;
  icon: any;
  path: string;
  sort: number;
  hidden: boolean;
  parentId?: string;
  children?: MenuNode[];
}

interface OperationalRole {
  id: string;
  name: string;
  description: string;
  menuIds: string[];
}

interface TenantResource {
  id: string;
  name: string;
  logo: string;
  status: "正常" | "禁用" | "到期";
  courses: { allocated: number; used: number };
  projects: { allocated: number; used: number };
  practices: { allocated: number; used: number };
  datasetsGb: { allocated: number; used: number };
  gpuHours: { allocated: number; used: number };
  tokensM: { allocated: number; used: number };
}

// --- Initial Mock Data ---

const initialMenus: MenuNode[] = [
  {
    id: "m-1",
    title: "人工智能管理",
    icon: Cpu,
    path: "/admin/ai",
    sort: 1,
    hidden: false,
    children: [
      { id: "m-1-1", title: "课程体系管理", icon: BookOpen, path: "/admin/ai/courses", sort: 1, hidden: false, parentId: "m-1" },
      { id: "m-1-2", title: "实验模版配置", icon: Terminal, path: "/admin/ai/experiments", sort: 2, hidden: false, parentId: "m-1" },
      { id: "m-1-3", title: "大模型能力中心", icon: Sliders, path: "/admin/ai/capabilities", sort: 3, hidden: false, parentId: "m-1" }
    ]
  },
  {
    id: "m-2",
    title: "系统集成管理",
    icon: Settings,
    path: "/admin/system",
    sort: 2,
    hidden: false,
    children: [
      { id: "m-2-1", title: "标签体系管理", icon: LayoutGrid, path: "/admin/system/tags", sort: 1, hidden: false, parentId: "m-2" },
      { id: "m-2-2", title: "云平台级监控", icon: TrendingUp, path: "/admin/system/monitor", sort: 2, hidden: false, parentId: "m-2" },
      { id: "m-2-3", title: "云插件管理", icon: Database, path: "/admin/system/plugins", sort: 3, hidden: true, parentId: "m-2" }
    ]
  },
  {
    id: "m-3",
    title: "网络运维中心",
    icon: Key,
    path: "/admin/ip",
    sort: 3,
    hidden: false,
    children: [
      { id: "m-3-1", title: "子网网段划分", icon: Sliders, path: "/admin/ip/subnets", sort: 1, hidden: false, parentId: "m-3" },
      { id: "m-3-2", title: "IP地址冲突分配", icon: Key, path: "/admin/ip/allocations", sort: 2, hidden: false, parentId: "m-3" }
    ]
  }
];

const initialRoles: OperationalRole[] = [
  { id: "role-super", name: "超级管理员", description: "拥有系统全量控制权限与资源调配权限", menuIds: ["m-1", "m-1-1", "m-1-2", "m-1-3", "m-2", "m-2-1", "m-2-2", "m-2-3", "m-3", "m-3-1", "m-3-2"] },
  { id: "role-manager", name: "运营主管", description: "负责高校租户开通、资源划拨以及日常审计工作", menuIds: ["m-1", "m-1-1", "m-1-3", "m-2", "m-2-1", "m-2-2"] },
  { id: "role-lecturer", name: "教研讲师", description: "专注公共实训大纲备课、实验模版编写与题库维护", menuIds: ["m-1", "m-1-1", "m-1-2"] }
];

const initialTenantResources: TenantResource[] = [
  {
    id: "tenant-001",
    name: "北京大学信息学院",
    logo: "🎓",
    status: "正常",
    courses: { allocated: 50, used: 42 },
    projects: { allocated: 200, used: 186 },
    practices: { allocated: 50, used: 45 },
    datasetsGb: { allocated: 2048, used: 1680 },
    gpuHours: { allocated: 5000, used: 4350 },
    tokensM: { allocated: 500, used: 436.5 }
  },
  {
    id: "tenant-002",
    name: "清华大学计算机系",
    logo: "🏛️",
    status: "正常",
    courses: { allocated: 100, used: 76 },
    projects: { allocated: 300, used: 210 },
    practices: { allocated: 100, used: 62 },
    datasetsGb: { allocated: 4096, used: 2310 },
    gpuHours: { allocated: 8000, used: 4200 },
    tokensM: { allocated: 1000, used: 785.4 }
  },
  {
    id: "tenant-003",
    name: "复旦大学软件学院",
    logo: "🛡️",
    status: "正常",
    courses: { allocated: 30, used: 21 },
    projects: { allocated: 150, used: 104 },
    practices: { allocated: 40, used: 22 },
    datasetsGb: { allocated: 1024, used: 590 },
    gpuHours: { allocated: 3000, used: 2150 },
    tokensM: { allocated: 300, used: 245.2 }
  },
  {
    id: "tenant-004",
    name: "西安交通大学AI实验班",
    logo: "🤖",
    status: "禁用",
    courses: { allocated: 20, used: 18 },
    projects: { allocated: 80, used: 75 },
    practices: { allocated: 20, used: 18 },
    datasetsGb: { allocated: 512, used: 480 },
    gpuHours: { allocated: 2000, used: 1850 },
    tokensM: { allocated: 200, used: 168.2 }
  },
  {
    id: "tenant-005",
    name: "哈尔滨工业大学计算学部",
    logo: "🛸",
    status: "到期",
    courses: { allocated: 80, used: 78 },
    projects: { allocated: 250, used: 242 },
    practices: { allocated: 60, used: 58 },
    datasetsGb: { allocated: 2048, used: 1980 },
    gpuHours: { allocated: 4000, used: 3950 },
    tokensM: { allocated: 600, used: 590.2 }
  }
];

const initialTrends: Record<string, number[]> = {
  "AI Token配额 (百万)": [220, 290, 360, 480, 590, 785],
  "GPU 算力时长 (卡时)": [1200, 1600, 2400, 3100, 3900, 4200],
  "数据集平台总量 (GB)": [800, 1200, 1500, 1900, 2100, 2310],
  "实训项目总数 (个)": [90, 110, 140, 168, 192, 210]
};

export default function AdminPermissionsPage() {
  const [activeTab, setActiveTab] = useState<"menu-tree" | "roles" | "tenant-isolation" | "resources">("menu-tree");

  // --- Common States ---
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // ==================== SUB-TAB 1: RBAC 菜单权限管理 ====================
  const [menuTree, setMenuTree] = useState<MenuNode[]>(initialMenus);
  const [roles, setRoles] = useState<OperationalRole[]>(initialRoles);
  const [selectedRoleId, setSelectedRoleId] = useState("role-super");
  
  // Selected Tenant Menu isolation
  const [tenantList, setTenantList] = useState<any[]>([
    { id: "tenant-001", name: "北京大学信息学院", allowedMenuIds: ["m-1", "m-1-1", "m-1-2", "m-1-3", "m-2", "m-2-1", "m-2-2"] },
    { id: "tenant-002", name: "清华大学计算机系", allowedMenuIds: ["m-1", "m-1-1", "m-1-2", "m-1-3", "m-2", "m-2-1", "m-2-2", "m-2-3", "m-3", "m-3-1", "m-3-2"] },
    { id: "tenant-003", name: "复旦大学软件学院", allowedMenuIds: ["m-1", "m-1-1", "m-1-3"] }
  ]);
  const [selectedTenantId, setSelectedTenantId] = useState("tenant-001");

  // Add / Edit Menu Node Modal
  const [showMenuModal, setShowMenuModal] = useState(false);
  const [menuModalMode, setMenuModalMode] = useState<"add-root" | "add-child" | "edit">("add-root");
  const [targetMenuNode, setTargetMenuNode] = useState<MenuNode | null>(null); // parent node for add-child, or selected node for edit
  
  // Menu Form fields
  const [menuFormTitle, setMenuFormTitle] = useState("");
  const [menuFormPath, setMenuFormPath] = useState("");
  const [menuFormSort, setMenuFormSort] = useState(1);
  const [menuFormHidden, setMenuFormHidden] = useState(false);
  const [menuFormIcon, setMenuFormIcon] = useState("LayoutDashboard");

  // Handlers for Menu operations
  const handleOpenAddRootMenu = () => {
    setMenuModalMode("add-root");
    setMenuFormTitle("");
    setMenuFormPath("");
    setMenuFormSort(menuTree.length + 1);
    setMenuFormHidden(false);
    setMenuFormIcon("LayoutDashboard");
    setShowMenuModal(true);
  };

  const handleOpenAddChildMenu = (parent: MenuNode) => {
    setMenuModalMode("add-child");
    setTargetMenuNode(parent);
    setMenuFormTitle("");
    setMenuFormPath(parent.path + "/new-node");
    setMenuFormSort((parent.children?.length || 0) + 1);
    setMenuFormHidden(false);
    setMenuFormIcon("ChevronRight");
    setShowMenuModal(true);
  };

  const handleOpenEditMenu = (node: MenuNode) => {
    setMenuModalMode("edit");
    setTargetMenuNode(node);
    setMenuFormTitle(node.title);
    setMenuFormPath(node.path);
    setMenuFormSort(node.sort);
    setMenuFormHidden(node.hidden);
    setMenuFormIcon("ChevronRight");
    setShowMenuModal(true);
  };

  const handleSaveMenuNode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!menuFormTitle.trim()) return;

    if (menuModalMode === "add-root") {
      const newNode: MenuNode = {
        id: `m-${Date.now()}`,
        title: menuFormTitle,
        icon: LayoutDashboard,
        path: menuFormPath || `/admin/custom-${Date.now()}`,
        sort: menuFormSort,
        hidden: menuFormHidden,
        children: []
      };
      setMenuTree([...menuTree, newNode].sort((a, b) => a.sort - b.sort));
      triggerToast(`🎉 成功添加一级根导航菜单「${menuFormTitle}」`);
    } else if (menuModalMode === "add-child" && targetMenuNode) {
      const newNode: MenuNode = {
        id: `m-child-${Date.now()}`,
        title: menuFormTitle,
        icon: ChevronRight,
        path: menuFormPath || `${targetMenuNode.path}/custom-${Date.now()}`,
        sort: menuFormSort,
        hidden: menuFormHidden,
        parentId: targetMenuNode.id
      };
      
      setMenuTree(menuTree.map(root => {
        if (root.id === targetMenuNode.id) {
          return {
            ...root,
            children: [...(root.children || []), newNode].sort((a, b) => a.sort - b.sort)
          };
        }
        return root;
      }));
      triggerToast(`📂 成功在「${targetMenuNode.title}」下挂载子菜单「${menuFormTitle}」`);
    } else if (menuModalMode === "edit" && targetMenuNode) {
      setMenuTree(menuTree.map(root => {
        // If edit root node directly
        if (root.id === targetMenuNode.id) {
          return {
            ...root,
            title: menuFormTitle,
            path: menuFormPath,
            sort: menuFormSort,
            hidden: menuFormHidden
          };
        }
        // If edit child node
        if (root.children) {
          const updatedChildren = root.children.map(child => {
            if (child.id === targetMenuNode.id) {
              return {
                ...child,
                title: menuFormTitle,
                path: menuFormPath,
                sort: menuFormSort,
                hidden: menuFormHidden
              };
            }
            return child;
          }).sort((a, b) => a.sort - b.sort);

          return { ...root, children: updatedChildren };
        }
        return root;
      }).sort((a, b) => a.sort - b.sort));
      triggerToast(`💾 成功保存菜单「${menuFormTitle}」的导航配置参数`);
    }

    setShowMenuModal(false);
  };

  const handleDeleteMenuNode = (id: string, name: string) => {
    if (confirm(`⚠️ 确定要从系统级导航菜单中彻底物理删除「${name}」节点吗？`)) {
      setMenuTree(menuTree.map(root => {
        if (root.id === id) return null; // remove root
        if (root.children) {
          return {
            ...root,
            children: root.children.filter(child => child.id !== id)
          };
        }
        return root;
      }).filter(Boolean) as MenuNode[]);
      triggerToast(`🗑️ 已将节点「${name}」从系统菜单中安全注销`);
    }
  };

  // Role menu mappings toggle check
  const handleToggleRoleMenu = (menuId: string) => {
    setRoles(roles.map(role => {
      if (role.id === selectedRoleId) {
        const isChecked = role.menuIds.includes(menuId);
        const nextList = isChecked 
          ? role.menuIds.filter(id => id !== menuId)
          : [...role.menuIds, menuId];
        return { ...role, menuIds: nextList };
      }
      return role;
    }));
  };

  const handleApplyRoleQuickTemplate = (tpl: "full" | "read") => {
    setRoles(roles.map(role => {
      if (role.id === selectedRoleId) {
        if (tpl === "full") {
          const allIds: string[] = [];
          menuTree.forEach(root => {
            allIds.push(root.id);
            root.children?.forEach(c => allIds.push(c.id));
          });
          return { ...role, menuIds: allIds };
        } else {
          // just allow first menu as read only
          return { ...role, menuIds: [menuTree[0].id] };
        }
      }
      return role;
    }));
    triggerToast(`⚡ 已成功应用快捷模板配置，角色权限树已重组生效`);
  };

  // Tenant functional menu allocation toggle
  const handleToggleTenantMenu = (menuId: string) => {
    setTenantList(tenantList.map(t => {
      if (t.id === selectedTenantId) {
        const isChecked = t.allowedMenuIds.includes(menuId);
        const nextList = isChecked 
          ? t.allowedMenuIds.filter((id: string) => id !== menuId)
          : [...t.allowedMenuIds, menuId];
        return { ...t, allowedMenuIds: nextList };
      }
      return t;
    }));
  };

  // ==================== SUB-TAB 2: 管理端租户资源分配 ====================
  const [tenantResources, setTenantResources] = useState<TenantResource[]>(initialTenantResources);
  const [selectedResourceTrend, setSelectedResourceTrend] = useState("AI Token配额 (百万)");
  const [selectedTrendTenant, setSelectedTrendTenant] = useState("全部租户");

  // Single Quota Adjust
  const [showAdjustModal, setShowAdjustModal] = useState(false);
  const [adjustTenant, setAdjustTenant] = useState<TenantResource | null>(null);
  const [adjCourses, setAdjCourses] = useState(0);
  const [adjProjects, setAdjProjects] = useState(0);
  const [adjPractices, setAdjPractices] = useState(0);
  const [adjDatasets, setAdjDatasets] = useState(0);
  const [adjGpu, setAdjGpu] = useState(0);
  const [adjTokens, setAdjTokens] = useState(0);

  // Batch Quota Allocations
  const [showBatchModal, setShowBatchModal] = useState(false);
  const [selectedBatchTenantIds, setSelectedBatchTenantIds] = useState<string[]>([]);
  const [batchResourceType, setBatchResourceType] = useState<"courses" | "projects" | "practices" | "datasetsGb" | "gpuHours" | "tokensM">("gpuHours");
  const [batchAction, setBatchAction] = useState<"add" | "reduce">("add");
  const [batchDeltaVal, setBatchDeltaVal] = useState(500);

  const handleOpenAdjust = (tenant: TenantResource) => {
    setAdjustTenant(tenant);
    setAdjCourses(tenant.courses.allocated);
    setAdjProjects(tenant.projects.allocated);
    setAdjPractices(tenant.practices.allocated);
    setAdjDatasets(tenant.datasetsGb.allocated);
    setAdjGpu(tenant.gpuHours.allocated);
    setAdjTokens(tenant.tokensM.allocated);
    setShowAdjustModal(true);
  };

  const handleSaveAdjust = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adjustTenant) return;

    if (adjCourses < adjustTenant.courses.used || 
        adjProjects < adjustTenant.projects.used || 
        adjPractices < adjustTenant.practices.used || 
        adjDatasets < adjustTenant.datasetsGb.used || 
        adjGpu < adjustTenant.gpuHours.used || 
        adjTokens < adjustTenant.tokensM.used) {
      alert("⚠️ 调整后的分配额度不能低于各资源租户当前的已使用用量！");
      return;
    }

    setTenantResources(tenantResources.map(t => {
      if (t.id === adjustTenant.id) {
        return {
          ...t,
          courses: { ...t.courses, allocated: adjCourses },
          projects: { ...t.projects, allocated: adjProjects },
          practices: { ...t.practices, allocated: adjPractices },
          datasetsGb: { ...t.datasetsGb, allocated: adjDatasets },
          gpuHours: { ...t.gpuHours, allocated: adjGpu },
          tokensM: { ...t.tokensM, allocated: adjTokens }
        };
      }
      return t;
    }));

    setShowAdjustModal(false);
    triggerToast(`💾 成功保存并微调「${adjustTenant.name}」的算力容量及配额`);
  };

  const handleSaveBatchAllocation = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedBatchTenantIds.length === 0) {
      alert("⚠️ 请选择至少一个被批量划拨的租户！");
      return;
    }

    setTenantResources(tenantResources.map(t => {
      if (selectedBatchTenantIds.includes(t.id)) {
        const currentRes = t[batchResourceType] as { allocated: number; used: number };
        let nextAllocated = currentRes.allocated;
        if (batchAction === "add") {
          nextAllocated += batchDeltaVal;
        } else {
          nextAllocated = Math.max(currentRes.used, nextAllocated - batchDeltaVal);
        }
        return {
          ...t,
          [batchResourceType]: { ...currentRes, allocated: nextAllocated }
        };
      }
      return t;
    }));

    setShowBatchModal(false);
    setSelectedBatchTenantIds([]);
    triggerToast(`⚡ 批量配额划拨追加成功！共为 ${selectedBatchTenantIds.length} 家租户调整了配额上限`);
  };

  // SVG Line Chart Dynamic
  const activeTrendData = initialTrends[selectedResourceTrend] || initialTrends["AI Token配额 (百万)"];
  const maxTrendVal = Math.max(...activeTrendData);

  return (
    <div className="flex h-full w-full bg-white overflow-hidden text-neutral-800 font-sans">
      
      {/* Toast Notifier */}
      {toastMessage && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] bg-neutral-900 text-white px-5 py-3.5 rounded-xl shadow-xl flex items-center gap-3.5 border border-neutral-800 text-xs font-bold animate-slide-up select-none">
          <div className="w-2 h-2 rounded-full bg-[#fa541c] animate-ping" />
          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Left Sidebar Menu styled exactly like the Audit Center left sidebar */}
      <div className="w-[240px] border-r border-neutral-border flex-shrink-0 flex flex-col bg-white h-full">
        <div className="p-5 border-b border-neutral-border shrink-0">
          <h2 className="text-lg font-semibold text-neutral-title">权限与资源</h2>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto custom-scrollbar">
          {[
            { id: "menu-tree", title: "系统菜单节点配置", icon: LayoutGrid },
            { id: "roles", title: "运营角色权限配置", icon: Key },
            { id: "tenant-isolation", title: "租户功能隔离授权", icon: Shield },
            { id: "resources", title: "租户硬件资源划拨", icon: Database }
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            const badgeCount = tab.id === "resources" 
              ? tenantResources.filter(t => (t.tokensM.used / t.tokensM.allocated * 100) >= 80 || (t.gpuHours.used / t.gpuHours.allocated * 100) >= 80).length
              : 0;
            return (
              <button 
                key={tab.id}
                onClick={() => { setActiveTab(tab.id as any); }}
                className={cn(
                  "w-full flex items-center justify-between px-3 py-2.5 rounded-[8px] text-[14px] font-medium transition-all duration-200 cursor-pointer text-left border-0 bg-transparent",
                  isActive 
                    ? "bg-[#fff2e8] text-[#fa541c]" 
                    : "text-neutral-body hover:bg-neutral-bg hover:text-neutral-title"
                )}
              >
                <div className="flex items-center gap-3">
                  <tab.icon className="w-4 h-4 shrink-0" />
                  <span>{tab.title}</span>
                </div>
                {badgeCount > 0 && (
                  <span className="bg-rose-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold scale-90 animate-pulse">
                    {badgeCount}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Right Main Content Panel */}
      <div className="flex-1 overflow-auto bg-[#f5f6f8] p-8 flex flex-col min-h-0 custom-scrollbar relative">
        
        {/* Right Pane Title Header */}
        <div className="mb-6 flex flex-col md:flex-row items-start justify-between gap-4 shrink-0 select-none border-b border-neutral-200/50 pb-4">
          <div>
            <h1 className="text-xl font-bold text-neutral-title flex items-center gap-2">
              {activeTab === "menu-tree" && "系统菜单节点配置"}
              {activeTab === "roles" && "运营角色权限配置"}
              {activeTab === "tenant-isolation" && "租户功能隔离授权"}
              {activeTab === "resources" && "租户物理硬件与算力划拨"}
            </h1>
            <p className="text-xs text-[#555] mt-1 max-w-[680px]">
              {activeTab === "menu-tree" && "精细化配置系统树形导航菜单路由，变更系统菜单节点的显示状态、物理路径以及排序序列。"}
              {activeTab === "roles" && "绑定 RBAC 菜单层级以对超级管理员、运营主管、教研讲师等系统运营角色进行功能访问授信。"}
              {activeTab === "tenant-isolation" && "向指定高校/企业租户配置可用主模块红线，超强实现租户级的功能物理安全隔离屏绝。"}
              {activeTab === "resources" && "全局调配各高校及企业租户下的 6 类软硬件算力指标，支持批量划拨、配额精确微调及消耗大盘。"}
            </p>
          </div>
          
          {/* Quick Statistics Banner if in resources tab */}
          {activeTab === "resources" && (
            <div className="flex gap-4 self-stretch md:self-auto justify-end">
              <div className="bg-white px-4 py-2 rounded-xl border border-neutral-border shadow-xs flex flex-col min-w-[100px]">
                <span className="text-[11px] text-neutral-caption font-medium">总注册租户</span>
                <span className="text-lg font-bold text-neutral-title mt-0.5">{tenantResources.length}家</span>
              </div>
              <div className="bg-white px-4 py-2 rounded-xl border border-neutral-border shadow-xs flex flex-col min-w-[100px]">
                <span className="text-[11px] text-neutral-caption font-medium">算力容量警戒</span>
                <span className="text-lg font-bold text-rose-500 mt-0.5 animate-pulse">
                  {tenantResources.filter(t => (t.tokensM.used / t.tokensM.allocated * 100) >= 80 || (t.gpuHours.used / t.gpuHours.allocated * 100) >= 80).length}家
                </span>
              </div>
            </div>
          )}
        </div>

      {/* ==================== TAB 1. 系统菜单节点配置 ==================== */}
      {activeTab === "menu-tree" && (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 flex-1 min-h-0 animate-slide-up">
          {/* Left Panel: Menu Tree List (2/5 width) */}
          <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-neutral-border shadow-3xs flex flex-col min-h-[400px]">
            <div className="flex justify-between items-center border-b border-neutral-100 pb-3 mb-4 shrink-0 select-none">
              <div className="space-y-0.5">
                <span className="text-xs font-black text-neutral-title flex items-center gap-1.5">
                  <LayoutGrid className="w-4 h-4 text-[#fa541c]" />
                  <span>系统全局菜单树节点配置</span>
                </span>
                <span className="text-[10px] text-neutral-caption block">菜单可见性及排序划分</span>
              </div>
              <button
                type="button"
                onClick={handleOpenAddRootMenu}
                className="text-[#fa541c] hover:text-[#e84a15] font-black text-xs flex items-center gap-0.5 cursor-pointer bg-[#fff2e8]/45 hover:bg-[#fff2e8] px-2 py-1 rounded border border-[#ffbb96]/45 transition-colors duration-200"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>一级菜单</span>
              </button>
            </div>

            {/* Menu scroll container */}
            <div className="flex-1 overflow-y-auto space-y-3.5 pr-1 custom-scrollbar">
              {menuTree.map((root) => (
                <div key={root.id} className="p-3 bg-neutral-50 rounded-xl border border-neutral-200/50 space-y-2.5">
                  {/* Root menu row */}
                  <div className="flex justify-between items-center text-xs font-bold text-neutral-title select-none">
                    <div className="flex items-center gap-2">
                      <root.icon className="w-4 h-4 text-neutral-caption shrink-0" />
                      <span className={cn(root.hidden && "text-neutral-caption line-through")} title={root.path}>
                        {root.title}
                      </span>
                      {root.hidden && (
                        <span className="text-[9px] font-black text-neutral-caption bg-neutral-200 px-1 py-0.2 rounded scale-90 shrink-0">隐藏</span>
                      )}
                      <span className="text-[9.5px] font-mono font-bold text-[#fa541c] bg-[#fff2e8] px-1 rounded-sm scale-90">S-{root.sort}</span>
                    </div>

                    <div className="flex items-center gap-1.5 scale-90">
                      <button 
                        type="button"
                        onClick={() => handleOpenAddChildMenu(root)}
                        className="text-primary hover:underline font-bold border-0 bg-transparent cursor-pointer"
                        title="挂载子菜单"
                      >
                        挂载
                      </button>
                      <button 
                        type="button"
                        onClick={() => handleOpenEditMenu(root)}
                        className="text-neutral-body hover:text-neutral-900 font-bold border-0 bg-transparent cursor-pointer"
                        title="编辑此项"
                      >
                        编辑
                      </button>
                      <button 
                        type="button"
                        onClick={() => handleDeleteMenuNode(root.id, root.title)}
                        className="text-red-500 hover:text-red-700 font-bold border-0 bg-transparent cursor-pointer"
                        title="物理注销此节点"
                      >
                        删除
                      </button>
                    </div>
                  </div>

                  {/* Children list */}
                  {root.children && root.children.length > 0 && (
                    <div className="border-l border-neutral-200 ml-2.5 pl-3.5 space-y-2">
                      {root.children.map((child) => (
                        <div key={child.id} className="flex justify-between items-center text-[11px] font-semibold text-neutral-body select-none">
                          <div className="flex items-center gap-2">
                            <child.icon className="w-3.5 h-3.5 text-neutral-caption shrink-0" />
                            <span className={cn(child.hidden && "text-neutral-caption line-through")} title={child.path}>
                              {child.title}
                            </span>
                            {child.hidden && (
                              <span className="text-[8px] font-black text-neutral-caption bg-neutral-200 px-1 py-0.2 rounded scale-90 shrink-0">隐藏</span>
                            )}
                            <span className="text-[9px] font-mono text-[#fa541c] scale-90 bg-neutral-100 px-0.5 rounded">S-{child.sort}</span>
                          </div>

                          <div className="flex items-center gap-1.5 scale-90">
                            <button 
                              type="button"
                              onClick={() => handleOpenEditMenu(child)}
                              className="text-neutral-caption hover:text-neutral-800 font-bold border-0 bg-transparent cursor-pointer"
                              title="编辑此子项"
                            >
                              编辑
                            </button>
                            <button 
                              type="button"
                              onClick={() => handleDeleteMenuNode(child.id, child.title)}
                              className="text-red-400 hover:text-red-600 font-bold border-0 bg-transparent cursor-pointer"
                              title="注销此子项"
                            >
                              删除
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Right Panel: Topology Visualization (3/5 width) */}
          <div className="lg:col-span-3 bg-white p-6 rounded-2xl border border-neutral-border shadow-3xs flex flex-col min-h-[400px]">
            <div className="border-b border-neutral-100 pb-3 mb-4 shrink-0 select-none">
              <span className="text-xs font-black text-neutral-title flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-[#fa541c]" />
                <span>系统物理路由拓扑与层级关系</span>
              </span>
              <span className="text-[10px] text-neutral-caption block mt-0.5">导航引擎加载渲染拓扑大盘</span>
            </div>

            <div className="grid grid-cols-3 gap-3 shrink-0 mb-6 select-none">
              <div className="bg-neutral-50 p-3.5 rounded-xl border border-neutral-200/50 flex flex-col justify-center">
                <span className="text-[10px] text-neutral-caption font-bold">主导航大类</span>
                <span className="text-lg font-black text-neutral-title mt-1 font-mono">{menuTree.length}个</span>
              </div>
              <div className="bg-neutral-50 p-3.5 rounded-xl border border-neutral-200/50 flex flex-col justify-center">
                <span className="text-[10px] text-neutral-caption font-bold">挂载二级子项</span>
                <span className="text-lg font-black text-neutral-title mt-1 font-mono">
                  {menuTree.reduce((acc, curr) => acc + (curr.children?.length || 0), 0)}个
                </span>
              </div>
              <div className="bg-neutral-50 p-3.5 rounded-xl border border-neutral-200/50 flex flex-col justify-center">
                <span className="text-[10px] text-neutral-caption font-bold">隐藏隔离项</span>
                <span className="text-lg font-black text-rose-500 mt-1 font-mono">
                  {menuTree.reduce((acc, curr) => acc + (curr.hidden ? 1 : 0) + (curr.children?.filter(c => c.hidden).length || 0), 0)}个
                </span>
              </div>
            </div>

            {/* Visualization of the hierarchy */}
            <div className="flex-1 overflow-y-auto custom-scrollbar space-y-4 pr-1">
              {menuTree.map((root) => (
                <div key={root.id} className="relative pl-6 before:absolute before:left-2 before:top-4 before:bottom-0 before:w-0.5 before:bg-neutral-200 last:before:hidden">
                  <div className="absolute left-0 top-3 w-4.5 h-0.5 bg-neutral-200"></div>
                  
                  <div className="flex items-center gap-3 bg-neutral-50 border border-neutral-200/60 p-3 rounded-xl">
                    <div className="bg-[#fff2e8] text-[#fa541c] p-2 rounded-lg shrink-0">
                      <root.icon className="w-4 h-4 shrink-0" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-neutral-title block">{root.title}</span>
                      <span className="text-[10px] font-mono text-neutral-caption mt-0.5 block">{root.path}</span>
                    </div>
                  </div>

                  {root.children && root.children.length > 0 && (
                    <div className="grid grid-cols-2 gap-3 mt-2 pl-4">
                      {root.children.map(child => (
                        <div key={child.id} className="bg-white border border-neutral-100 p-2.5 rounded-lg flex items-center gap-2.5 shadow-3xs">
                          <child.icon className="w-3.5 h-3.5 text-neutral-caption shrink-0" />
                          <div className="min-w-0">
                            <span className="text-[11px] font-bold text-neutral-body block truncate">{child.title}</span>
                            <span className="text-[9px] font-mono text-neutral-caption block truncate">{child.path}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ==================== TAB 2. 运营角色权限配置 ==================== */}
      {activeTab === "roles" && (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 flex-1 min-h-0 animate-slide-up">
          {/* Left Panel: Role List (2/5 width) */}
          <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-neutral-border shadow-3xs flex flex-col min-h-[400px]">
            <div className="border-b border-neutral-100 pb-3 mb-4 shrink-0 select-none">
              <span className="text-xs font-black text-neutral-title flex items-center gap-1.5">
                <Users className="w-4 h-4 text-[#fa541c]" />
                <span>系统管理运营角色</span>
              </span>
              <span className="text-[10px] text-neutral-caption block mt-0.5">选择需要调整功能授信的RBAC角色</span>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 pr-1 custom-scrollbar">
              {roles.map((r) => {
                const isActive = selectedRoleId === r.id;
                return (
                  <div
                    key={r.id}
                    onClick={() => setSelectedRoleId(r.id)}
                    className={cn(
                      "p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-3.5",
                      isActive 
                        ? "border-[#fa541c] bg-[#fff2e8]/10 shadow-3xs animate-all duration-200" 
                        : "border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50/40 bg-white"
                    )}
                  >
                    <div className={cn(
                      "p-2 rounded-lg shrink-0 mt-0.5 transition-colors duration-200",
                      isActive ? "bg-[#fa541c] text-white" : "bg-neutral-100 text-neutral-caption"
                    )}>
                      <Shield className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0 font-sans">
                      <div className="flex justify-between items-center">
                        <span className={cn("text-xs font-bold block", isActive ? "text-[#fa541c]" : "text-neutral-title")}>
                          {r.name}
                        </span>
                        <span className="text-[9px] font-mono font-bold text-neutral-caption bg-neutral-100 px-1.5 py-0.2 rounded scale-90">
                          {r.menuIds.length}项菜单
                        </span>
                      </div>
                      <p className="text-[10px] text-neutral-caption mt-1 leading-normal">
                        {r.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Panel: Role Menu Assignment Checklist (3/5 width) */}
          <div className="lg:col-span-3 bg-white p-5 rounded-2xl border border-neutral-border shadow-3xs flex flex-col min-h-[400px]">
            <div className="border-b border-neutral-100 pb-3 mb-4 shrink-0 select-none">
              <span className="text-xs font-black text-neutral-title flex items-center gap-1.5">
                <Key className="w-4 h-4 text-[#fa541c]" />
                <span>授权功能路由勾选清单</span>
              </span>
              <span className="text-[10px] text-neutral-caption block mt-0.5">控制所选运营角色能够读取或编辑的前端路由</span>
            </div>

            <div className="flex-1 flex flex-col min-h-0 bg-neutral-50/50 rounded-xl p-4 border border-neutral-200/50 justify-between">
              <div className="flex-1 overflow-y-auto space-y-4 pr-1 custom-scrollbar">
                {/* Active role desc */}
                <div className="space-y-1 select-none">
                  <span className="text-[10px] font-black text-[#fa541c] uppercase tracking-wider block">当前操作角色描述:</span>
                  <p className="text-[11px] font-semibold text-neutral-body leading-normal">
                    {roles.find(r => r.id === selectedRoleId)?.description}
                  </p>
                </div>

                {/* Checkboxes lists */}
                <div className="space-y-3.5 border-t border-neutral-100 pt-3">
                  <span className="text-[11px] font-black text-neutral-title block select-none">授信功能菜单访问清单:</span>
                  
                  <div className="space-y-3">
                    {menuTree.map((root) => {
                      const isRootChecked = roles.find(r => r.id === selectedRoleId)?.menuIds.includes(root.id) || false;
                      
                      return (
                        <div key={root.id} className="space-y-1.5 select-none">
                          <button
                            type="button"
                            onClick={() => handleToggleRoleMenu(root.id)}
                            className="w-full text-left flex items-center gap-2 text-xs font-bold text-neutral-title cursor-pointer border-0 bg-transparent"
                          >
                            {isRootChecked ? (
                              <CheckSquare className="w-4 h-4 text-[#fa541c] shrink-0" />
                            ) : (
                              <Square className="w-4 h-4 text-neutral-300 shrink-0" />
                            )}
                            <root.icon className="w-3.5 h-3.5 text-neutral-caption shrink-0" />
                            <span>{root.title}</span>
                          </button>

                          {/* Children checkboxes */}
                          {root.children && root.children.length > 0 && (
                            <div className="border-l border-neutral-200 ml-2 pl-4 space-y-1.5">
                              {root.children.map((child) => {
                                const isChildChecked = roles.find(r => r.id === selectedRoleId)?.menuIds.includes(child.id) || false;
                                return (
                                  <button
                                    key={child.id}
                                    type="button"
                                    onClick={() => handleToggleRoleMenu(child.id)}
                                    className="w-full text-left flex items-center gap-2 text-[11px] font-semibold text-neutral-body cursor-pointer border-0 bg-transparent"
                                  >
                                    {isChildChecked ? (
                                      <CheckSquare className="w-3.5 h-3.5 text-[#fa541c] shrink-0" />
                                    ) : (
                                      <Square className="w-3.5 h-3.5 text-neutral-300 shrink-0" />
                                    )}
                                    <span>{child.title}</span>
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
              </div>

              {/* Quick Template footer */}
              <div className="pt-3 border-t border-neutral-100 flex justify-between items-center shrink-0 text-xs font-bold select-none">
                <span className="text-[10px] text-neutral-caption">模板配置:</span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleApplyRoleQuickTemplate("read")}
                    className="px-2.5 py-1 bg-white hover:bg-neutral-100 border border-neutral-200 rounded font-semibold scale-95 transition-colors cursor-pointer"
                  >
                    恢复只读模板
                  </button>
                  <button
                    type="button"
                    onClick={() => handleApplyRoleQuickTemplate("full")}
                    className="px-2.5 py-1 bg-[#fff2e8] hover:bg-[#ffe8d6] border border-[#ffbb96]/45 text-[#fa541c] rounded scale-95 transition-colors cursor-pointer"
                  >
                    开启完全授信
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================== TAB 3. 租户功能隔离授权 ==================== */}
      {activeTab === "tenant-isolation" && (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 flex-1 min-h-0 animate-slide-up">
          {/* Left Panel: Tenant Selector List (2/5 width) */}
          <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-neutral-border shadow-3xs flex flex-col min-h-[400px]">
            <div className="border-b border-neutral-100 pb-3 mb-4 shrink-0 select-none">
              <span className="text-xs font-black text-neutral-title flex items-center gap-1.5">
                <Building className="w-4 h-4 text-[#fa541c]" />
                <span>选择被授权的机构租户</span>
              </span>
              <span className="text-[10px] text-neutral-caption block mt-0.5">选择目标租户以配置其可用功能树范围</span>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 pr-1 custom-scrollbar">
              {tenantList.map((t) => {
                const isActive = selectedTenantId === t.id;
                const resourceInfo = tenantResources.find(tr => tr.id === t.id) || { logo: "🎓", status: "正常" };
                
                return (
                  <div
                    key={t.id}
                    onClick={() => setSelectedTenantId(t.id)}
                    className={cn(
                      "p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between",
                      isActive 
                        ? "border-[#fa541c] bg-[#fff2e8]/10 shadow-3xs animate-all duration-200" 
                        : "border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50/40 bg-white"
                    )}
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <span className="text-xl select-none shrink-0">{resourceInfo.logo}</span>
                      <div className="min-w-0 font-sans">
                        <span className={cn("text-xs font-bold block truncate", isActive ? "text-[#fa541c]" : "text-neutral-title")}>
                          {t.name}
                        </span>
                        <span className="text-[9px] font-mono text-neutral-caption mt-0.5 block">
                          可用模块: {t.allowedMenuIds.length} 个
                        </span>
                      </div>
                    </div>
                    
                    <span className={cn(
                      "text-[9px] font-black px-1.5 py-0.2 rounded border scale-90 shrink-0",
                      resourceInfo.status === "正常" ? "bg-green-50 text-green-600 border-green-200" :
                      resourceInfo.status === "禁用" ? "bg-rose-50 text-rose-600 border-rose-200" :
                      "bg-amber-50 text-amber-600 border-amber-200"
                    )}>
                      {resourceInfo.status}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Panel: Tenant Available Menu Isolation (3/5 width) */}
          <div className="lg:col-span-3 bg-white p-5 rounded-2xl border border-neutral-border shadow-3xs flex flex-col min-h-[400px]">
            <div className="border-b border-neutral-100 pb-3 mb-4 shrink-0 select-none">
              <span className="text-xs font-black text-neutral-title flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-[#fa541c]" />
                <span>租户级导航菜单物理隔离</span>
              </span>
              <span className="text-[10px] text-neutral-caption block mt-0.5">授权并隔离各高校租户最大可用前台功能集</span>
            </div>

            <div className="flex-1 bg-neutral-50/50 rounded-xl p-4 border border-neutral-200/50 flex flex-col justify-between overflow-y-auto custom-scrollbar">
              <div className="space-y-4 flex-1">
                <div className="p-3 bg-[#fff2e8]/45 border border-[#ffbb96]/45 rounded-lg space-y-1 font-medium leading-relaxed select-none shrink-0">
                  <span className="text-[#fa541c] font-black block">📢 租户级物理隔离机制:</span>
                  <p className="text-[10px] text-neutral-body">
                    如果在此取消勾选了某个大类菜单（例如“网络运维中心”），则该租户机构下的所有管理员和子角色均彻底失去此模块配置的任何可能，确保数据完全屏绝。
                  </p>
                </div>

                <div className="space-y-3.5 pt-2 select-none">
                  <span className="text-[11px] font-black text-neutral-title block">允许租户使用的导航主模块大类：</span>
                  
                  <div className="space-y-3">
                    {menuTree.map((root) => {
                      const isAllowed = tenantList.find(t => t.id === selectedTenantId)?.allowedMenuIds.includes(root.id) || false;
                      return (
                        <button
                          key={root.id}
                          type="button"
                          onClick={() => handleToggleTenantMenu(root.id)}
                          className="w-full text-left flex items-center justify-between p-3 rounded-lg border bg-white font-bold transition-all cursor-pointer text-neutral-body border-neutral-200 hover:border-neutral-300"
                        >
                          <div className="flex items-center gap-2.5">
                            <root.icon className="w-4 h-4 text-neutral-caption shrink-0" />
                            <span>{root.title}</span>
                          </div>
                          
                          {isAllowed ? (
                            <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/50">已授予</span>
                          ) : (
                            <span className="text-[10px] font-black text-neutral-caption bg-neutral-100 px-2 py-0.5 rounded border border-neutral-200">已禁用隔离</span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* CTA save */}
              <button
                type="button"
                onClick={() => triggerToast(`💾 成功同步该租户的系统级物理隔离菜单映射规则`)}
                className="w-full text-center bg-[#fa541c] hover:bg-[#e84a15] text-white text-xs font-black py-2.5 rounded-lg transition-colors cursor-pointer shrink-0 mt-4 block border-0 shadow-3xs"
              >
                保存隔离授权
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== TAB 2. 管理端租户资源分配 ==================== */}
      {activeTab === "resources" && (
        <div className="space-y-6 flex flex-col flex-1 min-h-0 animate-slide-up">
          
          {/* Toolbar commands */}
          <div className="flex justify-between items-center shrink-0 select-none">
            <div>
              <h2 className="text-sm font-black text-neutral-title leading-tight">租户物理硬件与实训资源额度管理</h2>
              <span className="text-[10px] text-neutral-caption font-semibold mt-1 block">配额调整 ➔ 批量划拨 ➔ 消耗追踪</span>
            </div>

            <div className="flex items-center gap-2 text-xs font-bold">
              <button
                onClick={() => {
                  setSelectedBatchTenantIds([]);
                  setShowBatchModal(true);
                }}
                className="bg-[#fa541c] hover:bg-[#e84a15] text-white font-black px-4 py-2.5 rounded-lg flex items-center gap-1.5 shadow-3xs cursor-pointer"
              >
                <ListPlus className="w-4 h-4 font-black" />
                <span>批量追加资源配额</span>
              </button>
            </div>
          </div>

          {/* Master overview table */}
          <div className="bg-white rounded-xl border border-neutral-border shadow-3xs overflow-hidden flex-1 flex flex-col min-h-[300px]">
            <div className="overflow-x-auto flex-1 custom-scrollbar">
              <table className="w-full text-left border-collapse min-w-[1100px]">
                <thead>
                  <tr className="bg-neutral-50/50 border-b border-neutral-100 text-[11.5px] text-neutral-600 font-black uppercase tracking-wider select-none">
                    <th className="px-6 py-4">租户机构名称</th>
                    <th className="px-6 py-4">已发布课程 (分配 / 已用 / 剩)</th>
                    <th className="px-6 py-4">实训项目数 (分配 / 已用 / 剩)</th>
                    <th className="px-6 py-4">最佳实践库 (分配 / 已用 / 剩)</th>
                    <th className="px-6 py-4">数据集GB限额 (分配 / 已用 / 剩)</th>
                    <th className="px-6 py-4">GPU卡时时长 (分配 / 已用 / 剩)</th>
                    <th className="px-6 py-4">AI Token限额 (分配 / 已用 / 剩)</th>
                    <th className="px-6 py-4 text-center">配额精细调配</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 text-xs font-sans">
                  {tenantResources.map((t) => {
                    const cRem = t.courses.allocated - t.courses.used;
                    const pRem = t.projects.allocated - t.projects.used;
                    const prRem = t.practices.allocated - t.practices.used;
                    const dRem = t.datasetsGb.allocated - t.datasetsGb.used;
                    const gRem = t.gpuHours.allocated - t.gpuHours.used;
                    const tRem = t.tokensM.allocated - t.tokensM.used;

                    return (
                      <tr key={t.id} className="hover:bg-neutral-50/20 transition-colors">
                        
                        {/* Name and logo */}
                        <td className="px-6 py-4 font-black text-neutral-title max-w-[180px]">
                          <div className="flex gap-2 items-center">
                            <span className="text-base select-none">{t.logo}</span>
                            <span className="truncate block" title={t.name}>{t.name}</span>
                          </div>
                        </td>

                        {/* Courses */}
                        <td className="px-6 py-4">
                          <div className="space-y-1 font-mono">
                            <span className="text-neutral-title block font-bold">{t.courses.allocated}门</span>
                            <span className="text-[10px] text-neutral-caption block font-semibold">
                              已用: <span className="text-neutral-body">{t.courses.used}</span> | 剩: <span className="text-emerald-600 font-bold">{cRem}</span>
                            </span>
                          </div>
                        </td>

                        {/* Projects */}
                        <td className="px-6 py-4">
                          <div className="space-y-1 font-mono">
                            <span className="text-neutral-title block font-bold">{t.projects.allocated}个</span>
                            <span className="text-[10px] text-neutral-caption block font-semibold">
                              已用: <span className="text-neutral-body">{t.projects.used}</span> | 剩: <span className="text-emerald-600 font-bold">{pRem}</span>
                            </span>
                          </div>
                        </td>

                        {/* Practices */}
                        <td className="px-6 py-4">
                          <div className="space-y-1 font-mono">
                            <span className="text-neutral-title block font-bold">{t.practices.allocated}项</span>
                            <span className="text-[10px] text-neutral-caption block font-semibold">
                              已用: <span className="text-neutral-body">{t.practices.used}</span> | 剩: <span className="text-emerald-600 font-bold">{prRem}</span>
                            </span>
                          </div>
                        </td>

                        {/* Datasets */}
                        <td className="px-6 py-4">
                          <div className="space-y-1 font-mono">
                            <span className="text-neutral-title block font-bold">{t.datasetsGb.allocated}GB</span>
                            <span className="text-[10px] text-neutral-caption block font-semibold">
                              已用: <span className="text-neutral-body">{t.datasetsGb.used}</span> | 剩: <span className="text-emerald-600 font-bold">{dRem}</span>
                            </span>
                          </div>
                        </td>

                        {/* GPU */}
                        <td className="px-6 py-4">
                          <div className="space-y-1 font-mono">
                            <span className="text-neutral-title block font-bold">{t.gpuHours.allocated}h</span>
                            <span className="text-[10px] text-neutral-caption block font-semibold">
                              已用: <span className="text-[#fa541c] font-black">{t.gpuHours.used}</span> | 剩: <span className="text-emerald-600 font-bold">{gRem}</span>
                            </span>
                          </div>
                        </td>

                        {/* AI Tokens */}
                        <td className="px-6 py-4">
                          <div className="space-y-1 font-mono">
                            <span className="text-[#fa541c] block font-black">{t.tokensM.allocated}M</span>
                            <span className="text-[10px] text-neutral-caption block font-semibold">
                              已用: <span className="text-neutral-body font-bold">{t.tokensM.used.toFixed(1)}</span> | 剩: <span className="text-emerald-600 font-bold">{tRem.toFixed(1)}</span>
                            </span>
                          </div>
                        </td>

                        {/* Quota adjustments */}
                        <td className="px-6 py-4 text-center">
                          <button
                            onClick={() => handleOpenAdjust(t)}
                            className="bg-neutral-50 hover:bg-[#fff2e8] text-neutral-body hover:text-[#fa541c] border border-neutral-200 hover:border-[#ffbb96]/45 px-2.5 py-1 rounded font-bold transition-all cursor-pointer scale-95"
                          >
                            配额调整
                          </button>
                        </td>

                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Footer total info */}
            <div className="bg-neutral-50 px-6 py-3 border-t border-neutral-100 flex justify-between items-center text-xs font-semibold text-neutral-body shrink-0 select-none">
              <span>共计监控配额分配租户: {tenantResources.length} 个</span>
              <span className="text-[10px] text-neutral-caption font-medium">调整后的课程/GPU/Token配额数据将与对应租户大盘同步热生效。</span>
            </div>
          </div>

          {/* Row layout: SVG Trend analysis graph and Warnings Center */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 shrink-0">
            
            {/* SVG Trends (Col span 2) */}
            <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-neutral-border shadow-3xs flex flex-col justify-between h-[360px]">
              
              <div className="flex justify-between items-center border-b border-neutral-100 pb-3 shrink-0 select-none">
                <span className="text-xs font-black text-neutral-title flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-[#fa541c]" />
                  <span>租户平台级各项资源累计历史消耗走势 (6个月)</span>
                </span>
                
                {/* Select resource filter type */}
                <div className="flex items-center gap-2 text-[10.5px] font-bold">
                  <span className="text-neutral-caption">资源大类:</span>
                  <select
                    value={selectedResourceTrend}
                    onChange={(e) => setSelectedResourceTrend(e.target.value)}
                    className="border border-neutral-200 rounded px-2 py-0.5 bg-white focus:outline-none focus:border-[#fa541c] text-[11px] font-semibold"
                  >
                    <option value="AI Token配额 (百万)">AI Token 大模型 API</option>
                    <option value="GPU 算力时长 (卡时)">GPU 高性能计算卡时</option>
                    <option value="数据集平台总量 (GB)">数据集存储容量</option>
                    <option value="实训项目总数 (个)">实训项目及案例数</option>
                  </select>
                </div>
              </div>

              {/* SVG Sparkline */}
              <div className="flex-1 flex flex-col justify-between py-6 min-h-0 select-none">
                <div className="w-full h-40 bg-neutral-50/50 border border-neutral-100 rounded-xl relative p-1.5">
                  <svg className="w-full h-full" viewBox="0 0 500 120" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="resourceGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#fa541c" stopOpacity="0.22" />
                        <stop offset="100%" stopColor="#fa541c" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>

                    {/* guidelines */}
                    <line x1="0" y1="24" x2="500" y2="24" stroke="#f1f5f9" strokeWidth="0.8" />
                    <line x1="0" y1="60" x2="500" y2="60" stroke="#f1f5f9" strokeWidth="0.8" />
                    <line x1="0" y1="96" x2="500" y2="96" stroke="#f1f5f9" strokeWidth="0.8" />

                    {/* Polygon Area */}
                    <polygon
                      points={`
                        0,120 
                        0,${120 - (activeTrendData[0] / maxTrendVal) * 90} 
                        100,${120 - (activeTrendData[1] / maxTrendVal) * 90} 
                        200,${120 - (activeTrendData[2] / maxTrendVal) * 90} 
                        300,${120 - (activeTrendData[3] / maxTrendVal) * 90} 
                        400,${120 - (activeTrendData[4] / maxTrendVal) * 90} 
                        500,${120 - (activeTrendData[5] / maxTrendVal) * 90} 
                        500,120
                      `}
                      fill="url(#resourceGrad)"
                    />

                    {/* Line */}
                    <polyline
                      fill="none"
                      stroke="#fa541c"
                      strokeWidth="2.5"
                      points={`
                        0,${120 - (activeTrendData[0] / maxTrendVal) * 90} 
                        100,${120 - (activeTrendData[1] / maxTrendVal) * 90} 
                        200,${120 - (activeTrendData[2] / maxTrendVal) * 90} 
                        300,${120 - (activeTrendData[3] / maxTrendVal) * 90} 
                        400,${120 - (activeTrendData[4] / maxTrendVal) * 90} 
                        500,${120 - (activeTrendData[5] / maxTrendVal) * 90}
                      `}
                    />

                    {/* Circles */}
                    {activeTrendData.map((val, idx) => (
                      <circle
                        key={idx}
                        cx={idx * 100}
                        cy={120 - (val / maxTrendVal) * 90}
                        r="3.5"
                        fill="white"
                        stroke="#fa541c"
                        strokeWidth="2"
                      />
                    ))}
                  </svg>

                  {/* Hover tooltips */}
                  {activeTrendData.map((val, idx) => (
                    <span
                      key={idx}
                      className="absolute text-[8.5px] font-black font-mono text-[#fa541c] bg-white border border-[#ffbb96]/45 px-1 py-0.2 rounded shadow-3xs"
                      style={{
                        left: `${idx * 20}%`,
                        bottom: `${(val / maxTrendVal) * 75 + 8}%`,
                        transform: "translateX(-50%)"
                      }}
                    >
                      {val}
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

            </div>

            {/* Warnings center (Col 1) */}
            <div className="bg-white p-5 rounded-2xl border border-neutral-border shadow-3xs flex flex-col justify-between h-[360px]">
              
              <div className="space-y-4 flex-1 overflow-y-auto custom-scrollbar select-none">
                <div className="flex justify-between items-center border-b border-neutral-100 pb-2 mb-3">
                  <span className="text-xs font-black text-neutral-title flex items-center gap-1.5">
                    <BellRing className="w-4 h-4 text-rose-500 animate-swing" />
                    <span>算力过载与配额不足警告栏</span>
                  </span>
                  <span className="text-[10px] text-neutral-caption font-bold">已超80%</span>
                </div>

                <div className="space-y-3">
                  {tenantResources.map(t => {
                    const tokenPct = (t.tokensM.used / t.tokensM.allocated) * 100;
                    const gpuPct = (t.gpuHours.used / t.gpuHours.allocated) * 100;
                    
                    if (tokenPct >= 80) {
                      return (
                        <div key={`${t.id}-token`} className="p-3 bg-yellow-50/40 border border-yellow-200 rounded-xl space-y-1">
                          <div className="flex justify-between items-center font-bold text-xs">
                            <span className="text-neutral-title truncate max-w-[130px]">{t.name}</span>
                            <span className="text-[#fa541c] font-mono">{tokenPct.toFixed(0)}%</span>
                          </div>
                          <p className="text-[10px] text-neutral-body leading-relaxed font-semibold">
                            ⚠️ 大模型 API Token 已划拨消耗过密，已接近配额红线临界上限。
                          </p>
                        </div>
                      );
                    }
                    if (gpuPct >= 80) {
                      return (
                        <div key={`${t.id}-gpu`} className="p-3 bg-rose-50/30 border border-rose-100 rounded-xl space-y-1">
                          <div className="flex justify-between items-center font-bold text-xs">
                            <span className="text-neutral-title truncate max-w-[130px]">{t.name}</span>
                            <span className="text-rose-600 font-mono">{gpuPct.toFixed(0)}%</span>
                          </div>
                          <p className="text-[10px] text-neutral-body leading-relaxed font-semibold">
                            🚨 GPU 物理算力卡时极其紧张，当前占用超出了实训警戒限制。
                          </p>
                        </div>
                      );
                    }
                    return null;
                  })}
                </div>
              </div>

              <div className="pt-3 border-t border-neutral-100 flex items-center justify-between shrink-0 select-none">
                <span className="text-[9.5px] text-neutral-caption">支持向超额单位自动发催费单</span>
                <button
                  onClick={() => triggerToast("📢 成功发送催费提醒及扩容配置提议书邮件")}
                  className="bg-[#fa541c]/10 hover:bg-[#fa541c]/20 text-[#fa541c] border border-[#ffbb96]/45 text-[10px] font-bold px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                >
                  一键推送配额预警
                </button>
              </div>

            </div>

          </div>

        </div>
      )}

      {/* ==================== ALL MODALS & DIALOGS ==================== */}

      {/* 1. ADD / EDIT MENU NODE MODAL */}
      {showMenuModal && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/35 backdrop-blur-3xs p-4 animate-fade-in text-xs font-sans">
          <form onSubmit={handleSaveMenuNode} className="w-full max-w-[420px] bg-white rounded-2xl shadow-2xl overflow-hidden animate-scale-up flex flex-col">
            
            {/* Header */}
            <div className="bg-neutral-50 px-6 py-4 border-b border-neutral-border flex items-center justify-between shrink-0 select-none">
              <span className="font-black text-neutral-title text-sm flex items-center gap-1.5">
                <Sliders className="w-4.5 h-4.5 text-[#fa541c]" />
                <span>
                  {menuModalMode === "add-root" ? "新建一级导航主菜单" : 
                   menuModalMode === "add-child" ? `添加「${targetMenuNode?.title}」子菜单` : 
                   `编辑菜单「${targetMenuNode?.title}」配置`}
                </span>
              </span>
              <button 
                type="button"
                onClick={() => setShowMenuModal(false)}
                className="text-neutral-400 hover:text-neutral-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body Form */}
            <div className="p-6 space-y-4 text-neutral-body font-semibold">
              
              {/* Menu Title */}
              <div className="space-y-1.5">
                <label className="font-bold text-neutral-700 block">
                  <span className="text-red-500 font-bold mr-0.5">*</span> 菜单/导航节点名称：
                </label>
                <input
                  type="text"
                  required
                  value={menuFormTitle}
                  onChange={(e) => setMenuFormTitle(e.target.value)}
                  placeholder="例如: 财务分析中心"
                  className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#fa541c] bg-white text-neutral-800 font-bold placeholder-neutral-400"
                />
              </div>

              {/* Route Path */}
              <div className="space-y-1.5">
                <label className="font-bold text-neutral-700 block">
                  <span className="text-red-500 font-bold mr-0.5">*</span> 系统物理路由路径 (Route Path)：
                </label>
                <input
                  type="text"
                  required
                  value={menuFormPath}
                  onChange={(e) => setMenuFormPath(e.target.value)}
                  placeholder="例如: /admin/system/billing"
                  className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#fa541c] bg-white text-neutral-800 font-mono placeholder-neutral-400"
                />
              </div>

              {/* Sort Index */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-bold text-neutral-700 block">排序索引 (Sort Index)：</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={menuFormSort}
                    onChange={(e) => setMenuFormSort(parseInt(e.target.value))}
                    className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#fa541c] bg-white text-neutral-800 font-mono font-bold"
                  />
                </div>

                <div className="space-y-1.5 select-none">
                  <label className="font-bold text-neutral-700 block">菜单可见性配置：</label>
                  <button
                    type="button"
                    onClick={() => setMenuFormHidden(!menuFormHidden)}
                    className={cn(
                      "w-full text-center py-2 border rounded-lg font-bold transition-all cursor-pointer",
                      menuFormHidden ? "border-amber-300 bg-amber-50 text-amber-700" : "border-neutral-200 text-neutral-body"
                    )}
                  >
                    {menuFormHidden ? "✕ 隐藏节点 (侧栏不显示)" : "✓ 显示节点 (侧栏正常显示)"}
                  </button>
                </div>
              </div>

            </div>

            {/* Actions */}
            <div className="px-6 py-4 bg-neutral-50 border-t border-neutral-border flex items-center justify-end gap-3 shrink-0 select-none">
              <button
                type="button"
                onClick={() => setShowMenuModal(false)}
                className="bg-white hover:bg-neutral-100 text-neutral-body font-bold px-4 py-2 border border-neutral-border rounded-lg cursor-pointer transition-colors"
              >
                取消
              </button>
              <button
                type="submit"
                className="bg-[#fa541c] hover:bg-[#e84a15] text-white font-bold px-5 py-2 rounded-lg cursor-pointer transition-colors shadow-sm"
              >
                保存导航配置
              </button>
            </div>

          </form>
        </div>
      )}

      {/* 2. SINGLE TENANT QUOTA ADJUSTMENT DRAWER */}
      {showAdjustModal && adjustTenant && (
        <div className="fixed inset-0 z-[150] overflow-hidden flex justify-end bg-black/35 backdrop-blur-3xs animate-fade-in select-none">
          <div className="flex-1" onClick={() => setShowAdjustModal(false)}></div>
          
          <div className="w-full max-w-[500px] bg-white h-full shadow-2xl flex flex-col justify-between animate-slide-left text-xs">
            
            {/* Header */}
            <div className="p-6 border-b border-neutral-border flex items-center justify-between shrink-0 bg-neutral-50">
              <div className="flex items-center gap-2">
                <Sliders className="w-5.5 h-5.5 text-[#fa541c]" />
                <h2 className="text-base font-black text-neutral-title">
                  单独微调「{adjustTenant.name}」资源上限
                </h2>
              </div>
              <button 
                onClick={() => setShowAdjustModal(false)}
                className="p-1 rounded-full text-neutral-400 hover:bg-neutral-200 hover:text-neutral-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body Forms */}
            <form onSubmit={handleSaveAdjust} className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar text-neutral-body">
              
              <div className="p-4 bg-[#fff2e8]/45 border border-[#ffbb96]/45 rounded-lg space-y-1 font-medium leading-relaxed">
                <span className="text-[#fa541c] font-black block">🔐 系统安全容量红线提示:</span>
                <p className="text-[10.5px]">
                  微调时，任一资源的已分配限额**绝对不能低于**该租户当前的“已用量”。如果租户额度已经到期或冻结，微调参数不会自动接触冻结。
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="font-black text-neutral-title text-sm border-l-3 border-[#fa541c] pl-2">
                  调整各项核心配额上限
                </h3>

                <div className="space-y-4">
                  {/* Courses */}
                  <div className="space-y-1.5">
                    <label className="font-bold text-neutral-700 block">课程发布配额数 (已用 {adjustTenant.courses.used} 门)：</label>
                    <input
                      type="number"
                      required
                      min={adjustTenant.courses.used}
                      value={adjCourses}
                      onChange={(e) => setAdjCourses(parseInt(e.target.value))}
                      className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#fa541c] bg-white font-mono font-bold"
                    />
                  </div>

                  {/* Projects */}
                  <div className="space-y-1.5">
                    <label className="font-bold text-neutral-700 block">实训项目配额数 (已用 {adjustTenant.projects.used} 个)：</label>
                    <input
                      type="number"
                      required
                      min={adjustTenant.projects.used}
                      value={adjProjects}
                      onChange={(e) => setAdjProjects(parseInt(e.target.value))}
                      className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#fa541c] bg-white font-mono font-bold"
                    />
                  </div>

                  {/* Practices */}
                  <div className="space-y-1.5">
                    <label className="font-bold text-neutral-700 block">最佳实践库数 (已用 {adjustTenant.practices.used} 项)：</label>
                    <input
                      type="number"
                      required
                      min={adjustTenant.practices.used}
                      value={adjPractices}
                      onChange={(e) => setAdjPractices(parseInt(e.target.value))}
                      className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#fa541c] bg-white font-mono font-bold"
                    />
                  </div>

                  {/* Datasets */}
                  <div className="space-y-1.5">
                    <label className="font-bold text-neutral-700 block">共享数据集限额容量 (已用 {adjustTenant.datasetsGb.used} GB)：</label>
                    <input
                      type="number"
                      required
                      min={adjustTenant.datasetsGb.used}
                      value={adjDatasets}
                      onChange={(e) => setAdjDatasets(parseInt(e.target.value))}
                      className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#fa541c] bg-white font-mono font-bold"
                    />
                  </div>

                  {/* GPU */}
                  <div className="space-y-1.5">
                    <label className="font-bold text-neutral-[#fa541c] block">GPU 物理算力时长 (已用 {adjustTenant.gpuHours.used} 卡时)：</label>
                    <input
                      type="number"
                      required
                      min={adjustTenant.gpuHours.used}
                      value={adjGpu}
                      onChange={(e) => setAdjGpu(parseInt(e.target.value))}
                      className="w-full border border-[#ffbb96] rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#fa541c] bg-white font-mono font-black"
                    />
                  </div>

                  {/* Tokens */}
                  <div className="space-y-1.5">
                    <label className="font-bold text-[#fa541c] block">AI 大模型 Token 额度上限 (已用 {adjustTenant.tokensM.used.toFixed(1)}M)：</label>
                    <input
                      type="number"
                      required
                      min={adjustTenant.tokensM.used}
                      value={adjTokens}
                      onChange={(e) => setAdjTokens(parseInt(e.target.value))}
                      className="w-full border border-[#ffbb96] rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#fa541c] bg-white font-mono font-black"
                    />
                  </div>

                </div>
              </div>

            </form>

            {/* Footer */}
            <div className="p-6 bg-neutral-50 border-t border-neutral-border flex gap-3 shrink-0">
              <button
                type="submit"
                onClick={handleSaveAdjust}
                className="bg-[#fa541c] hover:bg-[#e84a15] text-white font-bold px-4 py-2.5 rounded-lg flex-1 cursor-pointer transition-colors shadow-3xs text-center"
              >
                保存配额参数修改
              </button>
              <button
                type="button"
                onClick={() => setShowAdjustModal(false)}
                className="bg-white hover:bg-neutral-100 text-neutral-body font-bold border border-neutral-200 px-4 py-2.5 rounded-lg flex-1 cursor-pointer transition-colors text-center shadow-3xs"
              >
                放弃返回
              </button>
            </div>

          </div>
        </div>
      )}

      {/* 3. BATCH RESOURCE ALLOCATION MODAL (批量划拨配额弹窗) */}
      {showBatchModal && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/35 backdrop-blur-3xs p-4 animate-fade-in text-xs font-sans select-none">
          <form onSubmit={handleSaveBatchAllocation} className="w-full max-w-[480px] bg-white rounded-2xl shadow-2xl overflow-hidden animate-scale-up flex flex-col">
            
            {/* Header */}
            <div className="bg-neutral-50 px-6 py-4 border-b border-neutral-border flex items-center justify-between shrink-0">
              <span className="font-black text-neutral-title text-sm flex items-center gap-1.5">
                <ListPlus className="w-4.5 h-4.5 text-[#fa541c]" />
                <span>批量调配多租户容量配额</span>
              </span>
              <button 
                type="button"
                onClick={() => setShowBatchModal(false)}
                className="text-neutral-400 hover:text-neutral-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-4 text-neutral-body font-semibold">
              
              {/* Checkboxes of tenants */}
              <div className="space-y-1.5">
                <label className="font-bold text-neutral-700 block">选择需要批量处理的目标租户（可多选）：</label>
                <div className="grid grid-cols-2 gap-2 bg-neutral-50 p-3 rounded-xl border border-neutral-200/50 max-h-[140px] overflow-y-auto custom-scrollbar">
                  {tenantResources.map((t) => {
                    const isChecked = selectedBatchTenantIds.includes(t.id);
                    return (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => {
                          if (isChecked) {
                            setSelectedBatchTenantIds(selectedBatchTenantIds.filter(id => id !== t.id));
                          } else {
                            setSelectedBatchTenantIds([...selectedBatchTenantIds, t.id]);
                          }
                        }}
                        className="text-left flex items-center gap-2 text-[10.5px] font-semibold cursor-pointer"
                      >
                        {isChecked ? (
                          <CheckSquare className="w-4 h-4 text-[#fa541c] shrink-0" />
                        ) : (
                          <Square className="w-4 h-4 text-neutral-300 shrink-0" />
                        )}
                        <span className="truncate">{t.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Resource Select type */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-bold text-neutral-700 block">选择分配资源类别：</label>
                  <select
                    value={batchResourceType}
                    onChange={(e) => setBatchResourceType(e.target.value as any)}
                    className="w-full border border-neutral-200 rounded-lg px-3 py-2 bg-white text-neutral-title font-bold"
                  >
                    <option value="gpuHours">GPU 算力时长 (卡时)</option>
                    <option value="tokensM">AI Token配额 (百万)</option>
                    <option value="datasetsGb">数据集容量 (GB)</option>
                    <option value="projects">实训项目数上限</option>
                    <option value="courses">课程发布配额数</option>
                    <option value="practices">最佳实践案例数</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-neutral-700 block">选择追加或划减操作：</label>
                  <select
                    value={batchAction}
                    onChange={(e) => setBatchAction(e.target.value as any)}
                    className="w-full border border-neutral-200 rounded-lg px-3 py-2 bg-white text-neutral-title font-bold"
                  >
                    <option value="add">✓ 批量追加 (额度上升)</option>
                    <option value="reduce">✕ 批量调减 (额度下降)</option>
                  </select>
                </div>
              </div>

              {/* Delta Value */}
              <div className="space-y-1.5">
                <label className="font-bold text-[#fa541c] block">输入本次要变化的数量增量值：</label>
                <input
                  type="number"
                  required
                  min={1}
                  value={batchDeltaVal}
                  onChange={(e) => setBatchDeltaVal(parseInt(e.target.value))}
                  className="w-full border border-[#ffbb96] rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#fa541c] bg-white font-mono font-black"
                />
              </div>

            </div>

            {/* Actions */}
            <div className="px-6 py-4 bg-neutral-50 border-t border-neutral-border flex items-center justify-end gap-3 shrink-0">
              <button
                type="button"
                onClick={() => setShowBatchModal(false)}
                className="bg-white hover:bg-neutral-100 text-neutral-body font-bold px-4 py-2 border border-neutral-border rounded-lg cursor-pointer transition-colors"
              >
                取消
              </button>
              <button
                type="submit"
                disabled={selectedBatchTenantIds.length === 0}
                className={cn(
                  "font-bold px-5 py-2 rounded-lg cursor-pointer transition-colors shadow-sm text-white",
                  selectedBatchTenantIds.length === 0 
                    ? "bg-neutral-300 cursor-not-allowed" 
                    : "bg-[#fa541c] hover:bg-[#e84a15]"
                )}
              >
                确认批量划拨额度
              </button>
            </div>

          </form>
        </div>
      )}

      </div>
    </div>
  );
}
