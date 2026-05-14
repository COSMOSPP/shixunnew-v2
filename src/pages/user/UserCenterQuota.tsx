import React, { useState } from "react";
import { ChevronRight, Cpu, Database, FolderKanban, Star, Bot, Key, Plus, History, Clock, Server, CheckCircle2, XCircle, AlertCircle, X, Info, HelpCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function UserCenterQuota() {
  const [activeTab, setActiveTab] = useState("overview"); // overview, history
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [selectedResource, setSelectedResource] = useState("gpu");

  const resources = [
    { id: 'gpu', name: 'GPU卡时', icon: Server, used: 85, total: 100, unit: '小时', color: '#fa541c', desc: '用于深度学习模型训练' },
    { id: 'cpu', name: 'CPU时长', icon: Cpu, used: 120, total: 500, unit: '小时', color: '#1677ff', desc: '用于通用计算任务' },
    { id: 'project', name: '项目额度', icon: FolderKanban, used: 2, total: 5, unit: '个', color: '#722ed1', desc: '可创建的实战项目数' },
    { id: 'dataset', name: '数据集额度', icon: Database, used: 9, total: 10, unit: '个', color: '#52c41a', desc: '可上传的数据集数' },
    { id: 'practice', name: '最佳实践额度', icon: Star, used: 1, total: 3, unit: '个', color: '#faad14', desc: '可发布的最佳实践数' },
    { id: 'assistant', name: '智能助手额度', icon: Bot, used: 5, total: 5, unit: '个', color: '#eb2f96', desc: '可创建的AI助手数量' },
    { id: 'token', name: 'Token额度', icon: Key, used: 85000, total: 100000, unit: 'Tokens', color: '#13c2c2', desc: '大模型API调用消耗' },
  ];

  const applyHistory = [
    { id: 1, type: 'GPU卡时', amount: '50 小时', duration: '1个月', reason: '深度学习模型训练需要更多算力支持，当前大作业急需GPU计算。', status: 'approved', time: '2026-05-10 14:30', msg: '已通过审批，将于 2026-06-10 到期' },
    { id: 2, type: 'Token额度', amount: '50000 Tokens', duration: '永久', reason: '大语言模型API调用频繁，项目测试需补充额度。', status: 'pending', time: '2026-05-13 09:15', msg: '管理员审核中，请耐心等待' },
    { id: 3, type: '最佳实践额度', amount: '2 个', duration: '永久', reason: '准备发布两个新的实战项目供社区学习。', status: 'rejected', time: '2026-04-20 16:45', msg: '驳回原因：您当前仍有闲置额度，请先使用完毕后再申请。' },
  ];

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    setShowApplyModal(false);
    // normally show a success toast here
  };

  const getStatusIcon = (status: string) => {
    if (status === 'approved') return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
    if (status === 'rejected') return <XCircle className="w-4 h-4 text-red-500" />;
    return <Clock className="w-4 h-4 text-orange-500" />;
  };

  const getStatusText = (status: string) => {
    if (status === 'approved') return <span className="text-emerald-600 font-bold">已通过</span>;
    if (status === 'rejected') return <span className="text-red-600 font-bold">已驳回</span>;
    return <span className="text-orange-600 font-bold">审核中</span>;
  };

  return (
    <div className="flex flex-col h-[calc(100vh-80px)]">
      {/* Header */}
      <div className="flex flex-shrink-0 items-center justify-between mb-6">
        <div className="flex items-center text-sm text-neutral-500">
          <Link to="/user" className="hover:text-[#fa541c] cursor-pointer transition-colors">首页</Link>
          <ChevronRight className="w-4 h-4 mx-1" />
          <Link to="/user/center" className="hover:text-[#fa541c] cursor-pointer transition-colors">个人中心</Link>
          <ChevronRight className="w-4 h-4 mx-1" />
          <span className="text-neutral-900 font-bold">资源额度</span>
        </div>
        <div className="flex items-center gap-3">
          <Button onClick={() => setShowApplyModal(true)} className="bg-[#fa541c] hover:bg-[#e84a15] text-white h-9 shadow-sm shadow-orange-500/20 transition-all font-bold">
            <Plus className="w-4 h-4 mr-1.5" />
            申请临时配额
          </Button>
        </div>
      </div>

      <div className="flex flex-1 min-h-0 bg-white rounded-2xl shadow-sm border border-neutral-200 overflow-hidden flex-col">
        {/* Tabs */}
        <div className="flex items-center px-6 pt-5 pb-0 border-b border-neutral-100 shrink-0">
          <button 
            onClick={() => setActiveTab('overview')}
            className={cn("px-4 py-3 text-[15px] font-bold border-b-2 transition-colors", activeTab === 'overview' ? "border-[#fa541c] text-[#fa541c]" : "border-transparent text-neutral-500 hover:text-neutral-800")}
          >
            额度概览
          </button>
          <button 
            onClick={() => setActiveTab('history')}
            className={cn("px-4 py-3 text-[15px] font-bold border-b-2 transition-colors flex items-center gap-2", activeTab === 'history' ? "border-[#fa541c] text-[#fa541c]" : "border-transparent text-neutral-500 hover:text-neutral-800")}
          >
            审批历史 <span className="bg-orange-100 text-[#fa541c] text-[10px] px-1.5 py-0.5 rounded-full leading-none">1待审批</span>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-neutral-50/30">
          {activeTab === 'overview' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {resources.map(res => {
                const percent = Math.round((res.used / res.total) * 100);
                const isWarning = percent >= 80;
                const isCritical = percent >= 95;

                return (
                  <div key={res.id} className="bg-white rounded-2xl p-5 border border-neutral-200 shadow-sm hover:shadow-md hover:border-orange-200 transition-all group relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 rounded-full blur-3xl opacity-10 transition-opacity group-hover:opacity-20" style={{ backgroundColor: res.color }}></div>
                    
                    <div className="flex items-center justify-between mb-4 relative z-10">
                      <div className="flex items-center gap-2.5">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center border border-neutral-100 shadow-sm bg-white" style={{ color: res.color }}>
                          <res.icon className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="text-[14px] font-bold text-neutral-900 leading-tight">{res.name}</h4>
                          <span className="text-[11px] text-neutral-400">{res.desc}</span>
                        </div>
                      </div>
                      <div className="group/tooltip relative">
                         <HelpCircle className="w-4 h-4 text-neutral-300 cursor-help hover:text-neutral-500" />
                      </div>
                    </div>

                    <div className="mt-6 mb-2 flex items-end justify-between relative z-10">
                      <div>
                        <span className="text-3xl font-black tracking-tight" style={{ color: isCritical ? '#ef4444' : '#1f2937' }}>{res.used}</span>
                        <span className="text-neutral-400 font-medium text-sm ml-1">/ {res.total} {res.unit}</span>
                      </div>
                      <span className={cn("text-[12px] font-bold px-2 py-0.5 rounded-md", isCritical ? "bg-red-50 text-red-500" : isWarning ? "bg-orange-50 text-orange-500" : "bg-neutral-100 text-neutral-500")}>
                        已用 {percent}%
                      </span>
                    </div>

                    <div className="w-full bg-neutral-100 h-2 rounded-full overflow-hidden relative z-10">
                      <div 
                        className={cn("h-full rounded-full transition-all duration-1000", isCritical ? "bg-red-500" : isWarning ? "bg-orange-400" : "bg-emerald-500")}
                        style={{ width: `${percent}%`, backgroundColor: !isCritical && !isWarning ? res.color : undefined }}
                      ></div>
                    </div>

                    {isWarning && (
                      <div className="mt-3 flex items-center gap-1.5 text-[11px] text-orange-600 font-medium relative z-10 bg-orange-50 px-2 py-1.5 rounded-lg border border-orange-100/50">
                        <AlertCircle className="w-3.5 h-3.5" /> 额度即将耗尽，建议提前申请
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-sm">
              <div className="grid grid-cols-6 gap-4 p-4 border-b border-neutral-100 bg-neutral-50/80 text-[13px] font-bold text-neutral-500">
                <div className="col-span-2">申请内容</div>
                <div>申请数量</div>
                <div>使用期限</div>
                <div>申请时间</div>
                <div>状态</div>
              </div>
              <div className="divide-y divide-neutral-100">
                {applyHistory.map(history => (
                  <div key={history.id} className="grid grid-cols-6 gap-4 p-5 items-center hover:bg-neutral-50/50 transition-colors">
                    <div className="col-span-2">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[14px] font-bold text-neutral-900">{history.type}</span>
                      </div>
                      <p className="text-[12px] text-neutral-500 leading-relaxed pr-4 line-clamp-1" title={history.reason}>{history.reason}</p>
                    </div>
                    <div className="text-[13px] font-bold text-neutral-800">{history.amount}</div>
                    <div className="text-[13px] font-medium text-neutral-600">{history.duration}</div>
                    <div className="text-[12px] text-neutral-500">{history.time}</div>
                    <div>
                      <div className="flex items-center gap-1.5 mb-1">
                        {getStatusIcon(history.status)}
                        {getStatusText(history.status)}
                      </div>
                      {history.msg && (
                        <div className={cn("text-[11px] mt-1.5", history.status === 'approved' ? 'text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded inline-block' : history.status === 'rejected' ? 'text-red-500 bg-red-50 px-2 py-0.5 rounded inline-block' : 'text-orange-500')}>{history.msg}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Apply Modal */}
      {showApplyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animation-fade-in">
          <div className="bg-white rounded-2xl shadow-xl w-[500px] overflow-hidden border border-neutral-200" onClick={e => e.stopPropagation()}>
            <div className="p-5 border-b border-neutral-100 flex items-center justify-between bg-gradient-to-r from-orange-50/50 to-white">
              <h2 className="text-lg font-bold text-neutral-900 flex items-center gap-2">
                <Plus className="w-5 h-5 text-[#fa541c]" /> 申请临时配额
              </h2>
              <button onClick={() => setShowApplyModal(false)} className="text-neutral-400 hover:text-neutral-700 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleApply} className="p-6">
              <div className="space-y-5">
                <div className="bg-orange-50 border border-orange-100 rounded-xl p-3 flex items-start gap-3">
                  <Info className="w-5 h-5 text-[#fa541c] shrink-0 mt-0.5" />
                  <p className="text-[12px] text-orange-800/80 leading-relaxed font-medium">临时配额申请提交后将由租户管理员进行审批，审批通过后即刻生效。请根据实际项目需求合理申请，避免资源浪费。</p>
                </div>

                <div className="space-y-2">
                  <label className="text-[13px] font-bold text-neutral-700 flex items-center gap-1">资源类型 <span className="text-red-500">*</span></label>
                  <select 
                    value={selectedResource}
                    onChange={(e) => setSelectedResource(e.target.value)}
                    className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm text-neutral-800 focus:outline-none focus:border-[#fa541c] focus:ring-1 focus:ring-[#fa541c]"
                  >
                    {resources.map(res => (
                      <option key={res.id} value={res.id}>{res.name}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[13px] font-bold text-neutral-700 flex items-center gap-1">申请数量 <span className="text-red-500">*</span></label>
                    <input 
                      type="number" 
                      placeholder="如: 50"
                      required
                      className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#fa541c] focus:ring-1 focus:ring-[#fa541c]"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[13px] font-bold text-neutral-700 flex items-center gap-1">使用期限 <span className="text-red-500">*</span></label>
                    <select className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm text-neutral-800 focus:outline-none focus:border-[#fa541c] focus:ring-1 focus:ring-[#fa541c]">
                      <option>1周</option>
                      <option>1个月</option>
                      <option>3个月</option>
                      <option>永久</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[13px] font-bold text-neutral-700 flex items-center gap-1">申请原因说明 <span className="text-red-500">*</span></label>
                  <textarea 
                    placeholder="请详细描述您申请该资源的具体业务场景和必要性..."
                    required
                    rows={4}
                    className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#fa541c] focus:ring-1 focus:ring-[#fa541c] resize-none"
                  ></textarea>
                </div>
              </div>

              <div className="mt-8 flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={() => setShowApplyModal(false)} className="border-neutral-200 text-neutral-600 font-bold">取消</Button>
                <Button type="submit" className="bg-[#fa541c] hover:bg-[#e84a15] text-white font-bold px-6 shadow-md shadow-orange-500/20">提交申请</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
