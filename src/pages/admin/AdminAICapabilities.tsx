import React from "react";
import AdminStandardPage from "./AdminStandardPage";
import { Cpu, Activity, CheckCircle, Clock } from "lucide-react";

export default function AdminAICapabilities() {
  return (
    <AdminStandardPage 
      title="AI能力管理" 
      description="管理实训平台的AI模型基础能力、API授权与调用统计"
      primaryAction="接入能力"
      stats={[
        { title: "AI能力实例", value: "15", icon: Cpu, trend: "3", trendUp: true },
        { title: "接口调用量", value: "4.5M", icon: Activity, trend: "12%", trendUp: true },
        { title: "服务可用性", value: "99.98%", icon: CheckCircle, trend: "0.01%", trendUp: true },
        { title: "核心延迟", value: "180ms", icon: Clock, trend: "-15ms", trendUp: true }
      ]}
      columns={["能力名称", "类型", "接口地址", "可用状态", "调用次数"]}
      data={[
        ["AI对话助手能力", "大语言模型", "/api/ai/chat", "启用中", "2,150,421"],
        ["AI绘图绘画能力", "文生图", "/api/ai/image", "启用中", "850,294"],
        ["代码自动生成能力", "代码大模型", "/api/ai/codegen", "维护中", "1,204,532"],
        ["语音转文本能力", "语音识别", "/api/ai/stt", "启用中", "352,105"]
      ]}
    />
  );
}
