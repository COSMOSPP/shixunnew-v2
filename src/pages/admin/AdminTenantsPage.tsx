import React, { useState, useEffect } from "react";
import { 
  Users, Plus, Search, Sliders, Shield, Activity, FileText, CheckCircle, 
  AlertTriangle, Clock, Settings, X, ChevronRight, Download, Info, Trash2, 
  Edit, Mail, Phone, Calendar, Key, Cpu, Database, TrendingUp, AlertCircle, 
  Check, RefreshCw, Lock, Unlock, ArrowUpRight, BarChart2, CheckSquare, 
  Square, ShieldCheck, MailCheck, BellRing, Copy
} from "lucide-react";
import { cn } from "@/lib/utils";

// --- Interfaces ---

interface TenantAdmin {
  name: string;
  phone: string;
  email: string;
}

interface TenantQuotas {
  students: number;
  studentsUsed: number;
  teachers: number;
  teachersUsed: number;
  gpuHours: number;
  gpuHoursUsed: number;
  cpuHours: number;
  cpuHoursUsed: number;
  projectsLimit: number;
  projectsUsed: number;
  datasetsGb: number;
  datasetsGbUsed: number;
  practicesUsed: number;
  practicesLimit: number;
  agentsLimit: number;
  agentsUsed: number;
  tokensLimit: number; // in Millions (M)
  tokensUsed: number;  // in Millions (M)
}

interface ResourceAuth {
  isAuthorized: boolean;
  resourceTypes: ("课程" | "项目" | "试题")[];
  authDate?: string;
  expireDate?: string;
}

interface Tenant {
  id: string;
  name: string;
  logo: string;
  description: string;
  status: "正常" | "禁用" | "到期";
  disableReason?: string;
  disableUntil?: string;
  admin: TenantAdmin;
  quotas: TenantQuotas;
  menuPermissions: string[];
  resourceAuth: ResourceAuth;
  createdAt: string;
  expireAt: string;
}

// --- Mock Data ---

const initialTenants: Tenant[] = [
  {
    id: "tenant-001",
    name: "北京大学信息学院",
    logo: "🎓",
    description: "以人工智能与电子信息学术研究为主的一流高校学院，承担多项国家级重点科研与人才实训课题。",
    status: "正常",
    admin: {
      name: "王博渊 教授",
      phone: "13910002001",
      email: "wangby@pku.edu.cn"
    },
    quotas: {
      students: 1500,
      studentsUsed: 1204,
      teachers: 150,
      teachersUsed: 98,
      gpuHours: 5000,
      gpuHoursUsed: 4350,
      cpuHours: 10000,
      cpuHoursUsed: 7800,
      projectsLimit: 200,
      projectsUsed: 186,
      datasetsGb: 2048,
      datasetsGbUsed: 1680,
      practicesLimit: 50,
      practicesUsed: 45,
      agentsLimit: 100,
      agentsUsed: 92,
      tokensLimit: 500,
      tokensUsed: 436.5 // 87.3%
    },
    menuPermissions: ["ai", "security", "public-cloud", "private-cloud", "audit"],
    resourceAuth: {
      isAuthorized: true,
      resourceTypes: ["课程", "项目", "试题"],
      authDate: "2026-01-10",
      expireDate: "2026-12-31"
    },
    createdAt: "2025-01-10",
    expireAt: "2026-12-31"
  },
  {
    id: "tenant-002",
    name: "清华大学计算机系",
    logo: "🏛️",
    description: "中国顶级计算机实训研究基地，专注于大模型微调、高级云原生开发实训及科研创新项目支撑。",
    status: "正常",
    admin: {
      name: "李清玄 主任",
      phone: "13811223344",
      email: "liqx@tsinghua.edu.cn"
    },
    quotas: {
      students: 2000,
      studentsUsed: 1850,
      teachers: 200,
      teachersUsed: 142,
      gpuHours: 8000,
      gpuHoursUsed: 4200,
      cpuHours: 15000,
      cpuHoursUsed: 8900,
      projectsLimit: 300,
      projectsUsed: 210,
      datasetsGb: 4096,
      datasetsGbUsed: 2310,
      practicesLimit: 100,
      practicesUsed: 62,
      agentsLimit: 200,
      agentsUsed: 110,
      tokensLimit: 1000,
      tokensUsed: 785.4 // 78.5%
    },
    menuPermissions: ["ai", "security", "public-cloud", "private-cloud", "it", "ip", "audit"],
    resourceAuth: {
      isAuthorized: true,
      resourceTypes: ["课程", "试题"],
      authDate: "2026-02-15",
      expireDate: "2026-08-15"
    },
    createdAt: "2025-02-15",
    expireAt: "2026-08-15"
  },
  {
    id: "tenant-003",
    name: "复旦大学软件学院",
    logo: "🛡️",
    description: "软件工程国家一流学科，重点培养高素质软件开发及人工智能系统集成方向的卓越工程人才。",
    status: "正常",
    admin: {
      name: "陈振华 老师",
      phone: "13766554433",
      email: "chenzh@fudan.edu.cn"
    },
    quotas: {
      students: 1000,
      studentsUsed: 890,
      teachers: 100,
      teachersUsed: 67,
      gpuHours: 3000,
      gpuHoursUsed: 2150,
      cpuHours: 8000,
      cpuHoursUsed: 4500,
      projectsLimit: 150,
      projectsUsed: 104,
      datasetsGb: 1024,
      datasetsGbUsed: 590,
      practicesLimit: 40,
      practicesUsed: 22,
      agentsLimit: 80,
      agentsUsed: 46,
      tokensLimit: 300,
      tokensUsed: 245.2 // 81.7%
    },
    menuPermissions: ["ai", "security", "audit"],
    resourceAuth: {
      isAuthorized: false,
      resourceTypes: []
    },
    createdAt: "2025-03-01",
    expireAt: "2026-06-30" // Expiring soon in ~1 month
  },
  {
    id: "tenant-004",
    name: "西安交通大学AI实验班",
    logo: "🤖",
    description: "拔尖创新AI人才实验班级，拥有独立的课程架构体系和深度大语言模型算力调试模块。",
    status: "禁用",
    disableReason: "合约账期账单付款拖延争议",
    disableUntil: "2026-06-30",
    admin: {
      name: "张旭东 教授",
      phone: "13599887766",
      email: "xdzhang@xjtu.edu.cn"
    },
    quotas: {
      students: 500,
      studentsUsed: 420,
      teachers: 50,
      teachersUsed: 28,
      gpuHours: 2000,
      gpuHoursUsed: 1850,
      cpuHours: 5000,
      cpuHoursUsed: 4200,
      projectsLimit: 80,
      projectsUsed: 75,
      datasetsGb: 512,
      datasetsGbUsed: 480,
      practicesLimit: 20,
      practicesUsed: 18,
      agentsLimit: 40,
      agentsUsed: 35,
      tokensLimit: 200,
      tokensUsed: 168.2 // 84.1%
    },
    menuPermissions: ["ai", "audit"],
    resourceAuth: {
      isAuthorized: false,
      resourceTypes: []
    },
    createdAt: "2025-04-10",
    expireAt: "2026-06-15"
  },
  {
    id: "tenant-005",
    name: "哈尔滨工业大学计算学部",
    logo: "🛸",
    description: "专注于云原生安全对抗、微服务高并发及大规模集群架构实训设计。拥有优质的课件库与卓越的实训声誉。",
    status: "到期",
    admin: {
      name: "刘松林 教授",
      phone: "13612345678",
      email: "slliu@hit.edu.cn"
    },
    quotas: {
      students: 1200,
      studentsUsed: 1150,
      teachers: 120,
      teachersUsed: 94,
      gpuHours: 4000,
      gpuHoursUsed: 3950,
      cpuHours: 12000,
      cpuHoursUsed: 11800,
      projectsLimit: 250,
      projectsUsed: 242,
      datasetsGb: 2048,
      datasetsGbUsed: 1980,
      practicesLimit: 60,
      practicesUsed: 58,
      agentsLimit: 120,
      agentsUsed: 114,
      tokensLimit: 600,
      tokensUsed: 590.2 // 98.3%
    },
    menuPermissions: ["ai", "security", "public-cloud", "private-cloud", "it", "ip", "audit"],
    resourceAuth: {
      isAuthorized: true,
      resourceTypes: ["项目", "试题"],
      authDate: "2025-05-20",
      expireDate: "2026-05-20" // Expired 8 days ago
    },
    createdAt: "2025-05-20",
    expireAt: "2026-05-20"
  },
  {
    id: "tenant-006",
    name: "百度智能云研发部",
    logo: "☁️",
    description: "平台外部共建企业实训合作租户，为内部研发工程师和校招新员工提供大模型基础调用与应用场景研发实战环境。",
    status: "正常",
    admin: {
      name: "赵华山 主管",
      phone: "13399881122",
      email: "zhaohuashan@baidu.com"
    },
    quotas: {
      students: 3000,
      studentsUsed: 620,
      teachers: 500,
      teachersUsed: 86,
      gpuHours: 10000,
      gpuHoursUsed: 2400,
      cpuHours: 20000,
      cpuHoursUsed: 6400,
      projectsLimit: 500,
      projectsUsed: 80,
      datasetsGb: 8192,
      datasetsGbUsed: 1240,
      practicesLimit: 150,
      practicesUsed: 15,
      agentsLimit: 300,
      agentsUsed: 42,
      tokensLimit: 2000,
      tokensUsed: 480.5 // 24.0%
    },
    menuPermissions: ["ai", "public-cloud", "private-cloud"],
    resourceAuth: {
      isAuthorized: false,
      resourceTypes: []
    },
    createdAt: "2025-09-01",
    expireAt: "2027-09-01"
  }
];

const availableSystemMenus = [
  { code: "ai", label: "人工智能大模型开发" },
  { code: "security", label: "系统安全与审计中心" },
  { code: "public-cloud", label: "公有云虚拟化网络" },
  { code: "private-cloud", label: "私有云物理数据节点" },
  { code: "it", label: "IT资产授权工单" },
  { code: "ip", label: "IP地址冲突与子网" },
  { code: "audit", label: "实训日志风控中心" }
];

