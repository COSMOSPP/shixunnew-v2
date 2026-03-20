import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { AlertTriangle, Download, FileText, ArrowRight } from "lucide-react";

const trendData = [
  { name: 'Jan', cost: 100 },
  { name: 'Feb', cost: 120 },
  { name: 'Mar', cost: 140 },
  { name: 'Apr', cost: 145 },
  { name: 'May', cost: 150 },
  { name: 'Jun', cost: 156 },
];

const detailsData = [
  { type: "GPU V100", usage: "120小时", price: "¥0.5/时", cost: "¥60" },
  { type: "存储", usage: "850GB", price: "¥0.1/GB", cost: "¥85" },
  { type: "API调用", usage: "50K次", price: "¥0.01/次", cost: "¥500" },
  { type: "带宽", usage: "1TB", price: "¥0.05/GB", cost: "¥50" },
];

export default function SystemBilling() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-neutral-title">计费管理</h1>
      </div>

      {/* 费用概览 */}
      <Card className="border-neutral-border shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-neutral-border">
          <CardTitle className="text-base font-bold text-neutral-title">费用概览</CardTitle>
          <Button variant="outline" size="sm" className="text-primary border-primary/20 hover:bg-primary/5">
            <FileText className="w-4 h-4 mr-2" />
            生成账单
          </Button>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex flex-col gap-4">
            <div className="flex items-baseline gap-2">
              <span className="text-sm text-neutral-body">本月总费用：</span>
              <span className="text-3xl font-bold text-semantic-error">¥156,780</span>
            </div>
            <div className="flex flex-col gap-2 ml-4 border-l-2 border-neutral-border pl-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-neutral-caption">├─ 租户计费：</span>
                <span className="text-sm font-medium text-neutral-title">¥143,200</span>
                <span className="text-xs text-neutral-caption">(91.4%)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-neutral-caption">└─ 资源计费：</span>
                <span className="text-sm font-medium text-neutral-title">¥13,580</span>
                <span className="text-xs text-neutral-caption">(8.6%)</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 费用趋势 */}
      <Card className="border-neutral-border shadow-sm">
        <CardHeader className="pb-2 border-b border-neutral-border">
          <CardTitle className="text-base font-bold text-neutral-title">费用趋势（最近6个月）</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trendData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} tickFormatter={(value) => `${value}K`} />
                <Tooltip 
                  cursor={{ fill: '#f1f5f9' }}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  formatter={(value) => [`${value}K`, '费用']}
                />
                <Bar dataKey="cost" fill="#1f2937" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* 费用明细 */}
      <Card className="border-neutral-border shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-neutral-border">
          <CardTitle className="text-base font-bold text-neutral-title">费用明细</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-neutral-caption uppercase bg-neutral-bg border-b border-neutral-border">
                <tr>
                  <th className="px-6 py-3 font-medium">资源类型</th>
                  <th className="px-6 py-3 font-medium">用量</th>
                  <th className="px-6 py-3 font-medium">单价</th>
                  <th className="px-6 py-3 font-medium">费用</th>
                </tr>
              </thead>
              <tbody>
                {detailsData.map((item, index) => (
                  <tr key={index} className="border-b border-neutral-border hover:bg-neutral-bg/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-neutral-title">{item.type}</td>
                    <td className="px-6 py-4 text-neutral-body">{item.usage}</td>
                    <td className="px-6 py-4 text-neutral-body">{item.price}</td>
                    <td className="px-6 py-4 font-medium text-neutral-title">{item.cost}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-4 flex justify-end border-t border-neutral-border">
            <Button variant="ghost" size="sm" className="text-primary hover:text-primary-hover hover:bg-primary/5">
              <Download className="w-4 h-4 mr-2" />
              导出明细
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 费用预警 */}
      <Card className="border-neutral-border shadow-sm border-l-4 border-l-semantic-warning">
        <CardHeader className="pb-2 border-b border-neutral-border">
          <CardTitle className="text-base font-bold text-neutral-title flex items-center gap-2">
            费用预警（已触发 2 个）
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-sm">
              <AlertTriangle className="w-5 h-5 text-semantic-warning shrink-0" />
              <span className="font-medium text-neutral-title">XX大学：</span>
              <span className="text-neutral-body">存储配额已使用 95%</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <AlertTriangle className="w-5 h-5 text-semantic-warning shrink-0" />
              <span className="font-medium text-neutral-title">AI研究院：</span>
              <span className="text-neutral-body">API调用已使用 98%</span>
            </div>
          </div>
          <div className="mt-6 flex justify-end">
            <Button variant="ghost" size="sm" className="text-neutral-caption hover:text-primary">
              查看全部 <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
