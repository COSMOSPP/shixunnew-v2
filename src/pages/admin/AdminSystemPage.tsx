import React, { useState, useEffect, useRef } from "react";
import { 
  Settings, List, Shield, Key, Cloud, Activity, FileText, Search, 
  Plus, Edit, Trash2, Sliders, Play, TrendingUp, BarChart2, Download, 
  Filter, AlertCircle, Check, RefreshCw, X, ChevronRight, Cpu, 
  AlertTriangle, Server, Database, Terminal, ShieldAlert, Copy, RefreshCcw, CheckCircle,
  ChevronDown, Eye, EyeOff, Info, RotateCw
} from "lucide-react";
import { cn } from "@/lib/utils";
import { CustomSelect } from "../teacher/TeacherProjects";
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
  status: "启用" | "禁用";
  createdAt: string;
  resourceTypes?: string[];
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
  hasContainer?: boolean;
  hasVm?: boolean;
  description?: string;
  containerPlugin?: string;
  containerUrl?: string;
  containerJson?: string;
  vmPlugin?: string;
  vmUrl?: string;
  vmJson?: string;
}

// --- Initial Mock Data ---

const initialTags: PlatformTag[] = [
  { id: "tag-1", name: "私有云", tagGroup: "私有云", createdAt: "2026-06-17 01:31:43" },
  { id: "tag-2", name: "公有云", tagGroup: "111", createdAt: "2026-06-17 01:31:34" },
  { id: "tag-3", name: "IT", tagGroup: "IT", createdAt: "2026-06-17 01:31:19" },
  { id: "tag-4", name: "人工智能", tagGroup: "aaa", createdAt: "2026-06-16 07:55:13" },
  { id: "tag-5", name: "AI", tagGroup: "test", createdAt: "2026-06-16 07:03:52" },
  { id: "tag-6", name: "大数据", tagGroup: "分析", createdAt: "2026-06-15 10:24:15" },
  { id: "tag-7", name: "深度学习", tagGroup: "AI", createdAt: "2026-06-15 09:15:30" },
  { id: "tag-8", name: "容器云", tagGroup: "基础设施", createdAt: "2026-06-14 16:40:22" },
  { id: "tag-9", name: "微服务", tagGroup: "架构", createdAt: "2026-06-14 14:20:10" },
  { id: "tag-10", name: "云原生", tagGroup: "基础设施", createdAt: "2026-06-13 11:05:45" },
  { id: "tag-11", name: "DevOps", tagGroup: "研发", createdAt: "2026-06-12 15:30:00" },
  { id: "tag-12", name: "安全防护", tagGroup: "安全", createdAt: "2026-06-11 08:45:12" },
  { id: "tag-13", name: "机器学习", tagGroup: "AI", createdAt: "2026-06-10 17:33:21" },
  { id: "tag-14", name: "强化学习", tagGroup: "AI", createdAt: "2026-06-09 13:12:05" },
  { id: "tag-15", name: "NLP", tagGroup: "AI", createdAt: "2026-06-08 11:22:43" },
  { id: "tag-16", name: "计算机视觉", tagGroup: "AI", createdAt: "2026-06-07 10:14:55" },
  { id: "tag-17", name: "语音识别", tagGroup: "AI", createdAt: "2026-06-06 09:05:11" },
  { id: "tag-18", name: "大语言模型", tagGroup: "AI", createdAt: "2026-06-05 08:00:00" },
  { id: "tag-19", name: "知识图谱", tagGroup: "AI", createdAt: "2026-06-04 16:30:15" },
  { id: "tag-20", name: "智能推荐", tagGroup: "AI", createdAt: "2026-06-03 14:20:10" },
  { id: "tag-21", name: "自动化测试", tagGroup: "研发", createdAt: "2026-06-02 11:15:30" },
  { id: "tag-22", name: "持续集成", tagGroup: "研发", createdAt: "2026-06-01 10:05:45" },
  { id: "tag-23", name: "日志分析", tagGroup: "运维", createdAt: "2026-05-31 09:12:00" },
  { id: "tag-24", name: "性能监控", tagGroup: "运维", createdAt: "2026-05-30 08:45:15" },
  { id: "tag-25", name: "容灾备份", tagGroup: "运维", createdAt: "2026-05-29 07:30:00" }
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
  { id: "plat-1", name: "天翼云资源池", platformType: "ctyun", type: "公有云", pluginId: "c4s33451d4plnhp3zidf", status: "禁用", createdAt: "2026-05-26 15:58" },
  { id: "plat-2", name: "pve", platformType: "proxmox", type: "私有云", pluginId: "private", status: "启用", createdAt: "2025-05-08 15:24" },
  { id: "plat-3", name: "实训云(临时)", platformType: "cloudpods", type: "私有云", pluginId: "private-qsohfH", status: "禁用", createdAt: "2024-12-25 09:28" },
  { id: "plat-4", name: "天翼云", platformType: "ctyun", type: "公有云", pluginId: "se9cyxgrzoj27vt1ijzm", status: "启用", createdAt: "2024-11-23 10:35" },
  { id: "plat-5", name: "kubernetes容器平台", platformType: "kubernetes", type: "容器", pluginId: "h2ahwz1awycagfymsp7cc", status: "启用", createdAt: "2024-04-19 17:29" },
  { id: "plat-6", name: "Ideal实训云", platformType: "cloudpods", type: "私有云", pluginId: "private", status: "启用", createdAt: "2024-04-19 17:29" },
  { id: "plat-7", name: "华为云", platformType: "huawei", type: "公有云", pluginId: "faanhu6yfo2ep84v7kxg4", status: "启用", createdAt: "2024-04-19 17:28" },
  { id: "plat-8", name: "Ceph存储平台", platformType: "ceph", type: "存储", pluginId: "ceph-storage-pool", status: "启用", createdAt: "2026-06-01 10:00" },
  { id: "plat-9", name: "阿里云生产平台", platformType: "aliyun", type: "公有云", pluginId: "ali-prod-gw", status: "启用", createdAt: "2026-06-02 11:30" },
  { id: "plat-10", name: "腾讯云测试平台", platformType: "tencent", type: "公有云", pluginId: "tx-test-gw", status: "禁用", createdAt: "2026-06-03 14:15" },
  { id: "plat-11", name: "VMware集群", platformType: "vmware", type: "私有云", pluginId: "vmware-vsphere", status: "启用", createdAt: "2026-06-04 09:00" },
  { id: "plat-12", name: "NFS存储共享", platformType: "nfs", type: "存储", pluginId: "nfs-share", status: "启用", createdAt: "2026-06-05 16:20" },
  { id: "plat-13", name: "MinIO对象存储", platformType: "minio", type: "存储", pluginId: "minio-oss", status: "启用", createdAt: "2026-06-06 10:45" },
  { id: "plat-14", name: "天翼云专线通道", platformType: "ctyun", type: "公有云", pluginId: "ctyun-direct-line", status: "启用", createdAt: "2026-06-07 11:00" },
  { id: "plat-15", name: "PVE测试环境", platformType: "proxmox", type: "私有云", pluginId: "pve-test-cluster", status: "禁用", createdAt: "2026-06-08 15:30" },
  { id: "plat-16", name: "Kubernetes边缘节点", platformType: "kubernetes", type: "容器", pluginId: "k8s-edge-nodes", status: "启用", createdAt: "2026-06-09 10:15" },
  { id: "plat-17", name: "华为云计算集群", platformType: "huawei", type: "公有云", pluginId: "huawei-compute-node", status: "启用", createdAt: "2026-06-10 14:45" },
  { id: "plat-18", name: "阿里云数据库平台", platformType: "aliyun", type: "公有云", pluginId: "ali-rds-gw", status: "启用", createdAt: "2026-06-11 09:30" },
  { id: "plat-19", name: "腾讯云COS存储", platformType: "tencent", type: "存储", pluginId: "tx-cos-plugin", status: "启用", createdAt: "2026-06-12 16:10" },
  { id: "plat-20", name: "Ceph数据冷备库", platformType: "ceph", type: "存储", pluginId: "ceph-backup-vault", status: "启用", createdAt: "2026-06-13 11:20" },
  { id: "plat-21", name: "K3s轻量容器", platformType: "k3s", type: "容器", pluginId: "k3s-lightweight", status: "启用", createdAt: "2026-06-14 13:50" },
  { id: "plat-22", name: "GlusterFS共享盘", platformType: "glusterfs", type: "存储", pluginId: "gluster-share", status: "启用", createdAt: "2026-06-15 15:40" },
  { id: "plat-23", name: "OpenStack老集群", platformType: "openstack", type: "私有云", pluginId: "openstack-legacy", status: "禁用", createdAt: "2026-06-16 08:30" },
  { id: "plat-24", name: "OpenShift容器开发", platformType: "openshift", type: "容器", pluginId: "openshift-okd", status: "启用", createdAt: "2026-06-17 17:12" },
  { id: "plat-25", name: "VMware开发集群", platformType: "vmware", type: "私有云", pluginId: "vmware-dev-cluster", status: "启用", createdAt: "2026-06-18 10:00" }
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
  { id: "pool-5", name: "ceph", associatedPlugin: "存储", createdAt: "2024-04-19 17:29", ak: "ak-ceph-example", sk: "sk-ceph-example" },
  { id: "pool-6", name: "阿里云ECS资源池", associatedPlugin: "公有云", createdAt: "2026-06-02 11:30", ak: "ak-ali-example", sk: "sk-ali-example" },
  { id: "pool-7", name: "腾讯云CVM资源池", associatedPlugin: "公有云", createdAt: "2026-06-03 14:15", ak: "ak-tx-example", sk: "sk-tx-example" },
  { id: "pool-8", name: "VMware虚拟化集群", associatedPlugin: "私有云", createdAt: "2026-06-04 09:00", ak: "ak-vmware-example", sk: "sk-vmware-example" },
  { id: "pool-9", name: "NFS分布式存储池", associatedPlugin: "存储", createdAt: "2026-06-05 16:20", ak: "ak-nfs-example", sk: "sk-nfs-example" },
  { id: "pool-10", name: "MinIO对象存储池", associatedPlugin: "存储", createdAt: "2026-06-06 10:45", ak: "ak-minio-example", sk: "sk-minio-example" },
  { id: "pool-11", name: "华为云弹性计算池", associatedPlugin: "公有云", createdAt: "2026-06-07 13:50", ak: "ak-hw-example", sk: "sk-hw-example" },
  { id: "pool-12", name: "GlusterFS存储集群", associatedPlugin: "存储", createdAt: "2026-06-08 17:10", ak: "ak-gluster-example", sk: "sk-gluster-example" },
  { id: "pool-13", name: "天翼云物理专区", associatedPlugin: "公有云", createdAt: "2026-06-09 11:00", ak: "ak-cty-phy", sk: "sk-cty-phy" },
  { id: "pool-14", name: "PVE开发测试池", associatedPlugin: "私有云", createdAt: "2026-06-10 15:30", ak: "ak-pve-dev", sk: "sk-pve-dev" },
  { id: "pool-15", name: "IdealPods专属节点", associatedPlugin: "私有云", createdAt: "2026-06-11 09:28", ak: "ak-ideal-pods", sk: "sk-ideal-pods" },
  { id: "pool-16", name: "K8s边缘计算资源池", associatedPlugin: "容器", createdAt: "2026-06-12 10:15", ak: "ak-k8s-edge", sk: "sk-k8s-edge" },
  { id: "pool-17", name: "华为云GPU训练池", associatedPlugin: "公有云", createdAt: "2026-06-13 14:45", ak: "ak-hw-gpu", sk: "sk-hw-gpu" },
  { id: "pool-18", name: "阿里云RDS备用池", associatedPlugin: "公有云", createdAt: "2026-06-14 09:30", ak: "ak-ali-rds", sk: "sk-ali-rds" },
  { id: "pool-19", name: "腾讯云COS冷备池", associatedPlugin: "存储", createdAt: "2026-06-15 16:10", ak: "ak-tx-cos", sk: "sk-tx-cos" },
  { id: "pool-20", name: "Ceph灾备存储池", associatedPlugin: "存储", createdAt: "2026-06-16 11:20", ak: "ak-ceph-dr", sk: "sk-ceph-dr" },
  { id: "pool-21", name: "K3s轻量级容器池", associatedPlugin: "容器", createdAt: "2026-06-17 13:50", ak: "ak-k3s-pool", sk: "sk-k3s-pool" },
  { id: "pool-22", name: "GlusterFS文件库", associatedPlugin: "存储", createdAt: "2026-06-18 15:40", ak: "ak-gluster-lib", sk: "sk-gluster-lib" },
  { id: "pool-23", name: "OpenStack虚拟机池", associatedPlugin: "私有云", createdAt: "2026-06-19 08:30", ak: "ak-op-vm", sk: "sk-op-vm" },
  { id: "pool-24", name: "OpenShift应用池", associatedPlugin: "容器", createdAt: "2026-06-20 17:12", ak: "ak-os-app", sk: "sk-os-app" },
  { id: "pool-25", name: "VMware测试环境池", associatedPlugin: "私有云", createdAt: "2026-06-21 10:00", ak: "ak-vmware-test", sk: "sk-vmware-test" }
];

interface ContainerImage {
  id: string;
  name: string;
  description: string;
  size: string;
  createdAt: string;
  uploadStatus: "已上传" | "上传中" | "未上传";
  syncStatus: "同步成功" | "同步中" | "同步失败";
}

interface VmImage {
  id: string;
  name: string;
  description: string;
  resourceType: string;
  os: string;
  arch?: string;
  size: string;
  createdAt: string;
  uploadStatus: "已上传" | "上传中" | "未上传";
  syncStatus: "同步成功" | "同步中" | "同步失败";
}

