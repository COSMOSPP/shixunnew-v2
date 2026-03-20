import React from "react";
import AdminStandardPage from "./AdminStandardPage";
import { FlaskConical, Server, Activity, CheckCircle, AlertTriangle } from "lucide-react";

export default function AdminAIExperiments() {
  return (
    <AdminStandardPage 
      title="人工智能实验管理" 
      description="管理AI实验环境、镜像、算力分配与实验报告"
      primaryAction="创建实验"
      stats={[
        { title: "实验总数", value: "84", icon: FlaskConical, trend: "5", trendUp: true },
        { title: "活跃实例", value: "320", icon: Server, trend: "45", trendUp: true },
        { title: "算力消耗", value: "12.5k", icon: Activity, trend: "1.2k", trendUp: true },
        { title: "资源告警", value: "2", icon: AlertTriangle, trend: "1", trendUp: false }
      ]}
      columns={["实验名称", "所需算力", "镜像环境", "活跃人数", "状态", "创建时间"]}
      data={[
        ["Llama-3-8B 微调实验", "1x A100 (40GB)", "PyTorch 2.2", "45", "进行中", "2026-03-15"],
        ["Stable Diffusion 图像生成", "1x RTX4090", "CUDA 12.1", "120", "进行中", "2026-03-10"],
        ["LangChain 智能体开发", "CPU Only", "Python 3.10", "85", "进行中", "2026-02-28"],
        ["Whisper 语音识别部署", "1x T4", "TensorFlow 2.15", "32", "维护中", "2026-03-17"]
      ]}
    />
  );
}
