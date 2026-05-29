import React from "react";
import AdminStandardPage from "./AdminStandardPage";
import { Database, FileText, Download, ShieldAlert } from "lucide-react";

export default function AdminAIDatasets() {
  return (
    <AdminStandardPage 
      title="人工智能数据集管理" 
      description="集中管控全平台科研、教学、实训用的共享及公开数据集"
      primaryAction="上传数据集"
      stats={[
        { title: "在架数据集", value: "112", icon: Database, trend: "15", trendUp: true },
        { title: "总文件大小", value: "85.4 TB", icon: FileText, trend: "2.4 TB", trendUp: true },
        { title: "累计下载量", value: "12.4k", icon: Download, trend: "1.5k", trendUp: true },
        { title: "安全审计项", value: "0", icon: ShieldAlert, trend: "稳定", trendUp: true }
      ]}
      columns={["数据集名称", "大小", "发布教师", "引用次数", "状态", "上传时间"]}
      data={[
        ["MNIST手写数字高维分类基准数据集", "11.6 MB", "平台系统管理员", "98", "已上架", "2026-01-10"],
        ["大模型 RAG 向量重排检索数据集", "285 MB", "刘松林 教授", "18", "已上架", "2026-03-12"],
        ["多模态中文医疗问答微调数据集", "450 MB", "李教授", "12", "已上架", "2026-04-05"],
        ["ImageNet-1K 图像分类测试子集", "12.5 GB", "张瑞林 副教授", "45", "审核中", "2026-03-17"]
      ]}
    />
  );
}
