import React, { useState } from "react";
import { 
  Users, Plus, Search, CheckCircle, X, Trash2, Edit, Lock, Unlock 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// --- Interfaces ---
interface ContactInfo {
  name: string;
  phone: string;
  email: string;
}

interface Tenant {
  id: string;
  name: string;
  code: string;
  mainAccount: string;
  contact: ContactInfo;
  status: "正常" | "已停用";
  lastUpdated: string;
}

// --- Initial Mock Data matching Image 2 exactly ---
const initialTenants: Tenant[] = [
  {
    id: "tenant-1",
    name: "实训",
    code: "shixun",
    mainAccount: "lw18751836671",
    contact: {
      name: "刘伟",
      phone: "18751836671",
      email: "lw18751836671@163.com"
    },
    status: "正常",
    lastUpdated: "4 天前"
  },
  {
    id: "tenant-2",
    name: "南京大区测试租户",
    code: "nj-test",
    mainAccount: "test",
    contact: {
      name: "未设置联系人",
      phone: "12328883888",
      email: "test@example.com"
    },
    status: "正常",
    lastUpdated: "21 天前"
  },
  {
    id: "tenant-3",
    name: "NEXUS管理",
    code: "nexus-manage",
    mainAccount: "nexusmanage",
    contact: {
      name: "nexus-manage",
      phone: "未设置手机号",
      email: "nexus-manage@ideal.com"
    },
    status: "正常",
    lastUpdated: "大约 1 个月前"
  },
  {
    id: "tenant-4",
    name: "理想南京研发中心",
    code: "ideal-nj",
    mainAccount: "songzhizong",
    contact: {
      name: "宋志宗",
      phone: "18256928780",
      email: "zzsong91@163.com"
    },
    status: "正常",
    lastUpdated: "21 天前"
  }
];

export default function AdminTenantsPage() {
  const [tenants, setTenants] = useState<Tenant[]>(initialTenants);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Toast Alert Notification state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Drawer / Modal Forms control state
  const [showDrawer, setShowDrawer] = useState(false);
  const [drawerMode, setDrawerMode] = useState<"create" | "edit">("create");
  const [editingTenantId, setEditingTenantId] = useState<string | null>(null);

  // Form Fields
  const [formName, setFormName] = useState("");
  const [formCode, setFormCode] = useState("");
  const [formMainAccount, setFormMainAccount] = useState("");
  const [formContactName, setFormContactName] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formStatus, setFormStatus] = useState<"正常" | "已停用">("正常");

  // Trigger Toast Helper
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // --- Handlers ---
  const handleOpenCreateDrawer = () => {
    setDrawerMode("create");
    setEditingTenantId(null);
    setFormName("");
    setFormCode("");
    setFormMainAccount("");
    setFormContactName("");
    setFormPhone("");
    setFormEmail("");
    setFormStatus("正常");
    setShowDrawer(true);
  };

  const handleOpenEditDrawer = (tenant: Tenant) => {
    setDrawerMode("edit");
    setEditingTenantId(tenant.id);
    setFormName(tenant.name);
    setFormCode(tenant.code);
    setFormMainAccount(tenant.mainAccount);
    setFormContactName(tenant.contact.name);
    setFormPhone(tenant.contact.phone);
    setFormEmail(tenant.contact.email);
    setFormStatus(tenant.status);
    setShowDrawer(true);
  };

  const handleSaveTenant = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formCode.trim()) return;

    if (drawerMode === "create") {
      const newTenant: Tenant = {
        id: `tenant-${Date.now()}`,
        name: formName,
        code: formCode,
        mainAccount: formMainAccount || "admin",
        contact: {
          name: formContactName || "未设置联系人",
          phone: formPhone || "未设置手机号",
          email: formEmail || "未设置邮箱"
        },
        status: formStatus,
        lastUpdated: "刚刚"
      };

      setTenants([newTenant, ...tenants]);
      triggerToast(`🎉 成功创建配置租户「${formName}」`);
    } else if (drawerMode === "edit" && editingTenantId) {
      setTenants(tenants.map(t => 
        t.id === editingTenantId 
          ? {
              ...t,
              name: formName,
              code: formCode,
              mainAccount: formMainAccount,
              contact: {
                name: formContactName,
                phone: formPhone,
                email: formEmail
              },
              status: formStatus,
              lastUpdated: "刚刚"
            }
          : t
      ));
      triggerToast(`💾 成功保存租户「${formName}」配置更新`);
    }

    setShowDrawer(false);
  };

  const handleDeleteTenant = (id: string, name: string) => {
    if (window.confirm(`⚠️ 您确定要永久注销并删除租户「${name}」吗？\n此操作将擦除该租户下的所有实训镜像、用户数据且不可恢复。`)) {
      setTenants(tenants.filter(t => t.id !== id));
      triggerToast(`🗑️ 已永久注销并注销租户账户：「${name}」`);
    }
  };

  const handleToggleStatus = (tenant: Tenant) => {
    const nextStatus = tenant.status === "正常" ? "已停用" : "正常";
    setTenants(tenants.map(t => 
      t.id === tenant.id ? { ...t, status: nextStatus, lastUpdated: "刚刚" } : t
    ));
    triggerToast(nextStatus === "已停用" ? `🔒 已停用并关停「${tenant.name}」的所有子账号登录` : `✅ 已重新开通并激活「${tenant.name}」`);
  };

  // --- Real-time queries for render ---
  const filteredTenants = tenants.filter(t => {
    const query = searchQuery.trim().toLowerCase();
    if (query === "") return true;
    return (
      t.name.toLowerCase().includes(query) ||
      t.code.toLowerCase().includes(query) ||
      t.mainAccount.toLowerCase().includes(query) ||
      t.contact.name.toLowerCase().includes(query) ||
      t.contact.phone.includes(query) ||
      t.contact.email.toLowerCase().includes(query)
    );
  });

  return (
    <div className="flex-1 bg-[#f5f6f8] flex flex-col min-h-0 text-neutral-800 font-sans pt-0 px-6 pb-6 space-y-4">
      
      {/* Toast Alert Banner */}
      {toastMessage && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] bg-neutral-900 text-white px-5 py-3.5 rounded-xl shadow-xl flex items-center gap-3 border border-neutral-800 text-xs font-bold animate-in fade-in slide-in-from-top-4 duration-200 select-none">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="flex items-center justify-between shrink-0 pt-2">
        <div>
          <h1 className="text-2xl font-black text-[#0f172a] flex items-center gap-2">
            <span>租户管理</span>
          </h1>
          <p className="text-xs text-neutral-body mt-1">
            管理多租户平台下的租户信息、准入控制和联系人维护
          </p>
        </div>

        {/* Primary Action Button */}
        <button
          onClick={handleOpenCreateDrawer}
          className="bg-[#fa541c] hover:bg-[#e84a15] text-white text-xs font-black px-4 py-2.5 rounded-full flex items-center gap-1.5 shadow-sm transition-all cursor-pointer border-0"
        >
          <Plus className="w-4 h-4 font-black" />
          <span>新建租户</span>
        </button>
      </div>

      {/* Top Capsule Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 shrink-0 pb-1">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            placeholder="搜索手机号/邮箱/租户名称..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs pl-9 pr-4 py-2 border border-gray-200 rounded-full bg-white focus:outline-none focus:border-[#fa541c] focus:ring-1 focus:ring-[#fa541c] transition-all placeholder-gray-400 shadow-3xs"
          />
        </div>
      </div>

      {/* Table Module styled exactly like Teacher Home Course Table */}
      <div className="bg-white rounded-2xl border border-neutral-border shadow-sm overflow-hidden flex-1 flex flex-col min-h-0">
        
        <div className="overflow-x-auto flex-1 custom-scrollbar">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="border-b border-neutral-100 bg-neutral-50/50 text-[13px] text-neutral-600 font-bold select-none">
                <th className="p-4 pl-6 font-medium w-[30%]">租户信息</th>
                <th className="p-4 font-medium w-[35%]">联系人</th>
                <th className="p-4 font-medium w-[15%]">状态</th>
                <th className="p-4 font-medium w-[12%]">最近更新</th>
                <th className="p-4 text-right pr-6 font-medium w-[8%]">操作</th>
              </tr>
            </thead>
            
            <tbody className="divide-y divide-gray-100 font-medium">
              {filteredTenants.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-neutral-caption italic">
                    没有找到符合筛选条件的实训租户账户
                  </td>
                </tr>
              ) : (
                filteredTenants.map((tenant) => (
                  <tr key={tenant.id} className="hover:bg-neutral-50/30 transition-colors group text-[13px]">
                    
                    {/* Column 1: Tenant Details */}
                    <td className="p-4 pl-6">
                      <div className="space-y-1">
                        <div className="font-medium text-neutral-800 group-hover:text-[#fa541c] transition-colors cursor-pointer text-sm">
                          {tenant.name}
                        </div>
                        <div className="text-xs text-neutral-500 font-mono mt-0.5">
                          {tenant.code}
                        </div>
                        <div className="text-[11px] text-neutral-400 font-bold">
                          主账号 {tenant.mainAccount}
                        </div>
                      </div>
                    </td>

                    {/* Column 2: Contact Info */}
                    <td className="p-4 text-neutral-body">
                      <div className="space-y-1">
                        <div className="text-neutral-800 font-medium">
                          <span className={cn(
                            tenant.contact.name === "未设置联系人" ? "text-gray-400" : "text-[#0f172a]"
                          )}>
                            {tenant.contact.name}
                          </span>
                        </div>
                        <div className="text-xs text-neutral-500 font-mono">
                          <span className={cn(
                            tenant.contact.phone === "未设置手机号" ? "text-gray-400" : ""
                          )}>
                            {tenant.contact.phone}
                          </span>
                        </div>
                        <div className="text-xs text-neutral-500 font-mono">
                          {tenant.contact.email}
                        </div>
                      </div>
                    </td>

                    {/* Column 3: Status Badge styled matching TeacherHome */}
                    <td className="p-4">
                      <span className={cn(
                        "px-2 py-0.5 text-[12px] rounded border font-medium inline-block",
                        tenant.status === "正常" 
                          ? "bg-emerald-50 text-emerald-600 border-emerald-200" 
                          : "bg-rose-50 text-rose-600 border-rose-200"
                      )}>
                        {tenant.status}
                      </span>
                    </td>

                    {/* Column 4: Last Updated */}
                    <td className="p-4 text-neutral-500 font-semibold">
                      {tenant.lastUpdated}
                    </td>

                    {/* Column 5: Action inline links directly */}
                    <td className="p-4 text-right pr-6 select-none font-bold text-xs">
                      <div className="flex items-center justify-end gap-3">
                        <button
                          onClick={() => handleOpenEditDrawer(tenant)}
                          className="text-[#fa541c] hover:text-[#e84a15] transition-colors cursor-pointer border-0 bg-transparent p-0"
                        >
                          编辑
                        </button>
                        
                        <button
                          onClick={() => handleToggleStatus(tenant)}
                          className="text-[#fa541c] hover:text-[#e84a15] transition-colors cursor-pointer border-0 bg-transparent p-0"
                        >
                          {tenant.status === "正常" ? "停用" : "启用"}
                        </button>

                        <button
                          onClick={() => handleDeleteTenant(tenant.id, tenant.name)}
                          className="text-[#fa541c] hover:text-[#e84a15] transition-colors cursor-pointer border-0 bg-transparent p-0"
                        >
                          注销删除
                        </button>
                      </div>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="flex items-center justify-end p-4 gap-4 mt-2 border-t border-neutral-100 bg-white select-none shrink-0">
          
          <span className="text-[13px] text-neutral-500">共 {filteredTenants.length} 条</span>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="h-7 w-7 p-0 rounded-sm" disabled>&lt;</Button>
            <Button variant="outline" size="sm" className="h-7 w-7 p-0 rounded-sm bg-[#fa541c] text-white border-[#fa541c]">1</Button>
            <Button variant="outline" size="sm" className="h-7 w-7 p-0 rounded-sm" disabled>&gt;</Button>
          </div>

          <select className="text-[13px] border border-neutral-200 rounded-sm px-2 py-1 focus:outline-none focus:border-[#fa541c] text-neutral-600 bg-white cursor-pointer">
            <option>15 条/页</option>
            <option>30 条/页</option>
            <option>50 条/页</option>
          </select>

        </div>

      </div>

      {/* Slide-over Drawer for Creating/Editing a Tenant - style matched exactly to Teacher Questions drawer */}
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
                <Users className="w-4 h-4 text-[#fa541c]" />
                <span>
                  {drawerMode === "create" ? "开通新实训租户" : "编辑租户参数"}
                </span>
              </h2>
              <button 
                onClick={() => setShowDrawer(false)}
                className="text-neutral-400 hover:text-[#fa541c] p-1.5 hover:bg-neutral-100 rounded-full transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Drawer Content Form */}
            <form onSubmit={handleSaveTenant} className="p-6 overflow-y-auto space-y-5 custom-scrollbar flex-1 bg-white text-xs">
              
              <div className="space-y-2">
                <label className="text-[13px] font-bold text-neutral-800 flex items-center gap-1">
                  <span className="text-[#fa541c]">*</span> 租户单位名称
                </label>
                <input
                  type="text"
                  required
                  placeholder="例如：北京大学信息学院"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full border border-neutral-200 rounded-lg px-3.5 py-2 text-xs focus:outline-none focus:border-[#fa541c] focus:ring-1 focus:ring-[#fa541c] transition-all placeholder:text-neutral-400"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[13px] font-bold text-neutral-800 flex items-center gap-1">
                  <span className="text-[#fa541c]">*</span> 租户唯一标识码
                </label>
                <input
                  type="text"
                  required
                  placeholder="例如：pku-inf"
                  disabled={drawerMode === "edit"}
                  value={formCode}
                  onChange={(e) => setFormCode(e.target.value)}
                  className="w-full border border-neutral-200 rounded-lg px-3.5 py-2 text-xs focus:outline-none focus:border-[#fa541c] focus:ring-1 focus:ring-[#fa541c] transition-all placeholder:text-neutral-400 disabled:bg-gray-100 disabled:text-gray-400"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[13px] font-bold text-neutral-800 flex items-center gap-1">
                  <span className="text-[#fa541c]">*</span> 平台主管理员账号
                </label>
                <input
                  type="text"
                  required
                  placeholder="例如：admin_pku"
                  value={formMainAccount}
                  onChange={(e) => setFormMainAccount(e.target.value)}
                  className="w-full border border-neutral-200 rounded-lg px-3.5 py-2 text-xs focus:outline-none focus:border-[#fa541c] focus:ring-1 focus:ring-[#fa541c] transition-all placeholder:text-neutral-400"
                />
              </div>

              <div className="border-t border-neutral-200/60 my-4 pt-4 space-y-4">
                <span className="font-black text-[#fa541c] block border-l-2 border-[#fa541c] pl-2 text-xs">
                  联系人信息维护
                </span>

                <div className="space-y-2">
                  <label className="text-[13px] font-bold text-neutral-800">联系人姓名</label>
                  <input
                    type="text"
                    placeholder="未设置联系人"
                    value={formContactName}
                    onChange={(e) => setFormContactName(e.target.value)}
                    className="w-full border border-neutral-200 rounded-lg px-3.5 py-2 text-xs focus:outline-none focus:border-[#fa541c] focus:ring-1 focus:ring-[#fa541c] transition-all placeholder:text-neutral-400"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[13px] font-bold text-neutral-800">联系电话手机</label>
                  <input
                    type="text"
                    placeholder="例如：13900000000"
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    className="w-full border border-neutral-200 rounded-lg px-3.5 py-2 text-xs focus:outline-none focus:border-[#fa541c] focus:ring-1 focus:ring-[#fa541c] transition-all placeholder:text-neutral-400"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[13px] font-bold text-neutral-800">联络电子邮箱</label>
                  <input
                    type="email"
                    placeholder="例如：pku@example.com"
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    className="w-full border border-neutral-200 rounded-lg px-3.5 py-2 text-xs focus:outline-none focus:border-[#fa541c] focus:ring-1 focus:ring-[#fa541c] transition-all placeholder:text-neutral-400"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[13px] font-bold text-neutral-800">算力网关状态</label>
                <div className="relative">
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as any)}
                    className="w-full border border-neutral-200 rounded-lg px-3.5 py-2 text-xs appearance-none focus:outline-none focus:border-[#fa541c] focus:ring-1 focus:ring-[#fa541c] bg-white text-neutral-700 transition-all cursor-pointer font-medium"
                  >
                    <option value="正常">正常开启</option>
                    <option value="已停用">封禁停用</option>
                  </select>
                </div>
              </div>

            </form>

            {/* Drawer Footer */}
            <div className="p-5 border-t border-[#f5f5f5] bg-[#fafafa] flex items-center justify-end gap-3 shrink-0">
              <button
                type="button"
                onClick={() => setShowDrawer(false)}
                className="px-5 py-2 bg-white hover:bg-neutral-100 border border-neutral-200 rounded-lg text-xs font-bold text-neutral-700 cursor-pointer shadow-3xs transition-colors h-9"
              >
                取消
              </button>
              <button
                onClick={handleSaveTenant}
                className="px-6 py-2 bg-[#fa541c] hover:bg-[#e84a15] text-white rounded-lg text-xs font-bold cursor-pointer shadow-3xs transition-colors h-9 border-0"
              >
                确认保存
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
