import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Search, Plus, Bot, Cpu, Code, Shield, Database, Cloud, Play, Settings, ChevronDown, ChevronLeft, ChevronRight, X } from "lucide-react";
import { cn } from "@/lib/utils";

export default function UserAIAgents() {
  const navigate = useNavigate();
  const [selectedAgent, setSelectedAgent] = useState<any>(null);

  const agents = [
    { id: 1, name: "代码审查专家", desc: "自动检查代码规范、安全漏洞和性能问题", icon: Code, color: "text-blue-500", bg: "bg-blue-50", status: "运行中", calls: 1250 },
    { id: 2, name: "架构设计助手", desc: "根据业务需求生成云原生架构图和部署方案", icon: Cloud, color: "text-purple-500", bg: "bg-purple-50", status: "空闲", calls: 840 },
    { id: 3, name: "安全渗透测试员", desc: "模拟黑客攻击，发现系统潜在的安全隐患", icon: Shield, color: "text-red-500", bg: "bg-red-50", status: "运行中", calls: 3200 },
    { id: 4, name: "数据库优化大师", desc: "分析慢查询日志，提供索引优化和SQL重写建议", icon: Database, color: "text-green-500", bg: "bg-green-50", status: "空闲", calls: 450 },
    { id: 5, name: "自动化运维机器人", desc: "监控系统状态，自动处理常见故障和告警", icon: Cpu, color: "text-orange-500", bg: "bg-orange-50", status: "运行中", calls: 8900 },
    { id: 6, name: "通用问答助手", desc: "基于企业知识库的智能问答服务", icon: Bot, color: "text-indigo-500", bg: "bg-indigo-50", status: "空闲", calls: 15000 },
  ];

  return (
    <div className="flex flex-col bg-[#f5f6f8] relative">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-neutral-title">数字员工</h1>
        </div>
        <button 
          onClick={() => navigate('/user/ai/agents/studio')}
          className="bg-[#fa541c] hover:bg-[#fa541c]/90 text-white px-5 py-2 rounded-[8px] text-[14px] font-medium transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          创建数字员工
        </button>
      </div>

      {/* Description Box */}
      <div className="bg-white p-5 rounded-[12px] border border-neutral-border mb-8 shadow-sm">
        <p className="text-[14px] text-neutral-body leading-relaxed">
          <span className="font-bold text-neutral-title">数字员工管理。</span>可自动执行任务的AI Agent，支持一键调用执行复杂任务。数字员工是基于大模型的智能体，可自主规划并执行多步骤任务。功能包括：数字员工列表、详情查看、一键调用、执行状态跟踪、结果查看。
          <br className="my-1" />
          <span className="font-medium text-neutral-title">调用方式：</span>选择数字员工 <span className="mx-1 text-neutral-caption">→</span> 输入任务描述 <span className="mx-1 text-neutral-caption">→</span> 执行任务 <span className="mx-1 text-neutral-caption">→</span> 查看结果。
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 mb-8">
        <div className="flex items-start gap-4">
          <span className="text-[14px] text-neutral-body font-medium whitespace-nowrap mt-1.5">运行状态</span>
          <div className="flex flex-wrap gap-2">
            {["全部", "运行中", "空闲"].map((tag, i) => (
              <button 
                key={i}
                className={cn(
                  "px-4 py-1.5 rounded-full text-[13px] transition-colors",
                  i === 0 ? "bg-[#fa541c] text-white" : "bg-white border border-neutral-border text-neutral-body hover:text-[#fa541c] hover:border-[#fa541c]"
                )}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs & Search */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center bg-white rounded-full p-1 border border-neutral-border">
          <button className="px-6 py-1.5 rounded-full text-[14px] font-medium bg-[#f5f6f8] text-neutral-title">
            最新
          </button>
          <button className="px-6 py-1.5 rounded-full text-[14px] font-medium text-neutral-body hover:text-neutral-title">
            最热
          </button>
        </div>
        
        <div className="relative w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-caption" />
          <Input 
            placeholder="输入数字员工名称搜索" 
            className="pl-9 h-10 text-[14px] rounded-full border-neutral-border bg-white focus-visible:ring-[#fa541c]" 
          />
        </div>
      </div>

        <div className="flex-1 pr-2 pb-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {agents.map((agent) => {
                const Icon = agent.icon;
                return (
                  <div 
                    key={agent.id} 
                    onClick={() => setSelectedAgent(agent)}
                    className="bg-white rounded-[12px] overflow-hidden border border-neutral-border shadow-sm hover:shadow-md transition-all hover:-translate-y-1 group flex flex-col cursor-pointer p-6"
                  >
                    <div className="flex items-start justify-between mb-5">
                      <div className={cn("w-12 h-12 rounded-[12px] flex items-center justify-center transition-transform duration-300 group-hover:scale-110", agent.bg, agent.color)}>
                        <Icon className="w-6 h-6" strokeWidth={2} />
                      </div>
                      <div className={cn(
                        "px-2.5 py-1 rounded-[4px] text-[11px] font-medium border",
                        agent.status === '运行中' 
                          ? 'bg-green-50 text-green-600 border-green-200' 
                          : 'bg-neutral-bg text-neutral-body border-neutral-border'
                      )}>
                        {agent.status}
                      </div>
                    </div>
                    
                    <h3 className="text-[16px] font-bold text-neutral-title mb-3 group-hover:text-[#fa541c] transition-colors">
                      {agent.name}
                    </h3>
                    <p className="text-[13px] text-neutral-caption leading-relaxed flex-1">
                      {agent.desc}
                    </p>
                    
                    <div className="flex items-center justify-between mt-5 pt-4 border-t border-neutral-border">
                      <div className="text-[12px] text-neutral-caption">
                        调用次数: <span className="font-medium text-neutral-title ml-1">{agent.calls.toLocaleString()}</span>
                      </div>
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedAgent(agent);
                          }}
                          className="w-8 h-8 flex items-center justify-center rounded-[8px] text-neutral-caption hover:text-[#fa541c] hover:bg-[#fa541c]/10 transition-colors"
                        >
                          <Settings className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate('/user/ai/agents/studio');
                          }}
                          className="w-8 h-8 flex items-center justify-center rounded-[8px] text-neutral-caption hover:text-[#fa541c] hover:bg-[#fa541c]/10 transition-colors"
                        >
                          <Play className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Load More / Pagination */}
            <div className="mt-8 flex items-center justify-between">
              <div className="flex items-center gap-1">
                <button className="w-8 h-8 flex items-center justify-center rounded-[4px] border border-neutral-border text-neutral-caption hover:text-[#fa541c] hover:border-[#fa541c] transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button className="w-8 h-8 flex items-center justify-center rounded-[4px] bg-[#fa541c] text-white font-medium">1</button>
                <button className="w-8 h-8 flex items-center justify-center rounded-[4px] border border-neutral-border text-neutral-body hover:text-[#fa541c] hover:border-[#fa541c] transition-colors">2</button>
                <button className="w-8 h-8 flex items-center justify-center rounded-[4px] border border-neutral-border text-neutral-body hover:text-[#fa541c] hover:border-[#fa541c] transition-colors">3</button>
                <span className="px-2 text-neutral-caption">...</span>
                <button className="w-8 h-8 flex items-center justify-center rounded-[4px] border border-neutral-border text-neutral-body hover:text-[#fa541c] hover:border-[#fa541c] transition-colors">5</button>
                <button className="w-8 h-8 flex items-center justify-center rounded-[4px] border border-neutral-border text-neutral-body hover:text-[#fa541c] hover:border-[#fa541c] transition-colors">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
              
              <div className="flex items-center gap-4 text-[13px] text-neutral-body">
                <div className="flex items-center gap-2">
                  <span>每页</span>
                  <button className="flex items-center gap-1 px-2 py-1 border border-neutral-border rounded-[4px] hover:border-[#fa541c] transition-colors">
                    20 <ChevronDown className="w-3 h-3" />
                  </button>
                  <span>条</span>
                </div>
                <span>共 6 个数字员工</span>
              </div>
            </div>
        </div>

      {/* Agent Detail Modal */}
      {selectedAgent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setSelectedAgent(null)}>
          <div 
            className="bg-white rounded-[16px] w-full max-w-2xl overflow-hidden shadow-xl"
            onClick={e => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-neutral-border flex items-center justify-between bg-neutral-50/50">
              <h2 className="text-lg font-bold text-neutral-title">数字员工详情</h2>
              <button 
                onClick={() => setSelectedAgent(null)}
                className="text-neutral-caption hover:text-neutral-title p-1 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Modal Body */}
            <div className="p-6">
              <div className="flex items-start gap-5 mb-6">
                <div className={cn("w-16 h-16 rounded-[16px] flex items-center justify-center shrink-0", selectedAgent.bg, selectedAgent.color)}>
                  {selectedAgent.icon && <selectedAgent.icon className="w-8 h-8" strokeWidth={2} />}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-bold text-neutral-title">{selectedAgent.name}</h3>
                    <div className={cn(
                      "px-3 py-1 rounded-[6px] text-[12px] font-medium border",
                      selectedAgent.status === '运行中' 
                        ? 'bg-green-50 text-green-600 border-green-200' 
                        : 'bg-neutral-bg text-neutral-body border-neutral-border'
                    )}>
                      {selectedAgent.status}
                    </div>
                  </div>
                  <p className="text-[14px] text-neutral-body leading-relaxed">{selectedAgent.desc}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="p-4 rounded-[12px] bg-neutral-50 border border-neutral-100">
                  <div className="text-[13px] text-neutral-caption mb-1">累计调用次数</div>
                  <div className="text-2xl font-bold text-neutral-title">{selectedAgent.calls.toLocaleString()}</div>
                </div>
                <div className="p-4 rounded-[12px] bg-neutral-50 border border-neutral-100">
                  <div className="text-[13px] text-neutral-caption mb-1">能力评级</div>
                  <div className="text-2xl font-bold text-[#fa541c]">S+</div>
                </div>
              </div>
              
              <div className="bg-[#fff2e8] p-4 rounded-[12px] border border-[#ffbb96] mb-2">
                <h4 className="text-[14px] font-bold text-neutral-title mb-3 flex items-center gap-2">
                  <Play className="w-4 h-4 text-[#fa541c]" />
                  一键调用流程
                </h4>
                <div className="flex items-center gap-3 text-[13px] text-neutral-body font-medium">
                  <div className="flex-1 bg-white p-2.5 rounded-[8px] text-center shadow-sm border border-[#ffbb96]/50">选择数字员工</div>
                  <ChevronRight className="w-4 h-4 text-[#fa541c] shrink-0" />
                  <div className="flex-1 bg-white p-2.5 rounded-[8px] text-center shadow-sm border border-[#ffbb96]/50">输入任务描述</div>
                  <ChevronRight className="w-4 h-4 text-[#fa541c] shrink-0" />
                  <div className="flex-1 bg-white p-2.5 rounded-[8px] text-center shadow-sm border border-[#ffbb96]/50">执行多步任务</div>
                  <ChevronRight className="w-4 h-4 text-[#fa541c] shrink-0" />
                  <div className="flex-1 bg-white p-2.5 rounded-[8px] text-center shadow-sm border border-[#ffbb96]/50">查看执行结果</div>
                </div>
              </div>
            </div>
            
            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-neutral-border flex items-center justify-end gap-3 bg-neutral-50/50">
              <button 
                onClick={() => setSelectedAgent(null)}
                className="px-5 py-2 rounded-[8px] text-[14px] font-medium border border-neutral-border text-neutral-body hover:bg-neutral-100 transition-colors"
              >
                取消
              </button>
              <button 
                onClick={() => navigate('/user/ai/agents/studio')}
                className="bg-[#fa541c] hover:bg-[#fa541c]/90 text-white px-5 py-2 rounded-[8px] text-[14px] font-medium transition-colors flex items-center gap-2 shadow-sm"
              >
                <Play className="w-4 h-4 fill-current" />
                立即调用
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

