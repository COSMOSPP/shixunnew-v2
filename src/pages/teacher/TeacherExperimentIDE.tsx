import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Edit3, RotateCcw, Send, Play, Square, FastForward,
  Folder, FileText, Database, List, ChevronRight, ChevronDown,
  Terminal, Hash, FileCode, MonitorPlay
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function TeacherExperimentIDE() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('launcher');
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({
    'python': true,
    'numbers': true
  });

  const toggleFolder = (folder: string) => {
    setExpandedFolders(prev => ({ ...prev, [folder]: !prev[folder] }));
  };

  return (
    <div className="h-screen flex flex-col bg-white overflow-hidden font-sans">
      {/* Top Header */}
      <header className="h-14 border-b border-neutral-200 flex items-center justify-between px-4 shrink-0 bg-white z-10">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)}
            className="w-8 h-8 rounded flex items-center justify-center hover:bg-neutral-100 text-neutral-500 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="h-4 w-px bg-neutral-300"></div>
          <div className="flex items-center gap-2 group cursor-pointer">
            <h1 className="text-[15px] font-bold text-neutral-800">职业简介.IPYNB</h1>
            <Edit3 className="w-4 h-4 text-neutral-400 group-hover:text-[#fa541c] transition-colors" />
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Button variant="outline" className="h-8 border-neutral-200 text-neutral-600 hover:text-[#fa541c] hover:border-orange-200 hover:bg-orange-50 flex items-center gap-1.5 transition-colors">
            <RotateCcw className="w-3.5 h-3.5" /> 重启
          </Button>
          <Button className="h-8 bg-[#fa541c] hover:bg-[#e84a15] text-white flex items-center gap-1.5 shadow-sm shadow-orange-500/20 font-medium">
            <Send className="w-3.5 h-3.5" /> 提交课件
          </Button>
        </div>
      </header>

      {/* Main Workspace */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* Left Sidebar - Primary Icons */}
        <div className="w-14 border-r border-neutral-200 bg-neutral-50 flex flex-col items-center py-4 gap-6 shrink-0">
          <button className="flex flex-col items-center gap-1 text-[#fa541c] relative">
            <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center">
              <Folder className="w-5 h-5 fill-current" />
            </div>
            <span className="text-[10px] font-medium">课程</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-neutral-500 hover:text-[#fa541c] transition-colors">
            <FileText className="w-5 h-5" />
            <span className="text-[10px]">文件</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-neutral-500 hover:text-[#fa541c] transition-colors">
            <Database className="w-5 h-5" />
            <span className="text-[10px]">数据集</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-neutral-500 hover:text-[#fa541c] transition-colors">
            <List className="w-5 h-5" />
            <span className="text-[10px]">目录</span>
          </button>
        </div>

        {/* Left Sidebar - Secondary File Tree */}
        <div className="w-64 border-r border-neutral-200 bg-white flex flex-col shrink-0">
          <div className="h-10 border-b border-neutral-100 flex items-center px-4">
            <span className="text-[12px] font-bold text-neutral-500 uppercase tracking-wider">职业简介.IPYNB</span>
          </div>
          <div className="flex-1 overflow-y-auto p-2">
            <div className="flex items-center gap-2 p-1.5 hover:bg-neutral-100 rounded cursor-pointer text-neutral-600">
              <ChevronLeftIcon className="w-4 h-4" />
              <Folder className="w-4 h-4 text-blue-400 fill-current" />
              <span className="text-[13px]">M↓</span>
            </div>
            
            <div className="mt-2">
              <div 
                className="flex items-center gap-1 p-1.5 hover:bg-neutral-100 rounded cursor-pointer"
                onClick={() => toggleFolder('python')}
              >
                {expandedFolders['python'] ? <ChevronDown className="w-3.5 h-3.5 text-neutral-400" /> : <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />}
                <span className="text-[13px] font-bold text-neutral-800">Python 基础数据类型</span>
              </div>
              
              {expandedFolders['python'] && (
                <div className="pl-6 space-y-0.5 mt-1">
                  <div className="p-1.5 hover:bg-neutral-100 rounded cursor-pointer text-[13px] text-neutral-600">第一行 Python 代码</div>
                  <div className="p-1.5 hover:bg-neutral-100 rounded cursor-pointer text-[13px] text-neutral-600">常用数据类型</div>
                  
                  <div 
                    className="flex items-center gap-1 p-1.5 hover:bg-neutral-100 rounded cursor-pointer mt-1"
                    onClick={() => toggleFolder('numbers')}
                  >
                    {expandedFolders['numbers'] ? <ChevronDown className="w-3.5 h-3.5 text-neutral-400" /> : <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />}
                    <span className="text-[13px] font-bold text-neutral-800">数字</span>
                  </div>
                  
                  {expandedFolders['numbers'] && (
                    <div className="pl-5 space-y-0.5">
                      <div className="p-1.5 hover:bg-neutral-100 rounded cursor-pointer text-[13px] text-neutral-600">整型</div>
                      <div className="p-1.5 hover:bg-neutral-100 rounded cursor-pointer text-[13px] text-neutral-600">浮点数</div>
                      <div className="p-1.5 hover:bg-neutral-100 rounded cursor-pointer text-[13px] text-neutral-600">交互计算</div>
                      <div className="p-1.5 hover:bg-neutral-100 rounded cursor-pointer text-[13px] text-neutral-600">简单的数学函数</div>
                      <div className="p-1.5 hover:bg-neutral-100 rounded cursor-pointer text-[13px] text-neutral-600">其他表示</div>
                    </div>
                  )}
                  
                  <div className="p-1.5 hover:bg-neutral-100 rounded cursor-pointer text-[13px] text-neutral-600 mt-1">布尔型</div>
                  <div className="p-1.5 hover:bg-neutral-100 rounded cursor-pointer text-[13px] text-neutral-600">变量赋值</div>
                  <div className="p-1.5 hover:bg-neutral-100 rounded cursor-pointer text-[13px] text-neutral-600">字符串</div>
                  <div className="p-1.5 hover:bg-neutral-100 rounded cursor-pointer text-[13px] text-neutral-600">类型转换</div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Editor Area */}
        <div className="flex-1 flex flex-col min-w-0 bg-[#f8f9fa]">
          {/* Tabs */}
          <div className="flex items-center border-b border-neutral-200 bg-neutral-100 px-2 pt-2 gap-1 shrink-0 overflow-x-auto">
            <button 
              onClick={() => setActiveTab('notebook')}
              className={cn(
                "flex items-center gap-2 px-4 py-2 text-[13px] rounded-t-lg border border-b-0 transition-colors shrink-0",
                activeTab === 'notebook' 
                  ? "bg-white text-neutral-800 border-neutral-200 relative z-10" 
                  : "bg-neutral-100/50 text-neutral-500 border-transparent hover:bg-neutral-200"
              )}
            >
              <div className="w-2 h-2 rounded-full bg-[#fa541c]"></div> 职业简介.ipynb <X className="w-3 h-3 ml-2 opacity-50 hover:opacity-100" />
            </button>
            <button 
              onClick={() => setActiveTab('launcher')}
              className={cn(
                "flex items-center gap-2 px-4 py-2 text-[13px] rounded-t-lg border border-b-0 transition-colors shrink-0",
                activeTab === 'launcher' 
                  ? "bg-white text-neutral-800 border-neutral-200 relative z-10" 
                  : "bg-neutral-100/50 text-neutral-500 border-transparent hover:bg-neutral-200"
              )}
            >
              <div className="w-2 h-2 rounded-full bg-neutral-400"></div> Launcher <X className="w-3 h-3 ml-2 opacity-50 hover:opacity-100" />
            </button>
          </div>

          {/* Launcher Content */}
          <div className="flex-1 bg-white overflow-y-auto p-8 relative">
            <div className="absolute right-6 top-6 w-8 h-8 rounded bg-neutral-800 text-white flex items-center justify-center font-bold text-[10px]">API</div>
            <div className="absolute right-6 top-16 w-8 h-8 rounded border border-neutral-200 text-neutral-500 flex items-center justify-center">
              <MonitorPlay className="w-4 h-4" />
            </div>

            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold text-neutral-800 mb-8">职业简介</h2>

              {/* Notebook Section */}
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-4 border-b border-neutral-100 pb-2">
                  <div className="w-6 h-6 rounded bg-[#fa541c] text-white flex items-center justify-center font-bold text-[10px]">&lt;&gt;</div>
                  <h3 className="text-[15px] font-bold text-neutral-800">Notebook</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  <div className="w-32 h-32 border border-neutral-200 rounded-lg hover:border-blue-400 hover:shadow-md transition-all cursor-pointer flex flex-col items-center justify-center bg-white gap-3">
                    <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center text-xl font-bold">P</div>
                    <span className="text-[13px] text-neutral-600 font-medium">Python 3</span>
                  </div>
                </div>
              </div>

              {/* Console Section */}
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-4 border-b border-neutral-100 pb-2">
                  <div className="w-6 h-6 rounded bg-blue-500 text-white flex items-center justify-center font-bold text-[10px]">&gt;_</div>
                  <h3 className="text-[15px] font-bold text-neutral-800">Console</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  <div className="w-32 h-32 border border-neutral-200 rounded-lg hover:border-blue-400 hover:shadow-md transition-all cursor-pointer flex flex-col items-center justify-center bg-white gap-3">
                    <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center text-xl font-bold">P</div>
                    <span className="text-[13px] text-neutral-600 font-medium">Python 3</span>
                  </div>
                </div>
              </div>

              {/* Other Section */}
              <div>
                <div className="flex items-center gap-2 mb-4 border-b border-neutral-100 pb-2">
                  <h3 className="text-[15px] font-bold text-neutral-800">Other</h3>
                </div>
                <div className="flex flex-wrap gap-4">
                  <div className="w-32 h-32 border border-neutral-200 rounded-lg hover:border-neutral-400 hover:shadow-md transition-all cursor-pointer flex flex-col items-center justify-center bg-white gap-3">
                    <div className="w-12 h-12 rounded bg-neutral-800 text-white flex items-center justify-center font-bold text-[14px]">$_</div>
                    <span className="text-[13px] text-neutral-600 font-medium">Terminal</span>
                  </div>
                  <div className="w-32 h-32 border border-neutral-200 rounded-lg hover:border-neutral-400 hover:shadow-md transition-all cursor-pointer flex flex-col items-center justify-center bg-white gap-3">
                    <div className="w-12 h-12 rounded bg-neutral-400 text-white flex items-center justify-center font-bold text-[16px]">T</div>
                    <span className="text-[13px] text-neutral-600 font-medium">Text File</span>
                  </div>
                  <div className="w-32 h-32 border border-neutral-200 rounded-lg hover:border-purple-400 hover:shadow-md transition-all cursor-pointer flex flex-col items-center justify-center bg-white gap-3">
                    <div className="w-12 h-12 rounded bg-purple-500 text-white flex items-center justify-center font-bold text-[16px]">M<span className="text-[10px] ml-0.5">↓</span></div>
                    <span className="text-[13px] text-neutral-600 font-medium">Markdown ...</span>
                  </div>
                  <div className="w-32 h-32 border border-neutral-200 rounded-lg hover:border-blue-400 hover:shadow-md transition-all cursor-pointer flex flex-col items-center justify-center bg-white gap-3">
                    <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-500 flex items-center justify-center font-bold text-[16px]">P</div>
                    <span className="text-[13px] text-neutral-600 font-medium">Py File</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Internal components to avoid missing imports
function ChevronLeftIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m15 18-6-6 6-6"/>
    </svg>
  );
}

function X(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
    </svg>
  );
}
