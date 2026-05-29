import React, { useState } from "react";
import { 
  Key, Shield, Layers, Activity, FileText, CheckCircle, AlertTriangle, 
  Clock, Search, Filter, AlertCircle, Settings, X, ChevronRight, ChevronDown, 
  Cpu, Database, Terminal, ShieldAlert, Copy, BookOpen, HelpCircle, Info, Lock
} from "lucide-react";
import { cn } from "@/lib/utils";

// --- Interfaces ---
interface PermissionTag {
  name: string;
  code: string;
  inheritedFrom: string; // "base" | "advanced" | "ai"
}

interface SubCategory {
  name: string;
  itemCount: number;
  tags: PermissionTag[];
}

interface PrimaryCategory {
  name: string;
  itemCount: number;
  subCategories: SubCategory[];
}

interface PlatformConfig {
  code: string;
  name: string;
  description: string;
  modules: {
    name: string;
    code: string;
    itemCount: number;
    primaries: PrimaryCategory[];
  }[];
}

// --- Data Config matching Image 1 exactly, plus teacher/student configs for high interactivity ---
const initialPlatforms: PlatformConfig[] = [
  {
    code: "operation",
    name: "运营端 (operation)",
    description: "全局物理实训资源监控、多租户套餐隔离与准入风控网关策略管理。",
    modules: [
      {
        name: "身份与访问管理",
        code: "iam",
        itemCount: 33,
        primaries: [
          {
            name: "组织管理",
            itemCount: 28,
            subCategories: [
              {
                name: "租户管理",
                itemCount: 11,
                tags: [
                  { name: "停用租户", code: "tenant:disable", inheritedFrom: "base" },
                  { name: "创建租户", code: "tenant:create", inheritedFrom: "base" },
                  { name: "删除租户", code: "tenant:delete", inheritedFrom: "base" },
                  { name: "启用租户", code: "tenant:enable", inheritedFrom: "base" },
                  { name: "归档租户", code: "tenant:archive", inheritedFrom: "base" },
                  { name: "更新租户激活门槛", code: "tenant:update-threshold", inheritedFrom: "advanced" },
                  { name: "更新租户简称", code: "tenant:update-alias", inheritedFrom: "base" },
                  { name: "更新租户认证", code: "tenant:update-auth", inheritedFrom: "advanced" },
                  { name: "查看租户信息", code: "tenant:view", inheritedFrom: "base" },
                  { name: "维护本租户联系信息", code: "tenant:maintain-self-contact", inheritedFrom: "base" },
                  { name: "维护租户联系信息", code: "tenant:maintain-all-contact", inheritedFrom: "advanced" }
                ]
              },
              {
                name: "用户管理",
                itemCount: 8,
                tags: [
                  { name: "冻结用户", code: "user:freeze", inheritedFrom: "base" },
                  { name: "创建用户", code: "user:create", inheritedFrom: "base" },
                  { name: "删除用户", code: "user:delete", inheritedFrom: "base" },
                  { name: "归档用户", code: "user:archive", inheritedFrom: "base" },
                  { name: "查看用户信息", code: "user:view", inheritedFrom: "base" },
                  { name: "维护用户资料", code: "user:maintain-profile", inheritedFrom: "base" },
                  { name: "解冻用户", code: "user:unfreeze", inheritedFrom: "base" },
                  { name: "重置用户密码", code: "user:reset-password", inheritedFrom: "advanced" }
                ]
              },
              {
                name: "成员关系",
                itemCount: 4,
                tags: [
                  { name: "冻结成员关系", code: "member:freeze-relation", inheritedFrom: "base" },
                  { name: "查看租户成员", code: "member:view", inheritedFrom: "base" },
                  { name: "移出租户成员", code: "member:remove", inheritedFrom: "advanced" },
                  { name: "解冻成员关系", code: "member:unfreeze-relation", inheritedFrom: "base" }
                ]
              },
              {
                name: "用户组",
                itemCount: 5,
                tags: [
                  { name: "创建用户组", code: "group:create", inheritedFrom: "base" },
                  { name: "删除用户组", code: "group:delete", inheritedFrom: "base" },
                  { name: "更新用户组", code: "group:update", inheritedFrom: "base" },
                  { name: "查看用户组", code: "group:view", inheritedFrom: "base" },
                  { name: "管理用户组成员", code: "group:manage-members", inheritedFrom: "advanced" }
                ]
              }
            ]
          },
          {
            name: "认证管理",
            itemCount: 1,
            subCategories: [
              {
                name: "会话与登录审计",
                itemCount: 1,
                tags: [
                  { name: "查看用户登录日志", code: "audit:login-logs", inheritedFrom: "base" }
                ]
              }
            ]
          },
          {
            name: "授权管理",
            itemCount: 4,
            subCategories: [
              {
                name: "角色管理",
                itemCount: 2,
                tags: [
                  { name: "查看角色定义", code: "role:view-definition", inheritedFrom: "base" },
                  { name: "管理角色定义", code: "role:manage-definition", inheritedFrom: "advanced" }
                ]
              },
              {
                name: "角色绑定",
                itemCount: 2,
                tags: [
                  { name: "查看角色分配", code: "role:view-allocation", inheritedFrom: "base" },
                  { name: "管理角色分配", code: "role:manage-allocation", inheritedFrom: "advanced" }
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  {
    code: "teacher",
    name: "教师端 (teacher)",
    description: "教学班级创建、实验沙箱监控、试题库维护与智能防作弊风控检测。",
    modules: [
      {
        name: "班级与实训管理",
        code: "edu",
        itemCount: 14,
        primaries: [
          {
            name: "班级管理",
            itemCount: 6,
            subCategories: [
              {
                name: "实训课堂",
                itemCount: 3,
                tags: [
                  { name: "创建实训班级", code: "class:create", inheritedFrom: "base" },
                  { name: "归档实训班级", code: "class:archive", inheritedFrom: "base" },
                  { name: "查看班级大屏", code: "class:dashboard", inheritedFrom: "base" }
                ]
              },
              {
                name: "学生名册",
                itemCount: 3,
                tags: [
                  { name: "导入学生名册", code: "student:import", inheritedFrom: "base" },
                  { name: "剔除违规学生", code: "student:kick", inheritedFrom: "advanced" },
                  { name: "重设实训密钥", code: "student:reset-token", inheritedFrom: "base" }
                ]
              }
            ]
          },
          {
            name: "教学资源管理",
            itemCount: 8,
            subCategories: [
              {
                name: "试题与试卷",
                itemCount: 4,
                tags: [
                  { name: "录入智能试题", code: "question:create", inheritedFrom: "base" },
                  { name: "一键AI组卷", code: "paper:ai-generate", inheritedFrom: "ai" },
                  { name: "导出考试PDF", code: "paper:export", inheritedFrom: "advanced" },
                  { name: "查看答卷详情", code: "paper:view-result", inheritedFrom: "base" }
                ]
              },
              {
                name: "课件与实验",
                itemCount: 4,
                tags: [
                  { name: "上传实训课件", code: "courseware:upload", inheritedFrom: "base" },
                  { name: "分发沙箱镜像", code: "sandbox:distribute", inheritedFrom: "advanced" },
                  { name: "监控GPU算力消耗", code: "sandbox:gpu-monitor", inheritedFrom: "ai" },
                  { name: "一键重置沙箱环境", code: "sandbox:reset", inheritedFrom: "advanced" }
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  {
    code: "user",
    name: "学生端 (user)",
    description: "实训沙箱编译研发、AI智能助手对话、项目开发与竞赛提交大盘。",
    modules: [
      {
        name: "实训研习空间",
        code: "workspace",
        itemCount: 10,
        primaries: [
          {
            name: "核心学堂",
            itemCount: 6,
            subCategories: [
              {
                name: "项目开发",
                itemCount: 3,
                tags: [
                  { name: "拉取实训模板", code: "project:clone", inheritedFrom: "base" },
                  { name: "在线IDE调试", code: "project:ide-run", inheritedFrom: "base" },
                  { name: "提交结课代码", code: "project:submit", inheritedFrom: "base" }
                ]
              },
              {
                name: "AI沙箱研习",
                itemCount: 3,
                tags: [
                  { name: "调用大模型API", code: "ai:llm-call", inheritedFrom: "ai" },
                  { name: "挂载矢量数据库", code: "ai:rag-mount", inheritedFrom: "ai" },
                  { name: "部署个人Agent", code: "ai:agent-deploy", inheritedFrom: "ai" }
                ]
              }
            ]
          },
          {
            name: "考核与竞赛",
            itemCount: 4,
            subCategories: [
              {
                name: "考试测评",
                itemCount: 2,
                tags: [
                  { name: "开启在线测验", code: "exam:start", inheritedFrom: "base" },
                  { name: "实时保存草稿", code: "exam:save-draft", inheritedFrom: "base" }
                ]
              },
              {
                name: "竞赛平台",
                itemCount: 2,
                tags: [
                  { name: "加入天梯赛道", code: "contest:join", inheritedFrom: "advanced" },
                  { name: "提交预测文件CSV", code: "contest:submit-csv", inheritedFrom: "advanced" }
                ]
              }
            ]
          }
        ]
      }
    ]
  }
];

export default function AdminPermissionsPage() {
  const [platforms] = useState<PlatformConfig[]>(initialPlatforms);
  const [selectedPlatformCode, setSelectedPlatformCode] = useState<string>("operation");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Interactive package inheritance toggles
  const [includeBase, setIncludeBase] = useState(true);
  const [includeAdvanced, setIncludeAdvanced] = useState(true);
  const [includeAI, setIncludeAI] = useState(true);

  // Policy Rule Drawer State
  const [showDrawer, setShowDrawer] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopyHash = () => {
    navigator.clipboard.writeText("sha256:d8c0b556f8f53a4e9b921350a41d92bf3ee2268cdbf5f0ab22c95e1e1276a66a");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const activePlatform = platforms.find(p => p.code === selectedPlatformCode) || platforms[0];

  // Tag filter logic
  const isTagVisible = (tag: PermissionTag) => {
    // 1. Package inheritance filter
    if (tag.inheritedFrom === "base" && !includeBase) return false;
    if (tag.inheritedFrom === "advanced" && !includeAdvanced) return false;
    if (tag.inheritedFrom === "ai" && !includeAI) return false;

    // 2. Search query filter
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      return tag.name.toLowerCase().includes(q) || tag.code.toLowerCase().includes(q);
    }
    return true;
  };

  return (
    <div className="flex-1 bg-[#f5f6f8] flex flex-col min-h-0 text-neutral-800 font-sans pt-0 px-6 pb-6 space-y-4">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0 pt-2">
        <div>
          <h1 className="text-xl font-black text-[#0f172a] flex items-center gap-2.5">
            <Key className="w-6 h-6 text-[#fa541c]" />
            <span>权限分配</span>
          </h1>
          <p className="text-xs text-neutral-body mt-1">
            定义平台在不同应用端边界的物理特权与细分操作点，通过套餐与附加功能包进行自动装配与动态继承。
          </p>
        </div>

        {/* Action Button & Platform Badge */}
        <div className="flex items-center gap-3">
          <span className="text-[10px] text-gray-500 font-mono bg-white border border-neutral-200 px-3 py-1.5 rounded-lg shadow-3xs">
            🔒 RBAC 动态策略继承保护
          </span>
          <button
            onClick={() => setShowDrawer(true)}
            className="px-3.5 py-1.5 bg-[#fa541c] hover:bg-[#e84a15] text-white text-xs font-bold rounded-full shadow-3xs flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Shield className="w-3.5 h-3.5" />
            <span>查看边界规则</span>
          </button>
        </div>
      </div>

      {/* Yellow Warning Banner - exact match to Image 1 */}
      <div className="bg-[#fffbe6] border border-[#ffe58f] rounded-xl p-4 flex items-start gap-3 shrink-0 shadow-3xs animate-in fade-in slide-in-from-top-2 duration-200">
        <AlertCircle className="w-4 h-4 text-[#faad14] shrink-0 mt-0.5" />
        <div className="text-xs text-[#d4380d] font-medium leading-relaxed">
          当前角色权限动态继承自租户套餐与附加包及当前平台边界，不支持手动编辑。
        </div>
      </div>

      {/* Main Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 flex-1 min-h-0">
        
        {/* Left Interactive Control Panel */}
        <div className="lg:col-span-1 flex flex-col gap-6 shrink-0">
          
          {/* Platform boundary controller */}
          <div className="bg-white p-5 rounded-xl border border-neutral-border shadow-3xs flex flex-col space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <span className="text-xs font-black text-neutral-title flex items-center gap-1.5">
                <Settings className="w-4 h-4 text-[#fa541c]" />
                <span>当前系统平台</span>
              </span>
              <span className="text-[10px] bg-[#fff2e8] text-[#fa541c] px-2 py-0.5 rounded-full font-bold">
                {selectedPlatformCode}
              </span>
            </div>
            
            <p className="text-[11px] text-neutral-body leading-normal">
              选择需要查看的物理端架构边界。不同端具有完全不同的基础菜单以及数据操作边界。
            </p>

            <div className="space-y-2">
              {platforms.map(plat => (
                <button
                  key={plat.code}
                  onClick={() => setSelectedPlatformCode(plat.code)}
                  className={cn(
                    "w-full px-3 py-3 rounded-lg border text-left transition-all cursor-pointer block",
                    selectedPlatformCode === plat.code
                      ? "border-[#fa541c] bg-[#fff2e8]/25 text-[#fa541c] font-bold"
                      : "border-gray-200 text-neutral-body bg-transparent hover:bg-neutral-50 hover:text-neutral-title"
                  )}
                >
                  <span className="text-xs block">{plat.name}</span>
                  <span className="text-[9.5px] text-neutral-caption block mt-1 font-normal leading-normal line-clamp-2">
                    {plat.description}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Package & Addons Simulator */}
          <div className="bg-white p-5 rounded-xl border border-neutral-border shadow-3xs flex flex-col space-y-4">
            <span className="text-xs font-black text-neutral-title flex items-center gap-1.5 pb-2 border-b border-gray-100">
              <Cpu className="w-4 h-4 text-[#fa541c]" />
              <span>租户套餐与附加包</span>
            </span>

            <p className="text-[11px] text-neutral-body leading-normal">
              通过勾选模拟继承不同的功能包，右侧的权限标签会高亮或动态显示，模拟生产环境策略链继承。
            </p>

            <div className="space-y-3 pt-1">
              <label className="flex items-center gap-2.5 cursor-pointer text-xs text-neutral-title font-semibold">
                <input
                  type="checkbox"
                  checked={includeBase}
                  onChange={(e) => setIncludeBase(e.target.checked)}
                  className="rounded text-[#fa541c] focus:ring-[#fa541c] border-gray-300 w-3.5 h-3.5"
                />
                <span>基础套餐 (Base Spec)</span>
              </label>

              <label className="flex items-center gap-2.5 cursor-pointer text-xs text-neutral-title font-semibold">
                <input
                  type="checkbox"
                  checked={includeAdvanced}
                  onChange={(e) => setIncludeAdvanced(e.target.checked)}
                  className="rounded text-[#fa541c] focus:ring-[#fa541c] border-gray-300 w-3.5 h-3.5"
                />
                <span>高级运维包 (Advanced Ops)</span>
              </label>

              <label className="flex items-center gap-2.5 cursor-pointer text-xs text-neutral-title font-semibold">
                <input
                  type="checkbox"
                  checked={includeAI}
                  onChange={(e) => setIncludeAI(e.target.checked)}
                  className="rounded text-[#fa541c] focus:ring-[#fa541c] border-gray-300 w-3.5 h-3.5"
                />
                <span>AI Agent算力扩容包</span>
              </label>
            </div>
          </div>

          {/* Quick Search */}
          <div className="bg-white p-4 rounded-xl border border-neutral-border shadow-3xs flex flex-col space-y-2">
            <span className="text-xs font-black text-neutral-title">权限名/编码查找</span>
            <div className="relative">
              <input
                type="text"
                placeholder="键入关键字..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs border border-gray-200 rounded-full pl-8 pr-3 py-2 bg-neutral-bg focus:border-[#fa541c] focus:ring-1 focus:ring-[#fa541c] outline-none transition-colors"
              />
              <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-3" />
            </div>
          </div>

        </div>

        {/* Right Permission Tree Display Panel */}
        <div className="lg:col-span-3 flex flex-col min-h-0 bg-white p-6 rounded-xl border border-neutral-border shadow-3xs overflow-y-auto custom-scrollbar">
          
          {/* Header block with platform details */}
          <div className="flex items-center justify-between pb-4 border-b border-gray-100 shrink-0">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-neutral-title">当前平台：</span>
              <span className="text-xs font-semibold bg-gray-100 px-3 py-1 rounded-md text-neutral-body border border-gray-200">
                {activePlatform.code}
              </span>
            </div>
            
            <div className="flex items-center gap-1.5 text-[10px] text-neutral-caption font-semibold">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>策略引擎就绪</span>
            </div>
          </div>

          {/* Root Content matching Image 1 perfectly */}
          <div className="mt-6 flex-1 space-y-6">
            
            {activePlatform.modules.map((module) => (
              <div key={module.code} className="space-y-6">
                
                {/* Module Level Header */}
                <div className="flex items-center justify-between bg-[#f8fafc] border border-gray-100 p-4 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#fff2e8] flex items-center justify-center text-[#fa541c] border border-[#ffbb96]/45">
                      <Layers className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-black text-[#0f172a] text-sm block">{module.name}</span>
                      <span className="text-[10px] text-neutral-caption block font-mono mt-0.5">{module.code}</span>
                    </div>
                  </div>
                  
                  {/* Total counter on the far right */}
                  <span className="text-xs font-mono font-black bg-gray-100 border text-neutral-body px-2.5 py-1 rounded-md">
                    {module.itemCount} 项
                  </span>
                </div>

                {/* Primary Category Level */}
                <div className="pl-2 space-y-6">
                  {module.primaries.map((primary, pIdx) => (
                    <div key={pIdx} className="space-y-4">
                      
                      {/* Primary Header */}
                      <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                        <span className="text-xs font-black text-neutral-title flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#fa541c]" />
                          {primary.name}
                        </span>
                        
                        <span className="text-[10px] font-mono font-bold text-gray-500 bg-gray-50 border px-2 py-0.5 rounded">
                          {primary.itemCount} 项
                        </span>
                      </div>

                      {/* Sub Category Level */}
                      <div className="pl-4 space-y-4">
                        {primary.subCategories.map((sub, sIdx) => {
                          // Filter tags dynamically
                          const visibleTags = sub.tags.filter(isTagVisible);
                          const totalFiltered = visibleTags.length;

                          return (
                            <div key={sIdx} className="grid grid-cols-1 md:grid-cols-12 gap-3 items-start py-2.5 hover:bg-neutral-50/20 rounded-lg px-2 transition-colors">
                              
                              {/* Subtitle name & Sub count */}
                              <div className="md:col-span-3 flex items-center justify-between md:justify-start gap-2 pt-0.5 select-none">
                                <span className="text-xs font-bold text-neutral-body pl-2">
                                  {sub.name}
                                </span>
                                <span className="text-[9.5px] font-mono text-neutral-caption font-semibold border border-dashed border-gray-200 px-1.5 py-0.2 rounded shrink-0">
                                  {sub.itemCount} 项
                                </span>
                              </div>

                              {/* Tags Collection (exact match to Orange/Peach color badges) */}
                              <div className="md:col-span-9 flex flex-wrap gap-2.5">
                                {totalFiltered === 0 ? (
                                  <span className="text-[10px] text-gray-400 italic">
                                    暂无符合套餐继承或筛选条件的权限项
                                  </span>
                                ) : (
                                  visibleTags.map((tag, tIdx) => (
                                    <div
                                      key={tIdx}
                                      className={cn(
                                        "px-3 py-1.5 rounded-full text-xs font-bold transition-all shadow-3xs flex items-center gap-1 select-none",
                                        "bg-[#fff2e8] text-[#fa541c] hover:bg-[#ffe7d6]/80 hover:text-[#d4380d] border border-[#ffbb96]/30",
                                        tag.inheritedFrom === "ai" && "border-indigo-200 bg-indigo-50/50 text-indigo-600 hover:bg-indigo-100/50 hover:text-indigo-800",
                                        tag.inheritedFrom === "advanced" && "border-amber-200 bg-amber-50/40 text-amber-600 hover:bg-amber-100/50 hover:text-amber-800"
                                      )}
                                      title={`对应代码: ${tag.code}\n继承来源: ${tag.inheritedFrom === "base" ? "基础套餐" : tag.inheritedFrom === "advanced" ? "高级运维包" : "AI算力包"}`}
                                    >
                                      <span>{tag.name}</span>
                                      {tag.inheritedFrom === "ai" && <Cpu className="w-3 h-3 text-indigo-400 shrink-0" />}
                                      {tag.inheritedFrom === "advanced" && <Settings className="w-3 h-3 text-amber-400 shrink-0" />}
                                    </div>
                                  ))
                                )}
                              </div>

                            </div>
                          );
                        })}
                      </div>

                    </div>
                  ))}
                </div>

              </div>
            ))}

          </div>

        </div>

      </div>

      {/* Slide-over Drawer for Boundary Policy Information - styling matches Teacher Questions drawer */}
      {showDrawer && (
        <div 
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-[2px] flex justify-end animate-fade-in"
          onClick={() => setShowDrawer(false)}
        >
          <div 
            className="bg-white w-full max-w-[500px] h-screen flex flex-col shadow-2xl border-l border-neutral-100 animate-in slide-in-from-right duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer Header */}
            <div className="px-6 py-4 border-b border-[#f5f5f5] flex justify-between items-center bg-[#fafafa]">
              <h2 className="text-[15px] font-bold text-neutral-800 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-[#fa541c]" />
                <span>RBAC 动态特权继承边界规范</span>
              </h2>
              <button 
                onClick={() => setShowDrawer(false)}
                className="text-neutral-400 hover:text-[#fa541c] p-1.5 hover:bg-neutral-100 rounded-full transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Drawer Body - Content Container */}
            <div className="p-6 overflow-y-auto space-y-5 custom-scrollbar flex-1 bg-white text-xs leading-relaxed text-neutral-body">
              
              <div className="bg-[#f8fafc] border border-gray-100 rounded-xl p-4 flex gap-3">
                <Lock className="w-4 h-4 text-[#fa541c] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-[#0f172a] block">系统角色权限锁定说明</span>
                  <p className="mt-1 text-[11px]">
                    根据平台安全性规定，为了防止全局权限混乱和非法越权行为，所有角色（如“超级管理员”、“运维经理”）的细分操作特权，全由底层**租户配置套餐**静态隔离和**附加增值包**动态注入决定。
                  </p>
                </div>
              </div>

              {/* Section 1: Policy Pipeline */}
              <div className="space-y-3">
                <span className="font-black text-[#0f172a] block text-xs border-b pb-2">策略管道装配拓扑</span>
                
                <div className="space-y-2 pt-1 font-medium">
                  <div className="flex items-start gap-2 bg-neutral-50 p-2.5 rounded-lg">
                    <span className="w-4 h-4 rounded-full bg-[#fa541c]/15 text-[#fa541c] flex items-center justify-center text-[10px] shrink-0 mt-0.5 font-bold">1</span>
                    <div>
                      <span className="text-[#0f172a] block font-bold">基础边界拦截</span>
                      <p className="text-[10px] text-neutral-caption mt-0.5">根据选择物理访问的子平台端（运营端/教师端/学生端）注入对应的物理功能菜单集。</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 bg-neutral-50 p-2.5 rounded-lg">
                    <span className="w-4 h-4 rounded-full bg-[#fa541c]/15 text-[#fa541c] flex items-center justify-center text-[10px] shrink-0 mt-0.5 font-bold">2</span>
                    <div>
                      <span className="text-[#0f172a] block font-bold">套餐授权静态装配</span>
                      <p className="text-[10px] text-neutral-caption mt-0.5">读取租户订购合同，装配如基础用户管理、项目创建、普通考核等静态基础权限点。</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 bg-neutral-50 p-2.5 rounded-lg">
                    <span className="w-4 h-4 rounded-full bg-[#fa541c]/15 text-[#fa541c] flex items-center justify-center text-[10px] shrink-0 mt-0.5 font-bold">3</span>
                    <div>
                      <span className="text-[#0f172a] block font-bold">增值算力/Agent附加包装载</span>
                      <p className="text-[10px] text-neutral-caption mt-0.5">如订购大模型扩容算力或高级审计插件，动态热插拔式激活高级特权与大模型微调特权标签。</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 2: YAML policy viewer */}
              <div className="space-y-2">
                <div className="flex items-center justify-between border-b pb-2">
                  <span className="font-black text-[#0f172a] block text-xs">实时策略编译 YAML</span>
                  <button
                    onClick={handleCopyHash}
                    className="text-[10px] text-[#fa541c] hover:underline flex items-center gap-1 cursor-pointer font-bold"
                  >
                    {copied ? "已复制！" : "复制指纹"}
                  </button>
                </div>

                <pre className="bg-[#1e293b] text-emerald-400 p-4 rounded-xl font-mono text-[10px] leading-normal overflow-x-auto shadow-inner">
{`# ZhiYun Platform Security Boundary Policy
apiVersion: security.zhiyun.com/v1alpha1
kind: TenantPolicyBoundary
metadata:
  name: dynamic-inherit-operation
  namespace: zhiyun-security-core
  lockTimestamp: "2026-05-29T16:54:26Z"
  policyHash: "sha256:d8c0b556f8f53a4..."
spec:
  platformBoundary: "operation"
  allowOverride: false
  inheritance:
    packages:
      - name: "ZhiYun Base Package"
        priority: 100
        active: ${includeBase}
      - name: "ZhiYun Advanced Ops Package"
        priority: 200
        active: ${includeAdvanced}
      - name: "AI Agent Compute Pack"
        priority: 300
        active: ${includeAI}
  lockRule: "InheritedFromTenantBilling"`}
                </pre>
              </div>

              {/* Section 3: Technical Details Table */}
              <div className="space-y-3">
                <span className="font-black text-[#0f172a] block text-xs border-b pb-2">技术参数明细</span>
                
                <div className="border border-gray-100 rounded-lg overflow-hidden">
                  <table className="w-full text-left border-collapse text-[10px]">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 font-bold">
                        <th className="p-2 border-r border-gray-100">参数名</th>
                        <th className="p-2">数值</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 font-medium">
                      <tr>
                        <td className="p-2 border-r border-gray-100 text-gray-500 font-bold bg-neutral-50/50">当前物理端</td>
                        <td className="p-2 text-[#0f172a] font-mono">{selectedPlatformCode}</td>
                      </tr>
                      <tr>
                        <td className="p-2 border-r border-gray-100 text-gray-500 font-bold bg-neutral-50/50">已激活权限数</td>
                        <td className="p-2 text-[#0f172a] font-mono">
                          {
                            activePlatform.modules.reduce((acc, mod) => {
                              return acc + mod.primaries.reduce((pAcc, pri) => {
                                return pAcc + pri.subCategories.reduce((sAcc, sub) => {
                                  return sAcc + sub.tags.filter(isTagVisible).length;
                                }, 0);
                              }, 0);
                            }, 0)
                          } / {activePlatform.modules[0].itemCount} 项
                        </td>
                      </tr>
                      <tr>
                        <td className="p-2 border-r border-gray-100 text-gray-500 font-bold bg-neutral-50/50">编译模式</td>
                        <td className="p-2 text-emerald-600 font-bold">Static-Compile-Only</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

            </div>

            {/* Drawer Footer */}
            <div className="p-5 border-t border-[#f5f5f5] bg-[#fafafa] flex items-center justify-end gap-3 shrink-0">
              <button
                onClick={() => setShowDrawer(false)}
                className="px-5 py-2 bg-white hover:bg-neutral-100 border border-neutral-200 rounded-lg text-xs font-bold text-neutral-700 cursor-pointer shadow-3xs transition-colors h-9"
              >
                关闭
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
