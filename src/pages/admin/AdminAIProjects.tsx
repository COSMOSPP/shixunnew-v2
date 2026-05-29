import React from "react";
import AdminStandardPage from "./AdminStandardPage";
import { FolderKanban, Users, Clock, AlertTriangle } from "lucide-react";

export default function AdminAIProjects() {
  return (
    <AdminStandardPage 
      title="人工智能项目管理" 
      description="管理AI实训项目模板、学生实训项目及容器沙箱部署状态"
      primaryAction="新建项目"
      stats={[
        { title: "项目模板数", value: "48", icon: FolderKanban, trend: "8", trendUp: true },
        { title: "活跃学生项目", value: "1,520", icon: Users, trend: "240", trendUp: true },
        { title: "容器运行数", value: "320", icon: Clock, trend: "45", trendUp: true },
        { title: "运行告警", value: "1", icon: AlertTriangle, trend: "0", trendUp: false }
      ]}
      columns={["项目名称", "适用方向", "容器规格", "当前人数", "状态", "创建时间"]}
      data={[
        ["云原生微服务高并发电商实训项目", "微服务架构", "2C4G", "340", "可用", "2026-03-15"],
        ["ResNet50医学影像病灶智能分割项目", "计算机视觉", "4C8G + 1x T4", "520", "可用", "2026-03-10"],
        ["基于 RAG 的垂直行业大模型检索项目", "自然语言处理", "4C16G + 1x V100", "280", "可用", "2026-03-01"],
        ["大数据基础与分布式计算实训项目", "数据工程", "8C16G", "180", "维护中", "2026-03-17"]
      ]}
    />
  );
}
