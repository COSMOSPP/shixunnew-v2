import React, { useState } from 'react';
import { 
  Search, ChevronRight, ChevronDown, ChevronLeft, Plus, ArrowLeft, ArrowRight, 
  Terminal, Code, Settings, Rocket, BookOpen, Clock, User, FileCode, CheckCircle2, 
  Bot, Send, Paperclip, LayoutDashboard, Database, Activity, Cpu, PlayCircle, FileText,
  History, Calendar, Info, Layers, Zap, Star, Sparkles, GitFork, Download, Tag, Heart, X, Copy, Users, Box, MessageSquare, Edit, Trash2, Power, AlertCircle, CheckCircle, WorkflowIcon, Edit3
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const techTypes = ["全部", "数据处理", "模型训练", "可视化", "对话交互", "代码开发", "图像生成"];
const scenarios = ["全部", "课程辅助", "项目开发", "考试测评", "内容创作", "日常办公"];
const sortOptions = ["按时间", "按热度", "按难度"];

interface Practice {
  id: number;
  title: string;
  description: string;
  techTags: string[];
  scenarioTags: string[];
  usageCount: number;
  image: string;
  author: string;
  date: string;
  version: string;
  workflow: string[];
  summary: string;
  skills: string[];
  // Teacher Specific
  scope: '平台公共' | '我的私有';
  isAvailable?: boolean;
  auditStatus?: '未提交' | '待审核' | '审核通过' | '已拒绝';
}

const initialPractices: Practice[] = [
  {
    id: 1,
    title: "项目汇报 PPT 生成",
    description: "基于大模型快速生成项目汇报PPT大纲与内容，适合各类课程期末汇报、项目结题展示等场景，大幅提升文档编写效率。",
    techTags: ["对话交互", "内容创作"],
    scenarioTags: ["课程辅助", "日常办公"],
    usageCount: 12500,
    image: "https://picsum.photos/seed/ppt/400/225",
    author: "AI助手",
    date: "2025-03-20",
    version: "V2.1.0",
    workflow: ["需求分析", "大纲生成", "任务拆分", "并行写作", "智能配图", "文档合并"],
    summary: "一键生成专业级PPT演示文稿，告别排版与构思烦恼，内置多种主流的学术、商业演示模板。",
    skills: ["文档解析能力", "PPT排版引擎", "图文排版大模型"],
    scope: '平台公共'
  },
  {
    id: 2,
    title: "Python 数据清洗与可视化教学案例",
    description: "提供一套完整的Python数据清洗模板代码，包含缺失值处理、异常值检测、数据标准化等功能，专为数据分析课程设计。",
    techTags: ["数据处理", "代码开发"],
    scenarioTags: ["课程辅助", "项目开发"],
    usageCount: 8200,
    image: "https://picsum.photos/seed/data/400/225",
    author: "张老师",
    date: "2025-05-18",
    version: "V1.0.5",
    workflow: ["目标抓取", "异常值清洗", "特征归一", "相关性分析", "动态图表生成"],
    summary: "专为学生入门数据分析打造的全自动清洗工作流实践，包含真实业务数据集。",
    skills: ["Pandas预处理", "Matplotlib引擎", "自动代码生成"],
    scope: '我的私有',
    isAvailable: true,
    auditStatus: '未提交'
  },
  {
    id: 3,
    title: "期末自动出卷与判卷助手",
    description: "利用大语言模型自动生成符合考纲的期末试题，并支持主观题自动化评分参考。",
    techTags: ["对话交互", "文本生成"],
    scenarioTags: ["考试测评", "日常办公"],
    usageCount: 5600,
    image: "https://picsum.photos/seed/exam/400/225",
    author: "张老师",
    date: "2025-05-15",
    version: "V1.2.0",
    workflow: ["知识点选择", "难度配比", "题干生成", "答案校准", "一键导出"],
    summary: "帮助教师快速出卷，提供多维度的评分参考模板，大幅降低考务工作量。",
    skills: ["上下文注入", "复杂推理模型", "文档导出"],
    scope: '我的私有',
    isAvailable: false,
    auditStatus: '未提交'
  }
];

export default function TeacherPractices({ embedded = false }: { embedded?: boolean }) {
  const [view, setView] = useState<'list' | 'detail'>('list');
  const [selectedPractice, setSelectedPractice] = useState<Practice | null>(null);
  
  const [practices, setPractices] = useState<Practice[]>(initialPractices);
  const [tabFilter, setTabFilter] = useState<'all' | 'public' | 'my'>('all');
  
  const [selectedTech, setSelectedTech] = useState("全部");
  const [selectedScenario, setSelectedScenario] = useState("全部");
  const [sortBy, setSortBy] = useState("按时间");
  const [searchQuery, setSearchQuery] = useState("");

  const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null);
  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Create / Edit Modal
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentId, setCurrentId] = useState<number | null>(null);
  
  const [formTitle, setFormTitle] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formSummary, setFormSummary] = useState('');
  const [formTechTags, setFormTechTags] = useState('');
  const [formScenarioTags, setFormScenarioTags] = useState('');

  // Apply Public Modal
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [applyPractice, setApplyPractice] = useState<Practice | null>(null);
  const [applyReason, setApplyReason] = useState('');
  const [applyTarget, setApplyTarget] = useState('');

  const formatUsageCount = (count: number) => {
    return count >= 1000 ? (count / 1000).toFixed(1) + 'k' : count.toString();
  };

  const handleOpenCreate = () => {
    setIsEditMode(false);
    setCurrentId(null);
    setFormTitle('');
    setFormDesc('');
    setFormSummary('');
    setFormTechTags('');
    setFormScenarioTags('');
    setIsDrawerOpen(true);
  };

  const handleOpenEdit = (e: React.MouseEvent, p: Practice) => {
    e.stopPropagation();
    setIsEditMode(true);
    setCurrentId(p.id);
    setFormTitle(p.title);
    setFormDesc(p.description);
    setFormSummary(p.summary);
    setFormTechTags(p.techTags.join(', '));
    setFormScenarioTags(p.scenarioTags.join(', '));
    setIsDrawerOpen(true);
  };

  const handleSave = () => {
    if (!formTitle.trim()) {
      showToast('实践名称不能为空', 'error');
      return;
    }
    const tTags = formTechTags.split(/[,，]/).map(t => t.trim()).filter(Boolean);
    const sTags = formScenarioTags.split(/[,，]/).map(t => t.trim()).filter(Boolean);

    if (isEditMode && currentId !== null) {
      setPractices(practices.map(p => p.id === currentId ? {
        ...p,
        title: formTitle,
        description: formDesc,
        summary: formSummary,
        techTags: tTags.length > 0 ? tTags : p.techTags,
        scenarioTags: sTags.length > 0 ? sTags : p.scenarioTags,
        date: new Date().toISOString().split('T')[0]
      } : p));
      showToast('最佳实践更新成功');
    } else {
      const newPractice: Practice = {
        id: Date.now(),
        title: formTitle,
        description: formDesc,
        summary: formSummary,
        techTags: tTags.length > 0 ? tTags : ["对话交互"],
        scenarioTags: sTags.length > 0 ? sTags : ["课程辅助"],
        usageCount: 0,
        image: `https://picsum.photos/seed/${Date.now()}/400/225`,
        author: "当前教师",
        date: new Date().toISOString().split('T')[0],
        version: "V1.0.0",
        workflow: ["需求分析", "流程设计", "执行验证"],
        skills: ["基础问答", "文档解析"],
        scope: '我的私有',
        isAvailable: true,
        auditStatus: '未提交'
      };
      setPractices([newPractice, ...practices]);
      showToast('最佳实践创建成功');
    }
    setIsDrawerOpen(false);
  };

  const handleToggleAvailable = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    setPractices(practices.map(p => {
      if (p.id === id) {
        const nextState = !p.isAvailable;
        showToast(nextState ? '该实践已对学生可用' : '已停用该实践，学生将不可见');
        return { ...p, isAvailable: nextState };
      }
      return p;
    }));
  };

  const handleDelete = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    if (confirm('确定要删除该最佳实践吗？')) {
      setPractices(practices.filter(p => p.id !== id));
      showToast('删除成功');
    }
  };

  const filteredPractices = practices
    .filter(p => {
      if (tabFilter === 'public' && p.scope !== '平台公共') return false;
      if (tabFilter === 'my' && p.scope !== '我的私有') return false;
      if (selectedTech !== "全部" && !p.techTags.includes(selectedTech)) return false;
      if (selectedScenario !== "全部" && !p.scenarioTags.includes(selectedScenario)) return false;
      if (searchQuery && !p.title.toLowerCase().includes(searchQuery.toLowerCase()) && !p.description.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "按时间") return new Date(b.date).getTime() - new Date(a.date).getTime();
      if (sortBy === "按热度") return b.usageCount - a.usageCount;
      return 0;
    });

  const renderListView = () => (
    <div className={cn("flex flex-col relative h-full", embedded ? "p-4" : "p-8")}>
      
      {/* Top Actions & Filters */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 mb-8">
        
        {/* Tab */}
        <div className="flex items-center gap-5">
          <div className="flex bg-neutral-100/80 rounded-full p-1 border border-neutral-200/60 shadow-sm">
            <button 
              className={cn("px-5 py-1.5 text-[13px] rounded-full transition-all duration-200", tabFilter === 'all' ? "bg-white text-[#fa541c] font-bold shadow-sm" : "text-neutral-500 hover:text-neutral-800")}
              onClick={() => setTabFilter('all')}
            >
              全部实践
            </button>
            <button 
              className={cn("px-5 py-1.5 text-[13px] rounded-full transition-all duration-200", tabFilter === 'public' ? "bg-white text-[#fa541c] font-bold shadow-sm" : "text-neutral-500 hover:text-neutral-800")}
              onClick={() => setTabFilter('public')}
            >
              平台公共
            </button>
            <button 
              className={cn("px-5 py-1.5 text-[13px] rounded-full transition-all duration-200", tabFilter === 'my' ? "bg-white text-[#fa541c] font-bold shadow-sm" : "text-neutral-500 hover:text-neutral-800")}
              onClick={() => setTabFilter('my')}
            >
              我的实践
            </button>
          </div>
        </div>

        {/* Search & Create Button */}
        <div className="flex items-center gap-4 w-full xl:w-auto">
          <div className="relative flex-1 xl:flex-none">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-caption transition-colors" />
            <input 
              placeholder="按名称或描述搜索..." 
              className="pl-10 pr-4 py-2 text-[13px] w-full xl:w-64 rounded-full border border-neutral-200 bg-white focus:outline-none focus:border-[#fa541c] shadow-sm transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button 
            onClick={handleOpenCreate} 
            className="bg-[#fa541c] hover:bg-[#e84a15] text-white rounded-full px-6 h-9 text-[13px] shadow-sm font-bold shrink-0"
          >
            <Plus className="w-4 h-4 mr-1.5" /> 创建最佳实践
          </Button>
        </div>
      </div>

      {/* Sub Filters */}
      <div className="flex flex-col gap-4 mb-8 bg-neutral-50/50 p-5 rounded-2xl border border-neutral-100">
        <div className="flex items-start gap-4">
          <span className="text-[13px] text-neutral-500 font-bold whitespace-nowrap mt-1.5 w-16">技术类型:</span>
          <div className="flex flex-wrap gap-2">
            {techTypes.map((tech, i) => (
              <button 
                key={i}
                onClick={() => setSelectedTech(tech)}
                className={cn(
                  "px-4 py-1.5 rounded-full text-[12px] font-medium transition-colors",
                  selectedTech === tech 
                    ? "bg-[#fa541c] text-white shadow-sm" 
                    : "bg-white border border-neutral-200 text-neutral-600 hover:text-[#fa541c] hover:border-[#fa541c]"
                )}
              >
                {tech}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-start gap-4">
          <span className="text-[13px] text-neutral-500 font-bold whitespace-nowrap mt-1.5 w-16">业务场景:</span>
          <div className="flex flex-wrap gap-2">
            {scenarios.map((scenario, i) => (
              <button 
                key={i}
                onClick={() => setSelectedScenario(scenario)}
                className={cn(
                  "px-4 py-1.5 rounded-full text-[12px] font-medium transition-colors",
                  selectedScenario === scenario 
                    ? "bg-[#fa541c] text-white shadow-sm" 
                    : "bg-white border border-neutral-200 text-neutral-600 hover:text-[#fa541c] hover:border-[#fa541c]"
                )}
              >
                {scenario}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6 pb-20">
        {filteredPractices.map((practice, i) => (
          <div 
            key={i} 
            onClick={() => {
              setSelectedPractice(practice);
              setView('detail');
            }}
            className="bg-white rounded-[20px] p-6 border border-neutral-200 shadow-sm hover:shadow-lg transition-all hover:-translate-y-1.5 group flex flex-col cursor-pointer relative"
          >
            {/* Status Tags for Teachers */}
            <div className="absolute top-4 right-4 flex flex-col items-end gap-1.5">
              {practice.scope === '平台公共' ? (
                <span className="px-2.5 py-1 bg-[#fff2e8] text-[#fa541c] text-[10px] font-bold rounded-lg border border-[#ffbb96]/30 shadow-sm">
                  平台公共
                </span>
              ) : (
                <>
                  <span className={cn(
                    "px-2.5 py-1 text-[10px] font-bold rounded-lg shadow-sm border",
                    practice.isAvailable ? "bg-emerald-50 text-emerald-600 border-emerald-200" : "bg-neutral-100 text-neutral-500 border-neutral-200"
                  )}>
                    {practice.isAvailable ? '可见可用' : '已停用'}
                  </span>
                  {practice.auditStatus && (
                    <span className={cn(
                      "px-2 py-0.5 text-[10px] font-medium rounded",
                      practice.auditStatus === '待审核' ? "text-orange-500 bg-orange-50" :
                      practice.auditStatus === '审核通过' ? "text-green-600 bg-green-50" :
                      practice.auditStatus === '已拒绝' ? "text-red-500 bg-red-50" : "text-neutral-500 bg-neutral-100"
                    )}>
                      {practice.auditStatus}
                    </span>
                  )}
                </>
              )}
            </div>

            {/* Header: Icon and Title */}
            <div className="flex items-start gap-4 mb-4 pr-16">
              <div className="w-12 h-12 rounded-[14px] overflow-hidden shrink-0 border border-neutral-200 shadow-sm">
                <img src={practice.image} alt={practice.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" referrerPolicy="no-referrer" />
              </div>
              <h3 className="text-[16px] font-bold text-neutral-800 line-clamp-2 group-hover:text-[#fa541c] transition-colors leading-snug">
                {practice.title}
              </h3>
            </div>
            
            {/* Description */}
            <p className="text-[13px] text-neutral-500 mb-5 line-clamp-2 leading-relaxed flex-1">
              {practice.description}
            </p>
            
            <div className="flex items-center gap-2 flex-wrap mb-5">
              {practice.techTags.slice(0, 1).map((tag: string, idx: number) => (
                <span key={`tech-${idx}`} className="px-2.5 py-1 bg-neutral-100/80 text-neutral-600 text-[11px] rounded-lg border border-neutral-200/50">
                  {tag}
                </span>
              ))}
              {practice.scenarioTags.slice(0, 1).map((tag: string, idx: number) => (
                <span key={`scene-${idx}`} className="px-2.5 py-1 bg-neutral-100/80 text-neutral-600 text-[11px] rounded-lg border border-neutral-200/50">
                  {tag}
                </span>
              ))}
            </div>
            
            {/* Footer */}
            <div className="flex items-center justify-between text-[13px] font-medium pt-4 border-t border-neutral-100">
              <div className="flex items-center text-neutral-700">
                <Activity className="w-4 h-4 text-neutral-400 mr-1.5" />
                {formatUsageCount(practice.usageCount)} <span className="text-[12px] font-normal text-neutral-400 ml-1">次调用</span>
              </div>
              <span className="text-neutral-400">@{practice.author}</span>
            </div>

            {/* Hover Actions for My Practices */}
            {practice.scope === '我的私有' && (
              <div className="absolute inset-0 bg-white/95 backdrop-blur-sm rounded-[20px] opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3">
                <Button 
                  onClick={(e) => handleOpenEdit(e, practice)}
                  variant="outline" className="w-32 rounded-full border-[#fa541c] text-[#fa541c] hover:bg-orange-50 hover:text-[#e84a15] font-bold text-[13px] h-9"
                >
                  <Edit className="w-4 h-4 mr-1.5" /> 编辑实践
                </Button>
                
                <Button 
                  onClick={(e) => handleToggleAvailable(e, practice.id)}
                  variant="outline" className="w-32 rounded-full border-neutral-300 text-neutral-600 hover:bg-neutral-50 font-bold text-[13px] h-9"
                >
                  <Power className={cn("w-4 h-4 mr-1.5", practice.isAvailable ? "text-red-500" : "text-emerald-500")} /> 
                  {practice.isAvailable ? '停用实践' : '启用实践'}
                </Button>

                {practice.isAvailable && practice.auditStatus === '未提交' && (
                  <Button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setApplyPractice(practice);
                      setApplyReason('');
                      setApplyTarget('');
                      setIsApplyModalOpen(true);
                    }}
                    className="w-32 rounded-full bg-[#fa541c] text-white hover:bg-[#e84a15] font-bold text-[13px] h-9 shadow-sm"
                  >
                    <Star className="w-4 h-4 mr-1.5" /> 申请公开
                  </Button>
                )}

                <Button 
                  onClick={(e) => handleDelete(e, practice.id)}
                  variant="ghost" className="w-32 rounded-full text-neutral-400 hover:text-red-500 hover:bg-red-50 font-medium text-[13px] h-9 mt-1"
                >
                  <Trash2 className="w-4 h-4 mr-1.5" /> 删除
                </Button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const renderDetailView = () => {
    if (!selectedPractice) return null;
    return (
      <div className="flex flex-col h-full bg-white relative z-50 overflow-y-auto">
        <div className="sticky top-0 z-10 bg-white/90 backdrop-blur-xl border-b border-neutral-100 px-8 py-4 flex items-center justify-between">
          <button 
            onClick={() => setView('list')}
            className="flex items-center gap-2 text-neutral-600 hover:text-[#fa541c] transition-colors font-bold text-[14px]"
          >
            <ArrowLeft className="w-4 h-4" /> 返回最佳实践
          </button>
          <div className="flex items-center gap-4">
             <div className="flex items-center gap-2 bg-neutral-50 border border-neutral-200 rounded-lg px-4 py-1.5">
               <Tag className="w-4 h-4 text-neutral-400" />
               <span className="text-[13px] font-bold text-neutral-600">{selectedPractice.version}</span>
             </div>
             {selectedPractice.scope === '我的私有' && (
               <Button onClick={(e) => handleOpenEdit(e, selectedPractice)} className="bg-white border border-[#fa541c] text-[#fa541c] hover:bg-orange-50 font-bold rounded-lg h-9 px-6 text-[13px]">
                 编辑此实践
               </Button>
             )}
          </div>
        </div>

        <div className="p-8 max-w-[1400px] mx-auto w-full">
          <div className="bg-white rounded-3xl p-10 mb-8 shadow-sm border border-neutral-200 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-orange-100/50 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
            
            <div className="flex items-start justify-between gap-12 relative z-10">
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-5">
                  <h1 className="text-3xl font-extrabold text-neutral-900 tracking-tight">{selectedPractice.title}</h1>
                  <span className={cn(
                    "px-3 py-1 rounded-md text-[12px] font-bold border shadow-sm",
                    selectedPractice.scope === '平台公共' ? "bg-blue-50 text-blue-600 border-blue-100" : "bg-neutral-100 text-neutral-600 border-neutral-200"
                  )}>
                    {selectedPractice.scope}
                  </span>
                </div>
                <p className="text-neutral-600 text-[15px] leading-relaxed max-w-4xl bg-neutral-50/80 p-5 rounded-2xl border border-neutral-100 mb-6">
                  <span className="font-bold text-neutral-900 mr-2 flex items-center gap-1.5 inline-flex"><Sparkles className="w-4 h-4 text-orange-500"/> 核心摘要:</span> 
                  {selectedPractice.summary} {selectedPractice.description}
                </p>

                <div className="bg-white rounded-2xl p-6 border border-neutral-200 shadow-sm">
                  <h3 className="text-[15px] font-bold text-neutral-900 mb-5 flex items-center gap-2">
                    <History className="w-5 h-5 text-[#fa541c]" /> 工作流编排说明
                  </h3>
                  <div className="flex items-center flex-wrap gap-y-4">
                    {selectedPractice.workflow.map((step: string, index: number) => (
                      <React.Fragment key={index}>
                        <div className="bg-neutral-50 border border-neutral-200 px-5 py-2.5 rounded-xl text-[13px] font-bold text-neutral-700 shadow-sm flex items-center gap-3 hover:border-[#fa541c] transition-colors cursor-default">
                          <div className="w-6 h-6 rounded-full bg-[#fa541c]/10 text-[#fa541c] flex items-center justify-center text-[12px]">{index + 1}</div>
                          {step}
                        </div>
                        {index < selectedPractice.workflow.length - 1 && (
                          <div className="px-4 text-neutral-400"><ArrowRight className="w-4 h-4" /></div>
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              </div>
              <div className="w-[360px] aspect-video rounded-2xl overflow-hidden shadow-md shrink-0 border border-neutral-200/50 hidden lg:block">
                 <img src={selectedPractice.image} className="w-full h-full object-cover" alt="cover"/>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={cn("flex flex-col h-full bg-neutral-50/30", embedded ? "" : "h-screen")}>
      
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

      {view === 'list' ? renderListView() : renderDetailView()}

      {/* Drawer for Create / Edit */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-[150] bg-black/45 backdrop-blur-[2px] flex justify-end animate-fade-in" onClick={() => setIsDrawerOpen(false)}>
          <div className="bg-white w-full max-w-[640px] h-screen flex flex-col shadow-2xl border-l border-neutral-100 animate-in slide-in-from-right duration-300" onClick={(e) => e.stopPropagation()}>
            <div className="px-8 py-5 border-b border-neutral-100 flex justify-between items-center bg-neutral-50/50 shrink-0">
              <h2 className="text-[18px] font-bold text-neutral-900">
                {isEditMode ? '编辑最佳实践' : '创建教师私有实践'}
              </h2>
              <button onClick={() => setIsDrawerOpen(false)} className="text-neutral-400 hover:text-[#fa541c] p-2 hover:bg-orange-50 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-7 custom-scrollbar">
              <div className="space-y-2.5">
                <label className="text-[13px] font-bold text-neutral-700">实践名称 <span className="text-[#fa541c]">*</span></label>
                <input
                  type="text"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="如：项目汇报 PPT 生成..."
                  className="w-full border border-neutral-200 rounded-xl px-4 py-3 text-[14px] focus:outline-none focus:border-[#fa541c] focus:ring-1 focus:ring-[#fa541c] transition-all"
                />
              </div>

              <div className="space-y-2.5">
                <label className="text-[13px] font-bold text-neutral-700">核心摘要</label>
                <input
                  type="text"
                  value={formSummary}
                  onChange={(e) => setFormSummary(e.target.value)}
                  placeholder="一句话总结该实践的核心亮点与价值..."
                  className="w-full border border-neutral-200 rounded-xl px-4 py-3 text-[14px] focus:outline-none focus:border-[#fa541c] focus:ring-1 focus:ring-[#fa541c] transition-all"
                />
              </div>

              <div className="space-y-2.5">
                <label className="text-[13px] font-bold text-neutral-700">详细描述</label>
                <textarea
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  placeholder="描述适用的业务场景、背景痛点以及解决思路..."
                  className="w-full h-32 border border-neutral-200 rounded-xl px-4 py-3 text-[14px] focus:outline-none focus:border-[#fa541c] focus:ring-1 focus:ring-[#fa541c] resize-none transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2.5">
                  <label className="text-[13px] font-bold text-neutral-700">技术标签</label>
                  <input
                    type="text"
                    value={formTechTags}
                    onChange={(e) => setFormTechTags(e.target.value)}
                    placeholder="如：对话交互, 数据处理"
                    className="w-full border border-neutral-200 rounded-xl px-4 py-3 text-[14px] focus:outline-none focus:border-[#fa541c] focus:ring-1 focus:ring-[#fa541c] transition-all"
                  />
                </div>
                <div className="space-y-2.5">
                  <label className="text-[13px] font-bold text-neutral-700">业务场景标签</label>
                  <input
                    type="text"
                    value={formScenarioTags}
                    onChange={(e) => setFormScenarioTags(e.target.value)}
                    placeholder="如：课程辅助, 日常办公"
                    className="w-full border border-neutral-200 rounded-xl px-4 py-3 text-[14px] focus:outline-none focus:border-[#fa541c] focus:ring-1 focus:ring-[#fa541c] transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="px-8 py-5 border-t border-neutral-100 bg-neutral-50/80 flex justify-end gap-3 shrink-0">
              <Button onClick={() => setIsDrawerOpen(false)} variant="outline" className="border-neutral-200 text-neutral-600 h-10 px-6 rounded-full font-bold text-[13px]">
                取消
              </Button>
              <Button onClick={handleSave} className="bg-[#fa541c] hover:bg-[#e84a15] text-white h-10 px-10 rounded-full shadow-sm font-bold text-[13px]">
                保存配置
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Apply for Public Modal */}
      {isApplyModalOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in" onClick={() => setIsApplyModalOpen(false)}>
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-[500px] overflow-hidden border border-neutral-200 flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/50">
              <h2 className="text-[18px] font-bold text-neutral-900">
                申请公开最佳实践
              </h2>
              <button onClick={() => setIsApplyModalOpen(false)} className="text-neutral-400 hover:text-[#fa541c] hover:bg-orange-50 p-1.5 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-8 space-y-6">
              <div className="bg-orange-50/80 text-orange-600 p-4 rounded-xl text-[13px] flex items-start gap-3 border border-orange-100">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <span className="leading-relaxed">申请公开后，该最佳实践需经过平台超管审核。审核通过后将加入平台公共库，全平台师生可见可用。</span>
              </div>
              
              <div>
                <label className="text-[13px] font-bold text-neutral-700 block mb-2.5">
                  <span className="text-[#fa541c]">*</span> 适用对象与收益说明
                </label>
                <input 
                  type="text" 
                  value={applyTarget}
                  onChange={(e) => setApplyTarget(e.target.value)}
                  placeholder="例如：适用于全体需要进行项目答辩的学生..." 
                  className="w-full border border-neutral-200 rounded-xl px-4 py-3 text-[14px] focus:outline-none focus:border-[#fa541c] focus:ring-1 focus:ring-[#fa541c] transition-all"
                />
              </div>

              <div>
                <label className="text-[13px] font-bold text-neutral-700 block mb-2.5">
                  <span className="text-[#fa541c]">*</span> 审核备注 (推荐理由)
                </label>
                <textarea 
                  value={applyReason}
                  onChange={(e) => setApplyReason(e.target.value)}
                  placeholder="向管理员简述该实践的核心价值与亮点..." 
                  className="w-full h-32 border border-neutral-200 rounded-xl px-4 py-3 text-[14px] focus:outline-none focus:border-[#fa541c] focus:ring-1 focus:ring-[#fa541c] resize-none transition-all"
                ></textarea>
              </div>
            </div>

            <div className="p-6 border-t border-neutral-100 bg-neutral-50/30 flex items-center justify-end gap-3">
              <Button onClick={() => setIsApplyModalOpen(false)} variant="outline" className="border-neutral-200 text-neutral-600 font-bold h-10 px-6 rounded-full text-[13px]">
                取消
              </Button>
              <Button 
                onClick={() => {
                  if (!applyTarget || !applyReason) {
                    showToast('请填写所有的公开说明与备注', 'error');
                    return;
                  }
                  if (applyPractice) {
                    setPractices(practices.map(p => p.id === applyPractice.id ? { ...p, auditStatus: '待审核' } : p));
                  }
                  showToast('申请提交成功，已进入待审核队列');
                  setIsApplyModalOpen(false);
                }} 
                className="bg-[#fa541c] hover:bg-[#e84a15] text-white font-bold h-10 px-8 rounded-full shadow-sm text-[13px]"
              >
                提交申请
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