export default function AdminTenantsPage() {
  const [activeTab, setActiveTab] = useState<"list" | "auth" | "monitor">("list");
  
  // --- States ---
  const [tenants, setTenants] = useState<Tenant[]>(initialTenants);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  
  // Search / Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"全部" | "正常" | "禁用" | "到期">("全部");
  const [usageFilter, setUsageFilter] = useState<"全部" | "正常使用" | "超额警告" | "额度耗尽">("全部");
  const [sortBy, setSortBy] = useState<"name" | "users" | "tokenUsage" | "expireDate">("name");
  
  // Modals & Sliders control
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);
  const [showDetailDrawer, setShowDetailDrawer] = useState(false);
  const [showCreateDrawer, setShowCreateDrawer] = useState(false);
  const [showEditDrawer, setShowEditDrawer] = useState(false);
  const [showDisableModal, setShowDisableModal] = useState(false);
  const [showRenewModal, setShowRenewModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showEmailReceipt, setShowEmailReceipt] = useState<any>(null); // receipt modal for mock email sending

  // Form states
  const [formName, setFormName] = useState("");
  const [formLogo, setFormLogo] = useState("🎓");
  const [formDesc, setFormDesc] = useState("");
  const [formAdminName, setFormAdminName] = useState("");
  const [formAdminPhone, setFormAdminPhone] = useState("");
  const [formAdminEmail, setFormAdminEmail] = useState("");
  
  // Quotas Form States (Numeric)
  const [formStudents, setFormStudents] = useState(1000);
  const [formTeachers, setFormTeachers] = useState(100);
  const [formGpu, setFormGpu] = useState(3000);
  const [formCpu, setFormCpu] = useState(6000);
  const [formProjects, setFormProjects] = useState(150);
  const [formDatasets, setFormDatasets] = useState(1024);
  const [formPractices, setFormPractices] = useState(50);
  const [formAgents, setFormAgents] = useState(100);
  const [formTokens, setFormTokens] = useState(500);
  const [formMenus, setFormMenus] = useState<string[]>(["ai", "audit"]);
  const [formDuration, setFormDuration] = useState("12"); // months

  // Disable Action States
  const [disableReason, setDisableReason] = useState("未足额缴费");
  const [customDisableReason, setCustomDisableReason] = useState("");
  const [disableUntil, setDisableUntil] = useState("2026-06-30");

  // Renewal Action States
  const [renewMonths, setRenewMonths] = useState("6");
  const [customRenewDate, setCustomRenewDate] = useState("");

  // Resource Auth Action States
  const [selectedAuthTypes, setSelectedAuthTypes] = useState<("课程" | "项目" | "试题")[]>(["课程"]);
  const [authDurationMonths, setAuthDurationMonths] = useState("6");
  const [authCreditChecked, setAuthCreditChecked] = useState(true);
  const [authQualityChecked, setAuthQualityChecked] = useState(true);
  const [authNoViolationChecked, setAuthNoViolationChecked] = useState(true);

  // Monitor Dynamism
  const [monitorTick, setMonitorTick] = useState(0);
  const [mockLiveUsers, setMockLiveUsers] = useState<number[]>([154, 186, 210, 195, 235, 258, 290, 274, 305]);

  // Dynamic simulation for online users graph ticking
  useEffect(() => {
    const timer = setInterval(() => {
      setMonitorTick(t => t + 1);
      setMockLiveUsers(prev => {
        const next = [...prev.slice(1)];
        const variance = Math.floor(Math.random() * 50) - 22;
        const currentLast = prev[prev.length - 1];
        const nextVal = Math.max(100, Math.min(600, currentLast + variance));
        next.push(nextVal);
        return next;
      });
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // --- Handlers ---

  const handleOpenCreateDrawer = () => {
    setFormName("");
    setFormLogo("🎓");
    setFormDesc("");
    setFormAdminName("");
    setFormAdminPhone("");
    setFormAdminEmail("");
    setFormStudents(1000);
    setFormTeachers(100);
    setFormGpu(3000);
    setFormCpu(6000);
    setFormProjects(150);
    setFormDatasets(1024);
    setFormPractices(50);
    setFormAgents(100);
    setFormTokens(500);
    setFormMenus(["ai", "audit"]);
    setFormDuration("12");
    setShowCreateDrawer(true);
  };

  const handleCreateTenant = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    const newId = `tenant-${Date.now().toString().slice(-4)}`;
    
    // Calculate expiration date
    const today = new Date();
    today.setMonth(today.getMonth() + parseInt(formDuration));
    const expireStr = today.toISOString().split("T")[0];

    const newTenant: Tenant = {
      id: newId,
      name: formName,
      logo: formLogo,
      description: formDesc || `${formName}实训云工作空间。`,
      status: "正常",
      admin: {
        name: formAdminName,
        phone: formAdminPhone,
        email: formAdminEmail
      },
      quotas: {
        students: formStudents,
        studentsUsed: 0,
        teachers: formTeachers,
        teachersUsed: 0,
        gpuHours: formGpu,
        gpuHoursUsed: 0,
        cpuHours: formCpu,
        cpuHoursUsed: 0,
        projectsLimit: formProjects,
        projectsUsed: 0,
        datasetsGb: formDatasets,
        datasetsGbUsed: 0,
        practicesLimit: formPractices,
        practicesUsed: 0,
        agentsLimit: formAgents,
        agentsUsed: 0,
        tokensLimit: formTokens,
        tokensUsed: 0
      },
      menuPermissions: formMenus,
      resourceAuth: {
        isAuthorized: false,
        resourceTypes: []
      },
      createdAt: new Date().toISOString().split("T")[0],
      expireAt: expireStr
    };

    setTenants([newTenant, ...tenants]);
    setShowCreateDrawer(false);

    // Setup visual receipt of login detail emails
    setShowEmailReceipt({
      tenantName: formName,
      adminName: formAdminName,
      adminEmail: formAdminEmail,
      tempPass: `Zhiyun@${Math.floor(Math.random() * 900000 + 100000)}`,
      expireDate: expireStr
    });
    
    triggerToast(`🎉 成功创建配置租户「${formName}」`);
  };

  const handleOpenEditDrawer = (tenant: Tenant) => {
    setSelectedTenant(tenant);
    setFormName(tenant.name);
    setFormLogo(tenant.logo);
    setFormDesc(tenant.description);
    setFormAdminName(tenant.admin.name);
    setFormAdminPhone(tenant.admin.phone);
    setFormAdminEmail(tenant.admin.email);
    setFormStudents(tenant.quotas.students);
    setFormTeachers(tenant.quotas.teachers);
    setFormGpu(tenant.quotas.gpuHours);
    setFormCpu(tenant.quotas.cpuHours);
    setFormProjects(tenant.quotas.projectsLimit);
    setFormDatasets(tenant.quotas.datasetsGb);
    setFormPractices(tenant.quotas.practicesLimit);
    setFormAgents(tenant.quotas.agentsLimit);
    setFormTokens(tenant.quotas.tokensLimit);
    setFormMenus(tenant.menuPermissions);
    setShowEditDrawer(true);
  };

  const handleSaveTenantEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTenant) return;

    setTenants(tenants.map(t => {
      if (t.id === selectedTenant.id) {
        return {
          ...t,
          name: formName,
          logo: formLogo,
          description: formDesc,
          admin: {
            name: formAdminName,
            phone: formAdminPhone,
            email: formAdminEmail
          },
          quotas: {
            ...t.quotas,
            students: formStudents,
            teachers: formTeachers,
            gpuHours: formGpu,
            cpuHours: formCpu,
            projectsLimit: formProjects,
            datasetsGb: formDatasets,
            practicesLimit: formPractices,
            agentsLimit: formAgents,
            tokensLimit: formTokens
          },
          menuPermissions: formMenus
        };
      }
      return t;
    }));
    setShowEditDrawer(false);
    triggerToast(`💾 成功保存租户「${formName}」的参数更新配置`);
  };

  // Toggle Toggle status
  const handleToggleStatus = (tenant: Tenant) => {
    if (tenant.status === "禁用") {
      setTenants(tenants.map(t => 
        t.id === tenant.id ? { ...t, status: "正常", disableReason: undefined, disableUntil: undefined } : t
      ));
      triggerToast(`✅ 租户「${tenant.name}」已重新启用，所有子账号恢复登录`);
    } else {
      setSelectedTenant(tenant);
      setDisableReason("未足额缴费");
      setCustomDisableReason("");
      // default: until 1 month later
      const d = new Date();
      d.setMonth(d.getMonth() + 1);
      setDisableUntil(d.toISOString().split("T")[0]);
      setShowDisableModal(true);
    }
  };

  const handleConfirmDisable = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTenant) return;

    const finalReason = disableReason === "其他原因" ? customDisableReason : disableReason;

    setTenants(tenants.map(t => {
      if (t.id === selectedTenant.id) {
        return {
          ...t,
          status: "禁用",
          disableReason: finalReason || "运营维护暂停服务",
          disableUntil: disableUntil
        };
      }
      return t;
    }));
    setShowDisableModal(false);
    triggerToast(`🔒 已封禁暂停租户「${selectedTenant.name}」的系统服务访问权限`);
  };

  // Renew lease
  const handleOpenRenewModal = (tenant: Tenant) => {
    setSelectedTenant(tenant);
    setRenewMonths("6");
    setCustomRenewDate("");
    setShowRenewModal(true);
  };

  const handleConfirmRenew = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTenant) return;

    setTenants(tenants.map(t => {
      if (t.id === selectedTenant.id) {
        const currentExp = new Date(t.status === "到期" ? new Date() : new Date(t.expireAt));
        if (customRenewDate) {
          return {
            ...t,
            status: "正常",
            expireAt: customRenewDate
          };
        } else {
          currentExp.setMonth(currentExp.getMonth() + parseInt(renewMonths));
          return {
            ...t,
            status: "正常",
            expireAt: currentExp.toISOString().split("T")[0]
          };
        }
      }
      return t;
    }));
    setShowRenewModal(false);
    triggerToast(`⏳ 租户「${selectedTenant.name}」成功续期，到期日已延展`);
  };

  // Resource creation authority configuration
  const handleOpenAuthModal = (tenant: Tenant) => {
    setSelectedTenant(tenant);
    setSelectedAuthTypes(tenant.resourceAuth.isAuthorized ? [...tenant.resourceAuth.resourceTypes] : ["课程"]);
    setAuthDurationMonths("6");
    setAuthCreditChecked(true);
    setAuthQualityChecked(true);
    setAuthNoViolationChecked(true);
    setShowAuthModal(true);
  };

  const handleConfirmAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTenant) return;

    if (!authCreditChecked || !authQualityChecked || !authNoViolationChecked) {
      alert("⚠️ 被授权租户必须同时满足：信誉度良好、无违规行为及质量达标要求。");
      return;
    }

    const today = new Date();
    const expire = new Date();
    expire.setMonth(expire.getMonth() + parseInt(authDurationMonths));

    setTenants(tenants.map(t => {
      if (t.id === selectedTenant.id) {
        return {
          ...t,
          resourceAuth: {
            isAuthorized: true,
            resourceTypes: selectedAuthTypes,
            authDate: today.toISOString().split("T")[0],
            expireDate: expire.toISOString().split("T")[0]
          }
        };
      }
      return t;
    }));
    setShowAuthModal(false);
    triggerToast(`🛡️ 成功授权「${selectedTenant.name}」创建平台全局免审共享资源`);
  };

  const handleRevokeAuth = (tenant: Tenant) => {
    if (confirm(`⚠️ 确定要取消租户「${tenant.name}」的公共共享资源自主免审创建授权吗？`)) {
      setTenants(tenants.map(t => {
        if (t.id === tenant.id) {
          return {
            ...t,
            resourceAuth: {
              isAuthorized: false,
              resourceTypes: []
            }
          };
        }
        return t;
      }));
      triggerToast(`↩️ 已取消对「${tenant.name}」的公共资源创建免审授权`);
    }
  };

  // Data Export Mock
  const handleExportData = (type: "excel" | "json") => {
    triggerToast(`⏳ 正在对平台多租户资产配置进行归档打包...`);
    setTimeout(() => {
      const dataStr = JSON.stringify(tenants, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      
      const exportFileDefaultName = `zhiyun_tenants_registry_${new Date().toISOString().split("T")[0]}.${type === 'excel' ? 'xlsx' : 'json'}`;
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
      triggerToast(`📥 导出成功！平台租户名录表已成功下载。`);
    }, 1500);
  };

  // Check quota metrics of each tenant
  const getQuotaAverageRate = (quotas: TenantQuotas) => {
    const tokenRate = quotas.tokensLimit > 0 ? (quotas.tokensUsed / quotas.tokensLimit) * 100 : 0;
    const gpuRate = quotas.gpuHours > 0 ? (quotas.gpuHoursUsed / quotas.gpuHours) * 100 : 0;
    return (tokenRate + gpuRate) / 2;
  };

  // Compute active days countdown
  const getDaysCountdown = (dateStr: string) => {
    const diff = new Date(dateStr).getTime() - new Date().getTime();
    return Math.ceil(diff / (1000 * 3600 * 24));
  };

  // --- Real-time queries for render ---
  const filteredTenants = tenants.filter(t => {
    const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          t.admin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          t.id.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === "全部" || t.status === statusFilter;
    
    // Usage rate filter calculation
    const avgUsage = getQuotaAverageRate(t.quotas);
    let matchesUsage = true;
    if (usageFilter === "超额警告") {
      matchesUsage = avgUsage >= 80 && avgUsage < 100;
    } else if (usageFilter === "额度耗尽") {
      matchesUsage = avgUsage >= 100;
    } else if (usageFilter === "正常使用") {
      matchesUsage = avgUsage < 80;
    }

    return matchesSearch && matchesStatus && matchesUsage;
  }).sort((a, b) => {
    if (sortBy === "name") return a.name.localeCompare(b.name);
    if (sortBy === "users") return (b.quotas.students + b.quotas.teachers) - (a.quotas.students + a.quotas.teachers);
    if (sortBy === "tokenUsage") return (b.quotas.tokensUsed / b.quotas.tokensLimit) - (a.quotas.tokensUsed / a.quotas.tokensLimit);
    if (sortBy === "expireDate") return new Date(a.expireAt).getTime() - new Date(b.expireAt).getTime();
    return 0;
  });

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
            <Users className="w-6 h-6 text-[#fa541c]" />
            <span>智云实训运营端 - 租户管控工作中心</span>
          </h1>
          <p className="text-xs text-neutral-caption mt-1">
            统一监控高校实训算力配额，开通及管理高校、企业云空间，配置平台特权自主免审资源授权与封禁到期流转。
          </p>
        </div>

        {/* Global Toolbar */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => handleExportData("excel")}
            className="px-3.5 py-2 text-xs font-bold border border-neutral-200 bg-white hover:bg-neutral-50 rounded-lg shadow-3xs flex items-center gap-1.5 transition-colors cursor-pointer text-neutral-body"
          >
            <Download className="w-4 h-4" />
            <span>导出报表</span>
          </button>
          
          <button
            onClick={handleOpenCreateDrawer}
            className="bg-[#fa541c] hover:bg-[#e84a15] text-white text-xs font-black px-4 py-2.5 rounded-lg flex items-center gap-1.5 shadow-sm transition-all duration-150 cursor-pointer"
          >
            <Plus className="w-4 h-4 font-black" />
            <span>开通新实训租户</span>
          </button>
        </div>
      </div>

      {/* Dynamic Counter Panels */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 shrink-0">
        {[
          { title: "注册租户总数", val: tenants.length, desc: "全平台注册单位", icon: Users, color: "text-[#fa541c] bg-[#fff2e8]/45 border-[#ffbb96]/45" },
          { title: "正常服务中", val: tenants.filter(t => t.status === "正常").length, desc: "算力网关开启中", icon: CheckCircle, color: "text-emerald-600 bg-emerald-50/40 border-emerald-200/50" },
          { title: "已被封禁禁用", val: tenants.filter(t => t.status === "禁用").length, desc: "账号限制登录", icon: Lock, color: "text-amber-600 bg-amber-50/40 border-amber-200/50" },
          { title: "超期停用租户", val: tenants.filter(t => t.status === "到期").length, desc: "已过期需续费", icon: Clock, color: "text-rose-600 bg-rose-50/40 border-rose-200/50" },
          { title: "算力预警 (使用率 >80%)", val: tenants.filter(t => getQuotaAverageRate(t.quotas) >= 80 && t.status === "正常").length, desc: "资源告警触发", icon: AlertTriangle, color: "text-yellow-600 bg-yellow-50/40 border-yellow-200/50" }
        ].map((card, idx) => (
          <div key={idx} className={cn("p-4 rounded-xl border bg-white shadow-3xs flex flex-col justify-between transition-transform duration-200 hover:-translate-y-0.5", card.color)}>
            <div className="flex justify-between items-center select-none">
              <span className="text-[11px] font-black uppercase tracking-wider opacity-80">{card.title}</span>
              <card.icon className="w-4.5 h-4.5 opacity-70" />
            </div>
            <div className="my-2.5">
              <span className="text-2.5xl font-black font-mono leading-none">{card.val}</span>
            </div>
            <span className="text-[10px] opacity-75 font-semibold">{card.desc}</span>
          </div>
        ))}
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="bg-white rounded-xl border border-neutral-border shadow-3xs p-1 select-none shrink-0 flex items-center justify-between">
        <div className="flex items-center gap-1">
          {[
            { id: "list", title: "租户名录与配置空间", icon: FileText },
            { id: "auth", title: "公共实训资源免审授权", icon: ShieldCheck, badge: tenants.filter(t => t.resourceAuth.isAuthorized).length },
            { id: "monitor", title: "租户运行状况与负荷监控", icon: Activity, badge: tenants.filter(t => getQuotaAverageRate(t.quotas) >= 80).length }
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
                <span className={cn(
                  "text-[9px] font-mono font-black px-1.5 py-0.5 rounded-full scale-90",
                  tab.id === "monitor" ? "bg-amber-500 text-white animate-pulse" : "bg-[#fa541c] text-white"
                )}>
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </div>
        
        <span className="text-[10px] text-neutral-caption font-semibold pr-3 hidden sm:inline">
          实训主控核心数据同步：刚刚 (自动定时刷新)
        </span>
      </div>

      {/* ==================== TAB 1. 租户名录与配置空间 ==================== */}
      {activeTab === "list" && (
        <div className="flex flex-col flex-1 min-h-0 space-y-4 animate-slide-up">
          
          {/* Controls Filters Toolbar */}
          <div className="bg-white p-4 rounded-xl border border-neutral-border shadow-3xs flex flex-col md:flex-row gap-4 items-center justify-between select-none shrink-0">
            
            {/* Search Input */}
            <div className="relative w-full md:w-[280px]">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-neutral-400" />
              <input
                type="text"
                placeholder="检索租户名、管理员、ID编号..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full border border-neutral-200 rounded-lg pl-9 pr-4 py-1.5 text-xs focus:outline-none focus:border-[#fa541c] bg-white text-neutral-800 font-medium placeholder-neutral-400"
              />
            </div>

            {/* Filter Group selectors */}
            <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-neutral-body w-full md:w-auto md:justify-end">
              
              {/* Status */}
              <div className="flex items-center gap-2">
                <span>运行状态:</span>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  className="border border-neutral-200 rounded-lg px-2 py-1 bg-white focus:outline-none focus:border-[#fa541c] font-semibold text-neutral-title"
                >
                  <option value="全部">全部状态</option>
                  <option value="正常">正常使用</option>
                  <option value="禁用">已被禁用</option>
                  <option value="到期">超期停用</option>
                </select>
              </div>

              {/* Usage Rate */}
              <div className="flex items-center gap-2">
                <span>算力使用率:</span>
                <select
                  value={usageFilter}
                  onChange={(e) => setUsageFilter(e.target.value as any)}
                  className="border border-neutral-200 rounded-lg px-2 py-1 bg-white focus:outline-none focus:border-[#fa541c] font-semibold text-neutral-title"
                >
                  <option value="全部">全部范围</option>
                  <option value="正常使用">正常区间 (&lt;80%)</option>
                  <option value="超额警告">超额预警 (≥80%)</option>
                  <option value="额度耗尽">已过载耗尽 (≥100%)</option>
                </select>
              </div>

              {/* Sort By */}
              <div className="flex items-center gap-2">
                <span>排序依据:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="border border-neutral-200 rounded-lg px-2 py-1 bg-white focus:outline-none focus:border-[#fa541c] font-semibold text-neutral-title"
                >
                  <option value="name">租户拼音首字母</option>
                  <option value="users">子账号学生总人数</option>
                  <option value="tokenUsage">大模型Token消耗率</option>
                  <option value="expireDate">服务合约到期时间</option>
                </select>
              </div>

              {/* Clear filters CTA */}
              {(searchQuery || statusFilter !== "全部" || usageFilter !== "全部") && (
                <button
                  onClick={() => { setSearchQuery(""); setStatusFilter("全部"); setUsageFilter("全部"); }}
                  className="text-[#fa541c] hover:underline cursor-pointer font-bold"
                >
                  清除筛选
                </button>
              )}
            </div>

          </div>

          {/* Master Grid / Table */}
          <div className="bg-white rounded-xl border border-neutral-border shadow-3xs overflow-hidden flex-1 flex flex-col min-h-[300px]">
            <div className="overflow-x-auto flex-1 custom-scrollbar">
              <table className="w-full text-left border-collapse min-w-[1100px]">
                <thead>
                  <tr className="bg-neutral-50/50 border-b border-neutral-100 text-[11.5px] text-neutral-600 font-black uppercase tracking-wider select-none">
                    <th className="px-6 py-4">租户单位信息</th>
                    <th className="px-6 py-4">系统主管理员</th>
                    <th className="px-6 py-4">席位容量(学生/教师)</th>
                    <th className="px-6 py-4">算力使用率负载率</th>
                    <th className="px-6 py-4">大模型 API Token (使用 / 配额)</th>
                    <th className="px-6 py-4 text-center">状态级别</th>
                    <th className="px-6 py-4">合约有效周期</th>
                    <th className="px-6 py-4 text-center">快捷管控指令</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 text-xs font-sans">
                  {filteredTenants.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="px-6 py-16 text-center text-neutral-400 font-semibold select-none">
                        <AlertCircle className="w-9 h-9 text-neutral-300 mx-auto mb-2" />
                        <span>未检索到匹配当前筛选规则下的实训租户单位数据。</span>
                      </td>
                    </tr>
                  ) : (
                    filteredTenants.map((t) => {
                      const avgUsage = getQuotaAverageRate(t.quotas);
                      const countdownDays = getDaysCountdown(t.expireAt);
                      const tokenPct = t.quotas.tokensLimit > 0 ? (t.quotas.tokensUsed / t.quotas.tokensLimit) * 100 : 0;
                      const gpuPct = t.quotas.gpuHours > 0 ? (t.quotas.gpuHoursUsed / t.quotas.gpuHours) * 100 : 0;
                      
                      return (
                        <tr key={t.id} className="hover:bg-neutral-50/20 transition-colors">
                          
                          {/* Unit info name with emoji logo */}
                          <td className="px-6 py-4 max-w-[240px]">
                            <div className="flex gap-3 items-center">
                              <span className="w-9 h-9 rounded-xl bg-neutral-100/80 border border-neutral-200/50 flex items-center justify-center text-lg select-none">
                                {t.logo}
                              </span>
                              <div className="space-y-1.5 min-w-0">
                                <span 
                                  onClick={() => { setSelectedTenant(t); setShowDetailDrawer(true); }}
                                  className="font-black text-neutral-title hover:text-[#fa541c] hover:underline cursor-pointer block truncate"
                                  title="点击查看租户全景画像"
                                >
                                  {t.name}
                                </span>
                                <span className="text-[10px] font-mono text-neutral-caption font-bold block">
                                  ID: {t.id}
                                </span>
                              </div>
                            </div>
                          </td>

                          {/* Admin Details */}
                          <td className="px-6 py-4 font-semibold text-neutral-body">
                            <div className="space-y-1">
                              <span className="text-neutral-title block font-bold">{t.admin.name}</span>
                              <span className="text-[10.5px] text-neutral-caption font-semibold font-mono block">{t.admin.phone}</span>
                            </div>
                          </td>

                          {/* Users limits */}
                          <td className="px-6 py-4">
                            <div className="space-y-1">
                              <span className="font-mono text-neutral-title block font-bold">
                                {t.quotas.studentsUsed} / {t.quotas.students} 名学生
                              </span>
                              <span className="text-[10.5px] font-mono text-neutral-caption block">
                                {t.quotas.teachersUsed} / {t.quotas.teachers} 教师
                              </span>
                            </div>
                          </td>

                          {/* Quotas average */}
                          <td className="px-6 py-4">
                            <div className="space-y-1.5 max-w-[140px]">
                              <div className="flex justify-between items-center text-[10.5px] font-bold">
                                <span className="text-neutral-caption">平均负载:</span>
                                <span className={cn(
                                  "font-mono",
                                  t.status === "禁用" ? "text-neutral-400" :
                                  avgUsage >= 100 ? "text-red-600 font-black animate-pulse" :
                                  avgUsage >= 80 ? "text-[#fa541c] font-black" : "text-emerald-600"
                                )}>
                                  {avgUsage.toFixed(1)}%
                                </span>
                              </div>
                              <div className="w-full bg-neutral-100 h-1.5 rounded-full overflow-hidden">
                                <div 
                                  className={cn(
                                    "h-full rounded-full transition-all duration-300",
                                    t.status === "禁用" ? "bg-neutral-300" :
                                    avgUsage >= 100 ? "bg-red-500" :
                                    avgUsage >= 80 ? "bg-[#fa541c]" : "bg-emerald-500"
                                  )} 
                                  style={{ width: `${Math.min(avgUsage, 100)}%` }}
                                />
                              </div>
                            </div>
                          </td>

                          {/* GPU & Token usage specifically */}
                          <td className="px-6 py-4">
                            <div className="space-y-1">
                              <div className="flex items-center gap-1.5">
                                <span className="text-[10px] font-black font-mono text-[#fa541c] bg-[#fff2e8] border border-[#ffbb96]/45 px-1 py-0.2 rounded scale-90">Tokens</span>
                                <span className="font-mono text-neutral-body font-semibold">
                                  {t.quotas.tokensUsed.toFixed(1)}M / {t.quotas.tokensLimit}M ({tokenPct.toFixed(0)}%)
                                </span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <span className="text-[10px] font-black font-mono text-blue-600 bg-blue-50 border border-blue-200/50 px-1 py-0.2 rounded scale-90">GPU卡时</span>
                                <span className="font-mono text-neutral-caption font-semibold">
                                  {t.quotas.gpuHoursUsed} / {t.quotas.gpuHours}h ({gpuPct.toFixed(0)}%)
                                </span>
                              </div>
                            </div>
                          </td>

                          {/* Status Badge */}
                          <td className="px-6 py-4 text-center">
                            <span className={cn(
                              "px-2.5 py-1 rounded-full text-[10.5px] font-black border uppercase tracking-wider font-sans select-none",
                              t.status === "正常" ? "bg-emerald-50 border-emerald-200 text-emerald-600" :
                              t.status === "禁用" ? "bg-amber-50 border-amber-200 text-amber-600" : "bg-rose-50 border-rose-200 text-rose-600"
                            )}>
                              {t.status}
                            </span>
                          </td>

                          {/* Expiration date countdown */}
                          <td className="px-6 py-4">
                            <div className="space-y-1">
                              <span className="font-mono text-neutral-body font-bold block">{t.expireAt}</span>
                              {t.status === "正常" && countdownDays <= 30 && countdownDays > 0 ? (
                                <span className="text-[10px] font-bold text-amber-500 bg-amber-50 border border-amber-200/50 px-1.5 py-0.5 rounded block shrink-0 w-fit">
                                  临期 {countdownDays} 天预警
                                </span>
                              ) : t.status === "正常" && countdownDays <= 0 ? (
                                <span className="text-[10px] font-bold text-rose-500 bg-rose-50 border border-rose-200/50 px-1.5 py-0.5 rounded block shrink-0 w-fit animate-pulse">
                                  合约已过期
                                </span>
                              ) : t.status === "禁用" ? (
                                <span className="text-[10px] font-bold text-neutral-400 block" title={t.disableReason}>
                                  冻结中: {t.disableReason}
                                </span>
                              ) : (
                                <span className="text-[10px] text-neutral-caption block">合约稳定正常</span>
                              )}
                            </div>
                          </td>

                          {/* Action controls */}
                          <td className="px-6 py-4 text-center">
                            <div className="flex items-center justify-center gap-3">
                              <button
                                onClick={() => handleOpenEditDrawer(t)}
                                className="text-neutral-500 hover:text-neutral-900 font-bold flex items-center gap-0.5 cursor-pointer"
                                title="编辑租户信息与算力分配"
                              >
                                <Edit className="w-3.5 h-3.5" />
                                <span>编辑</span>
                              </button>

                              <button
                                onClick={() => handleToggleStatus(t)}
                                className={cn(
                                  "font-bold flex items-center gap-0.5 cursor-pointer",
                                  t.status === "禁用" ? "text-emerald-600 hover:text-emerald-800" : "text-amber-600 hover:text-amber-800"
                                )}
                                title={t.status === "禁用" ? "启用解封" : "禁用停服"}
                              >
                                {t.status === "禁用" ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                                <span>{t.status === "禁用" ? "启用" : "禁用"}</span>
                              </button>

                              <button
                                onClick={() => handleOpenRenewModal(t)}
                                className="text-[#fa541c] hover:text-[#e84a15] font-bold flex items-center gap-0.5 cursor-pointer"
                                title="续费/合约期限延展"
                              >
                                <Clock className="w-3.5 h-3.5" />
                                <span>续期</span>
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

            {/* Total count statistics footer */}
            <div className="bg-neutral-50 px-6 py-3.5 border-t border-neutral-100 flex justify-between items-center text-xs font-semibold text-neutral-body shrink-0 select-none">
              <span>当前显示: {filteredTenants.length} 家实训机构 / 共 {tenants.length} 家注册租户</span>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-neutral-caption font-medium pr-2">系统到期或禁用均拦截所属子用户登录</span>
                <button
                  onClick={() => handleExportData("json")}
                  className="bg-white hover:bg-neutral-100 text-neutral-body font-bold border border-neutral-200 px-3 py-1 rounded-lg cursor-pointer transition-colors shadow-3xs flex items-center gap-1"
                >
                  <Download className="w-3.5 h-3.5 text-neutral-400" />
                  <span>导出 JSON 配置表</span>
                </button>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* ==================== TAB 2. 公共实训资源免审授权 ==================== */}
      {activeTab === "auth" && (
        <div className="flex flex-col flex-1 min-h-0 space-y-6 animate-slide-up">
          
          <div className="bg-white p-5 rounded-xl border border-[#ffbb96]/45 bg-gradient-to-r from-white to-[#fff2e8]/20 shadow-3xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 select-none shrink-0">
            <div className="space-y-1">
              <span className="text-xs font-black text-[#fa541c] uppercase tracking-wider block">超级管理员公共免审资源特权中心</span>
              <h2 className="text-sm font-black text-neutral-title leading-tight">
                授权可信赖租户直接提交公开资源（课程/项目/试题）免除平台审核流
              </h2>
              <p className="text-[11px] text-neutral-caption">
                只有在平台信誉评级优秀、教学质量过硬、无任何数据泄露与违规记录的合作租户才应获得此特权，支持定时自动过期回收。
              </p>
            </div>
            
            <button
              onClick={() => {
                const untargeted = tenants.find(t => !t.resourceAuth.isAuthorized);
                if (untargeted) {
                  setSelectedTenant(untargeted);
                  setSelectedAuthTypes(["课程"]);
                  setAuthDurationMonths("6");
                  setAuthCreditChecked(true);
                  setAuthQualityChecked(true);
                  setAuthNoViolationChecked(true);
                  setShowAuthModal(true);
                } else {
                  triggerToast("所有租户都已被授权！");
                }
              }}
              className="bg-[#fa541c] hover:bg-[#e84a15] text-white text-xs font-black px-4.5 py-2.5 rounded-lg flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
            >
              <Shield className="w-4 h-4" />
              <span>授予新租户共享权</span>
            </button>
          </div>

          {/* Authorization名录表 */}
          <div className="bg-white rounded-xl border border-neutral-border shadow-3xs overflow-hidden flex-1 flex flex-col min-h-[300px]">
            <div className="overflow-x-auto flex-1 custom-scrollbar">
              <table className="w-full text-left border-collapse min-w-[900px]">
                <thead>
                  <tr className="bg-neutral-50/50 border-b border-neutral-100 text-[11.5px] text-neutral-600 font-black uppercase select-none">
                    <th className="px-6 py-4">被授权机构名称</th>
                    <th className="px-6 py-4">特权授权创建的资源品类</th>
                    <th className="px-6 py-4">首次授信启用日期</th>
                    <th className="px-6 py-4">授权终止有效日期</th>
                    <th className="px-6 py-4">到期倒计时提醒</th>
                    <th className="px-6 py-4 text-center">当前授信状态</th>
                    <th className="px-6 py-4 text-center">授权管理操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 text-xs font-sans">
                  {tenants.filter(t => t.resourceAuth.isAuthorized).length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-16 text-center text-neutral-400 font-semibold select-none">
                        <Shield className="w-9 h-9 text-neutral-300 mx-auto mb-2" />
                        <span>暂无高校或合作租户获得免审共享资源特权授权。</span>
                      </td>
                    </tr>
                  ) : (
                    tenants.filter(t => t.resourceAuth.isAuthorized).map(t => {
                      const auth = t.resourceAuth;
                      const authCountdown = getDaysCountdown(auth.expireDate || "");
                      
                      return (
                        <tr key={t.id} className="hover:bg-neutral-50/15 transition-colors">
                          <td className="px-6 py-4 max-w-[220px]">
                            <div className="flex gap-2.5 items-center">
                              <span className="text-base select-none">{t.logo}</span>
                              <span className="font-black text-neutral-title truncate block">{t.name}</span>
                            </div>
                          </td>
                          
                          {/* Types badges */}
                          <td className="px-6 py-4">
                            <div className="flex flex-wrap gap-1.5">
                              {auth.resourceTypes.map((type, idx) => (
                                <span key={idx} className="bg-[#fff2e8] text-[#fa541c] border border-[#ffbb96]/45 px-2 py-0.5 rounded text-[10px] font-black">
                                  {type}
                                </span>
                              ))}
                            </div>
                          </td>

                          {/* Auth date */}
                          <td className="px-6 py-4 font-mono font-bold text-neutral-body">
                            {auth.authDate}
                          </td>

                          {/* Expire date */}
                          <td className="px-6 py-4 font-mono font-bold text-neutral-body">
                            {auth.expireDate}
                          </td>

                          {/* Alert Countdown */}
                          <td className="px-6 py-4">
                            {authCountdown > 0 ? (
                              <div className="flex items-center gap-1.5 font-bold text-neutral-title">
                                <Clock className="w-3.5 h-3.5 text-neutral-caption shrink-0" />
                                <span>剩余 {authCountdown} 天过期</span>
                                {authCountdown <= 30 && (
                                  <span className="bg-amber-100 text-amber-600 text-[9px] font-black px-1.5 py-0.2 rounded uppercase shrink-0 scale-90">临期预警</span>
                                )}
                              </div>
                            ) : (
                              <div className="flex items-center gap-1.5 font-bold text-rose-500 animate-pulse">
                                <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                                <span>已自动失效过期</span>
                              </div>
                            )}
                          </td>

                          {/* Super Admin status verify */}
                          <td className="px-6 py-4 text-center">
                            <div className="flex items-center justify-center gap-1 text-emerald-600 font-black">
                              <ShieldCheck className="w-4 h-4" />
                              <span>免审核开通中</span>
                            </div>
                          </td>

                          {/* Actions */}
                          <td className="px-6 py-4 text-center">
                            <div className="flex items-center justify-center gap-4">
                              <button
                                onClick={() => handleOpenAuthModal(t)}
                                className="text-neutral-600 hover:text-neutral-900 font-bold flex items-center gap-0.5 cursor-pointer"
                                title="修改免审资源种类或合约延期"
                              >
                                <Edit className="w-3.5 h-3.5" />
                                <span>变更授权</span>
                              </button>

                              <button
                                onClick={() => handleRevokeAuth(t)}
                                className="text-red-500 hover:text-red-700 font-bold flex items-center gap-0.5 cursor-pointer"
                                title="物理收回免审共享资源特权"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>取消收回</span>
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

            {/* Bottom info */}
            <div className="bg-neutral-50 px-6 py-3 border-t border-neutral-100 text-[11px] text-neutral-caption font-semibold select-none text-center">
              💡 系统会每24小时自动对被授权租户的信誉度评分指标进行校对，信誉度低于80分将自动报警或暂停免审特权。
            </div>

          </div>

        </div>
      )}

      {/* ==================== TAB 3. 租户运行状况与负荷监控 ==================== */}
      {activeTab === "monitor" && (
        <div className="flex flex-col flex-1 min-h-0 space-y-6 animate-slide-up">
          
          {/* Main Grid structure for monitoring */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 shrink-0">
            
            {/* Live Chart: Online Users (Col span 2) */}
            <div className="lg:col-span-2 bg-white p-5 rounded-xl border border-neutral-border shadow-3xs flex flex-col justify-between h-[360px]">
              <div className="flex justify-between items-center border-b border-neutral-100 pb-3 shrink-0 select-none">
                <span className="text-xs font-black text-neutral-title flex items-center gap-2">
                  <Activity className="w-4 h-4 text-[#fa541c] animate-pulse" />
                  <span>智云实训平台租户在线并发活跃人数（实时更新中）</span>
                </span>
                
                <span className="text-[10px] text-neutral-caption font-mono font-bold bg-neutral-100 px-2 py-0.5 rounded flex items-center gap-1">
                  <RefreshCw className="w-3 h-3 animate-spin text-[#fa541c]" />
                  <span>每4秒动态同步大区并发</span>
                </span>
              </div>

              {/* Dynamic SVG Sparkline Graph */}
              <div className="flex-1 flex flex-col justify-between py-6 min-h-0 select-none relative">
                
                {/* SVG Area Sparkline */}
                <div className="w-full h-40 bg-neutral-50/50 rounded-xl border border-neutral-100 relative p-1.5 overflow-hidden">
                  <svg className="w-full h-full" viewBox="0 0 500 120" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="liveAreaGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#fa541c" stopOpacity="0.22" />
                        <stop offset="100%" stopColor="#fa541c" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>

                    {/* Y guidelines */}
                    <line x1="0" y1="24" x2="500" y2="24" stroke="#f1f5f9" strokeWidth="0.8" />
                    <line x1="0" y1="60" x2="500" y2="60" stroke="#f1f5f9" strokeWidth="0.8" />
                    <line x1="0" y1="96" x2="500" y2="96" stroke="#f1f5f9" strokeWidth="0.8" />

                    {/* Polyfill area */}
                    <polygon
                      points={`
                        0,120 
                        0,${120 - (mockLiveUsers[0] / 400) * 90} 
                        62.5,${120 - (mockLiveUsers[1] / 400) * 90} 
                        125,${120 - (mockLiveUsers[2] / 400) * 90} 
                        187.5,${120 - (mockLiveUsers[3] / 400) * 90} 
                        250,${120 - (mockLiveUsers[4] / 400) * 90} 
                        312.5,${120 - (mockLiveUsers[5] / 400) * 90} 
                        375,${120 - (mockLiveUsers[6] / 400) * 90} 
                        437.5,${120 - (mockLiveUsers[7] / 400) * 90} 
                        500,${120 - (mockLiveUsers[8] / 400) * 90} 
                        500,120
                      `}
                      fill="url(#liveAreaGrad)"
                    />

                    {/* Smooth line */}
                    <polyline
                      fill="none"
                      stroke="#fa541c"
                      strokeWidth="2.5"
                      points={`
                        0,${120 - (mockLiveUsers[0] / 400) * 90} 
                        62.5,${120 - (mockLiveUsers[1] / 400) * 90} 
                        125,${120 - (mockLiveUsers[2] / 400) * 90} 
                        187.5,${120 - (mockLiveUsers[3] / 400) * 90} 
                        250,${120 - (mockLiveUsers[4] / 400) * 90} 
                        312.5,${120 - (mockLiveUsers[5] / 400) * 90} 
                        375,${120 - (mockLiveUsers[6] / 400) * 90} 
                        437.5,${120 - (mockLiveUsers[7] / 400) * 90} 
                        500,${120 - (mockLiveUsers[8] / 400) * 90}
                      `}
                    />

                    {/* Active nodes */}
                    {mockLiveUsers.map((users, idx) => (
                      <circle
                        key={idx}
                        cx={idx * 62.5}
                        cy={120 - (users / 400) * 90}
                        r="3.5"
                        fill="white"
                        stroke="#fa541c"
                        strokeWidth="2"
                      />
                    ))}
                  </svg>

                  {/* Dynamic hovering float numerical counts */}
                  {mockLiveUsers.map((users, idx) => (
                    <span
                      key={idx}
                      className="absolute text-[8.5px] font-black font-mono text-[#fa541c] bg-white border border-[#ffbb96]/45 px-1 py-0.2 rounded shadow-3xs"
                      style={{
                        left: `${idx * 12.5}%`,
                        bottom: `${(users / 400) * 60 + 6}%`,
                        transform: "translateX(-50%)"
                      }}
                    >
                      {users}人
                    </span>
                  ))}
                </div>

                <div className="flex justify-between px-3 text-[10px] text-neutral-caption font-bold">
                  <span>实时秒表 T-36s</span>
                  <span>T-24s</span>
                  <span>T-12s</span>
                  <span className="text-[#fa541c] font-black animate-pulse">实时 T-0s (在线活跃: {mockLiveUsers[mockLiveUsers.length - 1]}人)</span>
                </div>
              </div>

            </div>

            {/* DAU/WAU/MAU and warnings notifications logs (Col 1) */}
            <div className="bg-white p-5 rounded-xl border border-neutral-border shadow-3xs flex flex-col justify-between h-[360px]">
              
              <div className="space-y-4 flex-1 overflow-y-auto custom-scrollbar select-none">
                <div className="flex justify-between items-center border-b border-neutral-100 pb-2 mb-3">
                  <span className="text-xs font-black text-neutral-title flex items-center gap-1.5">
                    <BellRing className="w-4 h-4 text-rose-500 animate-swing" />
                    <span>智云配额过载 & 临期预警台</span>
                  </span>
                  <span className="text-[10px] text-neutral-caption font-bold">阈值 &gt;80%</span>
                </div>

                {/* Over usage list */}
                <div className="space-y-3">
                  {tenants.map(t => {
                    const rate = getQuotaAverageRate(t.quotas);
                    const countdown = getDaysCountdown(t.expireAt);
                    
                    if (t.status === "正常" && rate >= 80) {
                      return (
                        <div key={t.id} className="p-3 rounded-lg border border-yellow-200 bg-yellow-50/40 space-y-1.5">
                          <div className="flex justify-between items-center font-bold text-neutral-title text-xs">
                            <span className="truncate max-w-[150px]">{t.name}</span>
                            <span className="text-yellow-600 font-mono font-black">{rate.toFixed(1)}%</span>
                          </div>
                          <p className="text-[10px] text-neutral-body leading-normal">
                            🚨 租户大模型 Token 配额已耗费 <span className="font-mono font-bold">{t.quotas.tokensUsed.toFixed(1)}M</span> (总上限 {t.quotas.tokensLimit}M)，达到临界安全红线！
                          </p>
                        </div>
                      );
                    }
                    
                    if (t.status === "正常" && countdown <= 30 && countdown > 0) {
                      return (
                        <div key={t.id} className="p-3 rounded-lg border border-rose-200 bg-rose-50/40 space-y-1.5">
                          <div className="flex justify-between items-center font-bold text-neutral-title text-xs">
                            <span className="truncate max-w-[150px]">{t.name}</span>
                            <span className="text-rose-600 text-[10px] font-black">临期 {countdown} 天</span>
                          </div>
                          <p className="text-[10px] text-neutral-body leading-normal">
                            ⏳ 该租户的实训服务期合约即将于 <span className="font-mono font-bold">{t.expireAt}</span> 到期。过期后系统将自动下发禁用冻结，请知悉！
                          </p>
                        </div>
                      );
                    }
                    
                    return null;
                  })}
                </div>
              </div>

              <div className="pt-3.5 border-t border-neutral-100 flex items-center justify-between select-none shrink-0">
                <span className="text-[9.5px] text-neutral-caption font-semibold">预警发生时会自动下发短信与提醒邮件。</span>
                <button
                  onClick={() => triggerToast("📢 已经向所有预警机构的系统管理员派发催缴及额度提醒邮件")}
                  className="bg-[#fa541c]/10 hover:bg-[#fa541c]/20 text-[#fa541c] border border-[#ffbb96]/45 text-[10px] font-bold px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                >
                  一键重新唤醒告警
                </button>
              </div>

            </div>

          </div>

          {/* Large circular visualizer dashboards grids */}
          <div className="bg-white p-5 rounded-xl border border-neutral-border shadow-3xs flex flex-col min-h-[300px]">
            <div className="flex justify-between items-center border-b border-neutral-100 pb-3 mb-6 select-none shrink-0">
              <span className="text-xs font-black text-neutral-title flex items-center gap-1.5">
                <BarChart2 className="w-4 h-4 text-[#fa541c]" />
                <span>实训资源与算力硬件容量池总览</span>
              </span>
              <span className="text-[10px] text-neutral-caption font-bold">全平台统计维度</span>
            </div>

            {/* Circular Gauges for GPU, CPU, etc */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 flex-1 items-center">
              
              {/* GPU Gauge */}
              <div className="flex flex-col items-center gap-3">
                <div className="relative w-28 h-28 flex items-center justify-center">
                  {/* Arc ring using simple SVG */}
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="text-neutral-100"
                      strokeWidth="3"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className="text-[#fa541c]"
                      strokeWidth="3.2"
                      strokeDasharray="83, 100"
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center text-center">
                    <span className="text-lg font-black text-neutral-title font-mono leading-none">83%</span>
                    <span className="text-[9.5px] text-neutral-caption font-bold mt-1">GPU集群利用</span>
                  </div>
                </div>
                <div className="text-center font-bold text-xs select-none">
                  <span className="text-neutral-body block">高性能 V100 GPU 算力池</span>
                  <span className="text-[10px] text-neutral-caption font-semibold mt-0.5 block">当前活跃开卡: 154卡 / 共 185卡</span>
                </div>
              </div>

              {/* CPU Gauge */}
              <div className="flex flex-col items-center gap-3">
                <div className="relative w-28 h-28 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="text-neutral-100"
                      strokeWidth="3"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className="text-blue-500"
                      strokeWidth="3.2"
                      strokeDasharray="64, 100"
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center text-center">
                    <span className="text-lg font-black text-neutral-title font-mono leading-none">64%</span>
                    <span className="text-[9.5px] text-neutral-caption font-bold mt-1">CPU负载利用</span>
                  </div>
                </div>
                <div className="text-center font-bold text-xs select-none">
                  <span className="text-neutral-body block">高密度私有宿主节点主机</span>
                  <span className="text-[10px] text-neutral-caption font-semibold mt-0.5 block">在线物理内核: 512核 / 800核</span>
                </div>
              </div>

              {/* Multi Progress limits details */}
              <div className="md:col-span-2 space-y-4 w-full px-4">
                {[
                  { title: "全系统项目占用率 LIMITS", current: 813, max: 1480, unit: "个项目", color: "bg-amber-500" },
                  { title: "已上传公开与共享数据集容量", current: 9.3, max: 18.0, unit: "TB容量", color: "bg-blue-500" },
                  { title: "最佳实践与免审课件资源额度", current: 202, max: 470, unit: "门课程", color: "bg-emerald-500" },
                  { title: "子账号 AI 助手微调实例数量", current: 412, max: 740, unit: "个容器", color: "bg-purple-500" }
                ].map((bar, idx) => {
                  const rate = (bar.current / bar.max) * 100;
                  return (
                    <div key={idx} className="space-y-1 text-xs">
                      <div className="flex justify-between items-center font-bold text-neutral-body">
                        <span>{bar.title}</span>
                        <span className="font-mono text-neutral-title">{bar.current} / {bar.max} {bar.unit} ({rate.toFixed(0)}%)</span>
                      </div>
                      <div className="w-full bg-neutral-100 h-2 rounded-full overflow-hidden">
                        <div className={cn("h-full rounded-full transition-all duration-300", bar.color)} style={{ width: `${rate}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>
          </div>

        </div>
      )}

      {/* ==================== MODALS, DRAWERS & DIALOGS (ZHIYUN HIGH FIDELITY) ==================== */}
      
      {/* 1. VIEW DETAILED DRAWER (租户全景详情画像抽屉) */}
      {showDetailDrawer && selectedTenant && (
        <div className="fixed inset-0 z-[150] overflow-hidden flex justify-end bg-black/35 backdrop-blur-3xs animate-fade-in select-none">
          <div className="flex-1" onClick={() => setShowDetailDrawer(false)}></div>
          
          <div className="w-full max-w-[600px] bg-white h-full shadow-2xl flex flex-col justify-between animate-slide-left text-xs">
            
            {/* Header */}
            <div className="p-6 border-b border-neutral-border flex items-center justify-between shrink-0 bg-neutral-50/50">
              <div className="flex items-center gap-3">
                <span className="text-2.5xl leading-none">{selectedTenant.logo}</span>
                <div>
                  <h2 className="text-base font-black text-neutral-title leading-tight">{selectedTenant.name}</h2>
                  <span className="text-[10px] text-neutral-caption font-bold block mt-1 uppercase tracking-wider font-mono">
                    Unique Tenant Hash: {selectedTenant.id}
                  </span>
                </div>
              </div>
              
              <button 
                onClick={() => setShowDetailDrawer(false)}
                className="p-1 rounded-full text-neutral-400 hover:bg-neutral-200 hover:text-neutral-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar text-neutral-body">
              
              {/* Desc */}
              <div className="space-y-2">
                <span className="text-[11px] font-black text-[#fa541c] uppercase tracking-wider">租户描述与运营目标</span>
                <p className="p-3 bg-neutral-50 rounded-lg border border-neutral-200/50 leading-relaxed font-semibold text-neutral-title">
                  {selectedTenant.description}
                </p>
              </div>

              {/* Admin profile */}
              <div className="space-y-3">
                <h3 className="font-black text-neutral-title text-sm border-l-3 border-[#fa541c] pl-2 flex items-center gap-1.5">
                  <Users className="w-4.5 h-4.5 text-neutral-caption" />
                  <span>核心系统管理员资料</span>
                </h3>
                
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-3.5 bg-neutral-50/50 rounded-xl border border-neutral-100 space-y-1">
                    <span className="text-[10px] text-neutral-caption font-bold block">姓名/职责</span>
                    <span className="font-black text-neutral-title block">{selectedTenant.admin.name}</span>
                  </div>
                  <div className="p-3.5 bg-neutral-50/50 rounded-xl border border-neutral-100 space-y-1">
                    <span className="text-[10px] text-neutral-caption font-bold block">绑定手机号</span>
                    <span className="font-mono font-bold text-neutral-title block">{selectedTenant.admin.phone}</span>
                  </div>
                  <div className="p-3.5 bg-neutral-50/50 rounded-xl border border-neutral-100 space-y-1">
                    <span className="text-[10px] text-neutral-caption font-bold block">开通工作邮箱</span>
                    <span className="font-mono font-bold text-[#fa541c] block truncate" title={selectedTenant.admin.email}>
                      {selectedTenant.admin.email}
                    </span>
                  </div>
                </div>
              </div>

              {/* Allocated quotas detail bars */}
              <div className="space-y-4">
                <h3 className="font-black text-neutral-title text-sm border-l-3 border-[#fa541c] pl-2 flex items-center gap-1.5">
                  <Cpu className="w-4.5 h-4.5 text-neutral-caption" />
                  <span>算力及平台配置额度消费详情</span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { label: "Token 消耗配额 (大模型API)", used: selectedTenant.quotas.tokensUsed, limit: selectedTenant.quotas.tokensLimit, unit: "M Tokens", color: "bg-[#fa541c]" },
                    { label: "GPU 物理算力池卡时", used: selectedTenant.quotas.gpuHoursUsed, limit: selectedTenant.quotas.gpuHours, unit: "小时", color: "bg-blue-500" },
                    { label: "CPU 时长消耗额度", used: selectedTenant.quotas.cpuHoursUsed, limit: selectedTenant.quotas.cpuHours, unit: "时长", color: "bg-indigo-500" },
                    { label: "共享实训课程模板上限", used: selectedTenant.quotas.projectsUsed, limit: selectedTenant.quotas.projectsLimit, unit: "个项目", color: "bg-amber-500" },
                    { label: "数据集平台配额用量", used: selectedTenant.quotas.datasetsGbUsed, limit: selectedTenant.quotas.datasetsGb, unit: "GB容量", color: "bg-cyan-500" },
                    { label: "实践开发对话上限", used: selectedTenant.quotas.practicesUsed, limit: selectedTenant.quotas.practicesLimit, unit: "个", color: "bg-emerald-500" },
                    { label: "智能算力助手微调并发", used: selectedTenant.quotas.agentsUsed, limit: selectedTenant.quotas.agentsLimit, unit: "个", color: "bg-purple-500" }
                  ].map((q, idx) => {
                    const pct = q.limit > 0 ? (q.used / q.limit) * 100 : 0;
                    return (
                      <div key={idx} className="p-3 bg-neutral-50/50 border border-neutral-100 rounded-xl space-y-2">
                        <div className="flex justify-between items-center font-bold">
                          <span className="text-neutral-title">{q.label}</span>
                          <span className="font-mono text-[10.5px]">{q.used.toFixed(1)} / {q.limit} {q.unit} ({pct.toFixed(0)}%)</span>
                        </div>
                        <div className="w-full bg-neutral-100 h-1.5 rounded-full overflow-hidden">
                          <div className={cn("h-full rounded-full transition-all duration-300", q.color)} style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Menu permissions details */}
              <div className="space-y-3">
                <h3 className="font-black text-neutral-title text-sm border-l-3 border-[#fa541c] pl-2 flex items-center gap-1.5">
                  <Key className="w-4.5 h-4.5 text-neutral-caption" />
                  <span>授权已开通的功能菜单权限模块</span>
                </h3>
                
                <div className="flex flex-wrap gap-2">
                  {selectedTenant.menuPermissions.map((code) => {
                    const label = availableSystemMenus.find(m => m.code === code)?.label || code;
                    return (
                      <span key={code} className="bg-neutral-100 text-neutral-title border border-neutral-200 px-3 py-1 rounded-lg font-bold">
                        ✓ {label}
                      </span>
                    );
                  })}
                </div>
              </div>

              {/* Special resource creation authorization */}
              <div className="space-y-3">
                <h3 className="font-black text-neutral-title text-sm border-l-3 border-[#fa541c] pl-2 flex items-center gap-1.5">
                  <ShieldCheck className="w-4.5 h-4.5 text-neutral-caption" />
                  <span>特权授权创建公共资源状态</span>
                </h3>

                {selectedTenant.resourceAuth.isAuthorized ? (
                  <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-2">
                    <div className="flex items-center gap-2 font-black text-emerald-700 text-xs">
                      <Shield className="w-4 h-4" />
                      <span>开通共享免审核特权功能中</span>
                    </div>
                    <div className="text-[11px] text-emerald-800 leading-normal space-y-1">
                      <p>授信类型包含：{selectedTenant.resourceAuth.resourceTypes.join("、 ")}</p>
                      <p>授权合约终止有效期：{selectedTenant.resourceAuth.expireDate}</p>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 bg-neutral-50 border border-neutral-200 rounded-xl text-neutral-caption font-semibold">
                    🚫 该实训机构尚未获得平台直接创建公开免审资源的公共授权。
                  </div>
                )}
              </div>

            </div>

            {/* Actions */}
            <div className="p-6 bg-neutral-50 border-t border-neutral-border flex gap-3 shrink-0 select-none">
              <button
                onClick={() => { setShowDetailDrawer(false); handleOpenEditDrawer(selectedTenant); }}
                className="bg-[#fa541c] hover:bg-[#e84a15] text-white font-bold px-4 py-2.5 rounded-lg flex-1 cursor-pointer transition-colors shadow-3xs text-center"
              >
                变更配置与算力调配
              </button>
              <button
                onClick={() => setShowDetailDrawer(false)}
                className="bg-white hover:bg-neutral-100 text-neutral-body font-bold border border-neutral-200 px-4 py-2.5 rounded-lg flex-1 cursor-pointer transition-colors text-center shadow-3xs"
              >
                关闭详情
              </button>
            </div>

          </div>
        </div>
      )}

      {/* 2. CREATE NEW TENANT DRAWER (开通新建租户分区表单) */}
      {showCreateDrawer && (
        <div className="fixed inset-0 z-[150] overflow-hidden flex justify-end bg-black/35 backdrop-blur-3xs animate-fade-in select-none">
          <div className="flex-1" onClick={() => setShowCreateDrawer(false)}></div>
          
          <div className="w-full max-w-[650px] bg-white h-full shadow-2xl flex flex-col justify-between animate-slide-left text-xs">
            
            {/* Header */}
            <div className="p-6 border-b border-neutral-border flex items-center justify-between shrink-0 bg-neutral-50/50">
              <div className="flex items-center gap-2">
                <Plus className="w-5.5 h-5.5 text-[#fa541c] font-black" />
                <h2 className="text-base font-black text-neutral-title">开通并配置新加入实训租户</h2>
              </div>
              <button 
                onClick={() => setShowCreateDrawer(false)}
                className="p-1 rounded-full text-neutral-400 hover:bg-neutral-200 hover:text-neutral-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body Form */}
            <form onSubmit={handleCreateTenant} className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar text-neutral-body">
              
              {/* Section 1: Basic Info */}
              <div className="space-y-4">
                <h3 className="font-black text-neutral-title text-sm border-l-3 border-[#fa541c] pl-2">
                  1. 实训机构单位基础信息
                </h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5 col-span-2">
                    <label className="font-bold text-neutral-700 block">
                      <span className="text-red-500 font-bold mr-0.5">*</span> 实训机构名称/高校专业：
                    </label>
                    <input
                      type="text"
                      required
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      placeholder="例如: 浙江大学软件学院"
                      className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#fa541c] bg-white text-neutral-800 font-medium placeholder-neutral-400"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-neutral-700 block">
                      机构标志/Logo 风格预设：
                    </label>
                    <select
                      value={formLogo}
                      onChange={(e) => setFormLogo(e.target.value)}
                      className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#fa541c] bg-white font-bold"
                    >
                      <option value="🎓">🎓 学术专业级</option>
                      <option value="🏛️">🏛️ 传统大学底蕴</option>
                      <option value="🤖">🤖 人工智能特色</option>
                      <option value="🪐">🪐 前沿科创</option>
                      <option value="🛡️">🛡️ 信息安全硬实力</option>
                      <option value="☁️">☁️ 云计算开发</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-neutral-700 block">
                      合约时长周期设置：
                    </label>
                    <select
                      value={formDuration}
                      onChange={(e) => setFormDuration(e.target.value)}
                      className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#fa541c] bg-white font-bold"
                    >
                      <option value="3">3 个月 (快速短期体验包)</option>
                      <option value="6">6 个月 (单学期常规实训包)</option>
                      <option value="12">12 个月 (标准包年标准合约)</option>
                      <option value="24">24 个月 (跨学年深度共建合约)</option>
                    </select>
                  </div>

                  <div className="space-y-1.5 col-span-2">
                    <label className="font-bold text-neutral-700 block">
                      机构描述/合作方向：
                    </label>
                    <textarea
                      value={formDesc}
                      onChange={(e) => setFormDesc(e.target.value)}
                      placeholder="输入租户实训大纲及合作方向概要..."
                      rows={2}
                      className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#fa541c] bg-white text-neutral-800 font-medium placeholder-neutral-400"
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Admin credentials */}
              <div className="space-y-4 border-t border-neutral-100 pt-5">
                <h3 className="font-black text-neutral-title text-sm border-l-3 border-[#fa541c] pl-2">
                  2. 机构首任系统主管理员账号
                </h3>
                
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="font-bold text-neutral-700 block">
                      <span className="text-red-500 font-bold mr-0.5">*</span> 姓名/教授称呼：
                    </label>
                    <input
                      type="text"
                      required
                      value={formAdminName}
                      onChange={(e) => setFormAdminName(e.target.value)}
                      placeholder="王老师"
                      className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#fa541c] bg-white text-neutral-800 font-medium placeholder-neutral-400"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-neutral-700 block">
                      <span className="text-red-500 font-bold mr-0.5">*</span> 绑定手机号：
                    </label>
                    <input
                      type="text"
                      required
                      value={formAdminPhone}
                      onChange={(e) => setFormAdminPhone(e.target.value)}
                      placeholder="13800000000"
                      className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#fa541c] bg-white text-neutral-800 font-mono"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-neutral-700 block">
                      <span className="text-red-500 font-bold mr-0.5">*</span> 系统开通邮箱：
                    </label>
                    <input
                      type="email"
                      required
                      value={formAdminEmail}
                      onChange={(e) => setFormAdminEmail(e.target.value)}
                      placeholder="admin@univ.edu.cn"
                      className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#fa541c] bg-white text-neutral-800 font-mono"
                    />
                  </div>
                </div>
                <span className="text-[10px] text-neutral-caption font-semibold block leading-relaxed">
                  ⚠️ 账号开通后将动态向该工作邮箱发送专属激活账密、实训网关API密钥及详细系统配置指引。
                </span>
              </div>

              {/* Section 3: Quota Allocations */}
              <div className="space-y-4 border-t border-neutral-100 pt-5">
                <h3 className="font-black text-neutral-title text-sm border-l-3 border-[#fa541c] pl-2">
                  3. 平台算力容量与资源配额分配表
                </h3>
                
                <div className="grid grid-cols-3 gap-4">
                  {/* Students limits */}
                  <div className="space-y-1.5">
                    <label className="font-bold text-neutral-700 block">学生席位总数 (人)：</label>
                    <input
                      type="number"
                      required
                      min={10}
                      value={formStudents}
                      onChange={(e) => setFormStudents(parseInt(e.target.value))}
                      className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#fa541c] bg-white text-neutral-800 font-mono"
                    />
                  </div>

                  {/* Teachers */}
                  <div className="space-y-1.5">
                    <label className="font-bold text-neutral-700 block">教师授课席位 (人)：</label>
                    <input
                      type="number"
                      required
                      min={1}
                      value={formTeachers}
                      onChange={(e) => setFormTeachers(parseInt(e.target.value))}
                      className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#fa541c] bg-white text-neutral-800 font-mono"
                    />
                  </div>

                  {/* GPU Hours */}
                  <div className="space-y-1.5">
                    <label className="font-bold text-neutral-[#fa541c] block">V100 GPU 额度(卡时)：</label>
                    <input
                      type="number"
                      required
                      min={100}
                      value={formGpu}
                      onChange={(e) => setFormGpu(parseInt(e.target.value))}
                      className="w-full border border-[#ffbb96] rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#fa541c] bg-white text-neutral-800 font-mono"
                    />
                  </div>

                  {/* CPU Hours */}
                  <div className="space-y-1.5">
                    <label className="font-bold text-neutral-700 block">CPU 主机时长 (小时)：</label>
                    <input
                      type="number"
                      required
                      min={200}
                      value={formCpu}
                      onChange={(e) => setFormCpu(parseInt(e.target.value))}
                      className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#fa541c] bg-white text-neutral-800 font-mono"
                    />
                  </div>

                  {/* Projects Limit */}
                  <div className="space-y-1.5">
                    <label className="font-bold text-neutral-700 block">实训项目数上限 (个)：</label>
                    <input
                      type="number"
                      required
                      min={10}
                      value={formProjects}
                      onChange={(e) => setFormProjects(parseInt(e.target.value))}
                      className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#fa541c] bg-white text-neutral-800 font-mono"
                    />
                  </div>

                  {/* Datasets Limits */}
                  <div className="space-y-1.5">
                    <label className="font-bold text-neutral-700 block">共享数据集上限 (GB)：</label>
                    <input
                      type="number"
                      required
                      min={10}
                      value={formDatasets}
                      onChange={(e) => setFormDatasets(parseInt(e.target.value))}
                      className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#fa541c] bg-white text-neutral-800 font-mono"
                    />
                  </div>

                  {/* Practices Limit */}
                  <div className="space-y-1.5">
                    <label className="font-bold text-neutral-700 block">最佳实践案例数限制：</label>
                    <input
                      type="number"
                      required
                      min={5}
                      value={formPractices}
                      onChange={(e) => setFormPractices(parseInt(e.target.value))}
                      className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#fa541c] bg-white text-neutral-800 font-mono"
                    />
                  </div>

                  {/* AI Agents limit */}
                  <div className="space-y-1.5">
                    <label className="font-bold text-neutral-700 block">智能助手容器上限 (个)：</label>
                    <input
                      type="number"
                      required
                      min={10}
                      value={formAgents}
                      onChange={(e) => setFormAgents(parseInt(e.target.value))}
                      className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#fa541c] bg-white text-neutral-800 font-mono"
                    />
                  </div>

                  {/* Token limits */}
                  <div className="space-y-1.5">
                    <label className="font-bold text-[#fa541c] block">API Token 限额 (百万)：</label>
                    <input
                      type="number"
                      required
                      min={10}
                      value={formTokens}
                      onChange={(e) => setFormTokens(parseInt(e.target.value))}
                      className="w-full border border-[#ffbb96] rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#fa541c] bg-white text-neutral-800 font-mono"
                    />
                  </div>

                </div>
              </div>

              {/* Section 4: Functional permissions */}
              <div className="space-y-4 border-t border-neutral-100 pt-5">
                <h3 className="font-black text-neutral-title text-sm border-l-3 border-[#fa541c] pl-2">
                  4. 设置初始系统可用功能菜单权限
                </h3>
                
                <div className="grid grid-cols-2 gap-3.5 select-none">
                  {availableSystemMenus.map((menu) => {
                    const isChecked = formMenus.includes(menu.code);
                    return (
                      <button
                        key={menu.code}
                        type="button"
                        onClick={() => {
                          if (isChecked) {
                            setFormMenus(formMenus.filter(c => c !== menu.code));
                          } else {
                            setFormMenus([...formMenus, menu.code]);
                          }
                        }}
                        className={cn(
                          "p-3 rounded-lg border text-left flex items-center justify-between font-bold transition-all cursor-pointer bg-white text-neutral-body",
                          isChecked ? "border-[#fa541c] bg-[#fff2e8]/20 text-[#fa541c]" : "border-neutral-200"
                        )}
                      >
                        <span>{menu.label}</span>
                        {isChecked ? (
                          <CheckCircle className="w-4 h-4 text-[#fa541c]" />
                        ) : (
                          <div className="w-4 h-4 rounded-full border border-neutral-300" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

            </form>

            {/* Actions footer */}
            <div className="p-6 bg-neutral-50 border-t border-neutral-border flex gap-3 shrink-0 select-none">
              <button
                type="submit"
                onClick={handleCreateTenant}
                className="bg-[#fa541c] hover:bg-[#e84a15] text-white font-bold px-4 py-2.5 rounded-lg flex-1 cursor-pointer transition-colors shadow-3xs text-center"
              >
                确认创建并下发开通邮件
              </button>
              <button
                type="button"
                onClick={() => setShowCreateDrawer(false)}
                className="bg-white hover:bg-neutral-100 text-neutral-body font-bold border border-neutral-200 px-4 py-2.5 rounded-lg flex-1 cursor-pointer transition-colors text-center shadow-3xs"
              >
                取消返回
              </button>
            </div>

          </div>
        </div>
      )}

      {/* 3. EDIT TENANT DRAWER (编辑租户参数分区表单) */}
      {showEditDrawer && selectedTenant && (
        <div className="fixed inset-0 z-[150] overflow-hidden flex justify-end bg-black/35 backdrop-blur-3xs animate-fade-in select-none">
          <div className="flex-1" onClick={() => setShowEditDrawer(false)}></div>
          
          <div className="w-full max-w-[650px] bg-white h-full shadow-2xl flex flex-col justify-between animate-slide-left text-xs">
            
            {/* Header */}
            <div className="p-6 border-b border-neutral-border flex items-center justify-between shrink-0 bg-neutral-50/50">
              <div className="flex items-center gap-2">
                <Edit className="w-5 h-5 text-[#fa541c]" />
                <h2 className="text-base font-black text-neutral-title">变更租户配置参数 (ID: {selectedTenant.id})</h2>
              </div>
              <button 
                onClick={() => setShowEditDrawer(false)}
                className="p-1 rounded-full text-neutral-400 hover:bg-neutral-200 hover:text-neutral-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body Form */}
            <form onSubmit={handleSaveTenantEdit} className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar text-neutral-body">
              
              {/* Basic info */}
              <div className="space-y-4">
                <h3 className="font-black text-neutral-title text-sm border-l-3 border-[#fa541c] pl-2">
                  1. 实训机构单位基础信息
                </h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5 col-span-2">
                    <label className="font-bold text-neutral-700 block">租户名称/高校：</label>
                    <input
                      type="text"
                      required
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#fa541c] bg-white text-neutral-800 font-bold"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-neutral-700 block">机构标志风格预设：</label>
                    <select
                      value={formLogo}
                      onChange={(e) => setFormLogo(e.target.value)}
                      className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#fa541c] bg-white font-bold"
                    >
                      <option value="🎓">🎓 学术专业级</option>
                      <option value="🏛️">🏛️ 传统大学底蕴</option>
                      <option value="🤖">🤖 人工智能特色</option>
                      <option value="🪐">🪐 前沿科创</option>
                      <option value="🛡️">🛡️ 信息安全硬实力</option>
                      <option value="☁️">☁️ 云计算开发</option>
                    </select>
                  </div>

                  <div className="space-y-1.5 col-span-2">
                    <label className="font-bold text-neutral-700 block">机构描述概况：</label>
                    <textarea
                      value={formDesc}
                      onChange={(e) => setFormDesc(e.target.value)}
                      rows={2}
                      className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#fa541c] bg-white text-neutral-800 font-medium"
                    />
                  </div>
                </div>
              </div>

              {/* Admin profile */}
              <div className="space-y-4 border-t border-neutral-100 pt-5">
                <h3 className="font-black text-neutral-title text-sm border-l-3 border-[#fa541c] pl-2">
                  2. 修改主系统管理员账号信息
                </h3>
                
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="font-bold text-neutral-700 block">姓名称呼：</label>
                    <input
                      type="text"
                      required
                      value={formAdminName}
                      onChange={(e) => setFormAdminName(e.target.value)}
                      className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#fa541c] bg-white text-neutral-800 font-bold"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-neutral-700 block">管理员手机：</label>
                    <input
                      type="text"
                      required
                      value={formAdminPhone}
                      onChange={(e) => setFormAdminPhone(e.target.value)}
                      className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#fa541c] bg-white text-neutral-800 font-mono"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-neutral-700 block">接收邮箱：</label>
                    <input
                      type="email"
                      required
                      value={formAdminEmail}
                      onChange={(e) => setFormAdminEmail(e.target.value)}
                      className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#fa541c] bg-white text-neutral-800 font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Quotas */}
              <div className="space-y-4 border-t border-neutral-100 pt-5">
                <h3 className="font-black text-neutral-title text-sm border-l-3 border-[#fa541c] pl-2">
                  3. 微调平台物理配额与算力池参数
                </h3>
                
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="font-bold text-neutral-700 block">学生上限 (当前: {selectedTenant.quotas.studentsUsed})：</label>
                    <input
                      type="number"
                      required
                      min={selectedTenant.quotas.studentsUsed}
                      value={formStudents}
                      onChange={(e) => setFormStudents(parseInt(e.target.value))}
                      className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#fa541c] bg-white text-neutral-800 font-mono"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-neutral-700 block">教师上限 (当前: {selectedTenant.quotas.teachersUsed})：</label>
                    <input
                      type="number"
                      required
                      min={selectedTenant.quotas.teachersUsed}
                      value={formTeachers}
                      onChange={(e) => setFormTeachers(parseInt(e.target.value))}
                      className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#fa541c] bg-white text-neutral-800 font-mono"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-[#fa541c] block">GPU 额度 (已消: {selectedTenant.quotas.gpuHoursUsed})：</label>
                    <input
                      type="number"
                      required
                      min={selectedTenant.quotas.gpuHoursUsed}
                      value={formGpu}
                      onChange={(e) => setFormGpu(parseInt(e.target.value))}
                      className="w-full border border-[#ffbb96] rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#fa541c] bg-white text-neutral-800 font-mono"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-neutral-700 block">CPU限额时长 (小时)：</label>
                    <input
                      type="number"
                      required
                      min={selectedTenant.quotas.cpuHoursUsed}
                      value={formCpu}
                      onChange={(e) => setFormCpu(parseInt(e.target.value))}
                      className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#fa541c] bg-white text-neutral-800 font-mono"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-neutral-700 block">项目数上限 (个)：</label>
                    <input
                      type="number"
                      required
                      min={selectedTenant.quotas.projectsUsed}
                      value={formProjects}
                      onChange={(e) => setFormProjects(parseInt(e.target.value))}
                      className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#fa541c] bg-white text-neutral-800 font-mono"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-neutral-700 block">共享数据集 GB容量：</label>
                    <input
                      type="number"
                      required
                      min={selectedTenant.quotas.datasetsGbUsed}
                      value={formDatasets}
                      onChange={(e) => setFormDatasets(parseInt(e.target.value))}
                      className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#fa541c] bg-white text-neutral-800 font-mono"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-neutral-700 block">案例数上限限制：</label>
                    <input
                      type="number"
                      required
                      min={selectedTenant.quotas.practicesUsed}
                      value={formPractices}
                      onChange={(e) => setFormPractices(parseInt(e.target.value))}
                      className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#fa541c] bg-white text-neutral-800 font-mono"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-neutral-700 block">AI助手实例限制 (个)：</label>
                    <input
                      type="number"
                      required
                      min={selectedTenant.quotas.agentsUsed}
                      value={formAgents}
                      onChange={(e) => setFormAgents(parseInt(e.target.value))}
                      className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#fa541c] bg-white text-neutral-800 font-mono"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-[#fa541c] block">API Token (已消: {selectedTenant.quotas.tokensUsed})：</label>
                    <input
                      type="number"
                      required
                      min={selectedTenant.quotas.tokensUsed}
                      value={formTokens}
                      onChange={(e) => setFormTokens(parseInt(e.target.value))}
                      className="w-full border border-[#ffbb96] rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#fa541c] bg-white text-neutral-800 font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Functional permissions */}
              <div className="space-y-4 border-t border-neutral-100 pt-5">
                <h3 className="font-black text-neutral-title text-sm border-l-3 border-[#fa541c] pl-2">
                  4. 重配置可访问的功能菜单权限模块
                </h3>
                
                <div className="grid grid-cols-2 gap-3.5 select-none">
                  {availableSystemMenus.map((menu) => {
                    const isChecked = formMenus.includes(menu.code);
                    return (
                      <button
                        key={menu.code}
                        type="button"
                        onClick={() => {
                          if (isChecked) {
                            setFormMenus(formMenus.filter(c => c !== menu.code));
                          } else {
                            setFormMenus([...formMenus, menu.code]);
                          }
                        }}
                        className={cn(
                          "p-3 rounded-lg border text-left flex items-center justify-between font-bold transition-all cursor-pointer bg-white text-neutral-body",
                          isChecked ? "border-[#fa541c] bg-[#fff2e8]/20 text-[#fa541c]" : "border-neutral-200"
                        )}
                      >
                        <span>{menu.label}</span>
                        {isChecked ? (
                          <CheckCircle className="w-4 h-4 text-[#fa541c]" />
                        ) : (
                          <div className="w-4 h-4 rounded-full border border-neutral-300" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

            </form>

            {/* Footer */}
            <div className="p-6 bg-neutral-50 border-t border-neutral-border flex gap-3 shrink-0 select-none">
              <button
                type="submit"
                onClick={handleSaveTenantEdit}
                className="bg-[#fa541c] hover:bg-[#e84a15] text-white font-bold px-4 py-2.5 rounded-lg flex-1 cursor-pointer transition-colors shadow-3xs text-center"
              >
                保存变更并同步生效
              </button>
              <button
                type="button"
                onClick={() => setShowEditDrawer(false)}
                className="bg-white hover:bg-neutral-100 text-neutral-body font-bold border border-neutral-200 px-4 py-2.5 rounded-lg flex-1 cursor-pointer transition-colors text-center shadow-3xs"
              >
                取消返回
              </button>
            </div>

          </div>
        </div>
      )}

      {/* 4. DISABLE TENANT MODAL (一键禁用弹窗原因与有效期设定) */}
      {showDisableModal && selectedTenant && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-fade-in text-xs font-sans select-none">
          <form onSubmit={handleConfirmDisable} className="w-full max-w-[420px] bg-white rounded-2xl shadow-2xl overflow-hidden animate-scale-up flex flex-col">
            
            {/* Header */}
            <div className="bg-rose-50 px-6 py-4 border-b border-rose-100 flex items-center gap-2 text-rose-700 shrink-0">
              <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0 animate-bounce" />
              <span className="font-black text-sm">封禁隔离停用租户机构</span>
            </div>

            {/* Body */}
            <div className="p-6 space-y-4 text-neutral-body font-semibold">
              <p className="leading-relaxed font-bold text-neutral-title">
                🔔 确定要冻结并封禁租户「<span className="text-[#fa541c]">{selectedTenant.name}</span>」的系统服务使用权限吗？
              </p>
              
              <div className="p-3 bg-rose-50/50 border border-rose-100 rounded-lg text-[10.5px] text-rose-800 leading-relaxed font-medium">
                隔离封禁后，该租户及其下属所有子用户（学生/教师/教务人员）均无法登录平台，实时占用算力容器将被平滑挂起保留，数据完整存储不丢失。
              </div>

              {/* Disable Reason */}
              <div className="space-y-1.5 pt-2">
                <label className="font-bold text-neutral-700 block">选择封禁的主要因由分类：</label>
                <select
                  value={disableReason}
                  onChange={(e) => setDisableReason(e.target.value)}
                  className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-rose-500 bg-white font-bold text-neutral-title"
                >
                  <option value="未足额缴费">未按合约足额缴纳实训算力费</option>
                  <option value="合约期限到期争议">合约期限有争议（超期使用限制）</option>
                  <option value="系统算力恶意滥用违规">物理算力被非法用作黑产及异常并发</option>
                  <option value="敏感政治违规内容">上传违规敏感内容课件/数据集</option>
                  <option value="其他原因">其他非标准化因由（请在下方手动填写）</option>
                </select>
              </div>

              {/* Custom reason */}
              {disableReason === "其他原因" && (
                <div className="space-y-1.5 animate-slide-up">
                  <label className="font-bold text-neutral-700 block">说明具体封禁原因详情：</label>
                  <input
                    type="text"
                    required
                    value={customDisableReason}
                    onChange={(e) => setCustomDisableReason(e.target.value)}
                    placeholder="输入具体文字细节..."
                    className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-rose-500 bg-white font-medium"
                  />
                </div>
              )}

              {/* Expiration date */}
              <div className="space-y-1.5">
                <label className="font-bold text-neutral-700 block">封禁自动解除到期日期：</label>
                <input
                  type="date"
                  required
                  value={disableUntil}
                  onChange={(e) => setDisableUntil(e.target.value)}
                  className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-rose-500 bg-white font-mono font-bold"
                />
                <span className="text-[10px] text-neutral-caption font-semibold block mt-0.5">
                  到期后系统算力网关会自动解封；若需长期无限封禁请设置到极晚日期。
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="px-6 py-4 bg-neutral-50 border-t border-neutral-border flex items-center justify-end gap-3 shrink-0">
              <button
                type="button"
                onClick={() => setShowDisableModal(false)}
                className="bg-white hover:bg-neutral-100 text-neutral-body font-bold px-4 py-2 border border-neutral-border rounded-lg cursor-pointer transition-colors"
              >
                放弃取消
              </button>
              <button
                type="submit"
                className="bg-rose-600 hover:bg-rose-700 text-white font-bold px-5 py-2 rounded-lg cursor-pointer transition-colors shadow-sm"
              >
                确认封禁租户
              </button>
            </div>

          </form>
        </div>
      )}

      {/* 5. RENEW CONTRACT PERIOD MODAL (快捷续期弹窗) */}
      {showRenewModal && selectedTenant && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-fade-in text-xs font-sans select-none">
          <form onSubmit={handleConfirmRenew} className="w-full max-w-[420px] bg-white rounded-2xl shadow-2xl overflow-hidden animate-scale-up flex flex-col">
            
            {/* Header */}
            <div className="bg-[#fff2e8] px-6 py-4 border-b border-[#ffbb96]/45 flex items-center gap-2 text-[#fa541c] shrink-0">
              <Clock className="w-5 h-5 text-[#fa541c] shrink-0" />
              <span className="font-black text-sm">快捷续费与合约期展延</span>
            </div>

            {/* Body */}
            <div className="p-6 space-y-4 text-neutral-body font-semibold">
              <p className="leading-relaxed font-bold text-neutral-title">
                为租户「<span className="text-[#fa541c]">{selectedTenant.name}</span>」延长平台服务有效期。
              </p>
              
              <div className="p-3 bg-[#fff2e8]/30 border border-[#ffbb96]/20 rounded-lg text-[10.5px] text-neutral-body leading-relaxed font-medium">
                该租户目前的合约到期时间为：<span className="font-mono font-bold text-neutral-title">{selectedTenant.expireAt}</span>。
              </div>

              {/* Renewal choices */}
              <div className="space-y-1.5">
                <label className="font-bold text-neutral-700 block">选择延长期限（自原到期日或今日累加）：</label>
                <select
                  value={renewMonths}
                  onChange={(e) => { setRenewMonths(e.target.value); setCustomRenewDate(""); }}
                  className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#fa541c] bg-white font-bold text-neutral-title"
                >
                  <option value="3">延展 3 个月 (单学季延展包)</option>
                  <option value="6">延展 6 个月 (半学年延展包)</option>
                  <option value="12">延展 12 个月 (标准年度续期合约)</option>
                  <option value="24">延展 24 个月 (跨越双学年深度战略续费)</option>
                  <option value="custom">设置自定义精准到期日 (下方指定)</option>
                </select>
              </div>

              {/* Custom date */}
              {renewMonths === "custom" && (
                <div className="space-y-1.5 animate-slide-up">
                  <label className="font-bold text-neutral-700 block">指定确切的到期失效日期：</label>
                  <input
                    type="date"
                    required
                    value={customRenewDate}
                    onChange={(e) => setCustomRenewDate(e.target.value)}
                    className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#fa541c] bg-white font-mono font-bold text-neutral-title"
                  />
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="px-6 py-4 bg-neutral-50 border-t border-neutral-border flex items-center justify-end gap-3 shrink-0">
              <button
                type="button"
                onClick={() => setShowRenewModal(false)}
                className="bg-white hover:bg-neutral-100 text-neutral-body font-bold px-4 py-2 border border-neutral-border rounded-lg cursor-pointer transition-colors"
              >
                取消返回
              </button>
              <button
                type="submit"
                className="bg-[#fa541c] hover:bg-[#e84a15] text-white font-bold px-5 py-2 rounded-lg cursor-pointer transition-colors shadow-sm"
              >
                确认续期生效
              </button>
            </div>

          </form>
        </div>
      )}

      {/* 6. PLATFORM RESOURCE CREATION AUTHORIZATION MODAL (超管公共资源特权授权弹窗) */}
      {showAuthModal && selectedTenant && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-fade-in text-xs font-sans select-none">
          <form onSubmit={handleConfirmAuth} className="w-full max-w-[450px] bg-white rounded-2xl shadow-2xl overflow-hidden animate-scale-up flex flex-col">
            
            {/* Header */}
            <div className="bg-[#fff2e8] px-6 py-4 border-b border-[#ffbb96]/45 flex items-center gap-2 text-[#fa541c] shrink-0">
              <Shield className="w-5 h-5 text-[#fa541c] shrink-0" />
              <span className="font-black text-sm">授予免审共享实训资源特权</span>
            </div>

            {/* Body */}
            <div className="p-6 space-y-4 text-neutral-body font-semibold">
              <p className="leading-relaxed font-bold text-neutral-title">
                为机构「<span className="text-[#fa541c]">{selectedTenant.name}</span>」开通免审核直接创建平台默认公开的公共资源特权。
              </p>
              
              {/* Type checkboxes */}
              <div className="space-y-2 pt-1.5">
                <label className="font-bold text-neutral-700 block">选择允许免审创建的实训资源大类（可多选）：</label>
                <div className="grid grid-cols-3 gap-2.5">
                  {(["课程", "项目", "试题"] as ("课程" | "项目" | "试题")[]).map((type) => {
                    const isChecked = selectedAuthTypes.includes(type);
                    return (
                      <button
                        key={type}
                        type="button"
                        onClick={() => {
                          if (isChecked) {
                            setSelectedAuthTypes(selectedAuthTypes.filter(c => c !== type));
                          } else {
                            setSelectedAuthTypes([...selectedAuthTypes, type]);
                          }
                        }}
                        className={cn(
                          "py-2 border rounded-lg font-bold text-center transition-colors cursor-pointer",
                          isChecked ? "border-[#fa541c] bg-[#fff2e8] text-[#fa541c]" : "border-neutral-200 text-neutral-caption"
                        )}
                      >
                        {type}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Auth duration */}
              <div className="space-y-1.5">
                <label className="font-bold text-neutral-700 block">该特权授权的最长有效授信期限：</label>
                <select
                  value={authDurationMonths}
                  onChange={(e) => setAuthDurationMonths(e.target.value)}
                  className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#fa541c] bg-white font-bold text-neutral-title"
                >
                  <option value="3">授权 3 个月 (一个教学周期)</option>
                  <option value="6">授权 6 个月 (半学年有效期)</option>
                  <option value="12">授权 12 个月 (一整学年授信)</option>
                  <option value="24">永久授信授权 (无合约过期限制)</option>
                </select>
              </div>

              {/* Compliance Verification checklist */}
              <div className="space-y-2 pt-2 border-t border-neutral-100">
                <label className="font-bold text-neutral-700 block text-[11px] uppercase tracking-wider text-[#fa541c]">
                  ☑️ 开通授信硬性符合标准验证（必须勾选）：
                </label>
                
                <div className="space-y-2">
                  {[
                    { id: "credit", label: "该租户在平台历来表现良好，信誉等级达A级评定", state: authCreditChecked, setState: setAuthCreditChecked },
                    { id: "quality", label: "该机构提供的往期资源经过教委会抽检，质量评定优", state: authQualityChecked, setState: setAuthQualityChecked },
                    { id: "noViolation", label: "该租户安全审计链健康，无任何数据泄露及违规操作史", state: authNoViolationChecked, setState: setAuthNoViolationChecked }
                  ].map((chk) => (
                    <button
                      key={chk.id}
                      type="button"
                      onClick={() => chk.setState(!chk.state)}
                      className="w-full text-left flex items-start gap-2.5 text-[10.5px] leading-relaxed font-semibold cursor-pointer"
                    >
                      {chk.state ? (
                        <CheckSquare className="w-4 h-4 text-[#fa541c] mt-0.5 shrink-0" />
                      ) : (
                        <Square className="w-4 h-4 text-neutral-300 mt-0.5 shrink-0" />
                      )}
                      <span>{chk.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="px-6 py-4 bg-neutral-50 border-t border-neutral-border flex items-center justify-end gap-3 shrink-0">
              <button
                type="button"
                onClick={() => setShowAuthModal(false)}
                className="bg-white hover:bg-neutral-100 text-neutral-body font-bold px-4 py-2 border border-neutral-border rounded-lg cursor-pointer transition-colors"
              >
                放弃授信
              </button>
              <button
                type="submit"
                disabled={!authCreditChecked || !authQualityChecked || !authNoViolationChecked || selectedAuthTypes.length === 0}
                className={cn(
                  "font-bold px-5 py-2 rounded-lg cursor-pointer transition-colors shadow-sm text-white",
                  (!authCreditChecked || !authQualityChecked || !authNoViolationChecked || selectedAuthTypes.length === 0)
                    ? "bg-neutral-300 cursor-not-allowed"
                    : "bg-[#fa541c] hover:bg-[#e84a15]"
                )}
              >
                确认授予共享特权
              </button>
            </div>

          </form>
        </div>
      )}

      {/* 7. INITIAL EMAIL NOTIFICATION RECEIPT OVERLAY (邮箱发送成功回执模态窗) */}
      {showEmailReceipt && (
        <div className="fixed inset-0 z-[250] flex items-center justify-center bg-black/45 backdrop-blur-xs p-4 animate-fade-in text-xs font-sans">
          <div className="w-full max-w-[480px] bg-white rounded-2xl shadow-2xl overflow-hidden animate-scale-up flex flex-col border border-neutral-200">
            
            {/* Success graphic banner */}
            <div className="bg-emerald-50 px-6 py-5 border-b border-emerald-100 flex flex-col items-center gap-2.5 text-emerald-700 shrink-0 text-center select-none">
              <div className="w-11 h-11 bg-emerald-100 rounded-full flex items-center justify-center animate-bounce">
                <MailCheck className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <h3 className="font-black text-base">租户开通成功 ➔ 系统账密通知邮件已发送</h3>
                <span className="text-[10px] text-emerald-600 font-bold block mt-1">
                  平台已与首任管理员工作邮箱成功对接并发送初始化配置包
                </span>
              </div>
            </div>

            {/* Content Details */}
            <div className="p-6 space-y-4 text-neutral-body leading-relaxed select-none">
              
              <div className="space-y-1.5 p-4 bg-neutral-50 border border-neutral-200 rounded-xl font-mono text-[11px] relative">
                <span className="absolute right-3.5 top-3.5 text-[9px] font-sans font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-700 border border-emerald-200/50 scale-90">通知详情</span>
                <p><span className="text-neutral-caption">邮件主题:</span> 🚀 智云实训云端空间开通通知 - {showEmailReceipt.tenantName}</p>
                <p><span className="text-neutral-caption">收件地址:</span> {showEmailReceipt.adminEmail} ({showEmailReceipt.adminName})</p>
                <p className="border-t border-neutral-200/50 pt-2 mt-2"><span className="text-neutral-caption">登录地址:</span> http://zhiyun.实训平台.cn/login/admin</p>
                <p><span className="text-neutral-caption">首任账号:</span> {showEmailReceipt.adminEmail}</p>
                <p><span className="text-neutral-caption">临时密码:</span> <span className="font-bold text-[#fa541c] font-sans">{showEmailReceipt.tempPass}</span> (首次登录强制修改)</p>
                <p><span className="text-neutral-caption">合约到期:</span> {showEmailReceipt.expireDate}</p>
              </div>

              <div className="text-[10px] text-neutral-caption font-semibold bg-neutral-50/50 p-2.5 rounded-lg border border-neutral-100 flex items-start gap-1.5 leading-normal">
                <Info className="w-4 h-4 text-neutral-400 shrink-0 mt-0.5" />
                <span>管理员账号具有该租户下的教务管理、班级划分及算力微调二级授权，系统已对其功能进行自动激活审计记录。</span>
              </div>

            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-neutral-50 border-t border-neutral-border flex justify-end shrink-0">
              <button
                type="button"
                onClick={() => setShowEmailReceipt(null)}
                className="bg-[#fa541c] hover:bg-[#e84a15] text-white font-bold px-6 py-2 rounded-lg cursor-pointer transition-colors shadow-3xs text-center font-sans"
              >
                已悉，完成并关闭通知
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
