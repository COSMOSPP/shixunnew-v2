import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Search, ChevronLeft, ChevronRight } from "lucide-react";

const tenants = [
  {
    id: "tenant_2025_001",
    name: "XX大学计算机学院",
    status: "正常",
    createdAt: "2025-01-15",
    users: { current: 1234, max: 2000 },
    storage: { current: "850GB", max: "1TB" },
    gpu: { current: 8, max: 10 },
    cost: "¥15,000",
    api: { current: "50K", max: "100K" }
  },
  {
    id: "tenant_2025_002",
    name: "AI研究院",
    status: "正常",
    createdAt: "2025-02-01",
    users: { current: 856, max: 1000 },
    storage: { current: "450GB", max: "500GB" },
    gpu: { current: 4, max: 5 },
    cost: "¥8,500",
    api: { current: "20K", max: "50K" }
  }
];

export default function SystemTenants() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-neutral-title">租户管理</h1>
        <Button className="bg-primary hover:bg-primary-hover text-white">
          <Plus className="w-4 h-4 mr-2" />
          新建租户
        </Button>
      </div>

      <Card className="border-neutral-border shadow-sm">
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-neutral-title">筛选：</span>
              <Select defaultValue="all">
                <SelectTrigger className="w-[120px] h-9">
                  <SelectValue placeholder="状态" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部状态</SelectItem>
                  <SelectItem value="normal">正常</SelectItem>
                  <SelectItem value="disabled">禁用</SelectItem>
                </SelectContent>
              </Select>
              <Select defaultValue="all">
                <SelectTrigger className="w-[120px] h-9">
                  <SelectValue placeholder="类型" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部类型</SelectItem>
                  <SelectItem value="edu">教育</SelectItem>
                  <SelectItem value="enterprise">企业</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button variant="ghost" className="h-9 text-neutral-caption hover:text-primary">
              清除筛选
            </Button>
            <div className="ml-auto relative w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-caption" />
              <Input placeholder="搜索租户名称/ID..." className="pl-9 h-9" />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {tenants.map((tenant) => (
          <Card key={tenant.id} className="border-neutral-border shadow-sm hover:border-primary/30 transition-colors">
            <CardContent className="p-0">
              <div className="p-5">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-neutral-title">{tenant.name}</h3>
                    <p className="text-sm text-neutral-caption mt-1">租户ID: {tenant.id}</p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-neutral-body">状态：</span>
                      <Select defaultValue="normal">
                        <SelectTrigger className="w-[100px] h-8 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="normal">
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 rounded-full bg-semantic-success" />
                              正常
                            </div>
                          </SelectItem>
                          <SelectItem value="disabled">
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 rounded-full bg-semantic-error" />
                              禁用
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <p className="text-sm text-neutral-caption">创建：{tenant.createdAt}</p>
                  </div>
                </div>

                <div className="h-px bg-neutral-border my-4" />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-neutral-body">用户数：</span>
                    <span className="text-sm font-medium text-neutral-title">{tenant.users.current}/{tenant.users.max}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-neutral-body">存储用量：</span>
                    <span className="text-sm font-medium text-neutral-title">{tenant.storage.current}/{tenant.storage.max}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-neutral-body">GPU：</span>
                    <span className="text-sm font-medium text-neutral-title">{tenant.gpu.current}/{tenant.gpu.max}</span>
                  </div>
                </div>

                <div className="h-px bg-neutral-border my-4" />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-neutral-body">本月费用：</span>
                    <span className="text-sm font-bold text-semantic-error">{tenant.cost}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-neutral-body">API调用：</span>
                    <span className="text-sm font-medium text-neutral-title">{tenant.api.current}/{tenant.api.max}</span>
                  </div>
                </div>

                <div className="h-px bg-neutral-border my-4" />

                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="text-primary border-primary/20 hover:bg-primary/5">查看详情</Button>
                  <Button variant="outline" size="sm">编辑</Button>
                  <Button variant="outline" size="sm">配额</Button>
                  <Button variant="outline" size="sm">计费</Button>
                  <Button variant="outline" size="sm">日志</Button>
                  <Button variant="outline" size="sm" className="text-semantic-error hover:text-semantic-error hover:bg-semantic-error/10">禁用</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex items-center justify-between text-sm text-neutral-caption">
        <div className="flex items-center gap-2">
          <span>每页</span>
          <Select defaultValue="20">
            <SelectTrigger className="w-[70px] h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>
          <span>个</span>
        </div>
        
        <div className="flex items-center gap-4">
          <span>共 15 个租户</span>
          <div className="flex items-center gap-1">
            <Button variant="outline" size="icon" className="w-8 h-8" disabled>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" className="w-8 h-8 bg-primary text-white border-primary hover:bg-primary-hover hover:text-white">1</Button>
            <Button variant="outline" size="sm" className="w-8 h-8">2</Button>
            <Button variant="outline" size="sm" className="w-8 h-8">3</Button>
            <span className="px-2">...</span>
            <Button variant="outline" size="sm" className="w-8 h-8">10</Button>
            <Button variant="outline" size="icon" className="w-8 h-8">
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