const initialContainerImages: ContainerImage[] = [
  { id: "img-c1", name: "fzytest/test001:v1", description: "1", size: "13.9 MB", createdAt: "2025-05-27 17:08", uploadStatus: "已上传", syncStatus: "同步成功" },
  { id: "img-c2", name: "test/test:12", description: "1", size: "13.9 MB", createdAt: "2025-05-27 15:04", uploadStatus: "已上传", syncStatus: "同步成功" },
  { id: "img-c3", name: "bbb/aaa:1", description: "1", size: "13.9 MB", createdAt: "2025-05-27 14:49", uploadStatus: "已上传", syncStatus: "同步成功" },
  { id: "img-c4", name: "12/test001:1", description: "1", size: "237 MB", createdAt: "2025-02-24 19:11", uploadStatus: "已上传", syncStatus: "同步中" },
  { id: "img-c5", name: "traing/node-keeper-co...", description: "容器服务端", size: "237 MB", createdAt: "2024-12-26 17:10", uploadStatus: "已上传", syncStatus: "同步成功" },
  { id: "img-c6", name: "traing/nodekeeper-age...", description: "采集器", size: "52.1 MB", createdAt: "2024-12-25 10:44", uploadStatus: "已上传", syncStatus: "同步失败" },
  { id: "img-c7", name: "lxxxin/config-jsp-webs...", description: "webshell漏洞排查", size: "506 MB", createdAt: "2024-06-11 20:00", uploadStatus: "已上传", syncStatus: "同步成功" },
  { id: "img-c8", name: "lxxxin/mysql-fix:v1", description: "慢SQL排查", size: "521 MB", createdAt: "2024-06-11 17:59", uploadStatus: "已上传", syncStatus: "同步成功" }
];

