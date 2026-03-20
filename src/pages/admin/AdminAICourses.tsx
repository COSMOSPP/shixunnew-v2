import React from "react";
import AdminStandardPage from "./AdminStandardPage";
import { BookOpen, Users, Star, Clock, CheckCircle, AlertTriangle } from "lucide-react";

export default function AdminAICourses() {
  return (
    <AdminStandardPage 
      title="人工智能课程管理" 
      description="管理AI相关课程、视频、文档及学习进度统计"
      primaryAction="发布课程"
      stats={[
        { title: "课程总数", value: "156", icon: BookOpen, trend: "12", trendUp: true },
        { title: "学习人次", value: "45.2k", icon: Users, trend: "5.4k", trendUp: true },
        { title: "平均评分", value: "4.8", icon: Star, trend: "0.1", trendUp: true },
        { title: "待审核", value: "8", icon: AlertTriangle, trend: "2", trendUp: false }
      ]}
      columns={["课程名称", "分类", "讲师", "学习人数", "状态", "更新时间"]}
      data={[
        ["DeepSeek 大模型私有化部署实战", "大模型部署", "张三", "1,204", "已发布", "2026-03-15"],
        ["基于 Dify 搭建企业级智能知识库", "AI工程化", "李四", "856", "已发布", "2026-03-10"],
        ["Python 深度学习基础理论", "基础理论", "王五", "3,420", "已发布", "2026-02-28"],
        ["人工智能开源工具链串讲", "开源工具", "赵六", "1,500", "待审核", "2026-03-17"]
      ]}
    />
  );
}
