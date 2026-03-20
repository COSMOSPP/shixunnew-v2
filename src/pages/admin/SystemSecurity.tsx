import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight, ShieldCheck, Plus, CheckSquare, Search } from "lucide-react";

const maskingRules = [
  { field: "id", algorithm: "部分掩盖", example: "***123" },
  { field: "phone", algorithm: "中间掩盖", example: "138****5678" },
  { field: "email", algorithm: "部分掩盖", example: "z***@example.com" },
  { field: "name", algorithm: "保留首字", example: "张**" },
  { field: "address", algorithm: "全部掩盖", example: "**********" },
];

export default function SystemSecurity() {
  return (
    <div className="space-y-6">
      <div className="flex items-center text-sm text-neutral-caption mb-4">
        <span className="hover:text-primary cursor-pointer transition-colors">首页</span>
        <ChevronRight className="w-4 h-4 mx-1" />
        <span className="hover:text-primary cursor-pointer transition-colors">系统管理</span>
        <ChevronRight className="w-4 h-4 mx-1" />
        <span className="text-neutral-title font-medium">数据安全</span>
      </div>

      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-neutral-title">数据安全管理</h1>
        <Button variant="outline" className="border-primary/20 text-primary hover:bg-primary/5">
          <Search className="w-4 h-4 mr-2" />
          安全扫描
        </Button>
      </div>

      {/* 安全状态 */}
      <Card className="border-neutral-border shadow-sm">
        <CardHeader className="pb-2 border-b border-neutral-border">
          <CardTitle className="text-base font-bold text-neutral-title flex items-center gap-2">
            安全状态：
            <div className="flex items-center gap-1 text-semantic-success">
              <ShieldCheck className="w-5 h-5" />
              <span>3个风险已处理</span>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <ul className="list-disc list-inside space-y-2 text-sm text-neutral-body">
            <li>已扫描：156,784条数据</li>
            <li>已过滤：1,234条敏感数据</li>
            <li>已脱敏：856条敏感数据</li>
          </ul>
        </CardContent>
      </Card>

      {/* 敏感数据过滤 */}
      <Card className="border-neutral-border shadow-sm">
        <CardHeader className="pb-2 border-b border-neutral-border">
          <CardTitle className="text-base font-bold text-neutral-title">敏感数据过滤</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-6">
            <div className="flex items-center gap-4 flex-wrap">
              <span className="text-sm font-medium text-neutral-title">敏感词库：</span>
              <div className="flex gap-2 flex-wrap">
                {["身份证号", "手机号", "邮箱", "地址"].map((word) => (
                  <div key={word} className="px-3 py-1 bg-neutral-bg border border-neutral-border rounded-[4px] text-sm text-neutral-body">
                    {word}
                  </div>
                ))}
                <Button variant="outline" size="sm" className="h-7 px-3 text-primary border-primary/20 hover:bg-primary/5">
                  <Plus className="w-3 h-3 mr-1" /> 添加
                </Button>
              </div>
            </div>

            <div className="space-y-3">
              <span className="text-sm font-medium text-neutral-title">过滤规则：</span>
              <div className="flex flex-col gap-2 ml-2">
                <div className="flex items-center gap-2 text-sm text-neutral-body">
                  <CheckSquare className="w-4 h-4 text-primary" />
                  自动过滤日志中的敏感数据
                </div>
                <div className="flex items-center gap-2 text-sm text-neutral-body">
                  <CheckSquare className="w-4 h-4 text-primary" />
                  自动过滤用户提交的敏感数据
                </div>
                <div className="flex items-center gap-2 text-sm text-neutral-body">
                  <CheckSquare className="w-4 h-4 text-primary" />
                  自动过滤导出数据的敏感数据
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 数据脱敏配置 */}
      <Card className="border-neutral-border shadow-sm">
        <CardHeader className="pb-2 border-b border-neutral-border">
          <CardTitle className="text-base font-bold text-neutral-title">数据脱敏配置</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="mb-4 text-sm font-medium text-neutral-title">脱敏规则：</div>
          <div className="overflow-x-auto border border-neutral-border rounded-[8px]">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-neutral-caption uppercase bg-neutral-bg border-b border-neutral-border">
                <tr>
                  <th className="px-6 py-3 font-medium">字段名</th>
                  <th className="px-6 py-3 font-medium">脱敏算法</th>
                  <th className="px-6 py-3 font-medium">示例</th>
                </tr>
              </thead>
              <tbody>
                {maskingRules.map((rule, index) => (
                  <tr key={index} className="border-b border-neutral-border last:border-0 hover:bg-neutral-bg/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-neutral-title">{rule.field}</td>
                    <td className="px-6 py-4 text-neutral-body">{rule.algorithm}</td>
                    <td className="px-6 py-4 text-neutral-body font-mono">{rule.example}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* 安全统计 */}
      <Card className="border-neutral-border shadow-sm">
        <CardHeader className="pb-2 border-b border-neutral-border">
          <CardTitle className="text-base font-bold text-neutral-title">安全统计</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            <div className="flex flex-col gap-1 border-r border-neutral-border last:border-0 pr-6">
              <span className="text-sm text-neutral-caption">扫描</span>
              <span className="text-2xl font-bold text-neutral-title">156K</span>
            </div>
            <div className="flex flex-col gap-1 border-r border-neutral-border last:border-0 pr-6">
              <span className="text-sm text-neutral-caption">过滤</span>
              <span className="text-2xl font-bold text-neutral-title">1.2K</span>
            </div>
            <div className="flex flex-col gap-1 border-r border-neutral-border last:border-0 pr-6">
              <span className="text-sm text-neutral-caption">脱敏</span>
              <span className="text-2xl font-bold text-neutral-title">856</span>
            </div>
            <div className="flex flex-col gap-1 border-r border-neutral-border last:border-0 pr-6">
              <span className="text-sm text-neutral-caption">拦截</span>
              <span className="text-2xl font-bold text-semantic-error">23</span>
            </div>
            <div className="flex flex-col gap-1 border-r border-neutral-border last:border-0 pr-6">
              <span className="text-sm text-neutral-caption">告警</span>
              <span className="text-2xl font-bold text-semantic-warning">12</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
