import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts';
import { BarChart3, LineChart, Target, Zap, ChevronRight, Share2, Download, Lightbulb, Calendar } from "lucide-react";
import { Link } from "react-router-dom";

const trendData = [
  { name: 'Mon', hours: 5 },
  { name: 'Tue', hours: 4 },
  { name: 'Wed', hours: 6 },
  { name: 'Thu', hours: 3 },
  { name: 'Fri', hours: 2 },
  { name: 'Sat', hours: 7 },
  { name: 'Sun', hours: 4 },
];

const radarData = [
  { subject: '编程能力', A: 85, fullMark: 100 },
  { subject: '算法', A: 80, fullMark: 100 },
  { subject: '理论', A: 90, fullMark: 100 },
  { subject: '应用', A: 85, fullMark: 100 },
  { subject: '数据', A: 70, fullMark: 100 },
  { subject: '数学', A: 75, fullMark: 100 },
];

export default function UserCenterLearning() {
  return (
    <div className="space-y-6">
      <div className="flex items-center text-sm text-neutral-caption mb-4">
        <Link to="/user" className="hover:text-primary cursor-pointer transition-colors">首页</Link>
        <ChevronRight className="w-4 h-4 mx-1" />
        <Link to="/user/center" className="hover:text-primary cursor-pointer transition-colors">个人中心</Link>
        <ChevronRight className="w-4 h-4 mx-1" />
        <span className="text-neutral-title font-medium">学习数据</span>
      </div>

      {/* 学习统计 */}
      <Card className="border-neutral-border shadow-sm">
        <CardHeader className="pb-2 border-b border-neutral-border">
          <CardTitle className="text-base font-bold text-neutral-title flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-primary" />
            学习统计
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="flex flex-col gap-1 border-r border-neutral-border last:border-0 pr-6">
              <span className="text-sm text-neutral-caption">总学习时长</span>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold text-neutral-title">125</span>
                <span className="text-sm text-neutral-caption">小时</span>
              </div>
              <span className="text-sm text-neutral-body mt-1">本月 32 小时</span>
            </div>
            <div className="flex flex-col gap-1 border-r border-neutral-border last:border-0 pr-6">
              <span className="text-sm text-neutral-caption">完成课程数</span>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold text-neutral-title">12</span>
                <span className="text-sm text-neutral-caption">门</span>
              </div>
              <span className="text-sm text-semantic-success mt-1">完成率 65%</span>
            </div>
            <div className="flex flex-col gap-1 border-r border-neutral-border last:border-0 pr-6">
              <span className="text-sm text-neutral-caption">完成项目数</span>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold text-neutral-title">8</span>
                <span className="text-sm text-neutral-caption">个</span>
              </div>
              <span className="text-sm text-semantic-warning mt-1">进行中 3 个</span>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-medium text-neutral-title">学习时长趋势（最近7天）</h4>
            <div className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                  <Tooltip 
                    cursor={{ fill: '#f1f5f9' }}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    formatter={(value) => [`${value} 小时`, '学习时长']}
                  />
                  <Bar dataKey="hours" fill="#fa541c" radius={[4, 4, 0, 0]} barSize={30} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI学习报告 */}
      <Card className="border-neutral-border shadow-sm border-t-4 border-t-primary">
        <CardHeader className="pb-2 border-b border-neutral-border flex flex-row items-center justify-between">
          <CardTitle className="text-base font-bold text-neutral-title flex items-center gap-2">
            <LineChart className="w-5 h-5 text-primary" />
            AI学习报告 <span className="text-xs font-normal text-neutral-caption bg-neutral-bg px-2 py-0.5 rounded-[4px] ml-2">自动生成</span>
          </CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="h-8">
              <Share2 className="w-4 h-4 mr-2" /> 分享
            </Button>
            <Button variant="outline" size="sm" className="h-8">
              <Download className="w-4 h-4 mr-2" /> 下载
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <h3 className="text-lg font-bold text-neutral-title border-b border-neutral-border pb-2">本周学习总结</h3>
          
          <div className="space-y-4">
            <div>
              <h4 className="flex items-center gap-2 text-sm font-bold text-neutral-title mb-2">
                <span className="text-lg">🎉</span> 本周成就：
              </h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-neutral-body ml-2">
                <li>完成了《Python入门》第5-7章</li>
                <li>提交了《图像分类项目》，获得85分</li>
                <li>学习时长达到32小时，超过85%的同学</li>
                <li>连续学习7天，获得"早起鸟"徽章</li>
              </ul>
            </div>

            <div className="bg-primary/5 p-4 rounded-[8px] border border-primary/10">
              <h4 className="flex items-center gap-2 text-sm font-bold text-primary mb-2">
                <Lightbulb className="w-4 h-4" /> AI分析：
              </h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-neutral-body ml-2">
                <li><span className="font-medium text-neutral-title">优势：</span>理论知识扎实，实践能力突出</li>
                <li><span className="font-medium text-neutral-title">待改进：</span>数据分析能力可以加强</li>
                <li><span className="font-medium text-neutral-title">建议：</span>下周可以尝试一些数据分析项目</li>
              </ul>
            </div>

            <div>
              <h4 className="flex items-center gap-2 text-sm font-bold text-neutral-title mb-2">
                <Calendar className="w-4 h-4 text-indigo-500" /> 下周计划：
              </h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-neutral-body ml-2">
                <li>完成《机器学习实战》第1-3章</li>
                <li>开始《数据分析基础》项目</li>
                <li>目标学习时长：40小时</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 能力评估 */}
      <Card className="border-neutral-border shadow-sm">
        <CardHeader className="pb-2 border-b border-neutral-border">
          <CardTitle className="text-base font-bold text-neutral-title flex items-center gap-2">
            <Target className="w-5 h-5 text-semantic-success" />
            能力评估
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h4 className="text-sm font-medium text-neutral-title mb-4">能力雷达图 (AI驱动)</h4>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                    <PolarGrid stroke="#e5e7eb" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 12 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                    <Radar name="能力值" dataKey="A" stroke="#fa541c" fill="#fa541c" fillOpacity={0.3} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-neutral-bg rounded-[8px] border border-neutral-border">
                  <span className="text-sm font-medium text-neutral-title">与同龄人对比：</span>
                  <span className="text-lg font-bold text-primary">排名前15%</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-neutral-bg rounded-[8px] border border-neutral-border">
                  <span className="text-sm font-medium text-neutral-title">与行业对比：</span>
                  <span className="text-lg font-bold text-primary">排名前30%</span>
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button variant="ghost" className="text-neutral-caption hover:text-primary">
                  查看详细分析 <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
