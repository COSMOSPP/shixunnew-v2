import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, Bot, Cpu, Code, Shield, Database, Cloud, Play, Settings, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function UserAIAgents() {
  const agents = [
    { id: 1, name: "代码审查专家", desc: "自动检查代码规范、安全漏洞和性能问题", icon: Code, color: "text-blue-500", bg: "bg-blue-50", status: "运行中", calls: 1250 },
    { id: 2, name: "架构设计助手", desc: "根据业务需求生成云原生架构图和部署方案", icon: Cloud, color: "text-purple-500", bg: "bg-purple-50", status: "空闲", calls: 840 },
    { id: 3, name: "安全渗透测试员", desc: "模拟黑客攻击，发现系统潜在的安全隐患", icon: Shield, color: "text-red-500", bg: "bg-red-50", status: "运行中", calls: 3200 },
    { id: 4, name: "数据库优化大师", desc: "分析慢查询日志，提供索引优化和SQL重写建议", icon: Database, color: "text-green-500", bg: "bg-green-50", status: "空闲", calls: 450 },
    { id: 5, name: "自动化运维机器人", desc: "监控系统状态，自动处理常见故障和告警", icon: Cpu, color: "text-orange-500", bg: "bg-orange-50", status: "运行中", calls: 8900 },
    { id: 6, name: "通用问答助手", desc: "基于企业知识库的智能问答服务", icon: Bot, color: "text-indigo-500", bg: "bg-indigo-50", status: "空闲", calls: 15000 },
  ];

  return (
    <div className="min-h-screen bg-[#f5f6f8] p-6 lg:p-8">
      <div className="max-w-[1400px] mx-auto">
        {/* Header Section */}
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center text-sm text-neutral-caption mb-4">
              <Link to="/user" className="hover:text-primary cursor-pointer transition-colors">首页</Link>
              <ChevronRight className="w-4 h-4 mx-1" />
              <span className="text-neutral-title font-medium">数字员工</span>
            </div>
            <h1 className="text-2xl font-bold text-neutral-title">数字员工 (Agents)</h1>
            <p className="text-sm text-neutral-caption mt-2">
              创建和管理具备特定技能和自主执行能力的数字员工
            </p>
          </div>
          <Button className="bg-primary hover:bg-primary-hover text-white gap-2 rounded-xl h-10 px-5 shadow-sm">
            <Plus className="w-4 h-4" />
            创建数字员工
          </Button>
        </div>

        {/* Search and Filter */}
        <div className="mb-6 flex flex-col sm:flex-row items-center gap-4">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-caption" />
            <Input 
              placeholder="搜索数字员工..." 
              className="pl-9 h-10 rounded-xl border-neutral-border/60 bg-white focus-visible:ring-primary/20" 
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="h-10 rounded-xl border-primary/20 bg-primary/5 text-primary hover:bg-primary/10 hover:text-primary">全部状态</Button>
            <Button variant="ghost" className="h-10 rounded-xl text-neutral-body hover:text-neutral-title hover:bg-white">运行中</Button>
            <Button variant="ghost" className="h-10 rounded-xl text-neutral-body hover:text-neutral-title hover:bg-white">空闲</Button>
          </div>
        </div>

        {/* Grid Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {agents.map((agent) => (
            <Card 
              key={agent.id} 
              className="group hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 cursor-pointer border-neutral-border/60 hover:border-primary/30 bg-white rounded-2xl overflow-hidden flex flex-col h-full"
            >
              <CardContent className="p-6 flex flex-col flex-1">
                <div className="flex items-start justify-between mb-5">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${agent.bg} ${agent.color} group-hover:scale-110 transition-transform duration-300 shadow-sm`}>
                    <agent.icon className="w-6 h-6" strokeWidth={2} />
                  </div>
                  <div className={`px-2.5 py-1 rounded-md text-[11px] font-medium border ${
                    agent.status === '运行中' 
                      ? 'bg-semantic-success/10 text-semantic-success border-semantic-success/20' 
                      : 'bg-neutral-bg text-neutral-body border-neutral-border'
                  }`}>
                    {agent.status}
                  </div>
                </div>
                
                <h3 className="text-[16px] font-bold text-neutral-title mb-3 group-hover:text-primary transition-colors">
                  {agent.name}
                </h3>
                <p className="text-[13px] text-neutral-caption leading-relaxed flex-1">
                  {agent.desc}
                </p>
                
                <div className="flex items-center justify-between mt-5 pt-4 border-t border-neutral-border/40">
                  <div className="text-[12px] text-neutral-caption">
                    调用次数: <span className="font-medium text-neutral-title ml-1">{agent.calls.toLocaleString()}</span>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-neutral-caption hover:text-primary hover:bg-primary/5">
                      <Settings className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-neutral-caption hover:text-primary hover:bg-primary/5">
                      <Play className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
