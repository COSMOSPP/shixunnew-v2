import React from "react";
import { ChevronRight, Edit, FileText, Sparkles, User, Lightbulb, Calendar, Send, Target } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from "recharts";

const radarData = [
  { subject: "编程", A: 85, fullMark: 100 },
  { subject: "数学", A: 75, fullMark: 100 },
  { subject: "算法", A: 80, fullMark: 100 },
  { subject: "理论", A: 90, fullMark: 100 },
  { subject: "数据", A: 70, fullMark: 100 },
  { subject: "应用", A: 85, fullMark: 100 },
];

export default function UserPersona() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center text-sm text-neutral-caption">
          <Link to="/user" className="hover:text-primary cursor-pointer transition-colors">首页</Link>
          <ChevronRight className="w-4 h-4 mx-1" />
          <span className="text-neutral-title font-medium">用户画像</span>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="h-8">
            <FileText className="w-4 h-4 mr-2" /> 完善画像问卷
          </Button>
          <Button variant="outline" size="sm" className="h-8 border-primary text-primary hover:bg-primary/5">
            <Edit className="w-4 h-4 mr-2" /> 修改画像信息
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Role & Domain */}
        <div className="space-y-6">
          <Card className="border-neutral-border shadow-sm">
            <CardHeader className="pb-2 border-b border-neutral-border">
              <CardTitle className="text-base font-bold text-neutral-title flex items-center gap-2">
                <User className="w-5 h-5 text-blue-500" />
                身份角色与领域
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-blue-50 border-2 border-blue-100 flex items-center justify-center shrink-0">
                  <User className="w-8 h-8 text-blue-400" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-neutral-title mb-1">张三</h2>
                  <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-semibold rounded-[4px]">学生</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-neutral-border border-dashed">
                  <span className="text-sm text-neutral-caption">院校</span>
                  <span className="text-sm font-medium text-neutral-title">清华大学</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-neutral-border border-dashed">
                  <span className="text-sm text-neutral-caption">院系</span>
                  <span className="text-sm font-medium text-neutral-title">计算机科学与技术系</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-neutral-border border-dashed">
                  <span className="text-sm text-neutral-caption">专业</span>
                  <span className="text-sm font-medium text-neutral-title">人工智能</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-neutral-border border-dashed">
                  <span className="text-sm text-neutral-caption">年级</span>
                  <span className="text-sm font-medium text-neutral-title">大二</span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-neutral-border">
                <h4 className="text-sm font-medium text-neutral-title mb-3">核心专业领域</h4>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-amber-50 text-amber-600 border border-amber-200 text-xs rounded-full">Python开发</span>
                  <span className="px-3 py-1 bg-emerald-50 text-emerald-600 border border-emerald-200 text-xs rounded-full">数据分析</span>
                  <span className="px-3 py-1 bg-indigo-50 text-indigo-600 border border-indigo-200 text-xs rounded-full">AI 应用</span>
                  <span className="px-3 py-1 bg-neutral-bg text-neutral-body border border-neutral-border text-xs rounded-full">深度学习</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Middle Column: Skills */}
        <div className="space-y-6">
          <Card className="border-neutral-border shadow-sm h-full flex flex-col">
            <CardHeader className="pb-2 border-b border-neutral-border">
              <CardTitle className="text-base font-bold text-neutral-title flex items-center gap-2">
                <Target className="w-5 h-5 text-semantic-warning" />
                技能深度
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 flex-1 flex flex-col">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-sm font-medium text-neutral-title">当前水平：</span>
                <span className="px-3 py-1 bg-semantic-warning/10 text-semantic-warning text-xs font-bold rounded-full">进阶开发者</span>
              </div>
              <div className="h-[280px] w-full -ml-4 mt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                    <PolarGrid stroke="#e5e7eb" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: "#64748b", fontSize: 13 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                    <Radar name="技能值" dataKey="A" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.3} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-auto space-y-3 bg-neutral-bg/50 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-neutral-body">与同龄人对比</span>
                  <span className="text-sm font-bold text-semantic-success">前 15%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-neutral-body">与全行业对比</span>
                  <span className="text-sm font-bold text-semantic-warning">前 35%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: AI Report & Commendation */}
        <div className="space-y-6">
          <Card className="border-neutral-border shadow-sm border-t-4 border-t-primary h-full">
            <CardHeader className="pb-2 border-b border-neutral-border flex flex-row items-center justify-between">
              <CardTitle className="text-base font-bold text-neutral-title flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                学习目标与分析
                <span className="text-xs font-normal text-white bg-primary px-2 py-0.5 rounded-[4px] ml-2">AI 生成</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div>
                <h4 className="flex items-center gap-2 text-sm font-bold text-neutral-title mb-2">
                  <span className="text-lg">🏆</span> 本周成就
                </h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-neutral-body ml-2">
                  <li>完成了《Python基础入门》核心模块</li>
                  <li>代码提交次数超过以往平均水平 20%</li>
                  <li>解决了一个中等难度的算法问题</li>
                </ul>
              </div>

              <div className="bg-primary/5 p-4 rounded-[8px] border border-primary/10">
                <h4 className="flex items-center gap-2 text-sm font-bold text-primary mb-2">
                  <Lightbulb className="w-4 h-4" /> 优势与待改进点
                </h4>
                <ul className="list-disc list-inside space-y-2 text-sm text-neutral-body ml-2">
                  <li><span className="font-medium text-neutral-title">优势：</span>理论知识扎实，编程基础牢固。参与项目积极性高。</li>
                  <li><span className="font-medium text-neutral-title">待改进：</span>数据处理部分略显薄弱，实操案例太少。</li>
                </ul>
              </div>

              <div>
                <h4 className="flex items-center gap-2 text-sm font-bold text-neutral-title mb-2">
                  <Calendar className="w-4 h-4 text-indigo-500" /> 下周学习计划
                </h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-neutral-body ml-2">
                  <li>强化 Pandas 与 NumPy 数据处理练习</li>
                  <li>参加一场班级模拟竞赛</li>
                  <li>开始进入《机器学习从零到一》预习期</li>
                </ul>
              </div>

              <div className="pt-4 border-t border-neutral-border">
                <Button className="w-full bg-primary hover:bg-primary-hover text-white">
                  <Send className="w-4 h-4 mr-2" /> 查看个性化推荐课程
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
