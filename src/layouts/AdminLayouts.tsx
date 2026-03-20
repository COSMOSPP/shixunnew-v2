import AdminSectionLayout from "./AdminSectionLayout";
import { LayoutDashboard, Shield, FileText, Search, Activity, Cloud, Server, Database, CreditCard, Laptop, Key, Clock, Network, Users, Settings, List } from "lucide-react";

export const SecurityLayout = () => (
  <AdminSectionLayout
    title="安全运维"
    menuItems={[
      { title: "概览", icon: LayoutDashboard, href: "/admin/security" },
      { title: "策略管理", icon: Shield, href: "/admin/security/policies" },
      { title: "漏洞扫描", icon: Search, href: "/admin/security/vulnerabilities" },
      { title: "审计日志", icon: FileText, href: "/admin/security/logs" },
    ]}
  />
);

export const PublicCloudLayout = () => (
  <AdminSectionLayout
    title="公有云管理"
    menuItems={[
      { title: "概览", icon: LayoutDashboard, href: "/admin/public-cloud" },
      { title: "实例管理", icon: Server, href: "/admin/public-cloud/instances" },
      { title: "存储管理", icon: Database, href: "/admin/public-cloud/storage" },
      { title: "账单中心", icon: CreditCard, href: "/admin/public-cloud/billing" },
    ]}
  />
);

export const PrivateCloudLayout = () => (
  <AdminSectionLayout
    title="私有云管理"
    menuItems={[
      { title: "概览", icon: LayoutDashboard, href: "/admin/private-cloud" },
      { title: "节点管理", icon: Server, href: "/admin/private-cloud/nodes" },
      { title: "虚拟机", icon: Cloud, href: "/admin/private-cloud/vms" },
      { title: "存储集群", icon: Database, href: "/admin/private-cloud/clusters" },
    ]}
  />
);

export const ITLayout = () => (
  <AdminSectionLayout
    title="IT 资产管理"
    menuItems={[
      { title: "概览", icon: LayoutDashboard, href: "/admin/it" },
      { title: "资产登记", icon: Laptop, href: "/admin/it/assets" },
      { title: "软件授权", icon: Key, href: "/admin/it/licenses" },
      { title: "工单处理", icon: Clock, href: "/admin/it/tickets" },
    ]}
  />
);

export const IPLayout = () => (
  <AdminSectionLayout
    title="IP 地址管理"
    menuItems={[
      { title: "概览", icon: LayoutDashboard, href: "/admin/ip" },
      { title: "子网管理", icon: Network, href: "/admin/ip/subnets" },
      { title: "IP分配", icon: List, href: "/admin/ip/allocations" },
      { title: "冲突检测", icon: Activity, href: "/admin/ip/conflicts" },
    ]}
  />
);

export const PermissionsLayout = () => (
  <AdminSectionLayout
    title="权限管理"
    menuItems={[
      { title: "概览", icon: LayoutDashboard, href: "/admin/permissions" },
      { title: "用户管理", icon: Users, href: "/admin/permissions/users" },
      { title: "角色管理", icon: Key, href: "/admin/permissions/roles" },
      { title: "策略配置", icon: Shield, href: "/admin/permissions/policies" },
    ]}
  />
);

export const SystemLayout = () => (
  <AdminSectionLayout
    title="系统管理"
    menuItems={[
      { title: "租户管理", icon: Users, href: "/admin/system/tenants" },
      { title: "计费管理", icon: CreditCard, href: "/admin/system/billing" },
      { title: "资源配额", icon: Database, href: "/admin/system/resources" },
      { title: "数据安全", icon: Shield, href: "/admin/system/security" },
      { title: "系统设置", icon: Settings, href: "/admin/system/settings" },
    ]}
  />
);
