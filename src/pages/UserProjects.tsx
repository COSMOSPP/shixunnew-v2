import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Search, 
  ChevronRight, 
  ChevronDown, 
  ChevronLeft,
  Users,
  Star,
  Monitor,
  Tag,
  Plus,
  Github,
  X,
  Cpu,
  BookOpen,
  Trash2,
  Upload,
  Check,
  Loader2,
  Info
} from "lucide-react";
import { cn } from "@/lib/utils";
import ProjectIDE from "@/components/ProjectIDE";
import ProjectDetail from "@/components/ProjectDetail";

interface EnvConfig {
  id: string;
  resourcePool: '天翼云资源池1' | '上海园区资源池';
  type: '容器' | '虚机';
  // 容器字段
  sourceFile?: string; // 项目源码文件
  cpuCores?: string;
  memoryGB?: string;
  gpu?: {
    power: string; // 算力
    vram: string;  // 显存
    count: string; // 卡数
  };
  image: string;
  envVariables?: { key: string; value: string }[];
  startCommand?: string;
  // 虚机字段
  vmSpecType?: 'custom' | 'spec'; // 自定义 or 选择规格
  selectedSpec?: string;
  storage?: {
    type: string;
    systemDisk: string;
    dataDisk: string;
  };
  network?: {
    vpc: string;
    subnet: string;
  };
  vncType?: 'caddyVnc' | 'noVnc';
}

const CONTAINER_IMAGES = {
  '天翼云资源池1': [
    'ctyun-python:3.10-slim-cpu',
    'ctyun-pytorch:2.1.0-cuda12.1-gpu',
    'ctyun-tensorflow:2.14.0-cuda11.8-gpu',
    'ctyun-openjdk:17-jdk-alpine',
    'ctyun-node:20-alpine'
  ],
  '上海园区资源池': [
    'sh-python:3.11-slim',
    'sh-pytorch:2.2.0-cuda12.1-gpu',
    'sh-tensorflow:2.15.0-cuda12.2-gpu',
    'sh-openjdk:11-jdk-alpine',
    'sh-node:18-alpine'
  ]
};

const VM_IMAGES = {
  '天翼云资源池1': [
    'ctyun-ubuntu-22.04-server-x86_64.qcow2',
    'ctyun-centos-7.9-x86_64.qcow2',
    'ctyun-debian-11.5-x86_64.qcow2',
    'ctyun-windows-server-2022-standard.qcow2'
  ],
  '上海园区资源池': [
    'sh-ubuntu-20.04-server-x86_64.img',
    'sh-centos-8.4-x86_64.img',
    'sh-debian-12.0-x86_64.img',
    'sh-windows-10-enterprise-x64.img'
  ]
};

const VM_SPECS = [
  { value: 'ecs.g6.large', label: '通用计算型 g6.large | 2核 8GB | 无GPU' },
  { value: 'ecs.g6.xlarge', label: '通用计算型 g6.xlarge | 4核 16GB | 无GPU' },
  { value: 'ecs.gn6i-c4g1.xlarge', label: 'GPU计算型 gn6i | 4核 16GB | T4 * 1 (16GB)' },
  { value: 'ecs.gn7i-c8g1.2xlarge', label: 'GPU计算型 gn7i | 8核 32GB | A10G * 1 (24GB)' }
];


