import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Search, ChevronRight, ChevronDown, ChevronLeft, Play, Plus, ArrowLeft, ArrowRight, 
  Terminal, Code, Settings, Rocket, BookOpen, Clock, User, FileCode, CheckCircle2, 
  Bot, Send, Paperclip, LayoutDashboard, Database, Activity, Cpu, PlayCircle, FileText,
  History, Calendar, Info, Layers, Zap, Star, Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

export default function UserPractices() {
  const navigate = useNavigate();
  const [view, setView] = useState<'list' | 'detail'>('list');
  const [selectedPractice, setSelectedPractice] = useState<any>(null);

  const [selectedTech, setSelectedTech] = useState("全部");
  const [selectedScenario, setSelectedScenario] = useState("全部");
  const [sortBy, setSortBy] = useState("最新");
  const [searchQuery, setSearchQuery] = useState("");

  const [builderInput, setBuilderInput] = useState("");

  const techTypes = ["全部", "数据处理", "模型训练", "可视化", "对话交互", "代码开发", "图像生成"];
  const scenarios = ["全部", "课程辅助", "项目开发", "考试测评", "内容创作", "日常办公"];
  const sortOptions = ["最新", "最热", "使用次数最多"];

  const practices = [
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
      skills: ["文档解析能力", "PPT排版引擎", "图文排版大模型"]
    },
    {
      id: 2,
      title: "Python 爬虫数据清洗实战",
      description: "提供一套完整的Python数据清洗模板代码，包含缺失值处理、异常值检测、数据标准化等功能，适合数据分析相关课程作业。",
      techTags: ["数据处理", "代码开发"],
      scenarioTags: ["课程辅助", "项目开发"],
      usageCount: 8200,
      image: "https://picsum.photos/seed/data/400/225",
      author: "DataMaster",
      date: "2025-03-18",
      version: "V1.0.5",
      workflow: ["目标抓取", "动态加载处理", "反爬突破", "清洗规则配置", "质量校验", "数据存储"],
      summary: "针对复杂网页和非结构化数据，提供全自动化的沉浸式爬虫清洗工作流。",
      skills: ["BeautifulSoup解析", "Selenium自动化", "Pandas预处理"]
    },
    {
      id: 3,
      title: "YOLOv8 目标检测模型微调",
      description: "详细记录了如何使用自定义数据集对YOLOv8模型进行微调训练的完整流程，适合计算机视觉方向的毕业设计或实战项目。",
      techTags: ["模型训练", "可视化"],
      scenarioTags: ["项目开发"],
      usageCount: 5600,
      image: "https://picsum.photos/seed/yolo/400/225",
      author: "CV_Expert",
      date: "2025-03-15",
      version: "V3.2.0",
      workflow: ["数据标注", "格式转换", "超参调优", "环境编译", "断点训练", "模型推理"],
      summary: "快速实现在任意私有数据集上的 YOLOv8 训练与微调，自动管理GPU资源和训练状态。",
      skills: ["数据增强", "ONNX导出", "可视化验证"]
    },
    {
      id: 4,
      title: "基于 RAG 的智能问答系统",
      description: "结合LangChain和向量数据库，构建本地知识库问答系统。适合自然语言处理课程大作业或企业内部知识库搭建。",
      techTags: ["对话交互", "代码开发"],
      scenarioTags: ["项目开发", "课程辅助"],
      usageCount: 15300,
      image: "https://picsum.photos/seed/rag/400/225",
      author: "LLM_Builder",
      date: "2025-03-10",
      version: "V1.8.8",
      workflow: ["文档切片", "向量化编排", "近似搜索", "上下文注入", "提示词过滤", "回答生成"],
      summary: "企业级 RAG 问答管线搭建模板，降低了幻觉问题，增强了模型的信息准确性。",
      skills: ["向量数据库", "嵌入模型选择", "LangChain框架"]
    }
  ];

  const filteredPractices = practices
    .filter(p => selectedTech === "全部" || p.techTags.includes(selectedTech))
    .filter(p => selectedScenario === "全部" || p.scenarioTags.includes(selectedScenario))
    .filter(p => p.title.toLowerCase().includes(searchQuery.toLowerCase()) || p.description.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === "最新") return new Date(b.date).getTime() - new Date(a.date).getTime();
      if (sortBy === "最热" || sortBy === "使用次数最多") return b.usageCount - a.usageCount;
      return 0;
    });

  const formatUsageCount = (count: number) => {
    return count >= 1000 ? (count / 1000).toFixed(1) + 'k' : count.toString();
  };

  const handlePracticeClick = (practice: any) => {
    setSelectedPractice(practice);
    setView('detail');
  };

  // --- 1. LIST VIEW ---
  const renderListView = () => (
    <div className="flex flex-col h-full relative overflow-y-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-neutral-title">最佳实践</h1>
          <p className="text-neutral-body text-[14px] mt-1 font-medium">发现、应用、或构建高效的 AI 实战场景与解决方案</p>
        </div>
        <button 
          onClick={() => navigate('/skill-builder')}
          className="mt-4 md:mt-0 flex items-center gap-2 bg-[#fa541c] hover:bg-[#ff7a45] text-white px-5 py-2.5 rounded-[8px] font-medium transition-all text-[14px] shadow-sm"
        >
          <Plus className="w-4 h-4" />
          创建项目
        </button>
      </div>

      {/* Filters (1.3, 1.4) */}
      <div className="flex flex-col gap-4 mb-8">
        <div className="flex items-start gap-4">
          <span className="text-[14px] text-neutral-body font-medium whitespace-nowrap mt-1.5 w-20 flex items-center gap-1.5">技术类型：</span>
          <div className="flex flex-wrap gap-2">
            {techTypes.map((tech, i) => (
              <button 
                key={i}
                onClick={() => setSelectedTech(tech)}
                className={cn(
                  "px-4 py-1.5 rounded-full text-[13px] transition-colors",
                  selectedTech === tech 
                    ? "bg-[#fa541c] text-white" 
                    : "bg-white border border-neutral-border text-neutral-body hover:text-[#fa541c] hover:border-[#fa541c]"
                )}
              >
                {tech}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-start gap-4">
          <span className="text-[14px] text-neutral-body font-medium whitespace-nowrap mt-1.5 w-20 flex items-center gap-1.5">业务场景：</span>
          <div className="flex flex-wrap gap-2">
            {scenarios.map((scenario, i) => (
              <button 
                key={i}
                onClick={() => setSelectedScenario(scenario)}
                className={cn(
                  "px-4 py-1.5 rounded-full text-[13px] transition-colors",
                  selectedScenario === scenario 
                    ? "bg-[#fa541c] text-white" 
                    : "bg-white border border-neutral-border text-neutral-body hover:text-[#fa541c] hover:border-[#fa541c]"
                )}
              >
                {scenario}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Search & Sort (1.5) */}
      <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-4">
        <div className="flex items-center bg-white rounded-full p-1 border border-neutral-border/50 shadow-sm">
          {sortOptions.map((sort) => (
            <button 
              key={sort}
              onClick={() => setSortBy(sort)}
              className={cn(
                "px-6 py-1.5 rounded-full text-[14px] transition-all font-medium",
                sortBy === sort 
                  ? "bg-neutral-title text-white shadow-md" 
                  : "text-neutral-body hover:text-neutral-title hover:bg-neutral-bg/50"
              )}
            >
              {sort}
            </button>
          ))}
        </div>
        
        <div className="relative w-full sm:w-80 group">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-caption group-focus-within:text-[#fa541c] transition-colors" />
          <Input 
            placeholder="按最佳实践名称或描述搜索..." 
            className="pl-10 h-11 text-[14px] rounded-full border-neutral-border/50 bg-white focus-visible:ring-[#fa541c]/20 focus-visible:border-[#fa541c] shadow-sm transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Grid List (1.1, 1.2) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredPractices.map((practice, i) => (
          <div 
            key={i} 
            onClick={() => handlePracticeClick(practice)}
            className="bg-white rounded-[16px] p-5 border border-neutral-border shadow-sm hover:shadow-md transition-all hover:-translate-y-1 group flex flex-col cursor-pointer"
          >
            {/* Header: Icon and Title */}
            <div className="flex items-center gap-3 mb-3">
              <div className="w-11 h-11 rounded-[12px] overflow-hidden shrink-0 border border-neutral-border/60 shadow-sm">
                <img 
                  src={practice.image} 
                  alt={practice.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <h3 className="text-[16px] font-bold text-neutral-title line-clamp-1 group-hover:text-[#fa541c] transition-colors">
                {practice.title}
              </h3>
            </div>
            
            {/* Description */}
            <p className="text-[13px] text-neutral-caption mb-4 line-clamp-2 leading-relaxed flex-1">
              {practice.description}
            </p>
            
            {/* Tags (kept to preserve data but styled unobtrusively) */}
            <div className="flex items-center gap-1.5 flex-wrap mb-4">
              {practice.techTags.slice(0, 1).map((tag: string, idx: number) => (
                <span key={`tech-${idx}`} className="px-2 py-0.5 bg-neutral-bg text-neutral-body text-[11px] rounded-md">
                  {tag}
                </span>
              ))}
              {practice.scenarioTags.slice(0, 1).map((tag: string, idx: number) => (
                <span key={`scene-${idx}`} className="px-2 py-0.5 bg-neutral-bg text-neutral-body text-[11px] rounded-md">
                  {tag}
                </span>
              ))}
            </div>
            
            {/* Footer */}
            <div className="flex items-center justify-between text-[13px] font-medium pt-1 mt-auto">
              <div className="flex items-center text-neutral-title">
                {practice.usageCount ? (
                  <span className="font-bold flex items-center gap-1">
                    <Activity className="w-3.5 h-3.5 text-neutral-caption" />
                    {formatUsageCount(practice.usageCount)} <span className="text-[12px] font-normal text-neutral-caption">次调用</span>
                  </span>
                ) : (
                  <span>免费</span>
                )}
              </div>
              <span className="text-neutral-caption group-hover:text-neutral-body transition-colors">@{practice.author}</span>
            </div>
          </div>
        ))}
      </div>
      
      {/* Pagination (1.6) */}
      <div className="mt-8 flex items-center justify-between">
        <div className="flex items-center gap-1">
          <button className="w-8 h-8 flex items-center justify-center rounded-[4px] border border-neutral-border text-neutral-caption hover:text-[#fa541c] hover:border-[#fa541c] transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button className="w-8 h-8 flex items-center justify-center rounded-[4px] bg-[#fa541c] text-white font-medium">1</button>
          <button className="w-8 h-8 flex items-center justify-center rounded-[4px] border border-neutral-border text-neutral-body hover:text-[#fa541c] hover:border-[#fa541c] transition-colors">2</button>
          <button className="w-8 h-8 flex items-center justify-center rounded-[4px] border border-neutral-border text-neutral-body hover:text-[#fa541c] hover:border-[#fa541c] transition-colors">3</button>
          <span className="px-2 text-neutral-caption">...</span>
          <button className="w-8 h-8 flex items-center justify-center rounded-[4px] border border-neutral-border text-neutral-body hover:text-[#fa541c] hover:border-[#fa541c] transition-colors">
            <ChevronRight className="w-4 h-4 ml-0.5" />
          </button>
        </div>
        
        <div className="flex items-center gap-4 text-[13px] text-neutral-body">
          <div className="flex items-center gap-2">
            <span>每页</span>
            <button className="flex items-center gap-1 px-2 py-1 border border-neutral-border rounded-[4px] hover:border-[#fa541c] transition-colors bg-white">
              20 <ChevronDown className="w-3 h-3" />
            </button>
            <span>条</span>
          </div>
          <span>共 {practices.length} 条记录</span>
        </div>
      </div>
    </div>
  );

  // --- 2. DETAIL VIEW (1.8 最佳实践详情页) ---
  const renderDetailView = () => {
    if (!selectedPractice) return null;
    return (
      <div className="flex flex-col h-full overflow-y-auto">
        {/* Detail Header */}
        <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-xl border-b border-neutral-border/40 px-6 py-4 flex items-center justify-between">
          <button 
            onClick={() => setView('list')}
            className="flex items-center gap-2 text-neutral-body hover:text-[#fa541c] transition-colors font-medium text-[15px]"
          >
            <ArrowLeft className="w-5 h-5" /> 返回列表
          </button>
          <div className="flex items-center gap-3">
             <button className="px-4 py-2 rounded-lg text-neutral-body font-medium hover:bg-neutral-bg transition-colors flex items-center gap-2 text-[14px]">
               <FileText className="w-4 h-4" /> 查看文档
             </button>
             <button className="bg-gradient-to-r from-[#fa541c] to-[#ff7a45] text-white px-6 py-2 rounded-lg font-bold shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40 hover:-translate-y-0.5 transition-all flex items-center gap-2">
              <Rocket className="w-4 h-4" /> 使用此最佳实践
            </button>
          </div>
        </div>

        <div className="p-6 lg:p-10 max-w-[1400px] mx-auto w-full">
          {/* Top Info Area (顶部信息区) */}
          <div className="bg-white rounded-2xl p-8 mb-8 shadow-sm border border-neutral-border/50">
            <div className="flex items-start justify-between gap-8 mb-8">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <h1 className="text-3xl font-extrabold text-neutral-title">{selectedPractice.title}</h1>
                  <span className="bg-blue-50 text-blue-600 px-2.5 py-0.5 rounded text-[12px] font-bold border border-blue-100">官方认证</span>
                </div>
                <p className="text-neutral-body text-[16px] leading-relaxed max-w-4xl">
                  <span className="font-bold text-neutral-title mr-2">核心摘要摘要:</span> 
                  {selectedPractice.summary} {selectedPractice.description}
                </p>
              </div>
              <div className="w-[300px] aspect-video rounded-xl overflow-hidden shadow-inner shrink-0 hidden lg:block">
                 <img src={selectedPractice.image} className="w-full h-full object-cover" alt="cover"/>
              </div>
            </div>

            {/* Workflow Area */}
            <div className="bg-neutral-bg/50 rounded-xl p-5 border border-dashed border-neutral-border">
              <h3 className="text-[14px] font-bold text-neutral-title mb-4 flex items-center gap-2">
                <WorkflowIcon className="w-4 h-4 text-[#fa541c]" /> 工作流说明
              </h3>
              <div className="flex items-center flex-wrap gap-y-4">
                {selectedPractice.workflow.map((step: string, index: number) => (
                  <React.Fragment key={index}>
                    <div className="bg-white border border-neutral-border px-4 py-2 rounded-lg text-[13px] font-medium text-neutral-title shadow-sm flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-[#fa541c]/10 text-[#fa541c] flex items-center justify-center text-[10px] font-bold">{index + 1}</div>
                      {step}
                    </div>
                    {index < selectedPractice.workflow.length - 1 && (
                      <div className="px-3 text-neutral-caption flex items-center"><ArrowRight className="w-4 h-4" /></div>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Main Content (左侧主内容区) */}
            <div className="flex-1 flex flex-col gap-8">
              {/* Scene Markdown Section */}
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-neutral-border/50">
                <h2 className="text-xl font-bold text-neutral-title mb-6 border-b border-neutral-border/60 pb-4 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-indigo-500" /> 场景介绍 (Markdown)
                </h2>
                <div className="prose prose-sm md:prose-base max-w-none text-neutral-body">
                  <h3 className="text-neutral-title font-bold text-[18px]">1. When to Use This Skill</h3>
                  <p>
                    当您面临 {selectedPractice.scenarioTags.join('、')} 等情况，或者需要大量 {selectedPractice.techTags.join('、')} 相关工作时，此实践将帮助您节省极大的时间成本。
                  </p>
                  <h3 className="text-neutral-title font-bold text-[18px] mt-6">2. 核心优势</h3>
                  <ul className="list-disc pl-5 mt-2 space-y-1">
                    <li>完整预配的运行环境，开箱即用。</li>
                    <li>内置了多轮提词优化方案，提升生成质量。</li>
                    <li>标准化的数据输入输出接口，兼容性强。</li>
                  </ul>
                  <div className="bg-neutral-bg rounded-lg p-4 mt-6 border border-neutral-border text-[13px] font-mono whitespace-pre-wrap">
                    $ 示例运行代码 / 环境准备{'\n'}
                    npm install @practice/core{'\n'}
                    practice-cli init --template {selectedPractice.id}
                  </div>
                </div>
              </div>

              {/* Contained Skills List */}
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-neutral-border/50">
                <h2 className="text-xl font-bold text-neutral-title mb-6 flex items-center gap-2">
                  <BoxIcon className="w-5 h-5 text-emerald-500" /> 包含的子技能 (Skill)
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedPractice.skills.map((skill: string, idx: number) => (
                    <div key={idx} className="border border-neutral-border rounded-xl p-4 flex items-center justify-between hover:border-[#fa541c] hover:shadow-md transition-all cursor-pointer group">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                          <Bot className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="text-[15px] font-bold text-neutral-title group-hover:text-[#fa541c] transition-colors">{skill}</div>
                          <div className="text-[12px] text-neutral-caption">内置自动化处理工具</div>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-neutral-caption group-hover:text-[#fa541c]" />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Stats Sidebar (右侧统计区) */}
            <div className="w-full lg:w-[320px] shrink-0 flex flex-col gap-6">
              {/* Stats Card */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-border/50">
                <h3 className="text-[16px] font-bold text-neutral-title mb-5 flex items-center gap-2">
                  <History className="w-4 h-4 text-[#fa541c]" /> 使用数据
                </h3>
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between border-b border-neutral-border/30 pb-3">
                    <span className="text-[14px] text-neutral-body">累计使用次数</span>
                    <span className="text-[16px] font-bold text-neutral-title">{selectedPractice.usageCount.toLocaleString()} 次</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-neutral-border/30 pb-3">
                    <span className="text-[14px] text-neutral-body">月活调用量</span>
                    <span className="text-[16px] font-bold text-neutral-title">3,241 次</span>
                  </div>
                  <div className="flex items-center justify-between pb-1">
                    <span className="text-[14px] text-neutral-body">综合评分</span>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-[16px] font-bold text-neutral-title">4.9 / 5.0</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Version & Dev Card */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-border/50">
                <h3 className="text-[16px] font-bold text-neutral-title mb-5 flex items-center gap-2">
                  <Info className="w-4 h-4 text-blue-500" /> 元信息
                </h3>
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1 border-b border-neutral-border/30 pb-3">
                    <span className="text-[12px] text-neutral-caption">版本信息</span>
                    <span className="text-[14px] font-semibold text-neutral-title flex items-center justify-between">
                      {selectedPractice.version}
                      <span className="text-[12px] font-normal text-blue-500 cursor-pointer hover:underline">更新记录</span>
                    </span>
                  </div>
                  <div className="flex flex-col gap-1 border-b border-neutral-border/30 pb-3">
                    <span className="text-[12px] text-neutral-caption">创建人 / 开发者</span>
                    <div className="flex items-center gap-2 mt-1">
                       <div className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-[10px] font-bold shadow-sm">
                        {selectedPractice.author.charAt(0)}
                      </div>
                      <span className="text-[14px] font-semibold text-neutral-title">{selectedPractice.author}</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[12px] text-neutral-caption">首次上线时间 & 更新时间</span>
                    <span className="text-[14px] font-medium text-neutral-title mt-1">{selectedPractice.date}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // --- 3. BUILDER VIEW (1.7 创建新项目入口 - Skill Builder 交互区) ---
  const renderBuilderView = () => (
    <div className="flex flex-col h-full bg-[#1e1e1e] text-slate-300 font-sans">
      {/* Builder Header */}
      <div className="h-[60px] border-b border-[#333] shrink-0 px-4 md:px-6 flex items-center justify-between bg-[#181818]">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setView('list')}
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> 放弃并返回
          </button>
          <div className="w-[1px] h-4 bg-[#444]"></div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-yellow-400" />
            <h1 className="text-[15px] font-bold text-white tracking-wide">Skill Builder Agent 协同开发区</h1>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-1.5 rounded bg-[#2a2a2a] hover:bg-[#3a3a3a] text-[13px] font-medium transition-colors border border-[#444] text-white flex items-center gap-2">
            <PlayCircle className="w-4 h-4" /> 预览
          </button>
          <button className="bg-[#fa541c] hover:bg-[#ff7a45] text-white px-5 py-1.5 rounded font-bold transition-colors text-[13px] shadow-lg shadow-orange-500/20 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" /> 部署上线
          </button>
        </div>
      </div>

      <div className="flex flex-1 min-h-0">
        {/* Left Side: Agent Conversation Zone */}
        <div className="w-[35%] lg:w-[400px] border-r border-[#333] flex flex-col bg-[#111] shrink-0">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-5 pb-8 flex flex-col gap-6 custom-scrollbar">
            {/* Agent Bubble */}
            <div className="flex gap-3 max-w-[90%]">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-orange-400 to-[#fa541c] flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[12px] font-bold text-slate-400 ml-1">Builder Agent</span>
                <div className="bg-[#222] border border-[#333] rounded-2xl rounded-tl-sm p-4 text-[14px] leading-relaxed text-slate-200">
                  <p className="mb-2">你好！我是 Skill Builder Agent。我可以帮你创建、修改或转换最佳实践项目。</p>
                  <p>请在下方使用自然语言描述你的需求。例如：<br/><span className="text-emerald-400 font-mono">"帮我创建一个能够批量处理 Excel 薪资表的数据清洗应用。"</span></p>
                </div>
              </div>
            </div>
            {/* User Bubble (mock) */}
            <div className="flex gap-3 w-full justify-end">
              <div className="flex flex-col gap-1 items-end max-w-[85%]">
                <span className="text-[12px] font-bold text-slate-400 mr-1">我</span>
                <div className="bg-[#fa541c]/10 border border-[#fa541c]/30 rounded-2xl rounded-tr-sm p-3 text-[14px] leading-relaxed text-slate-100">
                  <p>帮我创建一个可以自动给 Markdown 文本生成思维导图代码的实践技能。</p>
                </div>
              </div>
              <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center shrink-0">
                <User className="w-4 h-4 text-white" />
              </div>
            </div>
            {/* Agent generating state */}
            <div className="flex gap-3 max-w-[90%] mt-2">
               <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-orange-400 to-[#fa541c] flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="flex items-center gap-2 bg-[#222] border border-[#333] rounded-2xl rounded-tl-sm px-4 py-3 text-[13px] text-slate-300">
                <div className="flex gap-1">
                   <div className="w-1.5 h-1.5 bg-[#fa541c] rounded-full animate-bounce"></div>
                   <div className="w-1.5 h-1.5 bg-[#fa541c] rounded-full animate-bounce" style={{animationDelay: "0.2s"}}></div>
                   <div className="w-1.5 h-1.5 bg-[#fa541c] rounded-full animate-bounce" style={{animationDelay: "0.4s"}}></div>
                </div>
                <span className="ml-2 font-mono text-emerald-400">技能正在生成中，请关注右侧代码与终端变化...</span>
              </div>
            </div>
          </div>
          
          {/* Input Area */}
          <div className="p-4 bg-[#181818] border-t border-[#333]">
            <div className="mb-2 flex gap-2">
               <button className="text-[11px] bg-[#222] hover:bg-[#333] border border-[#444] rounded px-2 py-1 transition-colors">/ 创建新Skill</button>
               <button className="text-[11px] bg-[#222] hover:bg-[#333] border border-[#444] rounded px-2 py-1 transition-colors">/ 切换为手动模式</button>
            </div>
            <div className="relative">
              <textarea 
                className="w-full bg-[#111] border border-[#444] rounded-lg px-4 py-3 pr-12 text-[14px] text-white resize-none focus:outline-none focus:border-[#fa541c] transition-colors h-[100px]"
                placeholder="描述你的需求，支持附件上传..."
                value={builderInput}
                onChange={(e) => setBuilderInput(e.target.value)}
              />
              <div className="absolute right-3 bottom-4 flex gap-2">
                <button className="p-1.5 text-slate-400 hover:text-white transition-colors">
                  <Paperclip className="w-4 h-4" />
                </button>
                <button className="p-1.5 bg-[#fa541c] hover:bg-[#ff7a45] rounded-md text-white transition-colors">
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Dev Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Editor Header */}
          <div className="h-10 bg-[#1e1e1e] border-b border-[#333] flex items-center justify-between px-2 shrink-0">
            <div className="flex items-center h-full">
               <div className="px-4 py-2 border-r border-[#333] h-full flex items-center gap-2 bg-[#111] text-[13px] border-t-2 border-t-[#fa541c] text-white font-mono cursor-pointer">
                  <FileCode className="w-4 h-4 text-emerald-400" /> main.py
               </div>
               <div className="px-4 py-2 border-r border-[#333] h-full flex items-center gap-2 text-slate-400 hover:bg-[#222] text-[13px] font-mono cursor-pointer">
                  <Settings className="w-4 h-4" /> config.yaml
               </div>
               <button className="ml-2 w-7 h-7 flex items-center justify-center hover:bg-[#333] rounded text-slate-400"><Plus className="w-4 h-4"/></button>
            </div>
            <div className="flex gap-2 mr-2">
               <button className="p-1 hover:bg-[#333] rounded text-slate-400"><Terminal className="w-4 h-4" /></button>
               <button className="p-1 hover:bg-[#333] rounded text-slate-400"><Code className="w-4 h-4" /></button>
            </div>
          </div>

          {/* Editor Content Area */}
          <div className="flex-1 overflow-auto bg-[#1e1e1e] p-4 font-mono text-[13px] leading-relaxed flex">
             <div className="w-8 shrink-0 text-slate-600 space-y-1 select-none flex flex-col items-end pr-3 border-r border-[#333]">
                {Array.from({length: 20}).map((_, i) => <div key={i}>{i+1}</div>)}
             </div>
             <div className="pl-4 space-y-1 text-slate-300">
                <div><span className="text-pink-500">import</span> <span className="text-blue-300">os</span></div>
                <div><span className="text-pink-500">import</span> <span className="text-blue-300">json</span></div>
                <div><span className="text-pink-500">from</span> langchain <span className="text-pink-500">import</span> LLMChain</div>
                <div className="h-2"></div>
                <div><span className="text-pink-500">def</span> <span className="text-yellow-200">generate_mindmap</span>(text: str):</div>
                <div>&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-slate-500">"""生成 Markdown 转思维导图的核心逻辑"""</span></div>
                <div>&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-pink-500">pass</span></div>
             </div>
          </div>

          {/* Terminal / Status Panel */}
          <div className="h-[200px] bg-[#111] border-t border-[#333] shrink-0 flex flex-col">
            <div className="h-8 border-b border-[#333] flex items-center px-4 justify-between bg-[#181818]">
               <div className="flex gap-4 text-[12px] font-mono">
                  <span className="text-white border-b-2 border-[#fa541c] pb-1.5 uppercase font-bold tracking-wider">终端 (Terminal)</span>
                  <span className="text-slate-500 hover:text-slate-300 cursor-pointer pb-1.5 uppercase tracking-wider">依赖管理</span>
               </div>
               <div className="flex items-center gap-3">
                  {/* Storage Status */}
                  <div className="flex items-center gap-2 text-[11px] font-mono">
                    <span className="text-slate-400">存储: 2.1GB / 10GB</span>
                    <div className="w-24 h-1.5 bg-[#333] rounded-full overflow-hidden">
                       <div className="w-[21%] h-full bg-emerald-500"></div>
                    </div>
                  </div>
               </div>
            </div>
            <div className="flex-1 p-3 font-mono text-[12px] text-slate-300 overflow-y-auto space-y-1">
               <div className="text-emerald-400">$ practice-env start --dev</div>
               <div>[INFO] Initializing virtual environment...</div>
               <div>[INFO] Installing requirements.txt (23/23)</div>
               <div>[SUCCESS] Environment setup complete. Server running at http://localhost:8080</div>
               <div className="flex items-center gap-2 text-slate-500">
                  <span>█</span> <span className="animate-pulse">_</span>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-full relative overflow-hidden">
      {view === 'list' && renderListView()}
      {view === 'detail' && renderDetailView()}
    </div>
  );
}

// Icon helper components
function WorkflowIcon(props: any) {
  return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect width="8" height="8" x="3" y="3" rx="2" /><path d="M7 11v4a2 2 0 0 0 2 2h4" /><rect width="8" height="8" x="13" y="13" rx="2" /></svg>;
}

function BoxIcon(props: any) {
  return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" /><path d="m3.3 7 8.7 5 8.7-5" /><path d="M12 22V12" /></svg>;
}
