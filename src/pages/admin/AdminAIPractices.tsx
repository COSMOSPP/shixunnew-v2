import React from "react";
import AdminStandardPage from "./AdminStandardPage";
import { Star, Users, CheckCircle, Clock } from "lucide-react";

export default function AdminAIPractices() {
  return (
    <AdminStandardPage 
      title="最佳实践库管理" 
      description="管理推荐给教师与学生的AI最佳实践应用、场景模版与公开审核"
      primaryAction="新建实践"
      stats={[
        { title: "模版总数", value: "48", icon: Star, trend: "5", trendUp: true },
        { title: "使用人次", value: "12.5k", icon: Users, trend: "22%", trendUp: true },
        { title: "好评率", value: "98.5%", icon: CheckCircle, trend: "0.5%", trendUp: true },
        { title: "待审模版", value: "6", icon: Clock, trend: "-2", trendUp: true }
      ]}
      columns={["实践名称", "应用场景", "作者", "使用次数", "公开状态"]}
      data={[
        ["AI出题与智能评阅实践", "教学助手", "张旭东 教授", "4,520", "已公开"],
        ["Python代码自动补全与重构", "编程辅助", "系统管理员", "3,890", "已公开"],
        ["英语多轮口语对话陪练", "语言学习", "李瑞 讲师", "2,140", "已公开"],
        ["高考试卷智能分析模版", "考试评测", "王强 教授", "1,950", "草稿"]
      ]}
    />
  );
}