export default function UserProjects() {
  const [isEditingProject, setIsEditingProject] = useState(false);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const [currentBanner, setCurrentBanner] = useState(0);

  // Default covers for premium look
  const defaultCovers = [
    '/shixunnew-v2/images/covers/microsoft_tech_ai_1779333317936.png',
    '/shixunnew-v2/images/covers/microsoft_tech_data_1779333332856.png',
    '/shixunnew-v2/images/covers/microsoft_tech_cloud_1779333396845.png',
    '/shixunnew-v2/images/covers/microsoft_tech_cyber_1779333412582.png',
    '/shixunnew-v2/images/covers/microsoft_tech_dev_1779333430898.png',
    '/shixunnew-v2/images/covers/microsoft_tech_ml_1779333449102.png',
  ];

  // Toast notifications
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Form setup wizard active tab inside Modal
  const [activeFormTab, setActiveFormTab] = useState<'basic' | 'env'>('basic');

  // Form states
  const [formName, setFormName] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formDifficulty, setFormDifficulty] = useState<'初级' | '中级' | '高级'>('中级');
  const [selectedCover, setSelectedCover] = useState(defaultCovers[0]);
  const [formTags, setFormTags] = useState<string[]>([]);
  const [newTagInput, setNewTagInput] = useState('');
  const [formEnvironments, setFormEnvironments] = useState<EnvConfig[]>([]);

  // Initial projects data state
  const [projectsList, setProjectsList] = useState([
    {
      title: "图像分类项目",
      desc: "基于CNN的图像分类实战，涵盖数据预处理、模型构建与训练。",
      image: "https://picsum.photos/seed/proj1/400/225",
      participants: "1,234",
      favorites: 342,
      innovator: "李明",
      type: "平台项目",
      difficulty: "中级",
      tags: ["AI", "CV"],
      status: "continue"
    },
    {
      title: "文本情感分析项目",
      desc: "NLP实战：使用深度学习模型对海量文本进行情感倾向分析。",
      image: "https://picsum.photos/seed/proj2/400/225",
      participants: "987",
      favorites: 156,
      innovator: "张华",
      type: "租户项目",
      difficulty: "中高级",
      tags: ["AI", "NLP"],
      status: "start"
    },
    {
      title: "电商数据可视化大屏",
      desc: "使用 ECharts 和 React 构建实时动态的电商销售数据大屏。",
      image: "https://picsum.photos/seed/proj3/400/225",
      participants: "2,156",
      favorites: 521,
      innovator: "王强",
      type: "个人项目",
      difficulty: "初级",
      tags: ["数据分析", "可视化"],
      status: "start"
    },
    {
      title: "目标检测系统开发",
      desc: "基于 YOLOv8 的实时目标检测系统，支持自定义数据集训练。",
      image: "https://picsum.photos/seed/proj4/400/225",
      participants: "856",
      favorites: 189,
      innovator: "赵雪",
      type: "平台项目",
      difficulty: "高级",
      tags: ["AI", "CV"],
      status: "continue"
    },
    {
      title: "用户行为数据清洗",
      desc: "使用 Pandas 处理千万级用户行为日志，提取有效特征。",
      image: "https://picsum.photos/seed/proj5/400/225",
      participants: "1,432",
      favorites: 275,
      innovator: "刘磊",
      type: "租户项目",
      difficulty: "中级",
      tags: ["数据分析", "数据清洗"],
      status: "start"
    },
    {
      title: "全栈博客系统开发",
      desc: "从零开始构建基于 Next.js 和 Node.js 的全栈博客平台。",
      image: "https://picsum.photos/seed/proj6/400/225",
      participants: "3,210",
      favorites: 890,
      innovator: "陈芳",
      type: "个人项目",
      difficulty: "中级",
      tags: ["Web开发", "全栈"],
      status: "start"
    },
    {
      title: "智能问答机器人",
      desc: "结合大语言模型API，开发具备上下文记忆的智能客服机器人。",
      image: "https://picsum.photos/seed/proj7/400/225",
      participants: "1,890",
      favorites: 432,
      innovator: "孙杰",
      type: "平台项目",
      difficulty: "中高级",
      tags: ["AI", "NLP"],
      status: "start"
    },
    {
      title: "房价预测机器学习模型",
      desc: "使用 Scikit-Learn 构建回归模型，预测城市二手房价格走势。",
      image: "https://picsum.photos/seed/proj8/400/225",
      participants: "2,450",
      favorites: 610,
      innovator: "周伟",
      type: "租户项目",
      difficulty: "初级",
      tags: ["数据分析", "机器学习"],
      status: "continue"
    }
  ]);

  const banners = [
    { title: "2026 AI 创新挑战赛", desc: "丰厚奖金池，等你来战！", color: "from-blue-600 to-indigo-800" },
    { title: "大模型前沿探索营", desc: "掌握最新 LLM 核心技术", color: "from-[#fa541c] to-[#d4380d]" },
    { title: "计算机视觉实战课", desc: "从入门到精通 CV", color: "from-emerald-600 to-teal-800" }
  ];

  useEffect(() => {
    if (isEditingProject) return;
    const interval = setInterval(() => {
       setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [isEditingProject]);

  const handleSave = () => {
    if (!formName.trim()) {
      showToast('请输入项目名称！');
      return;
    }

    const newProject: any = {
      title: formName,
      desc: formDesc,
      image: selectedCover,
      participants: "0",
      favorites: 0,
      innovator: "我",
      type: "个人项目",
      difficulty: formDifficulty,
      tags: formTags,
      status: "start",
      environments: formEnvironments
    };

    setProjectsList([newProject, ...projectsList]);
    showToast(`成功创建项目「${formName.slice(0, 10)}...」`);
    setShowNewProjectModal(false);
  };



  if (isEditingProject) {
    return <ProjectIDE onBack={() => setIsEditingProject(false)} />;
  }

  if (selectedProject) {
    return (
      <ProjectDetail 
        project={selectedProject} 
        onBack={() => setSelectedProject(null)} 
        onStart={() => {
          setSelectedProject(null);
          setIsEditingProject(true);
        }} 
      />
    );
  }

  return (
    <div className="flex flex-col bg-[#f5f6f8] relative">
      {/* Banner Carousel */}
      <div className="w-full h-40 mb-8 rounded-[12px] overflow-hidden relative group shrink-0 shadow-sm">
        {banners.map((banner, i) => (
          <div 
            key={i} 
            className={cn(
              "absolute inset-0 transition-opacity duration-1000 bg-gradient-to-r flex flex-col justify-center px-12",
              banner.color,
              currentBanner === i ? "opacity-100 z-10" : "opacity-0 z-0"
            )}
          >
            <h2 className="text-[28px] font-bold text-white mb-2">{banner.title}</h2>
            <p className="text-white/80 text-[15px]">{banner.desc}</p>
          </div>
        ))}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {banners.map((_, i) => (
             <div 
               key={i} 
               onClick={() => setCurrentBanner(i)}
               className={cn("w-2 h-2 rounded-full cursor-pointer transition-all", currentBanner === i ? "w-6 bg-white" : "bg-white/50")}
             ></div>
          ))}
        </div>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-neutral-title">全部项目</h1>
        </div>
        <Button 
          className="bg-[#fa541c] hover:bg-[#d4380d] text-white flex items-center gap-2 shadow-sm h-10 px-6 rounded-full"
          onClick={() => {
            setFormName('');
            setFormDesc('');
            setFormDifficulty('中级');
            setSelectedCover(defaultCovers[0]);
            setFormTags(['实战', 'Docker']);
            setFormEnvironments([
              {
                id: 'env-' + Date.now(),
                resourcePool: '天翼云资源池1',
                type: '容器',
                sourceFile: '',
                cpuCores: '2',
                memoryGB: '4',
                gpu: { power: '无', vram: '0', count: '0' },
                image: CONTAINER_IMAGES['天翼云资源池1'][0],
                envVariables: [],
                startCommand: 'python main.py'
              }
            ]);
            setActiveFormTab('basic');
            setShowNewProjectModal(true);
          }}
        >
          <Plus className="w-4 h-4" /> 新建项目
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 mb-8">
        <div className="flex items-start gap-4">
          <span className="text-[14px] text-neutral-body font-medium whitespace-nowrap mt-1.5 w-16">项目标签</span>
          <div className="flex flex-wrap gap-2">
            {["全部", "AI实战", "数据分析", "Web开发", "图像分类", "目标检测", "NLP应用", "数据清洗", "可视化", "机器学习", "前端开发", "后端开发"].map((tag, i) => (
              <button 
                key={i}
                className={cn(
                  "px-4 py-1.5 rounded-full text-[13px] transition-colors border",
                  i === 0 ? "bg-[#fa541c] text-white border-transparent" : "bg-white border-neutral-border text-neutral-body hover:text-[#fa541c] hover:border-[#fa541c]"
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
            placeholder="输入项目名称或描述搜索" 
            className="pl-9 h-10 text-[14px] rounded-full border-neutral-border bg-white focus-visible:ring-[#fa541c]" 
          />
        </div>
      </div>

      {/* Main Content Area */}
        <div className="flex-1 pr-2 pb-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {projectsList.map((project, i) => (
                <div 
                  key={i} 
                  onClick={() => setSelectedProject(project)}
                  className="bg-white rounded-[12px] overflow-hidden border border-neutral-border shadow-sm hover:shadow-md transition-all hover:-translate-y-1 group flex flex-col cursor-pointer"
                >
                  {/* Cover Image */}
                  <div className="relative aspect-video overflow-hidden bg-neutral-bg">
                    <img 
                      src={project.image} 
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  
                  {/* Content */}
                  <div className="p-4 flex flex-col flex-1">
                    <h3 className="text-[16px] font-bold text-neutral-title mb-2 line-clamp-1 group-hover:text-[#fa541c] transition-colors">
                      {project.title}
                    </h3>
                    
                    <p className="text-[13px] text-neutral-caption mb-3 line-clamp-1">
                      {project.desc}
                    </p>
                    
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      {project.tags.map((tag, idx) => (
                        <span key={idx} className="px-2 py-0.5 bg-[#f5f6f8] text-neutral-body text-[12px] rounded-[4px]">
                          {tag}
                        </span>
                      ))}
                    </div>
                    
                    <div className="text-[12px] text-neutral-body mb-4 flex items-center gap-3">
                       <span className="text-neutral-caption">创新者: <span className="font-medium text-neutral-body">{project.innovator}</span></span>
                    </div>
                    
                    <div className="mt-auto pt-3 border-t border-neutral-border flex items-center justify-between text-[12px] text-neutral-caption">
                      <div className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5" />
                        <span>{project.participants} 参与</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 text-[#faad14] fill-[#faad14]" />
                        <span className="text-[#faad14] font-medium">{project.favorites} 收藏</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
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
                <button className="w-8 h-8 flex items-center justify-center rounded-[4px] border border-neutral-border text-neutral-body hover:text-[#fa541c] hover:border-[#fa541c] transition-colors">4</button>
                <button className="w-8 h-8 flex items-center justify-center rounded-[4px] border border-neutral-border text-neutral-body hover:text-[#fa541c] hover:border-[#fa541c] transition-colors">5</button>
                <span className="px-2 text-neutral-caption">...</span>
                <button className="w-8 h-8 flex items-center justify-center rounded-[4px] border border-neutral-border text-neutral-body hover:text-[#fa541c] hover:border-[#fa541c] transition-colors">20</button>
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
                <span>共 234 个项目</span>
              </div>
            </div>
        </div>
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-[100] bg-neutral-900/95 text-white border border-neutral-800 px-5 py-3 rounded-xl shadow-2xl flex items-center gap-2.5 animate-slide-up text-xs font-semibold backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-[#fa541c] animate-pulse"></span>
          <span>{toastMessage}</span>
        </div>
      )}

      {showNewProjectModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-[680px] overflow-hidden border border-neutral-200 flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="p-5 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/50">
              <h2 className="text-[16px] font-bold text-neutral-900 flex items-center gap-2">
                <Plus className="w-5 h-5 text-[#fa541c]" /> 
                新建实战项目
              </h2>
              <button 
                onClick={() => setShowNewProjectModal(false)} 
                className="text-neutral-400 hover:text-neutral-700 hover:bg-neutral-200 p-1.5 rounded-full transition-colors border-0 bg-transparent cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Tab Headers for configurations */}
            <div className="flex border-b border-neutral-100 bg-neutral-50/20 text-[11px] font-bold select-none flex-shrink-0">
              {[
                { key: 'basic', label: '1. 基础信息', icon: BookOpen },
                { key: 'env', label: '2. 项目环境', icon: Cpu }
              ].map(tab => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setActiveFormTab(tab.key as any)}
                  className={cn(
                    "flex-1 py-3 text-center border-b-2 transition-all cursor-pointer flex items-center justify-center gap-1.5",
                    activeFormTab === tab.key 
                      ? "border-[#fa541c] text-[#fa541c] bg-white font-extrabold" 
                      : "border-transparent text-neutral-500 hover:text-neutral-800 hover:bg-neutral-100/40"
                  )}
                >
                  <tab.icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Modal Scrollable Content Forms */}
            <div className="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-5 bg-white text-xs">
              
              {/* TAB 1: BASIC INFORMATION */}
              {activeFormTab === 'basic' && (
                <div className="space-y-4 animate-fade-in">
                  <div className="space-y-2">
                    <label className="text-[13px] font-bold text-neutral-850 flex items-center gap-1">
                      <span className="text-[#fa541c] font-black">*</span> 项目名称
                    </label>
                    <input 
                      type="text"
                      placeholder="请输入实战项目标题"
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      className="w-full text-xs border border-neutral-200 rounded-lg px-4 py-2.5 focus:outline-none focus:border-[#fa541c] focus:ring-1 focus:ring-[#fa541c] text-neutral-855"
                    />
                  </div>

                  {/* Project Tags (项目标签) */}
                  <div className="space-y-2">
                    <label className="text-[13px] font-bold text-neutral-855 flex justify-between">
                      <span>🏷️ 项目标签</span>
                      <span className="text-[10px] text-neutral-400 font-normal">回车添加标签</span>
                    </label>
                    <div className="flex flex-wrap gap-2 border border-neutral-200 rounded-lg p-2.5 bg-neutral-50/10">
                      {formTags.map((tag, idx) => (
                        <span key={idx} className="px-2.5 py-0.5 bg-[#fff2e8] border border-[#ffbb96] text-[#fa541c] rounded-full text-xs font-bold flex items-center gap-1 shadow-sm transition-all">
                          {tag}
                          <button 
                            type="button"
                            onClick={() => setFormTags(formTags.filter(t => t !== tag))}
                            className="text-[#fa541c]/50 hover:text-red-500 rounded-full p-0.5 transition-colors cursor-pointer border-0 bg-transparent flex items-center justify-center"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                      <input 
                        type="text"
                        placeholder="+ 添加标签"
                        value={newTagInput}
                        onChange={(e) => setNewTagInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && newTagInput.trim()) {
                            e.preventDefault();
                            if (!formTags.includes(newTagInput.trim())) {
                              setFormTags([...formTags, newTagInput.trim()]);
                            }
                            setNewTagInput('');
                          }
                        }}
                        className="bg-transparent text-xs text-neutral-855 placeholder:text-neutral-400 focus:outline-none px-2 py-0.5 min-w-[100px]"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[13px] font-bold text-neutral-855 flex items-center gap-1">
                      <span className="text-[#fa541c] font-black">*</span> 难度级别
                    </label>
                    <div className="flex gap-4">
                      {[
                        { key: '初级', color: 'border-green-350 text-green-650 bg-green-50/15' },
                        { key: '中级', color: 'border-orange-350 text-[#fa541c] bg-orange-50/10' },
                        { key: '高级', color: 'border-red-350 text-red-650 bg-red-50/15' }
                      ].map(level => (
                        <label 
                          key={level.key}
                          onClick={() => setFormDifficulty(level.key as any)}
                          className={cn(
                            "flex-1 border py-2 rounded-xl text-center font-bold cursor-pointer transition-all select-none",
                            formDifficulty === level.key 
                              ? `${level.color} shadow-sm border-2` 
                              : "border-neutral-200 text-neutral-550 hover:bg-neutral-50"
                          )}
                        >
                          {level.key}
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[13px] font-bold text-neutral-855">项目说明描述</label>
                    <textarea 
                      placeholder="请简述该实战项目背景与核心技术目标描述"
                      value={formDesc}
                      onChange={(e) => setFormDesc(e.target.value)}
                      className="w-full min-h-[100px] border border-neutral-200 rounded-lg px-4 py-2.5 focus:outline-none focus:border-[#fa541c] resize-none leading-relaxed text-neutral-800"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[13px] font-bold text-neutral-855 flex items-center gap-1">
                      <span className="text-[#fa541c] font-black">*</span> 项目图片
                    </label>
                    <div className="grid grid-cols-3 gap-3 mt-1">
                      {defaultCovers.map((cover, idx) => (
                        <div 
                          key={idx}
                          onClick={() => setSelectedCover(cover)}
                          className={cn(
                            "h-20 rounded-lg overflow-hidden cursor-pointer border-2 transition-all relative",
                            selectedCover === cover ? "border-[#fa541c] shadow-md scale-[1.02]" : "border-transparent hover:border-[#fa541c]/50 hover:scale-[1.02]"
                          )}
                        >
                          <img src={cover} alt={`cover-${idx}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          {selectedCover === cover && (
                            <div className="absolute top-1.5 right-1.5 bg-[#fa541c] text-white rounded-full p-0.5 shadow-sm flex items-center justify-center">
                              <Check className="w-3 h-3" strokeWidth={3} />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: PROJECT ENVIRONMENT (MULTI-INSTANCE CONFIG) */}
              {activeFormTab === 'env' && (
                <div className="space-y-5 animate-fade-in">
                  <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
                    <div className="flex items-center gap-2">
                      <Cpu className="w-4 h-4 text-[#fa541c]" />
                      <span className="text-[13px] font-bold text-neutral-800">多实例环境配置 ({formEnvironments.length})</span>
                    </div>
                    <Button 
                      type="button"
                      onClick={() => {
                        const newEnv: EnvConfig = {
                          id: 'env-' + Date.now(),
                          resourcePool: '天翼云资源池1',
                          type: '容器',
                          sourceFile: '',
                          cpuCores: '2',
                          memoryGB: '4',
                          gpu: { power: '无', vram: '0', count: '0' },
                          image: CONTAINER_IMAGES['天翼云资源池1'][0],
                          envVariables: [],
                          startCommand: 'python main.py'
                        };
                        setFormEnvironments([...formEnvironments, newEnv]);
                        showToast('已添加新环境实例');
                      }}
                      className="bg-transparent hover:bg-orange-50 border border-[#fa541c] text-[#fa541c] hover:text-[#e84a15] rounded-lg px-3 py-1.5 h-8 text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" /> 添加环境实例
                    </Button>
                  </div>

                  {formEnvironments.length === 0 && (
                    <div className="border border-dashed border-neutral-200 rounded-xl p-10 text-center space-y-3 bg-neutral-50/20 flex flex-col items-center justify-center">
                      <Cpu className="w-8 h-8 text-neutral-300" />
                      <div>
                        <p className="text-xs font-bold text-neutral-600">暂无配置环境实例</p>
                        <p className="text-[10px] text-neutral-450 mt-1">请点击上方按钮添加至少一个环境配置</p>
                      </div>
                    </div>
                  )}

                  <div className="space-y-4">
                    {formEnvironments.map((env, idx) => (
                      <div key={env.id} className="border border-neutral-200 rounded-xl overflow-hidden bg-neutral-50/10 shadow-sm animate-slide-up">
                        {/* Card Header */}
                        <div className="px-4 py-2.5 bg-neutral-100/70 border-b border-neutral-200 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="w-5 h-5 rounded-full bg-orange-100 text-[#fa541c] text-[10px] font-black flex items-center justify-center">
                              {idx + 1}
                            </span>
                            <span className="text-[12px] font-bold text-neutral-800">
                              环境实例 #{idx + 1} - {env.type} ({env.resourcePool})
                            </span>
                          </div>
                          <button 
                            type="button"
                            onClick={() => {
                              setFormEnvironments(formEnvironments.filter(e => e.id !== env.id));
                              showToast('已删除环境实例');
                            }}
                            className="text-neutral-400 hover:text-red-500 hover:bg-red-50 p-1 rounded transition-colors border-0 bg-transparent cursor-pointer"
                            title="删除此环境"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Card Content */}
                        <div className="p-4 space-y-4 bg-white">
                          {/* Row 1: Resource Pool & Environment Type (Stacked vertically) */}
                          <div className="space-y-4">
                            <div className="space-y-1.5">
                              <label className="text-[11px] font-bold text-neutral-600">选择资源池</label>
                              <select
                                value={env.resourcePool}
                                onChange={(e) => {
                                  const updated = [...formEnvironments];
                                  const pool = e.target.value as any;
                                  updated[idx].resourcePool = pool;
                                  // Automatically switch to first image of new pool
                                  const images = updated[idx].type === '容器' ? CONTAINER_IMAGES[pool] : VM_IMAGES[pool];
                                  updated[idx].image = images[0];
                                  setFormEnvironments(updated);
                                }}
                                className="w-full text-xs border border-neutral-200 rounded-lg pl-3 pr-8 py-2 bg-white focus:outline-none focus:border-[#fa541c] cursor-pointer"
                              >
                                <option value="天翼云资源池1">天翼云资源池1</option>
                                <option value="上海园区资源池">上海园区资源池</option>
                              </select>
                            </div>

                            <div className="space-y-1.5">
                              <label className="text-[11px] font-bold text-neutral-600">选择环境类型</label>
                              <div className="flex bg-neutral-100 rounded-lg p-0.5 border border-neutral-200">
                                {['容器', '虚机'].map(typeOption => (
                                  <button
                                    key={typeOption}
                                    type="button"
                                    onClick={() => {
                                      const updated = [...formEnvironments];
                                      const pool = updated[idx].resourcePool;
                                      updated[idx].type = typeOption as any;
                                      // Reset type-specific fields and select default image
                                      const images = typeOption === '容器' ? CONTAINER_IMAGES[pool] : VM_IMAGES[pool];
                                      updated[idx].image = images[0];
                                      if (typeOption === '容器') {
                                        updated[idx].sourceFile = '';
                                        updated[idx].cpuCores = '2';
                                        updated[idx].memoryGB = '4';
                                        updated[idx].gpu = { power: '无', vram: '0', count: '0' };
                                        updated[idx].envVariables = [];
                                        updated[idx].startCommand = 'python main.py';
                                      } else {
                                        updated[idx].vmSpecType = 'spec';
                                        updated[idx].selectedSpec = VM_SPECS[0].value;
                                        updated[idx].storage = { type: 'SSD', systemDisk: '40', dataDisk: '100' };
                                        updated[idx].network = { vpc: 'vpc-default', subnet: 'subnet-1' };
                                        updated[idx].vncType = 'noVnc';
                                      }
                                      setFormEnvironments(updated);
                                    }}
                                    className={cn(
                                      "flex-1 py-1 text-center text-[11px] rounded-md transition-all cursor-pointer font-bold",
                                      env.type === typeOption 
                                        ? "bg-white text-[#fa541c] shadow-sm"
                                        : "text-neutral-500 hover:text-neutral-800"
                                    )}
                                  >
                                    {typeOption}
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>

                          {/* CONTAINER SPECIFIC FORM FIELDS */}
                          {env.type === '容器' && (
                            <div className="space-y-4 border-t border-neutral-100 pt-4 animate-in fade-in duration-200">
                              {/* Project Source File Upload */}
                              <div className="space-y-1.5">
                                <label className="text-[11px] font-bold text-neutral-600">项目源码 (源码包文件)</label>
                                <div className="border border-dashed border-neutral-200 hover:border-[#fa541c]/50 rounded-xl p-4 text-center space-y-2 bg-neutral-50/10 transition-all relative">
                                  <input 
                                    type="file" 
                                    accept=".zip,.tar.gz,.tgz"
                                    id={`uploader-${env.id}`}
                                    className="hidden" 
                                    onChange={(e) => {
                                      const file = e.target.files?.[0];
                                      if (file) {
                                        const updated = [...formEnvironments];
                                        updated[idx].sourceFile = file.name;
                                        setFormEnvironments(updated);
                                        showToast(`已选择源码: ${file.name}`);
                                      }
                                    }}
                                  />
                                  <label 
                                    htmlFor={`uploader-${env.id}`}
                                    className="flex flex-col items-center justify-center cursor-pointer gap-1.5"
                                  >
                                    <Upload className="w-5 h-5 text-[#fa541c]" />
                                    <span className="text-[11px] font-bold text-neutral-600">点击选择或拖拽源码文件上传</span>
                                    <span className="text-[9px] text-neutral-400">单文件上限 100MB</span>
                                  </label>
                                  {env.sourceFile && (
                                    <div className="mt-2 text-[10px] text-green-600 font-bold bg-green-50 border border-green-200 px-2.5 py-1 rounded-lg inline-block">
                                      ✓ 已就绪: {env.sourceFile}
                                    </div>
                                  )}
                                </div>
                              </div>

                              {/* Select Image */}
                              <div className="space-y-1.5">
                                <label className="text-[11px] font-bold text-neutral-600">选择容器镜像</label>
                                <select
                                  value={env.image}
                                  onChange={(e) => {
                                    const updated = [...formEnvironments];
                                    updated[idx].image = e.target.value;
                                    setFormEnvironments(updated);
                                  }}
                                  className="w-full text-xs border border-neutral-200 rounded-lg pl-3 pr-8 py-2 bg-white focus:outline-none focus:border-[#fa541c] font-mono cursor-pointer"
                                >
                                  {CONTAINER_IMAGES[env.resourcePool].map(img => (
                                    <option key={img} value={img}>{img}</option>
                                  ))}
                                </select>
                              </div>

                              {/* Resource Configuration: CPU, Memory, GPU */}
                              <div className="bg-neutral-50/50 border border-neutral-200 rounded-xl p-3 space-y-3">
                                <h5 className="text-[11px] font-bold text-neutral-700 flex items-center gap-1">
                                  <Cpu className="w-3.5 h-3.5 text-[#fa541c]" /> 资源配置
                                </h5>

                                <div className="grid grid-cols-2 gap-4">
                                  <div className="space-y-1">
                                    <span className="text-[10px] text-neutral-450 block">CPU 核数</span>
                                    <select
                                      value={env.cpuCores}
                                      onChange={(e) => {
                                        const updated = [...formEnvironments];
                                        updated[idx].cpuCores = e.target.value;
                                        setFormEnvironments(updated);
                                      }}
                                      className="w-full text-[11px] border border-neutral-200 rounded p-1 bg-white"
                                    >
                                      {['1', '2', '4', '8', '16'].map(c => (
                                        <option key={c} value={c}>{c}核</option>
                                      ))}
                                    </select>
                                  </div>

                                  <div className="space-y-1">
                                    <span className="text-[10px] text-neutral-450 block">内存 GB</span>
                                    <select
                                      value={env.memoryGB}
                                      onChange={(e) => {
                                        const updated = [...formEnvironments];
                                        updated[idx].memoryGB = e.target.value;
                                        setFormEnvironments(updated);
                                      }}
                                      className="w-full text-[11px] border border-neutral-200 rounded p-1 bg-white"
                                    >
                                      {['2', '4', '8', '16', '32', '64'].map(m => (
                                        <option key={m} value={m}>{m}GB</option>
                                      ))}
                                    </select>
                                  </div>
                                </div>

                                <div className="space-y-2 border-t border-neutral-200/60 pt-2">
                                  <span className="text-[10px] text-neutral-450 block font-bold">GPU配置</span>
                                  <div className="grid grid-cols-3 gap-2">
                                    <div>
                                      <span className="text-[9px] text-neutral-400 block">算力</span>
                                      <select
                                        value={env.gpu?.power || '无'}
                                        onChange={(e) => {
                                          const updated = [...formEnvironments];
                                          if (!updated[idx].gpu) updated[idx].gpu = { power: '无', vram: '0', count: '0' };
                                          updated[idx].gpu!.power = e.target.value;
                                          if (e.target.value === '无') {
                                            updated[idx].gpu!.vram = '无';
                                            updated[idx].gpu!.count = '0';
                                          } else if (e.target.value === 'T4') {
                                            updated[idx].gpu!.vram = '16GB';
                                            updated[idx].gpu!.count = '1';
                                          } else if (e.target.value === 'A10G') {
                                            updated[idx].gpu!.vram = '24GB';
                                            updated[idx].gpu!.count = '1';
                                          }
                                          setFormEnvironments(updated);
                                        }}
                                        className="w-full text-[10px] border border-neutral-200 rounded p-1 bg-white"
                                      >
                                        <option value="无">无 GPU</option>
                                        <option value="T4">NVIDIA T4</option>
                                        <option value="A10G">NVIDIA A10G</option>
                                      </select>
                                    </div>

                                    <div>
                                      <span className="text-[9px] text-neutral-400 block">显存</span>
                                      <select
                                        value={env.gpu?.vram || '无'}
                                        disabled={env.gpu?.power === '无'}
                                        onChange={(e) => {
                                          const updated = [...formEnvironments];
                                          updated[idx].gpu!.vram = e.target.value;
                                          setFormEnvironments(updated);
                                        }}
                                        className="w-full text-[10px] border border-neutral-200 rounded p-1 bg-white disabled:bg-neutral-100 disabled:text-neutral-400"
                                      >
                                        <option value="无">无</option>
                                        <option value="8GB">8GB</option>
                                        <option value="16GB">16GB</option>
                                        <option value="24GB">24GB</option>
                                      </select>
                                    </div>

                                    <div>
                                      <span className="text-[9px] text-neutral-400 block">卡数</span>
                                      <select
                                        value={env.gpu?.count || '0'}
                                        disabled={env.gpu?.power === '无'}
                                        onChange={(e) => {
                                          const updated = [...formEnvironments];
                                          updated[idx].gpu!.count = e.target.value;
                                          setFormEnvironments(updated);
                                        }}
                                        className="w-full text-[10px] border border-neutral-200 rounded p-1 bg-white disabled:bg-neutral-100 disabled:text-neutral-400"
                                      >
                                        <option value="0">0</option>
                                        <option value="1">1 卡</option>
                                        <option value="2">2 卡</option>
                                        <option value="4">4 卡</option>
                                      </select>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Environment Variable Configuration */}
                              <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <label className="text-[11px] font-bold text-neutral-600">环境变量配置</label>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const updated = [...formEnvironments];
                                      if (!updated[idx].envVariables) updated[idx].envVariables = [];
                                      updated[idx].envVariables!.push({ key: '', value: '' });
                                      setFormEnvironments(updated);
                                    }}
                                    className="text-[#fa541c] hover:text-[#e84a15] text-[10px] font-bold bg-transparent border-0 cursor-pointer flex items-center gap-0.5"
                                  >
                                    <Plus className="w-3 h-3" /> 添加变量
                                  </button>
                                </div>

                                <div className="space-y-2">
                                  {env.envVariables && env.envVariables.length > 0 ? (
                                    env.envVariables.map((variable, vIdx) => (
                                      <div key={vIdx} className="flex gap-2 items-center">
                                        <input
                                          type="text"
                                          placeholder="KEY (如: API_KEY)"
                                          value={variable.key}
                                          onChange={(e) => {
                                            const updated = [...formEnvironments];
                                            updated[idx].envVariables![vIdx].key = e.target.value;
                                            setFormEnvironments(updated);
                                          }}
                                          className="flex-1 text-xs border border-neutral-200 rounded px-2 py-1.5 focus:outline-none focus:border-[#fa541c] font-mono text-neutral-800"
                                        />
                                        <span className="text-neutral-400">=</span>
                                        <input
                                          type="text"
                                          placeholder="VALUE"
                                          value={variable.value}
                                          onChange={(e) => {
                                            const updated = [...formEnvironments];
                                            updated[idx].envVariables![vIdx].value = e.target.value;
                                            setFormEnvironments(updated);
                                          }}
                                          className="flex-1 text-xs border border-neutral-200 rounded px-2 py-1.5 focus:outline-none focus:border-[#fa541c] font-mono text-neutral-800"
                                        />
                                        <button
                                          type="button"
                                          onClick={() => {
                                            const updated = [...formEnvironments];
                                            updated[idx].envVariables = updated[idx].envVariables!.filter((_, i) => i !== vIdx);
                                            setFormEnvironments(updated);
                                          }}
                                          className="text-neutral-450 hover:text-red-500 p-1 cursor-pointer border-0 bg-transparent"
                                        >
                                          <X className="w-4 h-4" />
                                        </button>
                                      </div>
                                    ))
                                  ) : (
                                    <p className="text-[10px] text-neutral-400 italic">暂无环境变量，可点击右上角添加。</p>
                                  )}
                                </div>
                              </div>

                              {/* Container Start Command */}
                              <div className="space-y-1.5">
                                <label className="text-[11px] font-bold text-neutral-600">容器启动命令</label>
                                <input
                                  type="text"
                                  placeholder="例如: python main.py"
                                  value={env.startCommand || ''}
                                  onChange={(e) => {
                                    const updated = [...formEnvironments];
                                    updated[idx].startCommand = e.target.value;
                                    setFormEnvironments(updated);
                                  }}
                                  className="w-full text-xs border border-neutral-200 rounded-lg px-3 py-2 focus:outline-none focus:border-[#fa541c] font-mono text-neutral-800 bg-white"
                                />
                              </div>
                            </div>
                          )}

                          {/* VM SPECIFIC FORM FIELDS */}
                          {env.type === '虚机' && (
                            <div className="space-y-4 border-t border-neutral-100 pt-4 animate-in fade-in duration-200">
                              {/* Spec selector vs Custom */}
                              <div className="space-y-1.5">
                                <label className="text-[11px] font-bold text-neutral-600 block">算力配置</label>
                                <div className="flex bg-neutral-100 rounded-lg p-0.5 border border-neutral-200 max-w-max">
                                  {[
                                    { key: 'spec', label: '选择规格' },
                                    { key: 'custom', label: '自定义资源' }
                                  ].map(opt => (
                                    <button
                                      key={opt.key}
                                      type="button"
                                      onClick={() => {
                                        const updated = [...formEnvironments];
                                        updated[idx].vmSpecType = opt.key as any;
                                        setFormEnvironments(updated);
                                      }}
                                      className={cn(
                                        "px-3 py-1 text-center text-[10px] rounded-md transition-all cursor-pointer font-bold",
                                        env.vmSpecType === opt.key 
                                          ? "bg-white text-[#fa541c] shadow-sm"
                                          : "text-neutral-500 hover:text-neutral-800"
                                      )}
                                    >
                                      {opt.label}
                                    </button>
                                  ))}
                                </div>
                              </div>

                              {env.vmSpecType === 'spec' ? (
                                <div className="space-y-1.5">
                                  <label className="text-[11px] font-bold text-neutral-600">选择虚机规格</label>
                                  <select
                                    value={env.selectedSpec}
                                    onChange={(e) => {
                                      const updated = [...formEnvironments];
                                      updated[idx].selectedSpec = e.target.value;
                                      setFormEnvironments(updated);
                                    }}
                                    className="w-full text-xs border border-neutral-200 rounded-lg pl-3 pr-8 py-2 bg-white focus:outline-none focus:border-[#fa541c] cursor-pointer"
                                  >
                                    {VM_SPECS.map(spec => (
                                      <option key={spec.value} value={spec.value}>{spec.label}</option>
                                    ))}
                                  </select>
                                </div>
                              ) : (
                                <div className="bg-neutral-50/50 border border-neutral-200 rounded-xl p-3 space-y-3">
                                  <h5 className="text-[11px] font-bold text-neutral-700">自定义虚机规格</h5>
                                  <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                      <span className="text-[10px] text-neutral-450 block">CPU 核数</span>
                                      <select
                                        value={env.cpuCores}
                                        onChange={(e) => {
                                          const updated = [...formEnvironments];
                                          updated[idx].cpuCores = e.target.value;
                                          setFormEnvironments(updated);
                                        }}
                                        className="w-full text-[11px] border border-neutral-200 rounded p-1 bg-white"
                                      >
                                        {['1', '2', '4', '8', '16'].map(c => (
                                          <option key={c} value={c}>{c}核</option>
                                        ))}
                                      </select>
                                    </div>

                                    <div className="space-y-1">
                                      <span className="text-[10px] text-neutral-450 block">内存大小 (GB)</span>
                                      <select
                                        value={env.memoryGB}
                                        onChange={(e) => {
                                          const updated = [...formEnvironments];
                                          updated[idx].memoryGB = e.target.value;
                                          setFormEnvironments(updated);
                                        }}
                                        className="w-full text-[11px] border border-neutral-200 rounded p-1 bg-white"
                                      >
                                        {['2', '4', '8', '16', '32', '64'].map(m => (
                                          <option key={m} value={m}>{m}GB</option>
                                        ))}
                                      </select>
                                    </div>
                                  </div>

                                  <div className="space-y-2 border-t border-neutral-200/60 pt-2">
                                    <span className="text-[10px] text-neutral-450 block font-bold">GPU规格</span>
                                    <div className="grid grid-cols-3 gap-2">
                                      <div>
                                        <span className="text-[9px] text-neutral-400 block">算力</span>
                                        <select
                                          value={env.gpu?.power || '无'}
                                          onChange={(e) => {
                                            const updated = [...formEnvironments];
                                            if (!updated[idx].gpu) updated[idx].gpu = { power: '无', vram: '0', count: '0' };
                                            updated[idx].gpu!.power = e.target.value;
                                            if (e.target.value === '无') {
                                              updated[idx].gpu!.vram = '无';
                                              updated[idx].gpu!.count = '0';
                                            } else if (e.target.value === 'T4') {
                                              updated[idx].gpu!.vram = '16GB';
                                              updated[idx].gpu!.count = '1';
                                            } else if (e.target.value === 'A10G') {
                                              updated[idx].gpu!.vram = '24GB';
                                              updated[idx].gpu!.count = '1';
                                            }
                                            setFormEnvironments(updated);
                                          }}
                                          className="w-full text-[10px] border border-neutral-200 rounded p-1 bg-white"
                                        >
                                          <option value="无">无 GPU</option>
                                          <option value="T4">NVIDIA T4</option>
                                          <option value="A10G">NVIDIA A10G</option>
                                        </select>
                                      </div>

                                      <div>
                                        <span className="text-[9px] text-neutral-400 block">显存</span>
                                        <select
                                          value={env.gpu?.vram || '无'}
                                          disabled={env.gpu?.power === '无'}
                                          onChange={(e) => {
                                            const updated = [...formEnvironments];
                                            updated[idx].gpu!.vram = e.target.value;
                                            setFormEnvironments(updated);
                                          }}
                                          className="w-full text-[10px] border border-neutral-200 rounded p-1 bg-white disabled:bg-neutral-100 disabled:text-neutral-400"
                                        >
                                          <option value="无">无</option>
                                          <option value="8GB">8GB</option>
                                          <option value="16GB">16GB</option>
                                          <option value="24GB">24GB</option>
                                        </select>
                                      </div>

                                      <div>
                                        <span className="text-[9px] text-neutral-400 block">卡数</span>
                                        <select
                                          value={env.gpu?.count || '0'}
                                          disabled={env.gpu?.power === '无'}
                                          onChange={(e) => {
                                            const updated = [...formEnvironments];
                                            updated[idx].gpu!.count = e.target.value;
                                            setFormEnvironments(updated);
                                          }}
                                          className="w-full text-[10px] border border-neutral-200 rounded p-1 bg-white disabled:bg-neutral-100 disabled:text-neutral-400"
                                        >
                                          <option value="0">0</option>
                                          <option value="1">1 卡</option>
                                          <option value="2">2 卡</option>
                                          <option value="4">4 卡</option>
                                        </select>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}

                              {/* Select Image */}
                              <div className="space-y-1.5">
                                <label className="text-[11px] font-bold text-neutral-600">选择虚机镜像</label>
                                <select
                                  value={env.image}
                                  onChange={(e) => {
                                    const updated = [...formEnvironments];
                                    updated[idx].image = e.target.value;
                                    setFormEnvironments(updated);
                                  }}
                                  className="w-full text-xs border border-neutral-200 rounded-lg pl-3 pr-8 py-2 bg-white focus:outline-none focus:border-[#fa541c] font-mono cursor-pointer"
                                >
                                  {VM_IMAGES[env.resourcePool].map(img => (
                                    <option key={img} value={img}>{img}</option>
                                  ))}
                                </select>
                              </div>

                              {/* Storage configuration */}
                              <div className="bg-neutral-50/50 border border-neutral-200 rounded-xl p-3 space-y-3">
                                <h5 className="text-[11px] font-bold text-neutral-700">存储配置</h5>
                                <div className="grid grid-cols-3 gap-2">
                                  <div>
                                    <span className="text-[10px] text-neutral-450 block">存储类型</span>
                                    <select
                                      value={env.storage?.type || 'SSD'}
                                      onChange={(e) => {
                                        const updated = [...formEnvironments];
                                        if (!updated[idx].storage) updated[idx].storage = { type: 'SSD', systemDisk: '40', dataDisk: '100' };
                                        updated[idx].storage!.type = e.target.value;
                                        setFormEnvironments(updated);
                                      }}
                                      className="w-full text-[10px] border border-neutral-200 rounded p-1 bg-white"
                                    >
                                      <option value="SSD">SSD</option>
                                      <option value="HDD">HDD</option>
                                      <option value="ESSD">ESSD</option>
                                    </select>
                                  </div>

                                  <div>
                                    <span className="text-[10px] text-neutral-450 block">系统盘 (GB)</span>
                                    <input
                                      type="text"
                                      value={env.storage?.systemDisk || '40'}
                                      onChange={(e) => {
                                        const updated = [...formEnvironments];
                                        if (!updated[idx].storage) updated[idx].storage = { type: 'SSD', systemDisk: '40', dataDisk: '100' };
                                        updated[idx].storage!.systemDisk = e.target.value;
                                        setFormEnvironments(updated);
                                      }}
                                      className="w-full text-[10px] border border-neutral-200 rounded p-1 bg-white font-mono"
                                    />
                                  </div>

                                  <div>
                                    <span className="text-[10px] text-neutral-450 block">数据盘 (GB)</span>
                                    <input
                                      type="text"
                                      value={env.storage?.dataDisk || '100'}
                                      onChange={(e) => {
                                        const updated = [...formEnvironments];
                                        if (!updated[idx].storage) updated[idx].storage = { type: 'SSD', systemDisk: '40', dataDisk: '100' };
                                        updated[idx].storage!.dataDisk = e.target.value;
                                        setFormEnvironments(updated);
                                      }}
                                      className="w-full text-[10px] border border-neutral-200 rounded p-1 bg-white font-mono"
                                    />
                                  </div>
                                </div>
                              </div>

                              {/* Network Configuration */}
                              <div className="bg-neutral-50/50 border border-neutral-200 rounded-xl p-3 space-y-3">
                                <h5 className="text-[11px] font-bold text-neutral-700">网络配置</h5>
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <span className="text-[10px] text-neutral-450 block">VPC</span>
                                    <input
                                      type="text"
                                      placeholder="选择或输入VPC"
                                      value={env.network?.vpc || ''}
                                      onChange={(e) => {
                                        const updated = [...formEnvironments];
                                        if (!updated[idx].network) updated[idx].network = { vpc: '', subnet: '' };
                                        updated[idx].network!.vpc = e.target.value;
                                        setFormEnvironments(updated);
                                      }}
                                      className="w-full text-xs border border-neutral-200 rounded px-2.5 py-1 focus:outline-none focus:border-[#fa541c]"
                                    />
                                  </div>

                                  <div>
                                    <span className="text-[10px] text-neutral-450 block">子网</span>
                                    <input
                                      type="text"
                                      placeholder="选择或输入子网"
                                      value={env.network?.subnet || ''}
                                      onChange={(e) => {
                                        const updated = [...formEnvironments];
                                        if (!updated[idx].network) updated[idx].network = { vpc: '', subnet: '' };
                                        updated[idx].network!.subnet = e.target.value;
                                        setFormEnvironments(updated);
                                      }}
                                      className="w-full text-xs border border-neutral-200 rounded px-2.5 py-1 focus:outline-none focus:border-[#fa541c]"
                                    />
                                  </div>
                                </div>
                              </div>

                              {/* VNC Type */}
                              <div className="space-y-1.5">
                                <label className="text-[11px] font-bold text-neutral-600 block font-bold">VNC类型</label>
                                <div className="flex gap-4">
                                  {['caddyVnc', 'noVnc'].map(vnc => (
                                    <label
                                      key={vnc}
                                      onClick={() => {
                                        const updated = [...formEnvironments];
                                        updated[idx].vncType = vnc as any;
                                        setFormEnvironments(updated);
                                      }}
                                      className={cn(
                                        "flex-1 border py-2 rounded-lg text-center font-mono text-[11px] font-bold cursor-pointer transition-all select-none",
                                        env.vncType === vnc 
                                          ? "border-[#fa541c] text-[#fa541c] bg-[#fff2e8]/10"
                                          : "border-neutral-200 text-neutral-550 hover:bg-neutral-50"
                                      )}
                                    >
                                      {vnc}
                                    </label>
                                  ))}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>

            {/* Modal Footer - styled exactly like course modal footer */}
            <div className="p-5 border-t border-neutral-100 bg-white flex items-center justify-end gap-3 flex-shrink-0 bg-neutral-50/50">
              {activeFormTab === 'basic' ? (
                <>
                  <Button 
                    onClick={() => setShowNewProjectModal(false)} 
                    variant="outline" 
                    className="border-neutral-200 text-neutral-600 font-bold h-10 px-6 cursor-pointer bg-white text-xs"
                  >
                    取消
                  </Button>
                  <Button 
                    onClick={() => setActiveFormTab('env')} 
                    className="bg-[#fa541c] hover:bg-[#e84a15] text-white font-bold h-10 px-7 shadow-md shadow-orange-500/20 border-0 cursor-pointer text-xs"
                  >
                    下一步
                  </Button>
                </>
              ) : (
                <>
                  <Button 
                    onClick={() => setActiveFormTab('basic')} 
                    variant="outline" 
                    className="border-neutral-200 text-neutral-600 font-bold h-10 px-6 cursor-pointer bg-white mr-auto text-xs"
                  >
                    上一步
                  </Button>
                  <Button 
                    onClick={() => setShowNewProjectModal(false)} 
                    variant="outline" 
                    className="border-neutral-200 text-neutral-600 font-bold h-10 px-6 cursor-pointer bg-white text-xs"
                  >
                    取消
                  </Button>
                  <Button 
                    onClick={() => handleSave()} 
                    className="bg-[#fa541c] hover:bg-[#e84a15] text-white font-bold h-10 px-7 shadow-md shadow-orange-500/20 border-0 cursor-pointer text-xs"
                  >
                    保存
                  </Button>
                </>
              )}
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
