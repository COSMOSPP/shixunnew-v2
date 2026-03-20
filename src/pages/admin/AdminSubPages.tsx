import React from "react";
import AdminStandardPage from "./AdminStandardPage";
import { Shield, FileText, Search, Server, Database, CreditCard, Cloud, Laptop, Key, Clock, Network, List, Activity, Users, Settings } from "lucide-react";

// Security
export const SecurityPolicies = () => <AdminStandardPage title="策略管理" description="管理安全防护策略" primaryAction="新建策略" stats={[{ title: "活跃策略", value: "45", icon: Shield }]} columns={["策略名称", "类型", "状态"]} data={[["DDoS防护", "网络安全", "启用"]]} />;
export const SecurityVulnerabilities = () => <AdminStandardPage title="漏洞扫描" description="系统漏洞扫描与修复" primaryAction="立即扫描" stats={[{ title: "未修复漏洞", value: "12", icon: Search }]} columns={["漏洞名称", "等级", "状态"]} data={[["OpenSSL CVE-2026-xxx", "高危", "待修复"]]} />;
export const SecurityLogs = () => <AdminStandardPage title="审计日志" description="系统安全审计日志" primaryAction="导出日志" stats={[{ title: "今日日志", value: "1.2k", icon: FileText }]} columns={["操作人", "动作", "时间"]} data={[["admin", "修改策略", "2026-03-18 10:00"]]} />;

// Public Cloud
export const PublicCloudInstances = () => <AdminStandardPage title="实例管理" description="公有云计算实例管理" primaryAction="创建实例" stats={[{ title: "运行中实例", value: "342", icon: Server }]} columns={["实例ID", "规格", "状态"]} data={[["i-8s9d7f2a", "4C16G", "运行中"]]} />;
export const PublicCloudStorage = () => <AdminStandardPage title="存储管理" description="云盘与对象存储管理" primaryAction="创建存储" stats={[{ title: "总容量", value: "45TB", icon: Database }]} columns={["存储卷", "类型", "容量"]} data={[["disk-01", "SSD", "500GB"]]} />;
export const PublicCloudBilling = () => <AdminStandardPage title="账单中心" description="云资源费用统计" primaryAction="充值" stats={[{ title: "本月消费", value: "¥45,230", icon: CreditCard }]} columns={["账单周期", "金额", "状态"]} data={[["2026-03", "¥45,230", "已出账"]]} />;

// Private Cloud
export const PrivateCloudNodes = () => <AdminStandardPage title="节点管理" description="物理计算节点管理" primaryAction="添加节点" stats={[{ title: "在线节点", value: "45", icon: Server }]} columns={["节点名称", "IP", "状态"]} data={[["node-01", "10.0.0.11", "在线"]]} />;
export const PrivateCloudVMs = () => <AdminStandardPage title="虚拟机" description="私有云虚拟机管理" primaryAction="创建虚拟机" stats={[{ title: "运行中", value: "892", icon: Cloud }]} columns={["VM名称", "宿主机", "状态"]} data={[["vm-web-01", "node-01", "运行中"]]} />;
export const PrivateCloudClusters = () => <AdminStandardPage title="存储集群" description="分布式存储集群管理" primaryAction="添加集群" stats={[{ title: "健康集群", value: "12", icon: Database }]} columns={["集群名称", "容量", "状态"]} data={[["ceph-cluster-1", "100TB", "健康"]]} />;

// IT
export const ITAssets = () => <AdminStandardPage title="资产登记" description="企业IT硬件资产登记" primaryAction="资产入库" stats={[{ title: "设备总数", value: "1,204", icon: Laptop }]} columns={["资产编号", "类型", "状态"]} data={[["IT-2026-001", "MacBook Pro", "使用中"]]} />;
export const ITLicenses = () => <AdminStandardPage title="软件授权" description="商业软件License管理" primaryAction="采购授权" stats={[{ title: "有效授权", value: "450", icon: Key }]} columns={["软件名称", "授权数", "到期时间"]} data={[["Office 365", "500", "2027-01-01"]]} />;
export const ITTickets = () => <AdminStandardPage title="工单处理" description="IT服务支持工单" primaryAction="新建工单" stats={[{ title: "待处理", value: "12", icon: Clock }]} columns={["工单号", "问题描述", "状态"]} data={[["T-1001", "网络连接失败", "处理中"]]} />;

// IP
export const IPSubnets = () => <AdminStandardPage title="子网管理" description="网络子网划分与管理" primaryAction="添加子网" stats={[{ title: "子网数", value: "24", icon: Network }]} columns={["网段", "用途", "可用IP"]} data={[["192.168.1.0/24", "办公网", "253"]]} />;
export const IPAllocations = () => <AdminStandardPage title="IP分配" description="静态IP地址分配记录" primaryAction="分配IP" stats={[{ title: "已分配", value: "2,104", icon: List }]} columns={["IP地址", "设备", "状态"]} data={[["192.168.1.10", "打印机", "已分配"]]} />;
export const IPConflicts = () => <AdminStandardPage title="冲突检测" description="IP地址冲突与异常检测" primaryAction="立即扫描" stats={[{ title: "冲突告警", value: "0", icon: Activity }]} columns={["冲突IP", "MAC1", "MAC2"]} data={[]} />;

// Permissions
export const PermissionsUsers = () => <AdminStandardPage title="用户管理" description="系统用户账号管理" primaryAction="添加用户" stats={[{ title: "总用户", value: "8,432", icon: Users }]} columns={["用户名", "部门", "状态"]} data={[["zhangsan", "研发部", "正常"]]} />;
export const PermissionsRoles = () => <AdminStandardPage title="角色管理" description="RBAC角色权限配置" primaryAction="新建角色" stats={[{ title: "角色数", value: "24", icon: Key }]} columns={["角色名称", "描述", "用户数"]} data={[["管理员", "系统完全控制权限", "5"]]} />;
export const PermissionsPolicies = () => <AdminStandardPage title="策略配置" description="细粒度访问控制策略" primaryAction="新建策略" stats={[{ title: "策略数", value: "156", icon: Shield }]} columns={["策略名称", "资源", "动作"]} data={[["Allow-Read-Logs", "日志", "读取"]]} />;

// System
export const SystemConfig = () => <AdminStandardPage title="基础配置" description="系统全局参数配置" primaryAction="保存配置" stats={[{ title: "配置项", value: "86", icon: Settings }]} columns={["配置键", "配置值", "说明"]} data={[["SITE_NAME", "AI Studio", "站点名称"]]} />;
export const SystemCron = () => <AdminStandardPage title="定时任务" description="后台自动化任务管理" primaryAction="添加任务" stats={[{ title: "活跃任务", value: "15", icon: Clock }]} columns={["任务名称", "Cron表达式", "状态"]} data={[["数据备份", "0 2 * * *", "启用"]]} />;
export const SystemLogs = () => <AdminStandardPage title="系统日志" description="系统运行与错误日志" primaryAction="清空日志" stats={[{ title: "错误日志", value: "2", icon: FileText }]} columns={["级别", "模块", "时间"]} data={[["ERROR", "Database", "2026-03-18 10:05"]]} />;