const initialVmImages: VmImage[] = [
  { id: "img-v1", name: "linux", description: "无", resourceType: "云主机", os: "LINUX", size: "389 MB", createdAt: "2024-11-27 10:49", uploadStatus: "已上传", syncStatus: "同步中" },
  { id: "img-v2", name: "debian", description: "无", resourceType: "云主机", os: "LINUX", size: "388 MB", createdAt: "2024-11-18 17:58", uploadStatus: "已上传", syncStatus: "同步失败" }
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
  const [activeTab, setActiveTab] = useState<"tags" | "roles" | "plugins" | "pools" | "monitor" | "logs" | "images">("tags");

  // --- Reactive Component State Database ---
  const [tags, setTags] = useState<PlatformTag[]>(initialTags);
  const [roles, setRoles] = useState<OperationalRole[]>(initialRoles);
  const [platforms, setPlatforms] = useState<CloudPlatform[]>(initialPlatforms);
  const [pools, setPools] = useState<ResourcePool[]>(initialPools);
  const [systemLogs, setSystemLogs] = useState<SystemLog[]>(initialLogs);

  // --- Image Management State ---
  const [containerImages, setContainerImages] = useState<ContainerImage[]>(initialContainerImages);
  const [vmImages, setVmImages] = useState<VmImage[]>(initialVmImages);
  const [imageSubTab, setImageSubTab] = useState<"container" | "vm">("container");
  const [isRefreshingImages, setIsRefreshingImages] = useState(false);
  const [imageSearchName, setImageSearchName] = useState("");
  const [containerCurrentPage, setContainerCurrentPage] = useState(1);
  const [vmCurrentPage, setVmCurrentPage] = useState(1);
  const imagePageSize = 5;

  // --- Image Upload Modal State ---
  const [uploadImageModalOpen, setUploadImageModalOpen] = useState(false);
  const [uploadImageType, setUploadImageType] = useState<"container" | "vm">("container");
  const [newImageName, setNewImageName] = useState("");
  const [newImageDesc, setNewImageDesc] = useState("");
  const [newImageSize, setNewImageSize] = useState("");
  const [newImageOs, setNewImageOs] = useState("");
  const [newImageResType, setNewImageResType] = useState("");
  const [newImageArch, setNewImageArch] = useState("");
  
  const [newImageNamespace, setNewImageNamespace] = useState("");
  const [newImageVersion, setNewImageVersion] = useState("");
  const [deleteProtection, setDeleteProtection] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isOsDropdownOpen, setIsOsDropdownOpen] = useState(false);
  const [isResTypeDropdownOpen, setIsResTypeDropdownOpen] = useState(false);
  const [isArchDropdownOpen, setIsArchDropdownOpen] = useState(false);

  const osDropdownRef = useRef<HTMLDivElement>(null);
  const resTypeDropdownRef = useRef<HTMLDivElement>(null);
  const archDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (osDropdownRef.current && !osDropdownRef.current.contains(e.target as Node)) {
        setIsOsDropdownOpen(false);
      }
      if (resTypeDropdownRef.current && !resTypeDropdownRef.current.contains(e.target as Node)) {
        setIsResTypeDropdownOpen(false);
      }
      if (archDropdownRef.current && !archDropdownRef.current.contains(e.target as Node)) {
        setIsArchDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  // --- Image Edit Modal State ---
  const [editImageModalOpen, setEditImageModalOpen] = useState(false);
  const [editingImageId, setEditingImageId] = useState<string | null>(null);
  const [editingImageName, setEditingImageName] = useState("");
  const [editingImageDesc, setEditingImageDesc] = useState("");
  const [editingImageSize, setEditingImageSize] = useState("");
  const [editingImageOs, setEditingImageOs] = useState("");
  const [editingImageResType, setEditingImageResType] = useState("");

  // --- Image Sync Logs Modal State ---
  const [imageLogsModalOpen, setImageLogsModalOpen] = useState(false);
  const [selectedImageNameForLogs, setSelectedImageNameForLogs] = useState("");
  const [imageLogs, setImageLogs] = useState<string[]>([]);
  const [activeImageDropdownId, setActiveImageDropdownId] = useState<string | null>(null);

  useEffect(() => {
    const handleGlobalClick = () => {
      setActiveImageDropdownId(null);
    };
    window.addEventListener("click", handleGlobalClick);
    return () => window.removeEventListener("click", handleGlobalClick);
  }, []);

  // --- Image Management Actions ---
  const handleRefreshImages = () => {
    setIsRefreshingImages(true);
    triggerToast("🔄 正在从云平台刷新镜像数据...");
    setTimeout(() => {
      setIsRefreshingImages(false);
      triggerToast("✅ 镜像数据刷新成功！");
    }, 1000);
  };

  const handleSyncImage = (id: string, type: "container" | "vm") => {
    triggerToast("🚀 正在发起镜像同步指令...");
    if (type === "container") {
      setContainerImages(prev => prev.map(img => img.id === id ? { ...img, syncStatus: "同步中" } : img));
      setTimeout(() => {
        setContainerImages(prev => prev.map(img => img.id === id ? { ...img, syncStatus: "同步成功" } : img));
        triggerToast("✅ 容器镜像同步成功！");
      }, 2000);
    } else {
      setVmImages(prev => prev.map(img => img.id === id ? { ...img, syncStatus: "同步中" } : img));
      setTimeout(() => {
        setVmImages(prev => prev.map(img => img.id === id ? { ...img, syncStatus: "同步成功" } : img));
        triggerToast("✅ 虚拟机镜像同步成功！");
      }, 2000);
    }
  };

  const handleDeleteImage = (id: string, name: string, type: "container" | "vm") => {
    setDeleteConfirm({
      show: true,
      title: "删除镜像",
      message: `您确定要永久删除镜像「${name}」吗？删除后此操作不可撤销。`,
      onConfirm: () => {
        if (type === "container") {
          setContainerImages(prev => prev.filter(img => img.id !== id));
        } else {
          setVmImages(prev => prev.filter(img => img.id !== id));
        }
        triggerToast(`🗑️ 已成功删除镜像「${name}」！`);
      }
    });
  };

  const handleSaveUploadedImage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newImageName) return;

    if (uploadImageType === "vm") {
      if (!newImageOs) {
        triggerToast("⚠️ 请选择系统类型");
        return;
      }
      if (!newImageResType) {
        triggerToast("⚠️ 请选择资源类型");
        return;
      }
      if (!newImageArch) {
        triggerToast("⚠️ 请选择系统架构");
        return;
      }
    }

    const sizeFormatted = newImageSize ? `${newImageSize} MB` : "100 MB";
    const currentTime = new Date().toISOString().replace('T', ' ').substring(0, 16);

    if (uploadImageType === "container") {
      const fullName = `${newImageNamespace ? `${newImageNamespace}/` : ''}${newImageName}${newImageVersion ? `:${newImageVersion}` : ''}`;
      const newImg: ContainerImage = {
        id: `img-c-${Date.now()}`,
        name: fullName,
        description: newImageDesc || "无",
        size: sizeFormatted,
        createdAt: currentTime,
        uploadStatus: "已上传",
        syncStatus: "同步成功"
      };
      setContainerImages([newImg, ...containerImages]);
    } else {
      const newImg: VmImage = {
        id: `img-v-${Date.now()}`,
        name: newImageName,
        description: newImageDesc || "无",
        resourceType: newImageResType,
        os: newImageOs,
        arch: newImageArch,
        size: sizeFormatted,
        createdAt: currentTime,
        uploadStatus: "已上传",
        syncStatus: "同步成功"
      };
      setVmImages([newImg, ...vmImages]);
    }

    setUploadImageModalOpen(false);
    setImageSubTab(uploadImageType); // Switch tab automatically to show the uploaded image
    setImageSearchName("");
    setContainerCurrentPage(1);
    setVmCurrentPage(1);
    
    setNewImageName("");
    setNewImageDesc("");
    setNewImageSize("");
    setNewImageNamespace("");
    setNewImageVersion("");
    setNewImageOs("");
    setNewImageResType("");
    setNewImageArch("");
    setDeleteProtection(false);
    setSelectedFileName("");
    triggerToast(`🎉 成功上传新镜像: ${newImageName}`);
  };

  const handleOpenEditImage = (img: ContainerImage | VmImage) => {
    setEditingImageId(img.id);
    setEditingImageName(img.name);
    setEditingImageDesc(img.description);
    setEditingImageSize(img.size.replace(" MB", ""));
    if ("os" in img) {
      setEditingImageOs(img.os);
      setEditingImageResType(img.resourceType);
    }
    setEditImageModalOpen(true);
  };

  const handleSaveEditImage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingImageId) return;

    const sizeFormatted = editingImageSize ? `${editingImageSize} MB` : "100 MB";

    if (imageSubTab === "container") {
      setContainerImages(prev => prev.map(img => img.id === editingImageId ? {
        ...img,
        name: editingImageName,
        description: editingImageDesc,
        size: sizeFormatted
      } : img));
    } else {
      setVmImages(prev => prev.map(img => img.id === editingImageId ? {
        ...img,
        name: editingImageName,
        description: editingImageDesc,
        size: sizeFormatted,
        os: editingImageOs,
        resourceType: editingImageResType
      } : img));
    }

    setEditImageModalOpen(false);
    setEditingImageId(null);
    triggerToast(`✏️ 镜像修改成功！`);
  };

  const handleOpenImageLogs = (name: string) => {
    setSelectedImageNameForLogs(name);
    setImageLogs([
      `[2026-07-14 10:15:22] [INFO] 开始同步镜像 ${name} 到所有物理节点...`,
      `[2026-07-14 10:15:24] [INFO] 节点 Node-A-01 连接成功, 镜像层大小 13.9 MB`,
      `[2026-07-14 10:15:27] [INFO] 镜像层分发中 (15%)...`,
      `[2026-07-14 10:15:32] [INFO] 镜像层分发中 (45%)...`,
      `[2026-07-14 10:15:40] [INFO] 镜像层分发中 (80%)...`,
      `[2026-07-14 10:15:45] [INFO] 节点 Node-A-01 下载镜像完毕`,
      `[2026-07-14 10:15:47] [INFO] 开始向集群底册分发缓存元数据...`,
      `[2026-07-14 10:15:50] [SUCCESS] 镜像 ${name} 同步成功。`
    ]);
    setImageLogsModalOpen(true);
  };

  // --- Dynamic Toast Notifier ---
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [deleteConfirm, setDeleteConfirm] = useState<{
    show: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({
    show: false,
    title: "",
    message: "",
    onConfirm: () => {}
  });


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
  const [tagPageSize, setTagPageSize] = useState(20);

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
    setDeleteConfirm({
      show: true,
      title: "确认删除标签",
      message: `确定要删除该平台标签吗？「${name}」`,
      onConfirm: () => {
        setTags(tags.filter(t => t.id !== id));
        triggerToast(`🗑️ 已彻底删除标签：「${name}」`);
      }
    });
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
  const [formResourceTypes, setFormResourceTypes] = useState<string[]>([]);
  const [platformCurrentPage, setPlatformCurrentPage] = useState(1);
  const [platformPageSize, setPlatformPageSize] = useState(20);

  const getInitialResourceTypes = (type: string): string[] => {
    if (type === "容器") return ["容器"];
    if (type === "存储") return ["文件存储", "对象存储"];
    if (type === "私有云") return ["虚拟机", "容器"];
    if (type === "公有云") return ["虚拟机", "GPU算力"];
    return ["虚拟机"];
  };

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
    setFormResourceTypes(["虚拟机"]);
    setShowPlatformModal(true);
  };

  const handleOpenEditPlatform = (p: CloudPlatform) => {
    setEditingPlatform(p);
    setFormPlatName(p.name);
    setFormPlatType(p.type);
    setFormPluginId(p.pluginId);
    setFormStatus(p.status);
    setFormResourceTypes(p.resourceTypes || getInitialResourceTypes(p.type));
    setShowPlatformModal(true);
  };

  const handleSavePlatform = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formPlatName.trim()) {
      triggerToast("⚠️ 请填写完整信息！");
      return;
    }
    if (formResourceTypes.length === 0) {
      triggerToast("⚠️ 请选择至少一种云服务插件类型！");
      return;
    }

    const now = new Date();
    const formatTime = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const inferredPlatformType = getPlatformTypeFromName(formPlatName, formPlatType);

    if (editingPlatform) {
      setPlatforms(platforms.map(p => 
        p.id === editingPlatform.id 
          ? { 
              ...p, 
              name: formPlatName.trim(), 
              platformType: inferredPlatformType, 
              resourceTypes: formResourceTypes 
            } 
          : p
      ));
      triggerToast(`💾 成功保存云服务插件「${formPlatName}」配置！`);
    } else {
      const newPlatform: CloudPlatform = {
        id: `plat-${Date.now()}`,
        name: formPlatName.trim(),
        platformType: inferredPlatformType,
        type: formResourceTypes[0] || "虚拟机",
        pluginId: `plugin-${Date.now()}`,
        status: "启用",
        createdAt: formatTime,
        resourceTypes: formResourceTypes
      };
      setPlatforms([...platforms, newPlatform]);
      triggerToast(`🎉 成功新建云服务插件：「${newPlatform.name}」`);
    }
    setShowPlatformModal(false);
  };

  const handleDeletePlatform = (id: string, name: string) => {
    setDeleteConfirm({
      show: true,
      title: "确认删除云服务插件",
      message: `确定要删除云服务插件吗？「${name}」`,
      onConfirm: () => {
        setPlatforms(platforms.filter(p => p.id !== id));
        triggerToast(`🗑️ 已彻底删除云服务插件：「${name}」`);
      }
    });
  };

  const handleTogglePlatformStatus = (id: string, name: string, currentStatus: CloudPlatform["status"]) => {
    const nextStatus: CloudPlatform["status"] = currentStatus === "启用" ? "禁用" : "启用";
    const actionText = nextStatus === "启用" ? "启用" : "禁用";
    setDeleteConfirm({
      show: true,
      title: `确认${actionText}云服务插件`,
      message: `确定要${actionText}该云服务插件吗？「${name}」`,
      onConfirm: () => {
        setPlatforms(platforms.map(p => 
          p.id === id ? { ...p, status: nextStatus } : p
        ));
        triggerToast(nextStatus === "启用" ? `⚡ 已启用云服务插件「${name}」` : `🔌 已禁用云服务插件「${name}」`);
      }
    });
  };

  // ==================== TAB 3.5. 资源池管理 ====================
  const [searchPoolName, setSearchPoolName] = useState("");
  const [poolCurrentPage, setPoolCurrentPage] = useState(1);
  const [poolPageSize, setPoolPageSize] = useState(20);

  const [showPoolModal, setShowPoolModal] = useState(false);
  const [editingPool, setEditingPool] = useState<ResourcePool | null>(null);

  // Form Fields
  const [formPoolName, setFormPoolName] = useState("");
  const [formPoolPlugin, setFormPoolPlugin] = useState("容器");
  const [formPoolHasContainer, setFormPoolHasContainer] = useState(true);
  const [formPoolHasVm, setFormPoolHasVm] = useState(false);
  const [formPoolDesc, setFormPoolDesc] = useState("");

  const [formPoolContainerPlugin, setFormPoolContainerPlugin] = useState("");
  const [formPoolContainerUrl, setFormPoolContainerUrl] = useState("");
  const [formPoolContainerJson, setFormPoolContainerJson] = useState("{}");

  const [formPoolVmPlugin, setFormPoolVmPlugin] = useState("");
  const [formPoolVmUrl, setFormPoolVmUrl] = useState("");
  const [formPoolVmJson, setFormPoolVmJson] = useState("{}");

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
    setFormPoolHasContainer(true);
    setFormPoolHasVm(false);
    setFormPoolDesc("");
    setFormPoolContainerPlugin("");
    setFormPoolContainerUrl("");
    setFormPoolContainerJson("{}");
    setFormPoolVmPlugin("");
    setFormPoolVmUrl("");
    setFormPoolVmJson("{}");
    setShowPoolModal(true);
  };

  const handleOpenEditPool = (pool: ResourcePool) => {
    setEditingPool(pool);
    setFormPoolName(pool.name);
    setFormPoolPlugin(pool.associatedPlugin);
    setFormPoolHasContainer(pool.hasContainer !== false);
    setFormPoolHasVm(!!pool.hasVm);
    setFormPoolDesc(pool.description || "");
    setFormPoolContainerPlugin(pool.containerPlugin || "");
    setFormPoolContainerUrl(pool.containerUrl || "");
    setFormPoolContainerJson(pool.containerJson || "{}");
    setFormPoolVmPlugin(pool.vmPlugin || "");
    setFormPoolVmUrl(pool.vmUrl || "");
    setFormPoolVmJson(pool.vmJson || "{}");
    setShowPoolModal(true);
  };

  const handleSavePool = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formPoolName.trim()) {
      triggerToast("⚠️ 请填写资源池名称！");
      return;
    }
    if (!formPoolHasContainer && !formPoolHasVm) {
      triggerToast("⚠️ 请至少选择一种能力（容器或虚机）！");
      return;
    }
    if (formPoolHasContainer) {
      if (!formPoolContainerPlugin) {
        triggerToast("⚠️ 请选择已启用的容器能力插件！");
        return;
      }
      if (!formPoolContainerUrl.trim()) {
        triggerToast("⚠️ 请填写容器能力插件服务地址！");
        return;
      }
    }
    if (formPoolHasVm) {
      if (!formPoolVmPlugin) {
        triggerToast("⚠️ 请选择已启用的虚机能力插件！");
        return;
      }
      if (!formPoolVmUrl.trim()) {
        triggerToast("⚠️ 请填写虚机能力插件服务地址！");
        return;
      }
    }

    const now = new Date();
    const formatTime = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    let associatedText = "";
    if (formPoolHasContainer && formPoolHasVm) {
      associatedText = "容器, 私有云";
    } else if (formPoolHasContainer) {
      associatedText = "容器";
    } else {
      associatedText = "私有云";
    }

    if (editingPool) {
      setPools(pools.map(p => 
        p.id === editingPool.id 
          ? { 
              ...p, 
              name: formPoolName.trim(), 
              associatedPlugin: associatedText,
              hasContainer: formPoolHasContainer,
              hasVm: formPoolHasVm,
              description: formPoolDesc.trim(),
              containerPlugin: formPoolContainerPlugin,
              containerUrl: formPoolContainerUrl.trim(),
              containerJson: formPoolContainerJson.trim(),
              vmPlugin: formPoolVmPlugin,
              vmUrl: formPoolVmUrl.trim(),
              vmJson: formPoolVmJson.trim()
            } 
          : p
      ));
      triggerToast(`💾 成功保存资源池「${formPoolName}」配置！`);
    } else {
      const newPool: ResourcePool = {
        id: `pool-${Date.now()}`,
        name: formPoolName.trim(),
        associatedPlugin: associatedText,
        createdAt: formatTime,
        ak: "",
        sk: "",
        hasContainer: formPoolHasContainer,
        hasVm: formPoolHasVm,
        description: formPoolDesc.trim(),
        containerPlugin: formPoolContainerPlugin,
        containerUrl: formPoolContainerUrl.trim(),
        containerJson: formPoolContainerJson.trim(),
        vmPlugin: formPoolVmPlugin,
        vmUrl: formPoolVmUrl.trim(),
        vmJson: formPoolVmJson.trim()
      };
      setPools([...pools, newPool]);
      triggerToast(`🎉 成功新建资源池：「${newPool.name}」`);
    }
    setShowPoolModal(false);
  };

  const handleDeletePool = (id: string, name: string) => {
    setDeleteConfirm({
      show: true,
      title: "确认删除资源池",
      message: `确定要删除资源池吗？「${name}」`,
      onConfirm: () => {
        setPools(pools.filter(p => p.id !== id));
        triggerToast(`🗑️ 已彻底删除资源池：「${name}」`);
      }
    });
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
            { id: "images", title: "镜像管理", icon: Database },
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
            <div className="flex flex-col gap-1 shrink-0">
              <h1 className="text-xl font-bold text-neutral-900 leading-tight">标签管理</h1>
              <p className="text-xs text-neutral-500 font-medium">配置平台各类物理与逻辑资产的分类标签，便于精细化隔离与算力调度</p>
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
                    className="pl-9 pr-4 py-2 w-64 bg-white border border-neutral-200 rounded-full text-xs focus:outline-none focus:border-[#fa541c] focus:ring-1 focus:ring-[#fa541c] text-neutral-800 placeholder-neutral-400 font-medium transition-all"
                  />
                </div>
                <button
                  onClick={handleOpenCreateTag}
                  className="bg-[#fa541c] hover:bg-[#e84a15] text-white rounded-[4px] shadow-sm font-bold h-9 px-5 text-[13px] border-0 cursor-pointer transition-colors flex items-center justify-center"
                >
                  <Plus className="w-4 h-4 mr-1.5" /> 新建标签
                </button>
              </div>

              {/* Table Container */}
              <div className="flex-1 overflow-auto custom-scrollbar">
                <table className="w-full text-left border-collapse whitespace-nowrap">
                  <thead>
                    <tr className="border-b border-neutral-border/50 bg-neutral-50/50 text-[13px] text-neutral-600 select-none">
                      <th className="pl-6 pr-3 py-3.5 font-medium text-left">标签名称</th>
                      <th className="px-3 py-3.5 font-medium text-left">标签组</th>
                      <th className="px-3 py-3.5 font-medium text-left">创建时间</th>
                      <th className="pl-3 pr-6 py-3.5 font-medium text-left">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100 font-sans text-neutral-700">
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

                      return paginatedTags.map((tag, tagIndex) => (
                        <tr key={tag.id} className={cn("border-b border-neutral-100 hover:bg-neutral-50/30 transition-colors group text-[13px]", tagIndex === paginatedTags.length - 1 && "border-b-0")}>
                          <td className="pl-6 pr-3 py-3 text-left font-semibold text-neutral-800">{tag.name}</td>
                          <td className="px-3 py-3 text-left text-neutral-600">{tag.tagGroup}</td>
                          <td className="px-3 py-3 text-left text-neutral-500 font-mono">{tag.createdAt}</td>
                          <td className="pl-3 pr-6 py-3 text-left">
                            <button
                              onClick={() => handleOpenEditTag(tag)}
                              className="text-[#fa541c] hover:text-[#e84a15] transition-colors cursor-pointer bg-transparent border-0 p-0 text-xs font-semibold mr-3"
                            >
                              编辑
                            </button>
                            <button
                              onClick={() => handleDeleteTag(tag.id, tag.name)}
                              className="text-[#fa541c] hover:text-[#e84a15] transition-colors cursor-pointer bg-transparent border-0 p-0 text-xs font-semibold"
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
                  <div className="flex items-center justify-end p-4 gap-4 bg-white shrink-0 select-none">
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
              <div 
                className="fixed inset-0 z-50 bg-black/45 backdrop-blur-[2px] flex justify-end animate-fade-in text-left"
                onClick={() => setShowTagModal(false)}
              >
                <form 
                  onSubmit={handleSaveTag} 
                  className="bg-white w-full max-w-[620px] h-screen flex flex-col shadow-2xl border-l border-neutral-100 animate-in slide-in-from-right duration-300"
                  onClick={(e) => e.stopPropagation()}
                >
                  
                  {/* Header */}
                  <div className="px-6 py-4 border-b border-neutral-100 flex justify-between items-center bg-neutral-50/50 shrink-0">
                    <h2 className="text-[16px] font-bold text-[#262626] flex items-center gap-2">
                      {editingTag ? <Edit className="w-5 h-5 text-[#fa541c]" /> : <Plus className="w-5 h-5 text-[#fa541c]" />} 
                      <span>{editingTag ? "编辑标签" : "新建标签"}</span>
                    </h2>
                    <button 
                      type="button"
                      onClick={() => setShowTagModal(false)}
                      className="text-neutral-400 hover:text-[#fa541c] p-1.5 hover:bg-neutral-100 rounded-[4px] transition-colors border-0 bg-transparent cursor-pointer"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Body inputs */}
                  <div className="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-6 bg-white text-[13px]">
                    
                    {/* Tag Name */}
                    <div className="grid grid-cols-[120px_1fr] items-center gap-4">
                      <label className="text-[13px] font-bold text-[#262626] text-right">
                        标签名称 <span className="text-[#fa541c]">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="请输入标签名称"
                        value={formTagName}
                        onChange={(e) => setFormTagName(e.target.value)}
                        className="w-full border border-neutral-200 rounded-[4px] px-3.5 py-2 text-[13px] focus:outline-none focus:border-[#fa541c] transition-all text-[#262626]"
                        autoFocus={!editingTag}
                      />
                    </div>

                    {/* Tag Group */}
                    <div className="grid grid-cols-[120px_1fr] items-center gap-4">
                      <label className="text-[13px] font-bold text-[#262626] text-right">
                        标签组 <span className="text-[#fa541c]">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="请输入标签组"
                        value={formTagGroup}
                        onChange={(e) => setFormTagGroup(e.target.value)}
                        className="w-full border border-neutral-200 rounded-[4px] px-3.5 py-2 text-[13px] focus:outline-none focus:border-[#fa541c] transition-all text-[#262626]"
                      />
                    </div>

                  </div>

                  {/* Actions */}
                  <div className="px-6 py-4 border-t border-neutral-100 bg-neutral-50/50 flex items-center justify-end gap-3 shrink-0">
                    <button
                      type="button"
                      onClick={() => setShowTagModal(false)}
                      className="border border-neutral-200 text-neutral-600 h-9 px-6 rounded-[4px] text-[13px] bg-white cursor-pointer hover:bg-neutral-50 transition-colors font-semibold"
                    >
                      取消
                    </button>
                    <button
                      type="submit"
                      className="bg-[#fa541c] hover:bg-[#e84a15] text-white h-9 px-8 rounded-[4px] shadow-sm text-[13px] border-0 cursor-pointer transition-colors font-semibold"
                    >
                      确认
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
            <div className="flex flex-col gap-1 shrink-0">
              <h1 className="text-xl font-bold text-neutral-900 leading-tight">云服务插件</h1>
              <p className="text-xs text-neutral-500 font-medium">对接异构计算平台接口，实现对物理节点、虚拟机及容器引擎的动态扩展</p>
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
                    className="pl-9 pr-4 py-2 w-64 bg-white border border-neutral-200 rounded-full text-xs focus:outline-none focus:border-[#fa541c] focus:ring-1 focus:ring-[#fa541c] text-neutral-800 placeholder-neutral-400 font-medium transition-all"
                  />
                </div>
                <button
                  onClick={handleOpenCreatePlatform}
                  className="bg-[#fa541c] hover:bg-[#e84a15] text-white rounded-[4px] shadow-sm font-bold h-9 px-5 text-[13px] border-0 cursor-pointer transition-colors flex items-center justify-center"
                >
                  <Plus className="w-4 h-4 mr-1.5" /> 新建云服务插件
                </button>
              </div>

              {/* Table Container */}
              <div className="flex-1 overflow-auto custom-scrollbar">
                <table className="w-full text-left border-collapse whitespace-nowrap">
                  <thead>
                    <tr className="border-b border-neutral-border/50 bg-neutral-50/50 text-[13px] text-neutral-600 select-none">
                      <th className="pl-6 pr-3 py-3.5 font-medium text-left">云服务插件</th>
                      <th className="px-3 py-3.5 font-medium text-left">云服务插件类型</th>
                      <th className="px-3 py-3.5 font-medium text-left">插件ID</th>
                      <th className="px-3 py-3.5 font-medium text-left">状态</th>
                      <th className="px-3 py-3.5 font-medium text-left">创建时间</th>
                      <th className="pl-3 pr-6 py-3.5 font-medium text-left">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100 font-sans text-neutral-700">
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

                      return paginatedPlatforms.map((plat, platIndex) => (
                        <tr key={plat.id} className={cn("border-b border-neutral-100 hover:bg-neutral-50/30 transition-colors group text-[13px]", platIndex === paginatedPlatforms.length - 1 && "border-b-0")}>
                          <td className="pl-6 pr-3 py-3 text-left font-semibold text-neutral-800">
                            {plat.name}
                          </td>
                          <td className="px-3 py-3 text-left">
                            <div className="flex flex-wrap gap-1.5">
                              {(plat.resourceTypes || getInitialResourceTypes(plat.type)).map((rType, rIdx) => (
                                <span key={rIdx} className="px-2 py-0.5 rounded text-[11px] bg-neutral-100 border border-neutral-200 text-neutral-600 font-semibold inline-block">
                                  {rType}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="px-3 py-3 text-left text-neutral-500 font-mono">{plat.pluginId}</td>
                          <td className="px-3 py-3 text-left">
                            <span className={cn(
                              "px-2 py-0.5 rounded text-[12px] border font-medium font-sans inline-block",
                              plat.status === "启用" 
                                ? "bg-green-50 border-green-200 text-green-600" 
                                : "bg-neutral-50 border-neutral-200 text-neutral-500"
                            )}>
                              {plat.status}
                            </span>
                          </td>
                          <td className="px-3 py-3 text-left text-neutral-500 font-mono">{plat.createdAt}</td>
                          <td className="pl-3 pr-6 py-3 text-left">
                            <button
                              onClick={() => handleOpenEditPlatform(plat)}
                              className="text-[#fa541c] hover:text-[#e84a15] transition-colors cursor-pointer bg-transparent border-0 p-0 text-xs font-semibold mr-3"
                            >
                              编辑
                            </button>
                            {plat.status === "启用" ? (
                              <button
                                onClick={() => handleTogglePlatformStatus(plat.id, plat.name, plat.status)}
                                className="text-[#fa541c] hover:text-[#e84a15] transition-colors cursor-pointer bg-transparent border-0 p-0 text-xs font-semibold"
                              >
                                禁用
                              </button>
                            ) : (
                              <>
                                <button
                                  onClick={() => handleTogglePlatformStatus(plat.id, plat.name, plat.status)}
                                  className="text-[#fa541c] hover:text-[#e84a15] transition-colors cursor-pointer bg-transparent border-0 p-0 text-xs font-semibold mr-3"
                                >
                                  启用
                                </button>
                                <button
                                  onClick={() => handleDeletePlatform(plat.id, plat.name)}
                                  className="text-[#fa541c] hover:text-[#e84a15] transition-colors cursor-pointer bg-transparent border-0 p-0 text-xs font-semibold"
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
                  <div className="flex items-center justify-end p-4 gap-4 bg-white shrink-0 select-none">
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
              <div 
                className="fixed inset-0 z-50 bg-black/45 backdrop-blur-[2px] flex justify-end animate-fade-in text-left"
                onClick={() => setShowPlatformModal(false)}
              >
                <form 
                  onSubmit={handleSavePlatform} 
                  className="bg-white w-full max-w-[620px] h-screen flex flex-col shadow-2xl border-l border-neutral-100 animate-in slide-in-from-right duration-300"
                  onClick={(e) => e.stopPropagation()}
                >
                  
                  {/* Header */}
                  <div className="px-6 py-4 border-b border-neutral-100 flex justify-between items-center bg-neutral-50/50 shrink-0">
                    <h2 className="text-[16px] font-bold text-[#262626] flex items-center gap-2">
                      {editingPlatform ? <Edit className="w-5 h-5 text-[#fa541c]" /> : <Plus className="w-5 h-5 text-[#fa541c]" />} 
                      <span>{editingPlatform ? "编辑云服务插件" : "新建云服务插件"}</span>
                    </h2>
                    <button 
                      type="button"
                      onClick={() => setShowPlatformModal(false)}
                      className="text-neutral-400 hover:text-[#fa541c] p-1.5 hover:bg-neutral-100 rounded-[4px] transition-colors border-0 bg-transparent cursor-pointer"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Body inputs */}
                  <div className="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-6 bg-white text-[13px]">
                    
                    {/* Name */}
                    <div className="grid grid-cols-[120px_1fr] items-center gap-4">
                      <label className="text-[13px] font-bold text-[#262626] text-right">
                        云服务插件名称 <span className="text-[#fa541c]">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="请输入云服务插件名称"
                        value={formPlatName}
                        onChange={(e) => setFormPlatName(e.target.value)}
                        className="w-full border border-neutral-200 rounded-[4px] px-3.5 py-2 text-[13px] focus:outline-none focus:border-[#fa541c] transition-all text-[#262626]"
                        autoFocus={!editingPlatform}
                      />
                    </div>

                    {/* Cloud Service Plugin Types */}
                    <div className="grid grid-cols-[120px_1fr] items-start gap-4">
                      <label className="text-[13px] font-bold text-[#262626] text-right mt-1.5">
                        云服务插件类型 <span className="text-[#fa541c]">*</span>
                      </label>
                      <div className="flex items-center gap-6 py-1">
                        {[
                          { key: "container", label: "容器" },
                          { key: "vm", label: "虚拟机" },
                        ].map((item) => {
                          const isChecked = formResourceTypes.includes(item.label);
                          return (
                            <label
                              key={item.key}
                              className={cn(
                                "flex items-center gap-2 py-1 text-xs cursor-pointer select-none transition-colors",
                                isChecked 
                                  ? "text-neutral-800 font-bold" 
                                  : "text-neutral-600 font-medium hover:text-[#fa541c]"
                              )}
                            >
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={() => {
                                  if (isChecked) {
                                    setFormResourceTypes(formResourceTypes.filter((t) => t !== item.label));
                                  } else {
                                    setFormResourceTypes([...formResourceTypes, item.label]);
                                  }
                                }}
                                className="accent-[#fa541c] cursor-pointer w-4 h-4"
                              />
                              <span>{item.label}</span>
                            </label>
                          );
                        })}
                      </div>
                    </div>

                  </div>

                  {/* Actions */}
                  <div className="px-6 py-4 border-t border-neutral-100 bg-neutral-50/50 flex items-center justify-end gap-3 shrink-0">
                    <button
                      type="button"
                      onClick={() => setShowPlatformModal(false)}
                      className="border border-neutral-200 text-neutral-600 h-9 px-6 rounded-[4px] text-[13px] bg-white cursor-pointer hover:bg-neutral-50 transition-colors font-semibold"
                    >
                      取消
                    </button>
                    <button
                      type="submit"
                      className="bg-[#fa541c] hover:bg-[#e84a15] text-white h-9 px-8 rounded-[4px] shadow-sm text-[13px] border-0 cursor-pointer transition-colors font-semibold"
                    >
                      确认
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
            <div className="flex flex-col gap-1 shrink-0">
              <h1 className="text-xl font-bold text-neutral-900 leading-tight">资源池管理</h1>
              <p className="text-xs text-neutral-500 font-medium">统一纳管底层算力资源池与插件凭证，支持规格同步、状态监控及鉴权认证</p>
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
                    className="pl-9 pr-4 py-2 w-64 bg-white border border-neutral-200 rounded-full text-xs focus:outline-none focus:border-[#fa541c] focus:ring-1 focus:ring-[#fa541c] text-neutral-800 placeholder-neutral-400 font-medium transition-all"
                  />
                </div>
                <button
                  onClick={handleOpenCreatePool}
                  className="bg-[#fa541c] hover:bg-[#e84a15] text-white rounded-[4px] shadow-sm font-bold h-9 px-5 text-[13px] border-0 cursor-pointer transition-colors flex items-center justify-center"
                >
                  <Plus className="w-4 h-4 mr-1.5" /> 新建资源池
                </button>
              </div>

              {/* Table Container */}
              <div className="flex-1 overflow-auto custom-scrollbar">
                <table className="w-full text-left border-collapse whitespace-nowrap">
                  <thead>
                    <tr className="border-b border-neutral-border/50 bg-neutral-50/50 text-[13px] text-neutral-600 select-none">
                      <th className="pl-6 pr-3 py-3.5 font-medium text-left">资源池名称</th>
                      <th className="px-3 py-3.5 font-medium text-left">关联云服务插件</th>
                      <th className="px-3 py-3.5 font-medium text-left">创建时间</th>
                      <th className="pl-3 pr-6 py-3.5 font-medium text-left">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100 font-sans text-neutral-700">
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

                      return paginatedPools.map((pool, poolIndex) => (
                        <tr key={pool.id} className={cn("border-b border-neutral-100 hover:bg-neutral-50/30 transition-colors group text-[13px]", poolIndex === paginatedPools.length - 1 && "border-b-0")}>
                          <td className="pl-6 pr-3 py-3 text-left font-semibold text-neutral-800">{pool.name}</td>
                          <td className="px-3 py-3 text-left text-neutral-600">{pool.associatedPlugin}</td>
                          <td className="px-3 py-3 text-left text-neutral-500 font-mono">{pool.createdAt}</td>
                          <td className="pl-3 pr-6 py-3 text-left select-none">
                            <button
                              onClick={() => handleOpenEditPool(pool)}
                              className="text-[#fa541c] hover:text-[#e84a15] transition-colors cursor-pointer bg-transparent border-0 p-0 text-xs font-semibold mr-3"
                            >
                              编辑
                            </button>
                            <button
                              onClick={() => handleDeletePool(pool.id, pool.name)}
                              className="text-[#fa541c] hover:text-[#e84a15] transition-colors cursor-pointer bg-transparent border-0 p-0 text-xs font-semibold mr-3"
                            >
                              删除
                            </button>
                            <button
                              onClick={() => handleOpenAkSkModal(pool)}
                              className="text-[#fa541c] hover:text-[#e84a15] transition-colors cursor-pointer bg-transparent border-0 p-0 text-xs font-semibold"
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
                  <div className="flex items-center justify-end p-4 gap-4 bg-white shrink-0 select-none">
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
              <div 
                className="fixed inset-0 z-50 bg-black/45 backdrop-blur-[2px] flex justify-end animate-fade-in text-left"
                onClick={() => setShowPoolModal(false)}
              >
                <form 
                  onSubmit={handleSavePool} 
                  className="bg-white w-full max-w-[680px] h-screen flex flex-col shadow-2xl border-l border-neutral-100 animate-in slide-in-from-right duration-300"
                  onClick={(e) => e.stopPropagation()}
                >
                  
                  {/* Header */}
                  <div className="px-6 py-4 border-b border-neutral-100 flex justify-between items-center bg-neutral-50/50 shrink-0">
                    <h2 className="text-[16px] font-bold text-[#262626] flex items-center gap-2">
                      {editingPool ? <Edit className="w-5 h-5 text-[#fa541c]" /> : <Plus className="w-5 h-5 text-[#fa541c]" />} 
                      <span>{editingPool ? "编辑算力资源池" : "新建算力资源池"}</span>
                    </h2>
                    <button 
                      type="button"
                      onClick={() => setShowPoolModal(false)}
                      className="text-neutral-400 hover:text-[#fa541c] p-1.5 hover:bg-neutral-100 rounded-[4px] transition-colors border-0 bg-transparent cursor-pointer"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Body inputs */}
                  <div className="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-6 bg-white text-[13px]">
                    
                    {/* Pool Name */}
                    <div className="grid grid-cols-[100px_1fr] items-center gap-4 animate-fade-in">
                      <label className="text-[13px] font-bold text-[#262626] text-right">
                        资源池名称 <span className="text-[#fa541c]">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="华东容器资源池"
                        value={formPoolName}
                        onChange={(e) => setFormPoolName(e.target.value)}
                        className="w-full border border-neutral-200 rounded-[4px] px-3.5 py-2 text-[13px] focus:outline-none focus:border-[#fa541c] focus:ring-1 focus:ring-[#fa541c]/20 hover:border-neutral-300 transition-all text-[#262626] bg-white"
                        autoFocus={!editingPool}
                      />
                    </div>

                    {/* Capabilities Selection */}
                    <div className="grid grid-cols-[100px_1fr] items-start gap-4 animate-fade-in">
                      <label className="text-[13px] font-bold text-[#262626] text-right pt-2.5">
                        能力选择 <span className="text-[#fa541c]">*</span>
                      </label>
                      <div className="grid grid-cols-2 gap-4">
                        {/* Container Capability */}
                        <label
                          className={cn(
                            "flex items-start gap-3 p-4 rounded-[8px] border text-left cursor-pointer transition-all select-none bg-[#f8fafc]/30 hover:bg-[#f8fafc]/80",
                            formPoolHasContainer 
                              ? "border-[#fa541c] bg-[#fff2e8]/10 shadow-sm shadow-orange-500/5" 
                              : "border-neutral-200 hover:border-neutral-300"
                          )}
                        >
                          <input
                            type="checkbox"
                            checked={formPoolHasContainer}
                            onChange={(e) => setFormPoolHasContainer(e.target.checked)}
                            className="accent-[#fa541c] w-4.5 h-4.5 cursor-pointer mt-1"
                          />
                          <div className="flex flex-col gap-0.5">
                            <span className={cn("text-[13px] font-bold text-[#262626]", formPoolHasContainer && "text-[#fa541c]")}>
                              容器能力
                            </span>
                            <span className="text-[11px] text-neutral-400 font-medium">
                              允许创建容器运行环境
                            </span>
                          </div>
                        </label>

                        {/* VM Capability */}
                        <label
                          className={cn(
                            "flex items-start gap-3 p-4 rounded-[8px] border text-left cursor-pointer transition-all select-none bg-[#f8fafc]/30 hover:bg-[#f8fafc]/80",
                            formPoolHasVm 
                              ? "border-[#fa541c] bg-[#fff2e8]/10 shadow-sm shadow-orange-500/5" 
                              : "border-neutral-200 hover:border-neutral-300"
                          )}
                        >
                          <input
                            type="checkbox"
                            checked={formPoolHasVm}
                            onChange={(e) => setFormPoolHasVm(e.target.checked)}
                            className="accent-[#fa541c] w-4.5 h-4.5 cursor-pointer mt-1"
                          />
                          <div className="flex flex-col gap-0.5">
                            <span className={cn("text-[13px] font-bold text-[#262626]", formPoolHasVm && "text-[#fa541c]")}>
                              虚机能力
                            </span>
                            <span className="text-[11px] text-neutral-400 font-medium">
                              允许创建虚机运行环境
                            </span>
                          </div>
                        </label>
                      </div>
                    </div>

                    {/* Container Capability Config Panel (Fig 1) */}
                    {formPoolHasContainer && (
                      <div className="grid grid-cols-[100px_1fr] items-start gap-4 animate-fade-in text-left">
                        <label className="text-[13px] font-bold text-[#262626] text-right pt-2.5">
                          容器配置
                        </label>
                        <div className="border border-neutral-200 rounded-[8px] p-5 bg-[#f8fafc]/30 hover:bg-[#f8fafc]/50 hover:border-neutral-300 transition-all space-y-4 text-left w-full">
                          <div className="flex flex-col gap-0.5 pb-2.5 border-b border-neutral-100">
                            <span className="text-[13px] font-bold text-[#262626]">
                              容器配置详情
                            </span>
                            <span className="text-[11px] text-neutral-400 font-medium leading-relaxed">
                              容器运行环境将通过该插件和连接配置访问底层资源。
                            </span>
                          </div>

                          {/* Plugin */}
                          <div className="flex flex-col gap-1.5">
                            <label className="text-[12px] font-bold text-neutral-700">
                              插件 <span className="text-[#fa541c]">*</span>
                            </label>
                            <CustomSelect
                              value={formPoolContainerPlugin}
                              onChange={(val) => setFormPoolContainerPlugin(val)}
                              placeholder="选择已启用插件"
                              options={platforms.filter(p => p.status === "启用").map(p => ({
                                value: p.name,
                                label: p.name
                              }))}
                            />
                          </div>

                          {/* URL */}
                          <div className="flex flex-col gap-1.5">
                            <label className="text-[12px] font-bold text-neutral-700">
                              插件服务地址 <span className="text-[#fa541c]">*</span>
                            </label>
                            <input
                              type="text"
                              placeholder="https://plugin.example.com"
                              value={formPoolContainerUrl}
                              onChange={(e) => setFormPoolContainerUrl(e.target.value)}
                              className="w-full border border-neutral-200 rounded-[4px] px-3.5 py-2 text-[13px] focus:outline-none focus:border-[#fa541c] focus:ring-1 focus:ring-[#fa541c]/20 hover:border-neutral-300 transition-all text-[#262626] bg-white"
                            />
                          </div>

                          {/* JSON Textarea */}
                          <div className="flex flex-col gap-1.5">
                            <label className="text-[12px] font-bold text-neutral-700">
                              连接配置 JSON <span className="text-[#fa541c]">*</span>
                            </label>
                            <textarea
                              rows={3}
                              placeholder="{}"
                              value={formPoolContainerJson}
                              onChange={(e) => setFormPoolContainerJson(e.target.value)}
                              className="w-full border border-neutral-200 rounded-[4px] px-3.5 py-2 text-[13px] focus:outline-none focus:border-[#fa541c] focus:ring-1 focus:ring-[#fa541c]/20 hover:border-neutral-300 transition-all text-[#262626] font-mono bg-white resize-none"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* VM Capability Config Panel (Fig 2) */}
                    {formPoolHasVm && (
                      <div className="grid grid-cols-[100px_1fr] items-start gap-4 animate-fade-in text-left">
                        <label className="text-[13px] font-bold text-[#262626] text-right pt-2.5">
                          虚机配置
                        </label>
                        <div className="border border-neutral-200 rounded-[8px] p-5 bg-[#f8fafc]/30 hover:bg-[#f8fafc]/50 hover:border-neutral-300 transition-all space-y-4 text-left w-full">
                          <div className="flex flex-col gap-0.5 pb-2.5 border-b border-neutral-100">
                            <span className="text-[13px] font-bold text-[#262626]">
                              虚机配置详情
                            </span>
                            <span className="text-[11px] text-neutral-400 font-medium leading-relaxed">
                              虚机运行环境将通过该插件和连接配置访问底层资源。
                            </span>
                          </div>

                          {/* Plugin */}
                          <div className="flex flex-col gap-1.5">
                            <label className="text-[12px] font-bold text-neutral-700">
                              插件 <span className="text-[#fa541c]">*</span>
                            </label>
                            <CustomSelect
                              value={formPoolVmPlugin}
                              onChange={(val) => setFormPoolVmPlugin(val)}
                              placeholder="选择已启用插件"
                              options={platforms.filter(p => p.status === "启用").map(p => ({
                                value: p.name,
                                label: p.name
                              }))}
                            />
                          </div>

                          {/* URL */}
                          <div className="flex flex-col gap-1.5">
                            <label className="text-[12px] font-bold text-neutral-700">
                              插件服务地址 <span className="text-[#fa541c]">*</span>
                            </label>
                            <input
                              type="text"
                              placeholder="https://plugin.example.com"
                              value={formPoolVmUrl}
                              onChange={(e) => setFormPoolVmUrl(e.target.value)}
                              className="w-full border border-neutral-200 rounded-[4px] px-3.5 py-2 text-[13px] focus:outline-none focus:border-[#fa541c] focus:ring-1 focus:ring-[#fa541c]/20 hover:border-neutral-300 transition-all text-[#262626] bg-white"
                            />
                          </div>

                          {/* JSON Textarea */}
                          <div className="flex flex-col gap-1.5">
                            <label className="text-[12px] font-bold text-neutral-700">
                              连接配置 JSON <span className="text-[#fa541c]">*</span>
                            </label>
                            <textarea
                              rows={3}
                              placeholder="{}"
                              value={formPoolVmJson}
                              onChange={(e) => setFormPoolVmJson(e.target.value)}
                              className="w-full border border-neutral-200 rounded-[4px] px-3.5 py-2 text-[13px] focus:outline-none focus:border-[#fa541c] focus:ring-1 focus:ring-[#fa541c]/20 hover:border-neutral-300 transition-all text-[#262626] font-mono bg-white resize-none"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Pool Description */}
                    <div className="grid grid-cols-[100px_1fr] items-start gap-4 animate-fade-in">
                      <label className="text-[13px] font-bold text-[#262626] text-right pt-2">
                        资源池描述
                      </label>
                      <textarea
                        rows={4}
                        placeholder="填写区域、供应商或使用范围说明"
                        value={formPoolDesc}
                        onChange={(e) => setFormPoolDesc(e.target.value)}
                        className="w-full border border-neutral-200 rounded-[4px] px-3.5 py-2 text-[13px] focus:outline-none focus:border-[#fa541c] focus:ring-1 focus:ring-[#fa541c]/20 hover:border-neutral-300 transition-all text-[#262626] bg-white resize-none"
                      />
                    </div>

                  </div>

                  {/* Actions */}
                  <div className="px-6 py-4 border-t border-neutral-100 bg-neutral-50/50 flex items-center justify-end gap-3 shrink-0">
                    <button
                      type="button"
                      onClick={() => setShowPoolModal(false)}
                      className="border border-neutral-200 text-neutral-600 h-9 px-6 rounded-[4px] text-[13px] bg-white cursor-pointer hover:bg-neutral-50 transition-colors font-semibold"
                    >
                      取消
                    </button>
                    <button
                      type="submit"
                      className="bg-[#fa541c] hover:bg-[#e84a15] text-white h-9 px-8 rounded-[4px] shadow-sm text-[13px] border-0 cursor-pointer transition-colors font-semibold"
                    >
                      确认
                    </button>
                  </div>

                </form>
              </div>
            )}

            {/* --- AK/SK Credentials Modal --- */}
            {showAkSkModal && selectedPoolForAkSk && (
              <div 
                className="fixed inset-0 z-50 bg-black/45 backdrop-blur-[2px] flex justify-end animate-fade-in text-left"
                onClick={() => setShowAkSkModal(false)}
              >
                <form 
                  onSubmit={handleSaveAkSk} 
                  className="bg-white w-full max-w-[560px] h-screen flex flex-col shadow-2xl border-l border-neutral-100 animate-in slide-in-from-right duration-300"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Header */}
                  <div className="px-6 py-4 border-b border-neutral-100 flex justify-between items-center bg-neutral-50/50 shrink-0">
                    <h2 className="text-[16px] font-bold text-[#262626] flex items-center gap-2">
                      <Key className="w-5 h-5 text-[#fa541c]" />
                      <span>配置 AK/SK 凭证</span>
                    </h2>
                    <button 
                      type="button"
                      onClick={() => setShowAkSkModal(false)}
                      className="text-neutral-400 hover:text-[#fa541c] p-1.5 hover:bg-neutral-100 rounded-[4px] transition-colors border-0 bg-transparent cursor-pointer"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Body inputs */}
                  <div className="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-6 bg-white text-[13px]">
                    
                    {/* Security Tip Box */}
                    <div className="bg-[#fff5f0] border border-[#ffbb96] rounded-[4px] p-4 flex gap-3 text-sm text-[#d4380d] select-none leading-relaxed animate-fade-in">
                      <Info className="w-5 h-5 flex-shrink-0 mt-0.5 text-[#fa541c]" />
                      <div>
                        <p className="font-bold mb-1 text-[13px] text-[#fa541c]">凭证安全提示</p>
                        <p className="text-xs text-[#d4380d] opacity-90 leading-relaxed">
                          当前资源池：<strong>{selectedPoolForAkSk.name}</strong>。
                          此凭证将用于云平台底层 API 对接及算力规格数据的读取/拉取鉴权。为了系统安全性，请妥善保管好您的 Secret Key。
                        </p>
                      </div>
                    </div>

                    {/* Access Key */}
                    <div className="grid grid-cols-[100px_1fr] items-center gap-4 animate-fade-in">
                      <label className="text-[13px] font-bold text-[#262626] text-right">
                        Access Key <span className="text-[#fa541c]">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="请输入 Access Key (AK)"
                        value={formPoolAk}
                        onChange={(e) => setFormPoolAk(e.target.value)}
                        className="w-full border border-neutral-200 rounded-[4px] px-3.5 py-2 text-[13px] focus:outline-none focus:border-[#fa541c] focus:ring-1 focus:ring-[#fa541c]/20 hover:border-neutral-300 transition-all text-[#262626] bg-white font-medium"
                      />
                    </div>

                    {/* Secret Key */}
                    <div className="grid grid-cols-[100px_1fr] items-center gap-4 animate-fade-in">
                      <label className="text-[13px] font-bold text-[#262626] text-right">
                        Secret Key <span className="text-[#fa541c]">*</span>
                      </label>
                      <div className="relative w-full">
                        <input
                          type={showSkPassword ? "text" : "password"}
                          required
                          placeholder="请输入 Secret Key (SK)"
                          value={formPoolSk}
                          onChange={(e) => setFormPoolSk(e.target.value)}
                          className="w-full border border-neutral-200 rounded-[4px] pl-3.5 pr-10 py-2 text-[13px] focus:outline-none focus:border-[#fa541c] focus:ring-1 focus:ring-[#fa541c]/20 hover:border-neutral-300 transition-all text-[#262626] bg-white font-medium"
                        />
                        <button
                          type="button"
                          onClick={() => setShowSkPassword(!showSkPassword)}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 bg-transparent border-0 cursor-pointer flex items-center p-0"
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

                  {/* Actions / Footer */}
                  <div className="px-6 py-4 border-t border-neutral-100 bg-neutral-50/50 flex items-center justify-end gap-3 shrink-0">
                    <button
                      type="button"
                      onClick={() => setShowAkSkModal(false)}
                      className="border border-neutral-200 text-neutral-600 h-9 px-6 rounded-[4px] text-[13px] bg-white cursor-pointer hover:bg-neutral-50 transition-colors font-semibold"
                    >
                      取消
                    </button>
                    <button
                      type="submit"
                      className="bg-[#fa541c] hover:bg-[#e84a15] text-white h-9 px-8 rounded-[4px] shadow-sm text-[13px] border-0 cursor-pointer transition-colors font-semibold"
                    >
                      确定保存
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

        {/* ==================== 7. 镜像管理 ==================== */}
        {activeTab === "images" && (() => {
          const filteredContainers = containerImages.filter(img => 
            img.name.toLowerCase().includes(imageSearchName.toLowerCase()) ||
            img.description.toLowerCase().includes(imageSearchName.toLowerCase())
          );

          const filteredVms = vmImages.filter(img => 
            img.name.toLowerCase().includes(imageSearchName.toLowerCase()) ||
            img.description.toLowerCase().includes(imageSearchName.toLowerCase())
          );

          const totalContainers = filteredContainers.length;
          const totalVm = filteredVms.length;

          const totalContainerPages = Math.ceil(totalContainers / imagePageSize);
          const totalVmPages = Math.ceil(totalVm / imagePageSize);

          const activeContainerPage = Math.min(containerCurrentPage, Math.max(1, totalContainerPages));
          const activeVmPage = Math.min(vmCurrentPage, Math.max(1, totalVmPages));

          const currentContainers = filteredContainers.slice(
            (activeContainerPage - 1) * imagePageSize,
            activeContainerPage * imagePageSize
          );

          const currentVms = filteredVms.slice(
            (activeVmPage - 1) * imagePageSize,
            activeVmPage * imagePageSize
          );

          return (
            <div className="space-y-4 flex flex-col flex-1 min-h-0 animate-slide-up text-left">
              
              {/* Top Title Section */}
              <div className="flex flex-col gap-1 shrink-0">
                <h1 className="text-xl font-bold text-neutral-900 leading-tight">镜像管理</h1>
                <p className="text-xs text-neutral-500 font-medium">配置平台各类容器镜像与虚拟机镜像，用于实训环境部署与计算节点快速构建</p>
              </div>

              {/* Sub tabs switcher row - transparent background, border-b horizontal line */}
              <div className="flex items-center justify-between border-b border-neutral-200 mt-2 shrink-0 bg-transparent select-none">
                <div className="flex items-center gap-6">
                  {[
                    { id: "container", title: "容器镜像" },
                    { id: "vm", title: "虚拟机镜像" }
                  ].map((sub) => {
                    const isActive = imageSubTab === sub.id;
                    return (
                      <button
                        key={sub.id}
                        type="button"
                        onClick={() => {
                          setImageSubTab(sub.id as any);
                          setImageSearchName(""); // reset search
                          setContainerCurrentPage(1);
                          setVmCurrentPage(1);
                        }}
                        className={cn(
                          "flex items-center gap-2 px-5 pb-3 text-sm font-bold border-b-2 bg-transparent transition-all cursor-pointer border-transparent -bottom-[1px] relative",
                          isActive 
                            ? "border-[#fa541c] text-[#fa541c]" 
                            : "text-neutral-500 hover:text-[#fa541c]"
                        )}
                      >
                        {sub.title}
                      </button>
                    );
                  })}
                </div>

                <div className="flex items-center gap-2 pb-2">
                  <button
                    type="button"
                    onClick={handleRefreshImages}
                    disabled={isRefreshingImages}
                    className="border border-neutral-200 text-neutral-600 hover:text-[#fa541c] hover:border-orange-200 hover:bg-orange-50/20 w-8.5 h-8.5 p-0 flex items-center justify-center rounded-[4px] cursor-pointer bg-white transition-all shadow-3xs"
                    title="刷新"
                  >
                    <RotateCw className={cn("w-3.5 h-3.5", isRefreshingImages && "animate-spin")} />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setUploadImageType(imageSubTab);
                      setUploadImageModalOpen(true);
                    }}
                    className="bg-[#fa541c] hover:bg-[#e84a15] text-white text-xs font-bold px-4 h-8.5 rounded-[4px] transition-colors cursor-pointer flex items-center gap-1.5 shadow-3xs border-0"
                  >
                    <Plus className="w-4 h-4" />
                    <span>上传镜像</span>
                  </button>
                </div>
              </div>

              {/* Table Card */}
              <div className="bg-white rounded border border-neutral-border overflow-hidden flex flex-col flex-1 min-h-0">
                
                {/* Table Container */}
                <div className="flex-1 overflow-auto custom-scrollbar">
                  {imageSubTab === "container" ? (
                    /* CONTAINER IMAGES TABLE */
                    <table className="w-full text-left border-collapse whitespace-nowrap">
                      <thead>
                        <tr className="border-b border-neutral-border/50 bg-[#fafafa] text-[13px] text-neutral-600 select-none">
                          <th className="pl-6 pr-3 py-3 font-medium text-left">镜像名称</th>
                          <th className="px-3 py-3 font-medium text-left">镜像描述</th>
                          <th className="px-3 py-3 font-medium text-left">镜像大小</th>
                          <th className="px-3 py-3 font-medium text-left">创建时间</th>
                          <th className="px-3 py-3 font-medium text-left">上传状态</th>
                          <th className="px-3 py-3 font-medium text-left">同步状态</th>
                          <th className="pl-3 pr-6 py-3 font-medium text-left w-52">操作</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-100 font-sans text-neutral-700 text-xs">
                        {currentContainers.length === 0 ? (
                          <tr>
                            <td colSpan={7} className="px-6 py-12 text-center text-neutral-400">
                              <AlertCircle className="w-8 h-8 text-neutral-300 mx-auto mb-2" />
                              <span>没有检索到与当前筛选条件匹配的容器镜像。</span>
                            </td>
                          </tr>
                        ) : (
                          currentContainers.map((img, index) => (
                            <tr key={img.id} className={cn("hover:bg-neutral-50/30 transition-colors border-b border-neutral-100 text-[13px]", activeImageDropdownId === img.id && "relative z-30 bg-neutral-50")}>
                              <td className="pl-6 pr-3 py-3 text-left font-semibold text-neutral-800 font-mono">{img.name}</td>
                              <td className="px-3 py-3 text-left text-neutral-600">{img.description}</td>
                              <td className="px-3 py-3 text-left text-neutral-600 font-mono">{img.size}</td>
                              <td className="px-3 py-3 text-left text-neutral-600 font-mono">{img.createdAt}</td>
                              <td className="px-3 py-3 text-left text-neutral-600">
                                <span className="bg-green-50 text-green-600 text-[10px] font-bold px-2 py-0.5 rounded border border-green-100">
                                  {img.uploadStatus}
                                </span>
                              </td>
                              <td className="px-3 py-3 text-left text-neutral-600">
                                <span className={cn(
                                  "text-[10px] font-bold px-2 py-0.5 rounded border",
                                  img.syncStatus === "同步成功" && "bg-green-50 text-green-600 border-green-100",
                                  img.syncStatus === "同步中" && "bg-[#fff7e6] text-[#fa8c16] border-[#ffd591]",
                                  img.syncStatus === "同步失败" && "bg-[#fff1f0] text-[#f5222d] border-[#ffa39e]"
                                )}>
                                  {img.syncStatus}
                                </span>
                              </td>
                              <td className={cn("pl-3 pr-6 py-3 text-left font-semibold text-xs select-none", activeImageDropdownId === img.id && "relative z-30")}>
                                <div className={cn("flex items-center gap-2 text-xs relative", activeImageDropdownId === img.id && "z-30")}>
                                  <button
                                    type="button"
                                    onClick={() => handleOpenEditImage(img)}
                                    disabled={img.syncStatus === "同步中"}
                                    className={cn(
                                      "text-[#fa541c] hover:text-[#e84a15] bg-transparent border-0 cursor-pointer text-xs font-semibold p-0",
                                      img.syncStatus === "同步中" && "text-[#ff8d60] cursor-not-allowed"
                                    )}
                                  >
                                    编辑
                                  </button>
                                  <span className="text-neutral-200">|</span>
                                  <button
                                    type="button"
                                    onClick={() => handleSyncImage(img.id, "container")}
                                    disabled={img.syncStatus === "同步中" || img.syncStatus === "同步成功"}
                                    className={cn(
                                      "text-[#fa541c] hover:text-[#e84a15] bg-transparent border-0 cursor-pointer text-xs font-semibold p-0",
                                      (img.syncStatus === "同步中" || img.syncStatus === "同步成功") && "text-[#ff8d60] cursor-not-allowed"
                                    )}
                                  >
                                    同步镜像
                                  </button>
                                  <span className="text-neutral-200">|</span>
                                  <div className="relative">
                                    <button 
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setActiveImageDropdownId(activeImageDropdownId === img.id ? null : img.id);
                                      }}
                                      className="text-[#fa541c] hover:text-[#e84a15] bg-transparent border-0 cursor-pointer text-xs font-semibold p-0 flex items-center gap-0.5"
                                    >
                                      更多 <ChevronDown className="w-3 h-3" />
                                    </button>
                                    {activeImageDropdownId === img.id && (
                                      <div className={cn(
                                        "absolute right-0 bg-white border border-neutral-200 rounded shadow-lg py-1 z-40 min-w-[100px] text-left animate-in fade-in duration-150",
                                        index < 3 ? "top-full mt-1.5 slide-in-from-top-1" : "bottom-full mb-1.5 slide-in-from-bottom-1"
                                      )}>
                                        <button
                                          type="button"
                                          onClick={() => {
                                            setActiveImageDropdownId(null);
                                            handleOpenImageLogs(img.name);
                                          }}
                                          className="w-full text-left px-3.5 py-1.5 text-[12px] bg-transparent border-0 cursor-pointer block transition-all text-neutral-700 hover:text-[#fa541c] hover:bg-orange-50/40 font-semibold"
                                        >
                                          日志
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() => {
                                            setActiveImageDropdownId(null);
                                            handleDeleteImage(img.id, img.name, "container");
                                          }}
                                          disabled={img.syncStatus === "同步中"}
                                          className={cn(
                                            "w-full text-left px-3.5 py-1.5 text-[12px] bg-transparent border-0 cursor-pointer block transition-all font-semibold",
                                            img.syncStatus === "同步中" 
                                              ? "text-neutral-300 cursor-not-allowed" 
                                              : "text-neutral-700 hover:text-neutral-900 hover:bg-neutral-50/60"
                                          )}
                                        >
                                          删除
                                        </button>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  ) : (
                    /* VM IMAGES TABLE */
                    <table className="w-full text-left border-collapse whitespace-nowrap">
                      <thead>
                        <tr className="border-b border-neutral-border/50 bg-[#fafafa] text-[13px] text-neutral-600 select-none">
                          <th className="pl-6 pr-3 py-3 font-medium text-left">镜像名称</th>
                          <th className="px-3 py-3 font-medium text-left">镜像描述</th>
                          <th className="px-3 py-3 font-medium text-left">资源类型</th>
                          <th className="px-3 py-3 font-medium text-left">操作系统</th>
                          <th className="px-3 py-3 font-medium text-left">镜像大小</th>
                          <th className="px-3 py-3 font-medium text-left">创建时间</th>
                          <th className="px-3 py-3 font-medium text-left">上传状态</th>
                          <th className="px-3 py-3 font-medium text-left">同步状态</th>
                          <th className="pl-3 pr-6 py-3 font-medium text-left w-52">操作</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-100 font-sans text-neutral-700 text-xs">
                        {currentVms.length === 0 ? (
                          <tr>
                            <td colSpan={9} className="px-6 py-12 text-center text-neutral-400">
                              <AlertCircle className="w-8 h-8 text-neutral-300 mx-auto mb-2" />
                              <span>没有检索到与当前筛选条件匹配的虚拟机镜像。</span>
                            </td>
                          </tr>
                        ) : (
                          currentVms.map((img, index) => (
                            <tr key={img.id} className={cn("hover:bg-neutral-50/30 transition-colors border-b border-neutral-100 text-[13px]", activeImageDropdownId === img.id && "relative z-30 bg-neutral-50")}>
                              <td className="pl-6 pr-3 py-3 text-left font-semibold text-neutral-800 font-mono">{img.name}</td>
                              <td className="px-3 py-3 text-left text-neutral-600">{img.description}</td>
                              <td className="px-3 py-3 text-left text-neutral-600">
                                <span className="bg-[#fff2e8] text-[#fa541c] text-[10px] font-bold px-2 py-0.5 rounded border border-[#ffbb96]">
                                  {img.resourceType}
                                </span>
                              </td>
                              <td className="px-3 py-3 text-left text-neutral-600 font-mono">{img.os}</td>
                              <td className="px-3 py-3 text-left text-neutral-600 font-mono">{img.size}</td>
                              <td className="px-3 py-3 text-left text-neutral-600 font-mono">{img.createdAt}</td>
                              <td className="px-3 py-3 text-left text-neutral-600">
                                <span className="bg-green-50 text-green-600 text-[10px] font-bold px-2 py-0.5 rounded border border-green-100">
                                  {img.uploadStatus}
                                </span>
                              </td>
                              <td className="px-3 py-3 text-left text-neutral-600">
                                <span className={cn(
                                  "text-[10px] font-bold px-2 py-0.5 rounded border",
                                  img.syncStatus === "同步成功" && "bg-green-50 text-green-600 border-green-100",
                                  img.syncStatus === "同步中" && "bg-[#fff7e6] text-[#fa8c16] border-[#ffd591]",
                                  img.syncStatus === "同步失败" && "bg-[#fff1f0] text-[#f5222d] border-[#ffa39e]"
                                )}>
                                  {img.syncStatus}
                                </span>
                              </td>
                              <td className={cn("pl-3 pr-6 py-3 text-left font-semibold text-xs select-none", activeImageDropdownId === img.id && "relative z-30")}>
                                <div className={cn("flex items-center gap-2 text-xs relative", activeImageDropdownId === img.id && "z-30")}>
                                  <button
                                    type="button"
                                    onClick={() => handleOpenEditImage(img)}
                                    disabled={img.syncStatus === "同步中"}
                                    className={cn(
                                      "text-[#fa541c] hover:text-[#e84a15] bg-transparent border-0 cursor-pointer text-xs font-semibold p-0",
                                      img.syncStatus === "同步中" && "text-[#ff8d60] cursor-not-allowed"
                                    )}
                                  >
                                    编辑
                                  </button>
                                  <span className="text-neutral-200">|</span>
                                  <button
                                    type="button"
                                    onClick={() => handleSyncImage(img.id, "vm")}
                                    disabled={img.syncStatus === "同步中" || img.syncStatus === "同步成功"}
                                    className={cn(
                                      "text-[#fa541c] hover:text-[#e84a15] bg-transparent border-0 cursor-pointer text-xs font-semibold p-0",
                                      (img.syncStatus === "同步中" || img.syncStatus === "同步成功") && "text-[#ff8d60] cursor-not-allowed"
                                    )}
                                  >
                                    同步镜像
                                  </button>
                                  <span className="text-neutral-200">|</span>
                                  <div className="relative">
                                    <button 
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setActiveImageDropdownId(activeImageDropdownId === img.id ? null : img.id);
                                      }}
                                      className="text-[#fa541c] hover:text-[#e84a15] bg-transparent border-0 cursor-pointer text-xs font-semibold p-0 flex items-center gap-0.5"
                                    >
                                      更多 <ChevronDown className="w-3 h-3" />
                                    </button>
                                    {activeImageDropdownId === img.id && (
                                      <div className={cn(
                                        "absolute right-0 bg-white border border-neutral-200 rounded shadow-lg py-1 z-40 min-w-[100px] text-left animate-in fade-in duration-150",
                                        index < 3 ? "top-full mt-1.5 slide-in-from-top-1" : "bottom-full mb-1.5 slide-in-from-bottom-1"
                                      )}>
                                        <button
                                          type="button"
                                          onClick={() => {
                                            setActiveImageDropdownId(null);
                                            handleOpenImageLogs(img.name);
                                          }}
                                          className="w-full text-left px-3.5 py-1.5 text-[12px] bg-transparent border-0 cursor-pointer block transition-all text-neutral-700 hover:text-[#fa541c] hover:bg-orange-50/40 font-semibold"
                                        >
                                          日志
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() => {
                                            setActiveImageDropdownId(null);
                                            handleDeleteImage(img.id, img.name, "vm");
                                          }}
                                          disabled={img.syncStatus === "同步中"}
                                          className={cn(
                                            "w-full text-left px-3.5 py-1.5 text-[12px] bg-transparent border-0 cursor-pointer block transition-all font-semibold",
                                            img.syncStatus === "同步中" 
                                              ? "text-neutral-300 cursor-not-allowed" 
                                              : "text-neutral-700 hover:text-neutral-900 hover:bg-neutral-50/60"
                                          )}
                                        >
                                          删除
                                        </button>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  )}
                </div>
                
                {/* Pagination styled like Question Management */}
                <div className="flex items-center justify-end px-6 py-4 gap-4 bg-white select-none shrink-0">
                  <span className="text-[13px] text-neutral-500">共 {imageSubTab === "container" ? totalContainers : totalVm} 条</span>
                  <div className="flex items-center gap-2">
                    <button 
                      disabled={imageSubTab === "container" ? activeContainerPage === 1 : activeVmPage === 1}
                      onClick={() => {
                        if (imageSubTab === "container") {
                          setContainerCurrentPage(activeContainerPage - 1);
                        } else {
                          setVmCurrentPage(activeVmPage - 1);
                        }
                      }}
                      className={cn(
                        "h-7 w-7 rounded-sm border border-neutral-200 flex items-center justify-center text-[12px] font-medium transition-colors bg-white hover:bg-neutral-50 cursor-pointer",
                        (imageSubTab === "container" ? activeContainerPage === 1 : activeVmPage === 1) 
                          ? "text-neutral-300 bg-neutral-50 cursor-not-allowed border-neutral-150 hover:bg-neutral-50" 
                          : "text-neutral-600 hover:border-[#fa541c] hover:text-[#fa541c]"
                      )}
                    >
                      &lt;
                    </button>
                    {Array.from({ length: Math.max(1, imageSubTab === "container" ? totalContainerPages : totalVmPages) }, (_, i) => i + 1).map((p) => (
                      <button
                        key={p}
                        onClick={() => {
                          if (imageSubTab === "container") {
                            setContainerCurrentPage(p);
                          } else {
                            setVmCurrentPage(p);
                          }
                        }}
                        className={cn(
                          "h-7 w-7 rounded-sm border text-[12px] font-bold transition-colors cursor-pointer flex items-center justify-center",
                          p === (imageSubTab === "container" ? activeContainerPage : activeVmPage) 
                            ? "bg-[#fa541c] text-white border-[#fa541c]" 
                            : "bg-white border-neutral-200 text-neutral-600 hover:border-[#fa541c] hover:text-[#fa541c]"
                        )}
                      >
                        {p}
                      </button>
                    ))}
                    <button 
                      disabled={imageSubTab === "container" ? activeContainerPage === totalContainerPages || totalContainerPages === 0 : activeVmPage === totalVmPages || totalVmPages === 0}
                      onClick={() => {
                        if (imageSubTab === "container") {
                          setContainerCurrentPage(activeContainerPage + 1);
                        } else {
                          setVmCurrentPage(activeVmPage + 1);
                        }
                      }}
                      className={cn(
                        "h-7 w-7 rounded-sm border border-neutral-200 flex items-center justify-center text-[12px] font-medium transition-colors bg-white hover:bg-neutral-50 cursor-pointer",
                        (imageSubTab === "container" ? activeContainerPage === totalContainerPages || totalContainerPages === 0 : activeVmPage === totalVmPages || totalVmPages === 0) 
                          ? "text-neutral-300 bg-neutral-50 cursor-not-allowed border-neutral-150 hover:bg-neutral-50" 
                          : "text-neutral-600 hover:border-[#fa541c] hover:text-[#fa541c]"
                      )}
                    >
                      &gt;
                    </button>
                  </div>
                  <select className="text-[13px] border border-neutral-200 rounded-sm px-2 py-1 focus:outline-none focus:border-[#fa541c] text-neutral-600 bg-white cursor-pointer h-7">
                    <option>{imagePageSize} 条/页</option>
                  </select>
                </div>

              </div>
            </div>
          );
        })()}

        {/* --- Delete Confirmation Modal --- */}
        {deleteConfirm.show && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/45 backdrop-blur-[2px] animate-fade-in text-left">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-[420px] overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
              {/* Header */}
              <div className="px-6 py-4 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/50 shrink-0">
                <h2 className="text-[16px] font-bold text-[#262626]">
                  {deleteConfirm.title}
                </h2>
                <button 
                  type="button"
                  onClick={() => setDeleteConfirm(prev => ({ ...prev, show: false }))} 
                  className="text-neutral-400 hover:text-[#fa541c] p-1.5 hover:bg-neutral-100 rounded-[4px] transition-colors border-0 bg-transparent cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>


              {/* Body */}
              <div className="p-6 flex items-start gap-3 bg-white">
                <div className="w-5 h-5 rounded-full bg-[#fa541c] text-white flex items-center justify-center font-bold text-[13px] shrink-0 select-none mt-0.5">!</div>
                <div className="text-[14px] text-neutral-700 leading-normal font-medium">
                  {deleteConfirm.message}
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 py-4 border-t border-neutral-100 bg-neutral-50/50 flex items-center justify-end gap-3 shrink-0">
                <button 
                  type="button"
                  onClick={() => setDeleteConfirm(prev => ({ ...prev, show: false }))} 
                  className="border border-neutral-200 text-neutral-600 font-bold h-9 px-5 text-[13px] rounded-[4px] transition-colors bg-white cursor-pointer hover:bg-neutral-50"
                >
                  取消
                </button>
                <button 
                  type="button"
                  onClick={() => {
                    deleteConfirm.onConfirm();
                    setDeleteConfirm(prev => ({ ...prev, show: false }));
                  }} 
                  className="bg-[#fa541c] hover:bg-[#e84a15] text-white font-bold h-9 px-5 text-[13px] rounded-[4px] shadow-sm transition-colors border-0 cursor-pointer"
                >
                  确定
                </button>
              </div>
            </div>
          </div>
        )}

        {/* --- Upload Image Drawer (Style aligned with TeacherQuestions drawer) --- */}
        {uploadImageModalOpen && (
          <div 
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-[2px] flex justify-end animate-fade-in text-left"
            onClick={() => {
              setUploadImageModalOpen(false);
              setNewImageName("");
              setNewImageDesc("");
              setNewImageSize("");
              setNewImageNamespace("");
              setNewImageVersion("");
              setNewImageOs("");
              setNewImageResType("");
              setDeleteProtection(false);
              setSelectedFileName("");
            }}
          >
            <form 
              onSubmit={handleSaveUploadedImage}
              className="bg-white w-full max-w-[660px] h-screen flex flex-col shadow-2xl border-l border-neutral-100 animate-in slide-in-from-right duration-300"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Drawer Header */}
              <div className="px-6 py-4 border-b border-neutral-100 flex justify-between items-center bg-neutral-50/50 shrink-0">
                <h2 className="text-[16px] font-bold text-[#262626] flex items-center gap-2">
                  <Plus className="w-5 h-5 text-[#fa541c]" />
                  <span>上传镜像</span>
                </h2>
                <button 
                  type="button"
                  onClick={() => {
                    setUploadImageModalOpen(false);
                    setNewImageName("");
                    setNewImageDesc("");
                    setNewImageSize("");
                    setNewImageNamespace("");
                    setNewImageVersion("");
                    setNewImageOs("");
                    setNewImageResType("");
                    setNewImageArch("");
                    setDeleteProtection(false);
                    setSelectedFileName("");
                  }}
                  className="text-neutral-400 hover:text-[#fa541c] p-1.5 hover:bg-neutral-100 rounded-[4px] transition-colors border-0 bg-transparent cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Drawer Content */}
              <div className="p-6 overflow-y-auto space-y-5 custom-scrollbar flex-1 bg-white">
                
                {/* 镜像类型 */}
                <div className="grid grid-cols-[100px_1fr] items-center gap-4">
                  <label className="text-[13px] font-bold text-[#262626] text-right">
                    镜像类型 <span className="text-[#fa541c]">*</span>
                  </label>
                  <div className="flex items-center gap-6 select-none text-[13px] font-medium">
                    <div 
                      onClick={() => setUploadImageType("container")}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      {uploadImageType === "container" ? (
                        <div className="w-4 h-4 rounded-full border-2 border-[#fa541c] flex items-center justify-center">
                          <div className="w-2 h-2 rounded-full bg-[#fa541c]" />
                        </div>
                      ) : (
                        <div className="w-4 h-4 rounded-full border-2 border-neutral-300" />
                      )}
                      <span className={uploadImageType === "container" ? "text-[#fa541c] font-bold" : "text-neutral-700"}>
                        容器镜像
                      </span>
                    </div>

                    <div 
                      onClick={() => setUploadImageType("vm")}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      {uploadImageType === "vm" ? (
                        <div className="w-4 h-4 rounded-full border-2 border-[#fa541c] flex items-center justify-center">
                          <div className="w-2 h-2 rounded-full bg-[#fa541c]" />
                        </div>
                      ) : (
                        <div className="w-4 h-4 rounded-full border-2 border-neutral-300" />
                      )}
                      <span className={uploadImageType === "vm" ? "text-[#fa541c] font-bold" : "text-neutral-700"}>
                        虚拟机镜像
                      </span>
                    </div>
                  </div>
                </div>

                {/* 镜像名称 */}
                <div className="grid grid-cols-[100px_1fr] items-center gap-4">
                  <label className="text-[13px] font-bold text-[#262626] text-right">
                    镜像名称 <span className="text-[#fa541c]">*</span>
                  </label>
                  <div className="relative w-full">
                    <input
                      type="text"
                      required
                      maxLength={128}
                      placeholder="请输入镜像名称"
                      value={newImageName}
                      onChange={(e) => setNewImageName(e.target.value)}
                      className="h-[36px] w-full border border-neutral-200 rounded px-3.5 pr-16 py-2 text-xs focus:outline-none focus:border-[#fa541c] focus:ring-1 focus:ring-[#fa541c] text-neutral-700 placeholder-neutral-400 font-medium transition-all"
                    />
                    <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[11px] text-neutral-400 select-none">
                      {newImageName.length} / 128
                    </span>
                  </div>
                </div>

                {uploadImageType === "container" ? (
                  <>
                    {/* 命名空间 */}
                    <div className="grid grid-cols-[100px_1fr] items-center gap-4">
                      <label className="text-[13px] font-bold text-[#262626] text-right">
                        命名空间 <span className="text-[#fa541c]">*</span>
                      </label>
                      <div className="relative w-full">
                        <input
                          type="text"
                          required
                          maxLength={100}
                          placeholder="请输入命名空间"
                          value={newImageNamespace}
                          onChange={(e) => setNewImageNamespace(e.target.value)}
                          className="h-[36px] w-full border border-neutral-200 rounded px-3.5 pr-16 py-2 text-xs focus:outline-none focus:border-[#fa541c] focus:ring-1 focus:ring-[#fa541c] text-neutral-700 placeholder-neutral-400 font-medium transition-all"
                        />
                        <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[11px] text-neutral-400 select-none">
                          {newImageNamespace.length} / 100
                        </span>
                      </div>
                    </div>

                    {/* 版本号 */}
                    <div className="grid grid-cols-[100px_1fr] items-center gap-4">
                      <label className="text-[13px] font-bold text-[#262626] text-right">
                        版本号 <span className="text-[#fa541c]">*</span>
                      </label>
                      <div className="relative w-full">
                        <input
                          type="text"
                          required
                          maxLength={100}
                          placeholder="请输入版本号"
                          value={newImageVersion}
                          onChange={(e) => setNewImageVersion(e.target.value)}
                          className="h-[36px] w-full border border-neutral-200 rounded px-3.5 pr-16 py-2 text-xs focus:outline-none focus:border-[#fa541c] focus:ring-1 focus:ring-[#fa541c] text-neutral-700 placeholder-neutral-400 font-medium transition-all"
                        />
                        <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[11px] text-neutral-400 select-none">
                          {newImageVersion.length} / 100
                        </span>
                      </div>
                    </div>

                    {/* 镜像描述 */}
                    <div className="grid grid-cols-[100px_1fr] items-center gap-4">
                      <label className="text-[13px] font-bold text-[#262626] text-right">
                        镜像描述 <span className="text-[#fa541c]">*</span>
                      </label>
                      <div className="relative w-full">
                        <input
                          type="text"
                          required
                          maxLength={100}
                          placeholder="请输入镜像描述"
                          value={newImageDesc}
                          onChange={(e) => setNewImageDesc(e.target.value)}
                          className="h-[36px] w-full border border-neutral-200 rounded px-3.5 pr-16 py-2 text-xs focus:outline-none focus:border-[#fa541c] focus:ring-1 focus:ring-[#fa541c] text-neutral-700 placeholder-neutral-400 font-medium transition-all"
                        />
                        <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[11px] text-neutral-400 select-none">
                          {newImageDesc.length} / 100
                        </span>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    {/* 镜像描述 */}
                    <div className="grid grid-cols-[100px_1fr] items-center gap-4">
                      <label className="text-[13px] font-bold text-[#262626] text-right">
                        镜像描述 <span className="text-[#fa541c]">*</span>
                      </label>
                      <div className="relative w-full">
                        <input
                          type="text"
                          required
                          maxLength={100}
                          placeholder="请输入镜像描述"
                          value={newImageDesc}
                          onChange={(e) => setNewImageDesc(e.target.value)}
                          className="h-[36px] w-full border border-neutral-200 rounded px-3.5 pr-16 py-2 text-xs focus:outline-none focus:border-[#fa541c] focus:ring-1 focus:ring-[#fa541c] text-neutral-700 placeholder-neutral-400 font-medium transition-all"
                        />
                        <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[11px] text-neutral-400 select-none">
                          {newImageDesc.length} / 100
                        </span>
                      </div>
                    </div>

                    {/* 系统类型 */}
                    <div className="grid grid-cols-[100px_1fr] items-center gap-4">
                      <label className="text-[13px] font-bold text-[#262626] text-right">
                        系统类型 <span className="text-[#fa541c]">*</span>
                      </label>
                      <div ref={osDropdownRef} className="relative w-full text-xs">
                        <div
                          onClick={() => setIsOsDropdownOpen(!isOsDropdownOpen)}
                          className={cn(
                            "h-[36px] w-full border border-neutral-200 rounded px-3.5 py-2 flex items-center justify-between transition-all bg-white cursor-pointer select-none",
                            isOsDropdownOpen ? "border-[#fa541c] ring-1 ring-[#fa541c]" : "hover:border-[#fa541c]"
                          )}
                        >
                          <span className={cn(newImageOs ? "text-neutral-700 font-medium" : "text-neutral-400")}>
                            {newImageOs || "请选择系统类型"}
                          </span>
                          <ChevronDown 
                            className={cn("w-3.5 h-3.5 transition-transform duration-200 text-neutral-400", isOsDropdownOpen && "rotate-180")} 
                          />
                        </div>

                        {/* Dropdown Menu */}
                        {isOsDropdownOpen && (
                          <div className="absolute left-0 right-0 mt-1 bg-white border border-neutral-200 rounded shadow-lg z-[150] overflow-hidden flex flex-col py-1 animate-in fade-in slide-in-from-top-1 duration-150">
                            <div className="max-h-[200px] overflow-y-auto custom-scrollbar">
                              {[
                                { value: "LINUX", label: "LINUX" },
                                { value: "WINDOWS", label: "WINDOWS" }
                              ].map((opt) => (
                                <div
                                  key={opt.value}
                                  onClick={() => {
                                    setNewImageOs(opt.value);
                                    setIsOsDropdownOpen(false);
                                  }}
                                  className={cn(
                                    "px-3.5 py-2 hover:bg-neutral-50 cursor-pointer text-neutral-700 transition-colors text-[13px]",
                                    newImageOs === opt.value && "text-[#fa541c] bg-orange-50/20 font-bold"
                                  )}
                                >
                                  {opt.label}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* 资源类型 */}
                    <div className="grid grid-cols-[100px_1fr] items-center gap-4">
                      <label className="text-[13px] font-bold text-[#262626] text-right">
                        资源类型 <span className="text-[#fa541c]">*</span>
                      </label>
                      <div ref={resTypeDropdownRef} className="relative w-full text-xs">
                        <div
                          onClick={() => setIsResTypeDropdownOpen(!isResTypeDropdownOpen)}
                          className={cn(
                            "h-[36px] w-full border border-neutral-200 rounded px-3.5 py-2 flex items-center justify-between transition-all bg-white cursor-pointer select-none",
                            isResTypeDropdownOpen ? "border-[#fa541c] ring-1 ring-[#fa541c]" : "hover:border-[#fa541c]"
                          )}
                        >
                          <span className={cn(newImageResType ? "text-neutral-700 font-medium" : "text-neutral-400")}>
                            {newImageResType || "请选择资源类型"}
                          </span>
                          <ChevronDown 
                            className={cn("w-3.5 h-3.5 transition-transform duration-200 text-neutral-400", isResTypeDropdownOpen && "rotate-180")} 
                          />
                        </div>

                        {/* Dropdown Menu */}
                        {isResTypeDropdownOpen && (
                          <div className="absolute left-0 right-0 mt-1 bg-white border border-neutral-200 rounded shadow-lg z-[150] overflow-hidden flex flex-col py-1 animate-in fade-in slide-in-from-top-1 duration-150">
                            <div className="max-h-[200px] overflow-y-auto custom-scrollbar">
                              {[
                                { value: "云主机", label: "云主机" },
                                { value: "GPU主机", label: "GPU主机" }
                              ].map((opt) => (
                                <div
                                  key={opt.value}
                                  onClick={() => {
                                    setNewImageResType(opt.value);
                                    setIsResTypeDropdownOpen(false);
                                  }}
                                  className={cn(
                                    "px-3.5 py-2 hover:bg-neutral-50 cursor-pointer text-neutral-700 transition-colors text-[13px]",
                                    newImageResType === opt.value && "text-[#fa541c] bg-orange-50/20 font-bold"
                                  )}
                                >
                                  {opt.label}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* 系统架构 */}
                    <div className="grid grid-cols-[100px_1fr] items-center gap-4">
                      <label className="text-[13px] font-bold text-[#262626] text-right">
                        系统架构 <span className="text-[#fa541c]">*</span>
                      </label>
                      <div ref={archDropdownRef} className="relative w-full text-xs">
                        <div
                          onClick={() => setIsArchDropdownOpen(!isArchDropdownOpen)}
                          className={cn(
                            "h-[36px] w-full border border-neutral-200 rounded px-3.5 py-2 flex items-center justify-between transition-all bg-white cursor-pointer select-none",
                            isArchDropdownOpen ? "border-[#fa541c] ring-1 ring-[#fa541c]" : "hover:border-[#fa541c]"
                          )}
                        >
                          <span className={cn(newImageArch ? "text-neutral-700 font-medium" : "text-neutral-400")}>
                            {newImageArch || "请选择系统架构"}
                          </span>
                          <ChevronDown 
                            className={cn("w-3.5 h-3.5 transition-transform duration-200 text-neutral-400", isArchDropdownOpen && "rotate-180")} 
                          />
                        </div>

                        {/* Dropdown Menu */}
                        {isArchDropdownOpen && (
                          <div className="absolute left-0 right-0 mt-1 bg-white border border-neutral-200 rounded shadow-lg z-[150] overflow-hidden flex flex-col py-1 animate-in fade-in slide-in-from-top-1 duration-150">
                            <div className="max-h-[200px] overflow-y-auto custom-scrollbar">
                              {[
                                { value: "x86_64", label: "x86_64" },
                                { value: "aarch64", label: "aarch64" }
                              ].map((opt) => (
                                <div
                                  key={opt.value}
                                  onClick={() => {
                                    setNewImageArch(opt.value);
                                    setIsArchDropdownOpen(false);
                                  }}
                                  className={cn(
                                    "px-3.5 py-2 hover:bg-neutral-50 cursor-pointer text-neutral-700 transition-colors text-[13px]",
                                    newImageArch === opt.value && "text-[#fa541c] bg-orange-50/20 font-bold"
                                  )}
                                >
                                  {opt.label}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                )}

                {/* 镜像上传 */}
                <div className="grid grid-cols-[100px_1fr] items-start gap-4">
                  <label className="text-[13px] font-bold text-[#262626] text-right mt-1.5">
                    镜像上传
                  </label>
                  <div className="flex flex-col items-start">
                    <input 
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      accept={uploadImageType === "container" ? ".zip,.tgz,.tar,.tar.gz" : ".qcow2"}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setSelectedFileName(file.name);
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="bg-[#fa541c] hover:bg-[#e84a15] text-white text-xs font-bold px-4 py-2 rounded-[4px] transition-colors cursor-pointer border-0 inline-flex items-center gap-1.5 shadow-3xs"
                    >
                      上传文件
                    </button>
                    {selectedFileName ? (
                      <div className="flex items-center gap-2 mt-2 text-xs text-neutral-600 font-medium">
                        <FileText className="w-4 h-4 text-[#fa541c]" />
                        <span className="truncate max-w-xs">{selectedFileName}</span>
                        <button 
                          type="button" 
                          onClick={() => setSelectedFileName("")} 
                          className="text-red-500 hover:text-red-700 cursor-pointer border-0 bg-transparent p-0 flex items-center"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <span className="text-[11px] text-neutral-400 mt-2">
                        {uploadImageType === "container" ? "只支持.zip/.tgz/.tar/.tar.gz等格式" : "只支持.qcow2格式"}
                      </span>
                    )}
                  </div>
                </div>

                {/* 删除保护 */}
                <div className="grid grid-cols-[100px_1fr] items-center gap-4">
                  <label className="text-[13px] font-bold text-[#262626] text-right">
                    删除保护 <span className="text-[#fa541c]">*</span>
                  </label>
                  <div className="flex items-center gap-3 select-none">
                    <span className={cn("text-[13px] font-medium transition-colors", !deleteProtection ? "text-[#fa541c] font-bold" : "text-neutral-500")}>
                      不限制
                    </span>
                    <button
                      type="button"
                      onClick={() => setDeleteProtection(!deleteProtection)}
                      className={cn(
                        "w-11 h-6 rounded-full p-0.5 transition-colors duration-200 focus:outline-none cursor-pointer border-0 flex items-center",
                        deleteProtection ? "bg-[#fa541c]" : "bg-neutral-200"
                      )}
                    >
                      <div
                        className={cn(
                          "w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-200",
                          deleteProtection ? "translate-x-5" : "translate-x-0"
                        )}
                      />
                    </button>
                    <span className={cn("text-[13px] font-medium transition-colors", deleteProtection ? "text-[#fa541c] font-bold" : "text-neutral-500")}>
                      限制删除
                    </span>
                  </div>
                </div>

              </div>

              {/* Drawer Footer */}
              <div className="px-6 py-4 border-t border-neutral-100 bg-neutral-50/50 flex items-center justify-end gap-3 shrink-0 select-none">
                <button 
                  type="button"
                  onClick={() => {
                    setUploadImageModalOpen(false);
                    setNewImageName("");
                    setNewImageDesc("");
                    setNewImageSize("");
                    setNewImageNamespace("");
                    setNewImageVersion("");
                    setNewImageOs("");
                    setNewImageResType("");
                    setNewImageArch("");
                    setDeleteProtection(false);
                    setSelectedFileName("");
                  }}
                  className="border border-neutral-200 hover:bg-neutral-50 text-neutral-600 font-bold h-9 px-5 text-[13px] rounded cursor-pointer bg-white"
                >
                  取消
                </button>
                <button 
                  type="submit" 
                  className="bg-[#fa541c] hover:bg-[#e84a15] text-white font-bold h-9 px-6 text-[13px] rounded transition-colors border-0 cursor-pointer"
                >
                  确定
                </button>
              </div>
            </form>
          </div>
        )}

      </div>
    </div>
  );
}
