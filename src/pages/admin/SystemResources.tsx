import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronRight, Search, Download, Edit3, AlertTriangle, AlertCircle } from "lucide-react";

const quotaData = [
  {
    tenant: "XX大学",
    type: "租户",
    resources: [
      { name: "GPU", quota: "10张", usage: "8张", status: "正常" },
      { name: "存储", quota: "1TB", usage: "850GB", status: "warning" },
      { name: "API", quota: "100K", usage: "50K", status: "正常" },
    ]
  },
  {
    tenant: "AI研究院",
    type: "租户",
    resources: [
      { name: "GPU", quota: "5张", usage: "4张", status: "正常" },
      { name: "存储", quota: "500GB", usage: "450GB", status: "正常" },
      { name: "API", quota: "50K", usage: "49K", status: "warning" },
    ]
  }
];

export default function SystemResources() {
  return (
    <div className="space-y-6">
      <div className="flex items-center text-sm text-neutral-caption mb-4">
        <span className="hover:text-primary cursor-pointer transition-colors">首页</span>
        <ChevronRight className="w-4 h-4 mx-1" />
        <span className="hover:text-primary cursor-pointer transition-colors">系统管理</span>
        <ChevronRight className="w-4 h-4 mx-1" />
        <span className="text-neutral-title font-medium">资源配额</span>
      </div>

      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-neutral-title">资源配额管理</h1>
        <div className="flex gap-2">
          <Button variant="outline" className="border-primary/20 text-primary hover:bg-primary/5">
            <Edit3 className="w-4 h-4 mr-2" />
            批量调整
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            导出
          </Button>
        </div>
      </div>

      <Card className="border-neutral-border shadow-sm">
        <CardContent className="p-4">
          <div className="flex flex-col gap-4">
            <div className="relative w-full max-w-md">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-caption" />
              <Input placeholder="搜索用户/租户..." className="pl-9" />
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-neutral-title">筛选：</span>
                <Select defaultValue="all">
                  <SelectTrigger className="w-[120px] h-9">
                    <SelectValue placeholder="类型" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部类型</SelectItem>
                    <SelectItem value="tenant">租户</SelectItem>
                    <SelectItem value="user">用户</SelectItem>
                  </SelectContent>
                </Select>
                <Select defaultValue="all">
                  <SelectTrigger className="w-[120px] h-9">
                    <SelectValue placeholder="状态" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部状态</SelectItem>
                    <SelectItem value="normal">正常</SelectItem>
                    <SelectItem value="warning">预警</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button variant="ghost" className="h-9 text-neutral-caption hover:text-primary">
                清除筛选
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 全局资源概览 */}
      <Card className="border-neutral-border shadow-sm">
        <CardHeader className="pb-2 border-b border-neutral-border">
          <CardTitle className="text-base font-bold text-neutral-title">全局资源概览</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex flex-col gap-1 border-r border-neutral-border last:border-0 pr-6">
              <span className="text-sm text-neutral-caption">总CPU</span>
              <span className="text-2xl font-bold text-neutral-title">128核</span>
              <span className="text-sm text-semantic-success mt-1">使用率 65%</span>
            </div>
            <div className="flex flex-col gap-1 border-r border-neutral-border last:border-0 pr-6">
              <span className="text-sm text-neutral-caption">总内存</span>
              <span className="text-2xl font-bold text-neutral-title">512GB</span>
              <span className="text-sm text-semantic-warning mt-1">使用率 70%</span>
            </div>
            <div className="flex flex-col gap-1 border-r border-neutral-border last:border-0 pr-6">
              <span className="text-sm text-neutral-caption">总GPU</span>
              <span className="text-2xl font-bold text-neutral-title">20张</span>
              <span className="text-sm text-semantic-error mt-1">使用率 80%</span>
            </div>
            <div className="flex flex-col gap-1 border-r border-neutral-border last:border-0 pr-6">
              <span className="text-sm text-neutral-caption">总存储</span>
              <span className="text-2xl font-bold text-neutral-title">100TB</span>
              <span className="text-sm text-semantic-success mt-1">使用率 45%</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 配额列表 */}
      <Card className="border-neutral-border shadow-sm">
        <CardHeader className="pb-2 border-b border-neutral-border">
          <CardTitle className="text-base font-bold text-neutral-title">配额列表</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-neutral-caption uppercase bg-neutral-bg border-b border-neutral-border">
                <tr>
                  <th className="px-6 py-3 font-medium">租户名称</th>
                  <th className="px-6 py-3 font-medium">类型</th>
                  <th className="px-6 py-3 font-medium">资源</th>
                  <th className="px-6 py-3 font-medium">配额</th>
                  <th className="px-6 py-3 font-medium">使用</th>
                  <th className="px-6 py-3 font-medium">状态</th>
                </tr>
              </thead>
              <tbody>
                {quotaData.map((tenant, tIndex) => (
                  <React.Fragment key={tIndex}>
                    {tenant.resources.map((res, rIndex) => (
                      <tr key={`${tIndex}-${rIndex}`} className="border-b border-neutral-border hover:bg-neutral-bg/50 transition-colors">
                        {rIndex === 0 && (
                          <>
                            <td className="px-6 py-4 font-medium text-neutral-title align-top" rowSpan={tenant.resources.length}>{tenant.tenant}</td>
                            <td className="px-6 py-4 text-neutral-body align-top" rowSpan={tenant.resources.length}>{tenant.type}</td>
                          </>
                        )}
                        <td className="px-6 py-4 text-neutral-body">{res.name}</td>
                        <td className="px-6 py-4 font-medium text-neutral-title">{res.quota}</td>
                        <td className="px-6 py-4 text-neutral-body">{res.usage}</td>
                        <td className="px-6 py-4">
                          {res.status === "warning" ? (
                            <AlertTriangle className="w-5 h-5 text-semantic-warning" />
                          ) : (
                            <span className="text-semantic-success">{res.status}</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-4 flex justify-end border-t border-neutral-border">
            <Button variant="ghost" size="sm" className="text-primary hover:text-primary-hover hover:bg-primary/5">
              查看全部 <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 超限告警 */}
      <Card className="border-neutral-border shadow-sm border-l-4 border-l-semantic-error">
        <CardHeader className="pb-2 border-b border-neutral-border">
          <CardTitle className="text-base font-bold text-neutral-title flex items-center gap-2">
            超限告警（3个）
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-sm">
              <div className="w-3 h-3 rounded-full bg-semantic-error shrink-0" />
              <span className="font-medium text-neutral-title">XX大学：</span>
              <span className="text-neutral-body">存储配额已使用 85% (850GB / 1TB)</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <div className="w-3 h-3 rounded-full bg-semantic-warning shrink-0" />
              <span className="font-medium text-neutral-title">AI研究院：</span>
              <span className="text-neutral-body">API调用已使用 98% (49K / 50K)</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <div className="w-3 h-3 rounded-full bg-semantic-warning shrink-0" />
              <span className="font-medium text-neutral-title">XX大学：</span>
              <span className="text-neutral-body">GPU配额已使用 90% (9 / 10)</span>
            </div>
          </div>
          <div className="mt-6 flex justify-end gap-2">
            <Button variant="outline" size="sm">查看详情</Button>
            <Button variant="outline" size="sm" className="text-primary border-primary/20 hover:bg-primary/5">批量处理</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
