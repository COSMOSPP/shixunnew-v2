import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  ChevronLeft, ChevronDown, History, FolderOpen, FileText, Rocket, X, Plus,
  Sun, GitBranch, Copy, Bot, Sparkles, Code, Ghost, Search, List, LayoutDashboard,
  Maximize2, ChevronUp, ChevronRight, Info, Mic, CheckCircle2, ArrowUpRight
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function SkillBuilder() {
  const navigate = useNavigate();
  const [activeBuilderTab, setActiveBuilderTab] = useState<'preview' | 'deploy'>('preview');
  const [deployState, setDeployState] = useState<'idle' | 'success'>('idle');

  return (
    <div className="fixed inset-0 z-[150] flex flex-col h-full bg-white font-sans w-full">
      {/* Top Header */}
      <div className="h-14 border-b border-neutral-200 flex items-center justify-between px-4 bg-white shrink-0">
        {/* Left: Title & Actions */}
        <div className="flex items-center gap-4">
          <button 
            onClick={() => {
               navigate(-1);
            }}
            className="flex items-center justify-center p-1.5 hover:bg-neutral-100 rounded text-neutral-600 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 text-sm font-medium text-neutral-800 bg-neutral-100/50 px-3 py-1.5 rounded-lg border border-neutral-200/50">
            <div className="w-5 h-5 rounded overflow-hidden shrink-0">
               <img src="https://picsum.photos/seed/datavis/32/32" className="w-full h-full object-cover" alt="icon"/>
            </div>
            数据可视化技能
            <ChevronDown className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
          </div>
          <div className="flex items-center gap-1 text-neutral-500">
             <button className="p-1.5 hover:bg-neutral-100 rounded"><History className="w-4 h-4" /></button>
             <button className="p-1.5 hover:bg-neutral-100 rounded"><FolderOpen className="w-4 h-4" /></button>
          </div>
        </div>
        
        {/* Center/Right Tabs */}
        <div className="flex-1 flex justify-start items-end h-full ml-8 gap-1 pt-3">
           <div className={cn(
             "px-4 py-2 text-sm font-medium border-t-2 rounded-t-lg flex items-center gap-2 cursor-pointer transition-colors",
             activeBuilderTab === 'preview' ? "bg-white border-[#fa541c] text-neutral-900 border-x border-neutral-200 shadow-[0_-2px_4px_rgba(0,0,0,0.02)]" : "bg-neutral-100 border-transparent text-neutral-500 hover:bg-neutral-200"
           )}
           onClick={() => setActiveBuilderTab('preview')}
           >
             <FileText className="w-4 h-4" /> 预览
           </div>
           {activeBuilderTab === 'deploy' && (
             <div className={cn(
               "px-4 py-2 text-sm font-medium border-t-2 rounded-t-lg flex items-center gap-2 cursor-pointer transition-colors",
               "bg-white border-[#fa541c] text-neutral-900 border-x border-neutral-200 shadow-[0_-2px_4px_rgba(0,0,0,0.02)]"
             )}>
               <Rocket className="w-4 h-4" /> 部署
               <X className="w-3.5 h-3.5 ml-2 hover:text-[#fa541c]" onClick={(e) => { e.stopPropagation(); setActiveBuilderTab('preview'); }} />
             </div>
           )}
           <button className="px-3 py-2 text-sm text-neutral-500 hover:text-neutral-800 flex items-center gap-1 hover:bg-neutral-100 rounded-t-lg ml-1">
              <Plus className="w-4 h-4" /> 新标签页
           </button>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
           <button className="p-1.5 text-neutral-500 hover:bg-neutral-100 rounded"><Sun className="w-4 h-4" /></button>
           <button className="p-1.5 text-neutral-500 hover:bg-neutral-100 rounded"><GitBranch className="w-4 h-4" /></button>
           <button className="p-1.5 text-neutral-500 hover:bg-neutral-100 rounded"><Copy className="w-4 h-4" /></button>
           <button 
             onClick={() => setActiveBuilderTab('deploy')}
             className="bg-[#fa541c] hover:bg-[#e84a15] text-white px-5 py-1.5 rounded-lg text-[13px] font-bold shadow-sm transition-colors ml-2"
           >
             部署
           </button>
        </div>
      </div>

      {/* Main Workspace */}
      <div className="flex-1 flex overflow-hidden bg-neutral-50/30">
        {/* Left Chat Area */}
        <div className="w-[420px] flex flex-col border-r border-neutral-200 bg-white shadow-[2px_0_12px_rgba(0,0,0,0.02)] relative z-10 shrink-0">
          {/* Chat History */}
          <div className="flex-1 overflow-y-auto p-5 space-y-6 custom-scrollbar">
             {/* User Bubble */}
             <div className="flex justify-end">
                <div className="bg-[#f0f0f0] text-neutral-800 px-4 py-3 rounded-2xl rounded-tr-sm text-[14px] max-w-[85%] leading-relaxed">
                   帮我做一个信息图设计技能，支持输入数据，生成高质量数据可视化图表
                </div>
             </div>
             
             {/* AI Bubble */}
             <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center shrink-0 mt-1">
                   <Bot className="w-4 h-4 text-blue-600" />
                </div>
                <div className="flex-1 flex flex-col gap-3">
                   <div className="text-[14px] font-medium text-neutral-500 flex items-center gap-1.5">
                     <Sparkles className="w-3.5 h-3.5" /> 思考过程
                   </div>
                   <div className="text-[14px] text-neutral-800 leading-relaxed">
                     我来分析这个需求并创建信息图设计技能。
                   </div>
                   
                   <div className="flex flex-col gap-1.5">
                     <div className="flex items-center gap-2 text-[13px] text-neutral-600 bg-neutral-50 px-3 py-2 rounded border border-neutral-100">
                       <FileText className="w-3.5 h-3.5" /> 更新计划
                     </div>
                     <div className="flex items-center gap-2 text-[13px] text-neutral-600 bg-neutral-50 px-3 py-2 rounded border border-neutral-100">
                       <Sparkles className="w-3.5 h-3.5" /> 思考过程
                     </div>
                     <div className="flex items-center gap-2 text-[13px] text-neutral-600 bg-neutral-50 px-3 py-2 rounded border border-neutral-100">
                       <FileText className="w-3.5 h-3.5" /> 更新计划
                     </div>
                     <div className="flex items-center gap-2 text-[13px] text-neutral-600 bg-neutral-50 px-3 py-2 rounded border border-neutral-100">
                       <Sparkles className="w-3.5 h-3.5" /> 思考过程
                     </div>
                   </div>
                   
                   <div className="text-[14px] text-neutral-800 mt-2">
                     现在开始创建技能文件，并执行：
                   </div>
                   
                   <div className="flex flex-col gap-1.5">
                     <div className="flex items-center gap-2 text-[13px] text-neutral-600 bg-neutral-50 px-3 py-2 rounded border border-neutral-100">
                       <Code className="w-3.5 h-3.5" /> 执行命令 mkdir -p /workspace/projects/infographic-designer/scripts...
                     </div>
                     <div className="flex items-center gap-2 text-[13px] text-neutral-600 bg-neutral-50 px-3 py-2 rounded border border-neutral-100">
                       <FileText className="w-3.5 h-3.5" /> 创建文件 /workspace/projects/infographic-designer/SKILL.md
                     </div>
                     <div className="flex items-center gap-2 text-[13px] text-neutral-600 bg-neutral-50 px-3 py-2 rounded border border-neutral-100">
                       <FileText className="w-3.5 h-3.5" /> 创建文件 /workspace/projects/infographic-designer/references/chart-types.md
                     </div>
                     <div className="flex items-center gap-2 text-[13px] text-neutral-600 bg-neutral-50 px-3 py-2 rounded border border-neutral-100">
                       <FileText className="w-3.5 h-3.5" /> 创建文件 /workspace/projects/infographic-designer/scripts/generate_chart.py
                     </div>
                     <div className="flex items-center gap-2 text-[13px] text-neutral-600 bg-neutral-50 px-3 py-2 rounded border border-neutral-100">
                       <Sparkles className="w-3.5 h-3.5" /> 思考过程
                     </div>
                   </div>
                   
                   <div className="text-[14px] text-neutral-800 mt-2">
                     现在验证脚本并打包：
                   </div>
                   <div className="flex gap-2 items-center mt-2 p-2 border border-neutral-100 rounded-full w-fit">
                     <div className="w-2 h-2 rounded-full bg-[#fa541c] animate-bounce"></div>
                     <div className="w-2 h-2 rounded-full bg-[#fa541c] animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                     <div className="w-2 h-2 rounded-full bg-[#fa541c] animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                   </div>
                </div>
             </div>
          </div>
          
          {/* Chat Input */}
          <div className="p-4 bg-white border-t border-neutral-100">
             <div className="border border-neutral-200 rounded-xl overflow-hidden focus-within:border-blue-400 focus-within:ring-1 focus-within:ring-blue-400 transition-all shadow-sm bg-white">
                <textarea 
                  className="w-full min-h-[60px] max-h-[200px] p-3 text-[14px] outline-none resize-none placeholder:text-neutral-400"
                  placeholder="欢迎使用扣子编程，可以在此输入你的要求。"
                />
                <div className="flex items-center justify-between px-2 pb-2">
                   <div className="flex items-center gap-1">
                      <button className="p-1.5 text-neutral-400 hover:text-neutral-700 rounded"><Plus className="w-4 h-4"/></button>
                      <div className="text-[12px] bg-neutral-100 text-neutral-600 px-2 py-1 rounded flex items-center gap-1 ml-1 cursor-pointer">
                         <Sparkles className="w-3 h-3" /> 自动 <ChevronDown className="w-3 h-3" />
                      </div>
                   </div>
                   <div className="flex items-center gap-2">
                     <button className="p-1.5 text-neutral-400 hover:text-neutral-700 rounded"><Mic className="w-4 h-4"/></button>
                     <button className="w-7 h-7 bg-black text-white flex items-center justify-center rounded-full hover:bg-neutral-800 transition-colors">
                        <div className="w-2.5 h-2.5 bg-white rounded-sm"></div>
                     </button>
                   </div>
                </div>
             </div>
          </div>
        </div>

        {/* Right Workspace */}
        <div className="flex-1 relative flex flex-col bg-white">
           {activeBuilderTab === 'preview' ? (
              <div className="flex-1 flex flex-col items-center justify-center text-neutral-400 relative">
                 <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#e5e7eb 1px, transparent 1px)', backgroundSize: '16px 16px' }}></div>
                 <Ghost className="w-12 h-12 text-neutral-300 mb-4" />
                 <h2 className="text-[16px] font-medium text-neutral-600 mb-8 z-10">技能正在生成中...</h2>
                 
                 <div className="space-y-4 z-10">
                    <div className="flex items-center gap-4 text-[13px] justify-between w-[320px]">
                       <div className="flex items-center gap-2 text-neutral-400">
                         <Search className="w-4 h-4" /> 快速检索代码内容
                       </div>
                       <div className="flex items-center gap-1">
                         <kbd className="px-1.5 py-0.5 bg-white border border-neutral-200 rounded text-neutral-500 shadow-sm font-mono text-[11px]">⌘</kbd>
                         <kbd className="px-1.5 py-0.5 bg-white border border-neutral-200 rounded text-neutral-500 shadow-sm font-mono text-[11px]">F</kbd>
                         <span className="mx-1 text-neutral-300">/</span>
                         <kbd className="px-1.5 py-0.5 bg-white border border-neutral-200 rounded text-neutral-500 shadow-sm font-mono text-[11px]">Ctrl</kbd>
                         <kbd className="px-1.5 py-0.5 bg-white border border-neutral-200 rounded text-neutral-500 shadow-sm font-mono text-[11px]">F</kbd>
                       </div>
                    </div>
                    
                    <div className="flex items-center gap-4 text-[13px] justify-between w-[320px]">
                       <div className="flex items-center gap-2 text-neutral-400">
                         <List className="w-4 h-4" /> 切换文件目录可见性
                       </div>
                       <div className="flex items-center gap-1">
                         <kbd className="px-1.5 py-0.5 bg-white border border-neutral-200 rounded text-neutral-500 shadow-sm font-mono text-[11px]">⌥</kbd>
                         <kbd className="px-1.5 py-0.5 bg-white border border-neutral-200 rounded text-neutral-500 shadow-sm font-mono text-[11px]">B</kbd>
                         <span className="mx-1 text-neutral-300">/</span>
                         <kbd className="px-1.5 py-0.5 bg-white border border-neutral-200 rounded text-neutral-500 shadow-sm font-mono text-[11px]">Alt</kbd>
                         <kbd className="px-1.5 py-0.5 bg-white border border-neutral-200 rounded text-neutral-500 shadow-sm font-mono text-[11px]">B</kbd>
                       </div>
                    </div>

                    <div className="flex items-center gap-4 text-[13px] justify-between w-[320px]">
                       <div className="flex items-center gap-2 text-neutral-400">
                         <LayoutDashboard className="w-4 h-4" /> 切换底部面板可见性
                       </div>
                       <div className="flex items-center gap-1">
                         <kbd className="px-1.5 py-0.5 bg-white border border-neutral-200 rounded text-neutral-500 shadow-sm font-mono text-[11px]">⌥</kbd>
                         <kbd className="px-1.5 py-0.5 bg-white border border-neutral-200 rounded text-neutral-500 shadow-sm font-mono text-[11px]">`</kbd>
                         <span className="mx-1 text-neutral-300">/</span>
                         <kbd className="px-1.5 py-0.5 bg-white border border-neutral-200 rounded text-neutral-500 shadow-sm font-mono text-[11px]">Alt</kbd>
                         <kbd className="px-1.5 py-0.5 bg-white border border-neutral-200 rounded text-neutral-500 shadow-sm font-mono text-[11px]">`</kbd>
                       </div>
                    </div>

                    <div className="flex items-center gap-4 text-[13px] justify-between w-[320px]">
                       <div className="flex items-center gap-2 text-neutral-400">
                         <Plus className="w-4 h-4" /> 打开新的默认标签页
                       </div>
                       <div className="flex items-center gap-1">
                         <kbd className="px-1.5 py-0.5 bg-white border border-neutral-200 rounded text-neutral-500 shadow-sm font-mono text-[11px]">⌥</kbd>
                         <kbd className="px-1.5 py-0.5 bg-white border border-neutral-200 rounded text-neutral-500 shadow-sm font-mono text-[11px]">N</kbd>
                         <span className="mx-1 text-neutral-300">/</span>
                         <kbd className="px-1.5 py-0.5 bg-white border border-neutral-200 rounded text-neutral-500 shadow-sm font-mono text-[11px]">Alt</kbd>
                         <kbd className="px-1.5 py-0.5 bg-white border border-neutral-200 rounded text-neutral-500 shadow-sm font-mono text-[11px]">N</kbd>
                       </div>
                    </div>
                 </div>
              </div>
           ) : deployState === 'idle' ? (
              <div className="flex-1 flex flex-col items-center bg-white p-10 overflow-y-auto custom-scrollbar">
                 <div className="w-full flex justify-start mb-6">
                   <span className="text-[16px] font-bold text-neutral-800 border-b-2 border-neutral-800 pb-2">总览</span>
                 </div>
                 <div className="w-full max-w-[600px] flex flex-col gap-6 mt-4 pb-20">
                    <h2 className="text-[20px] font-bold text-neutral-900 text-center mb-2">开始部署你的项目吧</h2>
                    
                    <div className="flex flex-col gap-2">
                       <label className="text-[13px] font-bold text-neutral-700">部署版本</label>
                       <div className="border border-neutral-200 rounded-xl px-4 py-3 bg-white flex items-center justify-between cursor-pointer shadow-sm hover:border-neutral-300 transition-colors">
                          <div className="flex items-center gap-3">
                             <span className="text-[13px] font-mono font-bold text-neutral-800 bg-neutral-100 px-2 py-0.5 rounded">d690426</span>
                             <span className="text-[13px] text-neutral-600">feat: 创建信息图设计技能 infographic-designer</span>
                          </div>
                          <div className="flex items-center gap-2 text-neutral-400">
                             <span className="text-[12px]">2 分钟前</span>
                             <ChevronDown className="w-4 h-4" />
                          </div>
                       </div>
                    </div>

                    <div className="flex flex-col gap-2">
                       <label className="text-[13px] font-bold text-neutral-700">
                         生产环境变量
                         <span className="block font-normal text-neutral-400 text-[12px] mt-0.5">查看、新增、修改或同步至生产环境的环境变量</span>
                       </label>
                       <div className="border border-neutral-200 rounded-xl px-4 py-3 bg-white flex items-center justify-between cursor-pointer shadow-sm hover:border-neutral-300 transition-colors mt-1">
                          <span className="text-[14px] text-neutral-800 font-medium">查看详情</span>
                          <ChevronRight className="w-4 h-4 text-neutral-400" />
                       </div>
                    </div>

                    <div className="border border-neutral-200 rounded-xl px-4 py-4 bg-white flex items-center justify-between shadow-sm">
                       <div className="flex items-center gap-2">
                         <span className="text-[14px] text-neutral-800 font-medium">加密部署</span>
                         <Info className="w-3.5 h-3.5 text-neutral-400" />
                       </div>
                       <div className="w-10 h-5 bg-neutral-200 rounded-full flex items-center px-0.5 cursor-pointer">
                          <div className="w-4 h-4 bg-white rounded-full shadow-sm"></div>
                       </div>
                    </div>

                    <button 
                       className="w-full bg-[#fa541c] hover:bg-[#e84a15] text-white py-3.5 rounded-xl text-[15px] font-bold shadow-md transition-colors mt-4"
                       onClick={() => {
                          setDeployState('success');
                       }}
                    >
                       开始部署
                    </button>
                 </div>
              </div>
           ) : (
              <div className="flex-1 flex flex-col bg-white p-10 overflow-y-auto custom-scrollbar relative">
                 <div className="w-full flex justify-start mb-6 shrink-0">
                    <span className="text-[16px] font-bold text-neutral-800 border-b-2 border-neutral-800 pb-2">总览</span>
                 </div>

                 <div className="flex items-center text-sm font-medium text-neutral-600 cursor-pointer mb-6 hover:text-neutral-900 transition-colors w-fit" onClick={() => setDeployState('idle')}>
                    <ChevronLeft className="w-4 h-4 mr-1" /> 返回总览
                 </div>
                 
                 <div className="w-full border border-neutral-200 rounded-xl bg-white shadow-sm overflow-hidden mb-6 flex-1 max-h-[800px] flex flex-col">
                    <div className="px-5 py-4 border-b border-neutral-100 flex items-center justify-between cursor-pointer hover:bg-neutral-50 transition-colors shrink-0">
                       <div className="flex items-center gap-2 text-[14px] font-bold text-neutral-800">部署成功</div>
                       <ChevronDown className="w-4 h-4 text-neutral-400" />
                    </div>
                    
                    <div className="p-8 flex-1 flex flex-col">
                       <div className="flex items-center justify-between w-full mx-auto mb-20 relative px-4">
                          {/* Connecting Lines */}
                          <div className="absolute left-[40px] right-[40px] top-[12px] h-[1px] bg-neutral-800 z-0"></div>
                          
                          {/* Step 1 */}
                          <div className="flex items-center gap-2 bg-white px-2 z-10 relative">
                             <div className="w-6 h-6 rounded-full bg-neutral-800 text-white flex items-center justify-center shrink-0">
                                <CheckCircle2 className="w-4 h-4" />
                             </div>
                             <span className="text-[13px] font-bold text-neutral-800 pr-1">打包</span>
                          </div>
                          
                          {/* Step 2 */}
                          <div className="flex items-center gap-2 bg-white px-2 z-10 relative">
                             <div className="w-6 h-6 rounded-full bg-neutral-800 text-white flex items-center justify-center shrink-0">
                                <CheckCircle2 className="w-4 h-4" />
                             </div>
                             <span className="text-[13px] font-bold text-neutral-800 pr-1">构建</span>
                          </div>
                          
                          {/* Step 3 */}
                          <div className="flex items-center gap-2 bg-white px-2 z-10 relative">
                             <div className="w-6 h-6 rounded-full bg-neutral-800 text-white flex items-center justify-center shrink-0">
                                <CheckCircle2 className="w-4 h-4" />
                             </div>
                             <span className="text-[13px] font-bold text-neutral-800 pr-1">部署</span>
                          </div>
                       </div>

                       <div className="flex flex-col items-center justify-center text-center mt-6">
                          <div className="w-16 h-16 rounded-2xl border border-neutral-200 flex items-center justify-center mb-6 shadow-sm bg-white">
                             <CheckCircle2 className="w-7 h-7 text-neutral-800" />
                          </div>
                          <h3 className="text-[22px] font-bold text-neutral-900 mb-3">部署成功</h3>
                          <p className="text-[14px] text-neutral-500 mb-10">请前往扣子对话区进行体验</p>
                          <button 
                             onClick={() => navigate('/practices', { state: { openChat: true } })}
                             className="bg-neutral-900 hover:bg-neutral-800 text-white px-6 py-2.5 rounded-lg text-[14px] font-medium transition-colors flex items-center gap-2 shadow-sm"
                          >
                             立即体验 <ArrowUpRight className="w-4 h-4" />
                          </button>
                       </div>
                    </div>
                 </div>
              </div>
           )}
           
           {/* Terminal Footer */}
           <div className="h-10 border-t border-neutral-200 flex items-center justify-between px-4 text-[12px] text-neutral-400 bg-white shrink-0 absolute bottom-0 left-0 right-0 z-10">
              <span className="font-bold text-neutral-800">终端</span>
              <div className="flex items-center gap-4">
                 <span>已使用 / 空间总容量: <strong className="text-neutral-700">248KB</strong> / 1.0GB</span>
                 <button className="px-2 py-0.5 border border-neutral-200 rounded text-neutral-600 hover:bg-neutral-50 transition-colors bg-white">清理</button>
                 <div className="flex items-center gap-3">
                   <button className="hover:text-neutral-700"><Plus className="w-3.5 h-3.5"/></button>
                   <button className="hover:text-neutral-700"><Maximize2 className="w-3.5 h-3.5"/></button>
                   <button className="hover:text-neutral-700"><ChevronUp className="w-3.5 h-3.5"/></button>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
