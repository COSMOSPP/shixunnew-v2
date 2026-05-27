import React, { useState } from 'react';
import { 
  Bot, Search, Plus, Trash2, Edit, CheckCircle, 
  AlertCircle, X, Settings, Database, UploadCloud, Users
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

// --- Types ---
interface SmartAssistant {
  id: number;
  name: string;
  type: '课程助手' | '实验助手' | '答疑助手';
  welcomeMsg: string;
  avatar: string;
  authorized: number;
}

// --- Mock Data ---
const initialAssistants: SmartAssistant[] = [
  { id: 1, name: 'Python实战助教', type: '课程助手', welcomeMsg: '同学你好，我是Python实战助教，你可以问我关于本课程的任何问题！', avatar: 'https://picsum.photos/seed/a1/100/100', authorized: 120 },
  { id: 2, name: '深度学习答疑', type: '答疑助手', welcomeMsg: '遇到报错了？把日志发给我看看。', avatar: 'https://picsum.photos/seed/a2/100/100', authorized: 45 }
];

export default function TeacherAICenter({ embedded = false }: { embedded?: boolean }) {
  const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // --- States ---
  const [assistants, setAssistants] = useState(initialAssistants);
  const [searchQuery, setSearchQuery] = useState('');

  // Assistant Flow
  const [isAssModalOpen, setIsAssModalOpen] = useState(false);
  const [assForm, setAssForm] = useState({ name: '', type: '课程助手', welcome: '', kbs: '' });

  // Apply Public Flow
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [applyForm, setApplyForm] = useState({ name: '', desc: '', scenario: '', example: '', cost: '' });

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
      <div className="flex items-center justify-between gap-6 mb-8">
        {/* Search Input */}
        <div className="relative flex-1 max-w-[280px]">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 transition-colors" />
          <input 
            placeholder="搜索名称或描述..." 
            className="pl-10 pr-4 py-2 text-[13px] w-full rounded-full border border-neutral-200 bg-white focus:outline-none focus:border-[#fa541c] focus:ring-1 focus:ring-[#fa541c] shadow-sm transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        {/* New Assistant Button */}
        <Button 
          onClick={() => {
            setAssForm({ name: '', type: '课程助手', welcome: '', kbs: '' }); setIsAssModalOpen(true);
          }} 
          className="bg-[#fa541c] hover:bg-[#e84a15] text-white rounded-full px-6 h-9 text-[13px] shadow-sm font-bold shrink-0"
        >
          <Plus className="w-4 h-4 mr-1.5" /> 
          新建助手
        </Button>
      </div>

      <div className="pb-20">
        {renderAssistants()}
      </div>

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
