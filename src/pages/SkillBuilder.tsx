import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  ArrowLeft, Bot, User, Paperclip, Send, Sparkles, Terminal as TerminalIcon, 
  Code, PlayCircle, CheckCircle2, ChevronDown, Plus, LayoutTemplate, 
  Settings, Trash2, Cpu, FileCode, Wand2, RefreshCw, Box, SunMoon, Command, ToggleLeft, ToggleRight, Server
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function SkillBuilder() {
  const navigate = useNavigate();
  const [input, setInput] = useState("");
  const [autoMode, setAutoMode] = useState(true);
  const [generating, setGenerating] = useState(true); // For mock "生成中" state

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-[#f5f6f8] text-neutral-body font-sans overflow-hidden">
      {/* 1. Header Area (部署与发布 & 返回) */}
      <div className="h-[60px] border-b border-neutral-border shrink-0 px-5 flex items-center justify-between bg-white shadow-sm z-10">
        <div className="flex items-center gap-4">
          <button 
            onClick={handleBack}
            className="flex items-center gap-2 text-neutral-caption hover:text-neutral-title transition-colors text-[14px] font-medium"
          >
            <ArrowLeft className="w-4 h-4" /> 返回最佳实践
          </button>
          <div className="w-[1px] h-4 bg-neutral-border"></div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#fa541c]" />
            <h1 className="text-[15px] font-bold text-neutral-title tracking-wide">Skill Builder Agent 协同开发环境</h1>
          </div>
        </div>
        
        {/* 部署与发布核心按钮 */}
        <div className="flex items-center gap-3">
          <button className="px-5 py-1.5 rounded-md bg-white hover:bg-neutral-bg text-[13px] font-medium transition-colors border border-neutral-border text-neutral-title flex items-center gap-2 shadow-sm">
            <PlayCircle className="w-4 h-4 text-emerald-500" /> 预览
          </button>
          <button className="bg-gradient-to-r from-[#fa541c] to-[#ff7a45] hover:opacity-90 text-white px-6 py-1.5 rounded-md font-bold transition-opacity text-[13px] shadow-sm shadow-orange-500/20 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" /> 部署
          </button>
        </div>
      </div>

      <div className="flex flex-1 min-h-0">
        {/* 2. Left Side: Skill Builder 交互区 */}
        <div className="w-[35%] lg:w-[420px] border-r border-neutral-border flex flex-col bg-[#f8fafc] shrink-0">
          
          {/* Agent Chat List */}
          <div className="flex-1 overflow-y-auto p-5 pb-8 flex flex-col gap-6 custom-scrollbar">
            
            {/* Agent 引导语 */}
            <div className="flex gap-3 max-w-[95%]">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-orange-400 to-[#fa541c] flex items-center justify-center shrink-0 shadow-sm">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="flex flex-col gap-1.5 w-full">
                <span className="text-[12px] font-bold text-neutral-caption ml-1">Builder Agent</span>
                <div className="bg-white border border-neutral-border rounded-2xl rounded-tl-none p-4 text-[14px] leading-relaxed text-neutral-body shadow-sm">
                  <p className="mb-4 text-neutral-title">你好！我是 Skill Builder Agent。请告诉我你想要做什么，或者直接从下方选择核心操作：</p>
                  
                  {/* 核心操作选项 */}
                  <div className="flex flex-col gap-2">
                    <button className="flex items-center justify-between bg-neutral-bg hover:bg-[#f1f5f9] border border-transparent hover:border-[#fa541c]/30 rounded-lg px-4 py-2.5 transition-all text-left group">
                       <span className="flex items-center gap-2 text-[13px] font-medium text-neutral-title group-hover:text-[#fa541c]">
                         <Wand2 className="w-4 h-4 text-blue-500" /> 创建新 Skill
                       </span>
                       <ChevronDown className="w-4 h-4 text-neutral-caption -rotate-90 group-hover:text-[#fa541c] transition-colors" />
                    </button>
                    <button className="flex items-center justify-between bg-neutral-bg hover:bg-[#f1f5f9] border border-transparent hover:border-[#fa541c]/30 rounded-lg px-4 py-2.5 transition-all text-left group">
                       <span className="flex items-center gap-2 text-[13px] font-medium text-neutral-title group-hover:text-[#fa541c]">
                         <Settings className="w-4 h-4 text-emerald-500" /> 修改现有 Skill
                       </span>
                       <ChevronDown className="w-4 h-4 text-neutral-caption -rotate-90 group-hover:text-[#fa541c] transition-colors" />
                    </button>
                    <button className="flex items-center justify-between bg-neutral-bg hover:bg-[#f1f5f9] border border-transparent hover:border-[#fa541c]/30 rounded-lg px-4 py-2.5 transition-all text-left group">
                       <span className="flex items-center gap-2 text-[13px] font-medium text-neutral-title group-hover:text-[#fa541c]">
                         <RefreshCw className="w-4 h-4 text-purple-500" /> 转换外部 Skill
                       </span>
                       <ChevronDown className="w-4 h-4 text-neutral-caption -rotate-90 group-hover:text-[#fa541c] transition-colors" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Mock User Message */}
            <div className="flex gap-3 w-full justify-end">
              <div className="flex flex-col gap-1 items-end max-w-[85%]">
                <span className="text-[12px] font-bold text-neutral-caption mr-1">我</span>
                <div className="bg-[#fff2e8] border border-[#ffbb96] rounded-2xl rounded-tr-none p-4 text-[14px] leading-relaxed text-[#0f172a] shadow-sm font-medium">
                  帮我创建一个自动化数据处理环境，支持 Excel 文件的批量清洗，并把缺失值默认填充。
                </div>
              </div>
              <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center shrink-0 border border-neutral-border shadow-sm">
                <User className="w-4 h-4 text-slate-500" />
              </div>
            </div>

            {/* Mock Generating State inside Chat */}
            {generating && (
              <div className="flex gap-3 max-w-[95%]">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-orange-400 to-[#fa541c] flex items-center justify-center shrink-0 shadow-sm">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="flex items-center gap-3 bg-white border border-[#fa541c]/30 rounded-2xl rounded-tl-none px-5 py-3.5 text-[13px] shadow-sm">
                  <div className="flex gap-1">
                    <div className="w-1.5 h-1.5 bg-[#fa541c] rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 bg-[#fa541c] rounded-full animate-bounce" style={{animationDelay: "0.2s"}}></div>
                    <div className="w-1.5 h-1.5 bg-[#fa541c] rounded-full animate-bounce" style={{animationDelay: "0.4s"}}></div>
                  </div>
                  <span className="font-mono tracking-wide font-bold bg-gradient-to-r from-[#fa541c] to-orange-400 bg-clip-text text-transparent">正在解析需求并生成技能配置，请关注右侧面板...</span>
                </div>
              </div>
            )}
          </div>
          
          {/* 需求输入框 & 快捷操作按钮 */}
          <div className="p-4 bg-white border-t border-neutral-border z-10 shadow-[0_-4px_10px_-5px_rgba(0,0,0,0.05)]">
            {/* Quick Actions Bar */}
            <div className="mb-3 flex items-center justify-between">
               <div className="flex gap-2">
                 <button className="flex items-center gap-1.5 text-[12px] bg-neutral-bg hover:bg-[#e2e8f0] border border-transparent text-neutral-title rounded-md px-2.5 py-1.5 transition-colors font-medium">
                   <Command className="w-3.5 h-3.5" /> 快捷指令
                 </button>
               </div>
               
               {/* 模式切换 (自动/手动) */}
               <button 
                  onClick={() => setAutoMode(!autoMode)}
                  className="flex items-center gap-1.5 text-[12px] text-neutral-title hover:text-[#fa541c] transition-colors font-medium"
               >
                 {autoMode ? <ToggleRight className="w-5 h-5 text-[#fa541c]" /> : <ToggleLeft className="w-5 h-5 text-neutral-caption" />}
                 {autoMode ? "自动编排模式" : "手动编辑模式"}
               </button>
            </div>
            
            <div className="relative group">
              <textarea 
                className="w-full bg-[#f8fafc] border border-neutral-border rounded-xl px-4 py-3.5 pr-14 text-[14px] text-neutral-title resize-none focus:outline-none focus:border-[#fa541c] focus:ring-1 focus:ring-[#fa541c]/20 transition-all h-[110px] shadow-inner placeholder:text-neutral-caption"
                placeholder="在此使用自然语言描述你的具体需求（可使用 Shift+Enter 换行）..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              {/* Bottom Right Actions in Textarea */}
              <div className="absolute right-3 bottom-3 flex flex-col items-center gap-2">
                <button className="p-1.5 text-neutral-caption hover:text-[#fa541c] hover:bg-[#fff2e8] rounded transition-all tooltip" title="添加附件">
                  <Paperclip className="w-4 h-4" />
                </button>
                <button className={cn(
                  "p-2 rounded-lg transition-all shadow-sm",
                  input.trim().length > 0 ? "bg-[#fa541c] hover:bg-[#ff7a45] text-white" : "bg-neutral-bg text-neutral-caption border border-neutral-border cursor-not-allowed"
                )}>
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Right Side: 开发编辑区 & 终端面板 */}
        <div className="flex-1 flex flex-col min-w-0 bg-[#fefefe] relative">
          
          {/* 编辑器操作栏 */}
          <div className="h-11 bg-white border-b border-neutral-border flex items-center justify-between pr-4 pl-2 shrink-0 z-10">
            {/* Editor Tabs (新建标签页) */}
            <div className="flex items-center h-full">
               <div className="px-5 border-r border-neutral-border h-full flex items-center gap-2 bg-[#fefefe] text-[13px] border-t-2 border-t-[#fa541c] text-[#fa541c] font-bold font-mono cursor-pointer transition-colors shadow-sm">
                  <FileCode className="w-4 h-4" /> main.py
               </div>
               <div className="px-5 border-r border-neutral-border h-full flex items-center gap-2 bg-neutral-bg text-neutral-body hover:bg-[#e2e8f0] text-[13px] font-mono cursor-pointer transition-colors">
                  <Box className="w-4 h-4 text-emerald-600" /> requirements.txt
               </div>
               {/* 新建标签页 */}
               <button className="ml-2 w-7 h-7 flex items-center justify-center hover:bg-neutral-bg text-neutral-caption rounded transition-colors group">
                 <Plus className="w-4 h-4 group-hover:text-neutral-title"/>
               </button>
            </div>
            
            {/* 布局配置 & 主题切换 */}
            <div className="flex gap-1.5">
               <button className="p-1.5 hover:bg-neutral-bg rounded text-neutral-caption hover:text-neutral-title transition-colors" title="主题切换">
                 <SunMoon className="w-4 h-4" />
               </button>
               <button className="p-1.5 hover:bg-neutral-bg rounded text-neutral-caption hover:text-neutral-title transition-colors" title="布局调整">
                 <LayoutTemplate className="w-4 h-4" />
               </button>
            </div>
          </div>

          {/* 中央展示区域: 编辑器 or 技能生成状态 */}
          <div className="flex-1 overflow-auto bg-[#fefefe] p-0 font-mono text-[13px] leading-relaxed flex relative">
             {generating && (
                <div className="absolute inset-0 z-10 bg-white/70 backdrop-blur-md flex flex-col items-center justify-center">
                   <div className="bg-white border border-neutral-border p-8 rounded-[20px] shadow-xl flex flex-col items-center max-w-sm w-full">
                      <div className="relative w-16 h-16 mb-6">
                         <div className="absolute inset-0 border-[3px] border-[#fff2e8] rounded-full"></div>
                         <div className="absolute inset-0 border-[3px] border-[#fa541c] rounded-full border-t-transparent animate-spin"></div>
                         <Cpu className="absolute inset-0 m-auto w-6 h-6 text-[#fa541c]" />
                      </div>
                      <h3 className="text-neutral-title text-lg font-bold mb-2">技能正在生成中...</h3>
                      <p className="text-neutral-body text-[13px] text-center mb-6">Agent 正在为您构建基础代码结构并配置运行环境</p>
                      
                      {/* 快捷键提示 */}
                      <div className="bg-neutral-bg border border-neutral-border rounded-lg p-3 w-full text-center">
                         <span className="text-[12px] text-neutral-caption mb-2 block font-medium">你可以使用快捷键随时干预</span>
                         <div className="flex items-center justify-center gap-2 text-[12px] font-bold">
                            <kbd className="bg-white border border-neutral-border text-neutral-title px-2 py-1 rounded shadow-sm">Esc</kbd>
                            <span className="text-neutral-caption font-normal">取消生成</span>
                            <span className="mx-2 text-neutral-border">|</span>
                            <kbd className="bg-white border border-neutral-border text-neutral-title px-2 py-1 rounded shadow-sm">Ctrl</kbd>
                            <span className="text-neutral-caption font-normal">+</span>
                            <kbd className="bg-white border border-neutral-border text-neutral-title px-2 py-1 rounded shadow-sm">S</kbd>
                            <span className="text-neutral-caption font-normal">手动保存</span>
                         </div>
                      </div>
                   </div>
                </div>
             )}

             {/* Code Lines Mock (Light syntax highlight) */}
             <div className="w-12 shrink-0 text-slate-400 bg-[#f8fafc] py-4 flex flex-col items-end pr-3 border-r border-neutral-border select-none text-[12px] font-medium">
                {Array.from({length: 25}).map((_, i) => <div key={i} className={i === 5 ? "text-slate-800 font-bold" : ""}>{i+1}</div>)}
             </div>
             
             {/* Text Content Mock */}
             <div className="pl-6 py-4 space-y-1.5 text-neutral-title w-full font-medium">
                <div className="flex"><span className="text-purple-600 w-16 font-bold">import</span> <span className="text-blue-600">pandas</span> <span className="text-purple-600 ml-2 font-bold">as</span> <span className="text-amber-600">pd</span></div>
                <div className="flex"><span className="text-purple-600 w-16 font-bold">import</span> <span className="text-blue-600">os</span></div>
                <div className="h-4"></div>
                <div className="flex"><span className="text-purple-600 w-16 font-bold">def</span> <span className="text-blue-600 font-bold">process_excel_data</span><span className="text-slate-500">(file_path:</span> <span className="text-amber-600">str</span><span className="text-slate-500">{") ->"}</span> <span className="text-amber-600">bool</span><span className="text-slate-500">:</span></div>
                <div className="flex text-slate-400 pl-8">"""</div>
                <div className="flex text-slate-500 bg-[#fff2e8] px-2 py-0.5 ml-8 border-l-2 border-[#fa541c] shadow-sm italic">Agent 生成的代码：读取 Excel，处理缺失值为 0，并导出。</div>
                <div className="flex text-slate-400 pl-8">"""</div>
                <div className="flex pl-8"><span className="text-purple-600 font-bold">try</span><span className="text-slate-500">:</span></div>
                <div className="flex pl-12"><span className="text-red-600">df</span> <span className="text-cyan-600 font-bold">=</span> <span className="text-amber-600">pd</span><span className="text-slate-500">.</span><span className="text-blue-600">read_excel</span><span className="text-slate-500">(file_path)</span></div>
                <div className="flex pl-12"><span className="text-slate-400"># 填充缺失值</span></div>
                <div className="flex pl-12"><span className="text-red-600">df</span><span className="text-slate-500">.</span><span className="text-blue-600">fillna</span><span className="text-slate-500">(</span><span className="text-orange-500">0</span><span className="text-slate-500">,</span> <span className="text-red-600">inplace</span><span className="text-cyan-600 font-bold">=</span><span className="text-orange-500">True</span><span className="text-slate-500">)</span></div>
             </div>
          </div>

          {/* 终端面板 (Light version) */}
          <div className="h-[220px] bg-white border-t border-neutral-border shrink-0 flex flex-col shadow-[0_-5px_15px_-5px_rgba(0,0,0,0.03)] relative z-10">
            {/* Terminal Header */}
            <div className="h-10 border-b border-neutral-border flex items-center px-4 justify-between bg-[#f8fafc]">
               <div className="flex gap-6 text-[12px] font-mono h-full">
                  <button className="text-neutral-title border-b-2 border-[#fa541c] h-full uppercase font-bold tracking-wider flex items-center gap-2">
                     <TerminalIcon className="w-4 h-4" /> 终端
                  </button>
                  <button className="text-neutral-caption hover:text-neutral-title transition-colors h-full uppercase tracking-wider flex items-center gap-2">
                     <Settings className="w-4 h-4" /> 运行环境
                  </button>
               </div>
               
               {/* 存储容量 & 操作 */}
               <div className="flex items-center gap-6">
                  {/* Storage Status */}
                  <div className="hidden md:flex items-center gap-3 text-[12px] font-mono group" title="存储空间已用 3.2GB / 总容量 10GB">
                    <span className="text-neutral-caption flex items-center gap-1.5 font-bold"><Server className="w-3.5 h-3.5"/> 3.2G / 10G</span>
                    <div className="w-32 h-2.5 bg-neutral-bg rounded-full overflow-hidden border border-neutral-border/50 shadow-inner">
                       <div className="w-[32%] h-full bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all group-hover:bg-emerald-400"></div>
                    </div>
                  </div>
                  
                  {/* Divider */}
                  <div className="w-[1px] h-4 bg-neutral-border"></div>

                  {/* Terminal Actions */}
                  <div className="flex items-center gap-1.5">
                     <button className="p-1.5 hover:bg-[#e2e8f0] rounded text-neutral-caption hover:text-[#fa541c] transition-colors" title="清理终端">
                       <Trash2 className="w-4 h-4" />
                     </button>
                     <button className="p-1.5 hover:bg-[#e2e8f0] rounded text-neutral-caption hover:text-emerald-500 transition-colors" title="新建终端">
                       <Plus className="w-4 h-4" />
                     </button>
                  </div>
               </div>
            </div>
            
            {/* Terminal Content */}
            <div className="flex-1 p-4 font-mono text-[13px] leading-relaxed text-slate-700 overflow-y-auto space-y-1.5 custom-scrollbar bg-[#fdfdfd]">
               <div className="flex items-start gap-3">
                  <span className="text-emerald-600 mt-0.5 font-bold">➜</span>
                  <div className="text-emerald-600 font-bold">system <span className="text-slate-400 font-normal">~</span> <span className="text-slate-800">skill-builder init --template data-process</span></div>
               </div>
               <div className="pl-6 text-slate-500">[INFO] Allocating container resources...</div>
               <div className="pl-6 text-slate-500">[INFO] Downloading base dependencies. This may take a few seconds.</div>
               <div className="pl-6 flex items-center gap-2">
                  <span className="text-emerald-600 font-bold">✔</span> 
                  <span className="text-slate-600">Environment initialized. Container ID: <span className="text-blue-600 font-bold">a8f93c2</span></span>
               </div>
               <div className="pl-6 text-indigo-500 pt-2 font-medium">Building project structure...</div>
               <div className="flex items-start gap-3 pt-2">
                  <span className="text-emerald-600 mt-0.5 font-bold">➜</span>
                  <div className="text-emerald-600 font-bold">system <span className="text-slate-400 font-normal">~</span> <span className="text-slate-800"></span></div>
                  <div className="w-2.5 h-[18px] mt-[3px] bg-slate-600 animate-pulse"></div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
