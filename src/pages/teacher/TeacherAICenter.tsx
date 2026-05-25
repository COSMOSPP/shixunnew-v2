import React, { useState } from 'react';
import { 
  Users, Bot, Search, Plus, Play, Pause, Trash2, Edit, CheckCircle, 
  AlertCircle, X, Settings, Database, Share2, UploadCloud, 
  Code
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

type TabType = 'employees' | 'assistants';

// --- Types ---
interface DigitalEmployee {
  id: number;
  name: string;
  avatar: string;
  role: string;
  status: '草稿' | '已发布' | '已下架';
  calls: number;
  successRate: string;
  avgTime: string;
  desc: string;
}

interface SmartAssistant {
  id: number;
  name: string;
  type: '课程助手' | '实验助手' | '答疑助手';
  welcomeMsg: string;
  avatar: string;
  authorized: number;
}

// --- Mock Data ---
const initialEmployees: DigitalEmployee[] = [
  { id: 1, name: 'DataAI-分析师', avatar: 'https://picsum.photos/seed/d1/100/100', role: '数据分析专家', status: '已发布', calls: 12500, successRate: '98.5%', avgTime: '1.2s', desc: '具备高级数据清洗、Python代码生成与Pandas图表绘制能力的数字员工。' },
  { id: 2, name: 'CodeReviewer', avatar: 'https://picsum.photos/seed/d2/100/100', role: '代码审查助手', status: '已下架', calls: 3200, successRate: '92.0%', avgTime: '2.5s', desc: '用于Java/C++的代码质量审查和漏洞扫描。' }
];

const initialAssistants: SmartAssistant[] = [
  { id: 1, name: 'Python实战助教', type: '课程助手', welcomeMsg: '同学你好，我是Python实战助教，你可以问我关于本课程的任何问题！', avatar: 'https://picsum.photos/seed/a1/100/100', authorized: 120 },
  { id: 2, name: '深度学习答疑', type: '答疑助手', welcomeMsg: '遇到报错了？把日志发给我看看。', avatar: 'https://picsum.photos/seed/a2/100/100', authorized: 45 }
];

export default function TeacherAICenter({ embedded = false }: { embedded?: boolean }) {
  const [activeTab, setActiveTab] = useState<TabType>('employees');
  const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // --- Sub-states ---
  const [employees, setEmployees] = useState(initialEmployees);
  const [assistants, setAssistants] = useState(initialAssistants);
  const [searchQuery, setSearchQuery] = useState('');

  // Digital Employee Flow
  const [isEmpModalOpen, setIsEmpModalOpen] = useState(false);
  const [empStep, setEmpStep] = useState(1);
  const [empForm, setEmpForm] = useState({ name: '', role: '', desc: '' });

  // Assistant Flow
  const [isAssModalOpen, setIsAssModalOpen] = useState(false);
  const [assForm, setAssForm] = useState({ name: '', type: '课程助手', welcome: '', kbs: '' });

  // Apply Public Flow
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [applyForm, setApplyForm] = useState({ name: '', desc: '', scenario: '', example: '', cost: '' });

  const renderEmployees = () => {
    const filteredEmployees = employees.filter(e => e.name.includes(searchQuery) || e.desc.includes(searchQuery));
    
    return (
      <div className="animate-fade-in space-y-8">
        {filteredEmployees.length === 0 ? (
           <div className="flex flex-col items-center justify-center py-24 bg-neutral-50/50 rounded-2xl border border-neutral-100 border-dashed">
             <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-4">
               <Users className="w-8 h-8 text-neutral-300" />
             </div>
             <h3 className="text-[16px] font-bold text-neutral-800 mb-2">暂无匹配的数字员工</h3>
             <p className="text-[13px] text-neutral-500 max-w-sm text-center mb-6">您可以尝试更换搜索关键词，或者点击右上角新建一个数字员工。</p>
             <Button onClick={() => { setEmpStep(1); setEmpForm({ name: '', role: '', desc: '' }); setIsEmpModalOpen(true); }} className="bg-[#fa541c] hover:bg-[#e84a15] text-white rounded-full px-8 shadow-sm">
               <Plus className="w-4 h-4 mr-1.5" /> 创建数字员工
             </Button>
           </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEmployees.map(emp => (
              <div key={emp.id} className="bg-white rounded-[20px] p-6 border border-neutral-200 shadow-sm hover:shadow-lg transition-all hover:-translate-y-1 group flex flex-col relative overflow-hidden">

                <div className="flex justify-between items-start mb-5">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-[14px] overflow-hidden border border-neutral-200 shadow-sm shrink-0">
                      <img src={emp.avatar} alt="avatar" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    </div>
                    <div>
                      <h3 className="font-bold text-neutral-900 text-[16px] group-hover:text-[#fa541c] transition-colors">{emp.name}</h3>
                      <div className="text-[13px] text-neutral-500 mt-1">{emp.role}</div>
                    </div>
                  </div>
                  <span className={cn(
                    "px-2.5 py-1 text-[11px] font-bold rounded-lg shadow-sm border whitespace-nowrap",
                    emp.status === '已发布' ? "bg-emerald-50 text-emerald-600 border-emerald-200" :
                    emp.status === '草稿' ? "bg-orange-50 text-orange-500 border-orange-200" : "bg-neutral-100 text-neutral-500 border-neutral-200"
                  )}>
                    {emp.status}
                  </span>
                </div>
                
                <p className="text-[13px] text-neutral-500 mb-6 line-clamp-2 h-10 leading-relaxed">{emp.desc}</p>
                
                <div className="grid grid-cols-3 gap-3 mb-6 bg-neutral-50 p-4 rounded-2xl border border-neutral-100">
                  <div className="flex flex-col items-center text-center">
                    <div className="text-[11px] text-neutral-500 mb-1">总调用次数</div>
                    <div className="text-[15px] font-bold text-neutral-800">{emp.calls.toLocaleString()}</div>
                  </div>
                  <div className="flex flex-col items-center text-center border-x border-neutral-200/60">
                    <div className="text-[11px] text-neutral-500 mb-1">平均成功率</div>
                    <div className="text-[15px] font-bold text-emerald-600">{emp.successRate}</div>
                  </div>
                  <div className="flex flex-col items-center text-center">
                    <div className="text-[11px] text-neutral-500 mb-1">平均耗时</div>
                    <div className="text-[15px] font-bold text-neutral-800">{emp.avgTime}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-4 border-t border-neutral-100 mt-auto">
                  <Button 
                    onClick={() => { setApplyForm({ name: emp.name, desc: '', scenario: '', example: '', cost: '' }); setIsApplyModalOpen(true); }} 
                    variant="outline" 
                    className="flex-1 rounded-full h-9 text-[12px] border-[#fa541c] text-[#fa541c] font-bold hover:bg-orange-50 px-0"
                  >
                    申请公开
                  </Button>
                  <Button 
                    onClick={() => { setEmpStep(1); setEmpForm({ name: emp.name, role: emp.role, desc: emp.desc }); setIsEmpModalOpen(true); }}
                    variant="outline" className="flex-1 rounded-full h-9 text-[12px] border-neutral-200 text-neutral-600 font-bold hover:bg-neutral-50 hover:text-neutral-900 px-0"
                  >
                    <Settings className="w-3.5 h-3.5 mr-1" /> 参数配置
                  </Button>
                  {emp.status === '已发布' ? (
                    <Button onClick={() => {
                      setEmployees(employees.map(e => e.id === emp.id ? {...e, status: '已下架'} : e));
                      showToast('下架成功');
                    }} variant="outline" className="flex-1 rounded-full h-9 text-[12px] border-neutral-200 text-red-500 hover:bg-red-50 hover:text-red-600 font-bold px-0">
                      <Pause className="w-3.5 h-3.5 mr-1" /> 下架
                    </Button>
                  ) : (
                    <Button onClick={() => {
                      setEmployees(employees.map(e => e.id === emp.id ? {...e, status: '已发布'} : e));
                      showToast('发布成功');
                    }} className="flex-1 rounded-full h-9 text-[12px] bg-[#fa541c] hover:bg-[#e84a15] text-white shadow-sm font-bold px-0">
                      <Play className="w-3.5 h-3.5 mr-1" /> 发布上线
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  const renderAssistants = () => {
    const filteredAssistants = assistants.filter(a => a.name.includes(searchQuery) || a.welcomeMsg.includes(searchQuery));
    
    return (
      <div className="animate-fade-in space-y-6">

        {filteredAssistants.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 bg-neutral-50/50 rounded-2xl border border-neutral-100 border-dashed">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-4">
              <Bot className="w-8 h-8 text-neutral-300" />
            </div>
            <h3 className="text-[16px] font-bold text-neutral-800 mb-2">暂无匹配的智能助手</h3>
            <p className="text-[13px] text-neutral-500 max-w-sm text-center mb-6">您可以尝试更换搜索关键词，或者点击右上角新建一个助手。</p>
            <Button onClick={() => { setAssForm({ name: '', type: '课程助手', welcome: '', kbs: '' }); setIsAssModalOpen(true); }} className="bg-[#fa541c] hover:bg-[#e84a15] text-white rounded-full px-8 shadow-sm">
              <Plus className="w-4 h-4 mr-1.5" /> 新建助手
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredAssistants.map(ass => (
              <div key={ass.id} className="bg-white rounded-[20px] p-6 border border-neutral-200 shadow-sm relative group overflow-hidden hover:shadow-lg transition-all hover:-translate-y-1.5 flex flex-col">
                <div className="absolute top-4 right-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                   <button onClick={() => { setApplyForm({ name: ass.name, desc: '', scenario: '', example: '', cost: '' }); setIsApplyModalOpen(true); }} className="px-3 h-8 flex items-center justify-center bg-white border border-[#fa541c] rounded-full text-[#fa541c] hover:bg-orange-50 shadow-sm text-[12px] font-bold">申请公开</button>
                   <button 
                     onClick={() => { setAssForm({ name: ass.name, type: ass.type, welcome: ass.welcomeMsg, kbs: '' }); setIsAssModalOpen(true); }}
                     className="w-8 h-8 flex items-center justify-center bg-white border border-neutral-200 rounded-full text-neutral-500 hover:text-[#fa541c] shadow-sm hover:bg-orange-50"
                   >
                     <Edit className="w-3.5 h-3.5" />
                   </button>
                   <button 
                     onClick={() => {
                       if(confirm('确认删除该助手吗？')) {
                         setAssistants(assistants.filter(a => a.id !== ass.id));
                         showToast('删除成功');
                       }
                     }}
                     className="w-8 h-8 flex items-center justify-center bg-white border border-neutral-200 rounded-full text-neutral-500 hover:text-red-500 shadow-sm hover:bg-red-50"
                   >
                     <Trash2 className="w-3.5 h-3.5" />
                   </button>
                </div>
                
                <div className="w-20 h-20 mx-auto rounded-full overflow-hidden border-4 border-neutral-50 shadow-sm mb-4 mt-2">
                  <img src={ass.avatar} alt="avatar" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                </div>
                <div className="text-center mb-5">
                  <h3 className="font-bold text-neutral-900 text-[16px] group-hover:text-[#fa541c] transition-colors">{ass.name}</h3>
                  <span className="inline-block px-3 py-1 mt-2 bg-indigo-50 text-indigo-600 text-[11px] rounded-lg font-bold border border-indigo-100/50">
                    {ass.type}
                  </span>
                </div>
                
                <div className="bg-neutral-50 rounded-2xl p-4 mb-5 text-[12px] text-neutral-600 border border-neutral-100 relative flex-1">
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-neutral-50 border-t border-l border-neutral-100 rotate-45"></div>
                  <span className="line-clamp-3 leading-relaxed relative z-10">“{ass.welcomeMsg}”</span>
                </div>
                
                <div className="flex items-center justify-between text-[12px] font-bold pt-4 border-t border-neutral-100 text-neutral-500 mt-auto">
                  <div className="flex items-center gap-1.5"><Database className="w-4 h-4 text-neutral-400"/> 知识库: 2</div>
                  <div className="flex items-center gap-1.5"><Users className="w-4 h-4 text-neutral-400"/> 已授权: {ass.authorized}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col relative h-full", embedded ? "p-4" : "p-8 bg-neutral-50/30 min-h-screen")}>
      
      {/* Toast */}
      {toast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[200] flex items-center gap-2 px-5 py-2.5 bg-white border border-neutral-200 rounded-xl shadow-xl animate-in slide-in-from-top-4">
          {toast.type === 'success' ? (
            <CheckCircle className="w-5 h-5 text-emerald-500" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-500" />
          )}
          <span className="text-[14px] font-bold text-neutral-800">{toast.message}</span>
        </div>
      )}

      {/* Top Actions & Filters */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 mb-8">
        
        {/* Pill Tabs */}
        <div className="flex items-center gap-5">
          <div className="flex bg-neutral-100/80 rounded-full p-1 border border-neutral-200/60 shadow-sm w-fit">
            <button 
              className={cn("px-6 py-2 text-[13px] rounded-full transition-all duration-200", activeTab === 'employees' ? "bg-white text-[#fa541c] font-bold shadow-sm" : "text-neutral-500 hover:text-neutral-800 font-medium")}
              onClick={() => setActiveTab('employees')}
            >
              <div className="flex items-center gap-2"><Users className="w-4 h-4" /> 数字员工管理</div>
            </button>
            <button 
              className={cn("px-6 py-2 text-[13px] rounded-full transition-all duration-200", activeTab === 'assistants' ? "bg-white text-[#fa541c] font-bold shadow-sm" : "text-neutral-500 hover:text-neutral-800 font-medium")}
              onClick={() => setActiveTab('assistants')}
            >
              <div className="flex items-center gap-2"><Bot className="w-4 h-4" /> 智能助手管理</div>
            </button>
          </div>
        </div>

        {/* Search & Dynamic Create Button */}
        <div className="flex items-center gap-4 w-full xl:w-auto">
          <div className="relative flex-1 xl:flex-none">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 transition-colors" />
            <input 
              placeholder="搜索名称或描述..." 
              className="pl-10 pr-4 py-2 text-[13px] w-full xl:w-64 rounded-full border border-neutral-200 bg-white focus:outline-none focus:border-[#fa541c] focus:ring-1 focus:ring-[#fa541c] shadow-sm transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button 
            onClick={() => {
              if (activeTab === 'employees') {
                setEmpStep(1); setEmpForm({ name: '', role: '', desc: '' }); setIsEmpModalOpen(true);
              } else {
                setAssForm({ name: '', type: '课程助手', welcome: '', kbs: '' }); setIsAssModalOpen(true);
              }
            }} 
            className="bg-[#fa541c] hover:bg-[#e84a15] text-white rounded-full px-6 h-9 text-[13px] shadow-sm font-bold shrink-0"
          >
            <Plus className="w-4 h-4 mr-1.5" /> 
            {activeTab === 'employees' ? '创建数字员工' : '新建助手'}
          </Button>
        </div>
      </div>

      <div className="pb-20">
        {activeTab === 'employees' && renderEmployees()}
        {activeTab === 'assistants' && renderAssistants()}
      </div>

      {/* 1. Employee Creation Drawer */}
      {isEmpModalOpen && (
        <div className="fixed inset-0 z-[150] flex justify-end bg-black/45 backdrop-blur-[2px] animate-fade-in" onClick={() => setIsEmpModalOpen(false)}>
          <div className="bg-white w-full max-w-[640px] h-screen shadow-2xl border-l border-neutral-100 flex flex-col animate-in slide-in-from-right duration-300" onClick={e => e.stopPropagation()}>
             <div className="px-8 py-5 border-b border-neutral-100 flex justify-between items-center shrink-0 bg-neutral-50/50">
                <h2 className="text-[18px] font-bold text-neutral-900">创建数字员工</h2>
                <button onClick={() => setIsEmpModalOpen(false)} className="text-neutral-400 hover:text-[#fa541c] hover:bg-orange-50 p-2 rounded-full transition-colors"><X className="w-5 h-5" /></button>
             </div>
             
             <div className="flex-1 p-8 overflow-y-auto custom-scrollbar">
               {/* Stepper */}
               <div className="flex items-center justify-between mb-12 relative px-4">
                 <div className="absolute top-1/2 left-8 right-8 h-[2px] bg-neutral-100 -translate-y-1/2 -z-10"></div>
                 {[1, 2, 3, 4].map(step => (
                   <div key={step} className={cn(
                     "w-10 h-10 rounded-full flex items-center justify-center text-[14px] font-bold shadow-sm transition-colors relative z-10",
                     empStep === step ? "bg-[#fa541c] text-white ring-4 ring-orange-50" : 
                     empStep > step ? "bg-emerald-500 text-white" : "bg-white border-2 border-neutral-200 text-neutral-400"
                   )}>
                     {empStep > step ? <CheckCircle className="w-5 h-5" /> : step}
                   </div>
                 ))}
               </div>
               
               {/* Forms */}
               {empStep === 1 && (
                 <div className="space-y-6 animate-fade-in">
                   <h3 className="font-bold text-[16px] mb-6 flex items-center gap-2"><div className="w-1.5 h-4 bg-[#fa541c] rounded-full"></div> 1. 选择模板</h3>
                   <div className="grid grid-cols-2 gap-5">
                     <div className="border-2 border-[#fa541c] bg-orange-50/50 rounded-2xl p-6 cursor-pointer relative overflow-hidden transition-all shadow-sm">
                       <CheckCircle className="absolute top-4 right-4 text-[#fa541c] w-5 h-5" />
                       <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mb-4 shadow-sm border border-orange-100"><Users className="w-7 h-7 text-[#fa541c]" /></div>
                       <div className="font-bold text-[15px] text-neutral-900">基础问答型</div>
                       <p className="text-[12px] text-neutral-500 mt-2">适用于通用型的文本问答、咨询指导和内容生成场景。</p>
                     </div>
                     <div className="border-2 border-transparent bg-neutral-50 hover:bg-neutral-100 rounded-2xl p-6 cursor-pointer transition-all border-dashed">
                       <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mb-4 shadow-sm"><Code className="w-7 h-7 text-blue-500" /></div>
                       <div className="font-bold text-[15px] text-neutral-700">代码专家型</div>
                       <p className="text-[12px] text-neutral-400 mt-2">内置强大的编程能力，适用于代码审查、补全与修复。</p>
                     </div>
                   </div>
                 </div>
               )}
               
               {empStep === 2 && (
                 <div className="space-y-6 animate-fade-in">
                   <h3 className="font-bold text-[16px] mb-6 flex items-center gap-2"><div className="w-1.5 h-4 bg-[#fa541c] rounded-full"></div> 2. 基础信息配置</h3>
                   <div className="space-y-2.5">
                     <label className="text-[13px] font-bold text-neutral-700 block">员工名称 <span className="text-[#fa541c]">*</span></label>
                     <input value={empForm.name} onChange={e => setEmpForm({...empForm, name: e.target.value})} className="w-full border border-neutral-200 rounded-xl px-4 py-3 text-[14px] focus:outline-none focus:border-[#fa541c] focus:ring-1 focus:ring-[#fa541c] transition-all" placeholder="例如：架构师小李" />
                   </div>
                   <div className="space-y-2.5">
                     <label className="text-[13px] font-bold text-neutral-700 block">角色描述 (Role)</label>
                     <input value={empForm.role} onChange={e => setEmpForm({...empForm, role: e.target.value})} className="w-full border border-neutral-200 rounded-xl px-4 py-3 text-[14px] focus:outline-none focus:border-[#fa541c] focus:ring-1 focus:ring-[#fa541c] transition-all" placeholder="例如：高级系统架构师" />
                   </div>
                   <div className="space-y-2.5">
                     <label className="text-[13px] font-bold text-neutral-700 block">职能说明 (System Prompt)</label>
                     <textarea value={empForm.desc} onChange={e => setEmpForm({...empForm, desc: e.target.value})} className="w-full border border-neutral-200 rounded-xl px-4 py-3 text-[14px] focus:outline-none focus:border-[#fa541c] focus:ring-1 focus:ring-[#fa541c] transition-all h-32 resize-none" placeholder="输入核心提示词设定..." />
                   </div>
                 </div>
               )}
               
               {empStep === 3 && (
                 <div className="space-y-6 animate-fade-in">
                   <h3 className="font-bold text-[16px] mb-6 flex items-center gap-2"><div className="w-1.5 h-4 bg-[#fa541c] rounded-full"></div> 3. 测试与验证</h3>
                   <div className="bg-neutral-50/50 border border-neutral-200 rounded-2xl h-80 flex flex-col p-5 shadow-inner">
                     <div className="flex-1 flex flex-col justify-end pb-5 space-y-4">
                       <div className="flex items-start gap-3">
                         <div className="w-8 h-8 bg-[#fa541c] text-white rounded-full flex items-center justify-center shrink-0 shadow-sm"><Bot className="w-4 h-4" /></div>
                         <div className="bg-white border border-neutral-200 p-3.5 rounded-2xl rounded-tl-sm text-[13px] shadow-sm text-neutral-700 leading-relaxed max-w-[85%]">
                           您好，我是新创建的数字员工 <span className="font-bold">{empForm.name || '小新'}</span>。在正式发布之前，您可以向我发送消息以验证我的回复设定是否符合预期。
                         </div>
                       </div>
                     </div>
                     <div className="flex gap-3 bg-white p-2 rounded-xl border border-neutral-200 shadow-sm">
                       <input className="flex-1 px-3 text-[13px] focus:outline-none" placeholder="向员工发送测试消息..." />
                       <Button className="bg-[#fa541c] hover:bg-[#e84a15] text-white rounded-lg px-5 font-bold shadow-sm h-9">发送</Button>
                     </div>
                   </div>
                 </div>
               )}
               
               {empStep === 4 && (
                 <div className="space-y-6 animate-fade-in flex flex-col items-center justify-center h-80 text-center">
                   <div className="w-20 h-20 bg-emerald-50 border border-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mb-6 shadow-sm"><CheckCircle className="w-10 h-10" /></div>
                   <h3 className="font-bold text-[20px] text-neutral-900 mb-2">配置已就绪</h3>
                   <p className="text-[14px] text-neutral-500 max-w-sm leading-relaxed">
                     数字员工 <strong>{empForm.name || '未命名'}</strong> 已完成测试，状态正常。<br/>
                     点击右下角“立即发布”上线，租户内其他应用即刻生效并可调用。
                   </p>
                 </div>
               )}
             </div>
             
             <div className="px-8 py-5 border-t border-neutral-100 flex justify-between shrink-0 bg-neutral-50/80">
               <Button onClick={() => empStep > 1 ? setEmpStep(empStep-1) : setIsEmpModalOpen(false)} variant="outline" className="rounded-full px-8 text-[13px] h-10 font-bold text-neutral-600 border-neutral-200">
                 {empStep > 1 ? '上一步' : '取消创建'}
               </Button>
               <Button 
                 onClick={() => {
                   if (empStep < 4) setEmpStep(empStep+1);
                   else {
                     setEmployees([{ id: Date.now(), name: empForm.name || '新数字员工', role: empForm.role || '未定义角色', avatar: `https://picsum.photos/seed/${Date.now()}/100/100`, status: '已发布', calls: 0, successRate: '100%', avgTime: '0s', desc: empForm.desc || '默认描述' }, ...employees]);
                     showToast('数字员工发布成功！');
                     setIsEmpModalOpen(false);
                   }
                 }}
                 className="bg-[#fa541c] hover:bg-[#e84a15] text-white rounded-full px-10 shadow-sm font-bold text-[13px] h-10"
               >
                 {empStep < 4 ? '下一步' : '立即发布'}
               </Button>
             </div>
          </div>
        </div>
      )}

      {/* 3. Apply Public Modal */}
      {isApplyModalOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in" onClick={() => setIsApplyModalOpen(false)}>
          <div className="bg-white rounded-3xl shadow-xl w-[560px] overflow-hidden border border-neutral-200 flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/50">
              <h2 className="text-[18px] font-bold text-neutral-900">申请公开至公共能力池</h2>
              <button onClick={() => setIsApplyModalOpen(false)} className="text-neutral-400 hover:text-[#fa541c]"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-8 space-y-5 max-h-[70vh] overflow-y-auto custom-scrollbar">
              <div className="bg-blue-50 text-blue-600 p-4 rounded-xl text-[13px] flex items-start gap-3 border border-blue-100">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <span className="leading-relaxed font-medium">审核通过后，AI能力进入租户公共能力池，租户内所有教师和学生可使用，调用费用由租户统一承担。</span>
              </div>
              
              <div className="space-y-2">
                <label className="text-[13px] font-bold block"><span className="text-red-500">*</span> AI能力名称</label>
                <input value={applyForm.name} onChange={e => setApplyForm({...applyForm, name: e.target.value})} className="w-full border border-neutral-200 rounded-xl px-4 py-2.5 text-[14px] bg-neutral-50" readOnly />
              </div>
              <div className="space-y-2">
                <label className="text-[13px] font-bold block"><span className="text-red-500">*</span> 功能描述</label>
                <textarea value={applyForm.desc} onChange={e => setApplyForm({...applyForm, desc: e.target.value})} className="w-full border border-neutral-200 rounded-xl px-4 py-2.5 text-[14px] h-20 resize-none focus:outline-none focus:border-[#fa541c]" placeholder="详细描述该能力的核心功能..." />
              </div>
              <div className="space-y-2">
                <label className="text-[13px] font-bold block"><span className="text-red-500">*</span> 适用场景</label>
                <input value={applyForm.scenario} onChange={e => setApplyForm({...applyForm, scenario: e.target.value})} className="w-full border border-neutral-200 rounded-xl px-4 py-2.5 text-[14px] focus:outline-none focus:border-[#fa541c]" placeholder="例如：适用于自然语言处理相关课程..." />
              </div>
              <div className="space-y-2">
                <label className="text-[13px] font-bold block"><span className="text-red-500">*</span> 调用示例</label>
                <textarea value={applyForm.example} onChange={e => setApplyForm({...applyForm, example: e.target.value})} className="w-full border border-neutral-200 rounded-xl px-4 py-2.5 text-[14px] h-20 resize-none focus:outline-none focus:border-[#fa541c]" placeholder="描述该能力的输入规范及样例..." />
              </div>
              <div className="space-y-2">
                <label className="text-[13px] font-bold block"><span className="text-red-500">*</span> 成本评估</label>
                <input value={applyForm.cost} onChange={e => setApplyForm({...applyForm, cost: e.target.value})} className="w-full border border-neutral-200 rounded-xl px-4 py-2.5 text-[14px] focus:outline-none focus:border-[#fa541c]" placeholder="例如：约 50 Token / 次" />
              </div>
            </div>
            <div className="p-6 border-t border-neutral-100 bg-neutral-50/30 flex justify-end gap-3">
              <Button onClick={() => setIsApplyModalOpen(false)} variant="outline" className="rounded-full px-6 text-[13px] font-bold">取消</Button>
              <Button onClick={() => {
                if(!applyForm.name || !applyForm.desc || !applyForm.scenario || !applyForm.example || !applyForm.cost) { 
                  showToast('请完整填写申请信息', 'error'); return; 
                }
                showToast('提交成功，等待管理员审核');
                setIsApplyModalOpen(false);
              }} className="bg-[#fa541c] hover:bg-[#e84a15] text-white rounded-full px-8 text-[13px] shadow-sm font-bold">提交审核</Button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Assistant Creation Drawer */}
      {isAssModalOpen && (
        <div className="fixed inset-0 z-[150] flex justify-end bg-black/45 backdrop-blur-[2px] animate-fade-in" onClick={() => setIsAssModalOpen(false)}>
          <div className="bg-white w-full max-w-[640px] h-screen shadow-2xl border-l border-neutral-100 flex flex-col animate-in slide-in-from-right duration-300" onClick={e => e.stopPropagation()}>
             <div className="px-8 py-5 border-b border-neutral-100 flex justify-between items-center shrink-0 bg-neutral-50/50">
                <h2 className="text-[18px] font-bold text-neutral-900">配置私有智能助手</h2>
                <button onClick={() => setIsAssModalOpen(false)} className="text-neutral-400 hover:text-[#fa541c] hover:bg-orange-50 p-2 rounded-full transition-colors"><X className="w-5 h-5" /></button>
             </div>
             <div className="flex-1 p-8 overflow-y-auto space-y-7 custom-scrollbar">
               <div className="flex flex-col items-center justify-center gap-3 mb-6 border-b border-neutral-100 pb-8">
                 <div className="w-24 h-24 rounded-[20px] bg-neutral-50 border-2 border-neutral-200 border-dashed flex items-center justify-center overflow-hidden cursor-pointer hover:bg-neutral-100 hover:border-[#fa541c]/50 transition-all group shadow-sm">
                    <UploadCloud className="w-8 h-8 text-neutral-400 group-hover:text-[#fa541c]" />
                 </div>
                 <div className="text-[13px] font-bold text-neutral-500">点击上传助手头像</div>
               </div>
               
               <div className="space-y-2.5">
                 <label className="text-[13px] font-bold block text-neutral-700">助手名称 <span className="text-[#fa541c]">*</span></label>
                 <input value={assForm.name} onChange={e => setAssForm({...assForm, name: e.target.value})} className="w-full border border-neutral-200 rounded-xl px-4 py-3 text-[14px] focus:outline-none focus:border-[#fa541c] focus:ring-1 focus:ring-[#fa541c] transition-all" placeholder="例如：操作系统答疑机器人" />
               </div>
               
               <div className="space-y-2.5">
                 <label className="text-[13px] font-bold block text-neutral-700">助手分类</label>
                 <select value={assForm.type} onChange={e => setAssForm({...assForm, type: e.target.value as any})} className="w-full border border-neutral-200 rounded-xl px-4 py-3 text-[14px] bg-white focus:outline-none focus:border-[#fa541c] focus:ring-1 focus:ring-[#fa541c] transition-all appearance-none cursor-pointer">
                   <option>课程助手</option>
                   <option>实验助手</option>
                   <option>答疑助手</option>
                 </select>
               </div>
               
               <div className="space-y-2.5">
                 <label className="text-[13px] font-bold block text-neutral-700">默认欢迎语</label>
                 <textarea value={assForm.welcome} onChange={e => setAssForm({...assForm, welcome: e.target.value})} className="w-full border border-neutral-200 rounded-xl px-4 py-3 text-[14px] h-24 resize-none focus:outline-none focus:border-[#fa541c] focus:ring-1 focus:ring-[#fa541c] transition-all" placeholder="设置学生进入聊天室时看到的开场白..." />
               </div>
               
               <div className="space-y-2.5">
                 <label className="text-[13px] font-bold block text-neutral-700">关联课程 / 知识库</label>
                 <div className="w-full border-2 border-dashed border-neutral-200 rounded-2xl p-6 flex flex-col items-center justify-center text-neutral-500 bg-neutral-50 cursor-pointer hover:bg-orange-50/50 hover:border-[#fa541c]/50 transition-all">
                    <Database className="w-6 h-6 mb-3 text-neutral-400" />
                    <span className="text-[13px] font-bold text-neutral-600 mb-1">挂载专属知识边界</span>
                    <span className="text-[12px] text-neutral-400 max-w-[200px] text-center leading-relaxed">点击选取实训平台内的课程文档或个人题库作为知识来源</span>
                 </div>
               </div>
             </div>
             
             <div className="px-8 py-5 border-t border-neutral-100 flex justify-end gap-3 shrink-0 bg-neutral-50/80">
               <Button onClick={() => setIsAssModalOpen(false)} variant="outline" className="rounded-full px-8 h-10 font-bold text-neutral-600 border-neutral-200 text-[13px]">取消</Button>
               <Button onClick={() => {
                 setAssistants([{ id: Date.now(), name: assForm.name || '未命名智能助手', type: assForm.type as any, welcomeMsg: assForm.welcome || '你好，我是智能助手。', avatar: `https://picsum.photos/seed/${Date.now()+1}/100/100`, authorized: 0 }, ...assistants]);
                 showToast('智能助手创建成功');
                 setIsAssModalOpen(false);
               }} className="bg-[#fa541c] hover:bg-[#e84a15] text-white rounded-full px-10 h-10 shadow-sm font-bold text-[13px]">保存并生效</Button>
             </div>
          </div>
        </div>
      )}

    </div>
  );
}
