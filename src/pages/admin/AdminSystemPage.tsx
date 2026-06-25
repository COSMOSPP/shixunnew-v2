import React, { useState, useEffect, useRef } from "react";
import { 
  Settings, List, Shield, Key, Cloud, Activity, FileText, Search, 
  Plus, Edit, Trash2, Sliders, Play, TrendingUp, BarChart2, Download, 
  Filter, AlertCircle, Check, RefreshCw, X, ChevronRight, Cpu, 
  AlertTriangle, Server, Database, Terminal, ShieldAlert, Copy, RefreshCcw, CheckCircle,
  ChevronDown, Eye, EyeOff
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// --- Data Interfaces ---

interface PlatformTag {
  id: string;
  name: string;
  tagGroup: string;
  createdAt: string;
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

interface CloudPlatform {
  id: string;
  name: string;
  platformType: "ctyun" | "proxmox" | "cloudpods" | "kubernetes" | "huawei" | "aliyun" | "tencent" | "ceph" | "nfs" | "minio" | "glusterfs" | "k3s" | "openshift" | "openstack" | "vmware";
  type: string;
  pluginId: string;
  status: "启用" | "未启用";
  createdAt: string;
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

interface ResourcePool {
  id: string;
  name: string;
  associatedPlugin: string;
  createdAt: string;
  ak?: string;
  sk?: string;
}

// --- Initial Mock Data ---

const initialTags: PlatformTag[] = [
  { id: "tag-1", name: "私有云", tagGroup: "私有云", createdAt: "2026-06-17 01:31:43" },
  { id: "tag-2", name: "公有云", tagGroup: "111", createdAt: "2026-06-17 01:31:34" },
  { id: "tag-3", name: "IT", tagGroup: "IT", createdAt: "2026-06-17 01:31:19" },
  { id: "tag-4", name: "人工智能", tagGroup: "aaa", createdAt: "2026-06-16 07:55:13" },
  { id: "tag-5", name: "AI", tagGroup: "test", createdAt: "2026-06-16 07:03:52" }
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

const initialPlatforms: CloudPlatform[] = [
  { id: "plat-1", name: "天翼云资源池", platformType: "ctyun", type: "公有云", pluginId: "c4s33451d4plnhp3zidf", status: "未启用", createdAt: "2026-05-26 15:58" },
  { id: "plat-2", name: "pve", platformType: "proxmox", type: "私有云", pluginId: "private", status: "启用", createdAt: "2025-05-08 15:24" },
  { id: "plat-3", name: "实训云(临时)", platformType: "cloudpods", type: "私有云", pluginId: "private-qsohfH", status: "未启用", createdAt: "2024-12-25 09:28" },
  { id: "plat-4", name: "天翼云", platformType: "ctyun", type: "公有云", pluginId: "se9cyxgrzoj27vt1ijzm", status: "启用", createdAt: "2024-11-23 10:35" },
  { id: "plat-5", name: "kubernetes容器平台", platformType: "kubernetes", type: "容器", pluginId: "h2ahwz1awycagfymsp7cc", status: "启用", createdAt: "2024-04-19 17:29" },
  { id: "plat-6", name: "Ideal实训云", platformType: "cloudpods", type: "私有云", pluginId: "private", status: "启用", createdAt: "2024-04-19 17:29" },
  { id: "plat-7", name: "华为云", platformType: "huawei", type: "公有云", pluginId: "faanhu6yfo2ep84v7kxg4", status: "启用", createdAt: "2024-04-19 17:28" },
  { id: "plat-8", name: "Ceph存储平台", platformType: "ceph", type: "存储", pluginId: "ceph-storage-pool", status: "启用", createdAt: "2026-06-01 10:00" }
];

const initialLogs: SystemLog[] = [
  { id: "log-1", time: "2026-05-27 22:04:12", operator: "admin", type: "配额微调", target: "清华大学计算机系", ip: "192.168.1.102", result: "成功", module: "AI配额", abnormal: false },
  { id: "log-2", time: "2026-05-27 22:02:45", operator: "zhang_manager", type: "封禁队伍", target: "PyTorch狂热粉 (上海交通大学)", ip: "192.168.1.45", result: "成功", module: "竞赛管理", abnormal: false },
  { id: "log-3", time: "2026-05-27 21:50:30", operator: "li_support", type: "插件卸载", target: "DeepSeek API Gateway", ip: "192.168.2.14", result: "异常中止", module: "插件管理", abnormal: true },
  { id: "log-4", time: "2026-05-27 21:40:02", operator: "admin", type: "创建标签", target: "RAG检索增强", ip: "192.168.1.102", result: "成功", module: "系统管理", abnormal: false },
  { id: "log-5", time: "2026-05-27 21:12:15", operator: "wang_content", type: "修改得分", target: "影像切割大师 (复旦大学医学院)", ip: "192.168.1.88", result: "成功", module: "竞赛管理", abnormal: false }
];

const initialPools: ResourcePool[] = [
  { id: "pool-1", name: "k8s", associatedPlugin: "容器", createdAt: "2026-05-26 15:58", ak: "ak-k8s-example", sk: "sk-k8s-example" },
  { id: "pool-2", name: "天翼云", associatedPlugin: "公有云", createdAt: "2025-05-08 15:24", ak: "ak-ctyun-example", sk: "sk-ctyun-example" },
  { id: "pool-3", name: "idealpods", associatedPlugin: "私有云", createdAt: "2024-12-25 09:28", ak: "ak-pods-example", sk: "sk-pods-example" },
  { id: "pool-4", name: "pve", associatedPlugin: "私有云", createdAt: "2024-11-23 10:35", ak: "ak-pve-example", sk: "sk-pve-example" },
  { id: "pool-5", name: "ceph", associatedPlugin: "存储", createdAt: "2024-04-19 17:29", ak: "ak-ceph-example", sk: "sk-ceph-example" }
];

// 6 months monitor metrics datasets
const initialTrends: Record<string, number[]> = {
  "CPU使用率": [25, 32, 45, 38, 52, 45],
  "网络延迟(ms)": [180, 150, 120, 135, 110, 120]
};

const renderPlatformLogo = (platformType: string) => {
  switch (platformType) {
    case "ctyun":
      return (
        <div className="flex items-center gap-2 select-none">
          <svg className="w-6 h-6 shrink-0 text-[#e60012]" viewBox="0 0 100 100" fill="currentColor">
            <path d="M70,50 C70,39 61,30 50,30 C44,30 38,33 34,38 C30,35 25,33 20,33 C9,33 0,42 0,53 C0,64 9,73 20,73 L70,73 C78,73 85,66 85,58 C85,50 78,50 70,50 Z" />
            <path d="M90,40 C90,34 85,30 80,30 C78,30 76,31 75,32 C72,25 65,20 57,20 C50,20 44,24 41,30 C38,30 36,30 35,30 C27,30 20,37 20,45 C20,46 20,47 20,48 C23,47 26,46 30,46 C34,40 41,36 50,36 C61,36 71,44 72,55 C76,55 80,57 82,60 C87,58 90,53 90,47 C90,44 90,41 90,40 Z" opacity="0.6"/>
          </svg>
          <div className="flex flex-col text-[#e60012] text-left leading-none">
            <span className="font-bold text-xs tracking-wide">天翼云</span>
            <span className="text-[7px] font-sans scale-90 -ml-0.5 mt-0.5">State Cloud</span>
          </div>
        </div>
      );
    case "proxmox":
      return (
        <div className="flex items-center gap-2 select-none">
          <div className="relative w-6 h-6 shrink-0 flex items-center justify-center">
            <svg viewBox="0 0 100 100" className="w-5 h-5">
              <polygon points="10,10 40,10 90,90 60,90" fill="#f25f22" />
              <polygon points="60,10 90,10 40,90 10,90" fill="#231f20" />
            </svg>
          </div>
          <span className="font-black text-[12px] tracking-tight text-[#231f20] font-sans">
            <span className="text-[#f25f22]">PROX</span>MOX
          </span>
        </div>
      );
    case "cloudpods":
      return (
        <div className="flex items-center gap-2 select-none">
          <svg className="w-5.5 h-5.5 shrink-0 text-[#00a854]" viewBox="0 0 100 100" fill="currentColor">
            <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="12" />
            <path d="M50,25 C36,25 25,36 25,50 C25,58 29,65 35,70 L42,62 C38,59 36,55 36,50 C36,42 42,36 50,36 C58,36 64,42 64,50 C64,55 62,59 58,62 L65,70 C71,65 75,58 75,50 C75,36 64,25 50,25 Z" />
            <circle cx="50" cy="50" r="10" />
          </svg>
          <span className="font-bold text-xs text-neutral-800 font-sans tracking-tight">Cloudpods</span>
        </div>
      );
    case "kubernetes":
      return (
        <div className="flex items-center gap-2 select-none">
          <svg className="w-5.5 h-5.5 shrink-0 text-[#326ce5]" viewBox="0 0 100 100" fill="currentColor">
            <polygon points="50,5 90,28 90,72 50,95 10,72 10,28" fill="none" stroke="currentColor" strokeWidth="10" />
            <circle cx="50" cy="50" r="20" fill="none" stroke="currentColor" strokeWidth="6" />
            <line x1="50" y1="5" x2="50" y2="95" stroke="currentColor" strokeWidth="8" />
            <line x1="10" y1="28" x2="90" y2="72" stroke="currentColor" strokeWidth="8" />
            <line x1="10" y1="72" x2="90" y2="28" stroke="currentColor" strokeWidth="8" />
          </svg>
          <span className="font-bold text-xs text-neutral-800 font-sans tracking-tight">kubernetes</span>
        </div>
      );
    case "huawei":
      return (
        <div className="flex items-center gap-2 select-none">
          <svg className="w-5.5 h-5.5 shrink-0 text-[#ec1c24]" viewBox="0 0 100 100" fill="currentColor">
            <path d="M50,50 C50,50 42,20 50,10 C58,20 50,50 50,50" />
            <path d="M50,50 C50,50 22,28 15,38 C25,44 50,50 50,50" />
            <path d="M50,50 C50,50 15,55 12,66 C23,67 50,50 50,50" />
            <path d="M50,50 C50,50 28,78 38,85 C44,75 50,50 50,50" />
            <path d="M50,50 C50,50 58,78 62,85 C66,75 50,50 50,50" />
            <path d="M50,50 C50,50 78,58 88,66 C85,55 50,50 50,50" />
            <path d="M50,50 C50,50 85,38 88,28 C78,28 50,50 50,50" />
            <path d="M50,50 C50,50 58,20 62,10 C66,20 50,50 50,50" opacity="0.8" />
          </svg>
          <span className="font-black text-xs text-neutral-800 font-sans tracking-tight">HUAWEI</span>
        </div>
      );
    case "aliyun":
      return (
        <div className="flex items-center gap-2 select-none">
          <svg className="w-5.5 h-5.5 shrink-0 text-[#ff6a00]" viewBox="0 0 100 100" fill="currentColor">
            <rect x="15" y="15" width="70" height="70" fill="none" stroke="currentColor" strokeWidth="12" rx="10" />
            <path d="M35,35 L65,35 M35,50 L65,50 M35,65 L55,65" stroke="currentColor" strokeWidth="10" strokeLinecap="round" />
          </svg>
          <span className="font-bold text-xs text-neutral-800 font-sans tracking-tight">阿里云</span>
        </div>
      );
    case "tencent":
      return (
        <div className="flex items-center gap-2 select-none">
          <svg className="w-5.5 h-5.5 shrink-0 text-[#0052d9]" viewBox="0 0 100 100" fill="currentColor">
            <path d="M50,20 C35,20 25,32 25,48 C25,65 38,72 50,72 C62,72 75,65 75,48 C75,32 65,20 50,20 Z" fill="none" stroke="currentColor" strokeWidth="10" />
            <circle cx="42" cy="45" r="8" />
            <circle cx="58" cy="45" r="8" />
            <path d="M35,60 Q50,68 65,60" fill="none" stroke="currentColor" strokeWidth="6" />
          </svg>
          <span className="font-bold text-xs text-neutral-800 font-sans tracking-tight">腾讯云</span>
        </div>
      );
    case "k3s":
      return (
        <div className="flex items-center gap-2 select-none">
          <svg className="w-5.5 h-5.5 shrink-0 text-[#326ce5]" viewBox="0 0 100 100" fill="currentColor">
            <polygon points="50,15 85,35 85,65 50,85 15,65 15,35" fill="none" stroke="currentColor" strokeWidth="10" />
            <circle cx="50" cy="50" r="15" />
            <line x1="50" y1="15" x2="50" y2="85" stroke="currentColor" strokeWidth="6" />
          </svg>
          <span className="font-bold text-xs text-neutral-800 font-sans tracking-tight">K3s</span>
        </div>
      );
    case "openshift":
      return (
        <div className="flex items-center gap-2 select-none">
          <svg className="w-5.5 h-5.5 shrink-0 text-[#e00]" viewBox="0 0 100 100" fill="currentColor">
            <polygon points="50,10 90,30 90,70 50,90 10,70 10,30" fill="currentColor" opacity="0.15" />
            <polygon points="50,10 90,30 90,70 50,90 10,70 10,30" fill="none" stroke="currentColor" strokeWidth="10" />
            <path d="M30,50 L50,30 L70,50 L50,70 Z" stroke="currentColor" strokeWidth="8" fill="none" />
          </svg>
          <span className="font-bold text-xs text-neutral-800 font-sans tracking-tight">OpenShift</span>
        </div>
      );
    case "openstack":
      return (
        <div className="flex items-center gap-2 select-none">
          <svg className="w-5.5 h-5.5 shrink-0 text-[#f03e3e]" viewBox="0 0 100 100" fill="currentColor">
            <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="12" />
            <path d="M25,50 L75,50 M50,25 L50,75" stroke="currentColor" strokeWidth="10" />
          </svg>
          <span className="font-bold text-xs text-neutral-800 font-sans tracking-tight">OpenStack</span>
        </div>
      );
    case "vmware":
      return (
        <div className="flex items-center gap-2 select-none">
          <svg className="w-5.5 h-5.5 shrink-0 text-[#0095d9]" viewBox="0 0 100 100" fill="currentColor">
            <path d="M10,30 L90,30 M10,50 L90,50 M10,70 L90,70" stroke="currentColor" strokeWidth="12" strokeLinecap="round" />
            <path d="M30,20 L30,80 M70,20 L70,80" stroke="currentColor" strokeWidth="8" />
          </svg>
          <span className="font-bold text-xs text-neutral-800 font-sans tracking-tight">VMware</span>
        </div>
      );
    case "ceph":
      return (
        <div className="flex items-center gap-2 select-none">
          <svg className="w-5.5 h-5.5 shrink-0 text-[#f05053]" viewBox="0 0 100 100" fill="currentColor">
            <path d="M50,15 C30,15 15,30 15,50 C15,62 22,72 32,78 C35,65 42,55 50,55 C58,55 65,65 68,78 C78,72 85,62 85,50 C85,30 70,15 50,15 Z" fill="none" stroke="currentColor" strokeWidth="10" />
            <circle cx="35" cy="45" r="6" />
            <circle cx="65" cy="45" r="6" />
            <path d="M50,75 L50,90" stroke="currentColor" strokeWidth="8" strokeLinecap="round" />
            <path d="M40,80 L30,90" stroke="currentColor" strokeWidth="8" strokeLinecap="round" />
            <path d="M60,80 L70,90" stroke="currentColor" strokeWidth="8" strokeLinecap="round" />
          </svg>
          <span className="font-bold text-xs text-neutral-800 font-sans tracking-tight">Ceph</span>
        </div>
      );
    case "nfs":
      return (
        <div className="flex items-center gap-2 select-none">
          <svg className="w-5.5 h-5.5 shrink-0 text-[#5c6bc0]" viewBox="0 0 100 100" fill="currentColor">
            <rect x="20" y="20" width="60" height="60" rx="8" fill="none" stroke="currentColor" strokeWidth="10" />
            <rect x="35" y="40" width="30" height="20" fill="currentColor" />
            <line x1="50" y1="20" x2="50" y2="80" stroke="currentColor" strokeWidth="6" />
          </svg>
          <span className="font-bold text-xs text-neutral-800 font-sans tracking-tight">NFS 存储</span>
        </div>
      );
    case "minio":
      return (
        <div className="flex items-center gap-2 select-none">
          <svg className="w-5.5 h-5.5 shrink-0 text-[#c72c48]" viewBox="0 0 100 100" fill="currentColor">
            <path d="M15,50 Q50,15 85,50 Q50,85 15,50 Z" fill="none" stroke="currentColor" strokeWidth="10" />
            <circle cx="50" cy="50" r="10" />
          </svg>
          <span className="font-bold text-xs text-neutral-800 font-sans tracking-tight">MinIO</span>
        </div>
      );
    case "glusterfs":
      return (
        <div className="flex items-center gap-2 select-none">
          <svg className="w-5.5 h-5.5 shrink-0 text-[#388e3c]" viewBox="0 0 100 100" fill="currentColor">
            <path d="M20,30 L50,15 L80,30 L80,70 L50,85 L20,70 Z" fill="none" stroke="currentColor" strokeWidth="10" />
            <polygon points="50,15 80,30 50,45 20,30" fill="currentColor" opacity="0.2" />
            <line x1="50" y1="45" x2="50" y2="85" stroke="currentColor" strokeWidth="8" />
          </svg>
          <span className="font-bold text-xs text-neutral-800 font-sans tracking-tight">GlusterFS</span>
        </div>
      );
    default:
      return <span className="font-bold text-xs text-neutral-800">{platformType}</span>;
  }
};

export default function AdminSystemPage() {
  const [activeTab, setActiveTab] = useState<"tags" | "roles" | "plugins" | "pools" | "monitor" | "logs">("tags");

  // --- Reactive Component State Database ---
  const [tags, setTags] = useState<PlatformTag[]>(initialTags);
  const [roles, setRoles] = useState<OperationalRole[]>(initialRoles);
  const [platforms, setPlatforms] = useState<CloudPlatform[]>(initialPlatforms);
  const [pools, setPools] = useState<ResourcePool[]>(initialPools);
  const [systemLogs, setSystemLogs] = useState<SystemLog[]>(initialLogs);

  // --- Dynamic Toast Notifier ---
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const handleSimulateExport = (title: string) => {
    triggerToast(`📥 已成功模拟导出报表数据「${title}.csv」！`);
  };

  // ==================== TAB 1. 标签管理 ====================
  const [searchTagName, setSearchTagName] = useState("");
  const [showTagModal, setShowTagModal] = useState(false);
  const [editingTag, setEditingTag] = useState<PlatformTag | null>(null);
  const [formTagName, setFormTagName] = useState("");
  const [formTagGroup, setFormTagGroup] = useState("");
  const [tagCurrentPage, setTagCurrentPage] = useState(1);
  const [tagPageSize, setTagPageSize] = useState(10);

  const handleOpenCreateTag = () => {
    setEditingTag(null);
    setFormTagName("");
    setFormTagGroup("");
    setShowTagModal(true);
  };

  const handleOpenEditTag = (t: PlatformTag) => {
    setEditingTag(t);
    setFormTagName(t.name);
    setFormTagGroup(t.tagGroup);
    setShowTagModal(true);
  };

  const handleSaveTag = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTagName.trim() || !formTagGroup.trim()) {
      triggerToast("⚠️ 请填写完整信息！");
      return;
    }

    const now = new Date();
    const formatTime = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;

    if (editingTag) {
      setTags(tags.map(t => 
        t.id === editingTag.id 
          ? { ...t, name: formTagName.trim(), tagGroup: formTagGroup.trim() } 
          : t
      ));
      triggerToast(`💾 成功保存标签「${formTagName}」！`);
    } else {
      const newTag: PlatformTag = {
        id: `tag-${Date.now()}`,
        name: formTagName.trim(),
        tagGroup: formTagGroup.trim(),
        createdAt: formatTime
      };
      setTags([...tags, newTag]);
      triggerToast(`🎉 成功新建标签：「${newTag.name}」`);
    }
    setShowTagModal(false);
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

  // ==================== TAB 3. 云服务插件 ====================
  const [searchPlatformName, setSearchPlatformName] = useState("");
  const [selectedPlatIds, setSelectedPlatIds] = useState<string[]>([]);
  const [showPlatformModal, setShowPlatformModal] = useState(false);
  const [editingPlatform, setEditingPlatform] = useState<CloudPlatform | null>(null);
  const [formPlatName, setFormPlatName] = useState("");
  const [formPlatType, setFormPlatType] = useState("云主机");
  const [formPluginId, setFormPluginId] = useState("");
  const [formStatus, setFormStatus] = useState<CloudPlatform["status"]>("启用");
  const [platformCurrentPage, setPlatformCurrentPage] = useState(1);
  const [platformPageSize, setPlatformPageSize] = useState(10);

  const getPlatformTypeFromName = (name: string, type: string) => {
    const lowercase = name.toLowerCase();
    if (lowercase.includes("k8s") || lowercase.includes("kube") || type === "容器") return "kubernetes";
    if (lowercase.includes("proxmox") || lowercase.includes("pve")) return "proxmox";
    if (lowercase.includes("cloudpods") || lowercase.includes("ideal")) return "cloudpods";
    if (lowercase.includes("huawei")) return "huawei";
    if (lowercase.includes("ali") || lowercase.includes("alibaba")) return "aliyun";
    if (lowercase.includes("tencent")) return "tencent";
    if (lowercase.includes("ceph")) return "ceph";
    if (lowercase.includes("nfs")) return "nfs";
    return "ctyun";
  };

  const handleOpenCreatePlatform = () => {
    setEditingPlatform(null);
    setFormPlatName("");
    setFormPlatType("云主机");
    setFormPluginId("");
    setFormStatus("启用");
    setShowPlatformModal(true);
  };

  const handleOpenEditPlatform = (p: CloudPlatform) => {
    setEditingPlatform(p);
    setFormPlatName(p.name);
    setFormPlatType(p.type);
    setFormPluginId(p.pluginId);
    setFormStatus(p.status);
    setShowPlatformModal(true);
  };

  const handleSavePlatform = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formPlatName.trim() || !formPluginId.trim()) {
      triggerToast("⚠️ 请填写完整信息！");
      return;
    }

    const now = new Date();
    const formatTime = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const inferredPlatformType = getPlatformTypeFromName(formPlatName, formPlatType);

    if (editingPlatform) {
      setPlatforms(platforms.map(p => 
        p.id === editingPlatform.id 
          ? { ...p, name: formPlatName.trim(), platformType: inferredPlatformType, type: formPlatType, pluginId: formPluginId.trim(), status: formStatus } 
          : p
      ));
      triggerToast(`💾 成功保存云服务插件「${formPlatName}」配置！`);
    } else {
      const newPlatform: CloudPlatform = {
        id: `plat-${Date.now()}`,
        name: formPlatName.trim(),
        platformType: inferredPlatformType,
        type: formPlatType,
        pluginId: formPluginId.trim(),
        status: formStatus,
        createdAt: formatTime
      };
      setPlatforms([...platforms, newPlatform]);
      triggerToast(`🎉 成功新建云服务插件：「${newPlatform.name}」`);
    }
    setShowPlatformModal(false);
  };

  const handleDeletePlatform = (id: string, name: string) => {
    if (confirm(`确定要删除云服务插件吗？「${name}」`)) {
      setPlatforms(platforms.filter(p => p.id !== id));
      triggerToast(`🗑️ 已彻底删除云服务插件：「${name}」`);
    }
  };

  const handleTogglePlatformStatus = (id: string, name: string, currentStatus: CloudPlatform["status"]) => {
    const nextStatus: CloudPlatform["status"] = currentStatus === "启用" ? "未启用" : "启用";
    setPlatforms(platforms.map(p => 
      p.id === id ? { ...p, status: nextStatus } : p
    ));
    triggerToast(nextStatus === "启用" ? `⚡ 已启用云服务插件「${name}」` : `🔌 已禁用云服务插件「${name}」`);
  };

  // ==================== TAB 3.5. 资源池管理 ====================
  const [searchPoolName, setSearchPoolName] = useState("");
  const [poolCurrentPage, setPoolCurrentPage] = useState(1);
  const [poolPageSize, setPoolPageSize] = useState(10);

  const [showPoolModal, setShowPoolModal] = useState(false);
  const [editingPool, setEditingPool] = useState<ResourcePool | null>(null);

  // Form Fields
  const [formPoolName, setFormPoolName] = useState("");
  const [formPoolPlugin, setFormPoolPlugin] = useState("容器");

  // AK/SK Credential Modal States
  const [showAkSkModal, setShowAkSkModal] = useState(false);
  const [selectedPoolForAkSk, setSelectedPoolForAkSk] = useState<ResourcePool | null>(null);
  const [formPoolAk, setFormPoolAk] = useState("");
  const [formPoolSk, setFormPoolSk] = useState("");
  const [showSkPassword, setShowSkPassword] = useState(false);

  const handleOpenCreatePool = () => {
    setEditingPool(null);
    setFormPoolName("");
    setFormPoolPlugin("容器");
    setShowPoolModal(true);
  };

  const handleOpenEditPool = (pool: ResourcePool) => {
    setEditingPool(pool);
    setFormPoolName(pool.name);
    setFormPoolPlugin(pool.associatedPlugin);
    setShowPoolModal(true);
  };

  const handleSavePool = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formPoolName.trim()) {
      triggerToast("⚠️ 请填写资源池名称！");
      return;
    }

    const now = new Date();
    const formatTime = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    if (editingPool) {
      setPools(pools.map(p => 
        p.id === editingPool.id 
          ? { 
              ...p, 
              name: formPoolName.trim(), 
              associatedPlugin: formPoolPlugin 
            } 
          : p
      ));
      triggerToast(`💾 成功保存资源池「${formPoolName}」配置！`);
    } else {
      const newPool: ResourcePool = {
        id: `pool-${Date.now()}`,
        name: formPoolName.trim(),
        associatedPlugin: formPoolPlugin,
        createdAt: formatTime,
        ak: "",
        sk: ""
      };
      setPools([...pools, newPool]);
      triggerToast(`🎉 成功新建资源池：「${newPool.name}」`);
    }
    setShowPoolModal(false);
  };

  const handleDeletePool = (id: string, name: string) => {
    if (confirm(`确定要删除资源池吗？「${name}」`)) {
      setPools(pools.filter(p => p.id !== id));
      triggerToast(`🗑️ 已彻底删除资源池：「${name}」`);
    }
  };

  const handleOpenAkSkModal = (pool: ResourcePool) => {
    setSelectedPoolForAkSk(pool);
    setFormPoolAk(pool.ak || "");
    setFormPoolSk(pool.sk || "");
    setShowSkPassword(false);
    setShowAkSkModal(true);
  };

  const handleSaveAkSk = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPoolForAkSk) return;

    setPools(pools.map(p => 
      p.id === selectedPoolForAkSk.id 
        ? { ...p, ak: formPoolAk.trim(), sk: formPoolSk.trim() } 
        : p
    ));
    triggerToast(`🔑 成功保存资源池「${selectedPoolForAkSk.name}」的 AK/SK 凭证！`);
    setShowAkSkModal(false);
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
            { id: "tags", title: "标签管理", icon: List },
            { id: "roles", title: "运营角色权限", icon: Key },
            { id: "plugins", title: "云服务插件", icon: Cloud },
            { id: "pools", title: "资源池管理", icon: Server },
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
      <div className="flex-1 overflow-auto bg-[#f5f6f8] p-6 flex flex-col min-h-0 custom-scrollbar relative">
        
        {/* Toast Notifier */}
        {toastMessage && (
          <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-neutral-900 text-white px-5 py-3 rounded-lg shadow-lg flex items-center gap-2 border border-neutral-800 text-xs font-bold animate-slide-up">
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* ==================== 1. 标签体系管理 ==================== */}
        {/* ==================== 1. 标签管理 ==================== */}
        {activeTab === "tags" && (
          <div className="space-y-4 flex flex-col flex-1 min-h-0 animate-slide-up">
            
            {/* Top Title Section */}
            <div className="flex justify-between items-center shrink-0">
              <h1 className="text-xl font-bold text-neutral-900">标签管理</h1>
            </div>

            {/* Table Card */}
            <div className="bg-white rounded border border-neutral-border overflow-hidden flex flex-col flex-1 min-h-0">
              
              {/* Toolbar */}
              <div className="flex items-center justify-between gap-4 px-6 py-4 border-b border-neutral-border/50 shrink-0 bg-white">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                  <input
                    type="text"
                    placeholder="请输入标签名称"
                    value={searchTagName}
                    onChange={(e) => {
                      setSearchTagName(e.target.value);
                      setTagCurrentPage(1);
                    }}
                    className="pl-9 pr-4 py-2 w-64 bg-white border border-neutral-200 rounded-[4px] text-xs focus:outline-none focus:border-[#fa541c] text-neutral-800 placeholder-neutral-400 font-medium transition-all"
                  />
                </div>
                <button
                  onClick={handleOpenCreateTag}
                  className="bg-[#fa541c] hover:bg-[#e84a15] text-white text-xs font-semibold px-4.5 py-1.5 rounded-[4px] transition-colors cursor-pointer border-0 shadow-sm flex items-center h-8"
                >
                  新建
                </button>
              </div>

              {/* Table Container */}
              <div className="flex-1 overflow-auto custom-scrollbar">
                <table className="w-full text-left border-collapse whitespace-nowrap text-xs">
                  <thead>
                    <tr className="border-b border-neutral-100 bg-neutral-50/50 text-[13px] text-neutral-600 font-semibold select-none text-center">
                      <th className="p-4 font-semibold">标签名称</th>
                      <th className="p-4 font-semibold">标签组</th>
                      <th className="p-4 font-semibold">创建时间</th>
                      <th className="p-4 font-semibold">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100 font-sans text-neutral-700 text-center">
                    {(() => {
                      const filteredTags = tags.filter(t => 
                        t.name.toLowerCase().includes(searchTagName.toLowerCase()) ||
                        t.tagGroup.toLowerCase().includes(searchTagName.toLowerCase())
                      );
                      const tagStartIdx = (tagCurrentPage - 1) * tagPageSize;
                      const paginatedTags = filteredTags.slice(tagStartIdx, tagStartIdx + tagPageSize);

                      if (paginatedTags.length === 0) {
                        return (
                          <tr>
                            <td colSpan={4} className="p-12 text-neutral-400 text-center">
                              <AlertCircle className="w-8 h-8 text-neutral-300 mx-auto mb-2" />
                              <span>没有检索到与当前名称匹配的标签。</span>
                            </td>
                          </tr>
                        );
                      }

                      return paginatedTags.map((tag) => (
                        <tr key={tag.id} className="hover:bg-neutral-50/30 transition-colors text-[13px] border-b border-neutral-100 last:border-b-0">
                          <td className="p-4 text-center font-semibold text-neutral-800">{tag.name}</td>
                          <td className="p-4 text-center text-neutral-600">{tag.tagGroup}</td>
                          <td className="p-4 text-center text-neutral-500 font-mono">{tag.createdAt}</td>
                          <td className="p-4 text-center">
                            <button
                              onClick={() => handleOpenEditTag(tag)}
                              className="text-[#fa541c] hover:text-[#e84a15] font-semibold transition-colors cursor-pointer bg-transparent border-0 p-0 text-[13px] mr-3"
                            >
                              编辑
                            </button>
                            <button
                              onClick={() => handleDeleteTag(tag.id, tag.name)}
                              className="text-[#fa541c] hover:text-[#e84a15] font-semibold transition-colors cursor-pointer bg-transparent border-0 p-0 text-[13px]"
                            >
                              删除
                            </button>
                          </td>
                        </tr>
                      ));
                    })()}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {(() => {
                const filteredTags = tags.filter(t => 
                  t.name.toLowerCase().includes(searchTagName.toLowerCase()) ||
                  t.tagGroup.toLowerCase().includes(searchTagName.toLowerCase())
                );
                const totalTags = filteredTags.length;
                const totalTagPages = Math.ceil(totalTags / tagPageSize) || 1;

                return (
                  <div className="flex items-center justify-end p-4 gap-4 border-t border-neutral-100 bg-white shrink-0 select-none">
                    <span className="text-[13px] text-neutral-500">共 {totalTags} 条</span>
                    <div className="flex items-center gap-1.5">
                      <button 
                        disabled={tagCurrentPage === 1}
                        onClick={() => setTagCurrentPage(tagCurrentPage - 1)}
                        className={cn(
                          "h-7 w-7 rounded-sm border border-neutral-200 flex items-center justify-center text-[12px] transition-colors",
                          tagCurrentPage === 1 ? "text-neutral-300 bg-neutral-50 cursor-not-allowed border-neutral-100" : "text-neutral-600 hover:border-[#fa541c] hover:text-[#fa541c] cursor-pointer bg-white"
                        )}
                      >
                        &lt;
                      </button>
                      {Array.from({ length: totalTagPages }, (_, i) => i + 1).map((p) => (
                        <button
                          key={p}
                          onClick={() => setTagCurrentPage(p)}
                          className={cn(
                            "h-7 w-7 rounded-sm border text-[12px] font-bold transition-colors cursor-pointer",
                            p === tagCurrentPage 
                              ? "bg-[#fa541c] text-white border-[#fa541c]" 
                              : "bg-white border-neutral-200 text-neutral-600 hover:border-[#fa541c] hover:text-[#fa541c]"
                          )}
                        >
                          {p}
                        </button>
                      ))}
                      <button 
                        disabled={tagCurrentPage === totalTagPages}
                        onClick={() => setTagCurrentPage(tagCurrentPage + 1)}
                        className={cn(
                          "h-7 w-7 rounded-sm border border-neutral-200 flex items-center justify-center text-[12px] transition-colors",
                          tagCurrentPage === totalTagPages ? "text-neutral-300 bg-neutral-50 cursor-not-allowed border-neutral-100" : "text-neutral-600 hover:border-[#fa541c] hover:text-[#fa541c] cursor-pointer bg-white"
                        )}
                      >
                        &gt;
                      </button>
                    </div>
                    <select 
                      value={tagPageSize}
                      onChange={(e) => {
                        setTagPageSize(parseInt(e.target.value));
                        setTagCurrentPage(1);
                      }}
                      className="text-[13px] border border-neutral-200 rounded-sm px-2 py-1 focus:outline-none focus:border-[#fa541c] text-neutral-600 bg-white cursor-pointer"
                    >
                      <option value={10}>10 条/页</option>
                      <option value={20}>20 条/页</option>
                      <option value={50}>50 条/页</option>
                    </select>
                  </div>
                );
              })()}
            </div>

            {/* --- Tag Modal --- */}
            {showTagModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 backdrop-blur-xs p-4 animate-fade-in">
                <form onSubmit={handleSaveTag} className="w-full max-w-[440px] bg-white rounded-xl shadow-2xl overflow-hidden animate-scale-up flex flex-col text-xs border border-neutral-150">
                  
                  {/* Header */}
                  <div className="bg-neutral-50 px-6 py-4 border-b border-neutral-border flex items-center justify-between shrink-0">
                    <span className="font-black text-neutral-title text-sm flex items-center gap-1.5">
                      <List className="w-4.5 h-4.5 text-[#fa541c]" />
                      <span>{editingTag ? "编辑标签" : "新建标签"}</span>
                    </span>
                    <button 
                      type="button"
                      onClick={() => setShowTagModal(false)}
                      className="text-neutral-400 hover:text-neutral-700 cursor-pointer bg-transparent border-0"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Body inputs */}
                  <div className="p-6 space-y-4 text-left font-sans text-neutral-700">
                    
                    {/* Tag Name */}
                    <div className="space-y-1.5">
                      <label className="font-bold text-neutral-700 block text-xs">标签名称</label>
                      <input
                        type="text"
                        required
                        placeholder="请输入标签名称"
                        value={formTagName}
                        onChange={(e) => setFormTagName(e.target.value)}
                        className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-xs font-semibold text-neutral-title bg-white focus:outline-none focus:border-[#fa541c]"
                      />
                    </div>

                    {/* Tag Group */}
                    <div className="space-y-1.5">
                      <label className="font-bold text-neutral-700 block text-xs">标签组</label>
                      <input
                        type="text"
                        required
                        placeholder="请输入标签组"
                        value={formTagGroup}
                        onChange={(e) => setFormTagGroup(e.target.value)}
                        className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-xs font-semibold text-neutral-title bg-white focus:outline-none focus:border-[#fa541c]"
                      />
                    </div>

                  </div>

                  {/* Actions */}
                  <div className="px-6 py-4 bg-neutral-50 border-t border-neutral-border flex items-center justify-end gap-3 shrink-0">
                    <button
                      type="button"
                      onClick={() => setShowTagModal(false)}
                      className="bg-white hover:bg-neutral-100 text-neutral-title font-bold px-4 py-2 border border-neutral-border rounded-lg cursor-pointer transition-colors"
                    >
                      取消
                    </button>
                    <button
                      type="submit"
                      className="bg-[#fa541c] hover:bg-[#e84a15] text-white font-bold px-5 py-2 rounded-lg cursor-pointer transition-colors shadow-sm"
                    >
                      确定
                    </button>
                  </div>

                </form>
              </div>
            )}
          </div>
        )}

        {/* ==================== 2. 运营人员角色配置 ==================== */}
        {activeTab === "roles" && (
          <div className="space-y-4 flex flex-col flex-1 min-h-0 animate-slide-up">
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
                      className="text-neutral-400 hover:text-neutral-700 cursor-pointer bg-transparent border-0"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Body inputs */}
                  <div className="p-6 space-y-4 text-left">
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

        {/* ==================== 3. 管理端云平台管理 ==================== */}
        {activeTab === "plugins" && (
          <div className="space-y-4 flex flex-col flex-1 min-h-0 animate-slide-up">
            
            {/* Top Title Section */}
            <div className="flex justify-between items-center shrink-0">
              <h1 className="text-xl font-bold text-neutral-900">云服务插件</h1>
            </div>

            {/* Table Card */}
            <div className="bg-white rounded border border-neutral-border overflow-hidden flex flex-col flex-1 min-h-0">
              
              {/* Toolbar */}
              <div className="flex items-center justify-between gap-4 px-6 py-4 border-b border-neutral-border/50 shrink-0 bg-white">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                  <input
                    type="text"
                    placeholder="请输入"
                    value={searchPlatformName}
                    onChange={(e) => {
                      setSearchPlatformName(e.target.value);
                      setPlatformCurrentPage(1);
                    }}
                    className="pl-9 pr-4 py-2 w-64 bg-white border border-neutral-200 rounded-[4px] text-xs focus:outline-none focus:border-[#fa541c] text-neutral-800 placeholder-neutral-400 font-medium transition-all"
                  />
                </div>
                <button
                  onClick={handleOpenCreatePlatform}
                  className="bg-[#fa541c] hover:bg-[#e84a15] text-white text-xs font-semibold px-4.5 py-1.5 rounded-[4px] transition-colors cursor-pointer border-0 shadow-sm flex items-center h-8"
                >
                  新建
                </button>
              </div>

              {/* Table Container */}
              <div className="flex-1 overflow-auto custom-scrollbar">
                <table className="w-full text-left border-collapse whitespace-nowrap text-xs">
                  <thead>
                    <tr className="border-b border-neutral-100 bg-neutral-50/50 text-[13px] text-neutral-600 font-semibold select-none text-center">
                      <th className="p-4 font-semibold">云服务插件</th>
                      <th className="p-4 font-semibold">云服务插件类型</th>
                      <th className="p-4 font-semibold">插件ID</th>
                      <th className="p-4 font-semibold">状态</th>
                      <th className="p-4 font-semibold">创建时间</th>
                      <th className="p-4 font-semibold">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100 font-sans text-neutral-700 text-center">
                    {(() => {
                      const filteredPlatforms = platforms.filter(plat => 
                        plat.name.toLowerCase().includes(searchPlatformName.toLowerCase())
                      );
                      const totalPlatforms = filteredPlatforms.length;
                      const platformStartIdx = (platformCurrentPage - 1) * platformPageSize;
                      const paginatedPlatforms = filteredPlatforms.slice(platformStartIdx, platformStartIdx + platformPageSize);

                      if (paginatedPlatforms.length === 0) {
                        return (
                          <tr>
                            <td colSpan={6} className="p-12 text-neutral-400">
                              <AlertCircle className="w-8 h-8 text-neutral-300 mx-auto mb-2" />
                              <span>没有检索到与当前名称匹配的云服务插件。</span>
                            </td>
                          </tr>
                        );
                      }

                      return paginatedPlatforms.map((plat) => (
                        <tr key={plat.id} className="hover:bg-neutral-50/30 transition-colors text-[13px] border-b border-neutral-100 last:border-b-0">
                          <td className="p-4 text-center">
                            <div className="inline-block text-left">
                              {renderPlatformLogo(plat.platformType)}
                            </div>
                          </td>
                          <td className="p-4 text-neutral-600">{plat.type}</td>
                          <td className="p-4 text-neutral-500 font-mono">{plat.pluginId}</td>
                          <td className="p-4">
                            <span className={cn(
                              "px-2 py-0.5 rounded text-[12px] border font-medium font-sans inline-block",
                              plat.status === "启用" 
                                ? "bg-green-50 border-green-200 text-green-600" 
                                : "bg-neutral-50 border-neutral-200 text-neutral-500"
                            )}>
                              {plat.status}
                            </span>
                          </td>
                          <td className="p-4 text-neutral-500 font-mono">{plat.createdAt}</td>
                          <td className="p-4">
                            <button
                              onClick={() => handleOpenEditPlatform(plat)}
                              className="text-[#fa541c] hover:text-[#e84a15] font-semibold transition-colors cursor-pointer bg-transparent border-0 p-0 text-[13px] mr-3"
                            >
                              编辑
                            </button>
                            {plat.status === "启用" ? (
                              <button
                                onClick={() => handleTogglePlatformStatus(plat.id, plat.name, plat.status)}
                                className="text-[#fa541c] hover:text-[#e84a15] font-semibold transition-colors cursor-pointer bg-transparent border-0 p-0 text-[13px]"
                              >
                                禁用
                              </button>
                            ) : (
                              <>
                                <button
                                  onClick={() => handleTogglePlatformStatus(plat.id, plat.name, plat.status)}
                                  className="text-[#fa541c] hover:text-[#e84a15] font-semibold transition-colors cursor-pointer bg-transparent border-0 p-0 text-[13px] mr-3"
                                >
                                  启用
                                </button>
                                <button
                                  onClick={() => handleDeletePlatform(plat.id, plat.name)}
                                  className="text-[#fa541c] hover:text-[#e84a15] font-semibold transition-colors cursor-pointer bg-transparent border-0 p-0 text-[13px]"
                                >
                                  删除
                                </button>
                              </>
                            )}
                          </td>
                        </tr>
                      ));
                    })()}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {(() => {
                const filteredPlatforms = platforms.filter(plat => 
                  plat.name.toLowerCase().includes(searchPlatformName.toLowerCase())
                );
                const totalPlatforms = filteredPlatforms.length;
                const totalPlatformPages = Math.ceil(totalPlatforms / platformPageSize) || 1;

                return (
                  <div className="flex items-center justify-end p-4 gap-4 border-t border-neutral-100 bg-white shrink-0 select-none">
                    <span className="text-[13px] text-neutral-500">共 {totalPlatforms} 条</span>
                    <div className="flex items-center gap-1.5">
                      <button 
                        disabled={platformCurrentPage === 1}
                        onClick={() => setPlatformCurrentPage(platformCurrentPage - 1)}
                        className={cn(
                          "h-7 w-7 rounded-sm border border-neutral-200 flex items-center justify-center text-[12px] transition-colors",
                          platformCurrentPage === 1 ? "text-neutral-300 bg-neutral-50 cursor-not-allowed border-neutral-100" : "text-neutral-600 hover:border-[#fa541c] hover:text-[#fa541c] cursor-pointer bg-white"
                        )}
                      >
                        &lt;
                      </button>
                      {Array.from({ length: totalPlatformPages }, (_, i) => i + 1).map((p) => (
                        <button
                          key={p}
                          onClick={() => setPlatformCurrentPage(p)}
                          className={cn(
                            "h-7 w-7 rounded-sm border text-[12px] font-bold transition-colors cursor-pointer",
                            p === platformCurrentPage 
                              ? "bg-[#fa541c] text-white border-[#fa541c]" 
                              : "bg-white border-neutral-200 text-neutral-600 hover:border-[#fa541c] hover:text-[#fa541c]"
                          )}
                        >
                          {p}
                        </button>
                      ))}
                      <button 
                        disabled={platformCurrentPage === totalPlatformPages}
                        onClick={() => setPlatformCurrentPage(platformCurrentPage + 1)}
                        className={cn(
                          "h-7 w-7 rounded-sm border border-neutral-200 flex items-center justify-center text-[12px] transition-colors",
                          platformCurrentPage === totalPlatformPages ? "text-neutral-300 bg-neutral-50 cursor-not-allowed border-neutral-100" : "text-neutral-600 hover:border-[#fa541c] hover:text-[#fa541c] cursor-pointer bg-white"
                        )}
                      >
                        &gt;
                      </button>
                    </div>
                    <select 
                      value={platformPageSize}
                      onChange={(e) => {
                        setPlatformPageSize(parseInt(e.target.value));
                        setPlatformCurrentPage(1);
                      }}
                      className="text-[13px] border border-neutral-200 rounded-sm px-2 py-1 focus:outline-none focus:border-[#fa541c] text-neutral-600 bg-white cursor-pointer"
                    >
                      <option value={10}>10 条/页</option>
                      <option value={20}>20 条/页</option>
                      <option value={50}>50 条/页</option>
                    </select>
                  </div>
                );
              })()}
            </div>

            {/* --- Cloud Platform Modal --- */}
            {showPlatformModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 backdrop-blur-xs p-4 animate-fade-in">
                <form onSubmit={handleSavePlatform} className="w-full max-w-[440px] bg-white rounded-xl shadow-2xl overflow-hidden animate-scale-up flex flex-col text-xs border border-neutral-150">
                  
                  {/* Header */}
                  <div className="bg-neutral-50 px-6 py-4 border-b border-neutral-border flex items-center justify-between shrink-0">
                    <span className="font-black text-neutral-title text-sm flex items-center gap-1.5">
                      <Cloud className="w-4.5 h-4.5 text-[#fa541c]" />
                      <span>{editingPlatform ? "编辑云服务插件" : "新建云服务插件"}</span>
                    </span>
                    <button 
                      type="button"
                      onClick={() => setShowPlatformModal(false)}
                      className="text-neutral-400 hover:text-neutral-700 cursor-pointer bg-transparent border-0"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Body inputs */}
                  <div className="p-6 space-y-4 text-left font-sans text-neutral-700">
                    
                    {/* Name */}
                    <div className="space-y-1.5">
                      <label className="font-bold text-neutral-700 block text-xs">云服务插件</label>
                      <input
                        type="text"
                        required
                        placeholder="请输入云服务插件名称"
                        value={formPlatName}
                        onChange={(e) => setFormPlatName(e.target.value)}
                        className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-xs font-semibold text-neutral-title bg-white focus:outline-none focus:border-[#fa541c]"
                      />
                    </div>

                    {/* Type */}
                    <div className="space-y-1.5">
                      <label className="font-bold text-neutral-700 block text-xs">云服务插件类型</label>
                      <select
                        value={formPlatType}
                        onChange={(e) => setFormPlatType(e.target.value)}
                        className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-xs font-semibold text-neutral-title bg-white focus:outline-none focus:border-[#fa541c]"
                      >
                        <option value="容器">容器</option>
                        <option value="云主机">云主机</option>
                        <option value="公有云">公有云</option>
                        <option value="私有云">私有云</option>
                        <option value="存储">存储</option>
                      </select>
                    </div>

                    {/* Plugin ID */}
                    <div className="space-y-1.5">
                      <label className="font-bold text-neutral-700 block text-xs">插件ID</label>
                      <input
                        type="text"
                        required
                        placeholder="请输入插件ID"
                        value={formPluginId}
                        onChange={(e) => setFormPluginId(e.target.value)}
                        className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-xs font-semibold text-neutral-title bg-white focus:outline-none focus:border-[#fa541c]"
                      />
                    </div>

                    {/* Status */}
                    <div className="space-y-1.5">
                      <label className="font-bold text-neutral-700 block text-xs">状态</label>
                      <div className="flex items-center gap-4 py-1 select-none font-semibold text-neutral-600">
                        <label className="flex items-center gap-1.5 cursor-pointer">
                          <input
                            type="radio"
                            name="status-platform"
                            value="启用"
                            checked={formStatus === "启用"}
                            onChange={() => setFormStatus("启用")}
                            className="accent-[#fa541c]"
                          />
                          <span>启用</span>
                        </label>
                        <label className="flex items-center gap-1.5 cursor-pointer">
                          <input
                            type="radio"
                            name="status-platform"
                            value="未启用"
                            checked={formStatus === "未启用"}
                            onChange={() => setFormStatus("未启用")}
                            className="accent-[#fa541c]"
                          />
                          <span>未启用</span>
                        </label>
                      </div>
                    </div>

                  </div>

                  {/* Actions */}
                  <div className="px-6 py-4 bg-neutral-50 border-t border-neutral-border flex items-center justify-end gap-3 shrink-0">
                    <button
                      type="button"
                      onClick={() => setShowPlatformModal(false)}
                      className="bg-white hover:bg-neutral-100 text-neutral-title font-bold px-4 py-2 border border-neutral-border rounded-lg cursor-pointer transition-colors"
                    >
                      取消
                    </button>
                    <button
                      type="submit"
                      className="bg-[#fa541c] hover:bg-[#e84a15] text-white font-bold px-5 py-2 rounded-lg cursor-pointer transition-colors shadow-sm"
                    >
                      确定
                    </button>
                  </div>

                </form>
              </div>
            )}
          </div>
        )}

        {/* ==================== 3.5. 管理端资源池配置 ==================== */}
        {activeTab === "pools" && (
          <div className="space-y-4 flex flex-col flex-1 min-h-0 animate-slide-up">
            
            {/* Top Title Section */}
            <div className="flex justify-between items-center shrink-0">
              <h1 className="text-xl font-bold text-neutral-900">资源池管理</h1>
            </div>

            {/* Table Card */}
            <div className="bg-white rounded border border-neutral-border overflow-hidden flex flex-col flex-1 min-h-0">
              
              {/* Toolbar */}
              <div className="flex items-center justify-between gap-4 px-6 py-4 border-b border-neutral-border/50 shrink-0 bg-white">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                  <input
                    type="text"
                    placeholder="请输入"
                    value={searchPoolName}
                    onChange={(e) => {
                      setSearchPoolName(e.target.value);
                      setPoolCurrentPage(1);
                    }}
                    className="pl-9 pr-4 py-2 w-64 bg-white border border-neutral-200 rounded-[4px] text-xs focus:outline-none focus:border-[#fa541c] text-neutral-800 placeholder-neutral-400 font-medium transition-all"
                  />
                </div>
                <button
                  onClick={handleOpenCreatePool}
                  className="bg-[#fa541c] hover:bg-[#e84a15] text-white text-xs font-semibold px-4.5 py-1.5 rounded-[4px] transition-colors cursor-pointer border-0 shadow-sm flex items-center h-8"
                >
                  新建
                </button>
              </div>

              {/* Table Container */}
              <div className="flex-1 overflow-auto custom-scrollbar">
                <table className="w-full text-left border-collapse whitespace-nowrap text-xs">
                  <thead>
                    <tr className="border-b border-neutral-100 bg-neutral-50/50 text-[13px] text-neutral-600 font-semibold select-none text-center">
                      <th className="p-4 font-semibold">资源池名称</th>
                      <th className="p-4 font-semibold">关联云服务插件</th>
                      <th className="p-4 font-semibold">创建时间</th>
                      <th className="p-4 font-semibold">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100 font-sans text-neutral-700 text-center">
                    {(() => {
                      const filteredPools = pools.filter(pool => 
                        pool.name.toLowerCase().includes(searchPoolName.toLowerCase()) ||
                        pool.associatedPlugin.toLowerCase().includes(searchPoolName.toLowerCase())
                      );
                      const poolStartIdx = (poolCurrentPage - 1) * poolPageSize;
                      const paginatedPools = filteredPools.slice(poolStartIdx, poolStartIdx + poolPageSize);

                      if (paginatedPools.length === 0) {
                        return (
                          <tr>
                            <td colSpan={4} className="p-12 text-neutral-400 text-center">
                              <AlertCircle className="w-8 h-8 text-neutral-300 mx-auto mb-2" />
                              <span>没有检索到与当前名称匹配的资源池。</span>
                            </td>
                          </tr>
                        );
                      }

                      return paginatedPools.map((pool) => (
                        <tr key={pool.id} className="hover:bg-neutral-50/30 transition-colors text-[13px] border-b border-neutral-100 last:border-b-0">
                          <td className="p-4 text-center font-semibold text-neutral-800">{pool.name}</td>
                          <td className="p-4 text-center text-neutral-600">{pool.associatedPlugin}</td>
                          <td className="p-4 text-center text-neutral-500 font-mono">{pool.createdAt}</td>
                          <td className="p-4 text-center select-none">
                            <button
                              onClick={() => handleOpenEditPool(pool)}
                              className="text-[#fa541c] hover:text-[#e84a15] font-semibold transition-colors cursor-pointer bg-transparent border-0 p-0 text-[13px] mr-3"
                            >
                              编辑
                            </button>
                            <button
                              onClick={() => handleDeletePool(pool.id, pool.name)}
                              className="text-[#fa541c] hover:text-[#e84a15] font-semibold transition-colors cursor-pointer bg-transparent border-0 p-0 text-[13px] mr-3"
                            >
                              删除
                            </button>
                            <button
                              onClick={() => handleOpenAkSkModal(pool)}
                              className="text-[#fa541c] hover:text-[#e84a15] font-semibold transition-colors cursor-pointer bg-transparent border-0 p-0 text-[13px]"
                            >
                              AK/SK
                            </button>
                          </td>
                        </tr>
                      ));
                    })()}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {(() => {
                const filteredPools = pools.filter(pool => 
                  pool.name.toLowerCase().includes(searchPoolName.toLowerCase()) ||
                  pool.associatedPlugin.toLowerCase().includes(searchPoolName.toLowerCase())
                );
                const totalPools = filteredPools.length;
                const totalPoolPages = Math.ceil(totalPools / poolPageSize) || 1;

                return (
                  <div className="flex items-center justify-end p-4 gap-4 border-t border-neutral-100 bg-white shrink-0 select-none">
                    <span className="text-[13px] text-neutral-500">共 {totalPools} 条</span>
                    <div className="flex items-center gap-1.5">
                      <button 
                        disabled={poolCurrentPage === 1}
                        onClick={() => setPoolCurrentPage(poolCurrentPage - 1)}
                        className={cn(
                          "h-7 w-7 rounded-sm border border-neutral-200 flex items-center justify-center text-[12px] transition-colors",
                          poolCurrentPage === 1 ? "text-neutral-300 bg-neutral-50 cursor-not-allowed border-neutral-100" : "text-neutral-600 hover:border-[#fa541c] hover:text-[#fa541c] cursor-pointer bg-white"
                        )}
                      >
                        &lt;
                      </button>
                      {Array.from({ length: totalPoolPages }, (_, i) => i + 1).map((p) => (
                        <button
                          key={p}
                          onClick={() => setPoolCurrentPage(p)}
                          className={cn(
                            "h-7 w-7 rounded-sm border text-[12px] font-bold transition-colors cursor-pointer",
                            p === poolCurrentPage 
                              ? "bg-[#fa541c] text-white border-[#fa541c]" 
                              : "bg-white border-neutral-200 text-neutral-600 hover:border-[#fa541c] hover:text-[#fa541c]"
                          )}
                        >
                          {p}
                        </button>
                      ))}
                      <button 
                        disabled={poolCurrentPage === totalPoolPages}
                        onClick={() => setPoolCurrentPage(poolCurrentPage + 1)}
                        className={cn(
                          "h-7 w-7 rounded-sm border border-neutral-200 flex items-center justify-center text-[12px] transition-colors",
                          poolCurrentPage === totalPoolPages ? "text-neutral-300 bg-neutral-50 cursor-not-allowed border-neutral-100" : "text-neutral-600 hover:border-[#fa541c] hover:text-[#fa541c] cursor-pointer bg-white"
                        )}
                      >
                        &gt;
                      </button>
                    </div>
                    <select 
                      value={poolPageSize}
                      onChange={(e) => {
                        setPoolPageSize(parseInt(e.target.value));
                        setPoolCurrentPage(1);
                      }}
                      className="text-[13px] border border-neutral-200 rounded-sm px-2 py-1 focus:outline-none focus:border-[#fa541c] text-neutral-600 bg-white cursor-pointer"
                    >
                      <option value={10}>10 条/页</option>
                      <option value={20}>20 条/页</option>
                      <option value={50}>50 条/页</option>
                    </select>
                  </div>
                );
              })()}
            </div>

            {/* --- Resource Pool Form Dialog Modal --- */}
            {showPoolModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 backdrop-blur-xs p-4 animate-fade-in">
                <form onSubmit={handleSavePool} className="w-full max-w-[440px] bg-white rounded-xl shadow-2xl overflow-hidden animate-scale-up flex flex-col text-xs border border-neutral-150">
                  
                  {/* Header */}
                  <div className="bg-neutral-50 px-6 py-4 border-b border-neutral-border flex items-center justify-between shrink-0">
                    <span className="font-black text-neutral-title text-sm flex items-center gap-1.5">
                      <Server className="w-4.5 h-4.5 text-[#fa541c]" />
                      <span>{editingPool ? "编辑算力资源池" : "新建算力资源池"}</span>
                    </span>
                    <button 
                      type="button"
                      onClick={() => setShowPoolModal(false)}
                      className="text-neutral-400 hover:text-neutral-700 cursor-pointer bg-transparent border-0"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Body inputs */}
                  <div className="p-6 space-y-4 text-left font-sans text-neutral-700">
                    
                    {/* Pool Name */}
                    <div className="space-y-1.5">
                      <label className="font-bold text-neutral-700 block text-xs">资源池名称</label>
                      <input
                        type="text"
                        required
                        placeholder="请输入资源池名称"
                        value={formPoolName}
                        onChange={(e) => setFormPoolName(e.target.value)}
                        className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-xs font-semibold text-neutral-title bg-white focus:outline-none focus:border-[#fa541c]"
                      />
                    </div>

                    {/* Associated Cloud Plugin */}
                    <div className="space-y-1.5">
                      <label className="font-bold text-neutral-700 block text-xs">关联云服务插件</label>
                      <select
                        value={formPoolPlugin}
                        onChange={(e) => setFormPoolPlugin(e.target.value)}
                        className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-xs font-semibold text-neutral-title bg-white focus:outline-none focus:border-[#fa541c]"
                      >
                        <option value="容器">容器</option>
                        <option value="公有云">公有云</option>
                        <option value="私有云">私有云</option>
                        <option value="存储">存储</option>
                      </select>
                    </div>

                  </div>

                  {/* Actions */}
                  <div className="px-6 py-4 bg-neutral-50 border-t border-neutral-border flex items-center justify-end gap-3 shrink-0">
                    <button
                      type="button"
                      onClick={() => setShowPoolModal(false)}
                      className="bg-white hover:bg-neutral-100 text-neutral-title font-bold px-4 py-2 border border-neutral-border rounded-lg cursor-pointer transition-colors"
                    >
                      取消
                    </button>
                    <button
                      type="submit"
                      className="bg-[#fa541c] hover:bg-[#e84a15] text-white font-bold px-5 py-2 rounded-lg cursor-pointer transition-colors shadow-sm"
                    >
                      确定
                    </button>
                  </div>

                </form>
              </div>
            )}

            {/* --- AK/SK Credentials Modal --- */}
            {showAkSkModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 backdrop-blur-xs p-4 animate-fade-in">
                <form onSubmit={handleSaveAkSk} className="w-full max-w-[440px] bg-white rounded-xl shadow-2xl overflow-hidden animate-scale-up flex flex-col text-xs border border-neutral-150">
                  
                  {/* Header */}
                  <div className="bg-neutral-50 px-6 py-4 border-b border-neutral-border flex items-center justify-between shrink-0">
                    <span className="font-black text-neutral-title text-sm flex items-center gap-1.5">
                      <Key className="w-4.5 h-4.5 text-[#fa541c]" />
                      <span>配置 AK/SK 凭证</span>
                    </span>
                    <button 
                      type="button"
                      onClick={() => setShowAkSkModal(false)}
                      className="text-neutral-400 hover:text-neutral-700 cursor-pointer bg-transparent border-0"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Body inputs */}
                  <div className="p-6 space-y-4 text-left font-sans text-neutral-700">
                    
                    <div className="bg-neutral-50 rounded-lg p-3 border border-neutral-200 text-neutral-500 font-sans leading-normal select-none">
                      ⚠️ 凭证用于资源池 API 数据对接及鉴权通信，请妥善保管好您的 Secret Key。
                    </div>

                    {/* Access Key */}
                    <div className="space-y-1.5">
                      <label className="font-bold text-neutral-700 block text-xs">Access Key (AK)</label>
                      <input
                        type="text"
                        required
                        placeholder="请输入 Access Key"
                        value={formPoolAk}
                        onChange={(e) => setFormPoolAk(e.target.value)}
                        className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-xs font-semibold text-neutral-title bg-white focus:outline-none focus:border-[#fa541c]"
                      />
                    </div>

                    {/* Secret Key */}
                    <div className="space-y-1.5">
                      <label className="font-bold text-neutral-700 block text-xs">Secret Key (SK)</label>
                      <div className="relative">
                        <input
                          type={showSkPassword ? "text" : "password"}
                          required
                          placeholder="请输入 Secret Key"
                          value={formPoolSk}
                          onChange={(e) => setFormPoolSk(e.target.value)}
                          className="w-full border border-neutral-200 rounded-lg pl-3 pr-10 py-2 text-xs font-semibold text-neutral-title bg-white focus:outline-none focus:border-[#fa541c]"
                        />
                        <button
                          type="button"
                          onClick={() => setShowSkPassword(!showSkPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 bg-transparent border-0 cursor-pointer flex items-center p-0"
                        >
                          {showSkPassword ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>

                  </div>

                  {/* Actions */}
                  <div className="px-6 py-4 bg-neutral-50 border-t border-neutral-border flex items-center justify-end gap-3 shrink-0">
                    <button
                      type="button"
                      onClick={() => setShowAkSkModal(false)}
                      className="bg-white hover:bg-neutral-100 text-neutral-title font-bold px-4 py-2 border border-neutral-border rounded-lg cursor-pointer transition-colors"
                    >
                      取消
                    </button>
                    <button
                      type="submit"
                      className="bg-[#fa541c] hover:bg-[#e84a15] text-white font-bold px-5 py-2 rounded-lg cursor-pointer transition-colors shadow-sm"
                    >
                      确定
                    </button>
                  </div>

                </form>
              </div>
            )}
          </div>
        )}
        {/* ==================== 4. 管理端平台级监控管理 ==================== */}
        {activeTab === "monitor" && (
          <div className="space-y-4 flex flex-col flex-1 min-h-0 animate-slide-up">
            
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
          <div className="space-y-4 flex flex-col flex-1 min-h-0 animate-slide-up">
            
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
